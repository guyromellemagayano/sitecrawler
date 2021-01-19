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

# resource "aws_ecr_repository" "crawl-app-scheduler" {
#   name                 = "crawl-app-scheduler"
#   image_tag_mutability = "MUTABLE"
# }

resource "aws_ecr_repository" "crawl-app-uptimer" {
  name                 = "crawl-app-uptimer"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "crawl-app-verifier" {
  name                 = "crawl-app-verifier"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "crawl-app-reverifier" {
  name                 = "crawl-app-reverifier"
  image_tag_mutability = "MUTABLE"
}
