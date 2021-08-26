from django.conf import settings
from django.contrib.auth.models import Group
from rest_framework.views import APIView
from rest_framework.response import Response
import stripe

from ..models import Subscription, StripeCustomer


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
            stripe_subscription_id = event.get("data", {}).get("object", {}).get("subscription")
            if not stripe_subscription_id:
                return Response()
            try:
                subscription = Subscription.objects.get(stripe_id=stripe_subscription_id)
            except Subscription.DoesNotExist:
                return Response()
            self._activate_subscription(subscription)
            subscription.status = Subscription.STATUS_PAID
            subscription.save()
        elif event["type"] == "payment_intent.payment_failed":
            customer = event.get("data", {}).get("object", {}).get("customer")
            if not customer:
                return Response()
            try:
                subscription = Subscription.objects.get(team__stripe_customer__customer_id=customer)
            except Subscription.DoesNotExist:
                return Response()
            self._cancel_subscription(subscription)
            subscription.status = Subscription.STATUS_PAYMENT_FAILED
            subscription.save()
        elif event["type"] == "customer.subscription.deleted":
            stripe_subscription_id = event.get("data", {}).get("object", {}).get("id")
            if stripe_subscription_id:
                try:
                    subscription = Subscription.objects.get(stripe_id=stripe_subscription_id)
                    self._cancel_subscription(subscription)
                    subscription.delete()
                    return Response()
                except Subscription.DoesNotExist:
                    pass
            customer_id = event.get("data", {}).get("object", {}).get("customer")
            if not customer_id:
                return Response()
            try:
                customer = StripeCustomer.objects.get(customer_id=customer_id)
            except StripeCustomer.DoesNotExist:
                return Response()
            self._cancel_subscription(customer.team.subscription)
        elif event["type"] == "customer.subscription.updated":
            stripe_subscription_id = event.get("data", {}).get("object", {}).get("id")
            if not stripe_subscription_id:
                return Response()
            try:
                subscription = Subscription.objects.get(stripe_id=stripe_subscription_id)
            except Subscription.DoesNotExist:
                return Response()
            if event.get("data", {}).get("object", {}).get("cancel_at"):
                subscription.set_cancel_at_timestamp(event.get("data", {}).get("object", {}).get("cancel_at"))
                subscription.save()
            elif event.get("data", {}).get("object", {}).get("canceled_at"):
                self._cancel_subscription(subscription)
                subscription.delete()
            elif subscription.status == Subscription.STATUS_PAID:
                subscription.cancel_at = None
                subscription.save()
                self._activate_subscription(subscription)

        return Response()

    def _activate_subscription(self, subscription):
        subscription.user.groups.clear()
        subscription.user.groups.add(subscription.subscription_type.group)

        subscription.team.plan_id = subscription.plan_id
        subscription.team.save()

    def _cancel_subscription(self, subscription):
        subscription.user.groups.clear()
        subscription.user.groups.add(Group.objects.get(pk=settings.DEFAULT_USER_GROUP))

        subscription.team.plan_id = Plan.BASIC
        subscription.team.save()
