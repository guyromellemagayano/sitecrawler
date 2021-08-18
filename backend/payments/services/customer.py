import stripe

from ..models import StripeCustomer

from teams.service import get_current_team


def get_id(request):
    team = get_current_team(request)
    if not hasattr(team, "stripe_customer"):
        return None
    customer_id = team.stripe_customer.customer_id
    try:
        c = stripe.Customer.retrieve(customer_id)
        if hasattr(c, "deleted") and c.deleted:
            team.stripe_customer.delete()
            return None
        return customer_id
    except stripe.error.StripeError as e:
        if e.code == "resource_missing":
            team.stripe_customer.delete()
            return None
        raise


def get_or_create_id(request):
    id = get_id(request)
    if id is not None:
        return id

    team = get_current_team(request)

    customer = stripe.Customer.create(
        email=request.user.email,
        name=str(team),
        description=f"team: {team}, user: {request.user}",
    )
    StripeCustomer.objects.create(team=team, customer_id=customer["id"])

    return customer["id"]
