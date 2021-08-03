package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/johnyeocx/bool-m1/server/graph/model"
	"github.com/johnyeocx/bool-m1/server/internal/auth"
	"github.com/johnyeocx/bool-m1/server/internal/events"
	"github.com/johnyeocx/bool-m1/server/uploader"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// READ
func (r *mutationResolver) EventsFromIds(ctx context.Context, eventIds []string) ([]*model.Event, error) {
	return events.GetEventsFromIds(eventIds, client), nil
}

func (r *queryResolver) EventFromID(ctx context.Context, eventID model.MongoID) (*model.Event, error) {
	event := events.GetEventFromId(model.MongoID(eventID), client)
	return event, nil
}

func (r *queryResolver) EventsFromIds(ctx context.Context, eventIds []string) ([]*model.Event, error) {
	return events.GetEventsFromIds(eventIds, client), nil
}

// WRITE
func (r *mutationResolver) CreateEvent(ctx context.Context, input model.NewEvent) (string, error) {
	username, err := auth.ForContext(ctx)
	if err != nil {
		fmt.Println("not authenticated")
		return "not found", err
	} else {
		fmt.Println("attempting database insertion of event")
		res, _ := events.CreateEvent(input, username, client)
		return res, nil
	}
}

func (r *mutationResolver) AddPhotos(ctx context.Context, input model.AddPhotos) (string, error) {
	return events.AddPhotosToEvent(model.MongoID(input.EventID), input.PhotoUrls, client), nil
}

func (r *mutationResolver) AddUsersToEvent(ctx context.Context, input model.AddUsersToEvent) (int, error) {
	res := events.AddUsersToEvent(input, client)
	if res == -1 {
		return -1, err
	} else {
		return res, nil
	}
}


// MUTATE
func (r *mutationResolver) ChangeDisplay(ctx context.Context, input model.ChangeDisplay) (int, error) {
	return events.ChangeDisplay(input, client), nil
}

func (r *mutationResolver) ChangeDetails(ctx context.Context, input model.ChangeDetails) (int, error) {
	return events.ChangeDetails(input, client), nil
}

// GET PRE-SIGNED URL
func (r *mutationResolver) UploadPhoto(ctx context.Context, input string) ([]string, error) {
	fmt.Println("getting presigned url: upload photo")
	Id := primitive.NewObjectID()
	uploadUrl, imageUrl, err := uploader.GetPreSignedUrl(input, Id.Hex())
	if err != nil {
		return nil, err
	}
	toReturn := [...]string{uploadUrl, imageUrl}
	return toReturn[:], nil
}

func (r *mutationResolver) GetDisplayURL(ctx context.Context, input string) ([]string, error) {
	fmt.Println("getting presigned url")
	uploadUrl, imageUrl, err := uploader.GetPreSignedUrl(input, "00_display")
	if err != nil {
		return nil, err
	}
	toReturn := [...]string{uploadUrl, imageUrl}
	return toReturn[:], nil
}

