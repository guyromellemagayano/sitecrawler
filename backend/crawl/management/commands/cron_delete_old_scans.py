from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from django.db import connections

from crawl.models import Site, Scan, ScanArchive
from crawl.serializers import ScanDetailSerializer


class Command(BaseCommand):
    help = "Deletes old scans, keep first and last 3, archive stats"

    def handle(self, *args, **options):
        scan_ids_to_be_deleted = []
        for site in Site.objects.all():
            scans = site.scan_set.filter(finished_at__isnull=False).order_by("started_at")
            scan_count = scans.count()
            if scan_count > 4:
                for scan in scans[1 : scan_count - 3]:
                    self._archive_scan(scan)
                    scan_ids_to_be_deleted.append(scan.id)

        self._delete_scans(scan_ids_to_be_deleted)

        self._vacuum()

        print("Delete job done", flush=True)

    def _archive_scan(self, scan):
        if ScanArchive.objects.filter(site=scan.site, scan_id=scan.id).exists():
            return

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

    def _delete_scans(self, scan_ids):
        scan_ids = tuple(scan_ids)
        with connections["superuser"].cursor() as cursor:
            print("Deleting link links", flush=True)
            cursor.execute(
                "DELETE FROM crawl_link_links WHERE from_link_id IN (SELECT id FROM crawl_link WHERE scan_id IN %s)",
                [scan_ids],
            )
            print("Deleting link images", flush=True)
            cursor.execute(
                "DELETE FROM crawl_link_images WHERE from_link_id IN (SELECT id FROM crawl_link WHERE scan_id IN %s)",
                [scan_ids],
            )
            print("Deleting link scripts", flush=True)
            cursor.execute(
                "DELETE FROM crawl_link_scripts WHERE from_link_id IN (SELECT id FROM crawl_link WHERE scan_id IN %s)",
                [scan_ids],
            )
            print("Deleting link stylesheets", flush=True)
            cursor.execute(
                "DELETE FROM crawl_link_stylesheets WHERE from_link_id IN (SELECT id FROM crawl_link WHERE scan_id IN %s)",
                [scan_ids],
            )
            print("Deleting pagedata", flush=True)
            cursor.execute(
                "DELETE FROM crawl_pagedata WHERE link_id IN (SELECT id FROM crawl_link WHERE scan_id IN %s)",
                [scan_ids],
            )
            print("Deleting links", flush=True)
            cursor.execute("DELETE FROM crawl_link WHERE scan_id IN %s", [scan_ids])
            print("Deleting fifo relations", flush=True)
            cursor.execute(
                "DELETE FROM crawl_fiforelation WHERE entry_id IN (SELECT id FROM crawl_fifoentry WHERE scan_id IN %s)",
                [scan_ids],
            )
            print("Deleting fifo entries", flush=True)
            cursor.execute("DELETE FROM crawl_fifoentry WHERE scan_id IN %s", [scan_ids])
            print("Deleting scans", flush=True)
            cursor.execute("DELETE FROM crawl_scan WHERE id IN %s", [scan_ids])

    def _vacuum(self):
        tables = ["crawl_link", "crawl_link_images", "crawl_link_scripts", "crawl_link_stylesheets", "crawl_link_links"]
        for table in tables:
            print(f"Vacuuming {table}", flush=True)
            with connections["superuser"].cursor() as cursor:
                cursor.execute(f"VACUUM ANALYZE {table}")
