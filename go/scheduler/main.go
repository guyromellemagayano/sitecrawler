package main

import (
	"fmt"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
)

func main() {
	env := common.Env("ENV", "dev")

	log := common.NewLog(env, "https://c61626f98dcd4b43a8352c3b0c35e184@o432365.ingest.sentry.io/5394539")

	db := common.NewDatabase(log, env)
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

	go ScheduleWorker(log, groupSettingsDao, siteDao, scanDao, scanService)

	select {}
}
