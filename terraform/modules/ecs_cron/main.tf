resource "aws_ecs_task_definition" "cron_task_definition" {
  family                = "${var.environment}_cron_${var.name}"
  container_definitions = <<TASK_DEFINITION
  [
    {
      "name": "${var.name}",
      "image": "${var.image}",
      ${length(var.command) > 0 ? "\"command\": [\"${join("\", \"", var.command)}\"]," : ""}
      "environment": [
        {"name": "ENV", "value": "${var.environment}"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group" : "${aws_cloudwatch_log_group.cron_logs.name}",
          "awslogs-region": "${var.region}",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "essential": true
    }
  ]
  TASK_DEFINITION

  cpu = var.cpu
  memory = var.memory

  requires_compatibilities = ["FARGATE"]
  network_mode = "awsvpc"
  task_role_arn = aws_iam_role.cron_role.arn
  execution_role_arn = aws_iam_role.ecs_execution_role.arn
}

resource "aws_cloudwatch_event_rule" "cron_event_rule" {
  name                = "${var.environment}_cron_${var.name}"
  description         = "Run ${var.environment} ${var.name}"
  schedule_expression = var.schedule
}

resource "aws_cloudwatch_event_target" "event_target" {
  target_id = "${var.environment}-cron-${var.name}-event-target"
  arn       = var.cluster_arn
  rule      = aws_cloudwatch_event_rule.cron_event_rule.name
  role_arn  = aws_iam_role.event_role.arn

  ecs_target {
    launch_type = "FARGATE"
    // remove version and always use latest task definition
    task_definition_arn = "${replace(aws_ecs_task_definition.cron_task_definition.arn, "/:\\d+$/", "")}"

    network_configuration {
      subnets = var.subnets
      security_groups = [aws_security_group.security_group.id]
      assign_public_ip = var.assign_public_ip
    }
  }
}

resource "aws_iam_role" "cron_role" {
  name = "${var.environment}_ecs_cron_${var.name}_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
  EOF
}

resource "aws_iam_role_policy_attachment" "prod_secrets_cron_role" {
  role = aws_iam_role.cron_role.name
  policy_arn = aws_iam_policy.prod_secrets_policy.arn
}

resource "aws_iam_policy" "prod_secrets_policy" {
  name = "${var.environment}_ecs_cron_${var.name}_secrets_policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Action": "secretsmanager:GetSecretValue",
    "Resource": "arn:aws:secretsmanager:${var.region}:${var.account_id}:secret:${var.environment}/*"
  }
}
  EOF
}

resource "aws_iam_role" "ecs_execution_role" {
  name = "${var.environment}_ecs_cron_${var.name}_execution_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
  EOF
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role = aws_iam_role.ecs_execution_role.name
  policy_arn = aws_iam_policy.ecs_execution_policy.arn
}

resource "aws_iam_policy" "ecs_execution_policy" {
  name = "${var.environment}_ecs_cron_${var.name}_execution_policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
  EOF
}

resource "aws_cloudwatch_log_group" "cron_logs" {
  name = "/ecs/${var.environment}/cron/${var.name}"

  tags = {
    Env = "${var.environment}"
  }
}

resource "aws_security_group" "security_group" {
  name        = "${var.environment}_ecs_cron_${var.name}_security_group"

	egress {
		from_port   = 0
		to_port     = 0
		protocol    = "-1"
		cidr_blocks = ["0.0.0.0/0"]
	}
}

resource "aws_iam_role" "event_role" {
  name = "${var.environment}_ecs_cron_${var.name}_event_role"

  assume_role_policy = <<DOC
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "events.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
DOC
}

resource "aws_iam_role_policy" "event_role_policy" {
  name = "${var.environment}_ecs_cron_${var.name}_event_role_policy"
  role = aws_iam_role.event_role.id

  policy = <<DOC
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "iam:PassRole",
            "Resource": [
              "${aws_iam_role.ecs_execution_role.arn}",
              "${aws_iam_role.cron_role.arn}"
            ]
        },
        {
            "Effect": "Allow",
            "Action": "ecs:RunTask",
            "Resource": "${aws_cloudwatch_event_target.event_target.ecs_target[0].task_definition_arn}"
        }
    ]
}
DOC
}

