package main

import (
	"context"
	"time"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"github.com/hashicorp/go-retryablehttp"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

const (
	timeout = 5 * time.Second
)

type UptimeJob struct {
	Database       *database.Database
	Logger         *zap.SugaredLogger
	BackendService *common.BackendService

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

	lastStats, err := j.loadLastStats(sites)
	if err != nil {
		return errors.Wrapf(err, "could not get last stats for group %v", j.Group.GroupID)
	}

	var stats []*database.UptimeUptimestat
	var statsToSendEmail []*database.UptimeUptimestat
	for _, site := range sites {
		s, err := j.check(site)
		if err != nil {
			j.Logger.Warnf("Uptime check for %q failed: %v", site.Url, err)
		}

		if isUp(s) != isUp(lastStats[site.ID]) {
			statsToSendEmail = append(statsToSendEmail, s)
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

	if len(statsToSendEmail) != 0 {
		statIDs := make([]int, len(statsToSendEmail))
		for i, stat := range statsToSendEmail {
			statIDs[i] = stat.ID
		}
		if err := j.BackendService.SendUptimeEmails(statIDs); err != nil {
			j.Logger.Errorw("Could not send uptime emails from uptimer",
				"err", err,
				"stat_ids", statIDs,
			)
		}
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
		stat.ResponseTime = int(time.Since(startTime).Milliseconds())
	}()

	req, err := retryablehttp.NewRequest("HEAD", site.Url, nil)
	if err != nil {
		return nil, err
	}
	req = req.WithContext(ctx)
	req.Header.Add("Cache-Control", "max-age=0")

	resp, err := retryablehttp.NewClient().Do(req)
	if err != nil {
		status, errStr := common.SerializeLoadError(j.Logger, site.Url, err)
		stat.Status = status
		stat.Error = &errStr
		return stat, nil
	}
	defer resp.Body.Close()

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

// loadLastStats returns last stat entry by site id
func (j *UptimeJob) loadLastStats(sites []*database.CrawlSite) (map[int]*database.UptimeUptimestat, error) {
	if len(sites) == 0 {
		return nil, nil
	}

	siteIDs := make([]int, len(sites))
	for i, site := range sites {
		siteIDs[i] = site.ID
	}

	var lastStats []*database.UptimeUptimestat
	err := j.Database.All(&lastStats,
		database.DistinctOn("site_id"),
		database.WhereIn("site_id IN (?)", siteIDs),
		database.Order("site_id"),
		database.Order("created_at DESC"),
	)
	if err != nil {
		return nil, errors.Wrapf(err, "could not get sites for group %v", j.Group.GroupID)
	}

	result := make(map[int]*database.UptimeUptimestat, len(lastStats))
	for _, stat := range lastStats {
		result[stat.SiteID] = stat
	}

	return result, nil
}

func isUp(s *database.UptimeUptimestat) bool {
	if s == nil {
		return true
	}
	return s.Status == common.STATUS_OK
}
