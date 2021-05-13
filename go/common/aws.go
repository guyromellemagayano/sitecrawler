package common

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/endpoints"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/pkg/errors"
)

func NewAwsSession(env string) (*session.Session, error) {
	region := endpoints.UsEast1RegionID
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	detectedRegion, err := GetRegion(ctx)
	if err == nil {
		region = detectedRegion
	}

	var awsConfigs []*aws.Config
	if env == "dev" {
		awsConfigs = append(awsConfigs, &aws.Config{
			Credentials:      credentials.NewStaticCredentials("foo", "var", ""),
			S3ForcePathStyle: aws.Bool(true),
			Region:           aws.String(region),
			Endpoint:         aws.String("http://localstack:4566"),
		})
	} else {
		awsConfigs = append(awsConfigs, &aws.Config{
			Region: aws.String(region),
		})
	}
	return session.NewSession(awsConfigs...)
}

func GetRegion(ctx context.Context) (string, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, "http://169.254.169.254/latest/dynamic/instance-identity/document", nil)
	if err != nil {
		return "", err
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return "", errors.New(resp.Status)
	}

	data := make(map[string]string)

	dec := json.NewDecoder(resp.Body)
	if err := dec.Decode(&data); err != nil {
		return "", err
	}

	return data["region"], nil
}
