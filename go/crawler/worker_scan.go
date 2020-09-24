package main

import (
	"strconv"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func ScanWorker(log *zap.SugaredLogger, scanSqsQueue *common.SQSService, scanService *ScanService) {
	loop := func() error {
		defer common.PanicLogger(log)

		msg, err := scanSqsQueue.Read(log)
		if err != nil {
			return errors.Wrap(err, "could not read sqs queue")
		}
		defer msg.Done()

		id, err := strconv.Atoi(msg.Body())
		if err != nil {
			return errors.Wrap(err, "could not decode sqs msg")
		}

		log = log.With("scan_id", id)
		err = scanService.ScanSite(log, id)
		if err != nil {
			log.Errorf("Scan failed: %v", err)
			return nil
		}

		// Only acknowledge message after success, so we retry on error
		if err := msg.Success(); err != nil {
			log.Errorf("Could not acknowledge scan msg: %v", err)
			return nil
		}

		return nil
	}
	for {
		if err := loop(); err != nil {
			log.Errorf("Scan worker error: %v", err)
		}
	}
}
