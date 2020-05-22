import requests


def site(site):
    response = requests.post("http://crawler:3000/verify", json={"site_id": site.id})
    response.raise_for_status()

    return response.json()
