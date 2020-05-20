package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type VerifyEndpoint struct {
}

type VerifyRequest struct {
	Url string `json:"url"`
}

type VerifyResponse struct {
	Ok bool `json:"ok"`
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

	log.Printf("Verifying \"%s\".", request.Url)
	response.Ok = true

	w.Header().Set("Content-Type", "application/json")
	encoder := json.NewEncoder(w)
	if err := encoder.Encode(response); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}
