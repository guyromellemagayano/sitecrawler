package main

import (
	"context"
	"strconv"
	"time"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func ScanWorker(log *zap.SugaredLogger, scanSqsQueue *common.SQSService, scanService *ScanService) {
	loop := func(ctx context.Context) error {
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

		ctx, cancel := context.WithTimeout(ctx, time.Hour*6)
		defer cancel()
		log.Infof("starting timeout")

		log = log.With("scan_id", id)
		err = scanService.ScanSite(ctx, log, id)
		if err != nil {
			if err != context.DeadlineExceeded {
				log.Errorf("Scan failed: %v", err)
			}
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
		if err := loop(context.Background()); err != nil {
			log.Errorf("Scan worker error: %v", err)
		}
	}
}
