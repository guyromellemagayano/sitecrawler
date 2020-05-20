import requests


def url(url):
    response = requests.post("http://crawler:3000/verify", json={"url": url})
    response.raise_for_status()

    return response.json()["ok"]
