# Common stuff for go services

## Generating models from db

Run:

```
genna model -c postgres://postgres:crawldev@$(docker inspect -f '{{ (index .NetworkSettings.Networks "web-crawl-app_default").IPAddress }}' web-crawl-app_db_1):5432/postgres?sslmode=disable -o database/models.go -t '*' -f -p database -g 9
```

