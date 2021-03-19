data "aws_db_instance" "production" {
  // TODO: how to make this better?
  db_instance_identifier = "terraform-20200810173347645600000001"
}

data "aws_secretsmanager_secret" "production_db_password" {
  name = "production/DB_PASS"
}

data "aws_secretsmanager_secret_version" "production_db_password_version" {
  secret_id = data.aws_secretsmanager_secret.production_db_password.id
}
