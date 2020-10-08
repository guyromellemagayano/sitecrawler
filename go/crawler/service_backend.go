package main

import (
	"fmt"
	"net/http"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"github.com/pkg/errors"
)

type BackendService struct {
	Token string
}

func (b BackendService) SendFinishedEmail(scan *database.CrawlScan) error {
	url := fmt.Sprintf("http://backend:8000/api/site/%d/scan/%d/send_finished_email/", scan.SiteID, scan.ID)
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
