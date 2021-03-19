resource "postgresql_role" "prod_db_postgres_rw" {
  name = "prod_db_postgres_rw"
}

resource "postgresql_grant" "prod_db_postgres_rw_grant" {
  for_each = var.object_type_all_privileges
  database = data.aws_db_instance.production.db_name
  schema = "public"
  role = postgresql_role.prod_db_postgres_rw.name
  object_type = each.key
  privileges = each.value
}

resource "postgresql_default_privileges" "prod_db_postgres_rw_default" {
  for_each = {
    for pair in setproduct(
      ["table", "sequence", "function"],
      concat(var.users, list(data.aws_db_instance.production.master_username)),
    ) : "${pair[0]}.${pair[1]}" => {
      object_type = pair[0]
      owner = pair[1]
    }
  }
  database = data.aws_db_instance.production.db_name
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

resource "aws_secretsmanager_secret" "prod_db_user_password_secret" {
  for_each = toset(var.users)
  name = "production/DB_PASS_${upper(each.key)}"
}

resource "aws_secretsmanager_secret_version" "prod_db_user_password_version" {
  for_each = toset(var.users)
  secret_id     = aws_secretsmanager_secret.prod_db_user_password_secret[each.key].id
  secret_string = random_password.prod_db_user_password[each.key].result
}
