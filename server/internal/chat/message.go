package chat

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)


type Message struct {
	ID string `json:"id"`
	MessageType int `json:"messagetype"`
	Body string `json:"body"`
	Room string `json:"room"`
	Sender string `json:"sender"`
}

func NewMessage(body string, room string, sender string) *Message {
	return &Message {
		ID: primitive.NewObjectID().Hex(),
		Body: body,
		Room: room,
		Sender: sender,
	}
}