package common

import "go.uber.org/zap"

func PanicLogger(log *zap.SugaredLogger) {
	if r := recover(); r != nil {
		log.Errorf("Panic: %v", r)
	}
}
