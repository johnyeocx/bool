package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-gonic/gin"
	"github.com/johnyeocx/bool-m1/server/database"
	"github.com/johnyeocx/bool-m1/server/graph"
	"github.com/johnyeocx/bool-m1/server/graph/generated"
	"github.com/johnyeocx/bool-m1/server/internal/auth"
	"github.com/johnyeocx/bool-m1/server/internal/chat"
	"github.com/johnyeocx/bool-m1/server/internal/users"
	"github.com/johnyeocx/bool-m1/server/pkg/jwt"
	"go.mongodb.org/mongo-driver/mongo"
)



const defaultPort = "8080"

func main() {

	// port := os.Getenv("PORT")
	// if port == "" {
	// 	port = defaultPort
	// }

	client, err := database.GetMongoClient()

	if err != nil {
		log.Fatal(err)
	}

	router := gin.Default()
	router.Use(CORSMiddleware())
	router.Use(auth.AuthMiddleWare(client))
	router.Use(auth.CookieMiddleware())

	router.POST("/query", graphqlHandler())
	router.GET("/", playgroundHandler())
	router.POST("/refresh_token", refreshToken(client))
	router.GET("/ws/:roomId/:user", chat.Start(client));
	router.Run(":8080")

	// chat server
	
	log.Print("Server starting at localhost:4444")
	if err := http.ListenAndServe(":4444", nil); err != nil {
		log.Fatal(err)
	}
}

func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}

func graphqlHandler() gin.HandlerFunc {
    // NewExecutableSchema and Config are in the generated.go file
    // Resolver is in the resolver.go file
	h := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

func playgroundHandler() gin.HandlerFunc {
	h := playground.Handler("GraphQL", "/query")

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

func refreshToken(client *mongo.Client) gin.HandlerFunc {
	return func (c *gin.Context) {
		token, err := c.Request.Cookie("jid")
		if err != nil {
			fmt.Println("no cookie")
			c.JSON(404, "not found")
		}
		fmt.Println("token value: " + token.Value)
		userId, err := jwt.ParseRefreshToken(token.Value)
		if err != nil {
			c.JSON(404, map[string]string{ "ok": "false", "accessToken": ""})
		}
		user := users.GetUserById(userId, client)
		newAccessToken, err := jwt.GenerateToken(user.Username)
		if err != nil {
			c.JSON(404, map[string]string{ "ok": "false", "accessToken": ""})
		}
		c.JSON(200, map[string]string{ "ok": "true", "accessToken": newAccessToken})
	}
}
