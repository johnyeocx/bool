package users

import (
	"context"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/johnyeocx/bool-m1/server/graph/model"
	"github.com/johnyeocx/bool-m1/server/uploader"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type WrongUsernameOrPasswordError struct{}

func (m *WrongUsernameOrPasswordError) Error() string {
	return "wrong username or password"
}

// CREATE
func SignUp(input model.NewUser, client *mongo.Client) (*model.User, error){
	check := GetUserByUsername(input.Username, client) 
	if (check != nil) {
		return nil, errors.New("user already exists")
	}
	fmt.Println("user does not exist, can create, attempting creation")
	err := uploader.UploadProfileImg(input.ProfileImg, input.Username)
	if err != nil {
		log.Fatal(err)
	}
	
	//create new settings
	settings:= model.NewSetting{
		Private: false,
	}
	settingsCollection := client.Database("test").Collection("settings")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res, err := settingsCollection.InsertOne(ctx, settings)
	if err != nil {
		log.Fatal(err)
	}
	settingsID := model.MongoID(res.InsertedID.(primitive.ObjectID).Hex())
	hashedPassword, err := HashPassword(input.Password)
	if err != nil {
		log.Fatal(err)
	}

	
	fileName := "https://bool-m1.s3-ap-southeast-1.amazonaws.com/profileImages/" + input.Username
	// insert user
	emptyArray := &[]model.MongoID{}
	emptyFriendships := &[]model.MongoID{}
	user := struct {
		Username string
		Email string
		Password string
		SettingsID model.MongoID
		ProfileImg string
		Events 	*[]model.MongoID
		Friendships *[]model.MongoID
	}{
		Username: input.Username,
		Email: input.Email,
		Password: hashedPassword,
		SettingsID: settingsID,
		ProfileImg:  fileName,
		Events: emptyArray,
		Friendships: emptyFriendships,
	}

	usersCollection := client.Database("test").Collection("users")
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res, err = usersCollection.InsertOne(ctx, user)
	if err != nil {
		log.Fatal(err)
	}

	userID := model.MongoID(res.InsertedID.(primitive.ObjectID).Hex())

	return &model.User {
		ID: userID,
		Username: input.Username,
		Email: input.Email,
		Password: hashedPassword,
		ProfileImg: fileName,
		SettingsID: settingsID,
		Events: *emptyArray,
	}, nil
}	

// READ
func GetUserById(id model.MongoID, client *mongo.Client) (*model.User) {
	var usersCollection = client.Database("test").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	user := model.User{}
	res := usersCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&user)
	if (res != nil) {
		if res == mongo.ErrNoDocuments {
			fmt.Println("not found")
			return nil
		}
	}
	return &user
}
func GetUsersByIds(ids []model.MongoID, client *mongo.Client) ([]*model.User) {
	userCollection := client.Database("test").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	users := []*model.User{}
	cursor, err := userCollection.Find(ctx, bson.M{"_id": bson.M{"$in": ids}})
	if err != nil {
    	log.Fatal(err)
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var user model.User
		if err = cursor.Decode(&user); err != nil {
			log.Fatal(err)
		}
		users = append(users, &user)
	}
	return users
}
func GetUserByUsername(username string, client *mongo.Client) (*model.User){

	var usersCollection = client.Database("test").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	user := model.User{}
	res := usersCollection.FindOne(ctx, bson.M{"username": username}).Decode(&user)
	if (res != nil) {
		if res == mongo.ErrNoDocuments {
			fmt.Println("not found")
			return nil
		}
	}
	return &user
}	
func GetUsersByUsername(usernames []string, client *mongo.Client) ([]*model.User) {
	userCollection := client.Database("test").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	users := []*model.User{}
	cursor, err := userCollection.Find(ctx, bson.M{"username": bson.M{"$in": usernames}})
	if err != nil {
    	log.Fatal(err)
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var user model.User
		if err = cursor.Decode(&user); err != nil {
			log.Fatal(err)
		}
		users = append(users, &user)
	}
	return users
}

// UPDATE
func UpdateEventByUserId(userId model.MongoID, eventId model.MongoID, client *mongo.Client) error {
	var usersCollection = client.Database("test").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := usersCollection.UpdateOne(ctx, 
		bson.M{"_id": userId},
		bson.M{
			"$push": bson.M{"events": eventId},
		},
	)
	if err != nil {
    	log.Fatal(err)
	}
	fmt.Printf("Updated %v Documents!\n", res.ModifiedCount)
	return nil
}

// UTILS
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func Authenticate(input model.Login, client *mongo.Client) bool {
	var usersCollection = client.Database("test").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	var user *model.User
	res := usersCollection.FindOne(ctx, bson.M{"username": input.Username})
	res.Decode(&user)
	return CheckPasswordHash(input.Password, user.Password)
}