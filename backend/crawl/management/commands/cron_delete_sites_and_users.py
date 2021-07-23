from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from crawl.models import Site, Scan


class Command(BaseCommand):
    help = "Deletes old scans, keep first and last 3, archive stats"

    def handle(self, *args, **options):
        print("Starting delete sites and users job", flush=True)

        sites_to_delete = Site.objects.filter(deleted_at__isnull=False)
        users_to_delete = User.objects.filter(is_active=False)

        scan_ids_to_be_deleted = []
        scan_ids_to_be_deleted.extend(Scan.objects.filter(site__in=sites_to_delete).values_list("id", flat=True))
        scan_ids_to_be_deleted.extend(Scan.objects.filter(site__user__in=users_to_delete).values_list("id", flat=True))

        print(
            f"Deleting {sites_to_delete.count()} sites and {users_to_delete.count()} users ({len(scan_ids_to_be_deleted)} scans)",
            flush=True,
        )

        # optimized deletion for scans
        Scan.objects.raw_bulk_delete(scan_ids_to_be_deleted)

        print("Done deleting scans, now deleting everything else", flush=True)

        # regular deletion for everything else
        sites_to_delete.delete()
        users_to_delete.delete()

        print("Delete sites and users job done", flush=True)
