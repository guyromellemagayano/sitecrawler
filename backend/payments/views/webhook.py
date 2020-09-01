from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
import stripe

from ..models import UserSubscription


class WebhookView(APIView):
    permission_classes = []

    def post(self, request, format=None):
        if settings.STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(
                request.body, sig_header=request.headers.get("stripe-signature"), secret=settings.STRIPE_WEBHOOK_SECRET
            )
        else:
            event = request.data

        if event["type"] == "invoice.paid":
            subscription = event.get("data", {}).get("object", {}).get("subscription")
            if not subscription:
                return Response()
            try:
                user_subscription = UserSubscription.objects.get(stripe_id=subscription)
            except UserSubscription.DoesNotExist:
                return Response()
            self._activate_subscription(user_subscription)
            user_subscription.status = UserSubscription.STATUS_PAID
            user_subscription.save()
        elif event["type"] == "payment_intent.payment_failed":
            customer = event.get("data", {}).get("object", {}).get("customer")
            if not customer:
                return Response()
            try:
                user_subscription = UserSubscription.objects.get(user__stripe_customer__customer_id=customer)
            except UserSubscription.DoesNotExist:
                return Response()
            self._cancel_subscription(user_subscription)
            user_subscription.status = UserSubscription.STATUS_PAYMENT_FAILED
            user_subscription.save()
        elif event["type"] == "customer.subscription.deleted":
            subscription = event.get("data", {}).get("object", {}).get("id")
            if not subscription:
                return Response()
            try:
                user_subscription = UserSubscription.objects.get(stripe_id=subscription)
            except UserSubscription.DoesNotExist:
                return Response()
            self._cancel_subscription(user_subscription)
            user_subscription.delete()
        elif event["type"] == "customer.subscription.updated":
            subscription = event.get("data", {}).get("object", {}).get("id")
            if not subscription:
                return Response()
            try:
                user_subscription = UserSubscription.objects.get(stripe_id=subscription)
            except UserSubscription.DoesNotExist:
                return Response()
            if event.get("data", {}).get("object", {}).get("canceled_at"):
                self._cancel_subscription(user_subscription)
                user_subscription.delete()
            elif user_subscription.status == UserSubscription.STATUS_PAID:
                self._activate_subscription(user_subscription)

        return Response()

    def _activate_subscription(self, user_subscription):
        print(f"Activating {user_subscription.subscription_id}")

    def _cancel_subscription(self, user_subscription):
        print(f"Canceling {user_subscription.subscription_id}")
