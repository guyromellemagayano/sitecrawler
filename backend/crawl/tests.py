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
        self.site = models.Site.objects.create(
            user=self.superuser,
            team=self.superuser.membership_set.first().team,
            url="test.com",
        )

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
https://example.com/dashboard/site/{self.site.id}

Thanks,
example.com
""",
            "from@test.com",
            ["superuser@test.com"],
        )
