// if you're adding a new cron that needs access to db,
// be sure to make it's security group to allowed in `security_groups.tf`
module "reverifier" {
  source = "./modules/ecs_cron"

  name = "reverifier"
  image = "400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-reverifier:production"
  schedule = "cron(0 6 * * ? *)"
  assign_public_ip = true
  subnets = [aws_default_subnet.default_az1.id, aws_default_subnet.default_az2.id, aws_default_subnet.default_az3.id, aws_default_subnet.default_az4.id, aws_default_subnet.default_az5.id, aws_default_subnet.default_az6.id]

  # common but needed stuff
  cluster_arn = aws_ecs_cluster.prod_fargate.arn
  region = data.aws_region.current.name
  account_id = data.aws_caller_identity.current.account_id
}
