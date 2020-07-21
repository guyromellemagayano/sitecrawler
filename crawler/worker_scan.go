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
		defer func() {
			if err := msg.Done(); err != nil {
				log.Printf("Scan done failed: %v", err)
			}
		}()

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
