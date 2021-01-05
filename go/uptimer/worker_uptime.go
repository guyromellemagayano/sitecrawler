package main

import (
	"time"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"go.uber.org/zap"
)

const reloadInterval = time.Hour

func UptimeWorker(log *zap.SugaredLogger, db *database.Database, scheduleService *ScheduleService) {
	loop := func() error {
		defer common.PanicLogger(log)

		return scheduleService.Reload()
	}
	log.Info("Initial load")
	if err := loop(); err != nil {
		log.Error(err)
	}
	for range time.NewTicker(reloadInterval).C {
		log.Info("Running loop")
		if err := loop(); err != nil {
			log.Error(err)
		}
	}
}
