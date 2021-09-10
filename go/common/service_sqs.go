package common

import (
	"context"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sqs"
	"go.uber.org/zap"
)

var (
	VisibilityTimeout int64 = 60
	WaitTimeSeconds   int64 = 5
	PingInterval            = 10 * time.Second
	MaxPingRetries          = 5
)

type SQSService struct {
	Sqs *sqs.SQS
	url *string
}

func NewSQSService(awsSession *session.Session, queue string) (*SQSService, error) {
	Sqs := sqs.New(awsSession)
	result, err := Sqs.GetQueueUrl(&sqs.GetQueueUrlInput{
		QueueName: &queue,
	})
	if err != nil {
		if awsErr, ok := err.(awserr.Error); ok {
			if awsErr.Code() == "AWS.SimpleQueueService.NonExistentQueue" {
				_, err := Sqs.CreateQueue(&sqs.CreateQueueInput{
					QueueName: &queue,
				})
				if err != nil {
					return nil, err
				}
				result, err = Sqs.GetQueueUrl(&sqs.GetQueueUrlInput{
					QueueName: &queue,
				})
				if err != nil {
					return nil, err
				}
			} else {
				return nil, err
			}
		} else {
			return nil, err
		}
	}

	return &SQSService{
		Sqs: Sqs,
		url: result.QueueUrl,
	}, nil
}

func (s *SQSService) Read(log *zap.SugaredLogger) (*SQSMessage, error) {
	for {
		response, err := s.Sqs.ReceiveMessage(&sqs.ReceiveMessageInput{
			QueueUrl:          s.url,
			VisibilityTimeout: &VisibilityTimeout,
			WaitTimeSeconds:   &WaitTimeSeconds,
		})
		if err != nil {
			if strings.Contains(err.Error(), "connection reset by peer") {
				time.Sleep(time.Second)
				continue
			}
			return nil, err
		}
		if len(response.Messages) != 1 {
			continue
		}

		ctx, cancel := context.WithCancel(context.Background())
		sqsMsg := &SQSMessage{
			svc:    s,
			msg:    response.Messages[0],
			cancel: cancel,
		}
		go sqsMsg.startPinger(ctx, log)
		return sqsMsg, nil
	}
}

func (s *SQSService) Send(body string) error {
	_, err := s.Sqs.SendMessage(&sqs.SendMessageInput{
		QueueUrl:    s.url,
		MessageBody: &body,
	})
	return err
}

type SQSMessage struct {
	svc    *SQSService
	msg    *sqs.Message
	cancel context.CancelFunc
}

func (m *SQSMessage) Body() string {
	return *m.msg.Body
}

// Done stops acknowledging messsage
func (m *SQSMessage) Done() {
	m.cancel()
}

// Success deletes the message on success
func (m *SQSMessage) Success() error {
	m.cancel()
	_, err := m.svc.Sqs.DeleteMessage(&sqs.DeleteMessageInput{
		QueueUrl:      m.svc.url,
		ReceiptHandle: m.msg.ReceiptHandle,
	})
	if err != nil {
		return err
	}
	return nil
}

func (m *SQSMessage) startPinger(ctx context.Context, log *zap.SugaredLogger) {
	ticker := time.NewTicker(PingInterval)
	defer ticker.Stop()

	successiveErrorsCount := 0
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			if err := m.ping(); err != nil {
				select {
				case <-ctx.Done():
					return
				default:
					successiveErrorsCount++
					if successiveErrorsCount >= int(VisibilityTimeout)/int(PingInterval.Seconds()) {
						log.Errorw("Sqs ping failed over visibility timeout",
							"err", err,
							"count", successiveErrorsCount,
						)
						successiveErrorsCount = 0
					}
				}
			} else {
				successiveErrorsCount = 0
			}
		}
	}
}

func (m *SQSMessage) ping() error {
	_, err := m.svc.Sqs.ChangeMessageVisibility(&sqs.ChangeMessageVisibilityInput{
		QueueUrl:          m.svc.url,
		ReceiptHandle:     m.msg.ReceiptHandle,
		VisibilityTimeout: &VisibilityTimeout,
	})
	return err
}
