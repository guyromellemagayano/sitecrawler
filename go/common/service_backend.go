package common

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"github.com/pkg/errors"
)

type BackendService struct {
	Env   string
	Token string
}

func (b BackendService) baseUrl() string {
	if b.Env == "production" {
		return "https://app.sitecrawler.com"
	}
	return "http://backend:8000"
}

func (b BackendService) request(method, path string, body io.Reader) error {
	url := fmt.Sprintf("%s/api/%s", b.baseUrl(), path)
	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return err
	}
	req.Header.Add("Authorization", fmt.Sprintf("Token %v", b.Token))
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	if resp.StatusCode != 200 {
		return errors.Errorf("Post %q: %v", url, resp.Status)
	}
	return nil
}

func (b BackendService) SendFinishedEmail(scan *database.CrawlScan) error {
	path := fmt.Sprintf("site/%d/scan/%d/send_finished_email/", scan.SiteID, scan.ID)
	return b.request("POST", path, nil)
}

func (b BackendService) SendUptimeEmails(siteIDs []int) error {
	buf := &bytes.Buffer{}
	enc := json.NewEncoder(buf)
	if err := enc.Encode(siteIDs); err != nil {
		return err
	}
	return b.request("POST", "internal/send_uptime_emails/", buf)
}
