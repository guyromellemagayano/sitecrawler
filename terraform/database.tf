resource "random_password" "production_db_password" {
  length = 32
}

resource "aws_db_instance" "production" {
  allocated_storage    = 200
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "12"
  instance_class       = "db.t3.small"
  name                 = "production"
  username             = "production"
  password             = random_password.production_db_password.result
  backup_retention_period = 30
  vpc_security_group_ids = [aws_security_group.production_db.id]
  performance_insights_enabled = true
  apply_immediately = true
  tags = {
    Env = "production"
  }
}

resource "aws_secretsmanager_secret" "prod_db_password" {
  name = "production/DB_PASS_PRODUCTION"
}

resource "aws_secretsmanager_secret_version" "prod_db_password" {
  secret_id     = aws_secretsmanager_secret.prod_db_password.id
  secret_string = random_password.production_db_password.result
}


