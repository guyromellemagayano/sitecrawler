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

build-push-go: ## Build and push production go images
	deploy/ecr-login.sh
	docker build -t 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-crawler --build-arg SERVICE=crawler go/
	docker build -t 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-scheduler --build-arg SERVICE=scheduler go/
	docker build -t 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-uptimer --build-arg SERVICE=uptimer go/
	docker push 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-crawler
	docker push 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-scheduler
	docker push 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-uptimer

test-go:
	cd go && docker-compose -f docker-compose.test.yml up --build

install-deploy:
	python -m pip install --upgrade pip
	pip install -r deploy/requirements.txt

logs: ## Display logs for local environment
	docker-compose logs --tail=100 -f

psql: ## Enter postgres shell for local environment
	docker-compose exec db psql -U postgres
