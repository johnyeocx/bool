package model

type Message struct {
	ID string `json:"id"`
	MessageType int `json:"messagetype"`
	Body string `json:"body"`
	Room string `json:"room"`
	Sender string `json:"sender"`
}

type Chat struct {
	ID MongoID  `json:"id" bson:"_id"`
	Event MongoID `json:"event" bson:"event"`
	Messages [50]Message `json:"messages" bson:"messages"`
	Count int `json:"count" bson:"count"`
	Bucket int `json:"bucket" bson:"bucket"`
	Active bool `json:"active" bson:"active"`
}