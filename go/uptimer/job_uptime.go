package main

import (
	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

type UptimeJob struct {
	Database *database.Database
	Logger   *zap.SugaredLogger

	Group *group
}

func (j *UptimeJob) Run() {
	if err := j.run(); err != nil {
		j.Logger.Error(err)
	}
}

func (j *UptimeJob) run() error {
	var sites []database.CrawlSite
	err := j.Database.All(&sites,
		database.Join("JOIN auth_user AS u ON u.id = t.user_id"),
		database.Join("JOIN auth_user_groups as ug ON ug.user_id = u.id"),
		database.Where("ug.group_id = ?", j.Group.GroupID),
		database.Where("t.verified = true"),
	)
	if err != nil {
		return errors.Wrapf(err, "could not get sites for group %v", j.Group.GroupID)
	}

	for _, site := range sites {
		j.Logger.Infof("Uptime check for %v", site.Url)
	}

	return nil
}
