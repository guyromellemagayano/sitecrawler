resource "aws_ecs_cluster" "prod_fargate" {
  name = "prod_fargate"
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]
  tags = {
    Name = "fargate"
    Env = "production"
  }
}
