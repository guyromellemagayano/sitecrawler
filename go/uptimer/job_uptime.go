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
	timeout    = 3 * time.Second
	numRetries = 3
	retryTime  = 10 * time.Second
)

type UptimeJob struct {
	Database       *database.Database
	Logger         *zap.SugaredLogger
	BackendService *common.BackendService

	Group *group
}

func (j *UptimeJob) Run() {
	if err := j.run(); err != nil {
		j.Logger.Errorf("Uptime job failed for group id %v: %v", j.Group.GroupID, err)
	}
}

func (j *UptimeJob) run() error {
	j.Logger.Infof("Running job for group id %v", j.Group.GroupID)

	ctx, cancel := context.WithTimeout(context.Background(), time.Minute*5)
	defer cancel()

	var sites []*database.CrawlSite
	err := j.Database.All(&sites,
		database.Join("JOIN auth_user AS u ON u.id = t.user_id"),
		database.Join("JOIN auth_user_groups as ug ON ug.user_id = u.id"),
		database.Where("ug.group_id = ?", j.Group.GroupID),
		database.Where("t.verified = true"),
		database.Where("t.deleted_at IS NULL"),
	)
	if err != nil {
		return errors.Wrapf(err, "could not get sites for group %v", j.Group.GroupID)
	}
	if len(sites) == 0 {
		j.Logger.Infof("No sites for group id %v, stopping", j.Group.GroupID)
		return ctx.Err()
	}
	j.Logger.Infof("Got %v sites for group id %v", len(sites), j.Group.GroupID)

	lastStats, err := j.loadLastStats(sites)
	if err != nil {
		return errors.Wrapf(err, "could not get last stats for group %v", j.Group.GroupID)
	}

	// Since non-retry results are written to channel sync, we need buffered channel for all sites
	statResultChan := make(chan *database.UptimeUptimestat, len(sites))
	for _, site := range sites {
		err := j.checkWithAsyncRetry(ctx, site, statResultChan, numRetries)
		if err != nil {
			j.Logger.Errorf("Uptime check for %q failed: %v", site.Url, err)
		}
	}

	stats := make([]*database.UptimeUptimestat, 0, len(sites))
	var statsToSendEmail []*database.UptimeUptimestat
	for range sites {
		select {
		case <-ctx.Done():
			break
		case s := <-statResultChan:
			if s == nil {
				break
			}

			if isUp(s) != isUp(lastStats[s.SiteID]) {
				statsToSendEmail = append(statsToSendEmail, s)
			}

			stats = append(stats, s)
		}
	}

	if len(stats) == 0 {
		j.Logger.Infof("No stats for group id %v, stopping", j.Group.GroupID)
		return ctx.Err()
	}
	j.Logger.Infof("Inserting %v stats in db for group id %v", len(stats), j.Group.GroupID)

	err = j.Database.MultiInsert(&stats)
	if err != nil {
		return errors.Wrap(err, "could not insert stats")
	}

	j.Logger.Infof("Sending %v emails for group id %v", len(statsToSendEmail), j.Group.GroupID)

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

	j.Logger.Infof("Job done for group id %v", j.Group.GroupID)

	return ctx.Err()
}

// checkWithAsyncRetry checks the site and on fail retryes retryCount times every 10 seconds
func (j *UptimeJob) checkWithAsyncRetry(ctx context.Context, site *database.CrawlSite, resultChan chan *database.UptimeUptimestat, retryCount int) error {
	result, err := j.check(ctx, site)
	if err != nil {
		resultChan <- nil
		return err
	}

	// if ok or no retry count return, otherwise retry
	if result.Status == common.STATUS_OK || retryCount < 1 {
		resultChan <- result
		return nil
	}

	go func() {
		retryCount--
		j.Logger.Infof("Retrying in %v for site id %v, %v retries left", retryTime, site.ID, retryCount)

		select {
		case <-ctx.Done():
			resultChan <- nil
			return
		case <-time.After(retryTime):
		}

		err := j.checkWithAsyncRetry(ctx, site, resultChan, retryCount)
		if err != nil {
			j.Logger.Errorw("checkWithAsyncRetry error",
				"retryCount", retryCount,
				"err", err,
				"site_id", site.ID,
			)
		}
	}()
	return nil
}

func (j *UptimeJob) check(ctx context.Context, site *database.CrawlSite) (*database.UptimeUptimestat, error) {
	ctx, cancel := context.WithTimeout(ctx, timeout)
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

	req, err := http.NewRequest("HEAD", site.Url, nil)
	if err != nil {
		return nil, err
	}
	req = req.WithContext(ctx)
	req.Header.Add("Cache-Control", "no-cache")
	req.Header.Add("Accept", "*/*")

	resp, err := http.DefaultClient.Do(req)
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
