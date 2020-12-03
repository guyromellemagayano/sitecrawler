import stripe

from ..models import StripeCustomer


def get_id(request):
    if not hasattr(request.user, "stripe_customer"):
        return None
    customer_id = request.user.stripe_customer.customer_id
    try:
        c = stripe.Customer.retrieve(customer_id)
        if c.deleted:
            request.user.stripe_customer.delete()
            return None
        return customer_id
    except stripe.error.StripeError as e:
        if e.code == "resource_missing":
            request.user.stripe_customer.delete()
            return None
        raise


def get_or_create_id(request):
    id = get_id(request)
    if id is not None:
        return id

    customer = stripe.Customer.create(
        email=request.user.email, name=request.user.get_full_name(), description=request.user.get_username()
    )
    StripeCustomer.objects.create(user=request.user, customer_id=customer["id"])

    return customer["id"]
