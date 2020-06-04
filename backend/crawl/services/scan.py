import requests
from django.conf import settings

from crawl.models.scan import Scan


def site(site):
    scans_in_progress = Scan.objects.filter(site=site, finished_at=None).count()
    if scans_in_progress > 0:
        return

    scan = Scan.objects.create(site=site)

    response = requests.post(settings.CRAWLER_URL + "/scan", json={"scan_id": scan.id})
    response.raise_for_status()

    return response.json()
