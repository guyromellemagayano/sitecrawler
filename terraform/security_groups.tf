resource "aws_security_group" "node_security_group" {
  name        = "node_security_group"
  description = "Allow required traffic"

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

resource "aws_security_group" "production" {
  name        = "production_security_group"
  description = "Allow outgoing traffic"

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "alb" {
  name        = "alb_security_group"
  description = "Allow incoming http and outgoing to production nodes"

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
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
		security_groups = [aws_security_group.production.id]
  }
}
