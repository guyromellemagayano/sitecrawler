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

		groupSettings, err := db.GroupSettingsDao.All()
		if err != nil {
			return errors.Wrap(err, "could not get all groups")
		}
		for _, groupSetting := range groupSettings {
			schedule, err := cron.ParseStandard(groupSetting.RecrawlSchedule)
			if err != nil {
				return errors.Wrapf(err, "could not parse schedule for group %v", groupSetting.GroupID)
			}
			sites, err := db.SiteDao.AllVerifiedForGroup(groupSetting.GroupID)
			if err != nil {
				return errors.Wrapf(err, "could not get sites for group %v", groupSetting.GroupID)
			}
			for _, site := range sites {
				log := logger.With("site_id", site.ID)
				latestScan, err := db.ScanDao.Latest(site.ID)
				if err != nil {
					log.Errorf("could not get latest scan for site: %v", err)
					continue
				}
				nextScan := schedule.Next(latestScan.StartedAt)
				if time.Now().After(nextScan) {
					log.Infof("Scheduling scan for %v", site.Url)
					if err := scanService.Start(site.ID); err != nil {
						log.Errorf("could not start scan for site %v", site.Url)
					}
				}
			}
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
