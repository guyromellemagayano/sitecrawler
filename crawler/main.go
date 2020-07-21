package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/endpoints"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sqs"
	"github.com/go-pg/pg"
)

const numScanWorkers = 10

func env(name, def string) string {
	if value, ok := os.LookupEnv(name); ok {
		return value
	}
	return def
}

func main() {
	port := env("PORT", "8000")
	dbPass := env("DB_PASS", "crawldev")

	db := pg.Connect(&pg.Options{
		Addr:     "db:5432",
		User:     "postgres",
		Password: dbPass,
		Database: "postgres",
	})
	defer db.Close()
	if env("LOG_SQL", "false") == "true" {
		db.AddQueryHook(dbLogger{})
	}

	var awsConfigs []*aws.Config
	if env("ENV", "dev") == "dev" {
		awsConfigs = append(awsConfigs, &aws.Config{
			Credentials:      credentials.NewStaticCredentials("foo", "var", ""),
			S3ForcePathStyle: aws.Bool(true),
			Region:           aws.String(endpoints.UsEast1RegionID),
			Endpoint:         aws.String("http://localstack:4566"),
		})
	} else {
		awsConfigs = append(awsConfigs, &aws.Config{
			Region: aws.String(endpoints.UsEast1RegionID),
		})
	}
	awsSession, err := session.NewSession(awsConfigs...)
	if err != nil {
		log.Fatal(err)
	}
	sqsSvc := sqs.New(awsSession)

	siteDao := &SiteDao{DB: db}
	scanDao := &ScanDao{DB: db}
	linkDao := &LinkDao{DB: db}
	linkLinkDao := &LinkLinkDao{DB: db}

	scanSqsQueue, err := NewSQSService(sqsSvc, "linkapp-scan")
	if err != nil {
		log.Fatal(err)
	}

	loadService := &LoadService{}
	verifyService := &VerifyService{SiteDao: siteDao, LoadService: loadService}
	scanService := &ScanService{
		ScanDao:       scanDao,
		LinkDao:       linkDao,
		LinkLinkDao:   linkLinkDao,
		VerifyService: verifyService,
		LoadService:   loadService,
	}

	http.Handle("/verify", &VerifyEndpoint{VerifyService: verifyService})

	for i := 0; i < numScanWorkers; i++ {
		go ScanWorker(scanSqsQueue, scanService)
	}

	listen := fmt.Sprintf(":%s", port)
	log.Printf("Listening on: %s", listen)
	log.Fatal(http.ListenAndServe(listen, nil))
}

type dbLogger struct{}

func (d dbLogger) BeforeQuery(q *pg.QueryEvent) {}

func (d dbLogger) AfterQuery(q *pg.QueryEvent) {
	log.Println(q.FormattedQuery())
}
