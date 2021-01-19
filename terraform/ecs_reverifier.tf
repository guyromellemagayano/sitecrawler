resource "aws_ecs_task_definition" "prod_reverifier" {
  family                = "prod_reverifier_task"
  container_definitions = <<TASK_DEFINITION
  [
    {
      "name": "reverifier",
      "image": "400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-reverifier",
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
  task_role_arn = aws_iam_role.prod_ecs_reverifier.arn
  execution_role_arn = aws_iam_role.ecs_execution_role.arn
}

resource "aws_cloudwatch_event_rule" "reverifier" {
  name                = "reverifier_event_rule"
  description         = "Run prod reverifier"
  schedule_expression = "cron(0 6 * * ? *)"
}

resource "aws_cloudwatch_event_target" "prod_reverifier" {
  target_id = "prod-reverifier-event-target"
  arn       = aws_ecs_cluster.prod_fargate.arn
  rule      = aws_cloudwatch_event_rule.reverifier.name
  role_arn  = aws_iam_role.ecs_events.arn

  ecs_target {
    launch_type = "FARGATE"
    // remove version and always use latest task definition
    task_definition_arn = "${replace(aws_ecs_task_definition.prod_reverifier.arn, "/:\\d+$/", "")}"

    network_configuration {
      subnets = [aws_default_subnet.default_az1.id, aws_default_subnet.default_az2.id, aws_default_subnet.default_az3.id, aws_default_subnet.default_az4.id, aws_default_subnet.default_az5.id, aws_default_subnet.default_az6.id]
      security_groups = [aws_security_group.prod_ecs_reverifier.id]
      assign_public_ip = true
    }
  }
}
