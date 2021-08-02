// package main

// import (
// 	"fmt"
// 	"log"
// 	"os"

// 	"github.com/aws/aws-sdk-go/aws"
// 	"github.com/aws/aws-sdk-go/aws/credentials"
// 	"github.com/aws/aws-sdk-go/aws/session"
// 	"github.com/aws/aws-sdk-go/service/s3"
// 	"github.com/aws/aws-sdk-go/service/s3/s3manager"
// 	"github.com/gin-gonic/gin"
// 	"github.com/joho/godotenv"
// )

// var (
// 	AccessKeyID string
// 	SecretAccessKey string
// 	MyRegion string
// 	filepath string
// 	s3session *s3.S3
// )


// func exitErrorf(msg string, args ...interface{}) {
//     fmt.Fprintf(os.Stderr, msg+"\n", args...)
//     os.Exit(1)
// }



// //GetEnvWithKey : get env value
// func GetEnvWithKey(key string) string {
//  	return os.Getenv(key)
// }

// func LoadEnv() {
//  	err := godotenv.Load(".env")
//  	if err != nil {
//   	log.Fatalf("Error loading .env file")
//   	os.Exit(1)
//  }
// }

// func UploadFile() {
// 	if len(os.Args) != 3 {
//     exitErrorf("bucket and file name required\nUsage: %s bucket_name filename",
//         os.Args[0])
// 	}

// 	bucket := os.Args[1]
// 	filename := os.Args[2]

// 	file, err := os.Open(filename)
// 	if err != nil {
//     	exitErrorf("Unable to open file %q, %v", err)
// 	}

// 	defer file.Close()

// 	sess := ConnectAWS()
// 	uploader := s3manager.NewUploader(sess)

// 	_, err = uploader.Upload(&s3manager.UploadInput{
//     Bucket: aws.String(bucket),
//     Key: aws.String(filename),
//     Body: file,
// 	})
// 	if err != nil {
//     // Print the error and exit.
//     exitErrorf("Unable to upload %q to %q, %v", filename, bucket, err)
// 	}

// 	fmt.Printf("Successfully uploaded %q to %q\n", filename, bucket)
// }

// func ListBuckets() {
// 	sess := ConnectAWS()
// 	svc := s3.New(sess)
// 	result, err := svc.ListBuckets(nil)
// 	if err != nil {
//     	exitErrorf("Unable to list buckets, %v", err)
// 	}

// 	fmt.Println("Buckets:")

// 	for _, b := range result.Buckets {
//     	fmt.Printf("* %s created on %s\n",
//         aws.StringValue(b.Name), aws.TimeValue(b.CreationDate))
// 	}
// }

// func UploadImage(c *gin.Context) {
// 	sess := c.MustGet("sess").(*session.Session)
// 	uploader := s3manager.NewUploader(sess)
// 	var MyBucket = GetEnvWithKey("BUCKET_NAME")
// 	fmt.Println(MyBucket)
// 	file, header, err := c.Request.FormFile("photo")
// 	filename:= header.Filename
// 	fmt.Println(file)
// 	os.Open(filename)

// 	_, err = uploader.Upload(&s3manager.UploadInput{
//     Bucket: aws.String(MyBucket),
//     Key: aws.String(filename),
//     Body: file,
// 	})
	
// 	if err != nil {
//     // Print the error and exit.
//     exitErrorf("Unable to upload %q to %q, %v", filename, MyBucket, err)
// 	}
// 	fmt.Printf("Successfully uploaded %q to %q\n", filename, MyBucket)

// 	// if err != nil {
// 	// 	c.JSON(http.StatusInternalServerError, gin.H {
// 	// 		"error": "Failed to upload file", 
// 	// 		"uploader": up,
// 	// 	})
// 	// 	return
// 	// }
// 	// filepath = "https://" + MyBucket + "." + "s3-" + MyRegion + ".amazonaws.com/" + filename
// 	// c.JSON(http.StatusOK, gin.H{
// 	// 	"filepath": filepath, 
// 	// })
// }


// func ConnectAWS() *session.Session {
// 	AccessKeyID = GetEnvWithKey("AWS_ACCESS_KEY_ID")
// 	SecretAccessKey = GetEnvWithKey("AWS_SECRET_ACCESS_KEY")
// 	MyRegion = GetEnvWithKey("AWS_REGION")

// 	sess, err := session.NewSession(
// 		&aws.Config{
// 			Region: aws.String(MyRegion),
// 			Credentials: credentials.NewStaticCredentials(
// 				AccessKeyID,
// 				SecretAccessKey,
// 				"",
// 			),
// 		},
// 	)

// 	if err != nil {
// 		panic(err)
// 	}

// 	return sess
// }