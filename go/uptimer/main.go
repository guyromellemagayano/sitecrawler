package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
)

func main() {
	env := common.Env("ENV", "dev")

	log := common.NewLog(env, "https://88a3d4bad4bf4faca9f69b2d10593f98@o432365.ingest.sentry.io/5542113")

	awsSession, err := common.NewAwsSession(env)
	if err != nil {
		log.Fatal(err)
	}

	db := common.ConfigureDatabase(log, awsSession, "uptimer", env)
	defer db.Close()

	backendToken := common.Secret(log, awsSession, env, "BACKEND_TOKEN_UPTIMER", "")

	backendService := &common.BackendService{Env: env, Token: backendToken}
	scheduleService := NewScheduleService(log, db, backendService)

	go UptimeWorker(log, db, scheduleService)

	select {}
}
