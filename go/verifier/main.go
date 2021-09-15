package main

import (
	"fmt"
	"net/http"
	_ "net/http/pprof"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
)

const numScanWorkers = 1

func main() {
	port := common.Env("PORT", "8000")
	env := common.Env("ENV", "dev")

	log := common.NewLog(env, "https://db4f18a5b0ef4334a81f275e6d443e0b@o432365.ingest.sentry.io/5394447")

	awsSession, err := common.NewAwsSession(env)
	if err != nil {
		log.Fatal(err)
	}

	db := common.ConfigureDatabase(log, awsSession, "verifier", env)
	defer db.Close()

	loadService := common.NewLoadService()
	verifyService := &common.VerifyService{Database: db, LoadService: loadService}

	http.Handle("/verify", common.WrapEndpoint(log, &VerifyEndpoint{VerifyService: verifyService}))

	listen := fmt.Sprintf(":%s", port)
	log.Infof("Listening on: %s", listen)
	log.Fatal(http.ListenAndServe(listen, nil))
}
