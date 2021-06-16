from django.conf import settings
from django.contrib.auth import models as auth_models
from django.contrib.sites import models as django_sites_models
from django.core.mail import send_mail
from django.core.management.base import BaseCommand
from django.template.loader import render_to_string

from crawl.models import Scan, GroupSettings


class Command(BaseCommand):
    help = """Sends email of last finished crawls to the user.
    Should have a separate cron instance for each recrawl frequency."""

    def add_arguments(self, parser):
        parser.add_argument("frequency", type=str, choices=[c[1].lower() for c in GroupSettings.RECRAWL_CHOICES])

    def handle(self, *args, **options):
        print("Starting email job", flush=True)

        frequency = {c[1].lower(): c[0] for c in GroupSettings.RECRAWL_CHOICES}[options["frequency"]]

        # get unique set of users that are in group with given recrawl frequency
        users = auth_models.User.objects.filter(groups__groupsettings__recrawl_frequency=frequency).distinct("id")
        for user in users:
            print(f"Sending emails for {user}", flush=True)

            if not user.email or not user.is_active:
                continue
            latest_finished_scans = (
                Scan.objects.filter(site__user=user, finished_at__isnull=False)
                .order_by("site_id", "-finished_at")
                .distinct("site_id")
            )
            scans_with_details = [Scan.objects.with_details().get(pk=scan.id) for scan in latest_finished_scans]

            if len(scans_with_details) < 1:
                continue

            self._send_email(user, scans_with_details)

        print("Delete job finished", flush=True)

    def _send_email(self, user, scans):
        site = django_sites_models.Site.objects.get_current()
        context = {"user": user, "scans": scans, "site": site}
        subject = render_to_string("crawl_email_subject.txt", context).strip()
        message = render_to_string("crawl_email_message.txt", context)
        send_mail(settings.EMAIL_SUBJECT_PREFIX + subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
