resource "aws_instance" "web" {
  ami           = "ami-068663a3c619dd892"
  instance_type = "t2.micro"

  tags = {
    Name = "Staging"
  }
}
