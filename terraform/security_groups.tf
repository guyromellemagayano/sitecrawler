// for staging node
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

// for production nodes
resource "aws_security_group" "production" {
	name        = "production_security_group"
	description = "Allow outgoing traffic"

	ingress {
		description = "alb"
		from_port = 8000
		to_port = 8001
		protocol = "tcp"
		security_groups = [aws_security_group.alb.id]
	}

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
		from_port   = 0
		to_port     = 0
		protocol    = "-1"
		cidr_blocks = ["0.0.0.0/0"]
	}
}

resource "aws_security_group" "production_db" {
	name        = "production_db_security_group"
	description = "Allow incoming from production"

	ingress {
		from_port = 5432
		to_port = 5432
		protocol = "tcp"
		security_groups = [
      aws_security_group.production.id,
      aws_security_group.prod_ecs_crawler.id,
      aws_security_group.prod_ecs_reverifier.id,
    ]
	}

	egress {
		from_port   = 0
		to_port     = 0
		protocol    = "-1"
		cidr_blocks = ["0.0.0.0/0"]
	}
}

resource "aws_security_group" "prod_ecs_crawler" {
	name        = "prod_ecs_crawler_security_group"
	description = "Allow outgoing traffic"

	egress {
		from_port   = 0
		to_port     = 0
		protocol    = "-1"
		cidr_blocks = ["0.0.0.0/0"]
	}
}

resource "aws_security_group" "prod_ecs_reverifier" {
	name        = "prod_ecs_reverifier_security_group"
	description = "Allow outgoing traffic"

	egress {
		from_port   = 0
		to_port     = 0
		protocol    = "-1"
		cidr_blocks = ["0.0.0.0/0"]
	}
}
