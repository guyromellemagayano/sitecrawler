variable "users" {
  type = list(string)
  default = ["backend", "crawler", "reverifier", "uptimer", "scheduler", "verifier"]
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
