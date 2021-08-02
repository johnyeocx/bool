package model

import (
	"github.com/99designs/gqlgen/graphql"
)

type AddPhotos struct {
	EventID   MongoID   `json:"eventId"`
	PhotoUrls []string `json:"photoUrls"`
}


type AddUsersToEvent struct {
	EventID   MongoID   `json:"eventId"`
	Usernames []string `json:"photoUrls"`
}

type Event struct {
	ID           MongoID  `json:"id" bson:"_id"`
	Creator      string  `json:"creator" bson:"creator"`
	CreationDate string   `json:"creationDate" bson:"creation_date"`
	Members      []string `json:"members" bson:"members"`
	EventDp      string   `json:"eventDP" bson:"event_img"`
	Name         string   `json:"name" bson:"name"`
	Description  string   `json:"description" bson:"description"`
	Date         string   `json:"date" bson:"date"`
	Photos       []string `json:"photos" bson:"photos"`
	Private      bool     `json:"private" bson:"private"`
}

type NewEvent struct {
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Date        string         `json:"date"`
	Members     []string       `json:"members"`
	Private     bool           `json:"private"`
	EventDp     graphql.Upload `json:"eventDP"`
}

type ChangeDisplay struct {
	EventID  MongoID `json:"eventId"`
	OldURL string `json:"oldUrl"`
	PhotoURL string  `json:"photoUrl"`
}

type ChangeDetails struct {
	EventID MongoID
	Name string `json:"name"`
	Description string `json:"description"`
}