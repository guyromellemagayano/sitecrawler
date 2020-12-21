package common

import (
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/secretsmanager"
)

func Env(name, def string) string {
	if value, ok := os.LookupEnv(name); ok {
		return value
	}
	return def
}

func Secret(awsSession *session.Session, env, name, def string) string {
	envSecret := Env(name, "")
	if envSecret != "" {
		return envSecret
	}

	svc := secretsmanager.New(awsSession)
	result, _ := svc.GetSecretValue(&secretsmanager.GetSecretValueInput{
		SecretId: aws.String(fmt.Sprintf("%s/%s", env, name)),
	})
	if result != nil && result.SecretString != nil && *result.SecretString != "" {
		return *result.SecretString
	}

	return def
}
