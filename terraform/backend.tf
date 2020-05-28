terraform {
  backend "s3" {
    bucket = "epic-linkapp-terraform-state"
    key    = "terraform.state"
    region = "us-east-1"
  }
}
