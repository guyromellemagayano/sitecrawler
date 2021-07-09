resource "aws_sns_topic" "production_alerts" {
  name = "production-alerts"
}

// Alert if sqs queue starts building up (minimum value in 10 hours more than 5)
resource "aws_cloudwatch_metric_alarm" "alert_sqs_scan_queue" {
  alarm_name          = "alert_sqs_scan_queue"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = "3600"
  statistic           = "Minimum"
  threshold           = "5"
  evaluation_periods  = "12"
  datapoints_to_alarm = "12"
  treat_missing_data  = "notBreaching"

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
  extended_statistic  = "p90"
  threshold           = "5"
  evaluation_periods  = "2"
  datapoints_to_alarm = "2"
  treat_missing_data  = "notBreaching"

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
  extended_statistic  = "p90"
  threshold           = "0.1"
  evaluation_periods  = "4"
  datapoints_to_alarm = "4"
  treat_missing_data  = "notBreaching"

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
  extended_statistic  = "p90"
  threshold           = "0.1"
  evaluation_periods  = "4"
  datapoints_to_alarm = "4"
  treat_missing_data  = "notBreaching"

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.production.id
  }

  alarm_description = "High database write latency"
  alarm_actions     = [aws_sns_topic.production_alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "alert_db_disk_space" {
  alarm_name          = "alert_db_disk_space"
  comparison_operator = "LessThanOrEqualToThreshold"
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Minimum"
  threshold           = aws_db_instance.production.allocated_storage*1024*1024*1024*0.1
  evaluation_periods  = "2"
  datapoints_to_alarm = "2"
  treat_missing_data  = "notBreaching"

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.production.id
  }

  alarm_description = "Disk free space is below 10%"
  alarm_actions     = [aws_sns_topic.production_alerts.arn]
}
