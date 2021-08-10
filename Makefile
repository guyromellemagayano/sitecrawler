help: ## Show this help.
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: cypress

GITHUB_SHA ?= $(shell git rev-parse HEAD)
VERSION ?= $(shell date -u '+%Y%m%d.%H%M%S')-$(shell echo $(GITHUB_SHA) | head -c 6)

dev:          ## Build and run local environment
	docker-compose build
	docker-compose up -d

%-deploy: install-deploy ## Deploy to production environment
	deploy/$(*F).py

test-backend: ## Run tests on backend prod image
	docker-compose -p web-crawl-app-test-backend -f docker-compose.test.yml run --rm backend ./manage.py test
	docker-compose -p web-crawl-app-test down -v

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

%-staging-retag:
	deploy/ecr-login.sh
	docker pull 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):latest
	docker tag 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):latest 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):staging
	docker push 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):staging

%-production-retag:
	deploy/ecr-login.sh
	docker pull 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):latest
	docker tag 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):latest 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):production
	docker push 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):production

%-retag:
	make backend-$(*F)-retag
	make frontend-$(*F)-retag
	make crawler-$(*F)-retag
	make reverifier-$(*F)-retag
	make scheduler-$(*F)-retag
	make uptimer-$(*F)-retag
	make verifier-$(*F)-retag

%-push:
	deploy/ecr-login.sh
	docker tag 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):latest 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):$(VERSION)
	docker push 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):latest
	docker push 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):$(VERSION)

%-build:
	deploy/ecr-login.sh
	DOCKER_BUILDKIT=1 \
	docker build \
		--pull \
		--cache-from 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):latest \
		--build-arg BUILDKIT_INLINE_CACHE=1 \
		-t 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):latest \
		$(*F)/

%-build-go:
	deploy/ecr-login.sh
	DOCKER_BUILDKIT=1 \
	docker build \
		--pull \
		--cache-from 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):latest \
		--build-arg BUILDKIT_INLINE_CACHE=1 \
		-t 400936075989.dkr.ecr.us-east-1.amazonaws.com/crawl-app-$(*F):latest \
		--build-arg SERVICE=$(*F) \
		go/

test-go:
	cd go && docker-compose -p web-crawl-app-test-go -f docker-compose.test.yml up --build

install-deploy:
	python -m pip install --upgrade pip
	pip install -r deploy/requirements.txt

logs: ## Display logs for local environment
	docker-compose logs --tail=100 -f

psql: ## Enter postgres shell for local environment
	docker-compose exec db psql -U postgres

psql-cypress: ## Enter postgres shell for cypress environment
	docker-compose -p web-crawl-app-cypress exec db psql -U postgres

cypress: dev ## Run cypress integration tests
	npm install cypress
	$(shell npm bin)/cypress open

cypress-ci:
	deploy/ecr-login.sh
	docker-compose -p web-crawl-app-cypress -f docker-compose.cypress.yml up -d
	docker-compose -p web-crawl-app-cypress -f docker-compose.cypress.yml run backend ./manage.py migrate
	npm install cypress
	$(shell npm bin)/cypress run
	docker-compose -p web-crawl-app-cypress down -v
