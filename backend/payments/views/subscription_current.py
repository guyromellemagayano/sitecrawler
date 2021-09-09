from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import stripe

from ..models import SubscriptionType, Subscription
from ..serializers import SubscriptionSerializer
from ..services import customer
from teams.models import Plan
from teams.service import get_current_team


class SubscriptionCurrentView(APIView):
    def get(self, request):
        team = get_current_team(request)
        if not hasattr(team, "subscription"):
            return Response(self._none())
        subscription = team.subscription
        serializer = SubscriptionSerializer(subscription)
        return Response(serializer.data)

    def _none(self):
        return SubscriptionSerializer(None).data

    def delete(self, request):
        team = get_current_team(request)
        if not hasattr(team, "subscription"):
            return Response(self._none())

        subscription = team.subscription

        stripe_subscription = stripe.Subscription.modify(
            subscription.stripe_id,
            cancel_at_period_end=True,
        )

        subscription.set_cancel_at_timestamp(stripe_subscription.cancel_at)
        subscription.save()

        serializer = SubscriptionSerializer(subscription)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = SubscriptionSerializer(data=request.data)
        if serializer.is_valid():
            subscription_type = SubscriptionType.objects.get(pk=serializer.data["id"])
            if subscription_type.plan_id == Plan.BASIC:
                return self.delete(request)

            team = get_current_team(request)
            if not hasattr(team, "subscription"):
                stripe_subscription = stripe.Subscription.create(
                    customer=customer.get_or_create_id(request), items=[{"price": subscription_type.price_id}]
                )
                # TODO: remove setting user
                subscription = Subscription.objects.create(
                    user=request.user,
                    team=team,
                    subscription_type_id=subscription_type.id,
                    stripe_id=stripe_subscription.id,
                )
            else:
                stripe_subscription = stripe.Subscription.retrieve(team.subscription.stripe_id)
                stripe.Subscription.modify(
                    team.subscription.stripe_id,
                    cancel_at_period_end=False,
                    proration_behavior="always_invoice",
                    items=[{"id": stripe_subscription["items"]["data"][0].id, "price": subscription_type.price_id}],
                )
                subscription = team.subscription
                subscription.subscription_type_id = subscription_type.id
                subscription.cancel_at = None
                subscription.save()

            serializer = SubscriptionSerializer(subscription)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
