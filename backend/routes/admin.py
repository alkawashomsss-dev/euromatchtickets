from fastapi import APIRouter, HTTPException, Request
from datetime import datetime, timezone
import uuid
import logging

from database.db import db
from models.schemas import Dispute, Rating, RatingCreate, ReviewCreate
from utils.helpers import require_auth, require_admin, require_seller

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


# Admin Stats
@router.get("/admin/stats")
async def get_admin_stats(request: Request):
    user = await require_admin(request)
    total_users = await db.users.count_documents({})
    total_sellers = await db.users.count_documents({"role": "seller"})
    verified_sellers = await db.users.count_documents({"role": "seller", "kyc_status": "verified"})
    total_events = await db.events.count_documents({})
    total_tickets = await db.tickets.count_documents({})
    available_tickets = await db.tickets.count_documents({"status": "available"})
    sold_tickets = await db.tickets.count_documents({"status": "sold"})
    open_disputes = await db.disputes.count_documents({"status": "open"})
    completed_orders = await db.orders.find({"status": "completed"}, {"_id": 0, "total_amount": 1, "commission": 1}).to_list(10000)
    total_revenue = sum(o["total_amount"] for o in completed_orders)
    total_commission = sum(o["commission"] for o in completed_orders)
    return {"total_users": total_users, "total_sellers": total_sellers, "verified_sellers": verified_sellers, "total_events": total_events, "total_tickets": total_tickets, "available_tickets": available_tickets, "sold_tickets": sold_tickets, "open_disputes": open_disputes, "total_revenue": round(total_revenue, 2), "total_commission": round(total_commission, 2)}


@router.get("/admin/users")
async def get_admin_users(request: Request):
    await require_admin(request)
    return await db.users.find({}, {"_id": 0}).to_list(1000)


@router.put("/admin/users/{user_id}/role")
async def update_user_role(user_id: str, request: Request):
    await require_admin(request)
    body = await request.json()
    role = body.get("role")
    if role not in ["buyer", "seller", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    result = await db.users.update_one({"user_id": user_id}, {"$set": {"role": role}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True}


@router.put("/admin/users/{user_id}/kyc")
async def update_kyc_status(user_id: str, request: Request):
    await require_admin(request)
    body = await request.json()
    status = body.get("status")
    if status not in ["pending", "submitted", "verified", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.users.update_one({"user_id": user_id}, {"$set": {"kyc_status": status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True}


@router.get("/admin/orders")
async def get_admin_orders(request: Request):
    await require_admin(request)
    return await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)


# Disputes
@router.post("/disputes")
async def create_dispute(request: Request):
    user = await require_auth(request)
    body = await request.json()
    order = await db.orders.find_one({"order_id": body.get("order_id")}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["buyer_id"] != user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    dispute = Dispute(order_id=body["order_id"], buyer_id=user.user_id, seller_id=order["seller_id"], reason=body.get("reason", ""), description=body.get("description", ""))
    doc = dispute.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.disputes.insert_one(doc)
    await db.orders.update_one({"order_id": body["order_id"]}, {"$set": {"status": "disputed"}})
    return {"success": True, "dispute_id": dispute.dispute_id}


@router.get("/admin/disputes")
async def get_disputes(request: Request):
    await require_admin(request)
    disputes = await db.disputes.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for d in disputes:
        d["order"] = await db.orders.find_one({"order_id": d["order_id"]}, {"_id": 0})
        d["buyer"] = await db.users.find_one({"user_id": d["buyer_id"]}, {"_id": 0})
        d["seller"] = await db.users.find_one({"user_id": d["seller_id"]}, {"_id": 0})
    return disputes


@router.put("/admin/disputes/{dispute_id}")
async def resolve_dispute(dispute_id: str, request: Request):
    await require_admin(request)
    body = await request.json()
    result = await db.disputes.update_one({"dispute_id": dispute_id}, {"$set": {"status": body.get("status"), "resolution": body.get("resolution")}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Dispute not found")
    return {"success": True}


# Seller Ratings
@router.post("/ratings")
async def create_rating(rating_data: RatingCreate, request: Request):
    user = await require_auth(request)
    order = await db.orders.find_one({"order_id": rating_data.order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["buyer_id"] != user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    if order["status"] != "completed":
        raise HTTPException(status_code=400, detail="Order not completed")
    existing = await db.ratings.find_one({"order_id": rating_data.order_id}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Already rated")
    rating = Rating(order_id=rating_data.order_id, seller_id=order["seller_id"], buyer_id=user.user_id, rating=rating_data.rating, comment=rating_data.comment)
    doc = rating.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.ratings.insert_one(doc)
    seller_ratings = await db.ratings.find({"seller_id": order["seller_id"]}, {"_id": 0, "rating": 1}).to_list(1000)
    avg = sum(r["rating"] for r in seller_ratings) / len(seller_ratings)
    await db.users.update_one({"user_id": order["seller_id"]}, {"$set": {"rating": round(avg, 1)}})
    return {"success": True}


@router.get("/sellers/{seller_id}/ratings")
async def get_seller_ratings(seller_id: str):
    return await db.ratings.find({"seller_id": seller_id}, {"_id": 0}).sort("created_at", -1).to_list(100)


# Owner Dashboard
@router.get("/owner/dashboard")
async def get_owner_dashboard(request: Request):
    await require_admin(request)
    orders = await db.orders.find({"status": "completed"}, {"_id": 0}).to_list(1000)
    total_revenue = sum(o.get("total_amount", 0) for o in orders)
    total_commission = sum(o.get("commission", 0) for o in orders)
    pending_payouts = await db.payouts.find({"status": "pending"}, {"_id": 0}).to_list(100)
    pending_payout_amount = sum(p.get("amount", 0) for p in pending_payouts)
    completed_payouts = await db.payouts.find({"status": "completed"}, {"_id": 0}).to_list(100)
    total_paid_out = sum(p.get("amount", 0) for p in completed_payouts)
    orders_pending = await db.orders.count_documents({"status": "pending"})
    orders_completed = await db.orders.count_documents({"status": "completed"})
    orders_cancelled = await db.orders.count_documents({"status": "cancelled"})
    recent = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(10)
    for o in recent:
        ev = await db.events.find_one({"event_id": o.get("event_id")}, {"_id": 0, "title": 1})
        o["event_title"] = ev.get("title") if ev else "Unknown"
    return {"revenue": {"total": round(total_revenue, 2), "commission": round(total_commission, 2), "seller_amount": round(total_revenue - total_commission, 2)}, "payouts": {"pending_count": len(pending_payouts), "pending_amount": round(pending_payout_amount, 2), "total_paid": round(total_paid_out, 2)}, "orders": {"pending": orders_pending, "completed": orders_completed, "cancelled": orders_cancelled, "total": orders_pending + orders_completed + orders_cancelled}, "recent_orders": recent}


@router.get("/owner/sellers")
async def get_sellers_with_balance(request: Request):
    await require_admin(request)
    sellers = await db.users.find({"role": "seller"}, {"_id": 0, "user_id": 1, "name": 1, "email": 1, "kyc_status": 1}).to_list(100)
    for s in sellers:
        orders = await db.orders.find({"seller_id": s["user_id"], "status": "completed"}, {"_id": 0, "total_amount": 1, "commission": 1}).to_list(100)
        total_sales = sum(o.get("total_amount", 0) for o in orders)
        total_commission = sum(o.get("commission", 0) for o in orders)
        payouts = await db.payouts.find({"seller_id": s["user_id"], "status": "completed"}, {"_id": 0, "amount": 1}).to_list(100)
        total_paid = sum(p.get("amount", 0) for p in payouts)
        s["total_sales"] = round(total_sales, 2)
        s["total_earnings"] = round(total_sales - total_commission, 2)
        s["total_paid"] = round(total_paid, 2)
        s["pending_balance"] = round(total_sales - total_commission - total_paid, 2)
    return sellers


@router.post("/owner/payouts")
async def create_payout(request: Request):
    await require_admin(request)
    body = await request.json()
    seller_id = body.get("seller_id")
    amount = body.get("amount")
    if not seller_id or not amount:
        raise HTTPException(status_code=400, detail="seller_id and amount required")
    seller = await db.users.find_one({"user_id": seller_id}, {"_id": 0})
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")
    payout = {"payout_id": f"payout_{uuid.uuid4().hex[:12]}", "seller_id": seller_id, "seller_name": seller.get("name"), "amount": amount, "payment_method": body.get("payment_method", "bank_transfer"), "status": "pending", "notes": body.get("notes", ""), "created_at": datetime.now(timezone.utc)}
    await db.payouts.insert_one(payout)
    payout.pop("_id", None)
    return payout


@router.put("/owner/payouts/{payout_id}/complete")
async def complete_payout(payout_id: str, request: Request):
    await require_admin(request)
    result = await db.payouts.update_one({"payout_id": payout_id}, {"$set": {"status": "completed", "completed_at": datetime.now(timezone.utc)}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Payout not found")
    return {"success": True}


@router.get("/owner/payouts")
async def get_all_payouts(request: Request):
    await require_admin(request)
    return await db.payouts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)


# Cleanup
@router.post("/cleanup/expired-events")
async def cleanup_expired_events_api():
    try:
        now = datetime.now(timezone.utc)
        today = now.replace(hour=0, minute=0, second=0, microsecond=0)
        expired_events = await db.events.find({"event_date": {"$lt": today}, "status": {"$nin": ["past_event", "expired"]}}).to_list(1000)
        if not expired_events:
            return {"status": "success", "message": "No expired events found", "events_updated": 0}
        updated = 0
        for event in expired_events:
            et = event.get("event_type", "")
            next_event = await db.events.find_one({"event_type": et, "event_date": {"$gte": today}, "status": {"$nin": ["past_event", "expired"]}}, {"_id": 0, "event_id": 1, "name": 1, "event_date": 1}, sort=[("event_date", 1)])
            similar = await db.events.find({"event_type": et, "event_date": {"$gte": today}, "status": {"$nin": ["past_event", "expired"]}, "event_id": {"$ne": event.get("event_id")}}, {"_id": 0, "event_id": 1, "name": 1}).limit(5).to_list(5)
            await db.events.update_one({"_id": event["_id"]}, {"$set": {"status": "past_event", "updated_at": now, "next_event": next_event, "similar_events": similar}})
            await db.tickets.update_many({"event_id": event.get("event_id")}, {"$set": {"status": "past_event", "updated_at": now}})
            updated += 1
        return {"status": "success", "events_updated": updated, "note": "Events marked as past_event, SEO preserved", "timestamp": now.isoformat()}
    except Exception as e:
        logger.error(f"Cleanup error: {e}")
        return {"status": "error", "message": str(e)}


@router.get("/cleanup/status")
async def get_cleanup_status():
    now = datetime.now(timezone.utc)
    today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    return {
        "events": {
            "total": await db.events.count_documents({}),
            "active": await db.events.count_documents({"event_date": {"$gte": today}, "status": {"$nin": ["past_event", "expired"]}}),
            "past_event": await db.events.count_documents({"status": "past_event"}),
            "expired": await db.events.count_documents({"status": "expired"}),
            "pending_cleanup": await db.events.count_documents({"event_date": {"$lt": today}, "status": {"$nin": ["past_event", "expired"]}})
        },
        "tickets": {
            "total": await db.tickets.count_documents({}),
            "available": await db.tickets.count_documents({"status": "available"})
        },
        "last_check": now.isoformat()
    }


# Site Reviews (public)
@router.post("/reviews")
async def create_review(review: ReviewCreate):
    doc = {
        "review_id": f"rev_{uuid.uuid4().hex[:12]}",
        "reviewer_name": review.reviewer_name,
        "reviewer_email": review.reviewer_email,
        "event_name": review.event_name,
        "rating": review.rating,
        "title": review.title,
        "content": review.content,
        "verified_purchase": review.verified_purchase,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.reviews.insert_one(doc)
    doc.pop("_id", None)
    return {"success": True, "review_id": doc["review_id"]}


@router.get("/reviews")
async def get_reviews(status: str = "approved", limit: int = 50):
    reviews = await db.reviews.find({"status": status}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    pipeline = [{"$match": {"status": "approved"}}, {"$group": {"_id": None, "avg": {"$avg": "$rating"}, "count": {"$sum": 1}}}]
    agg = await db.reviews.aggregate(pipeline).to_list(1)
    stats = agg[0] if agg else {"avg": 4.8, "count": 0}
    return {"reviews": reviews, "aggregate": {"average_rating": round(stats.get("avg", 4.8), 1), "total_reviews": stats.get("count", 0)}}


@router.put("/admin/reviews/{review_id}")
async def moderate_review(review_id: str, request: Request):
    await require_admin(request)
    body = await request.json()
    result = await db.reviews.update_one({"review_id": review_id}, {"$set": {"status": body.get("status", "approved")}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"success": True}
