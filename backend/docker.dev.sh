#!/bin/bash

set -e

pip install -r requirements.txt

./manage.py migrate --database superuser

./manage.py runserver --force-color 0.0.0.0:8000 1>&2
