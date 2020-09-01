from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework import status
import stripe

from ..models import Subscription, UserSubscription
from ..serializers import SubscriptionSerializer
from ..services import customer


class SubscriptionCurrentView(APIView):
    def get(self, request):
        if not hasattr(request.user, "user_subscription"):
            return Response({"id": None})
        subscription = request.user.user_subscription.subscription
        serializer = SubscriptionSerializer(subscription)
        return Response(serializer.data)

    def delete(self, request):
        if not hasattr(request.user, "user_subscription"):
            return NotFound

        stripe.Subscription.delete(request.user.user_subscription.stripe_id)

        request.user.user_subscription.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request, format=None):
        serializer = SubscriptionSerializer(data=request.data)
        if serializer.is_valid():
            subscription = Subscription.objects.get(pk=serializer.data["id"])

            if not hasattr(request.user, "user_subscription"):
                stripe_subscription = stripe.Subscription.create(
                    customer=customer.get_or_create_id(request), items=[{"price": subscription.price_id}]
                )
                UserSubscription.objects.create(
                    user=request.user, subscription_id=subscription.id, stripe_id=stripe_subscription.id
                )
            else:
                stripe_subscription = stripe.Subscription.retrieve(request.user.user_subscription.stripe_id)
                stripe.Subscription.modify(
                    request.user.user_subscription.stripe_id,
                    cancel_at_period_end=False,
                    items=[{"id": stripe_subscription["items"]["data"][0].id, "price": subscription.price_id}],
                )
                request.user.user_subscription.subscription_id = subscription.id
                request.user.user_subscription.save()

            serializer = SubscriptionSerializer(subscription)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
