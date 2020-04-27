# web-crawl-app

Crawl app with django backend and go crawler.

## Getting Started

### Prerequisites

You need to have Docker and docker-compose installed.

### Running locally

Start the backend server with postgres locally:

```
docker-compose up
```

This will start the backend listening on `localhost:8000`.

#### Creating super user

Open shell to running backend conatiner:

```
docker exec -it web-crawl-app_backend_1 bash
```

Use django command to create superuser:

```
./manage.py createsuperuser
```

### Authentication

We're using [django-rest-auth](https://django-rest-auth.readthedocs.io/en/latest/introduction.html) for authentication endpoints. See `backend/server/urls.py` for mapping of the endpoint urls.
