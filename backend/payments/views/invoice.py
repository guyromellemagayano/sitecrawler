from rest_framework import viewsets
from rest_framework.response import Response
import stripe

from common import HasPermission
from ..services import customer


class InvoiceViewSet(viewsets.ViewSet):
    permission_classes = [HasPermission("payments.can_manage_subscription")]

    def list(self, request):
        customer_id = customer.get_id(request)
        if not customer_id:
            return Response([])

        invoices = []
        try:
            invoices.append(stripe.Invoice.upcoming(customer=customer_id))
        except stripe.error.InvalidRequestError as e:
            if "No upcoming invoices for customer" not in str(e):
                raise
        invoices.extend(stripe.Invoice.list(customer=customer_id)["data"])
        return Response(invoices)
