package main

import (
	"context"
	"net/http"
	"time"
)

const timeout = 5 * time.Second

type LoadService struct{}

func (l *LoadService) Load(url string) (*http.Response, error, func()) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err, cancel
	}
	req.Header.Add("Cache-Control", "max-age=0")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err, cancel
	}
	return resp, nil, cancel
}
