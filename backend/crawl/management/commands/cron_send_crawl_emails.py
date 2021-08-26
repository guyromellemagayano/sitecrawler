from django.db import transaction
from django.conf import settings
from django.contrib.sites import models as django_sites_models
from django.core.mail import send_mail
from django.core.management.base import BaseCommand
from django.template.loader import render_to_string

from crawl.models import Scan
from teams.models import Plan, Team


class Command(BaseCommand):
    help = """Sends email of last finished crawls to the user.
    Should have a separate cron instance for each recrawl frequency."""

    def add_arguments(self, parser):
        parser.add_argument("frequency", type=str, choices=[p[1].lower() for p in Plan.RECRAWL_CHOICES])

    def handle(self, *args, **options):
        print("Starting email job", flush=True)

        frequency = {p[1].lower(): p[0] for p in Plan.RECRAWL_CHOICES}[options["frequency"]]

        teams = Team.objects.filter(plan__recrawl_frequency=frequency)
        for team in teams:
            print(f"Sending emails for {team}", flush=True)

            latest_finished_scans = (
                Scan.objects.filter(site__team=team, finished_at__isnull=False)
                .order_by("site_id", "-finished_at")
                .distinct("site_id")
            )

            scans_with_details = []
            for scan in latest_finished_scans:
                with transaction.atomic():
                    swd = Scan.objects.with_details().get(pk=scan.id)
                scans_with_details.append(swd)

            if len(scans_with_details) < 1:
                continue

            users = [m.user for m in team.membership_set.all()]
            self._send_email(users, scans_with_details)

        print("Email job finished", flush=True)

    def _send_email(self, users, scans):
        for user in users:
            if not user.email or not user.is_active:
                continue

            site = django_sites_models.Site.objects.get_current()
            context = {"user": user, "scans": scans, "site": site}
            subject = render_to_string("crawl_email_subject.txt", context).strip()
            message = render_to_string("crawl_email_message.txt", context)
            send_mail(settings.EMAIL_SUBJECT_PREFIX + subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
