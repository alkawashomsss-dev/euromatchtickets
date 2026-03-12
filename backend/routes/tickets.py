from fastapi import APIRouter, HTTPException, Request
from typing import Optional
from datetime import datetime, timezone
import logging
import os
import stripe

from database.db import db
from models.schemas import Ticket, TicketCreate, Order, PaymentTransaction, SellerPayout, PriceAlert, PriceAlertCreate
from utils.helpers import require_auth, require_seller, generate_qr_code
from config.settings import STRIPE_API_KEY, PLATFORM_COMMISSION

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")

stripe.api_key = STRIPE_API_KEY

# Email service
try:
    from email_service import send_order_confirmation, send_seller_notification, send_price_drop_alert
except ImportError:
    async def send_order_confirmation(*a, **k): pass
    async def send_seller_notification(*a, **k): pass
    async def send_price_drop_alert(*a, **k): pass


@router.get("/tickets")
async def get_tickets(event_id: Optional[str] = None, category: Optional[str] = None, seller_id: Optional[str] = None, status: str = "available"):
    query = {"status": status}
    if event_id:
        query["event_id"] = event_id
    if category:
        query["category"] = category
    if seller_id:
        query["seller_id"] = seller_id
    return await db.tickets.find(query, {"_id": 0}).to_list(500)


@router.post("/tickets")
async def create_ticket(ticket_data: TicketCreate, request: Request):
    user = await require_seller(request)
    event = await db.events.find_one({"event_id": ticket_data.event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    ticket = Ticket(**ticket_data.model_dump(), seller_id=user.user_id, seller_name=user.name)
    ticket_doc = ticket.model_dump()
    ticket_doc['created_at'] = ticket_doc['created_at'].isoformat()
    await db.tickets.insert_one(ticket_doc)
    return {"success": True, "ticket_id": ticket.ticket_id}


@router.get("/seller/tickets")
async def get_seller_tickets(request: Request):
    user = await require_seller(request)
    tickets = await db.tickets.find({"seller_id": user.user_id}, {"_id": 0}).to_list(500)
    if tickets:
        event_ids = list(set(t["event_id"] for t in tickets))
        events = await db.events.find({"event_id": {"$in": event_ids}}, {"_id": 0}).to_list(None)
        events_map = {e["event_id"]: e for e in events}
        for ticket in tickets:
            ticket["event"] = events_map.get(ticket["event_id"])
    return tickets


@router.delete("/tickets/{ticket_id}")
async def delete_ticket(ticket_id: str, request: Request):
    user = await require_seller(request)
    ticket = await db.tickets.find_one({"ticket_id": ticket_id}, {"_id": 0})
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if ticket["seller_id"] != user.user_id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    if ticket["status"] != "available":
        raise HTTPException(status_code=400, detail="Cannot delete sold ticket")
    await db.tickets.delete_one({"ticket_id": ticket_id})
    return {"success": True}


# Price Alerts
@router.post("/price-alerts")
async def create_price_alert(alert_data: PriceAlertCreate, request: Request):
    user = await require_auth(request)
    event = await db.events.find_one({"event_id": alert_data.event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    lowest_ticket = await db.tickets.find_one(
        {"event_id": alert_data.event_id, "status": "available"}, {"_id": 0, "price": 1}, sort=[("price", 1)]
    )
    current_lowest = lowest_ticket["price"] if lowest_ticket else None
    existing = await db.price_alerts.find_one({"user_id": user.user_id, "event_id": alert_data.event_id, "status": "active"}, {"_id": 0})
    if existing:
        await db.price_alerts.update_one({"alert_id": existing["alert_id"]}, {"$set": {"target_price": alert_data.target_price, "current_lowest": current_lowest}})
        return {"success": True, "alert_id": existing["alert_id"], "updated": True}
    alert = PriceAlert(user_id=user.user_id, user_email=user.email, event_id=alert_data.event_id, target_price=alert_data.target_price, current_lowest=current_lowest)
    alert_doc = alert.model_dump()
    alert_doc['created_at'] = alert_doc['created_at'].isoformat()
    await db.price_alerts.insert_one(alert_doc)
    return {"success": True, "alert_id": alert.alert_id}


@router.get("/price-alerts")
async def get_my_alerts(request: Request):
    user = await require_auth(request)
    alerts = await db.price_alerts.find({"user_id": user.user_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    if alerts:
        event_ids = list(set(a["event_id"] for a in alerts))
        events = await db.events.find({"event_id": {"$in": event_ids}}, {"_id": 0}).to_list(None)
        events_map = {e["event_id"]: e for e in events}
        pipeline = [
            {"$match": {"event_id": {"$in": event_ids}, "status": "available"}},
            {"$group": {"_id": "$event_id", "lowest_price": {"$min": "$price"}}}
        ]
        lowest_prices = await db.tickets.aggregate(pipeline).to_list(None)
        prices_map = {p["_id"]: p["lowest_price"] for p in lowest_prices}
        for alert in alerts:
            alert["event"] = events_map.get(alert["event_id"])
            alert["current_lowest"] = prices_map.get(alert["event_id"])
    return alerts


@router.delete("/price-alerts/{alert_id}")
async def delete_price_alert(alert_id: str, request: Request):
    user = await require_auth(request)
    alert = await db.price_alerts.find_one({"alert_id": alert_id}, {"_id": 0})
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    if alert["user_id"] != user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    await db.price_alerts.delete_one({"alert_id": alert_id})
    return {"success": True}


# Checkout & Payments
@router.post("/checkout/create")
async def create_checkout(request: Request):
    user = await require_auth(request)
    body = await request.json()
    ticket_id = body.get("ticket_id")
    origin_url = body.get("origin_url")
    if not ticket_id or not origin_url:
        raise HTTPException(status_code=400, detail="ticket_id and origin_url required")

    ticket = await db.tickets.find_one({"ticket_id": ticket_id, "status": "available"}, {"_id": 0})
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not available")
    event = await db.events.find_one({"event_id": ticket["event_id"]}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    ticket_price = float(ticket["price"])
    commission = round(ticket_price * PLATFORM_COMMISSION, 2)
    total_amount = round(ticket_price + commission, 2)

    order = Order(
        buyer_id=user.user_id, buyer_email=user.email, ticket_id=ticket_id,
        event_id=ticket["event_id"], seller_id=ticket["seller_id"],
        ticket_price=ticket_price, commission=commission,
        total_amount=total_amount, currency=ticket["currency"]
    )
    order_doc = order.model_dump()
    order_doc['created_at'] = order_doc['created_at'].isoformat()

    await db.tickets.update_one({"ticket_id": ticket_id}, {"$set": {"status": "reserved"}})

    checkout_session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': ticket["currency"].lower(),
                'unit_amount': int(total_amount * 100),
                'product_data': {
                    'name': f"EuroMatchTickets - {event['title']}",
                    'description': f"{ticket.get('category', 'Standard')} - {ticket.get('section', 'General')} | Secure Purchase",
                    'images': [event.get('event_image', 'https://euromatchtickets.com/logo.png')],
                },
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=f"{origin_url}/order/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{origin_url}/event/{ticket['event_id']}",
        payment_intent_data={'description': f"EuroMatchTickets - {event['title']}", 'statement_descriptor': 'EUROMATCH', 'statement_descriptor_suffix': 'TICKETS'},
        customer_email=user.email,
        metadata={"order_id": order.order_id, "ticket_id": ticket_id, "buyer_id": user.user_id, "event": event['title'], "vendor": "EuroMatchTickets"},
        custom_text={"submit": {"message": "EuroMatchTickets - 100% Secure Purchase | Instant QR Delivery"}}
    )

    order_doc["stripe_session_id"] = checkout_session.id
    await db.orders.insert_one(order_doc)

    txn = PaymentTransaction(order_id=order.order_id, session_id=checkout_session.id, amount=total_amount, currency=ticket["currency"], status="initiated", metadata={"order_id": order.order_id, "ticket_id": ticket_id, "buyer_id": user.user_id, "event": event['title']})
    txn_doc = txn.model_dump()
    txn_doc['created_at'] = txn_doc['created_at'].isoformat()
    await db.payment_transactions.insert_one(txn_doc)

    return {"url": checkout_session.url, "session_id": checkout_session.id, "order_id": order.order_id}


@router.get("/checkout/status/{session_id}")
async def get_checkout_status(session_id: str, request: Request):
    session = stripe.checkout.Session.retrieve(session_id)
    payment_status = session.payment_status
    order = await db.orders.find_one({"stripe_session_id": session_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    await db.payment_transactions.update_one({"session_id": session_id}, {"$set": {"status": payment_status}})

    if payment_status == "paid" and order["status"] != "completed":
        qr_data = f"FANPASS-{order['order_id']}-{order['ticket_id']}"
        qr_code = generate_qr_code(qr_data)
        await db.orders.update_one({"order_id": order["order_id"]}, {"$set": {"status": "completed", "qr_code": qr_code}})
        await db.tickets.update_one({"ticket_id": order["ticket_id"]}, {"$set": {"status": "sold"}})
        await db.users.update_one({"user_id": order["seller_id"]}, {"$inc": {"total_sales": 1}})
        order["status"] = "completed"
        order["qr_code"] = qr_code

        event = await db.events.find_one({"event_id": order["event_id"]}, {"_id": 0})
        ticket = await db.tickets.find_one({"ticket_id": order["ticket_id"]}, {"_id": 0})

        payout = SellerPayout(seller_id=order["seller_id"], order_id=order["order_id"], ticket_id=order["ticket_id"], gross_amount=order["total_amount"], commission=order["commission"], net_amount=order["ticket_price"])
        payout_doc = payout.model_dump()
        payout_doc['created_at'] = payout_doc['created_at'].isoformat()
        await db.seller_payouts.insert_one(payout_doc)

        try:
            await send_order_confirmation(order, event, ticket, order["buyer_email"])
        except Exception as e:
            logger.error(f"Failed to send buyer email: {e}")
        try:
            seller = await db.users.find_one({"user_id": order["seller_id"]}, {"_id": 0})
            if seller:
                await send_seller_notification(order, event, ticket, seller["email"])
        except Exception as e:
            logger.error(f"Failed to send seller email: {e}")

    return {"payment_status": payment_status, "status": session.status, "order": order}


@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("Stripe-Signature")
    endpoint_secret = os.environ.get('STRIPE_WEBHOOK_SECRET', '')
    try:
        if endpoint_secret:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        else:
            data = await request.json()
            event = stripe.Event.construct_from(data, stripe.api_key)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            if session.get('payment_status') == "paid":
                order = await db.orders.find_one({"stripe_session_id": session['id']}, {"_id": 0})
                if order and order["status"] != "completed":
                    qr_code = generate_qr_code(f"FANPASS-{order['order_id']}-{order['ticket_id']}")
                    await db.orders.update_one({"order_id": order["order_id"]}, {"$set": {"status": "completed", "qr_code": qr_code}})
                    await db.tickets.update_one({"ticket_id": order["ticket_id"]}, {"$set": {"status": "sold"}})
                    await db.users.update_one({"user_id": order["seller_id"]}, {"$inc": {"total_sales": 1}})
        return {"received": True}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"received": True}


# Orders
@router.get("/orders")
async def get_orders(request: Request):
    user = await require_auth(request)
    orders = await db.orders.find({"buyer_id": user.user_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    if orders:
        event_ids = list(set(o["event_id"] for o in orders))
        ticket_ids = list(set(o["ticket_id"] for o in orders))
        events = await db.events.find({"event_id": {"$in": event_ids}}, {"_id": 0}).to_list(None)
        tickets = await db.tickets.find({"ticket_id": {"$in": ticket_ids}}, {"_id": 0}).to_list(None)
        events_map = {e["event_id"]: e for e in events}
        tickets_map = {t["ticket_id"]: t for t in tickets}
        for order in orders:
            order["event"] = events_map.get(order["event_id"])
            order["ticket"] = tickets_map.get(order["ticket_id"])
    return orders


@router.get("/orders/{order_id}")
async def get_order(order_id: str, request: Request):
    user = await require_auth(request)
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["buyer_id"] != user.user_id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    order["event"] = await db.events.find_one({"event_id": order["event_id"]}, {"_id": 0})
    order["ticket"] = await db.tickets.find_one({"ticket_id": order["ticket_id"]}, {"_id": 0})
    return order


# Seller
@router.get("/seller/payouts")
async def get_seller_payouts(request: Request):
    user = await require_seller(request)
    payouts = await db.seller_payouts.find({"seller_id": user.user_id}, {"_id": 0}).sort("created_at", -1).to_list(500)
    total_gross = sum(p.get("gross_amount", 0) for p in payouts)
    total_commission = sum(p.get("commission", 0) for p in payouts)
    total_net = sum(p.get("net_amount", 0) for p in payouts)
    pending_amount = sum(p.get("net_amount", 0) for p in payouts if p.get("status") == "pending")
    completed_amount = sum(p.get("net_amount", 0) for p in payouts if p.get("status") == "completed")
    if payouts:
        order_ids = list(set(p["order_id"] for p in payouts))
        orders = await db.orders.find({"order_id": {"$in": order_ids}}, {"_id": 0}).to_list(None)
        orders_map = {o["order_id"]: o for o in orders}
        event_ids = list(set(o.get("event_id") for o in orders if o.get("event_id")))
        events = await db.events.find({"event_id": {"$in": event_ids}}, {"_id": 0}).to_list(None)
        events_map = {e["event_id"]: e for e in events}
        for payout in payouts:
            order = orders_map.get(payout["order_id"])
            payout["order"] = order
            payout["event"] = events_map.get(order["event_id"]) if order else None
    return {"payouts": payouts, "summary": {"total_gross": round(total_gross, 2), "total_commission": round(total_commission, 2), "total_net": round(total_net, 2), "pending_amount": round(pending_amount, 2), "completed_amount": round(completed_amount, 2), "total_sales": len(payouts)}}


@router.get("/seller/dashboard-stats")
async def get_seller_dashboard_stats(request: Request):
    user = await require_seller(request)
    payouts = await db.seller_payouts.find({"seller_id": user.user_id}, {"_id": 0}).to_list(1000)
    active_tickets = await db.tickets.count_documents({"seller_id": user.user_id, "status": "available"})
    sold_tickets = await db.tickets.count_documents({"seller_id": user.user_id, "status": "sold"})
    total_earnings = sum(p.get("net_amount", 0) for p in payouts)
    pending_earnings = sum(p.get("net_amount", 0) for p in payouts if p.get("status") == "pending")
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_payouts = [p for p in payouts if p.get("created_at", "") >= month_start.isoformat()]
    monthly_earnings = sum(p.get("net_amount", 0) for p in monthly_payouts)
    return {"active_listings": active_tickets, "sold_tickets": sold_tickets, "total_earnings": round(total_earnings, 2), "pending_earnings": round(pending_earnings, 2), "monthly_earnings": round(monthly_earnings, 2), "rating": user.rating, "kyc_status": user.kyc_status}
