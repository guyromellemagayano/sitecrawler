package common

import (
	"github.com/TheZeroSlave/zapsentry"
	"github.com/getsentry/sentry-go"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func NewLog(env, dsn string) *zap.SugaredLogger {
	logger, err := zap.NewProduction()
	if err != nil {
		panic(err)
	}
	defer logger.Sync()
	if env != "dev" {
		cfg := zapsentry.Configuration{
			Level: zapcore.ErrorLevel,
		}
		client, err := sentry.NewClient(sentry.ClientOptions{
			Dsn:         dsn,
			Environment: env,
		})
		if err != nil {
			logger.Fatal(err.Error())
		}
		core, err := zapsentry.NewCore(cfg, zapsentry.NewSentryClientFromClient(client))
		if err != nil {
			logger.Fatal(err.Error())
		}
		logger = zapsentry.AttachCoreToLogger(core, logger)
	}
	return logger.Sugar()
}
