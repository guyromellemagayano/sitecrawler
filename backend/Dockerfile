FROM python:3 AS dev
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ./manage.py runserver
EXPOSE 8000


FROM dev as prod

RUN pip install -r requirements.prod.txt

RUN ./manage.py collectstatic --noinput

CMD gunicorn server.wsgi:application --bind 0.0.0.0:8000 --workers=2 --threads=2 --access-logfile "-" --keep-alive 65
