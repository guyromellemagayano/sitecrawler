package main

import (
	"crypto/tls"
	"fmt"
	_ "net/http/pprof"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
)

func main() {
	env := common.Env("ENV", "dev")

	log := common.NewLog(env, "https://db4f18a5b0ef4334a81f275e6d443e0b@o432365.ingest.sentry.io/5394447")

	awsSession, err := common.NewAwsSession(env)
	if err != nil {
		log.Fatal(err)
	}

	db := common.ConfigureDatabase(log, awsSession, env)
	defer db.Close()

	scanQueueName := fmt.Sprintf("linkapp-%s-scan", env)
	scanSqsQueue, err := common.NewSQSService(awsSession, scanQueueName)
	if err != nil {
		log.Fatal(err)
	}

	postprocessService := &PostprocessService{
		Postprocessors: []Postprocessor{
			&common.TlsPostprocessor{},
			&common.SizePostprocessor{},
			&common.IsTypePostprocessor{},
			&common.OccurencesPostprocessor{},
		},
	}
	backendService := &BackendService{Env: env, Token: common.Secret(log, awsSession, env, "BACKEND_TOKEN", "")}
	loadService := &common.LoadService{}
	verifyService := &common.VerifyService{Database: db, LoadService: loadService}
	scanService := &ScanService{
		Database:           db,
		VerifyService:      verifyService,
		LoadService:        loadService,
		BackendService:     backendService,
		PostprocessService: postprocessService,
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
