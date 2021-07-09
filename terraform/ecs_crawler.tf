resource "aws_ecs_task_definition" "prod_crawler" {
  family                = "prod_crawler_task"
  container_definitions = <<TASK_DEFINITION
  [
    {
      "name": "crawler",
      "image": "400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-crawler",
      "environment": [
        {"name": "ENV", "value": "production"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group" : "${aws_cloudwatch_log_group.prod_ecs.name}",
          "awslogs-region": "${data.aws_region.current.name}",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "essential": true
    }
  ]
  TASK_DEFINITION

  cpu = 256
  memory = 512

  requires_compatibilities = ["FARGATE"]
  network_mode = "awsvpc"
  task_role_arn = aws_iam_role.prod_ecs_crawler.arn
  execution_role_arn = aws_iam_role.ecs_execution_role.arn
}

resource "aws_ecs_service" "prod_crawler" {
  name            = "prod_crawler_service"
  cluster         = aws_ecs_cluster.prod_fargate.id
  task_definition = aws_ecs_task_definition.prod_crawler.arn
  desired_count   = 1

  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight = 1
  }
  network_configuration {
    subnets = [aws_default_subnet.default_az1.id, aws_default_subnet.default_az2.id, aws_default_subnet.default_az3.id, aws_default_subnet.default_az4.id, aws_default_subnet.default_az5.id, aws_default_subnet.default_az6.id]
    security_groups = [aws_security_group.prod_ecs_crawler.id]
    assign_public_ip = true
  }

  lifecycle {
    ignore_changes = [
      desired_count,
      task_definition,
    ]
  }
}

# autoscaling
resource "aws_appautoscaling_target" "ecs_prod_crawler_target" {
  max_capacity       = 8
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.prod_fargate.name}/${aws_ecs_service.prod_crawler.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_prod_crawler_upscale_policy" {
  name               = "ecs_prod_crawler_upscale_policy"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.ecs_prod_crawler_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_prod_crawler_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_prod_crawler_target.service_namespace

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 3*60
    metric_aggregation_type = "Maximum"

    step_adjustment {
      metric_interval_lower_bound = 0
      scaling_adjustment = 1
    }
  }
}
resource "aws_cloudwatch_metric_alarm" "ecs_prod_crawler_upscale_alarm" {
  alarm_name          = "ecs_prod_crawler_upscale_alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = "60"
  statistic           = "Maximum"
  threshold           = "0.5"
  evaluation_periods  = "2"
  datapoints_to_alarm = "2"

  dimensions = {
    QueueName = "linkapp-production-scan"
  }

  alarm_actions     = [aws_appautoscaling_policy.ecs_prod_crawler_upscale_policy.arn]
}

resource "aws_appautoscaling_policy" "ecs_prod_crawler_downscale_policy" {
  name               = "ecs_prod_crawler_downscale_policy"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.ecs_prod_crawler_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_prod_crawler_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_prod_crawler_target.service_namespace

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 3*60
    metric_aggregation_type = "Maximum"

    step_adjustment {
      metric_interval_lower_bound = 0
      scaling_adjustment = -1
    }
  }
}
resource "aws_cloudwatch_metric_alarm" "ecs_prod_crawler_downscale_alarm" {
  alarm_name          = "ecs_prod_crawler_downscale_alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  metric_name         = "NumberOfEmptyReceives"
  namespace           = "AWS/SQS"
  period              = "60"
  statistic           = "Maximum"
  threshold           = "0.5"
  evaluation_periods  = "5"
  datapoints_to_alarm = "5"

  dimensions = {
    QueueName = "linkapp-production-scan"
  }

  alarm_actions     = [aws_appautoscaling_policy.ecs_prod_crawler_downscale_policy.arn]
}

# monitoring
resource "aws_cloudwatch_metric_alarm" "alert_ecs_prod_crawler_high_memory" {
  alarm_name          = "alert_ecs_prod_crawler_high_memory"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = "3600"
  statistic           = "Maximum"
  threshold           = 90
  evaluation_periods  = "2"
  datapoints_to_alarm = "2"
  treat_missing_data  = "notBreaching"

  dimensions = {
    ClusterName = aws_ecs_cluster.prod_fargate.name
    ServiceName = aws_ecs_service.prod_crawler.name
  }

  alarm_description = "Memory utilization for prod crawler is high"
  alarm_actions     = [aws_sns_topic.production_alerts.arn]
}
