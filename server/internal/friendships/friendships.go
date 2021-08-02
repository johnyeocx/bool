package friendships

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/johnyeocx/bool-m1/server/graph/model"
	"github.com/johnyeocx/bool-m1/server/internal/users"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// func GetFriendshipsFromId(username string, client *mongo.Client) ([]*model.Friendship){
// 	var friendshipsCollection = client.Database("test").Collection("friendships")
// 	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
// 	defer cancel()
// 	// user := model.User{}
// 	user:= users.GetUserByUsername(username, client)
// 	friendships := user.Friendships
// 	friends := []*model.Friendship{}
// 	cursor, err := friendshipsCollection.Find(ctx, bson.M{"_id": bson.M{"$in": friendships}})
// 	if err != nil {
//     	log.Fatal(err)
// 	}
// 	defer cursor.Close(ctx)
// 	for cursor.Next(ctx) {
// 		var friendship model.Friendship
// 		if err = cursor.Decode(&friendship); err != nil {
// 			log.Fatal(err)
// 		}
// 		friends = append(friends, &friendship)
// 	}
// 	return friends
// }

// func GetFriends(username string, client *mongo.Client) ([]*model.User){
// 	// get array of friends' ids
// 	addresses := GetFriendshipsFromId(username, client)
// 	var friendshipIds []model.MongoID
// 	for i := range addresses {
// 		friendship := *addresses[i]
// 		if friendship.SourceName == username {
// 			friendshipIds = append(friendshipIds, model.MongoID(friendship.TargetID))
// 		} else {
// 			friendshipIds = append(friendshipIds, model.MongoID(friendship.SourceID))
// 		}
// 	}
// 	// get friend information
// 	userCollection := client.Database("test").Collection("users")
// 	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
// 	defer cancel()
// 	users := []*model.User{}
// 	cursor, err := userCollection.Find(ctx, bson.M{"_id": bson.M{"$in": friendshipIds}})
// 	if err != nil {
//     	log.Fatal(err)
// 	}
// 	defer cursor.Close(ctx)
// 	for cursor.Next(ctx) {
// 		var user model.User
// 		if err = cursor.Decode(&user); err != nil {
// 			log.Fatal(err)
// 		}
// 		users = append(users, &user)
// 	}
// 	return users
// }

func ToAdd(userId model.MongoID, client *mongo.Client) ([]*model.Friendship){
	var friendshipsCollection = client.Database("test").Collection("friendships")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	// user := model.User{}
	friends := []*model.Friendship{}
	cursor, err := friendshipsCollection.Find(ctx, bson.M{"target": userId, "status": false})
	if err != nil {
    log.Fatal(err)
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var friendship model.Friendship
		if err = cursor.Decode(&friendship); err != nil {
			log.Fatal(err)
		}
		friends = append(friends, &friendship)
		fmt.Println(friendship)
	}
	fmt.Println(friends)
	return friends
}

func AwaitingAdd(userId model.MongoID, client *mongo.Client) ([]*model.Friendship){
	var friendshipsCollection = client.Database("test").Collection("friendships")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	// user := model.User{}
	friends := []*model.Friendship{}
	cursor, err := friendshipsCollection.Find(ctx, bson.M{"source": userId, "status": false})
	if err != nil {
    log.Fatal(err)
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var friendship model.Friendship
		if err = cursor.Decode(&friendship); err != nil {
			log.Fatal(err)
		}
		friends = append(friends, &friendship)
		fmt.Println(friendship)
	}
	fmt.Println(friends)
	return friends
}

func AddFriendById(input model.NewFriendship, client *mongo.Client) (string){
	var friendshipsCollection = client.Database("test").Collection("friendships")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	
	// Check if need to add back
	var existingFriendship model.Friendship
	res := friendshipsCollection.FindOneAndUpdate(ctx, 
		bson.M{"source": model.MongoID(input.TargetID), "target": model.MongoID(input.SourceID)},
		bson.M{
			"$set": bson.M{"status": true},	
		},
	); 
	if res.Err() == nil {
		res.Decode(&existingFriendship)
		fmt.Println(existingFriendship)
		var usersCollection = client.Database("test").Collection("users")
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_, err := usersCollection.UpdateOne(ctx, 
		bson.M{"_id": model.MongoID(input.SourceID)},
		bson.M{
			"$addToSet": bson.M{"friendships": input.TargetID},	
		})
		if err != nil {
    	log.Fatal(err)
		}
		_, err = usersCollection.UpdateOne(ctx, 
		bson.M{"_id": model.MongoID(input.TargetID)},
		bson.M{
			"$addToSet": bson.M{"friendships": input.SourceID},	
		})
		if err != nil {
    		log.Fatal(err)
		}
		return "added back"
	} else if res.Err() == mongo.ErrNoDocuments{
		var existingFriendship model.Friendship
		if err := friendshipsCollection.FindOne(ctx, bson.M{"source": model.MongoID(input.SourceID), "target": model.MongoID(input.SourceID)}).Decode(&existingFriendship); err != nil {
			today:= time.Now()
			today.Format("01-02-2006 15:04:05 Monday")
			newFriendship := model.Friendship{
				ID: model.MongoID(primitive.NewObjectID().Hex()),
				SourceID: model.MongoID(input.SourceID),
				TargetID: model.MongoID(input.TargetID),
				SourceName: users.GetUserById(model.MongoID(input.SourceID), client).Username,
				TargetName: users.GetUserById(model.MongoID(input.TargetID), client).Username,
				Status: false,
				CreationDate: today.String(),
			}
			_, err := friendshipsCollection.InsertOne(ctx, newFriendship)
			if err != nil {
				log.Fatal(err)
			}
			fmt.Println(existingFriendship)
			return "created new friendship"
		}
		return "already added"
	} else {
		return ("error in adding friend:" + res.Err().Error())
	}
}	