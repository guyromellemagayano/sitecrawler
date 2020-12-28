package main

import (
	"fmt"
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
		return "https://app.sitecrawler.com/"
	}
	return "http://backend:8000"
}

func (b BackendService) SendFinishedEmail(scan *database.CrawlScan) error {
	url := fmt.Sprintf("%s/api/site/%d/scan/%d/send_finished_email/", b.baseUrl(), scan.SiteID, scan.ID)
	req, err := http.NewRequest("POST", url, nil)
	if err != nil {
		return err
	}
	req.Header.Add("Authorization", fmt.Sprintf("Token %v", b.Token))
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	if resp.StatusCode != 200 {
		return errors.New(resp.Status)
	}
	return nil
}
