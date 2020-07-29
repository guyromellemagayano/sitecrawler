package main

import (
	"context"
	"net/http"
	"time"

	"github.com/hashicorp/go-retryablehttp"
)

const timeout = 5 * time.Second

type LoadService struct{}

func (l *LoadService) Load(url string) (*http.Response, error, func()) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	req, err := retryablehttp.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err, cancel
	}
	req = req.WithContext(ctx)
	req.Header.Add("Cache-Control", "max-age=0")
	resp, err := retryablehttp.NewClient().Do(req)
	if err != nil {
		return nil, err, cancel
	}
	return resp, nil, cancel
}
