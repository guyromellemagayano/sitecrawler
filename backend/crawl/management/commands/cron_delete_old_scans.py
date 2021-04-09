from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from django.db import connections

from crawl.models import Site, Scan, ScanArchive
from crawl.serializers import ScanDetailSerializer


class Command(BaseCommand):
    help = "Deletes old scans, keep first and last 3, archive stats"

    def handle(self, *args, **options):
        for site in Site.objects.all():
            scans = site.scan_set.filter(finished_at__isnull=False).order_by("started_at")
            scan_count = scans.count()
            if scan_count > 4:
                for scan in scans[1 : scan_count - 3]:
                    self._archive_and_delete_scan(scan)

        self._vacuum()

        print("Delete job done", flush=True)

    def _archive_and_delete_scan(self, scan):
        print(f"Archiving {scan.id} for {scan.site.url}", flush=True)

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

        for i, link in enumerate(scan.link_set.all()):
            if i % 1000 == 0:
                print(f"Deleting link {i} for {scan.id} for {scan.site.url}", flush=True)
            link.delete()

        print(f"Deleting {scan.id} for {scan.site.url}", flush=True)
        scan.delete()

    def _vacuum(self):
        tables = ["crawl_link", "crawl_link_images", "crawl_link_scripts", "crawl_link_stylesheets", "crawl_link_links"]
        for table in tables:
            print(f"Vacuuming {table}", flush=True)
            with connections["superuser"].cursor() as cursor:
                cursor.execute(f"VACUUM ANALYZE {table}")
