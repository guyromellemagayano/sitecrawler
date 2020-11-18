package main

import (
	"context"
	"io"
	"io/ioutil"
	"net/url"
	"strings"
	"time"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
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
	Database           *database.Database
	VerifyService      *VerifyService
	LoadService        *LoadService
	BackendService     *BackendService
	PostprocessService *PostprocessService
}

func (s *ScanService) ScanSite(ctx context.Context, log *zap.SugaredLogger, scanID int) error {
	exists, err := s.Database.ScanDao.Exists(scanID)
	if err != nil {
		return errors.Wrapf(err, "could not check if scan id %v exists", scanID)
	}
	// We have site delete, so it might happen that everything explodes during scan
	if !exists {
		return nil
	}

	scan := &database.CrawlScan{ID: scanID}
	err = s.Database.ByID(scan, database.WithRelation("Site"))
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

	if err := s.Start(ctx, log, scan); err != nil {
		return err
	}

	// Start will only error on recoverable errors, so we will retry on those (with sqs)
	// If we got here without errors, set the status done
	finished := time.Now()
	scan.FinishedAt = &finished
	if err := s.Database.Update(scan); err != nil {
		return err
	}
	log.Infof("Finished scan for %v", scan.Site.Url)

	if err := s.BackendService.SendFinishedEmail(scan); err != nil {
		log.Errorw("Could not send crawl finished email",
			"scan_id", scan.ID,
			"error", err,
		)
	}

	return nil
}

func (s *ScanService) reverify(log *zap.SugaredLogger, scan *database.CrawlScan) error {
	return s.VerifyService.VerifySite(log, scan.SiteID)
}

func (s *ScanService) Start(ctx context.Context, log *zap.SugaredLogger, scan *database.CrawlScan) error {
	linkCache, err := NewLinkCache(s.Database, scan.ID)
	if err != nil {
		return err
	}
	fifoCache, err := NewFifoCache(s.Database, scan.ID)
	if err != nil {
		return err
	}

	scanner := &scanner{
		ScanService: s,
		Scan:        scan,

		tlsCache:  NewTlsCache(),
		rateLimit: NewRateLimit(),
		linkCache: linkCache,
		fifoCache: fifoCache,
	}
	return scanner.Start(ctx, log)
}

type scanner struct {
	ScanService *ScanService
	Scan        *database.CrawlScan

	tlsCache  *TlsCache
	rateLimit *RateLimit
	linkCache *LinkCache
	fifoCache *FifoCache
}

func (s *scanner) Start(ctx context.Context, log *zap.SugaredLogger) error {
	u, err := s.normalizeURL("", s.Scan.Site.Url)
	if err != nil {
		return err
	}

	if s.fifoCache.Len() == 0 {
		s.addLinkWithRelation(log, s.ScanService.Database, fifoEntry{
			Url:   u,
			Depth: 0,
		}, relation{ChildType: CHILD_NONE})
	}

	for s.fifoCache.Len() > 0 {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		err := s.ScanService.Database.RunInTransaction(func(db *database.Database) error {
			entry := s.fifoCache.Front()

			childLinkId, err := s.scanURL(log, db, entry.Url, entry.Depth)
			if err != nil {
				return err
			}

			for _, r := range entry.Relations {
				if err := s.saveRelation(db, r, childLinkId); err != nil {
					return err
				}
			}

			if err := s.fifoCache.DeleteFront(db); err != nil {
				return err
			}

			return nil
		})
		if err != nil {
			return err
		}
	}

	return nil
}

func (s *scanner) scanURL(log *zap.SugaredLogger, db *database.Database, sourceUrl *url.URL, depth uint) (int, error) {
	if linkID, ok := s.linkCache.LinkIDs[sourceUrl.String()]; ok {
		return linkID, nil
	}

	link, doc := s.loadURL(log, db, sourceUrl)
	// Recheck "destination url after redirects" if it's in cache
	if linkID, ok := s.linkCache.LinkIDs[link.Url]; ok {
		return linkID, nil
	}

	// save new link
	if err := db.Insert(link); err != nil {
		return 0, err
	}
	if err := s.ScanService.PostprocessService.OnLink(db, link); err != nil {
		return link.ID, err
	}

	// cache both source and destination id
	s.linkCache.Add(link)
	s.linkCache.LinkIDs[sourceUrl.String()] = link.ID

	// If we have doc, than it's a page and we descend the scan, otherwise return
	if doc == nil {
		return link.ID, nil
	}

	// save page stuff
	if err := s.savePageData(db, doc, link.ID); err != nil {
		log.Errorf("Could not save page data for link %v: %v", link.ID, err)
	}

	// check crawl limits
	if depth > depthLimit {
		log.Errorw("Depth limit hit",
			"link_id", link.ID,
		)
		return link.ID, nil
	}
	if s.linkCache.PageCount > pageLimit {
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

		s.addLinkWithRelation(log, db, fifoEntry{
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

		s.addLinkWithRelation(log, db, fifoEntry{
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

		s.addLinkWithRelation(log, db, fifoEntry{
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

		s.addLinkWithRelation(log, db, fifoEntry{
			Url:   childUrl,
			Depth: depth + 1,
		}, relation{
			ParentId:  link.ID,
			ChildType: CHILD_STYLESHEET,
		})
	})

	return link.ID, nil
}

func (s *scanner) loadURL(log *zap.SugaredLogger, db *database.Database, url *url.URL) (*database.CrawlLink, *goquery.Document) {
	crawlLink := &database.CrawlLink{
		ScanID:    s.Scan.ID,
		CreatedAt: time.Now(),
		Url:       lenLimit(url.String(), 2047),
		Type:      common.TYPE_OTHER,
		Status:    common.STATUS_OK,
		TlsStatus: common.TLS_OK,
	}

	if !s.isWebScheme(url) {
		crawlLink.Type = common.TYPE_NON_WEB
		return crawlLink, nil
	}

	s.rateLimit.Limit(url)

	start := time.Now()
	defer func() {
		crawlLink.ResponseTime = int(time.Since(start).Milliseconds())
	}()

	handleError := func(err error) {
		if strings.HasSuffix(err.Error(), "context deadline exceeded") {
			crawlLink.Status = common.STATUS_TIMEOUT
		} else if strings.HasSuffix(err.Error(), "stopped after 10 redirects") {
			crawlLink.Status = common.STATUS_TOO_MANY_REDIRECTS
		} else {
			if !strings.HasSuffix(err.Error(), "unexpected EOF") &&
				!strings.HasSuffix(err.Error(), "server replied with more than declared Content-Length; truncated") &&
				!strings.HasSuffix(err.Error(), "connection reset by peer") {
				log.Errorw("Other error for link",
					"url", url,
					"error", err,
				)
			}
			crawlLink.Status = common.STATUS_OTHER_ERROR
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

	s.rateLimit.Update(url, resp)

	tlsStatus, tlsId, err := s.tlsCache.Extract(db, resp.TLS, resp.Request)
	if err != nil {
		log.Error(err)
	} else {
		crawlLink.TlsStatus = tlsStatus
		crawlLink.TlsID = tlsId
	}

	statusCode := resp.StatusCode
	crawlLink.HttpStatus = &statusCode
	if statusCode/100 != 2 {
		crawlLink.Status = common.STATUS_HTTP_ERROR
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
			crawlLink.Type = common.TYPE_PAGE
			return crawlLink, doc
		}

		crawlLink.Type = common.TYPE_EXTERNAL
	}

	return crawlLink, nil
}

func (s *scanner) savePageData(db *database.Database, doc *goquery.Document, linkID int) error {
	title := doc.Find("title").First().Text()
	description := strings.TrimSpace(doc.Find("meta[name=description]").First().AttrOr("content", ""))
	h1First := strings.TrimSpace(doc.Find("h1").First().Text())
	h1Second := strings.TrimSpace(doc.Find("h1").Eq(1).Text())
	h2First := strings.TrimSpace(doc.Find("h2").First().Text())
	h2Second := strings.TrimSpace(doc.Find("h2").Eq(1).Text())
	return db.Insert(&database.CrawlPagedatum{
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
func (s *scanner) addLinkWithRelation(log *zap.SugaredLogger, db *database.Database, fe fifoEntry, r relation) {
	urlStr := fe.Url.String()

	// bypass fifo if url has been scanned already
	if childId, ok := s.linkCache.LinkIDs[urlStr]; ok {
		if err := s.saveRelation(db, r, childId); err != nil {
			log.Errorf("Could not save relation: %v", err)
		}
		// if url is already in fifo just add r to it's relations
	} else if oldFe := s.fifoCache.Get(urlStr); oldFe != nil {
		if err := s.fifoCache.AddRelation(db, urlStr, r); err != nil {
			log.Errorf("Could not add relation to fifo: %v", err)
		}
		// add to fifo if not hiting total limit
	} else if len(s.linkCache.LinkIDs)+s.fifoCache.Len() <= totalLimit {
		fep := &fe
		fep.Relations = []relation{r}
		if err := s.fifoCache.Add(db, s.Scan.ID, fep); err != nil {
			log.Errorf("Could not add to fifo: %v", err)
		}
	} else {
		log.Errorw("Total limit hit",
			"url", fe.Url,
		)
	}
}

func (s *scanner) saveRelation(db *database.Database, r relation, childLinkId int) error {
	switch r.ChildType {
	case CHILD_LINK:
		linkLink := &database.CrawlLinkLink{
			FromLinkID: r.ParentId,
			ToLinkID:   childLinkId,
		}

		inserted, err := db.InsertIgnoreDuplicates(linkLink)
		if err != nil {
			return err
		}
		if inserted {
			if err := s.ScanService.PostprocessService.OnLinkLink(db, linkLink); err != nil {
				return err
			}
		}
	case CHILD_IMAGE:
		linkImage := &database.CrawlLinkImage{
			FromLinkID: r.ParentId,
			ToLinkID:   childLinkId,
		}

		inserted, err := db.InsertIgnoreDuplicates(linkImage)
		if err != nil {
			return err
		}
		if inserted {
			if err := s.ScanService.PostprocessService.OnLinkImage(db, linkImage); err != nil {
				return err
			}
		}
	case CHILD_SCRIPT:
		linkScript := &database.CrawlLinkScript{
			FromLinkID: r.ParentId,
			ToLinkID:   childLinkId,
		}

		inserted, err := db.InsertIgnoreDuplicates(linkScript)
		if err != nil {
			return err
		}
		if inserted {
			if err := s.ScanService.PostprocessService.OnLinkScript(db, linkScript); err != nil {
				return err
			}
		}
	case CHILD_STYLESHEET:
		linkStylesheet := &database.CrawlLinkStylesheet{
			FromLinkID: r.ParentId,
			ToLinkID:   childLinkId,
		}

		inserted, err := db.InsertIgnoreDuplicates(linkStylesheet)
		if err != nil {
			return err
		}
		if inserted {
			if err := s.ScanService.PostprocessService.OnLinkStylesheet(db, linkStylesheet); err != nil {
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
