package model

import "github.com/99designs/gqlgen/graphql"

// users
type User struct {
	ID         MongoID `json:"id" bson:"_id"`
	Username   string  `json:"username" bson:"username"`
	Email      string  `json:"email" bson:"email"`
	Password   string  `json:"password" bson:"password"`
	ProfileImg string `json:"profileimg" bson:"profileimg"`
	SettingsID MongoID `json:"settingsid" bson:"settingsid"`
	Events 	 []MongoID `json:"events" bson:"events"`
	Friendships []MongoID `json:"friendships" bson:"friendships"`
}

type NewUser struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
	ProfileImg graphql.Upload `json:"profileimg" bson:"profileimg"`
	SettingsID MongoID `json:"settingsid" bson:"settingsid"`
}

// user_settings
type UserSetting struct {
	ID      MongoID `json:"id"`
	Private bool    `json:"private"`
}

type NewSetting struct {
	Private bool
}

//login
type Login struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type RefreshTokenInput struct {
	Token string `json:"token"`
}

