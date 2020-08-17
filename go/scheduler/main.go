package main

import (
	"fmt"
	"log"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
)

func main() {
	env := common.Env("ENV", "dev")

	db := common.NewDatabase(env)
	defer db.Close()

	awsSession, err := common.NewAwsSession(env)
	if err != nil {
		log.Fatal(err)
	}

	scanQueueName := fmt.Sprintf("linkapp-%s-scan", env)
	scanSqsQueue, err := common.NewSQSService(awsSession, scanQueueName)
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
