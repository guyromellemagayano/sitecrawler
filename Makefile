help: ## Show this help.
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: cypress

GITHUB_SHA ?= $(shell git rev-parse HEAD)
VERSION ?= $(shell date -u '+%Y%m%d.%H%M%S')-$(shell echo $(GITHUB_SHA) | head -c 6)

dev:          ## Build and run local environment
	docker-compose build
	docker-compose up -d

staging: install-deploy ## Deploy to staging environment
	deploy/staging.py

production: install-deploy ## Deploy to production environment
	deploy/production.py

test-backend: ## Run tests on backend prod image
	docker-compose -f docker-compose.test.yml run --rm backend ./manage.py test

build-push-go: ## Build and push production go images
	make crawler-build-push-go
	make reverifier-build-push-go
	make scheduler-build-push-go
	make uptimer-build-push-go
	make verifier-build-push-go

%-build-push:
	make $(*F)-build
	make $(*F)-push

%-build-push-go:
	make $(*F)-build-go
	make $(*F)-push

%-push:
	deploy/ecr-login.sh
	docker tag 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F) 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):$(VERSION)
	docker push 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F)
	docker push 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):$(VERSION)

%-build:
	deploy/ecr-login.sh
	DOCKER_BUILDKIT=1 \
	docker build \
		--pull \
		--cache-from 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F) \
		--build-arg BUILDKIT_INLINE_CACHE=1 \
		-t 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F) \
		$(*F)/

%-build-go:
	deploy/ecr-login.sh
	DOCKER_BUILDKIT=1 \
	docker build \
		--pull \
		--cache-from 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F) \
		--build-arg BUILDKIT_INLINE_CACHE=1 \
		-t 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F) \
		--build-arg SERVICE=$(*F) \
		go/

test-go:
	cd go && docker-compose -f docker-compose.test.yml up --build

install-deploy:
	python -m pip install --upgrade pip
	pip install -r deploy/requirements.txt

logs: ## Display logs for local environment
	docker-compose logs --tail=100 -f

psql: ## Enter postgres shell for local environment
	docker-compose exec db psql -U postgres

cypress: dev ## Run cypress integration tests
	npm install cypress
	$(shell npm bin)/cypress open

