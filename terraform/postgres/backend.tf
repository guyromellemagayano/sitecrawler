terraform {
  backend "s3" {
    bucket = "epic-linkapp-terraform-state"
    key    = "terraform-postgres.state"
    region = "us-east-1"
  }
}
