"""
Billing Module
Stripe checkout, webhooks, subscription tiers, and usage tracking.

Requires environment variables:
  STRIPE_SECRET_KEY        - Stripe secret API key
  STRIPE_WEBHOOK_SECRET    - Stripe webhook signing secret
  STRIPE_PRICE_PRO         - Price ID for the Pro tier
  STRIPE_PRICE_ULTRA       - Price ID for the Ultra tier
  APP_URL                  - Public frontend URL for checkout redirects
"""

import os
import json
import logging
from typing import Optional, Dict, Any

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Subscription tiers and their entitlements
TIERS: Dict[str, Dict[str, Any]] = {
    "free": {
        "name": "Free",
        "monthly_token_limit": 100_000,
        "features": ["chat", "basic_memory"],
    },
    "pro": {
        "name": "Pro",
        "monthly_token_limit": 5_000_000,
        "features": ["chat", "memory", "missions", "priority_models"],
    },
    "ultra": {
        "name": "Ultra",
        "monthly_token_limit": 50_000_000,
        "features": ["chat", "memory", "missions", "all_models", "api_access"],
    },
}


def _stripe():
    """Return a configured Stripe client, or None when not configured."""
    secret = os.getenv("STRIPE_SECRET_KEY")
    if not secret:
        return None
    try:
        import stripe
    except ImportError:
        logger.error("stripe package not installed; run pip install stripe")
        return None
    stripe.api_key = secret
    return stripe


def is_configured() -> bool:
    return bool(os.getenv("STRIPE_SECRET_KEY"))


def price_id_for_tier(tier: str) -> Optional[str]:
    mapping = {
        "pro": os.getenv("STRIPE_PRICE_PRO"),
        "ultra": os.getenv("STRIPE_PRICE_ULTRA"),
    }
    return mapping.get(tier)


async def create_checkout_session(
    user: Dict[str, Any], tier: str, success_url: str, cancel_url: str
) -> Dict[str, Any]:
    """Create a Stripe Checkout Session for a subscription tier."""
    stripe = _stripe()
    if not stripe:
        raise RuntimeError("Stripe is not configured")

    if tier not in ("pro", "ultra"):
        raise ValueError(f"Invalid tier: {tier}")

    price_id = price_id_for_tier(tier)
    if not price_id:
        raise RuntimeError(f"No Stripe price configured for tier: {tier}")

    customer_id = user.get("stripe_customer_id")
    if not customer_id:
        customer = stripe.Customer.create(
            email=user["email"],
            name=user.get("full_name") or "",
            metadata={"user_id": str(user["id"])},
        )
        customer_id = customer.id
        # Persist the customer id; caller is responsible for the DB write path.
        try:
            from .database import db
            await db.execute(
                "UPDATE users SET stripe_customer_id = $1 WHERE id = $2",
                customer_id, user["id"],
            )
        except Exception as e:
            logger.warning(f"Could not persist stripe_customer_id: {e}")

    session = stripe.checkout.Session.create(
        customer=customer_id,
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"user_id": str(user["id"]), "tier": tier},
        subscription_data={"metadata": {"user_id": str(user["id"]), "tier": tier}},
    )
    return {"checkout_url": session.url, "session_id": session.id}


async def handle_webhook(payload: bytes, signature: str) -> Dict[str, Any]:
    """Verify and process a Stripe webhook event."""
    stripe = _stripe()
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    if not stripe or not webhook_secret:
        raise RuntimeError("Stripe webhook is not configured")

    event = stripe.Webhook.construct_event(payload, signature, webhook_secret)
    event_type = event["type"]
    data = event["data"]["object"]

    from .database import db

    if event_type == "checkout.session.completed":
        user_id = (data.get("metadata") or {}).get("user_id")
        tier = (data.get("metadata") or {}).get("tier", "pro")
        customer_id = data.get("customer")
        subscription_id = data.get("subscription")
        if user_id:
            await db.execute(
                """UPDATE users
                   SET subscription_tier = $1, stripe_customer_id = $2,
                       stripe_subscription_id = $3
                   WHERE id = $4""",
                tier, customer_id, subscription_id, user_id,
            )
        logger.info(f"Checkout completed: user={user_id} tier={tier}")

    elif event_type in ("customer.subscription.updated", "customer.subscription.deleted"):
        subscription_id = data.get("id")
        status = data.get("status")
        tier = "free"
        if status == "active" or status == "trialing":
            price_id = (data.get("items", {}).get("data") or [{}])[0].get("price", {}).get("id")
            if price_id == price_id_for_tier("ultra"):
                tier = "ultra"
            elif price_id == price_id_for_tier("pro"):
                tier = "pro"
            elif status == "canceled":
                tier = "free"
        if subscription_id:
            await db.execute(
                "UPDATE users SET subscription_tier = $1 WHERE stripe_subscription_id = $2",
                tier, subscription_id,
            )
        logger.info(f"Subscription {event_type}: sub={subscription_id} tier={tier}")

    return {"received": True, "type": event_type}


async def get_usage_summary(user_id: str, db) -> Dict[str, Any]:
    """Aggregate token usage for the current billing period (30 days)."""
    rows = await db.fetch(
        """SELECT event_type, model, SUM(tokens_used) AS tokens, COUNT(*) AS events
           FROM usage_events
           WHERE user_id = $1 AND created_at > NOW() - INTERVAL '30 days'
           GROUP BY event_type, model""",
        user_id,
    )
    total = sum(r["tokens"] or 0 for r in rows)
    return {
        "period_days": 30,
        "total_tokens": total,
        "by_model": [
            {"model": r["model"], "tokens": r["tokens"], "events": r["events"]}
            for r in rows
        ],
    }
