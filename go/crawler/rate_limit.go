package main

import (
	"net/url"
	"strings"
	"time"
)

const (
	maxLimit     = 10 * time.Second
	incOnError   = time.Second
	sleepOnError = 10 * time.Second

	shopifyLimit        = 2 * time.Second
	shopifySleepOnError = 5 * time.Minute
)

var (
	sleep = time.Sleep
	now   = time.Now
)

type RateLimit struct {
	limits          map[string]time.Duration
	lastRequestTime map[string]time.Time
}

func NewRateLimit() *RateLimit {
	return &RateLimit{
		limits:          make(map[string]time.Duration),
		lastRequestTime: make(map[string]time.Time),
	}
}

func (rl *RateLimit) Limit(url *url.URL) {
	key := rl.key(url)
	elapsed := now().Sub(rl.lastRequestTime[key])
	if elapsed < rl.limits[key] {
		sleep(rl.limits[key] - elapsed)
	}
	rl.lastRequestTime[key] = now()
}

func (rl *RateLimit) Update(url *url.URL, resp *LoadResponse) {
	key := rl.key(url)
	if isShopify(resp) {
		if _, ok := rl.limits[key]; !ok {
			rl.limits[key] = shopifyLimit
		}
		if resp.StatusCode == 430 {
			rl.limits[key] += incOnError
			sleep(shopifySleepOnError)
		}
	} else if resp.StatusCode == 429 || resp.StatusCode == 430 {
		rl.limits[key] += incOnError
		sleep(sleepOnError)
	}
	if rl.limits[key] > maxLimit {
		rl.limits[key] = maxLimit
	}
}

func (rl *RateLimit) key(url *url.URL) string {
	return url.Host
}

func isShopify(resp *LoadResponse) bool {
	for _, cookieHeader := range resp.Header["Set-Cookie"] {
		if strings.Contains(cookieHeader, "shopify") {
			return true
		}
	}
	return false
}
