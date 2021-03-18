provider "aws" {
  region = "us-east-1"
}

provider "postgresql" {
  host            = "localhost"
  port            = 5432
  database        = data.aws_db_instance.production.db_name
  username        = data.aws_db_instance.production.master_username
  password        = data.aws_secretsmanager_secret_version.production_db_password_version.secret_string
  sslmode         = "require"
  connect_timeout = 15
  superuser = false
}
