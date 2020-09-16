package main

import (
	"crypto/tls"
	"fmt"
	"net/http"
	_ "net/http/pprof"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
)

const numScanWorkers = 10

func main() {
	port := common.Env("PORT", "8000")
	env := common.Env("ENV", "dev")

	log := common.NewLog(env, "https://db4f18a5b0ef4334a81f275e6d443e0b@o432365.ingest.sentry.io/5394447")

	db := common.NewDatabase(log, env)
	defer db.Close()

	awsSession, err := common.NewAwsSession(env)
	if err != nil {
		log.Fatal(err)
	}

	siteDao := &SiteDao{DB: db}
	scanDao := &ScanDao{DB: db}
	linkDao := &LinkDao{DB: db}
	linkLinkDao := &LinkLinkDao{DB: db}
	linkImageDao := &LinkImageDao{DB: db}
	linkScriptDao := &LinkScriptDao{DB: db}
	linkStylesheetDao := &LinkStylesheetDao{DB: db}
	pageDataDao := &PageDataDao{DB: db}
	tlsDao := &TlsDao{DB: db}

	scanQueueName := fmt.Sprintf("linkapp-%s-scan", env)
	scanSqsQueue, err := common.NewSQSService(awsSession, scanQueueName)
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
		TlsDao:            tlsDao,
		VerifyService:     verifyService,
		LoadService:       loadService,
	}

	http.Handle("/verify", common.WrapEndpoint(log, &VerifyEndpoint{VerifyService: verifyService}))

	for i := 0; i < numScanWorkers; i++ {
		go ScanWorker(log, scanSqsQueue, scanService)
	}

	listen := fmt.Sprintf(":%s", port)
	log.Infof("Listening on: %s", listen)
	log.Fatal(http.ListenAndServe(listen, nil))
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
