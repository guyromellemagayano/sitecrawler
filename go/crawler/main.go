package main

import (
	"crypto/tls"
	"fmt"

	"cloud.google.com/go/profiler"
	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"google.golang.org/api/option"
)

func main() {
	env := common.Env("ENV", "dev")

	log := common.NewLog(env, "https://db4f18a5b0ef4334a81f275e6d443e0b@o432365.ingest.sentry.io/5394447")

	awsSession, err := common.NewAwsSession(env)
	if err != nil {
		log.Fatal(err)
	}

	credentials := common.Secret(log, awsSession, env, "PROFILER_SERVICE_ACCOUNT", "")
	if credentials != "" {
		cfg := profiler.Config{
			Service:        "crawler",
			ServiceVersion: env,
			ProjectID:      "edl-app-link-spider",
		}
		if err := profiler.Start(cfg, option.WithCredentialsJSON([]byte(credentials))); err != nil {
			log.Error(err)
		}
	} else {
		log.Warn("No credentials, profiler disabled.")
	}

	db := common.ConfigureDatabase(log, awsSession, "crawler", env)
	defer db.Close()

	scanQueueName := fmt.Sprintf("linkapp-%s-scan", env)
	scanSqsQueue, err := common.NewSQSService(awsSession, scanQueueName)
	if err != nil {
		log.Fatal(err)
	}

	backendService := &common.BackendService{Env: env, Token: common.Secret(log, awsSession, env, "BACKEND_TOKEN_CRAWLER", "")}
	loadService := common.NewLoadService()
	verifyService := &common.VerifyService{Database: db, LoadService: loadService}
	scanService := &ScanService{
		Database:       db,
		VerifyService:  verifyService,
		LoadService:    loadService,
		BackendService: backendService,
	}

	ScanWorker(log, scanSqsQueue, scanService)
}

func findCipherSuite(id uint16) *tls.CipherSuite {
	for _, c := range tls.CipherSuites() {
		if c.ID == id {
			return c
		}
	}
	for _, c := range tls.InsecureCipherSuites() {
		if c.ID == id {
			return c
		}
	}
	return nil
}
