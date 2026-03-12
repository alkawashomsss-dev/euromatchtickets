from fastapi import APIRouter, HTTPException, Request, Response
from datetime import datetime, timezone, timedelta
import uuid
import logging
import httpx

from database.db import db
from models.schemas import User, KYCSubmission
from utils.helpers import get_current_user, require_auth

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


@router.post("/auth/session")
async def exchange_session(request: Request, response: Response):
    logger.info("Auth session exchange started")
    try:
        body = await request.json()
        session_id = body.get("session_id")
        if not session_id:
            raise HTTPException(status_code=400, detail="session_id required")

        async with httpx.AsyncClient(timeout=30.0) as http_client:
            auth_response = await http_client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )

        if auth_response.status_code != 200:
            logger.error(f"Auth session validation failed: status={auth_response.status_code}, body={auth_response.text[:500]}")
            raise HTTPException(status_code=401, detail=f"Invalid session (upstream: {auth_response.status_code})")

        auth_data = auth_response.json()
        email = auth_data.get("email")
        name = auth_data.get("name", "User")
        picture = auth_data.get("picture")
        session_token = auth_data.get("session_token")

        if not email or not session_token:
            raise HTTPException(status_code=401, detail="Invalid auth data")

        existing_user = await db.users.find_one({"email": email}, {"_id": 0})

        if existing_user:
            user_id = existing_user["user_id"]
            await db.users.update_one(
                {"user_id": user_id},
                {"$set": {"name": name, "picture": picture}}
            )
        else:
            user_id = f"user_{uuid.uuid4().hex[:12]}"
            new_user = User(user_id=user_id, email=email, name=name, picture=picture, role="buyer")
            user_doc = new_user.model_dump()
            user_doc['created_at'] = user_doc['created_at'].isoformat()
            await db.users.insert_one(user_doc)

        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        session_doc = {
            "session_id": str(uuid.uuid4()),
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": expires_at.isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.user_sessions.delete_many({"user_id": user_id})
        await db.user_sessions.insert_one(session_doc)

        response.set_cookie(
            key="session_token", value=session_token,
            httponly=True, secure=True, samesite="none", path="/",
            max_age=7 * 24 * 60 * 60
        )

        user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
        return {"success": True, "user": user_doc, "session_token": session_token}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Auth session error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Authentication error: {str(e)}")


@router.get("/auth/me")
async def get_me(request: Request):
    try:
        user = await get_current_user(request)
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return user.model_dump()
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Not authenticated")


@router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_many({"session_token": session_token})
    response.delete_cookie(key="session_token", path="/")
    return {"success": True}


@router.post("/auth/become-seller")
async def become_seller(request: Request):
    user = await require_auth(request)
    await db.users.update_one({"user_id": user.user_id}, {"$set": {"role": "seller"}})
    return {"success": True, "role": "seller"}


@router.post("/auth/kyc")
async def submit_kyc(kyc_data: KYCSubmission, request: Request):
    user = await require_auth(request)
    kyc_doc = {
        "full_name": kyc_data.full_name,
        "date_of_birth": kyc_data.date_of_birth,
        "address": kyc_data.address,
        "country": kyc_data.country,
        "id_type": kyc_data.id_type,
        "id_number": kyc_data.id_number,
        "submitted_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.update_one(
        {"user_id": user.user_id},
        {"$set": {"kyc_status": "submitted", "kyc_documents": kyc_doc}}
    )
    return {"success": True, "status": "submitted"}
