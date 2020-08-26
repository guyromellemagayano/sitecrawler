package main

import (
	"context"
	"crypto/tls"
	"net/http"
	"time"

	"github.com/hashicorp/go-retryablehttp"
	"go.uber.org/zap"
)

const timeout = 5 * time.Second

type LoadService struct {
}

func (l *LoadService) Load(log *zap.SugaredLogger, url string) (*http.Response, error, func()) {
	client := retryablehttp.NewClient()
	cipherSuites := []uint16{}
	// add insecure ciphers with higher priority, if they're chosen we will save that as error
	for _, c := range tls.InsecureCipherSuites() {
		cipherSuites = append(cipherSuites, c.ID)
	}
	for _, c := range tls.CipherSuites() {
		cipherSuites = append(cipherSuites, c.ID)
	}
	client.HTTPClient = &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				// we skip default certificate verification and do our own to save details in db
				InsecureSkipVerify: true,
				CipherSuites:       cipherSuites,
				MinVersion:         tls.VersionSSL30,
			},
		},
	}

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	req, err := retryablehttp.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err, cancel
	}
	req = req.WithContext(ctx)
	req.Header.Add("Cache-Control", "max-age=0")
	resp, err := client.Do(req)
	if err != nil {
		return nil, err, cancel
	}
	return resp, nil, cancel
}
