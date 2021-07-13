from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from allauth.account.models import EmailAddress


class Command(BaseCommand):
    help = "Deletes cypress users and recreates them"

    def handle(self, *args, **options):
        User.objects.filter(username__contains="cypress").delete()

        user = User.objects.create_user("cypress", "cypress@example.com", "cypress123")
        EmailAddress.objects.create(user=user, email="cypress@example.com", primary=True, verified=True)
