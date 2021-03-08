provider "aws" {
  region = "us-east-1"
}

data "aws_region" "current" {}

data "aws_caller_identity" "current" {}

provider "postgresql" {
  host            = "localhost"
  port            = 5432
  database        = aws_db_instance.production.name
  username        = aws_db_instance.production.username
  password        = random_password.production_db_password.result
  sslmode         = "require"
  connect_timeout = 15
  superuser = false
}
