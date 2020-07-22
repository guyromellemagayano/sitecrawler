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

resource "aws_iam_role_policy" "sqs_node_policy" {
	name = "sqs_node_policy"
	role = aws_iam_role.node_role.id

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
