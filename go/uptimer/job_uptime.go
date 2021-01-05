package main

import (
	"context"
	"net/http"
	"time"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

const (
	timeout   = 5 * time.Second
	sizeLimit = 10 * 1024 * 1024
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
	var sites []*database.CrawlSite
	err := j.Database.All(&sites,
		database.Join("JOIN auth_user AS u ON u.id = t.user_id"),
		database.Join("JOIN auth_user_groups as ug ON ug.user_id = u.id"),
		database.Where("ug.group_id = ?", j.Group.GroupID),
		database.Where("t.verified = true"),
	)
	if err != nil {
		return errors.Wrapf(err, "could not get sites for group %v", j.Group.GroupID)
	}
	j.Logger.Infof("Running job for group id %v, with %v sites", j.Group.GroupID, len(sites))

	var stats []*database.UptimeUptimestat
	for _, site := range sites {
		s, err := j.check(site)
		if err != nil {
			j.Logger.Warnf("Uptime check for %q failed: %v", site.Url, err)
		}
		stats = append(stats, s)
	}

	if len(stats) == 0 {
		return nil
	}

	err = j.Database.MultiInsert(&stats)
	if err != nil {
		return errors.Wrap(err, "could not insert stats")
	}

	return nil
}

func (j *UptimeJob) check(site *database.CrawlSite) (*database.UptimeUptimestat, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	stat := &database.UptimeUptimestat{
		SiteID:    site.ID,
		CreatedAt: time.Now().UTC(),
		Status:    common.STATUS_OK,
	}

	startTime := time.Now()
	defer func() {
		stat.ResponseTime = int(time.Now().Sub(startTime).Milliseconds())
	}()

	req, err := http.NewRequest("GET", site.Url, nil)
	if err != nil {
		return nil, err
	}
	req = req.WithContext(ctx)
	req.Header.Add("Cache-Control", "max-age=0")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		status, errStr := common.SerializeLoadError(j.Logger, site.Url, err)
		stat.Status = status
		stat.Error = &errStr
		return stat, nil
	}

	statusCode := resp.StatusCode
	stat.HttpStatus = &statusCode
	if statusCode/100 != 2 {
		stat.Status = common.STATUS_HTTP_ERROR
		statusStr := resp.Status
		stat.Error = &statusStr
		return stat, nil
	}

	return stat, nil
}
