package main

import (
	"container/list"
	"io"
	"io/ioutil"
	"net/url"
	"strings"
	"time"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/PuerkitoBio/goquery"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

const (
	depthLimit = 1000
	pageLimit  = 10000
	totalLimit = 1000000
)

const (
	CHILD_LINK = iota
	CHILD_IMAGE
	CHILD_STYLESHEET
	CHILD_SCRIPT

	CHILD_NONE = 127
)

type ScanService struct {
	ScanDao           *ScanDao
	LinkDao           *LinkDao
	LinkLinkDao       *LinkLinkDao
	LinkImageDao      *LinkImageDao
	LinkScriptDao     *LinkScriptDao
	LinkStylesheetDao *LinkStylesheetDao
	PageDataDao       *PageDataDao
	TlsDao            *TlsDao
	VerifyService     *VerifyService
	LoadService       *LoadService
}

func (s *ScanService) ScanSite(log *zap.SugaredLogger, scanID int) error {
	exists, err := s.ScanDao.Exists(scanID)
	if err != nil {
		return errors.Wrapf(err, "could not check if scan id %v exists", scanID)
	}
	// We have site delete, so it might happen that everything explodes during scan
	if !exists {
		return nil
	}

	scan, err := s.ScanDao.ByID(scanID)
	if err != nil {
		return errors.Wrapf(err, "could not get scan id %v", scanID)
	}

	if err := s.reverify(log, scan); err != nil {
		return err
	}

	log.Infof("Starting scan for %v", scan.Site.Url)

	if !scan.Site.Verified {
		return nil
	}
	if scan.FinishedAt != nil {
		return nil
	}

	if err := s.PageDataDao.DeleteAllForScan(scanID); err != nil {
		return err
	}
	if err := s.LinkLinkDao.DeleteAllForScan(scanID); err != nil {
		return err
	}
	if err := s.LinkImageDao.DeleteAllForScan(scanID); err != nil {
		return err
	}
	if err := s.LinkScriptDao.DeleteAllForScan(scanID); err != nil {
		return err
	}
	if err := s.LinkStylesheetDao.DeleteAllForScan(scanID); err != nil {
		return err
	}
	if err := s.LinkDao.DeleteAllForScan(scanID); err != nil {
		return err
	}

	if err := s.Start(log, scan); err != nil {
		return err
	}

	// Start will only error on recoverable errors, so we will retry on those (with sqs)
	// If we got here without errors, set the status done
	finished := time.Now()
	scan.FinishedAt = &finished
	if err := s.ScanDao.Save(scan); err != nil {
		log.Errorf("Failed to set scan finish: %v", err)
	}
	log.Infof("Finished scan for %v", scan.Site.Url)

	return nil
}

func (s *ScanService) reverify(log *zap.SugaredLogger, scan *common.CrawlScan) error {
	return s.VerifyService.VerifySite(log, scan.SiteID)
}

func (s *ScanService) Start(log *zap.SugaredLogger, scan *common.CrawlScan) error {
	scanner := &scanner{
		ScanService: s,
		Scan:        scan,

		tlsCache: NewTlsCache(s.TlsDao),

		linkIDs: make(map[string]int),

		fifo:   list.New(),
		inFifo: make(map[string]*fifoEntry),
	}
	return scanner.Start(log)
}

type relation struct {
	ParentId  int
	ChildType uint8
}

type fifoEntry struct {
	Url       *url.URL
	Depth     uint
	Relations []relation
}

type scanner struct {
	ScanService *ScanService
	Scan        *common.CrawlScan

	tlsCache *TlsCache

	linkIDs map[string]int

	fifo   *list.List
	inFifo map[string]*fifoEntry

	pageCount int
}

func (s *scanner) Start(log *zap.SugaredLogger) error {
	u, err := s.normalizeURL("", s.Scan.Site.Url)
	if err != nil {
		return err
	}

	s.addLinkWithRelation(log, fifoEntry{
		Url:   u,
		Depth: 0,
	}, relation{ChildType: CHILD_NONE})

	for s.fifo.Len() > 0 {
		entry := s.popFifo()

		childLinkId, err := s.scanURL(log, entry.Url, entry.Depth)
		if err != nil {
			return err
		}

		for _, r := range entry.Relations {
			if err := s.saveRelation(r, childLinkId); err != nil {
				return err
			}
		}
	}

	return nil
}

func (s *scanner) scanURL(log *zap.SugaredLogger, sourceUrl *url.URL, depth uint) (int, error) {
	if linkID, ok := s.linkIDs[sourceUrl.String()]; ok {
		return linkID, nil
	}

	link, doc := s.loadURL(log, sourceUrl)
	// Recheck "destination url after redirects" if it's in cache
	if linkID, ok := s.linkIDs[link.Url]; ok {
		return linkID, nil
	}

	// save new link
	if err := s.ScanService.LinkDao.Save(link); err != nil {
		return 0, err
	}

	// cache both source and destination id
	s.linkIDs[sourceUrl.String()] = link.ID
	s.linkIDs[link.Url] = link.ID

	// If we have doc, than it's a page and we descend the scan, otherwise return
	if doc == nil {
		return link.ID, nil
	}

	// save page stuff
	s.pageCount++
	if err := s.savePageData(doc, link.ID); err != nil {
		log.Errorf("Could not save page data for link %v: %v", link.ID, err)
	}

	// check crawl limits
	if depth > depthLimit {
		log.Errorw("Depth limit hit",
			"link_id", link.ID,
		)
		return link.ID, nil
	}
	if s.pageCount > pageLimit {
		log.Errorw("Page limit hit",
			"link_id", link.ID,
		)
		return link.ID, nil
	}

	// get links, images, scripts, ... for further crawling
	doc.Find("a").Each(func(i int, sel *goquery.Selection) {
		href, ok := sel.Attr("href")
		if !ok {
			return
		}

		childUrl, err := s.normalizeURL(link.Url, href)
		if err != nil {
			log.Errorw(
				"Could not parse url",
				"href", href,
				"base_url", link.Url,
				"error", err,
			)
			return
		}

		s.addLinkWithRelation(log, fifoEntry{
			Url:   childUrl,
			Depth: depth + 1,
		}, relation{
			ParentId:  link.ID,
			ChildType: CHILD_LINK,
		})
	})

	doc.Find("img").Each(func(i int, sel *goquery.Selection) {
		href, ok := sel.Attr("src")
		if !ok {
			return
		}

		childUrl, err := s.normalizeURL(link.Url, href)
		if err != nil {
			log.Errorw(
				"Could not parse url",
				"href", href,
				"base_url", link.Url,
				"error", err,
			)
			return
		}

		s.addLinkWithRelation(log, fifoEntry{
			Url:   childUrl,
			Depth: depth + 1,
		}, relation{
			ParentId:  link.ID,
			ChildType: CHILD_IMAGE,
		})
	})

	doc.Find("script").Each(func(i int, sel *goquery.Selection) {
		href, ok := sel.Attr("src")
		if !ok {
			return
		}

		childUrl, err := s.normalizeURL(link.Url, href)
		if err != nil {
			log.Errorw(
				"Could not parse url",
				"href", href,
				"base_url", link.Url,
				"error", err,
			)
			return
		}

		s.addLinkWithRelation(log, fifoEntry{
			Url:   childUrl,
			Depth: depth + 1,
		}, relation{
			ParentId:  link.ID,
			ChildType: CHILD_SCRIPT,
		})
	})

	doc.Find("link[rel=stylesheet]").Each(func(i int, sel *goquery.Selection) {
		href, ok := sel.Attr("href")
		if !ok {
			return
		}

		childUrl, err := s.normalizeURL(link.Url, href)
		if err != nil {
			log.Errorw(
				"Could not parse url",
				"href", href,
				"base_url", link.Url,
				"error", err,
			)
			return
		}

		s.addLinkWithRelation(log, fifoEntry{
			Url:   childUrl,
			Depth: depth + 1,
		}, relation{
			ParentId:  link.ID,
			ChildType: CHILD_STYLESHEET,
		})
	})

	return link.ID, nil
}

func (s *scanner) loadURL(log *zap.SugaredLogger, url *url.URL) (*common.CrawlLink, *goquery.Document) {
	crawlLink := &common.CrawlLink{
		ScanID:    s.Scan.ID,
		CreatedAt: time.Now(),
		Url:       lenLimit(url.String(), 2047),
		Type:      TYPE_OTHER,
		Status:    STATUS_OK,
		TlsStatus: TLS_OK,
	}

	if !s.isWebScheme(url) {
		crawlLink.Type = TYPE_NON_WEB
		return crawlLink, nil
	}

	start := time.Now()
	defer func() {
		crawlLink.ResponseTime = int(time.Since(start).Milliseconds())
	}()

	handleError := func(err error) {
		if strings.HasSuffix(err.Error(), "context deadline exceeded") {
			crawlLink.Status = STATUS_TIMEOUT
		} else if strings.HasSuffix(err.Error(), "stopped after 10 redirects") {
			crawlLink.Status = STATUS_TOO_MANY_REDIRECTS
		} else {
			if !strings.HasSuffix(err.Error(), "unexpected EOF") &&
				!strings.HasSuffix(err.Error(), "server replied with more than declared Content-Length; truncated") {
				log.Errorw("Other error for link",
					"url", url,
					"error", err,
				)
			}
			crawlLink.Status = STATUS_OTHER_ERROR
			errStr := lenLimit(err.Error(), 255)
			crawlLink.Error = &errStr
		}
	}

	resp, err := s.ScanService.LoadService.Load(log, url.String())
	defer resp.Close()
	if err != nil {
		handleError(err)
		return crawlLink, nil
	}
	defer func() {
		_, err := io.Copy(ioutil.Discard, resp.Body)
		if err != nil {
			handleError(err)
		}
		crawlLink.Size = resp.CompressedSize
		err = resp.Close()
		if err != nil {
			handleError(err)
		}
	}()

	// Override url with actual destination url after redirects
	crawlLink.Url = lenLimit(resp.Request.URL.String(), 2047)

	tlsStatus, tlsId, err := s.tlsCache.Extract(resp.TLS, resp.Request)
	if err != nil {
		log.Error(err)
	} else {
		crawlLink.TlsStatus = tlsStatus
		crawlLink.TlsID = tlsId
	}

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
		doc, err := goquery.NewDocumentFromReader(resp.Body)
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

func (s *scanner) savePageData(doc *goquery.Document, linkID int) error {
	title := doc.Find("title").First().Text()
	description := strings.TrimSpace(doc.Find("meta[name=description]").First().AttrOr("content", ""))
	h1First := strings.TrimSpace(doc.Find("h1").First().Text())
	h1Second := strings.TrimSpace(doc.Find("h1").Eq(1).Text())
	h2First := strings.TrimSpace(doc.Find("h2").First().Text())
	h2Second := strings.TrimSpace(doc.Find("h2").Eq(1).Text())
	return s.ScanService.PageDataDao.Save(&common.CrawlPagedatum{
		LinkID: linkID,

		Title:       title,
		Description: description,
		H1First:     h1First,
		H1Second:    h1Second,
		H2First:     h2First,
		H2Second:    h2Second,
	})

}

// adds link to fifo for scanning, save relation to parent objects
func (s *scanner) addLinkWithRelation(log *zap.SugaredLogger, fe fifoEntry, r relation) {
	urlStr := fe.Url.String()

	// bypass fifo if url has been scanned already
	if childId, ok := s.linkIDs[urlStr]; ok {
		if err := s.saveRelation(r, childId); err != nil {
			log.Errorf("Could not save relation: %v", err)
		}
		// if url is already in fifo just add r to it's relations
	} else if oldFe, ok := s.inFifo[urlStr]; ok {
		if r.ChildType != CHILD_NONE {
			oldFe.Relations = append(oldFe.Relations, r)
		}
		// add to fifo if not hiting total limit
	} else if len(s.linkIDs)+len(s.inFifo) <= totalLimit {
		fep := &fe
		fep.Relations = []relation{r}
		s.fifo.PushBack(fep)
		s.inFifo[urlStr] = fep
	} else {
		log.Errorw("Total limit hit",
			"url", fe.Url,
		)
	}
}

func (s *scanner) popFifo() *fifoEntry {
	element := s.fifo.Front()
	entry := element.Value.(*fifoEntry)

	s.fifo.Remove(element)
	delete(s.inFifo, entry.Url.String())

	return entry
}

func (s *scanner) saveRelation(r relation, childLinkId int) error {
	switch r.ChildType {
	case CHILD_LINK:
		linkLink := &common.CrawlLinkLink{
			FromLinkID: r.ParentId,
			ToLinkID:   childLinkId,
		}

		if err := s.ScanService.LinkLinkDao.Save(linkLink); err != nil {
			if !strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
				return err
			}
		}
	case CHILD_IMAGE:
		linkImage := &common.CrawlLinkImage{
			FromLinkID: r.ParentId,
			ToLinkID:   childLinkId,
		}

		if err := s.ScanService.LinkImageDao.Save(linkImage); err != nil {
			if !strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
				return err
			}
		}
	case CHILD_SCRIPT:
		linkScript := &common.CrawlLinkScript{
			FromLinkID: r.ParentId,
			ToLinkID:   childLinkId,
		}

		if err := s.ScanService.LinkScriptDao.Save(linkScript); err != nil {
			if !strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
				return err
			}
		}
	case CHILD_STYLESHEET:
		linkStylesheet := &common.CrawlLinkStylesheet{
			FromLinkID: r.ParentId,
			ToLinkID:   childLinkId,
		}

		if err := s.ScanService.LinkStylesheetDao.Save(linkStylesheet); err != nil {
			if !strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
				return err
			}
		}
	}
	return nil
}

// normalizeUrl resolves urls by parent reference and removes query params and anchors
func (s *scanner) normalizeURL(parent string, child string) (*url.URL, error) {
	// Remove leading and trailing whitespace
	child = strings.TrimSpace(child)
	// Remove new lines from the middle of url
	// (spaces break urls, but new lines don't in chrome)
	child = strings.ReplaceAll(child, "\n", "")

	u, err := url.Parse(child)
	if err != nil {
		return nil, err
	}
	u.Fragment = ""
	u.RawQuery = ""
	if parent != "" {
		parentUrl, err := url.Parse(parent)
		if err != nil {
			return nil, err
		}
		return parentUrl.ResolveReference(u), nil
	}
	return u, nil
}

func (s *scanner) isWebScheme(u *url.URL) bool {
	scheme := strings.ToLower(u.Scheme)
	return scheme == "http" || scheme == "https"
}

func lenLimit(s string, limit int) string {
	if len(s) > limit {
		return s[:limit]
	}
	return s
}
