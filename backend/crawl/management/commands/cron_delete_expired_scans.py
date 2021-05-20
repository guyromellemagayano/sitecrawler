import datetime

from django.core.management.base import BaseCommand

from crawl.models import Scan


class Command(BaseCommand):
    help = "Deletes old scans, keep first and last 3, archive stats"

    def handle(self, *args, **options):
        print("Starting expired scans job", flush=True)

        threshold = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=10)

        expired_scans = Scan.objects.filter(finished_at__isnull=True, started_at__lt=threshold)
        expired_scan_ids = [s.id for s in expired_scans]
        if not expired_scan_ids:
            print("No expired scans, exiting")
            return

        print(f"Found expired scans: {expired_scan_ids}")

        Scan.objects.raw_bulk_delete(expired_scan_ids)

        print("Expired scans job done", flush=True)
