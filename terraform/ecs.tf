resource "aws_ecs_cluster" "prod_fargate" {
  name = "prod_fargate"
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]
  tags = {
    Name = "fargate"
    Env = "production"
  }
}

resource "aws_ecs_task_definition" "prod_crawler" {
  family                = "prod_crawler_task"
  container_definitions = <<TASK_DEFINITION
  [
    {
      "name": "crawler",
      "image": "400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-crawler",
      "environment": [
        {"name": "ENV", "value": "production"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group" : "${aws_cloudwatch_log_group.prod_ecs.name}",
          "awslogs-region": "${data.aws_region.current.name}",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "essential": true
    }
  ]
  TASK_DEFINITION

  cpu = 256
  memory = 512

  requires_compatibilities = ["FARGATE"]
  network_mode = "awsvpc"
  task_role_arn = aws_iam_role.prod_ecs_crawler.arn
  execution_role_arn = aws_iam_role.ecs_execution_role.arn
}

resource "aws_ecs_service" "prod_crawler" {
  name            = "prod_crawler_service"
  cluster         = aws_ecs_cluster.prod_fargate.id
  task_definition = aws_ecs_task_definition.prod_crawler.arn
  desired_count   = 1

  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight = 1
  }
  network_configuration {
    subnets = [aws_default_subnet.default_az1.id, aws_default_subnet.default_az2.id, aws_default_subnet.default_az3.id, aws_default_subnet.default_az4.id, aws_default_subnet.default_az5.id, aws_default_subnet.default_az6.id]
    security_groups = [aws_security_group.prod_ecs_crawler.id]
    assign_public_ip = true
  }
}


