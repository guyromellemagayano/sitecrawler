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

#### Google login

1. Add google social application in [django admin](http://localhost:8000/admin/socialaccount/socialapp/) with `dev client` oauth client from [Developer Console](https://console.developers.google.com/apis/credentials?project=edl-app-link-spider). Only client id and secret key are needed. You also need to move the site to the right.

2. Login url is `/auth/google/login/`. You cannot login with an email that is already registered in the system.
