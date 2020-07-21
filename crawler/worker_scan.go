package main

import (
	"log"
	"strconv"
)

func ScanWorker(scanSqsQueue *SQSService, scanService *ScanService) {
	loop := func() error {
		msg, err := scanSqsQueue.Read()
		if err != nil {
			return err
		}

		id, err := strconv.Atoi(msg.Body())
		if err != nil {
			return err
		}

		err = scanService.ScanSite(id)
		if err != nil {
			return err
		}

		return nil
	}
	for {
		if err := loop(); err != nil {
			log.Printf("Scan failed: %v", err)
		}
	}
}
