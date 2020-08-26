package common

import (
	"net/http"

	"go.uber.org/zap"
)

type Endpoint interface {
	ServeHTTP(log *zap.SugaredLogger, w http.ResponseWriter, r *http.Request) error
}

func WrapEndpoint(logger *zap.SugaredLogger, endpoint Endpoint) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log := logger.With("url", r.URL)
		defer PanicLogger(log)

		err := endpoint.ServeHTTP(log, w, r)
		if err != nil {
			log.Errorf("Server error: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}
	})
}
