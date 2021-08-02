package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/johnyeocx/bool-m1/server/graph/generated"
	"github.com/johnyeocx/bool-m1/server/graph/model"
	"github.com/johnyeocx/bool-m1/server/internal/chat"
)


func (r *mutationResolver) ChatBuckets(ctx context.Context, eventID model.MongoID) ([]*model.Chat, error) {
	fmt.Println("retrieving messages")
	return chat.ReadMessages(eventID, client), nil
}

func (r *chatResolver) EventID(ctx context.Context, obj *model.Chat) (model.MongoID, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *chatResolver) Messages(ctx context.Context, obj *model.Chat) ([]*model.Message, error) {
	var messages [50]*model.Message
	for i := range messages {
		messages[i] = &obj.Messages[i]
	}
	return messages[:], nil
}

// Chat returns generated.ChatResolver implementation.
func (r *Resolver) Chat() generated.ChatResolver { return &chatResolver{r} }
