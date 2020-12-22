import requests
from django.conf import settings


def site(site):
    response = requests.post(settings.VERIFIER_URL + "/verify", json={"site_id": site.id})
    response.raise_for_status()

    return response.json()
