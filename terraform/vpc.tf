resource "aws_default_vpc" "default" {
}

resource "aws_default_subnet" "default_az1" {
  availability_zone = "us-east-1a"
}

resource "aws_default_subnet" "default_az2" {
  availability_zone = "us-east-1b"
}

resource "aws_default_subnet" "default_az3" {
  availability_zone = "us-east-1c"
}

resource "aws_default_subnet" "default_az4" {
  availability_zone = "us-east-1d"
}

resource "aws_default_subnet" "default_az5" {
  availability_zone = "us-east-1e"
}

resource "aws_default_subnet" "default_az6" {
  availability_zone = "us-east-1f"
}
