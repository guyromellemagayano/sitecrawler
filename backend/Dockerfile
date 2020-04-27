FROM python:3
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ./manage.py runserver
EXPOSE 8000
