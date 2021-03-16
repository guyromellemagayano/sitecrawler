from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError

from crawl.models import Site, Scan, ScanArchive
from crawl.serializers import ScanDetailSerializer


class Command(BaseCommand):
    help = "Deletes old scans, keep first and last 3, archive stats"

    def handle(self, *args, **options):
        for site in Site.objects.all():
            scans = site.scan_set.filter(finished_at__isnull=False)
            scan_count = scans.count()
            if scan_count > 4:
                for scan in scans[1 : scan_count - 3]:
                    self._archive_and_delete_scan(scan)

    def _archive_and_delete_scan(self, scan):
        self.stdout.write(f"Archiving {scan.id} for {scan.site.url}")

        large_page_size_threshold = scan.site.large_page_size_threshold
        if not large_page_size_threshold:
            large_page_size_threshold = scan.site.user.userprofile.large_page_size_threshold
        data = ScanDetailSerializer(
            Scan.objects.details(large_page_size_threshold=large_page_size_threshold).get(pk=scan.id)
        ).data

        try:
            ScanArchive.objects.create(
                site=scan.site,
                scan_id=scan.id,
                started_at=scan.started_at,
                finished_at=scan.finished_at,
                data=data,
            )
        except IntegrityError:
            pass

        self.stdout.write(f"Deleting {scan.id} for {scan.site.url}")
        scan.delete()
