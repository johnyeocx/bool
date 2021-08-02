package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/johnyeocx/bool-m1/server/graph/generated"
	"github.com/johnyeocx/bool-m1/server/graph/model"
	"github.com/johnyeocx/bool-m1/server/internal/friendships"
)
func (r *mutationResolver) AddFriend(ctx context.Context, input model.NewFriendship) (string, error) {
	return friendships.AddFriendById(input, client), nil
}


func (r *queryResolver) FriendshipsToAdd(ctx context.Context, userID model.MongoID) ([]*model.Friendship, error) {
	return friendships.ToAdd(model.MongoID(userID), client), nil
}

func (r *queryResolver) FriendshipsAwaitingAdd(ctx context.Context, userID model.MongoID) ([]*model.Friendship, error) {
	return friendships.AwaitingAdd(model.MongoID(userID), client), nil
}


func (r *queryResolver) Hello(ctx context.Context) (string, error) {
	return "Hello World", nil
}

func (r *friendshipResolver) SourceID(ctx context.Context, obj *model.Friendship) (string, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *friendshipResolver) TargetID(ctx context.Context, obj *model.Friendship) (string, error) {
	panic(fmt.Errorf("not implemented"))
}

// Friendship returns generated.FriendshipResolver implementation.
func (r *Resolver) Friendship() generated.FriendshipResolver { return &friendshipResolver{r} }
