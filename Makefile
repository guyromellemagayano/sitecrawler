run:
	docker-compose up -d

logs:
	docker-compose logs --tail=100 -f

psql:
	docker-compose exec db psql -U postgres
