package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	port := "8000"
	if portEnv, ok := os.LookupEnv("PORT"); ok {
		port = portEnv
	}

	http.Handle("/verify", &VerifyEndpoint{})
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
}
