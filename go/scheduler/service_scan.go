package main

import (
	"strconv"
	"time"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
)

type ScanService struct {
	ScanDao      *ScanDao
	ScanSqsQueue *common.SQSService
}

func (s *ScanService) Start(siteId int) error {
	scan := &common.CrawlScan{
		SiteID:    siteId,
		StartedAt: time.Now(),
	}
	if err := s.ScanDao.Save(scan); err != nil {
		return err
	}

	if err := s.ScanSqsQueue.Send(strconv.Itoa(scan.ID)); err != nil {
		return err
	}

	return nil
}
