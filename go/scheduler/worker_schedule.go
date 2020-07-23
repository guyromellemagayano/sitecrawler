package main

import (
	"log"
	"time"

	"github.com/pkg/errors"
	"github.com/robfig/cron"
)

const checkInterval = time.Hour

func ScheduleWorker(groupSettingsDao *GroupSettingsDao, siteDao *SiteDao, scanDao *ScanDao, scanService *ScanService) {
	loop := func() error {
		groupSettings, err := groupSettingsDao.All()
		if err != nil {
			return errors.Wrap(err, "could not get all groups")
		}
		for _, groupSetting := range groupSettings {
			schedule, err := cron.ParseStandard(groupSetting.RecrawlSchedule)
			if err != nil {
				return errors.Wrapf(err, "could not parse schedule for group %v", groupSetting.GroupID)
			}
			sites, err := siteDao.AllVerifiedForGroup(groupSetting.GroupID)
			if err != nil {
				return errors.Wrapf(err, "could not get sites for group %v", groupSetting.GroupID)
			}
			for _, site := range sites {
				latestScan, err := scanDao.Latest(site.ID)
				if err != nil {
					log.Println(errors.Wrapf(err, "could not get latest scan for site %v", site.ID))
					continue
				}
				nextScan := schedule.Next(latestScan.StartedAt)
				if time.Now().After(nextScan) {
					log.Printf("Scheduling scan for %v", site.Url)
					if err := scanService.Start(site.ID); err != nil {
						log.Println(errors.Wrapf(err, "could not start scan for site %v", site.ID))
					}
				}
			}
		}
		return nil
	}
	for range time.NewTicker(checkInterval).C {
		log.Println("Running loop")
		if err := loop(); err != nil {
			log.Println(err)
		}
	}
}
