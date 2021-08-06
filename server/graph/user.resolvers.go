package graph

import (
	"context"
	"errors"
	"fmt"

	"github.com/johnyeocx/bool-m1/server/graph/model"
	"github.com/johnyeocx/bool-m1/server/internal/users"
	"github.com/johnyeocx/bool-m1/server/pkg/jwt"
)

func (r *queryResolver) Users(ctx context.Context, userIds []model.MongoID) ([]*model.User, error) {
	return users.GetUsersByIds(userIds, client), nil
}

func (r *queryResolver) User(ctx context.Context, username string) (*model.User, error) {
	user := users.GetUserByUsername(username, client)

	fmt.Println(user)
	if user == nil {
		fmt.Println("no user error")
		return nil, errors.New("no user found")
	}
	return user, nil
}
func (r *mutationResolver) CreateUser(ctx context.Context, input model.NewUser) (string, error) {
	user, err := users.SignUp(input, client)
	if err != nil {
		return "user already exists", err
	}
	token, err := jwt.GenerateToken(user.Username)
	if err != nil {
		return "", err
	}
	return token, nil
}

func (r *mutationResolver) GetUser(ctx context.Context, input string) (*model.User, error) {
	user := users.GetUserByUsername(input, client)

	fmt.Println(user)
	if user == nil {
		fmt.Println("no user error")
		return nil, errors.New("no user found")
	}
	return user, nil
}

// Get users by id: mutation
func (r *mutationResolver) GetUsers(ctx context.Context, userIds []model.MongoID) ([]*model.User, error) {
	return users.GetUsersByIds(userIds, client), nil
}
// Get users by username: mutation
func (r *mutationResolver) GetUsersByUsernames(ctx context.Context, usernames []string) ([]*model.User, error) {
	return users.GetUsersByUsername(usernames, client), nil
}


