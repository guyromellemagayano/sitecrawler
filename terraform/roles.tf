resource "aws_iam_instance_profile" "node_profile" {
  name = "node_profile"
  role = aws_iam_role.node_role.name
}

resource "aws_iam_role" "node_role" {
  name = "node_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
  EOF
}

resource "aws_iam_role_policy_attachment" "sqs_node" {
  role = aws_iam_role.node_role.name
  policy_arn = aws_iam_policy.sqs_policy.arn
}

resource "aws_iam_role" "prod_ecs_crawler" {
  name = "prod_ecs_crawler_role"

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

resource "aws_iam_role_policy_attachment" "sqs_prod_ecs_crawler" {
  role = aws_iam_role.prod_ecs_crawler.name
  policy_arn = aws_iam_policy.sqs_policy.arn
}

resource "aws_iam_role_policy_attachment" "prod_secrets_ecs_crawler" {
  role = aws_iam_role.prod_ecs_crawler.name
  policy_arn = aws_iam_policy.prod_secrets_policy.arn
}

resource "aws_iam_role" "prod_ecs_reverifier" {
  name = "prod_ecs_reverifier_role"

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

resource "aws_iam_role_policy_attachment" "prod_secrets_ecs_reverifier" {
  role = aws_iam_role.prod_ecs_reverifier.name
  policy_arn = aws_iam_policy.prod_secrets_policy.arn
}

resource "aws_iam_role" "ecs_execution_role" {
  name = "ecs_execution_role"

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

resource "aws_iam_role_policy" "ecr_node_policy" {
  name = "ecr_node_policy"
  role = aws_iam_role.node_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:GetRepositoryPolicy",
        "ecr:DescribeRepositories",
        "ecr:ListImages",
        "ecr:DescribeImages",
        "ecr:BatchGetImage",
        "ecr:GetLifecyclePolicy",
        "ecr:GetLifecyclePolicyPreview",
        "ecr:ListTagsForResource",
        "ecr:DescribeImageScanFindings"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
  EOF
}

resource "aws_iam_role_policy" "s3_node_policy" {
  name = "s3_node_policy"
  role = aws_iam_role.node_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
  EOF
}

resource "aws_iam_policy" "sqs_policy" {
  name = "sqs_policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "sqs:*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
  EOF
}

resource "aws_iam_policy" "prod_secrets_policy" {
  name = "prod_secrets_policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Action": "secretsmanager:GetSecretValue",
    "Resource": "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:production/*"
  }
}
  EOF
}

resource "aws_iam_policy" "ecs_execution_policy" {
  name = "ecs_execution_policy"

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

resource "aws_iam_role" "ecs_events" {
  name = "ecs_events"

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

resource "aws_iam_role_policy" "ecs_events_run_task_with_any_role" {
  name = "ecs_events_run_task_with_any_role"
  role = aws_iam_role.ecs_events.id

  policy = <<DOC
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "iam:PassRole",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "ecs:RunTask",
            "Resource": "*"
        }
    ]
}
DOC
}

