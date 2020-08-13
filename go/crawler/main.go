package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/endpoints"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sqs"
	"github.com/go-pg/pg"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
)

const numScanWorkers = 10

func main() {
	port := common.Env("PORT", "8000")
	env := common.Env("ENV", "dev")

	dbPass := common.Env("DB_PASS", "crawldev")
	var pgOptions *pg.Options
	if env == "production" {
		pgOptions = &pg.Options{
			Addr:     "terraform-20200810173347645600000001.ceavi2ewfiqg.us-east-1.rds.amazonaws.com:5432",
			User:     "production",
			Password: dbPass,
			Database: "production",
		}
	} else {
		pgOptions = &pg.Options{
			Addr:     "db:5432",
			User:     "postgres",
			Password: dbPass,
			Database: "postgres",
		}
	}
	db := pg.Connect(pgOptions)
	defer db.Close()
	if common.Env("LOG_SQL", "false") == "true" {
		db.AddQueryHook(common.DbLogger{})
	}

	var awsConfigs []*aws.Config
	if env == "dev" {
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
	linkImageDao := &LinkImageDao{DB: db}
	linkScriptDao := &LinkScriptDao{DB: db}
	linkStylesheetDao := &LinkStylesheetDao{DB: db}
	pageDataDao := &PageDataDao{DB: db}

	scanQueueName := fmt.Sprintf("linkapp-%s-scan", env)
	scanSqsQueue, err := common.NewSQSService(sqsSvc, scanQueueName)
	if err != nil {
		log.Fatal(err)
	}

	loadService := &LoadService{}
	verifyService := &VerifyService{SiteDao: siteDao, LoadService: loadService}
	scanService := &ScanService{
		ScanDao:           scanDao,
		LinkDao:           linkDao,
		LinkLinkDao:       linkLinkDao,
		LinkImageDao:      linkImageDao,
		LinkScriptDao:     linkScriptDao,
		LinkStylesheetDao: linkStylesheetDao,
		PageDataDao:       pageDataDao,
		VerifyService:     verifyService,
		LoadService:       loadService,
	}

	http.Handle("/verify", &VerifyEndpoint{VerifyService: verifyService})

	for i := 0; i < numScanWorkers; i++ {
		go ScanWorker(scanSqsQueue, scanService)
	}

	listen := fmt.Sprintf(":%s", port)
	log.Printf("Listening on: %s", listen)
	log.Fatal(http.ListenAndServe(listen, nil))
}
