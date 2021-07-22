variable "ecr_repositories" {
  type = list(string)
  default = [
    "crawl-app-backend",
    "crawl-app-crawler",
    "crawl-app-frontend",
    "crawl-app-uptimer",
    "crawl-app-verifier",
    "crawl-app-reverifier",
    "crawl-app-scheduler",
  ]
}

resource "aws_ecr_repository" "repository" {
  for_each = toset(var.ecr_repositories)

  name                 = each.value
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_lifecycle_policy" "keep_last_30" {
  for_each = aws_ecr_repository.repository
  repository = each.value.id

  policy = <<EOF
  {
    "rules": [
      {
        "rulePriority": 1,
        "description": "Keep last 30 images",
        "selection": {
          "tagStatus": "any",
          "countType": "imageCountMoreThan",
          "countNumber": 30
        },
        "action": {
          "type": "expire"
        }
      }
    ]
  }
  EOF
}
