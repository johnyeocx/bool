package chat

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/mongo"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return r.Method == http.MethodGet
	},
}

type Chat struct {
	rooms map[string] map[string]*User
	messages  chan *Message
	join chan *User
	leave chan *User
}

func (c *Chat) Handler (w http.ResponseWriter, r *http.Request, username string, room string) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	
	user := &User {
		Username: username,
		Room: room,
		Conn: conn,
		Global: c,
	}
	c.join <- user

	user.Read()
}

func (c *Chat) Run(client *mongo.Client) {
	// fmt.Println("running")
	for {
		select {
		case user := <- c.join:
			c.add(user)
		case message := <- c.messages:
			c.broadcast(message.Room, message, client)
		case user := <-c.leave:
			c.disconnect(user)
		}
	}
}

func (c *Chat) add(user *User) {

	if room, ok := c.rooms[user.Room]; !ok {
		room := make(map[string]*User)
		room[user.Username] = user
		c.rooms[user.Room] = room
		fmt.Println("successfully added user: ", user.Username)
	} else if _,ok := room[user.Username]; !ok{
		room[user.Username] = user
		fmt.Println("successfully added user: ", user.Username)
	}
}

func (c *Chat) broadcast (room string, message *Message, client *mongo.Client) {
	users := c.rooms[room]
	for _, user := range users {
		user.Write(message)
	}
	AddMessage(message, client)
}

func (c *Chat) disconnect(user *User) {
	if _, ok := c.rooms[user.Room]; ok {
		defer user.Conn.Close()
		delete(c.rooms[user.Room], user.Username)
		body := fmt.Sprintf("%s left the chat", user.Username)
		fmt.Println(body)
	}
}

func Start(client* mongo.Client) gin.HandlerFunc {
	c := &Chat {
			rooms: 		make(map[string]map[string]*User),
			messages:   make (chan *Message),
			join: 	    make(chan *User),
			leave: 	    make (chan *User),
		}
	go c.Run(client)
	return func(g *gin.Context) {
		roomId := g.Param("roomId")
		username := g.Param("user")
		c.Handler(g.Writer, g.Request, username, roomId)
	};
}
