help: ## Show this help.
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

dev:          ## Build and run local environment
	docker-compose build
	docker-compose up -d

staging: build-prod push-prod ## Deploy to staging environment
	deploy/staging.py

build-prod: ## Build production images
	docker build -t 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-backend backend/
	# docker build -t 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-frontend frontend/
	docker build -t 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-crawler crawler/

push-prod: ## Upload production images to ecr
	deploy/ecr-login.sh
	docker push 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-backend
	# docker push 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-frontend
	docker push 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-crawler

logs: ## Display logs for local environment
	docker-compose logs --tail=100 -f

psql: ## Enter postgres shell for local environment
	docker-compose exec db psql -U postgres
