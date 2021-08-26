package main

import (
	"time"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"github.com/pkg/errors"
	"github.com/robfig/cron"
	"go.uber.org/zap"
)

const checkInterval = time.Hour

func ScheduleWorker(logger *zap.SugaredLogger, db *database.Database, scanService *ScanService) {
	loop := func() error {
		defer common.PanicLogger(logger)

		var plans []database.TeamPlan
		err := db.All(&plans)
		if err != nil {
			return errors.Wrap(err, "could not get all plans")
		}
		for _, plan := range plans {
			schedule, err := cron.ParseStandard(plan.RecrawlSchedule)
			if err != nil {
				return errors.Wrapf(err, "could not parse schedule for plan %v", plan.ID)
			}
			var sites []database.CrawlSite
			err = db.All(&sites,
				database.Join("JOIN teams_team AS team ON team.id = t.team_id"),
				database.Where("team.plan_id = ?", plan.ID),
				database.Where("t.verified = true"),
				database.Where("t.deleted_at IS NULL"),
			)
			logger.Infof("Got %v sites for plan id %v", len(sites), plan.ID)
			if err != nil {
				return errors.Wrapf(err, "could not get sites for plan %v", plan.ID)
			}
			for _, site := range sites {
				log := logger.With("site_id", site.ID)
				var latestScan database.CrawlScan
				err := db.Get(&latestScan,
					database.Where("site_id = ?", site.ID),
					database.Order("started_at DESC"),
				)
				if err != nil {
					log.Errorf("could not get latest scan for site: %v", err)
					continue
				}
				if latestScan.FinishedAt == nil {
					continue
				}
				nextScan := schedule.Next(latestScan.StartedAt)
				if time.Now().After(nextScan) {
					log.Infof("Scheduling scan for %v", site.Url)
					if err := scanService.Start(site.ID); err != nil {
						log.Errorf("could not start scan for site %v: %v", site.Url, err)
					}
				}
			}
			logger.Infof("Done for plan id %v", plan.ID)
		}
		return nil
	}
	log := logger
	log.Info("Initial check")
	if err := loop(); err != nil {
		log.Error(err)
	}
	for range time.NewTicker(checkInterval).C {
		log.Info("Running loop")
		if err := loop(); err != nil {
			log.Error(err)
		}
	}
}
