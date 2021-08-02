package database

import (
	"context"
	"sync"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

/* Used to create a singleton object of MongoDB client.
Initialized and exposed through  GetMongoClient().*/
var clientInstance *mongo.Client
//Used during creation of singleton client object in GetMongoClient().
var clientInstanceError error
//Used to execute client creation procedure only once.
var mongoOnce sync.Once
//I have used below constants just to hold required database config's.
const (
	CONNECTIONSTRING = "mongodb+srv://johnyeocx:jjoohhnn@cluster0.veuqz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
	DB               = "db_issue_manager"
	ISSUES           = "col_issues"
)

func GetMongoClient() (*mongo.Client, error) {
	//Perform connection creation operation only once.
	mongoOnce.Do(func() {
		// Set client options
		clientOptions := options.Client().ApplyURI(CONNECTIONSTRING)
		// Connect to MongoDB
		client, err := mongo.Connect(context.TODO(), clientOptions)
		if err != nil {
			clientInstanceError = err
		}
		// Check the connection
		err = client.Ping(context.TODO(), nil)
		if err != nil {
			clientInstanceError = err
		}
		
		clientInstance = client
	})
	return clientInstance, clientInstanceError
}

// type DB struct {
// 	client *mongo.Client
// }



// func Connect() *DB{
// 	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
// 	defer cancel()
// 	client, err := mongo.Connect(ctx, options.Client().ApplyURI(dbUrl))
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	return &DB {
// 		client: client,
// 	}
// }

// func (db *DB) Client() *mongo.Client {
// 	return db.client
// }

