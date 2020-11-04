package main

import (
	"strconv"
	"time"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
)

type ScanService struct {
	Database     *database.Database
	ScanSqsQueue *common.SQSService
}

func (s *ScanService) Start(siteId int) error {
	scan := &database.CrawlScan{
		SiteID:    siteId,
		StartedAt: time.Now(),
	}
	if err := s.Database.Insert(scan); err != nil {
		return err
	}

	if err := s.ScanSqsQueue.Send(strconv.Itoa(scan.ID)); err != nil {
		return err
	}

	return nil
}
