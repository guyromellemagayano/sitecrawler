package common

import (
	"compress/gzip"
	"context"
	"crypto/tls"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/hashicorp/go-retryablehttp"
	"go.uber.org/zap"
)

const (
	timeout   = 5 * time.Second
	sizeLimit = 10 * 1024 * 1024
	userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36"
)

type LoadService interface {
	Load(log *zap.SugaredLogger, url string) (*LoadResponse, error)
	CloseIdleConnections()
}

type loadService struct {
	client *retryablehttp.Client
}

func NewLoadService() *loadService {
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
			ForceAttemptHTTP2:  true,
			DisableCompression: true,
			TLSClientConfig: &tls.Config{
				// we skip default certificate verification and do our own to save details in db
				InsecureSkipVerify: true,
				CipherSuites:       cipherSuites,
				MinVersion:         tls.VersionSSL30,
			},
		},
	}

	return &loadService{
		client: client,
	}
}

func (l *loadService) Load(log *zap.SugaredLogger, url string) (*LoadResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	lr := &LoadResponse{
		cancel: cancel,
	}
	req, err := retryablehttp.NewRequest("GET", url, nil)
	if err != nil {
		return lr, err
	}
	req = req.WithContext(ctx)
	req.Header.Add("Cache-Control", "no-cache")
	req.Header.Add("Accept-Encoding", "gzip")
	req.Header.Add("Accept", "text/html,*/*;q=0.9")
	req.Header.Set("User-Agent", userAgent)
	resp, err := l.client.Do(req)
	if err != nil {
		return lr, err
	}
	lr.close = resp.Body.Close

	lr.Header = resp.Header
	lr.Request = resp.Request
	lr.Status = resp.Status
	lr.StatusCode = resp.StatusCode
	lr.TLS = resp.TLS

	var wrappedBody io.Reader
	wrappedBody = &SizeReader{
		Child: io.LimitReader(resp.Body, sizeLimit),
		Size:  &lr.CompressedSize,
	}
	if strings.EqualFold(resp.Header.Get("Content-Encoding"), "gzip") {
		lr.Compressed = true
		wrappedBody, err = gzip.NewReader(wrappedBody)
		if err != nil {
			return lr, err
		}
	}
	wrappedBody = &SizeReader{
		Child: wrappedBody,
		Size:  &lr.UncompressedSize,
	}

	lr.Body = wrappedBody

	return lr, nil
}

// CloseIdleConnections should be called periodically for long running processes
func (l *loadService) CloseIdleConnections() {
	l.client.HTTPClient.CloseIdleConnections()
}

type LoadResponse struct {
	Header     http.Header
	Request    *http.Request
	Status     string
	StatusCode int
	TLS        *tls.ConnectionState

	Body       io.Reader
	Compressed bool

	// Sizes are of so far read stuff
	UncompressedSize int
	CompressedSize   int

	cancel func()
	close  func() error
}

func (lr *LoadResponse) Close() error {
	lr.cancel()
	if lr.close != nil {
		if err := lr.close(); err != nil {
			return err
		}
	}
	return nil
}

type SizeReader struct {
	Child io.Reader
	Size  *int
}

func (r *SizeReader) Read(p []byte) (int, error) {
	n, err := r.Child.Read(p)
	*r.Size += n
	return n, err
}
