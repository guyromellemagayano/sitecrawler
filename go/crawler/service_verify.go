package main

import (
	"fmt"
	"log"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/pkg/errors"
)

const metaTagName = "epic-crawl-id"

type VerifyService struct {
	SiteDao     *SiteDao
	LoadService *LoadService
}

func (v *VerifyService) VerifySite(siteID int) error {
	site, err := v.SiteDao.ByID(siteID)
	if err != nil {
		return errors.Wrapf(err, "could not get site id %v", siteID)
	}
	log.Printf("Verifying %v", site.Url)

	err = v.VerifyURL(site.Url, site.VerificationID)

	site.UpdatedAt = time.Now()
	if err != nil {
		site.Verified = false
		errStr := err.Error()
		site.LastVerifyError = &errStr
	} else {
		site.Verified = true
		site.LastVerifyError = nil
	}

	if err := v.SiteDao.Save(site); err != nil {
		return errors.Wrap(err, "could not save site")
	}

	return nil
}

func (v *VerifyService) VerifyURL(url, verificationID string) error {
	resp, err, cancel := v.LoadService.Load(url)
	defer cancel()
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode/100 != 2 {
		return errors.Errorf("failed to load: %v %v", resp.StatusCode, resp.Status)
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return errors.Wrap(err, "could not parse response")
	}

	if err := v.Verify(doc, verificationID); err != nil {
		return err
	}

	return nil
}

func (v *VerifyService) Verify(doc *goquery.Document, verificationID string) error {
	verified := false
	var lastError error
	doc.Find(fmt.Sprintf("meta[name=%s]", metaTagName)).EachWithBreak(func(_ int, s *goquery.Selection) bool {
		tagContent, exists := s.Attr("content")
		if !exists {
			lastError = errors.Errorf("meta tag does not have content attribute set")
			return true
		}
		if tagContent != verificationID {
			lastError = errors.Errorf("meta tag not correct \"%s\" != \"%s\"", tagContent, verificationID)
			return true
		}
		lastError = nil
		verified = true
		return false
	})
	if lastError != nil {
		return lastError
	}
	if !verified {
		return errors.New("meta tag does not exist")
	}
	return nil
}
