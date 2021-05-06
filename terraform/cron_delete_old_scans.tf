module "cron_delete_old_scans" {
  source = "./modules/ecs_cron"

  name = "delete_old_scans"
  image = "400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-backend"
  command = ["./manage.py", "cron_delete_old_scans"]
  schedule = "cron(00 11 * * ? *)"
  // must have public ip for now because otherwise ecr and secretmanager don't work in vpc
  // eventually we should set up endpoints for that, but it's somewhat complicated
  assign_public_ip = true
  subnets = [aws_default_subnet.default_az1.id, aws_default_subnet.default_az2.id, aws_default_subnet.default_az3.id, aws_default_subnet.default_az4.id, aws_default_subnet.default_az5.id, aws_default_subnet.default_az6.id]

  # common but needed stuff
  cluster_arn = aws_ecs_cluster.prod_fargate.arn
  region = data.aws_region.current.name
  account_id = data.aws_caller_identity.current.account_id
}
