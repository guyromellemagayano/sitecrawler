import datetime

from django.core.management.base import BaseCommand
import sentry_sdk

from crawl.models import Scan


class Command(BaseCommand):
    help = "Deletes expired scans after 6 days (so they can be recrawled on weekly, also queues keep jobs for 4 days)"

    def handle(self, *args, **options):
        print("Starting expired scans job", flush=True)

        threshold = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=6)

        expired_scans = Scan.objects.filter(finished_at__isnull=True, started_at__lt=threshold)
        expired_scan_ids = [s.id for s in expired_scans]
        if not expired_scan_ids:
            print("No expired scans, exiting")
            return

        print(f"Found expired scans: {expired_scan_ids}")
        self._send_to_sentry(expired_scans)

        Scan.objects.raw_bulk_delete(expired_scan_ids)

        print("Expired scans job done", flush=True)

    def _send_to_sentry(self, scans):
        print("Sending to sentry")
        with sentry_sdk.push_scope() as scope:
            scope.set_extra("expired_scans", list(scans))
            sentry_sdk.capture_message("Some scans expired", "error")
