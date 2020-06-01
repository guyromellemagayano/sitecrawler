resource "aws_security_group" "node_security_group" {
  name        = "node_security_group"
  description = "Allow required traffic"

  ingress {
    description = "SSH"
    to_port     = 22
		from_port   = 22
    protocol    = "tcp"
    cidr_blocks = []
  }

	ingress {
    description = "http"
    to_port     = 80
		from_port   = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

	ingress {
    description = "https"
    to_port     = 443
		from_port   = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
