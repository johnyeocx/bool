package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"log"

	"github.com/johnyeocx/bool-m1/server/graph/model"
	"github.com/johnyeocx/bool-m1/server/internal/auth"
	"github.com/johnyeocx/bool-m1/server/internal/users"
	"github.com/johnyeocx/bool-m1/server/pkg/jwt"
)


func (r *mutationResolver) RefreshToken(ctx context.Context, input model.RefreshTokenInput) (string, error) {
	username, err := jwt.ParseToken(input.Token)
	if err != nil {
		log.Fatal(err)
	}
	token, err := jwt.GenerateToken(username)
	if err != nil {
		return "", err
	}
	return token, nil
}

func (r *mutationResolver) Authenticate(ctx context.Context) (string, error) {
	user, err := auth.ForContext(ctx)
	if err != nil {
		return "not found", err
	} else {
		return user, nil
	}
}

func (r *mutationResolver) Login(ctx context.Context, input model.Login) (string, error) {
	if users.Authenticate(input, client) {
		user := users.GetUserByUsername(input.Username, client)
		if user == nil {
			return "invalid user", errors.New("invalid user")
		}

		token, err := jwt.GenerateToken(input.Username)
		if err != nil {
			return "", err
		}
		refreshToken, err := jwt.GenerateRefreshToken(user.ID)
		if err != nil {
			return "", err
		}
		CA := auth.GetCookieAccess(ctx)
		CA.SetToken(refreshToken)
		return token, nil

	} else {
		return "", &users.WrongUsernameOrPasswordError{}
	}
}