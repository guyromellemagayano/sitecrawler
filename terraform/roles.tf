resource "aws_iam_instance_profile" "staging" {
  name = "staging_profile"
  role = aws_iam_role.staging_node_role.name
}

resource "aws_iam_role" "staging_node_role" {
  name = "staging_node_role"

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

resource "aws_iam_role_policy_attachment" "staging_node_role_policies" {
  for_each = toset([
    "sqs_policy",
    "ecr_policy",
    "s3_policy",
    "staging_secrets_policy",
  ])
  role = aws_iam_role.staging_node_role.name
  policy_arn = aws_iam_policy.policies[each.key].arn
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

resource "aws_iam_role_policy_attachment" "prod_ecs_crawler_policies" {
  for_each = toset([
    "sqs_policy",
    "prod_secrets_policy",
  ])
  role = aws_iam_role.prod_ecs_crawler.name
  policy_arn = aws_iam_policy.policies[each.key].arn
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

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policies" {
  for_each = toset([
    "ecr_policy",
    "log_policy",
  ])
  role = aws_iam_role.ecs_execution_role.name
  policy_arn = aws_iam_policy.policies[each.key].arn
}


resource "aws_iam_instance_profile" "production" {
  name = "production_profile"
  role = aws_iam_role.production_node_role.name
}

resource "aws_iam_role" "production_node_role" {
  name = "production_node_role"

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

resource "aws_iam_role_policy_attachment" "production_node_role_policies" {
  for_each = toset([
    "sqs_policy",
    "ecr_policy",
    "s3_policy",
    "prod_secrets_policy",
  ])
  role = aws_iam_role.production_node_role.name
  policy_arn = aws_iam_policy.policies[each.key].arn
}
