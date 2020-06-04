package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type ScanEndpoint struct {
	ScanService *ScanService
}

type ScanRequest struct {
	ScanID int `json:"scan_id"`
}

type ScanResponse struct {
}

func (v *ScanEndpoint) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	defer r.Body.Close()

	request := ScanRequest{}
	response := ScanResponse{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&request); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	go func() {
		err := v.ScanService.ScanSite(request.ScanID)
		if err != nil {
			log.Printf("Site scan failed: %v", err)
		}
	}()

	w.Header().Set("Content-Type", "application/json")
	encoder := json.NewEncoder(w)
	if err := encoder.Encode(response); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}
