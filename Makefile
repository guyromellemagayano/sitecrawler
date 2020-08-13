help: ## Show this help.
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

dev:          ## Build and run local environment
	docker-compose build
	docker-compose up -d

staging: install-deploy ## Deploy to staging environment
	deploy/staging.py

production: install-deploy ## Deploy to production environment
	deploy/production.py

build-push-backend: ## Build and push production backend image
	deploy/ecr-login.sh
	docker build -t 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-backend backend/
	docker push 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-backend

build-push-frontend: ## Build and push production frontend image
	deploy/ecr-login.sh
	docker build -t 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-frontend frontend/
	docker push 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-frontend

build-push-crawler: ## Build and push production crawler image
	deploy/ecr-login.sh
	docker build -t 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-crawler --build-arg SERVICE=crawler go/
	docker push 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-crawler

build-push-scheduler: ## Build and push production scheduler image
	deploy/ecr-login.sh
	docker build -t 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-scheduler --build-arg SERVICE=scheduler go/
	docker push 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-scheduler

install-deploy:
	python -m pip install --upgrade pip
	pip install -r deploy/requirements.txt

logs: ## Display logs for local environment
	docker-compose logs --tail=100 -f

psql: ## Enter postgres shell for local environment
	docker-compose exec db psql -U postgres
