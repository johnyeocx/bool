package uploader

import (
	"bytes"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/joho/godotenv"
)

var (
	AccessKeyID string
	SecretAccessKey string
	MyRegion string
	filepath string
	s3session *s3.S3
)


func exitErrorf(msg string, args ...interface{}) {
    fmt.Fprintf(os.Stderr, msg+"\n", args...)
    os.Exit(1)
}

//GetEnvWithKey : get env value
func GetEnvWithKey(key string) string {
 	return os.Getenv(key)
}

func LoadEnv() {
 	err := godotenv.Load(".env")
 	if err != nil {
  	log.Fatalf("Error loading .env file")
  	os.Exit(1)
 }
}

func UploadFile() {
	if len(os.Args) != 3 {
    exitErrorf("bucket and file name required\nUsage: %s bucket_name filename",
        os.Args[0])
	}

	bucket := os.Args[1]
	filename := os.Args[2]

	file, err := os.Open(filename)
	if err != nil {
    	exitErrorf("Unable to open file %q, %v", err)
	}

	defer file.Close()

	sess := ConnectAWS()
	uploader := s3manager.NewUploader(sess)

	_, err = uploader.Upload(&s3manager.UploadInput{
    Bucket: aws.String(bucket),
    Key: aws.String(filename),
    Body: file,
	})
	if err != nil {
    // Print the error and exit.
    exitErrorf("Unable to upload %q to %q, %v", filename, bucket, err)
	}

	fmt.Printf("Successfully uploaded %q to %q\n", filename, bucket)
}

func ListBuckets() {
	sess := ConnectAWS()
	svc := s3.New(sess)
	result, err := svc.ListBuckets(nil)
	if err != nil {
    	exitErrorf("Unable to list buckets, %v", err)
	}

	fmt.Println("Buckets:")

	for _, b := range result.Buckets {
    	fmt.Printf("* %s created on %s\n",
        aws.StringValue(b.Name), aws.TimeValue(b.CreationDate))
	}
}

func UploadProfileImg(file graphql.Upload, username string) error {
	var size int64 = file.Size
	buffer:= make([]byte, size)

	file.File.Read(buffer)
	fileBytes :=bytes.NewReader(buffer)
	fileType := http.DetectContentType(buffer)
	fmt.Println(fileType)

	if !strings.HasPrefix(fileType, "image") {
		return errors.New("file uploaded is not an image")
	}

	sess := ConnectAWS()
	uploader := s3manager.NewUploader(sess)
	var MyBucket = GetEnvWithKey("BUCKET_NAME")
	
	_, err := uploader.Upload(&s3manager.UploadInput{
    Bucket: aws.String(MyBucket),
    Key: aws.String("./profileImages/"+ username),
    Body: fileBytes,
	ContentType: aws.String(fileType),
	})
	
	if err != nil {
    	exitErrorf("Unable to upload %q to %q, %v", file.Filename, MyBucket, err)
		return err
	}
	fmt.Printf("Successfully uploaded %q to %q\n", file.Filename, MyBucket)
	return nil
}

func UploadEventDP(file graphql.Upload, eventId string) (string, error) {
	var size int64 = file.Size
	buffer:= make([]byte, size)

	file.File.Read(buffer)
	fileBytes :=bytes.NewReader(buffer)
	fileType := http.DetectContentType(buffer)
	fmt.Println(fileType)

	if !strings.HasPrefix(fileType, "image/") {
		return "nil", errors.New("file uploaded is not an image")
	}

	sess := ConnectAWS()
	uploader := s3manager.NewUploader(sess)
	var MyBucket = GetEnvWithKey("BUCKET_NAME")
	
	_, err := uploader.Upload(&s3manager.UploadInput{
    Bucket: aws.String(MyBucket),
    Key: aws.String("./events/"+ eventId + "/00_display"),
    Body: fileBytes,
	ContentType: aws.String(fileType),
	})
	
	if err != nil {
    	exitErrorf("Unable to upload %q to %q, %v", file.Filename, MyBucket, err)
		return "nil", err
	}
	fmt.Printf("Successfully uploaded %q to %q\n", file.Filename, MyBucket)
	imageUrl := "https://bool-m1.s3.ap-southeast-1.amazonaws.com/events/"+ eventId + "/00_display"
	return imageUrl, nil
}

func GetPreSignedUrl(eventId string,  photoId string) (string, string, error){
	sess := ConnectAWS()
	var MyBucket = GetEnvWithKey("BUCKET_NAME")
	svc := s3.New(sess)
	req, _ := svc.PutObjectRequest(&s3.PutObjectInput{
        Bucket: aws.String(MyBucket),
        Key:    aws.String("./events/" + eventId + "/" + photoId),
    })
	str, err := req.Presign(1 * time.Hour)
	if err != nil {
		return "can't sign", "no url", err
	}
	retrievalUrl := "https://bool-m1.s3.ap-southeast-1.amazonaws.com/events/" + eventId + "/" + photoId
	return str, retrievalUrl, nil
}

func DeletePhotoFromEvent(eventId string, oldUrl string) (int, error){
	sess := ConnectAWS()
	var MyBucket = GetEnvWithKey("BUCKET_NAME")
	svc := s3.New(sess)

	key := oldUrl[48:]
	_, err := svc.DeleteObject(&s3.DeleteObjectInput{
		Bucket: aws.String(MyBucket), 
		Key: aws.String(key),
	})
	if err != nil {
    exitErrorf("Unable to delete object %q from bucket %q, %v", key, MyBucket, err)
	}	

	fmt.Printf("Object %q successfully deleted\n", key)
	return 0, nil
}

func ConnectAWS() *session.Session {
	LoadEnv()
	AccessKeyID = GetEnvWithKey("AWS_ACCESS_KEY_ID")
	SecretAccessKey = GetEnvWithKey("AWS_SECRET_ACCESS_KEY")
	MyRegion = GetEnvWithKey("AWS_REGION")

	sess, err := session.NewSession(
		&aws.Config{
			Region: aws.String(MyRegion),
			Credentials: credentials.NewStaticCredentials(
				AccessKeyID,
				SecretAccessKey,
				"",
			),
		},
	)

	if err != nil {
		panic(err)
	}

	return sess
}