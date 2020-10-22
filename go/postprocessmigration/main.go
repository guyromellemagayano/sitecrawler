package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
)

const (
	lastScanToProcess = 117
	ignoreScan        = -1 // in progress on prod
	firstSiteToProces = 0
)

func main() {

	env := common.Env("ENV", "dev")

	log := common.NewLog(env, "")

	db := common.ConfigureDatabase(log, env)
	defer db.Close()

	postprocessor := &common.SizePostprocessor{Database: db}

	err := db.SiteDao.AllForEach(func(site *database.CrawlSite) error {
		if site.ID < firstSiteToProces {
			return nil
		}
		return db.ScanDao.AllForSiteForEach(site.ID, func(scan *database.CrawlScan) error {
			if scan.ID > lastScanToProcess {
				return nil
			}
			if scan.ID == ignoreScan {
				return nil
			}
			log.Infof("Processing site: %v, scan: %v", site.ID, scan.ID)
			links := 0
			total := 0
			start := time.Now()
			err := db.LinkDao.AllForScanForEach(scan.ID, func(l *database.CrawlLink) error {
				links++
				total++
				if err := postprocessor.OnLink(l); err != nil {
					return err
				}
				err := db.LinkLinkDao.AllForLinkForEach(l.ID, func(ll *database.CrawlLinkLink) error {
					total++
					return postprocessor.OnLinkLink(ll)
				})
				if err != nil {
					return err
				}
				err = db.LinkImageDao.AllForLinkForEach(l.ID, func(li *database.CrawlLinkImage) error {
					total++
					return postprocessor.OnLinkImage(li)
				})
				if err != nil {
					return err
				}
				err = db.LinkScriptDao.AllForLinkForEach(l.ID, func(ls *database.CrawlLinkScript) error {
					total++
					return postprocessor.OnLinkScript(ls)
				})
				if err != nil {
					return err
				}
				err = db.LinkStylesheetDao.AllForLinkForEach(l.ID, func(ls *database.CrawlLinkStylesheet) error {
					total++
					return postprocessor.OnLinkStylesheet(ls)
				})
				if err != nil {
					return err
				}
				return nil
			})
			if err != nil {
				return err
			}
			if links != 0 && total != 0 {
				log.Infof("Per link %v, per total %v", time.Since(start)/time.Duration(links), time.Since(start)/time.Duration(total))
			}
			log.Infof("Verifying site: %v, scan: %v", site.ID, scan.ID)
			err = db.LinkDao.AllForScanForEach(scan.ID, func(l *database.CrawlLink) error {
				return VerifySize(site, scan, l)
			})
			if err != nil {
				return err
			}
			log.Infof("Done site: %v, scan: %v", site.ID, scan.ID)
			return nil
		})
	})
	if err != nil {
		log.Fatal(err)
	}
}

// func VerifyTLS(site *database.CrawlSite, scan *database.CrawlScan, link *database.CrawlLink) error {
//     if link.Type != common.TYPE_PAGE {
//         if link.CachedNumNonTlsImages != nil ||
//             link.CachedNumNonTlsScripts != nil ||
//             link.CachedNumNonTlsStylesheets != nil ||
//             link.CachedNumTlsImages != nil ||
//             link.CachedNumTlsScripts != nil ||
//             link.CachedNumTlsStylesheets != nil ||
//             link.CachedTlsImages != nil ||
//             link.CachedTlsScripts != nil ||
//             link.CachedTlsStylesheets != nil ||
//             link.CachedTlsTotal != nil {
//             return fmt.Errorf("invalid non page: %v, %v, %v", site.ID, scan.ID, link.ID)
//         }
//         return nil
//     }
//
//     data := struct {
//         NumTlsImages         int  `json:"num_tls_images"`
//         NumTlsScripts        int  `json:"num_tls_scripts"`
//         NumTlsStylesheets    int  `json:"num_tls_stylesheets"`
//         NumNonTlsImages      int  `json:"num_non_tls_images"`
//         NumNonTlsScripts     int  `json:"num_non_tls_scripts"`
//         NumNonTlsStylesheets int  `json:"num_non_tls_stylesheets"`
//         TlsImages            bool `json:"tls_images"`
//         TlsScripts           bool `json:"tls_scripts"`
//         TlsStylesheets       bool `json:"tls_stylesheets"`
//         TlsTotal             bool `json:"tls_total"`
//     }{}
//     path := fmt.Sprintf("site/%v/scan/%v/page/%v/", site.ID, scan.ID, link.ID)
//     if err := backendRequest(path, &data); err != nil {
//         return err
//     }
//
//     if *link.CachedNumNonTlsImages != data.NumNonTlsImages ||
//         *link.CachedNumNonTlsScripts != data.NumNonTlsScripts ||
//         *link.CachedNumNonTlsStylesheets != data.NumNonTlsStylesheets ||
//         *link.CachedNumTlsImages != data.NumTlsImages ||
//         *link.CachedNumTlsScripts != data.NumTlsScripts ||
//         *link.CachedNumTlsStylesheets != data.NumTlsStylesheets ||
//         *link.CachedTlsImages != data.TlsImages ||
//         *link.CachedTlsScripts != data.TlsScripts ||
//         *link.CachedTlsStylesheets != data.TlsStylesheets ||
//         *link.CachedTlsTotal != data.TlsTotal {
//         return fmt.Errorf("invalid page: %v, %v, %v", site.ID, scan.ID, link.ID)
//     }
//
//     return nil
// }

func VerifySize(site *database.CrawlSite, scan *database.CrawlScan, link *database.CrawlLink) error {
	if link.Type != common.TYPE_PAGE {
		if link.CachedSizeImages != nil ||
			link.CachedSizeScripts != nil ||
			link.CachedSizeStylesheets != nil ||
			link.CachedSizeTotal != nil {
			return fmt.Errorf("invalid non page: %v, %v, %v", site.ID, scan.ID, link.ID)
		}
		return nil
	}

	data := struct {
		SizeImages      int `json:"size_images"`
		SizeScripts     int `json:"size_scripts"`
		SizeStylesheets int `json:"size_stylesheets"`
		SizeTotal       int `json:"size_total"`
	}{}
	path := fmt.Sprintf("site/%v/scan/%v/page/%v/", site.ID, scan.ID, link.ID)
	if err := backendRequest(path, &data); err != nil {
		return err
	}

	if *link.CachedSizeImages != data.SizeImages ||
		*link.CachedSizeScripts != data.SizeScripts ||
		*link.CachedSizeStylesheets != data.SizeStylesheets ||
		*link.CachedSizeTotal != data.SizeTotal {
		return fmt.Errorf("invalid page: %v, %v, %v", site.ID, scan.ID, link.ID)
	}

	return nil
}

func backendRequest(path string, result interface{}) error {
	url := fmt.Sprintf("http://backend:8000/api/%v", path)
	r, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return err
	}
	r.Header.Add("Authorization", fmt.Sprintf("Token %v", common.Env("BACKEND_TOKEN", "")))
	resp, err := http.DefaultClient.Do(r)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return fmt.Errorf("non-200 for %v: %v", url, resp.Status)
	}

	decoder := json.NewDecoder(resp.Body)
	if err := decoder.Decode(result); err != nil {
		return err
	}

	return nil
}
