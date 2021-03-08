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
  name = "production/DB_PASS"
}

resource "aws_secretsmanager_secret_version" "prod_db_password" {
  secret_id     = aws_secretsmanager_secret.prod_db_password.id
  secret_string = random_password.production_db_password.result
}

variable "users" {
  type = list(string)
  default = ["backend", "crawler", "reverifier", "uptimer", "scheduler"]
}

variable "object_type_all_privileges" {
  type = map(list(string))
  default = {
    database = ["CONNECT", "CREATE", "TEMPORARY"],
    schema = ["CREATE", "USAGE"],
    table = ["DELETE", "INSERT", "REFERENCES", "SELECT", "TRIGGER", "TRUNCATE", "UPDATE"]
    sequence = ["SELECT", "UPDATE", "USAGE"]
    function = ["EXECUTE"]
  }
}

resource "postgresql_role" "prod_db_postgres_rw" {
  name = "prod_db_postgres_rw"
}

resource "postgresql_grant" "prod_db_postgres_rw_grant" {
  for_each = var.object_type_all_privileges
  database = aws_db_instance.production.name
  schema = "public"
  role = postgresql_role.prod_db_postgres_rw.name
  object_type = each.key
  privileges = each.value
}

resource "postgresql_default_privileges" "prod_db_postgres_rw_default" {
  for_each = {
    for pair in setproduct(
      ["table", "sequence", "function"],
      concat(var.users, list(aws_db_instance.production.username)),
    ) : "${pair[0]}.${pair[1]}" => {
      object_type = pair[0]
      owner = pair[1]
    }
  }
  database = aws_db_instance.production.name
  schema = "public"
  role = postgresql_role.prod_db_postgres_rw.name
  object_type = each.value.object_type
  owner = each.value.owner
  privileges = var.object_type_all_privileges[each.value.object_type]
}

resource "random_password" "prod_db_user_password" {
  for_each = toset(var.users)
  length = 32
  special = false
}

resource "postgresql_role" "prod_db_user" {
  for_each = toset(var.users)
  name = each.key
  login = true
  password = random_password.prod_db_user_password[each.key].result
  roles = [postgresql_role.prod_db_postgres_rw.name]
}
