from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import stripe

from ..models import Subscription, UserSubscription
from ..serializers import UserSubscriptionSerializer
from ..services import customer
from teams.service import get_current_team


class SubscriptionCurrentView(APIView):
    def get(self, request):
        if not hasattr(request.user, "user_subscription"):
            return Response(self._none())
        user_subscription = request.user.user_subscription
        serializer = UserSubscriptionSerializer(user_subscription)
        return Response(serializer.data)

    def _none(self):
        return UserSubscriptionSerializer(None).data

    def delete(self, request):
        if not hasattr(request.user, "user_subscription"):
            return Response(self._none())

        user_subscription = request.user.user_subscription

        stripe_subscription = stripe.Subscription.modify(
            user_subscription.stripe_id,
            cancel_at_period_end=True,
        )

        user_subscription.set_cancel_at_timestamp(stripe_subscription.cancel_at)
        user_subscription.save()

        serializer = UserSubscriptionSerializer(user_subscription)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = UserSubscriptionSerializer(data=request.data)
        if serializer.is_valid():
            subscription = Subscription.objects.get(pk=serializer.data["id"])
            if subscription.group_id == settings.DEFAULT_USER_GROUP:
                return self.delete(request)

            if not hasattr(request.user, "user_subscription"):
                stripe_subscription = stripe.Subscription.create(
                    customer=customer.get_or_create_id(request), items=[{"price": subscription.price_id}]
                )
                user_subscription = UserSubscription.objects.create(
                    user=request.user,
                    team=get_current_team(request),
                    subscription_id=subscription.id,
                    stripe_id=stripe_subscription.id,
                )
            else:
                stripe_subscription = stripe.Subscription.retrieve(request.user.user_subscription.stripe_id)
                stripe.Subscription.modify(
                    request.user.user_subscription.stripe_id,
                    cancel_at_period_end=False,
                    proration_behavior="always_invoice",
                    items=[{"id": stripe_subscription["items"]["data"][0].id, "price": subscription.price_id}],
                )
                user_subscription = request.user.user_subscription
                user_subscription.subscription_id = subscription.id
                user_subscription.cancel_at = None
                user_subscription.save()

            serializer = UserSubscriptionSerializer(user_subscription)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
