import boto3
from django.conf import settings

from crawl.models.scan import Scan


def site(site):
    scans_in_progress = Scan.objects.filter(site=site, finished_at=None).count()
    if scans_in_progress > 0:
        return

    scan = Scan.objects.create(site=site)

    sqs = boto3.client(
        "sqs",
        endpoint_url=settings.AWS_ENDPOINT_URL,
        use_ssl=settings.AWS_USE_SSL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
    )
    queue_url = sqs.get_queue_url(QueueName=settings.AWS_SCAN_QUEUE_NAME)["QueueUrl"]
    sqs.send_message(
        QueueUrl=queue_url, MessageBody=str(scan.id),
    )
