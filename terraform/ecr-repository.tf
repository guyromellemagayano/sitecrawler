resource "aws_ecr_repository" "crawl-app-backend" {
  name                 = "crawl-app-backend"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "crawl-app-crawler" {
  name                 = "crawl-app-crawler"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "crawl-app-frontend" {
  name                 = "crawl-app-frontend"
  image_tag_mutability = "MUTABLE"
}

