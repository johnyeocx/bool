package events

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/johnyeocx/bool-m1/server/graph/model"
	"github.com/johnyeocx/bool-m1/server/uploader"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// READ
func GetEventFromId(eventId model.MongoID, client *mongo.Client) (*model.Event) {
	eventsCollection := client.Database("test").Collection("events")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

	defer cancel()
	event := model.Event{}
	res := eventsCollection.FindOne(ctx, bson.M{"_id": eventId}).Decode(&event)
	if (res != nil) {
		if res == mongo.ErrNoDocuments {
			fmt.Println("not found")
			return nil
		}
	}
	return &event
}

func GetEventsFromIds(eventIds []string, client *mongo.Client) ([]*model.Event) {
	eventsCollection := client.Database("test").Collection("events")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	events := []*model.Event{}

	for i := 0 ; i < len(eventIds); i++ {
		var event model.Event
		res := eventsCollection.FindOne(ctx, bson.M{"_id": model.MongoID(eventIds[i])}).Decode(&event)
		if (res != nil) {
			if res == mongo.ErrNoDocuments {
				fmt.Println("not found")
				return nil
			}
		}
		events = append(events, &event)
	}
	
	return events
}

// WRITE
func CreateEvent(input model.NewEvent, creatorName string, client *mongo.Client) (string, error){
	EventID := primitive.NewObjectID()
	imageUrl, err := uploader.UploadEventDP(input.EventDp, EventID.Hex())
	if err != nil {
		log.Fatal(err)
	}
	
	today:= time.Now()
	today.Format("01-02-2006 15:04:05 Monday")

	eventsCollection := client.Database("test").Collection("events")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	photos := [...]string{imageUrl}
	newEvent:= model.Event {
		ID: model.MongoID(EventID.Hex()),
		Creator: creatorName,
		CreationDate: today.String(),
		Members: 	input.Members,
		Name: input.Name,
		EventDp: imageUrl,
		Description: input.Description,
		Date: input.Date,
		Photos: photos[:],
		Private: false,
	}
	defer cancel()
	_, err = eventsCollection.InsertOne(ctx, newEvent)
	if err != nil {
		log.Fatal(err)
	}
	var usersCollection = client.Database("test").Collection("users")
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := usersCollection.UpdateMany(ctx, 
		bson.M{"_id": bson.M{"$in": input.Members}},
		bson.M{
			"$push": bson.M{"events": EventID},
		},
	)
	if err != nil {
    	log.Fatal(err)
	}
	fmt.Printf("Updated %v Documents!\n", res.ModifiedCount)

	// for i := 0; i < len(input.Members); i++ {
	// 	users.UpdateEventByUserId(input.Members[i], convertedId, client)
	// }
	return "success", nil
}	

func AddPhotosToEvent(eventId model.MongoID, photos []string, client *mongo.Client) (string) {
	fmt.Println("reached here")
	eventsCollection := client.Database("test").Collection("events")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res, err := eventsCollection.UpdateOne(ctx, 
		bson.M{"_id": eventId},
		bson.M{
			"$addToSet": bson.M{"photos": bson.M{"$each": photos}},	
		},
	)
	if err != nil {
    	log.Fatal(err)
	}
	fmt.Printf("Updated %v Documents!\n", res.ModifiedCount)
	return "success"
}

// MUTATE
func AddUsersToEvent(input model.AddUsersToEvent,  client *mongo.Client) int{
	eventsCollection := client.Database("test").Collection(("events"))
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res, err := eventsCollection.UpdateOne(ctx, 
		bson.M{"_id": input.EventID, "members": bson.M{"$nin": input.UserIds}},
		bson.M{"$addToSet": bson.M{"members": bson.M{"$each": input.UserIds}}},
	)
	if err != nil {
    	log.Fatal(err)
		return -1
	}
	usersCollection := client.Database("test").Collection(("users"))
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	
	check := [...]model.MongoID {input.EventID}
	res, err = usersCollection.UpdateMany(ctx, 
		bson.M{"_id": bson.M{"$in": input.UserIds}, "events":bson.M{"$nin": check}},
		bson.M{"$push": bson.M{"events": input.EventID}},
	)

	if err != nil {
    	log.Fatal(err)
		return -1
	}
	
	if (res.ModifiedCount == 0) {
		return -1
	}
	fmt.Printf("Added %v users to an event!\n", res.ModifiedCount)
	return int(res.ModifiedCount)
}

func ChangeDisplay(input model.ChangeDisplay, client *mongo.Client) (int) {
	fmt.Println("changing display")
	eventsCollection := client.Database("test").Collection("events")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res, err := eventsCollection.UpdateOne(ctx, 
		bson.M{"_id": input.EventID},
		bson.M{
			"$set": bson.M{"event_img": input.PhotoURL},
		},
	)
	if err != nil {
    	log.Fatal(err)
	}
	uploader.DeletePhotoFromEvent(string(input.EventID),input.OldURL)
	fmt.Println("success: changed event display!!", res.ModifiedCount)
	return 0
}

func ChangeDetails(input model.ChangeDetails, client *mongo.Client)(int) {
	fmt.Println("changing details")
	eventsCollection := client.Database("test").Collection("events")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res, err := eventsCollection.UpdateOne(ctx, 
		bson.M{"_id": input.EventID},
		bson.M{
			"$set": bson.M{"name": input.Name, "description": input.Description},	
		},
	)
	if err != nil {
    	log.Fatal(err)
	}
	fmt.Println("success: changed event display!!", res.ModifiedCount)
	return 0
}



	