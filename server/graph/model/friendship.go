package model

type Friendship struct {
	ID           MongoID `json:"id" bson:"_id"`
	SourceID     MongoID `json:"sourceId" bson:"source"`
	TargetID     MongoID `json:"targetId" bson:"target"`
	SourceName     string `json:"sourcename" bson:"sourcename"`
	TargetName     string `json:"targetname" bson:"targetname"`
	Status       bool    `json:"status" bson:"status"`
	CreationDate string  `json:"creationDate" bson:"creationdate"`
}

type NewFriendship struct {
	SourceID string `json:"sourceId"`
	TargetID string `json:"targetId"`
}