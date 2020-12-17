import datetime
import random

from django.core.management.base import BaseCommand

from uptime.models import UptimeStat


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("site_id", type=int)

    def handle(self, *args, **options):
        site_id = options["site_id"]
        days = 90
        status = UptimeStat.STATUS_OK
        http_status = 200
        dt = datetime.datetime.now() - datetime.timedelta(days=days)
        while dt < datetime.datetime.now():
            if status == UptimeStat.STATUS_OK:
                if random.randrange(100) >= 90:
                    status = UptimeStat.STATUS_HTTP_ERROR
                    http_status = 500
            else:
                if random.randrange(100) >= 50:
                    status = UptimeStat.STATUS_OK
                    http_status = 200

            result = UptimeStat.objects.create(
                site_id=site_id,
                status=status,
                http_status=http_status,
                response_time=random.randrange(100, 900),
                error=None if status == UptimeStat.STATUS_OK else "Internal Server Error",
            )
            # hack to get around auto now add
            UptimeStat.objects.filter(pk=result.pk).update(created_at=dt)
            dt += datetime.timedelta(minutes=5)
