resource "aws_sns_topic" "production_alerts" {
  name = "production-alerts"
}

resource "aws_cloudwatch_metric_alarm" "alert_sqs_scan_queue" {
  alarm_name          = "alert_sqs_scan_queue"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = "3600"
  statistic           = "Minimum"
  threshold           = "5"
  evaluation_periods  = "1"

  dimensions = {
    QueueName = "linkapp-production-scan"
  }

  alarm_description = "SQS scan queue has a lot of unprocessed messages"
  alarm_actions     = [aws_sns_topic.production_alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "alert_request_latency" {
  alarm_name          = "alert_request_latency"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = "3600"
  extended_statistic           = "p95"
  threshold           = "5"
  evaluation_periods  = "1"

  dimensions = {
    LoadBalancer = aws_lb.production.arn_suffix
  }

  alarm_description = "High request latency"
  alarm_actions     = [aws_sns_topic.production_alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "alert_db_read" {
  alarm_name          = "alert_db_read"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  metric_name         = "ReadLatency"
  namespace           = "AWS/RDS"
  period              = "3600"
  extended_statistic           = "p95"
  threshold           = "0.1"
  evaluation_periods  = "1"

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.production.id
  }

  alarm_description = "High database read latency"
  alarm_actions     = [aws_sns_topic.production_alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "alert_db_write" {
  alarm_name          = "alert_db_write"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  metric_name         = "WriteLatency"
  namespace           = "AWS/RDS"
  period              = "3600"
  extended_statistic           = "p95"
  threshold           = "0.1"
  evaluation_periods  = "1"

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.production.id
  }

  alarm_description = "High database write latency"
  alarm_actions     = [aws_sns_topic.production_alerts.arn]
}
