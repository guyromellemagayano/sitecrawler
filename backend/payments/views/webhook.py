from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
import stripe


class WebhookView(APIView):
    permission_classes = []

    def post(self, request, format=None):
        if settings.STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(
                request.body, sig_header=request.headers.get("stripe-signature"), secret=settings.STRIPE_WEBHOOK_SECRET
            )
        else:
            event = request.data
        print(event["type"], event)

        return Response()
