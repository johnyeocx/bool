package chat

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
	"github.com/johnyeocx/bool-m1/server/graph/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type User struct {
	Username string
	Conn *websocket.Conn
	Room string
	Global *Chat
}

func (u *User) Read() {
	for {
		if _, message, err := u.Conn.ReadMessage(); err != nil {
			log.Println("Error on read message:", err.Error())
			break
		} else {
			u.Global.messages <- NewMessage(string(message), u.Room, u.Username)
		}
	}
	u.Global.leave <- u
}

func (u *User) Write(message *Message) {
	b, _ := json.Marshal(message)
	if err := u.Conn.WriteMessage(websocket.TextMessage, b); err != nil {
		log.Println("Error on write message:", err.Error())
	}
}

func AddMessage (message *Message, client *mongo.Client) int {
	var chatsCollection = client.Database("test").Collection("chats")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res := chatsCollection.FindOne(ctx, bson.M{"event": model.MongoID(message.Room), "active": true})
	
	var bucket model.Chat
	newMessage := model.Message {
		ID: string(message.ID),
		MessageType: 0,
		Body: message.Body,
		Sender: message.Sender,
		Room: message.Room,
	}
	if res.Err() == nil {
		res.Decode(&bucket)
		if (bucket.Count == 50) {
			var newMessages [50]model.Message
			newMessages[0] = newMessage
			newBucket := model.Chat {
				ID: model.MongoID(primitive.NewObjectID().Hex()),
				Event: model.MongoID(message.Room),
				Messages: newMessages,
				Count: 1,
				Bucket: bucket.Bucket + 1,
				Active: true,
			}
			_, err := chatsCollection.InsertOne(ctx, newBucket)
			if err != nil {
				log.Fatal(err)
			}
			chatsCollection.UpdateOne(
				ctx, 
				bson.M{"_id": bucket.ID}, 
				bson.M{"$set": 
					bson.M{"active": false},
				})
			fmt.Println("old bucket full, created new bucket")
			return 0
		} else {
			updateString := "messages." + strconv.Itoa(bucket.Count)
			chatsCollection.UpdateOne(ctx, bson.M{"_id": bucket.ID}, bson.M{"$set": bson.M{updateString : newMessage, "count": bucket.Count + 1}})
			fmt.Println("added to existing bucket")
		}
	} else if res.Err() == mongo.ErrNoDocuments{
		var emptyMessages [50]model.Message
		emptyMessages[0] = newMessage
		newID := primitive.NewObjectID().Hex()
		newBucket := model.Chat {
			ID: model.MongoID(newID),
			Event: model.MongoID(message.Room),
			Messages: emptyMessages,
			Count: 1,
			Bucket: 0,
			Active: true,
		}
		_, err := chatsCollection.InsertOne(ctx, newBucket)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Printf("creating new bucket\n")
		return 0
	} else {
		fmt.Println("failed")
		return 1
	}
	return 0
}

func ReadMessages (event model.MongoID, client *mongo.Client) []*model.Chat {
	
	var chatsCollection = client.Database("test").Collection("chats")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	buckets := []*model.Chat{}

	cursor, err := chatsCollection.Find(ctx, bson.M{"event": event})
	if err != nil {
    	log.Fatal(err)
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var bucket model.Chat
		if err = cursor.Decode(&bucket); err != nil {
			log.Fatal(err)
		}
		buckets = append(buckets, &bucket)
	}
	fmt.Println(buckets)
	return buckets
}