resource "aws_lb" "production" {
	name               = "production-lb"
	internal           = false
	load_balancer_type = "application"
	security_groups = [aws_security_group.alb.id]
	subnets = [
		aws_default_subnet.default_az1.id,
		aws_default_subnet.default_az2.id,
		aws_default_subnet.default_az3.id,
		aws_default_subnet.default_az4.id,
		aws_default_subnet.default_az5.id,
		aws_default_subnet.default_az6.id,
	]

	enable_deletion_protection = true

	tags = {
		Env = "production"
	}
}

resource "aws_lb_listener" "http" {
	load_balancer_arn = aws_lb.production.arn
	port              = "80"
	protocol          = "HTTP"

	default_action {
		type = "redirect"

		redirect {
			port        = "443"
			protocol    = "HTTPS"
			status_code = "HTTP_301"
		}
	}
}

resource "aws_lb_listener" "https" {
	load_balancer_arn = aws_lb.production.arn
	port              = "443"
	protocol          = "HTTPS"
	ssl_policy        = "ELBSecurityPolicy-2016-08"
	certificate_arn   = aws_acm_certificate.production.arn

	default_action {
		type = "fixed-response"

		fixed_response {
			content_type = "text/plain"
			message_body = "Not Found"
			status_code  = "404"
		}
	}
}

resource "aws_acm_certificate" "production" {
	domain_name       = "app.sitecrawler.com"
	validation_method = "DNS"

	tags = {
		Env = "production"
	}

	lifecycle {
		create_before_destroy = true
	}
}

resource "aws_lb_listener_rule" "backend" {
	listener_arn = aws_lb_listener.https.arn
	priority     = 100

	action {
		type             = "forward"
		target_group_arn = aws_lb_target_group.backend.arn
	}

	condition {
		path_pattern {
			values = ["/api/*", "/auth/*", "/admin/*", "/static/*"]
		}
	}

	condition {
		host_header {
			values = [aws_acm_certificate.production.domain_name]
		}
	}
}

resource "aws_lb_listener_rule" "frontend" {
	listener_arn = aws_lb_listener.https.arn
	priority     = 200

	action {
		type             = "forward"
		target_group_arn = aws_lb_target_group.frontend.arn
	}

	condition {
		host_header {
			values = [aws_acm_certificate.production.domain_name]
		}
	}
}

resource "aws_lb_target_group" "frontend" {
	name     = "frontend"
	port     = 8000
	protocol = "HTTP"
	vpc_id = aws_default_vpc.default.id
	deregistration_delay = 30

	health_check {
		path = "/api/healthcheck/"
	}
}

resource "aws_lb_target_group" "backend" {
	name     = "backend"
	port     = 8001
	protocol = "HTTP"
	vpc_id = aws_default_vpc.default.id
	deregistration_delay = 30

	health_check {
		path = "/healthcheck/"
	}
}
