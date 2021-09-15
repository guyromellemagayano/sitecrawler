package main

import (
	"context"
	"io"
	"io/ioutil"
	"net/http"
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
	Database       *database.Database
	VerifyService  *common.VerifyService
	LoadService    common.LoadService
	BackendService *common.BackendService
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

	if scan.FinishedAt != nil {
		return nil
	}
	if scan.Site.DeletedAt != nil {
		return nil
	}

	log.Infof("Starting scan for %v", scan.Site.Url)

	defer s.LoadService.CloseIdleConnections()

	if err := s.Start(ctx, log, scan); err != nil {
		return err
	}

	// Start will only error on recoverable errors, so we will retry on those (with sqs)
	// If we got here without errors, set the status done
	finished := time.Now()
	scan.FinishedAt = &finished

	forceHttps, err := s.checkForceHttps(log, scan.Site.Url)
	if err != nil {
		log.Errorw("Error checking force https",
			"err", err,
		)
	} else {
		scan.ForceHttps = &forceHttps
	}

	if err := s.Database.Update(scan); err != nil {
		return errors.Wrap(err, "could not update scan on finish")
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

func (s *ScanService) checkForceHttps(log *zap.SugaredLogger, urlStr string) (bool, error) {
	u, err := url.Parse(urlStr)
	if err != nil {
		return false, err
	}
	u.Scheme = "http"

	resp, err := s.LoadService.Load(log, u.String())
	defer resp.Close()
	if err != nil {
		return false, err
	}

	return resp.Request.URL.Scheme == "https", nil
}

func (s *ScanService) Start(ctx context.Context, log *zap.SugaredLogger, scan *database.CrawlScan) error {
	linkCache, err := NewLinkCache(s.Database, scan.ID)
	if err != nil {
		return errors.Wrap(err, "could not init link cache")
	}
	fifoCache, err := NewQueueDb(s.Database, scan.ID, NewQueueCacheFifo())
	if err != nil {
		return errors.Wrap(err, "could not init fifo cache")
	}

	scanner := &scanner{
		ScanService: s,
		Scan:        scan,

		postprocessor: NewPostprocessorStack(),
		tlsCache:      NewTlsCache(),
		rateLimit:     NewRateLimit(),
		linkCache:     linkCache,
		queue:         fifoCache,
	}
	return scanner.Start(ctx, log)
}

type scanner struct {
	ScanService *ScanService
	Scan        *database.CrawlScan

	tlsCache      *TlsCache
	rateLimit     *RateLimit
	linkCache     *LinkCache
	queue         Queue
	postprocessor Postprocessor
}

func (s *scanner) Start(ctx context.Context, log *zap.SugaredLogger) error {
	u, err := s.normalizeURL("", s.Scan.Site.Url)
	if err != nil {
		return errors.Wrap(err, "could not normalize site url")
	}

	l, err := s.queue.Len(s.ScanService.Database)
	if err != nil {
		return errors.Wrap(err, "could not get start queue length")
	}
	if l == 0 {
		s.addLinkWithRelation(log, s.ScanService.Database, &QueueEntry{
			Url:   u,
			Depth: 0,
		}, QueueRelation{ChildType: CHILD_NONE})
		l++
	}

	for l > 0 {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		err := s.ScanService.Database.RunInTransaction(func(db *database.Database) error {
			entry, err := s.queue.Front(db)
			if err != nil {
				return errors.Wrap(err, "could not get queue front")
			}

			log.Info(entry)
			childLinkId, err := s.scanURL(log, db, entry)
			if err != nil {
				return err
			}

			relations, err := s.queue.GetRelations(db, entry.Url)
			if err != nil {
				return errors.Wrap(err, "could not get relations")
			}

			for _, r := range relations {
				if err := s.saveRelation(db, r, childLinkId); err != nil {
					return errors.Wrap(err, "could not save relation")
				}
			}

			// Warning: if postprocessors cache commands, then this prevents parallel scanning
			// This is not thread safe!
			if err := s.postprocessor.Flush(db); err != nil {
				return errors.Wrap(err, "could not flush postprocessors")
			}

			if err := s.queue.DeleteFront(db); err != nil {
				return errors.Wrap(err, "could not delete queue cache entry")
			}

			return nil
		})
		if err != nil {
			return errors.Wrap(err, "scan transaction failed")
		}

		l, err = s.queue.Len(s.ScanService.Database)
		if err != nil {
			return errors.Wrap(err, "could not get start queue length")
		}
	}

	return nil
}

func (s *scanner) scanURL(log *zap.SugaredLogger, db *database.Database, entry *QueueEntry) (int, error) {
	if linkID, ok := s.linkCache.LinkIDs[entry.Url]; ok {
		return linkID, nil
	}

	link, doc := s.loadURL(log, db, entry.Url)
	// Recheck "destination url after redirects" if it's in cache
	if linkID, ok := s.linkCache.LinkIDs[link.Url]; ok {
		return linkID, nil
	}

	// save new link
	if err := db.Insert(link); err != nil {
		return 0, errors.Wrap(err, "could not insert link")
	}
	if err := s.postprocessor.OnLink(db, link); err != nil {
		return link.ID, errors.Wrap(err, "could not postprocess link")
	}

	// cache both source and destination id
	s.linkCache.Add(link)
	s.linkCache.LinkIDs[entry.Url] = link.ID

	// If we have doc, than it's a page and we descend the scan, otherwise return
	if doc == nil {
		return link.ID, nil
	}

	// save page stuff
	if err := s.savePageData(db, doc, link.ID); err != nil {
		log.Errorf("Could not save page data for link %v: %v", link.ID, err)
	}

	// check crawl limits
	if entry.Depth > depthLimit {
		log.Warnw("Depth limit hit",
			"link_id", link.ID,
		)
		return link.ID, nil
	}
	if s.linkCache.PageCount > pageLimit {
		log.Warnw("Page limit hit",
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

		s.addLinkWithRelation(log, db, &QueueEntry{
			Url:   childUrl,
			Depth: entry.Depth + 1,
		}, QueueRelation{
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

		rel := QueueRelation{
			ParentId:  link.ID,
			ChildType: CHILD_IMAGE,
		}

		alt, ok := sel.Attr("alt")
		if ok {
			rel.SetData("AltText", alt)
		}

		s.addLinkWithRelation(log, db, &QueueEntry{
			Url:   childUrl,
			Depth: entry.Depth + 1,
		}, rel)
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

		s.addLinkWithRelation(log, db, &QueueEntry{
			Url:   childUrl,
			Depth: entry.Depth + 1,
		}, QueueRelation{
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

		s.addLinkWithRelation(log, db, &QueueEntry{
			Url:   childUrl,
			Depth: entry.Depth + 1,
		}, QueueRelation{
			ParentId:  link.ID,
			ChildType: CHILD_STYLESHEET,
		})
	})

	return link.ID, nil
}

func (s *scanner) loadURL(log *zap.SugaredLogger, db *database.Database, urlStr string) (*database.CrawlLink, *goquery.Document) {
	crawlLink := &database.CrawlLink{
		ScanID:    s.Scan.ID,
		CreatedAt: time.Now(),
		Url:       common.LenLimit(urlStr, 2047),
		Type:      common.TYPE_OTHER,
		Status:    common.STATUS_OK,
		TlsStatus: common.TLS_OK,
	}

	handleError := func(err error) {
		status, errStr := common.SerializeLoadError(log, urlStr, err)
		crawlLink.Status = status
		crawlLink.Error = &errStr
	}

	u, err := url.Parse(urlStr)
	if err != nil {
		handleError(err)
		return crawlLink, nil
	}

	if !s.isWebScheme(u) {
		crawlLink.Type = common.TYPE_NON_WEB
		return crawlLink, nil
	}

	s.rateLimit.Limit(u)

	start := time.Now()
	defer func() {
		crawlLink.ResponseTime = int(time.Since(start).Milliseconds())
	}()

	resp, err := s.ScanService.LoadService.Load(log, urlStr)
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
	crawlLink.Url = common.LenLimit(resp.Request.URL.String(), 2047)

	s.rateLimit.Update(u, resp)

	tlsStatus, tlsId, err := s.tlsCache.Extract(db, resp.TLS, resp.Request)
	if err != nil {
		log.Errorw("Tls extract error",
			"err", err,
		)
	} else {
		crawlLink.TlsStatus = tlsStatus
		crawlLink.TlsID = tlsId
	}

	statusCode := resp.StatusCode
	crawlLink.HttpStatus = &statusCode

	if handled, err := s.handleCloudflare(resp, crawlLink); handled {
		if err != nil {
			handleError(err)
			return crawlLink, nil
		}
		return crawlLink, nil
	}

	if statusCode/100 != 2 {
		crawlLink.Status = common.STATUS_HTTP_ERROR
		statusStr := resp.Status
		crawlLink.Error = &statusStr
		return crawlLink, nil
	}

	if s.isHtmlContent(resp) {
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

// adds link to queue for scanning, save relation to parent objects
func (s *scanner) addLinkWithRelation(log *zap.SugaredLogger, db *database.Database, entry *QueueEntry, r QueueRelation) {
	// bypass queue if url has been scanned already
	if childId, ok := s.linkCache.LinkIDs[entry.Url]; ok {
		if err := s.saveRelation(db, r, childId); err != nil {
			log.Errorf("Could not save relation: %v", err)
		}
		// if url is already in queue just add r to it's relations
	} else {
		exists, err := s.queue.Exists(db, entry.Url)
		if err != nil {
			log.Errorf("Could not check if link exists in queue: %v", err)
		} else if exists {
			if err := s.queue.AddRelation(db, entry.Url, r); err != nil {
				log.Errorf("Could not add relation to queue: %v", err)
			}
			// add to queue if not hiting total limit
		} else {
			queueLen, err := s.queue.Len(db)
			if err != nil {
				log.Errorf("Could not get queue len: %v", err)
			} else if len(s.linkCache.LinkIDs)+queueLen <= totalLimit {
				if err := s.queue.Add(db, entry); err != nil {
					log.Errorf("Could not add entry to queue: %v", err)
				}
				if err := s.queue.AddRelation(db, entry.Url, r); err != nil {
					log.Errorf("Could not add relation to queue: %v", err)
				}
			} else {
				log.Warnw("Total limit hit",
					"url", entry.Url,
				)
			}
		}
	}
}

func (s *scanner) saveRelation(db *database.Database, r QueueRelation, childLinkId int) error {
	switch r.ChildType {
	case CHILD_LINK:
		linkLink := &database.CrawlLinkLink{
			FromLinkID: r.ParentId,
			ToLinkID:   childLinkId,
		}

		inserted, err := db.InsertIgnoreDuplicates(linkLink)
		if err != nil {
			return errors.Wrap(err, "could not insert link link")
		}
		if inserted {
			if err := s.postprocessor.OnLinkLink(db, linkLink); err != nil {
				return errors.Wrap(err, "could not postprocess link link")
			}
		}
	case CHILD_IMAGE:
		linkImage := &database.CrawlLinkImage{
			FromLinkID: r.ParentId,
			ToLinkID:   childLinkId,
		}

		if r.Data["AltText"] != nil {
			altText := r.Data["AltText"].(string)
			linkImage.AltText = &altText
		}

		inserted, err := db.InsertIgnoreDuplicates(linkImage)
		if err != nil {
			return errors.Wrap(err, "could not insert link image")
		}
		if inserted {
			if err := s.postprocessor.OnLinkImage(db, linkImage); err != nil {
				return errors.Wrap(err, "could not postprocess link image")
			}
		}
	case CHILD_SCRIPT:
		linkScript := &database.CrawlLinkScript{
			FromLinkID: r.ParentId,
			ToLinkID:   childLinkId,
		}

		inserted, err := db.InsertIgnoreDuplicates(linkScript)
		if err != nil {
			return errors.Wrap(err, "could not insert link script")
		}
		if inserted {
			if err := s.postprocessor.OnLinkScript(db, linkScript); err != nil {
				return errors.Wrap(err, "could not postprocess link script")
			}
		}
	case CHILD_STYLESHEET:
		linkStylesheet := &database.CrawlLinkStylesheet{
			FromLinkID: r.ParentId,
			ToLinkID:   childLinkId,
		}

		inserted, err := db.InsertIgnoreDuplicates(linkStylesheet)
		if err != nil {
			return errors.Wrap(err, "could not insert link stylesheet")
		}
		if inserted {
			if err := s.postprocessor.OnLinkStylesheet(db, linkStylesheet); err != nil {
				return errors.Wrap(err, "could not postprocess link stylesheet")
			}
		}
	}
	return nil
}

// normalizeUrl resolves urls by parent reference and removes query params and anchors
func (s *scanner) normalizeURL(parent string, child string) (string, error) {
	// Remove leading and trailing whitespace
	child = strings.TrimSpace(child)
	// Remove new lines from the middle of url
	// (spaces break urls, but new lines don't in chrome)
	child = strings.ReplaceAll(child, "\n", "")

	u, err := url.Parse(child)
	if err != nil {
		// just use child as path
		path, err := url.PathUnescape(child)
		if err != nil {
			return "", errors.Wrap(err, "could not unescape path")
		}
		u = &url.URL{Path: path}
	}
	u.Fragment = ""
	u.RawQuery = ""
	if parent != "" {
		parentUrl, err := url.Parse(parent)
		if err != nil {
			return "", errors.Wrap(err, "could not parse parent url")
		}
		return parentUrl.ResolveReference(u).String(), nil
	}
	return u.String(), nil
}

func (s *scanner) handleCloudflare(resp *common.LoadResponse, crawlLink *database.CrawlLink) (bool, error) {
	if !(s.isHtmlContent(resp) && resp.StatusCode == http.StatusForbidden) {
		return false, nil
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return true, err
	}

	isCloudflare := strings.Contains(
		strings.ToLower(doc.Find("title").First().Text()),
		"cloudflare",
	)
	if !isCloudflare {
		return false, nil
	}

	crawlLink.Type = common.TYPE_EXTERNAL
	blockedByCloudflare := "Blocked by Cloudflare"
	crawlLink.Error = &blockedByCloudflare

	return true, nil
}

func (s *scanner) isWebScheme(u *url.URL) bool {
	scheme := strings.ToLower(u.Scheme)
	return scheme == "http" || scheme == "https"
}

func (s *scanner) isHtmlContent(resp *common.LoadResponse) bool {
	contentType := strings.SplitN(resp.Header.Get("Content-Type"), ";", 2)
	return contentType[0] == "text/html"
}
