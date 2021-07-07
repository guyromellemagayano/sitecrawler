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

		var groupSettings []database.CrawlGroupsetting
		err := db.All(&groupSettings)
		if err != nil {
			return errors.Wrap(err, "could not get all groups")
		}
		for _, groupSetting := range groupSettings {
			schedule, err := cron.ParseStandard(groupSetting.RecrawlSchedule)
			if err != nil {
				return errors.Wrapf(err, "could not parse schedule for group %v", groupSetting.GroupID)
			}
			var sites []database.CrawlSite
			err = db.All(&sites,
				database.Join("JOIN auth_user AS u ON u.id = t.user_id"),
				database.Join("JOIN auth_user_groups as ug ON ug.user_id = u.id"),
				database.Where("ug.group_id = ?", groupSetting.GroupID),
				database.Where("t.verified = true"),
				database.Where("t.deleted_at IS NULL"),
			)
			logger.Infof("Got %v sites for group id %v", len(sites), groupSetting.GroupID)
			if err != nil {
				return errors.Wrapf(err, "could not get sites for group %v", groupSetting.GroupID)
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
			logger.Infof("Done for group id %v", groupSetting.GroupID)
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
