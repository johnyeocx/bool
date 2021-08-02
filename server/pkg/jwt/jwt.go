package jwt

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/johnyeocx/bool-m1/server/graph/model"
)

var (
	SecretKey = []byte("secret")
	RefreshSecretKey = []byte("refresh")
)

func GenerateToken(username string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["username"] = username
	claims["exp"] = time.Now().Add(time.Hour * 3).Unix()

	tokenString, err := token.SignedString(SecretKey)
	
	if err!= nil {
		return "", err
	}
	return tokenString, nil
}

func GenerateRefreshToken(username model.MongoID) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["userid"] = username
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	tokenString, err := token.SignedString(RefreshSecretKey)
	
	if err!= nil {
		return "", err
	}
	return tokenString, nil
}

func ParseToken(tokenStr string) (string, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return SecretKey, nil
	})
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		username := claims["username"].(string)
		return username, nil
	} else {
		return "", err
	}
}

func ParseRefreshToken(tokenStr string) (model.MongoID, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return RefreshSecretKey, nil
	})
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userId := claims["userid"].(string)
		return model.MongoID(userId), nil
	} else {
		return "", err
	}
}


