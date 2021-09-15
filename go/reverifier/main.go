package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
)

func main() {
	env := common.Env("ENV", "dev")

	log := common.NewLog(env, "https://fd034fff624846769e1c42139620779d@o432365.ingest.sentry.io/5596938")

	awsSession, err := common.NewAwsSession(env)
	if err != nil {
		log.Fatal(err)
	}

	db := common.ConfigureDatabase(log, awsSession, "reverifier", env)
	defer db.Close()

	loadService := common.NewLoadService()
	verifyService := &common.VerifyService{Database: db, LoadService: loadService}

	if err := ReverifyWorker(log, db, verifyService); err != nil {
		log.Fatal(err)
	}
}
