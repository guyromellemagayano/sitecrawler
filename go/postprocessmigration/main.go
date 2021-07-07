package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
)

const (
	// lastScanToProcess = 1035 // for staging
	lastScanToProcess = 3886 // for prod
	// lastScanToProcess = 61 // for local
	ignoreScan        = 0  // in progress on prod
	firstSiteToProces = 41 // for prod
	// firstSiteToProces    = 0
	firstScanOfFirstSite = 0
)

func main() {

	env := common.Env("ENV", "dev")

	log := common.NewLog(env, "")

	awsSession, err := common.NewAwsSession(env)
	if err != nil {
		log.Fatal(err)
	}

	backendToken := common.Secret(log, awsSession, env, "BACKEND_TOKEN_UPTIMER", "")

	db := common.ConfigureDatabase(log, awsSession, "uptimer", env)
	defer db.Close()

	postprocessor := &common.RelCountsPostprocessor{}

	err = db.SiteDao.ForEach(func(site *database.CrawlSite) error {
		if site.ID < firstSiteToProces {
			return nil
		}
		return db.ScanDao.ForEach(func(scan *database.CrawlScan) error {
			if scan.ID > lastScanToProcess {
				return nil
			}
			if scan.ID == ignoreScan {
				return nil
			}
			if site.ID == firstSiteToProces && scan.ID < firstScanOfFirstSite {
				return nil
			}
			log.Infof("Processing site: %v, scan: %v", site.ID, scan.ID)
			links := 0
			total := 0
			start := time.Now()
			err := db.LinkDao.ForEach(func(l *database.CrawlLink) error {
				return db.RunInTransaction(func(tx *database.Database) error {
					links++
					total++
					if err := postprocessor.OnLink(tx, l); err != nil {
						return err
					}
					err := db.LinkLinkDao.ForEach(func(ll *database.CrawlLinkLink) error {
						total++
						return postprocessor.OnLinkLink(tx, ll)
					}, database.Where("from_link_id = ?", l.ID))
					if err != nil {
						return err
					}
					err = db.LinkImageDao.ForEach(func(li *database.CrawlLinkImage) error {
						total++
						return postprocessor.OnLinkImage(tx, li)
					}, database.Where("from_link_id = ?", l.ID))
					if err != nil {
						return err
					}
					err = db.LinkScriptDao.ForEach(func(ls *database.CrawlLinkScript) error {
						total++
						return postprocessor.OnLinkScript(tx, ls)
					}, database.Where("from_link_id = ?", l.ID))
					if err != nil {
						return err
					}
					err = db.LinkStylesheetDao.ForEach(func(ls *database.CrawlLinkStylesheet) error {
						total++
						return postprocessor.OnLinkStylesheet(tx, ls)
					}, database.Where("from_link_id = ?", l.ID))
					if err != nil {
						return err
					}
					err = postprocessor.Flush(tx)
					if err != nil {
						return err
					}
					return nil
				})
			}, database.Where("scan_id = ?", scan.ID))
			if err != nil {
				log.Errorf("Processing error: %v", err)
				return err
			}
			if links != 0 && total != 0 {
				log.Infof("Per link %v, per total %v", time.Since(start)/time.Duration(links), time.Since(start)/time.Duration(total))
			}
			log.Infof("Verifying site: %v, scan: %v", site.ID, scan.ID)
			err = db.LinkDao.ForEach(func(l *database.CrawlLink) error {
				return VerifyRelCounts(backendToken, site, scan, l)
			}, database.Where("scan_id = ?", scan.ID))
			if err != nil {
				log.Errorf("Verification error: %v", err)
				return err
			}
			log.Infof("Done site: %v, scan: %v", site.ID, scan.ID)
			return nil
		}, database.Where("site_id = ?", site.ID), database.Order("id"))
	},
		database.Where("t.deleted_at IS NULL"),
		database.Order("id"),
	)
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

// func VerifySize(site *database.CrawlSite, scan *database.CrawlScan, link *database.CrawlLink) error {
//     if link.Type != common.TYPE_PAGE {
//         if link.CachedSizeImages != nil ||
//             link.CachedSizeScripts != nil ||
//             link.CachedSizeStylesheets != nil ||
//             link.CachedSizeTotal != nil {
//             return fmt.Errorf("invalid non page: %v, %v, %v", site.ID, scan.ID, link.ID)
//         }
//         return nil
//     }
//
//     data := struct {
//         SizeImages      int `json:"size_images"`
//         SizeScripts     int `json:"size_scripts"`
//         SizeStylesheets int `json:"size_stylesheets"`
//         SizeTotal       int `json:"size_total"`
//     }{}
//     path := fmt.Sprintf("site/%v/scan/%v/page/%v/", site.ID, scan.ID, link.ID)
//     if err := backendRequest(path, &data); err != nil {
//         return err
//     }
//
//     if *link.CachedSizeImages != data.SizeImages ||
//         *link.CachedSizeScripts != data.SizeScripts ||
//         *link.CachedSizeStylesheets != data.SizeStylesheets ||
//         *link.CachedSizeTotal != data.SizeTotal {
//         return fmt.Errorf("invalid page: %v, %v, %v", site.ID, scan.ID, link.ID)
//     }
//
//     return nil
// }

// func VerifyIsType(site *database.CrawlSite, scan *database.CrawlScan, link *database.CrawlLink) error {
//     var isLink, isImage, isScript, isStylesheet bool
//     isLinkPath := fmt.Sprintf("site/%v/scan/%v/link/%v/", site.ID, scan.ID, link.ID)
//     if err := backendRequest(isLinkPath, nil); err != nil {
//         if !strings.HasSuffix(err.Error(), "404 Not Found") {
//             return err
//         }
//     } else {
//         isLink = true
//     }
//     isImagePath := fmt.Sprintf("site/%v/scan/%v/image/%v/", site.ID, scan.ID, link.ID)
//     if err := backendRequest(isImagePath, nil); err != nil {
//         if !strings.HasSuffix(err.Error(), "404 Not Found") {
//             return err
//         }
//     } else {
//         isImage = true
//     }
//     isScriptPath := fmt.Sprintf("site/%v/scan/%v/script/%v/", site.ID, scan.ID, link.ID)
//     if err := backendRequest(isScriptPath, nil); err != nil {
//         if !strings.HasSuffix(err.Error(), "404 Not Found") {
//             return err
//         }
//     } else {
//         isScript = true
//     }
//     isStylesheetPath := fmt.Sprintf("site/%v/scan/%v/stylesheet/%v/", site.ID, scan.ID, link.ID)
//     if err := backendRequest(isStylesheetPath, nil); err != nil {
//         if !strings.HasSuffix(err.Error(), "404 Not Found") {
//             return err
//         }
//     } else {
//         isStylesheet = true
//     }
//
//     if link.CachedIsLink != isLink ||
//         link.CachedIsImage != isImage ||
//         link.CachedIsScript != isScript ||
//         link.CachedIsStylesheet != isStylesheet {
//         return fmt.Errorf("invalid: %v, %v, %v", site.ID, scan.ID, link.ID)
//     }
//
//     return nil
// }

// func VerifyOccurences(db *database.Database, site *database.CrawlSite, scan *database.CrawlScan) error {
//     url := fmt.Sprintf("site/%v/scan/%v/link/", site.ID, scan.ID)
//     for url != "" {
//         result := struct {
//             Next    string `json:"next"`
//             Results []struct {
//                 Id         int `json:"id"`
//                 Occurences int `json:"occurences"`
//             } `json:"results"`
//         }{}
//         if err := backendRequest(url, &result); err != nil {
//             return err
//         }
//
//         for _, row := range result.Results {
//             var link database.CrawlLink
//             if err := db.Get(&link, database.Where("id = ?", row.Id)); err != nil {
//                 return err
//             }
//
//             if *link.CachedLinkOccurences != row.Occurences {
//                 return fmt.Errorf("invalid: %v, %v, %v", site.ID, scan.ID, link.ID)
//             }
//         }
//         url = result.Next
//     }
//
//     url = fmt.Sprintf("site/%v/scan/%v/image/", site.ID, scan.ID)
//     for url != "" {
//         result := struct {
//             Next    string `json:"next"`
//             Results []struct {
//                 Id         int `json:"id"`
//                 Occurences int `json:"occurences"`
//             } `json:"results"`
//         }{}
//         if err := backendRequest(url, &result); err != nil {
//             return err
//         }
//
//         for _, row := range result.Results {
//             var link database.CrawlLink
//             if err := db.Get(&link, database.Where("id = ?", row.Id)); err != nil {
//                 return err
//             }
//
//             if *link.CachedImageOccurences != row.Occurences {
//                 return fmt.Errorf("invalid: %v, %v, %v", site.ID, scan.ID, link.ID)
//             }
//         }
//         url = result.Next
//     }
//
//     url = fmt.Sprintf("site/%v/scan/%v/script/", site.ID, scan.ID)
//     for url != "" {
//         result := struct {
//             Next    string `json:"next"`
//             Results []struct {
//                 Id         int `json:"id"`
//                 Occurences int `json:"occurences"`
//             } `json:"results"`
//         }{}
//         if err := backendRequest(url, &result); err != nil {
//             return err
//         }
//
//         for _, row := range result.Results {
//             var link database.CrawlLink
//             if err := db.Get(&link, database.Where("id = ?", row.Id)); err != nil {
//                 return err
//             }
//
//             if *link.CachedScriptOccurences != row.Occurences {
//                 return fmt.Errorf("invalid: %v, %v, %v", site.ID, scan.ID, link.ID)
//             }
//         }
//         url = result.Next
//     }
//
//     url = fmt.Sprintf("site/%v/scan/%v/stylesheet/", site.ID, scan.ID)
//     for url != "" {
//         result := struct {
//             Next    string `json:"next"`
//             Results []struct {
//                 Id         int `json:"id"`
//                 Occurences int `json:"occurences"`
//             } `json:"results"`
//         }{}
//         if err := backendRequest(url, &result); err != nil {
//             return err
//         }
//
//         for _, row := range result.Results {
//             var link database.CrawlLink
//             if err := db.Get(&link, database.Where("id = ?", row.Id)); err != nil {
//                 return err
//             }
//
//             if *link.CachedStylesheetOccurences != row.Occurences {
//                 return fmt.Errorf("invalid: %v, %v, %v", site.ID, scan.ID, link.ID)
//             }
//         }
//         url = result.Next
//     }
//     return nil
// }

func VerifyRelCounts(backendToken string, site *database.CrawlSite, scan *database.CrawlScan, link *database.CrawlLink) error {
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
		NumLinks            int `json:"num_links"`
		NumImages           int `json:"num_images"`
		NumScripts          int `json:"num_scripts"`
		NumStylesheets      int `json:"num_stylesheets"`
		NumOkLinks          int `json:"num_ok_links"`
		NumOkImages         int `json:"num_ok_images"`
		NumOkScripts        int `json:"num_ok_scripts"`
		NumOkStylesheets    int `json:"num_ok_stylesheets"`
		NumNonOkLinks       int `json:"num_non_ok_links"`
		NumNonOkImages      int `json:"num_non_ok_images"`
		NumNonOkScripts     int `json:"num_non_ok_scripts"`
		NumNonOkStylesheets int `json:"num_non_ok_stylesheets"`
	}{}
	path := fmt.Sprintf("site/%v/scan/%v/page/%v/", site.ID, scan.ID, link.ID)
	if err := backendRequest(backendToken, path, &data); err != nil {
		return err
	}

	if *link.CachedNumLinks != data.NumLinks ||
		*link.CachedNumImages != data.NumImages ||
		*link.CachedNumScripts != data.NumScripts ||
		*link.CachedNumStylesheets != data.NumStylesheets ||
		*link.CachedNumOkLinks != data.NumOkLinks ||
		*link.CachedNumOkImages != data.NumOkImages ||
		*link.CachedNumOkScripts != data.NumOkScripts ||
		*link.CachedNumOkStylesheets != data.NumOkStylesheets ||
		*link.CachedNumNonOkLinks != data.NumNonOkLinks ||
		*link.CachedNumNonOkImages != data.NumNonOkImages ||
		*link.CachedNumNonOkScripts != data.NumNonOkScripts ||
		*link.CachedNumNonOkStylesheets != data.NumNonOkStylesheets {
		return fmt.Errorf("invalid page: %v, %v, %v", site.ID, scan.ID, link.ID)
	}

	return nil
}

func backendRequest(token, url string, result interface{}) error {
	urlPrefix := "http://backend:8000/api/"
	if !strings.HasPrefix(url, urlPrefix) {
		url = urlPrefix + url
	}
	r, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return err
	}
	r.Header.Add("Authorization", fmt.Sprintf("Token %v", token))
	resp, err := http.DefaultClient.Do(r)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return fmt.Errorf("non-200 for %v: %v", url, resp.Status)
	}

	if result != nil {
		decoder := json.NewDecoder(resp.Body)
		if err := decoder.Decode(result); err != nil {
			return err
		}
	}

	return nil
}
