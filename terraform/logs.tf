resource "aws_cloudwatch_log_group" "prod_ecs" {
  name = "/ecs/prod_fargate"

  tags = {
    Env = "production"
  }
}
