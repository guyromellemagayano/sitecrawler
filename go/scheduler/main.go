package main

import (
	"log"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/endpoints"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sqs"
	"github.com/go-pg/pg"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
)

func main() {
	dbPass := common.Env("DB_PASS", "crawldev")

	db := pg.Connect(&pg.Options{
		Addr:     "db:5432",
		User:     "postgres",
		Password: dbPass,
		Database: "postgres",
	})
	defer db.Close()
	if common.Env("LOG_SQL", "false") == "true" {
		db.AddQueryHook(common.DbLogger{})
	}

	var awsConfigs []*aws.Config
	if common.Env("ENV", "dev") == "dev" {
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

	scanSqsQueue, err := common.NewSQSService(sqsSvc, "linkapp-scan")
	if err != nil {
		log.Fatal(err)
	}

	siteDao := &SiteDao{DB: db}
	scanDao := &ScanDao{DB: db}
	groupSettingsDao := &GroupSettingsDao{DB: db}

	scanService := &ScanService{
		ScanDao:      scanDao,
		ScanSqsQueue: scanSqsQueue,
	}

	go ScheduleWorker(groupSettingsDao, siteDao, scanDao, scanService)

	select {}
}
