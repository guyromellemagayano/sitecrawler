from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import APIException, PermissionDenied
from rest_framework.response import Response
import stripe

from common import HasPermission
from ..serializers import PaymentMethodSerializer
from ..services import customer


class CardError(APIException):
    status_code = 400
    default_detail = "Something went wrong."
    default_code = "card_error"


class PaymentMethodViewSet(viewsets.ViewSet):
    permission_classes = [HasPermission("payments.can_manage_subscription")]

    def list(self, request):
        customer_id = customer.get_id(request)
        if not customer_id:
            return Response([])

        return Response(stripe.PaymentMethod.list(customer=customer_id, type="card")["data"])

    def create(self, request):
        customer_id = customer.get_or_create_id(request)

        serializer = PaymentMethodSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        id = serializer.data["id"]

        try:
            resp = stripe.PaymentMethod.attach(id, customer=customer_id)
            stripe.Customer.modify(
                customer_id,
                invoice_settings={"default_payment_method": id},
            )
        except stripe.error.CardError as e:
            raise CardError(code=e.code, detail=e._message)

        return Response(resp)

    def destroy(self, request, pk):
        customer_id = customer.get_id(request)
        if not customer_id:
            raise PermissionDenied

        ids = [pm["id"] for pm in stripe.PaymentMethod.list(customer=customer_id, type="card")["data"]]
        if pk not in ids:
            raise PermissionDenied

        return Response(stripe.PaymentMethod.detach(pk))

    @action(detail=False)
    def default(self, request):
        customer_id = customer.get_id(request)
        if not customer_id:
            return Response({"id": None})

        id = stripe.Customer.retrieve(customer_id)["invoice_settings"]["default_payment_method"]
        return Response({"id": id})
