#!/bin/bash

set -e

pip install -r requirements.txt

./manage.py migrate

./manage.py runserver 0.0.0.0:8000
