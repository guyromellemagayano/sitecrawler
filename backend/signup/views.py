import uuid

from allauth.account.adapter import DefaultAccountAdapter
from allauth.account.models import EmailAddress
from django.contrib import auth
from django.contrib.sites import models
from django.core.mail import send_mail
from django.db import IntegrityError
from django.template.loader import render_to_string
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.response import Response

from crawl.models import Site
from .serializers import SignupSerializer, ConfirmSerializer
from .models import Signup


class SignupViewSet(
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Signup.objects.all()
    serializer_class = SignupSerializer
    permission_classes = []

    def perform_create(self, serializer):
        signup = serializer.save(token=uuid.uuid4())

        site = models.Site.objects.get_current()
        context = {"signup": signup, "site": site}

        subject = render_to_string("signup_email_subject.txt", context).strip()
        message = render_to_string("signup_email_message.txt", context)
        send_mail(subject, message, None, [signup.email])

    @action(detail=True, methods=["post"], serializer_class=ConfirmSerializer)
    def confirm(self, request, pk=None):
        token = pk

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # get and delete signup object
        try:
            signup = Signup.objects.get(token=pk)
            signup.delete()
        except Signup.DoesNotExist:
            raise NotFound(detail="Signup with this token does not exist.")

        # create user
        adapter = DefaultAccountAdapter()
        user = adapter.new_user(request)
        user.first_name = signup.first_name
        user.last_name = signup.last_name
        user.username = signup.username
        user.email = signup.email
        user.set_password(serializer.data["password"])
        adapter.populate_username(request, user)
        user.save()

        # add user email and set it to confirmed
        try:
            EmailAddress.objects.create(
                user=user,
                email=signup.email,
                verified=True,
                primary=True,
            )
        except IntegrityError:
            user.delete()
            raise ValidationError(detail="User with this email already exists.")

        # create site
        # TODO: remove setting user
        Site.objects.create(
            team=user.membership_set.first().team,
            user=user,
            name=signup.url,
            url=signup.url,
            verification_id=uuid.uuid4(),
        )

        # login user
        auth.login(request, user, backend="allauth.account.auth_backends.AuthenticationBackend")

        return Response()
