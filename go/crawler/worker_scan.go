package main

import (
	"strconv"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"go.uber.org/zap"
)

func ScanWorker(log *zap.SugaredLogger, scanSqsQueue *common.SQSService, scanService *ScanService) {
	loop := func() error {
		defer common.PanicLogger(log)

		msg, err := scanSqsQueue.Read(log)
		if err != nil {
			return err
		}
		defer func() {
			if err := msg.Done(); err != nil {
				log.Errorf("Scan done failed: %v", err)
			}
		}()

		id, err := strconv.Atoi(msg.Body())
		if err != nil {
			return err
		}

		err = scanService.ScanSite(log.With("scan_id", id), id)
		if err != nil {
			return err
		}

		return nil
	}
	for {
		if err := loop(); err != nil {
			log.Errorf("Scan failed: %v", err)
		}
	}
}
