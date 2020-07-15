package main

import (
	"container/list"
	"io"
	"io/ioutil"
	"log"
	"net/url"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/pkg/errors"
)

const (
	depthLimit = 100
	totalLimit = 10000
	sizeLimit  = 10 * 1024 * 1024
)

type ScanService struct {
	ScanDao       *ScanDao
	LinkDao       *LinkDao
	LinkLinkDao   *LinkLinkDao
	VerifyService *VerifyService
	LoadService   *LoadService
}

func (s *ScanService) ScanSite(scanID int) error {
	scan, err := s.ScanDao.ByID(scanID)
	if err != nil {
		return errors.Wrapf(err, "could not get scan id %v", scanID)
	}

	log.Printf("Starting scan for %v", scan.Site.Url)
	defer func() {
		finished := time.Now()
		scan.FinishedAt = &finished
		if err := s.ScanDao.Save(scan); err != nil {
			log.Printf("Failed to set scan finish: %v", err)
		}
		log.Printf("Finished scan for %v", scan.Site.Url)
	}()

	if !scan.Site.Verified {
		return nil
	}

	if err := s.Start(scan); err != nil {
		return err
	}

	return nil
}

func (s *ScanService) Start(scan *CrawlScan) error {
	scanner := &scanner{
		ScanService: s,
		Scan:        scan,

		linkIDs: make(map[string]int),
		fifo:    list.New(),
	}
	return scanner.Start()
}

type fifoEntry struct {
	Url          *url.URL
	Depth        uint
	ParentLinkId int
}

type scanner struct {
	ScanService *ScanService
	Scan        *CrawlScan

	linkIDs map[string]int
	fifo    *list.List
}

func (s *scanner) Start() error {
	u, err := s.normalizeURL(nil, s.Scan.Site.Url)
	if err != nil {
		return err
	}

	s.fifo.PushBack(fifoEntry{
		Url:          u,
		Depth:        0,
		ParentLinkId: -1,
	})

	for s.fifo.Len() > 0 {
		element := s.fifo.Front()
		s.fifo.Remove(element)

		entry := element.Value.(fifoEntry)

		childLinkId, err := s.scanURL(entry.Url, entry.Depth)
		if err != nil {
			return err
		}

		if entry.ParentLinkId != -1 {
			linkLink := &CrawlLinkLink{
				FromLinkID: entry.ParentLinkId,
				ToLinkID:   childLinkId,
			}

			if err := s.ScanService.LinkLinkDao.Save(linkLink); err != nil {
				if !strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
					return err
				}
			}
		}
	}

	return nil
}

func (s *scanner) scanURL(url *url.URL, depth uint) (int, error) {
	if linkID, ok := s.linkIDs[url.String()]; ok {
		return linkID, nil
	}

	link, doc := s.loadURL(url)
	if err := s.ScanService.LinkDao.Save(link); err != nil {
		return 0, err
	}
	s.linkIDs[url.String()] = link.ID
	if doc == nil {
		return link.ID, nil
	}

	if depth > depthLimit || len(s.linkIDs) > totalLimit {
		return link.ID, nil
	}

	doc.Find("a").Each(func(i int, sel *goquery.Selection) {
		href, ok := sel.Attr("href")
		if !ok {
			return
		}

		childUrl, err := s.normalizeURL(url, href)
		if err != nil {
			log.Printf("Could not parse url '%v', on page '%v': %v.", href, url, err)
			return
		}

		s.fifo.PushBack(fifoEntry{
			Url:          childUrl,
			Depth:        depth + 1,
			ParentLinkId: link.ID,
		})
	})

	return link.ID, nil
}

func (s *scanner) loadURL(url *url.URL) (*CrawlLink, *goquery.Document) {
	crawlLink := &CrawlLink{
		ScanID:    s.Scan.ID,
		CreatedAt: time.Now(),
		Url:       url.String(),
		Type:      TYPE_OTHER,
		Status:    STATUS_OK,
	}

	if !s.isWebScheme(url) {
		crawlLink.Type = TYPE_NON_WEB
		return crawlLink, nil
	}

	log.Printf("Loading %v", url)
	start := time.Now()
	defer func() {
		crawlLink.ResponseTime = int(time.Since(start).Milliseconds())
	}()

	handleError := func(err error) {
		if strings.HasSuffix(err.Error(), "context deadline exceeded") {
			crawlLink.Status = STATUS_TIMEOUT
		} else {
			log.Printf("Other error for link %v: %v", url, err)
			crawlLink.Status = STATUS_OTHER_ERROR
			errStr := err.Error()
			crawlLink.Error = &errStr
		}
	}

	resp, err, cancel := s.ScanService.LoadService.Load(url.String())
	defer cancel()
	if err != nil {
		handleError(err)
		return crawlLink, nil
	}
	limitedBody := io.LimitReader(resp.Body, sizeLimit)
	defer func() {
		_, err := io.Copy(ioutil.Discard, limitedBody)
		if err != nil {
			handleError(err)
		}
		err = resp.Body.Close()
		if err != nil {
			handleError(err)
		}
	}()

	statusCode := resp.StatusCode
	crawlLink.HttpStatus = &statusCode
	if statusCode/100 != 2 {
		crawlLink.Status = STATUS_HTTP_ERROR
		statusStr := resp.Status
		crawlLink.Error = &statusStr
		return crawlLink, nil
	}

	contentType := strings.SplitN(resp.Header.Get("Content-Type"), ";", 2)
	if contentType[0] == "text/html" {
		doc, err := goquery.NewDocumentFromReader(limitedBody)
		if err != nil {
			handleError(err)
			return crawlLink, nil
		}

		if s.ScanService.VerifyService.Verify(doc, s.Scan.Site.VerificationID) == nil {
			crawlLink.Type = TYPE_PAGE
			return crawlLink, doc
		}

		crawlLink.Type = TYPE_EXTERNAL
	}

	return crawlLink, nil
}

func (s *scanner) normalizeURL(parent *url.URL, child string) (*url.URL, error) {
	u, err := url.Parse(child)
	if err != nil {
		return nil, err
	}
	u.Fragment = ""
	if parent != nil {
		return parent.ResolveReference(u), nil
	}
	return u, nil
}

func (s *scanner) isWebScheme(u *url.URL) bool {
	scheme := strings.ToLower(u.Scheme)
	return scheme == "http" || scheme == "https"
}
