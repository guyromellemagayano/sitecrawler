package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type VerifyEndpoint struct {
	VerifyService *VerifyService
}

type VerifyRequest struct {
	SiteID int `json:"site_id"`
}

type VerifyResponse struct {
}

func (v *VerifyEndpoint) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	defer r.Body.Close()

	request := VerifyRequest{}
	response := VerifyResponse{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&request); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	err := v.VerifyService.VerifySite(request.SiteID)
	if err != nil {
		log.Printf("Could not get site: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	encoder := json.NewEncoder(w)
	if err := encoder.Encode(response); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}
