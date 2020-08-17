package common

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/endpoints"
	"github.com/aws/aws-sdk-go/aws/session"
)

func NewAwsSession(env string) (*session.Session, error) {
	var awsConfigs []*aws.Config
	if env == "dev" {
		awsConfigs = append(awsConfigs, &aws.Config{
			Credentials:      credentials.NewStaticCredentials("foo", "var", ""),
			S3ForcePathStyle: aws.Bool(true),
			Region:           aws.String(endpoints.UsEast1RegionID),
			Endpoint:         aws.String("http://localstack:4566"),
		})
	} else {
		awsConfigs = append(awsConfigs, &aws.Config{
			Region: aws.String(endpoints.UsEast1RegionID),
		})
	}
	return session.NewSession(awsConfigs...)
}
