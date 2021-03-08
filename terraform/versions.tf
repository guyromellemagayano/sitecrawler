terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
    random = {
      source = "hashicorp/random"
    }
    postgresql = {
      source = "cyrilgdn/postgresql"
    }
  }
  required_version = ">= 0.13"
}
