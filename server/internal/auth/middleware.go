package auth

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/johnyeocx/bool-m1/server/graph/model"
	"github.com/johnyeocx/bool-m1/server/pkg/jwt"
	"go.mongodb.org/mongo-driver/mongo"
)



type contextKey struct {
	name string
}

type CookieAccess struct {
	Writer	http.ResponseWriter
	userId	model.MongoID
	IsLoggedIn bool
}

var userCtxKey = &contextKey{"username"}
var cookieName = "jid"
var cookieAccessKeyCtx = "userid"

func (CA *CookieAccess) SetToken(token string) {
	http.SetCookie(CA.Writer, &http.Cookie{
		Name: cookieName,
		Value: token,
		HttpOnly: true,
		Path: "/",
		Expires: time.Now().Add(time.Hour * 3),
	})
}

func extractUserId(ctx *gin.Context) (model.MongoID, error) {
	c, err := ctx.Request.Cookie(cookieName)
	if err != nil {
		return "nil", errors.New("There is no token in cookies")
	}

	userId, err := jwt.ParseToken(c.Value)
	if err != nil {
		return "nil", err
	}
	return model.MongoID(userId), nil
}

func setValInCtx(ctx *gin.Context, val interface{}) {
	newCtx := context.WithValue(ctx.Request.Context(), cookieAccessKeyCtx, val)
	ctx.Request = ctx.Request.WithContext(newCtx)
}

func CookieMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		cookieA := CookieAccess {
			Writer: ctx.Writer,
		}
		
		setValInCtx(ctx, &cookieA)

		userId, err := extractUserId(ctx)
		if err != nil {
			cookieA.IsLoggedIn = false
			ctx.Next()
		}

		cookieA.userId = userId
		cookieA.IsLoggedIn = true

		ctx.Next()
	}
}

func AuthMiddleWare(client *mongo.Client) gin.HandlerFunc {
	return func (ctx *gin.Context) {
		header := ctx.GetHeader("authorization")

		if header == "" {
			ctx.Next()
			return
		}

		tokenStr := header
		username, err := jwt.ParseToken(tokenStr)
		if err != nil {
			fmt.Println("invalid token")
			return
		}

		// splitToken := strings.Split(username, "Bearer ")
		// username = splitToken[1]
		// fmt.Println("username is " + username)

		// user := users.GetUserByUsername(username, client)
		// if user == nil {
		// 	ctx.Next()
		// 	return
		// }
		fmt.Println("putting into context: " + username)
		newCtx := context.WithValue(ctx.Request.Context(), userCtxKey, username)
		ctx.Request = ctx.Request.WithContext(newCtx)
		ctx.Next()
	}
}

func Middleware(client *mongo.Client) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("authorization")
			fmt.Println(header)
			if header == "" {
				next.ServeHTTP(w, r)
				return
			}

			tokenStr := header
			username, err := jwt.ParseToken(tokenStr)
			if err != nil {
				http.Error(w, "Invalid token", http.StatusForbidden)
				return
			}
			
			// user := model.User{Username: username}
			// user := users.GetUserByUsername(username, client)
			// if user == nil {
			// 	next.ServeHTTP(w, r)
			// 	return
			// }
			fmt.Println(username)
			ctx := context.WithValue(r.Context(), userCtxKey, string(username))
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

func ForContext(ctx context.Context) (string, error){
	if raw, _ := ctx.Value(userCtxKey).(string); raw != ""{
		fmt.Println("from context: " + raw)
		return raw, nil
	}
	fmt.Println("Not Found")
	return "", errors.New("no context error") 
}

func GetCookieAccess(ctx context.Context) *CookieAccess {
    return ctx.Value(cookieAccessKeyCtx).(*CookieAccess)
}