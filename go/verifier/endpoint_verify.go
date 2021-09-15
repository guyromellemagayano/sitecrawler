package main

import (
	"encoding/json"
	"net/http"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"go.uber.org/zap"
)

type VerifyEndpoint struct {
	VerifyService *common.VerifyService
}

type VerifyRequest struct {
	SiteID int `json:"site_id"`
}

type VerifyResponse struct {
}

func (v *VerifyEndpoint) ServeHTTP(log *zap.SugaredLogger, w http.ResponseWriter, r *http.Request) error {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return nil
	}
	defer r.Body.Close()

	request := VerifyRequest{}
	response := VerifyResponse{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&request); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return nil
	}

	err := v.VerifyService.VerifySite(log.With("site_id", request.SiteID), request.SiteID)
	if err != nil {
		return err
	}

	v.VerifyService.LoadService.CloseIdleConnections()

	w.Header().Set("Content-Type", "application/json")
	encoder := json.NewEncoder(w)
	if err := encoder.Encode(response); err != nil {
		return err
	}

	return nil
}
