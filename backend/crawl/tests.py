import datetime
from unittest import mock

from django.contrib.auth.models import User
from django.test import Client, TestCase

from . import models


class ScanSendFinishedEmailTestCase(TestCase):
    def setUp(self):
        self.superuser = User.objects.create_superuser(
            "testsuperuser", "superuser@test.com", "test123", first_name="John"
        )
        self.client = Client()
        self.client.force_login(self.superuser)
        self.client.raise_request_exception = True
        self.site = models.Site.objects.create(user=self.superuser, url="test.com")

    @mock.patch("crawl.views.scan.send_mail")
    def test_initial_email(self, mock_send_mail):
        scan = models.Scan.objects.create(site=self.site, finished_at=datetime.datetime.now())

        self.client.post(f"/api/site/{self.site.id}/scan/{scan.id}/send_finished_email/")

        mock_send_mail.assert_called_once_with(
            "SiteCrawlerTest - First crawl of your site finished",
            f"""Hello John,

We just completed a crawl of test.com and we found:
- 0 link issues.
- 0 page issues.
- 0 image issues.
- 0 seo issues.

Visit your site dashboard to learn more:
https://example.com/dashboard/site/{self.site.id}/overview

Thanks,
example.com
""",
            "from@test.com",
            ["superuser@test.com"],
        )

    @mock.patch("crawl.views.scan.send_mail")
    def test_email_already_sent(self, mock_send_mail):
        scan = models.Scan.objects.create(site=self.site, finished_at=datetime.datetime.now(), email_sent=True)

        self.client.post(f"/api/site/{self.site.id}/scan/{scan.id}/send_finished_email/")

        mock_send_mail.assert_not_called()

    @mock.patch("crawl.views.scan.send_mail")
    def test_another_scan_in_progress(self, mock_send_mail):
        other_site = models.Site.objects.create(user=self.superuser, url="other.com")
        # older existing sent scans
        models.Scan.objects.create(
            site=other_site, finished_at=datetime.datetime.now() - datetime.timedelta(hours=1), email_sent=True
        )
        models.Scan.objects.create(
            site=self.site, finished_at=datetime.datetime.now() - datetime.timedelta(hours=1), email_sent=True
        )
        # scan in progress
        models.Scan.objects.create(site=other_site)
        # current scan
        scan = models.Scan.objects.create(site=self.site, finished_at=datetime.datetime.now())

        self.client.post(f"/api/site/{self.site.id}/scan/{scan.id}/send_finished_email/")

        mock_send_mail.assert_not_called()

    @mock.patch("crawl.views.scan.send_mail")
    def test_multiple_scans_including_per_site_duplicates(self, mock_send_mail):
        other_site = models.Site.objects.create(user=self.superuser, url="other.com")
        # older existing sent scans
        models.Scan.objects.create(
            site=other_site, finished_at=datetime.datetime.now() - datetime.timedelta(hours=1), email_sent=True
        )
        models.Scan.objects.create(
            site=self.site, finished_at=datetime.datetime.now() - datetime.timedelta(hours=1), email_sent=True
        )
        # other site finished duplicate scan
        models.Scan.objects.create(site=other_site, finished_at=datetime.datetime.now())
        models.Scan.objects.create(site=other_site, finished_at=datetime.datetime.now() - datetime.timedelta(hours=1))
        # current scan
        scan = models.Scan.objects.create(site=self.site, finished_at=datetime.datetime.now())

        self.client.post(f"/api/site/{self.site.id}/scan/{scan.id}/send_finished_email/")

        mock_send_mail.assert_called_once_with(
            "SiteCrawlerTest - Crawl of your site(s) finished",
            """Hello John,

We've recrawled your site(s) and here's what we found:
- test.com: 0 issues
- other.com: 0 issues

Visit your dashboard to learn more:
https://example.com/dashboard/sites

Thanks,
example.com
""",
            "from@test.com",
            ["superuser@test.com"],
        )
