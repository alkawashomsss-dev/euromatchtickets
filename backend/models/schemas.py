from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime, timezone
import uuid


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "buyer"
    rating: float = 5.0
    total_sales: int = 0
    kyc_status: str = "pending"
    kyc_documents: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    event_id: str = Field(default_factory=lambda: f"event_{uuid.uuid4().hex[:12]}")
    event_type: str
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    home_team: Optional[str] = None
    away_team: Optional[str] = None
    home_logo: Optional[str] = None
    away_logo: Optional[str] = None
    league: Optional[str] = None
    league_logo: Optional[str] = None
    artist: Optional[str] = None
    artist_image: Optional[str] = None
    genre: Optional[str] = None
    venue: str
    city: str
    country: str
    event_date: datetime
    event_image: Optional[str] = None
    status: str = "upcoming"
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EventCreate(BaseModel):
    event_type: str
    title: str
    subtitle: Optional[str] = None
    home_team: Optional[str] = None
    away_team: Optional[str] = None
    home_logo: Optional[str] = None
    away_logo: Optional[str] = None
    league: Optional[str] = None
    league_logo: Optional[str] = None
    artist: Optional[str] = None
    artist_image: Optional[str] = None
    genre: Optional[str] = None
    venue: str
    city: str
    country: str
    event_date: datetime
    event_image: Optional[str] = None
    featured: bool = False


class Ticket(BaseModel):
    model_config = ConfigDict(extra="ignore")
    ticket_id: str = Field(default_factory=lambda: f"ticket_{uuid.uuid4().hex[:12]}")
    event_id: str
    seller_id: str
    seller_name: str
    category: str
    section: str
    row: Optional[str] = None
    seat: Optional[str] = None
    price: float
    original_price: float
    currency: str = "EUR"
    status: str = "available"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TicketCreate(BaseModel):
    event_id: str
    category: str
    section: str
    row: Optional[str] = None
    seat: Optional[str] = None
    price: float
    original_price: float
    currency: str = "EUR"


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    order_id: str = Field(default_factory=lambda: f"order_{uuid.uuid4().hex[:12]}")
    buyer_id: str
    buyer_email: str
    ticket_id: str
    event_id: str
    seller_id: str
    ticket_price: float
    commission: float
    total_amount: float
    currency: str = "EUR"
    status: str = "pending"
    stripe_session_id: Optional[str] = None
    qr_code: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Rating(BaseModel):
    model_config = ConfigDict(extra="ignore")
    rating_id: str = Field(default_factory=lambda: f"rating_{uuid.uuid4().hex[:12]}")
    order_id: str
    seller_id: str
    buyer_id: str
    rating: int
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class RatingCreate(BaseModel):
    order_id: str
    rating: int
    comment: Optional[str] = None


class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    transaction_id: str = Field(default_factory=lambda: f"txn_{uuid.uuid4().hex[:12]}")
    order_id: str
    session_id: str
    amount: float
    currency: str
    status: str = "initiated"
    metadata: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Dispute(BaseModel):
    model_config = ConfigDict(extra="ignore")
    dispute_id: str = Field(default_factory=lambda: f"dispute_{uuid.uuid4().hex[:12]}")
    order_id: str
    buyer_id: str
    seller_id: str
    reason: str
    description: str
    status: str = "open"
    resolution: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class KYCSubmission(BaseModel):
    full_name: str
    date_of_birth: str
    address: str
    country: str
    id_type: str
    id_number: str


class PriceAlert(BaseModel):
    model_config = ConfigDict(extra="ignore")
    alert_id: str = Field(default_factory=lambda: f"alert_{uuid.uuid4().hex[:12]}")
    user_id: str
    user_email: str
    event_id: str
    target_price: float
    current_lowest: Optional[float] = None
    status: str = "active"
    language: str = "en"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PriceAlertCreate(BaseModel):
    event_id: str
    target_price: float


class SellerPayout(BaseModel):
    model_config = ConfigDict(extra="ignore")
    payout_id: str = Field(default_factory=lambda: f"payout_{uuid.uuid4().hex[:12]}")
    seller_id: str
    order_id: str
    ticket_id: str
    gross_amount: float
    commission: float
    net_amount: float
    currency: str = "EUR"
    status: str = "pending"
    payout_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ChatMessage(BaseModel):
    message: str
    session_id: str


class RaffleEntry(BaseModel):
    raffle_type: str
    price: float = 100
    entries: int = 1


class ReviewCreate(BaseModel):
    reviewer_name: str
    reviewer_email: Optional[str] = None
    event_name: str
    rating: int = Field(ge=1, le=5)
    title: str
    content: str
    verified_purchase: bool = False
