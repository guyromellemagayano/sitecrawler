package main

import (
	"fmt"
	"net/http"
	"net/url"
	"testing"
	"time"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/stretchr/testify/assert"
)

func expectedSeconds(s int) *time.Duration {
	d := time.Second * time.Duration(s)
	return &d
}

func TestRateLimit(t *testing.T) {
	// The test cases depend on each other and test complex behavior of rate limiter.
	var lastSleep *time.Duration
	sleep = func(d time.Duration) {
		lastSleep = &d
	}
	fakeNow := time.Now()
	now = func() time.Time {
		return fakeNow
	}
	rl := NewRateLimit()

	testUrl, err := url.Parse("http://test.com")
	if err != nil {
		t.Error(err)
	}
	shopifyUrl1, err := url.Parse("http://test.shopify.com")
	if err != nil {
		t.Error(err)
	}
	shopifyUrl2, err := url.Parse("http://test.shopify.com/page/")
	if err != nil {
		t.Error(err)
	}
	otherUrl1, err := url.Parse("http://other.com")
	if err != nil {
		t.Error(err)
	}
	otherUrl2, err := url.Parse("https://other.com/page/")
	if err != nil {
		t.Error(err)
	}
	shopifyHeaders := http.Header{
		"Set-Cookie": []string{"cart_currency=USD; path=/; expires=Mon, 19 Oct 2020 19:37:46 GMT", "_shopify_y=cadd9b8d-2597-4781-8b03-54b8b215eb62; Expires=Tue, 05-Oct-21 19:37:46 GMT; Domain=pinklily.com; Path=/"},
	}

	testCases := []struct {
		Url                 *url.URL
		Response            *common.LoadResponse
		ExpectedLimitSleep  *time.Duration
		ExpectedUpdateSleep *time.Duration
	}{
		{
			Url:                 testUrl,
			Response:            &common.LoadResponse{StatusCode: 200},
			ExpectedLimitSleep:  nil,
			ExpectedUpdateSleep: nil,
		}, {
			Url:                 testUrl,
			Response:            &common.LoadResponse{StatusCode: 200},
			ExpectedLimitSleep:  nil,
			ExpectedUpdateSleep: nil,
		}, {
			Url:                 shopifyUrl1,
			Response:            &common.LoadResponse{StatusCode: 200, Header: shopifyHeaders},
			ExpectedLimitSleep:  nil,
			ExpectedUpdateSleep: nil,
		}, {
			Url:                 shopifyUrl1,
			Response:            &common.LoadResponse{StatusCode: 200, Header: shopifyHeaders},
			ExpectedLimitSleep:  expectedSeconds(2),
			ExpectedUpdateSleep: nil,
		}, {
			Url:                 shopifyUrl2,
			Response:            &common.LoadResponse{StatusCode: 200, Header: shopifyHeaders},
			ExpectedLimitSleep:  expectedSeconds(2),
			ExpectedUpdateSleep: nil,
		}, {
			Url:                 shopifyUrl1,
			Response:            &common.LoadResponse{StatusCode: 430, Header: shopifyHeaders},
			ExpectedLimitSleep:  expectedSeconds(2),
			ExpectedUpdateSleep: expectedSeconds(5 * 60),
		}, {
			Url:                 shopifyUrl1,
			Response:            &common.LoadResponse{StatusCode: 430, Header: shopifyHeaders},
			ExpectedLimitSleep:  expectedSeconds(3),
			ExpectedUpdateSleep: expectedSeconds(5 * 60),
		}, {
			Url:                 shopifyUrl1,
			Response:            &common.LoadResponse{StatusCode: 200, Header: shopifyHeaders},
			ExpectedLimitSleep:  expectedSeconds(4),
			ExpectedUpdateSleep: nil,
		}, {
			Url:                 shopifyUrl2,
			Response:            &common.LoadResponse{StatusCode: 200, Header: shopifyHeaders},
			ExpectedLimitSleep:  expectedSeconds(4),
			ExpectedUpdateSleep: nil,
		}, {
			Url:                 testUrl,
			Response:            &common.LoadResponse{StatusCode: 200},
			ExpectedLimitSleep:  nil,
			ExpectedUpdateSleep: nil,
		}, {
			Url:                 otherUrl1,
			Response:            &common.LoadResponse{StatusCode: 429},
			ExpectedLimitSleep:  nil,
			ExpectedUpdateSleep: expectedSeconds(10),
		}, {
			Url:                 otherUrl1,
			Response:            &common.LoadResponse{StatusCode: 200},
			ExpectedLimitSleep:  expectedSeconds(1),
			ExpectedUpdateSleep: nil,
		}, {
			Url:                 otherUrl2,
			Response:            &common.LoadResponse{StatusCode: 200},
			ExpectedLimitSleep:  expectedSeconds(1),
			ExpectedUpdateSleep: nil,
		}, {
			Url:                 otherUrl2,
			Response:            &common.LoadResponse{StatusCode: 430},
			ExpectedLimitSleep:  expectedSeconds(1),
			ExpectedUpdateSleep: expectedSeconds(10),
		}, {
			Url:                 otherUrl1,
			Response:            &common.LoadResponse{StatusCode: 200},
			ExpectedLimitSleep:  expectedSeconds(2),
			ExpectedUpdateSleep: nil,
		}, {
			Url:                 otherUrl2,
			Response:            &common.LoadResponse{StatusCode: 200},
			ExpectedLimitSleep:  expectedSeconds(2),
			ExpectedUpdateSleep: nil,
		}, {
			Url:                 shopifyUrl1,
			Response:            &common.LoadResponse{StatusCode: 200, Header: shopifyHeaders},
			ExpectedLimitSleep:  expectedSeconds(4),
			ExpectedUpdateSleep: nil,
		}, {
			Url:                 shopifyUrl2,
			Response:            &common.LoadResponse{StatusCode: 200, Header: shopifyHeaders},
			ExpectedLimitSleep:  expectedSeconds(4),
			ExpectedUpdateSleep: nil,
		}, {
			Url:                 testUrl,
			Response:            &common.LoadResponse{StatusCode: 200},
			ExpectedLimitSleep:  nil,
			ExpectedUpdateSleep: nil,
		},
	}

	for i, tc := range testCases {
		t.Run(fmt.Sprintf("%v", i), func(t *testing.T) {
			rl.Limit(tc.Url)

			assert.Equal(t, tc.ExpectedLimitSleep, lastSleep)
			lastSleep = nil

			rl.Update(tc.Url, tc.Response)

			assert.Equal(t, tc.ExpectedUpdateSleep, lastSleep)
			lastSleep = nil
		})
	}
}
