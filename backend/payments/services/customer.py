import stripe

from ..models import StripeCustomer


def get_id(request):
    if not hasattr(request.user, "stripe_customer"):
        return None
    return request.user.stripe_customer.customer_id


def get_or_create_id(request):
    id = get_id(request)
    if id is not None:
        return id

    customer = stripe.Customer.create(
        email=request.user.email, name=request.user.get_full_name(), description=request.user.get_username()
    )
    StripeCustomer.objects.create(user=request.user, customer_id=customer["id"])

    return customer["id"]
