"""
EuroMatchTickets Email Service
Professional email templates for transactional emails
"""

import os
import asyncio
import logging
import resend
from typing import Optional, Dict, Any
from datetime import datetime

logger = logging.getLogger(__name__)

# Initialize Resend
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://euromatchtickets.com')

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Email Template Base
BASE_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #09090b; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #18181b; border-radius: 16px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%); padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">FanPass</h1>
                            <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0; font-size: 14px;">Europe's #1 Ticket Marketplace</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            {content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #0f0f11; padding: 25px 30px; text-align: center; border-top: 1px solid #27272a;">
                            <p style="color: #71717a; margin: 0 0 10px; font-size: 12px;">
                                © 2025 FanPass. All rights reserved.
                            </p>
                            <p style="color: #52525b; margin: 0; font-size: 11px;">
                                Questions? Contact us at support@fanpass.com
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""

# German translations
TRANSLATIONS = {
    'en': {
        'order_confirmed': 'Order Confirmed!',
        'your_ticket': 'Your Ticket',
        'event': 'Event',
        'date': 'Date',
        'venue': 'Venue',
        'section': 'Section',
        'row_seat': 'Row / Seat',
        'order_id': 'Order ID',
        'total_paid': 'Total Paid',
        'qr_instructions': 'Show this QR code at the venue entrance',
        'thank_you': 'Thank you for your purchase!',
        'price_drop': 'Price Drop Alert!',
        'price_dropped_to': 'Price dropped to',
        'buy_now': 'Buy Now',
        'seller_notification': 'Ticket Sold!',
        'you_sold': 'You sold a ticket',
        'payout_amount': 'Your payout',
        'commission': 'Platform fee (10%)',
        'welcome': 'Welcome to FanPass!',
        'account_created': 'Your account has been created successfully.',
        'start_exploring': 'Start Exploring Events',
        'dispute_opened': 'Dispute Opened',
        'dispute_resolved': 'Dispute Resolved',
    },
    'de': {
        'order_confirmed': 'Bestellung bestätigt!',
        'your_ticket': 'Ihr Ticket',
        'event': 'Veranstaltung',
        'date': 'Datum',
        'venue': 'Veranstaltungsort',
        'section': 'Sektion',
        'row_seat': 'Reihe / Platz',
        'order_id': 'Bestellnummer',
        'total_paid': 'Gesamtbetrag',
        'qr_instructions': 'Zeigen Sie diesen QR-Code am Eingang',
        'thank_you': 'Vielen Dank für Ihren Kauf!',
        'price_drop': 'Preisalarm!',
        'price_dropped_to': 'Preis gefallen auf',
        'buy_now': 'Jetzt kaufen',
        'seller_notification': 'Ticket verkauft!',
        'you_sold': 'Sie haben ein Ticket verkauft',
        'payout_amount': 'Ihre Auszahlung',
        'commission': 'Plattformgebühr (10%)',
        'welcome': 'Willkommen bei FanPass!',
        'account_created': 'Ihr Konto wurde erfolgreich erstellt.',
        'start_exploring': 'Events entdecken',
        'dispute_opened': 'Streitfall eröffnet',
        'dispute_resolved': 'Streitfall gelöst',
    }
}

def get_text(key: str, lang: str = 'en') -> str:
    """Get translated text"""
    return TRANSLATIONS.get(lang, TRANSLATIONS['en']).get(key, key)


def format_date(date_str: str, lang: str = 'en') -> str:
    """Format date for display"""
    try:
        dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        if lang == 'de':
            return dt.strftime('%d.%m.%Y um %H:%M Uhr')
        return dt.strftime('%B %d, %Y at %I:%M %p')
    except:
        return date_str


def build_email(content: str) -> str:
    """Wrap content in base template"""
    return BASE_TEMPLATE.format(content=content)


# ============== EMAIL TEMPLATES ==============

def order_confirmation_email(order: Dict, event: Dict, ticket: Dict, lang: str = 'en') -> Dict[str, str]:
    """Generate order confirmation email"""
    t = lambda key: get_text(key, lang)
    
    content = f"""
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 80px; height: 80px; background-color: #22c55e; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">✓</span>
            </div>
            <h2 style="color: #ffffff; margin: 0; font-size: 24px;">{t('order_confirmed')}</h2>
            <p style="color: #a1a1aa; margin: 10px 0 0;">{t('thank_you')}</p>
        </div>
        
        <div style="background-color: #27272a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <h3 style="color: #a855f7; margin: 0 0 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">{t('your_ticket')}</h3>
            
            <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                    <td style="color: #71717a; font-size: 14px;">{t('event')}</td>
                    <td style="color: #ffffff; font-size: 14px; font-weight: bold; text-align: right;">{event.get('title', 'N/A')}</td>
                </tr>
                <tr>
                    <td style="color: #71717a; font-size: 14px;">{t('date')}</td>
                    <td style="color: #ffffff; font-size: 14px; text-align: right;">{format_date(event.get('event_date', ''), lang)}</td>
                </tr>
                <tr>
                    <td style="color: #71717a; font-size: 14px;">{t('venue')}</td>
                    <td style="color: #ffffff; font-size: 14px; text-align: right;">{event.get('venue', '')}, {event.get('city', '')}</td>
                </tr>
                <tr>
                    <td style="color: #71717a; font-size: 14px;">{t('section')}</td>
                    <td style="color: #ffffff; font-size: 14px; text-align: right;">{ticket.get('category', '').upper()} - {ticket.get('section', '')}</td>
                </tr>
                {'<tr><td style="color: #71717a; font-size: 14px;">' + t('row_seat') + '</td><td style="color: #ffffff; font-size: 14px; text-align: right;">' + str(ticket.get('row', '')) + ' / ' + str(ticket.get('seat', '')) + '</td></tr>' if ticket.get('row') else ''}
            </table>
        </div>
        
        <div style="background-color: #ffffff; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 25px;">
            <p style="color: #18181b; font-size: 12px; margin: 0 0 15px; text-transform: uppercase; letter-spacing: 1px;">{t('qr_instructions')}</p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=FANPASS-{order.get('order_id', '')}" alt="QR Code" style="width: 180px; height: 180px;" />
            <p style="color: #71717a; font-size: 11px; margin: 15px 0 0;">{t('order_id')}: {order.get('order_id', '')}</p>
        </div>
        
        <div style="background-color: #27272a; border-radius: 12px; padding: 20px; text-align: center;">
            <p style="color: #71717a; margin: 0 0 5px; font-size: 14px;">{t('total_paid')}</p>
            <p style="color: #22c55e; margin: 0; font-size: 32px; font-weight: bold;">€{order.get('total_amount', 0):.2f}</p>
        </div>
    """
    
    return {
        'subject': f"🎫 {t('order_confirmed')} - {event.get('title', 'FanPass')}",
        'html': build_email(content)
    }


def price_drop_alert_email(event: Dict, old_price: float, new_price: float, lang: str = 'en') -> Dict[str, str]:
    """Generate price drop alert email"""
    t = lambda key: get_text(key, lang)
    savings = old_price - new_price
    
    content = f"""
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 80px; height: 80px; background-color: #f59e0b; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">🔔</span>
            </div>
            <h2 style="color: #ffffff; margin: 0; font-size: 24px;">{t('price_drop')}</h2>
        </div>
        
        <div style="background-color: #27272a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <h3 style="color: #ffffff; margin: 0 0 10px; font-size: 20px;">{event.get('title', '')}</h3>
            <p style="color: #a1a1aa; margin: 0 0 20px; font-size: 14px;">{event.get('venue', '')}, {event.get('city', '')}</p>
            
            <div style="display: flex; justify-content: center; gap: 20px; text-align: center;">
                <div>
                    <p style="color: #71717a; margin: 0; font-size: 12px; text-decoration: line-through;">€{old_price:.0f}</p>
                    <p style="color: #22c55e; margin: 5px 0 0; font-size: 36px; font-weight: bold;">€{new_price:.0f}</p>
                </div>
            </div>
            
            <p style="color: #22c55e; margin: 20px 0 0; font-size: 16px; text-align: center;">
                💰 Save €{savings:.0f}!
            </p>
        </div>
        
        <div style="text-align: center;">
            <a href="{FRONTEND_URL}/event/{event.get('event_id', '')}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                {t('buy_now')} →
            </a>
        </div>
    """
    
    return {
        'subject': f"🔔 {t('price_drop')} {event.get('title', '')} - Now €{new_price:.0f}!",
        'html': build_email(content)
    }


def seller_sale_notification_email(order: Dict, event: Dict, ticket: Dict, lang: str = 'en') -> Dict[str, str]:
    """Generate seller notification email when ticket is sold"""
    t = lambda key: get_text(key, lang)
    payout = order.get('ticket_price', 0)
    commission = order.get('commission', 0)
    
    content = f"""
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 80px; height: 80px; background-color: #22c55e; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">💰</span>
            </div>
            <h2 style="color: #ffffff; margin: 0; font-size: 24px;">{t('seller_notification')}</h2>
            <p style="color: #a1a1aa; margin: 10px 0 0;">{t('you_sold')}</p>
        </div>
        
        <div style="background-color: #27272a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <table width="100%" cellpadding="10" cellspacing="0">
                <tr>
                    <td style="color: #71717a; font-size: 14px;">{t('event')}</td>
                    <td style="color: #ffffff; font-size: 14px; font-weight: bold; text-align: right;">{event.get('title', '')}</td>
                </tr>
                <tr>
                    <td style="color: #71717a; font-size: 14px;">{t('section')}</td>
                    <td style="color: #ffffff; font-size: 14px; text-align: right;">{ticket.get('category', '').upper()} - {ticket.get('section', '')}</td>
                </tr>
                <tr style="border-top: 1px solid #3f3f46;">
                    <td style="color: #71717a; font-size: 14px; padding-top: 15px;">Ticket Price</td>
                    <td style="color: #ffffff; font-size: 14px; text-align: right; padding-top: 15px;">€{order.get('total_amount', 0) - commission:.2f}</td>
                </tr>
                <tr>
                    <td style="color: #71717a; font-size: 14px;">{t('commission')}</td>
                    <td style="color: #ef4444; font-size: 14px; text-align: right;">-€{commission:.2f}</td>
                </tr>
            </table>
        </div>
        
        <div style="background-color: #22c55e; border-radius: 12px; padding: 25px; text-align: center;">
            <p style="color: rgba(255,255,255,0.8); margin: 0 0 5px; font-size: 14px;">{t('payout_amount')}</p>
            <p style="color: #ffffff; margin: 0; font-size: 36px; font-weight: bold;">€{payout:.2f}</p>
        </div>
    """
    
    return {
        'subject': f"💰 {t('seller_notification')} - €{payout:.2f} earned!",
        'html': build_email(content)
    }


def welcome_email(user_name: str, lang: str = 'en') -> Dict[str, str]:
    """Generate welcome email for new users"""
    t = lambda key: get_text(key, lang)
    
    content = f"""
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #ffffff; margin: 0; font-size: 28px;">{t('welcome')}</h2>
            <p style="color: #a1a1aa; margin: 15px 0 0; font-size: 16px;">Hi {user_name}! {t('account_created')}</p>
        </div>
        
        <div style="background-color: #27272a; border-radius: 12px; padding: 30px; margin-bottom: 25px;">
            <h3 style="color: #ffffff; margin: 0 0 20px; font-size: 18px;">What you can do:</h3>
            <table width="100%" cellpadding="10" cellspacing="0">
                <tr>
                    <td style="color: #a855f7; font-size: 20px; width: 40px;">🎫</td>
                    <td style="color: #ffffff; font-size: 14px;">Browse thousands of events across Europe</td>
                </tr>
                <tr>
                    <td style="color: #22c55e; font-size: 20px;">💰</td>
                    <td style="color: #ffffff; font-size: 14px;">Sell your extra tickets to other fans</td>
                </tr>
                <tr>
                    <td style="color: #f59e0b; font-size: 20px;">🔔</td>
                    <td style="color: #ffffff; font-size: 14px;">Set price alerts for your favorite events</td>
                </tr>
                <tr>
                    <td style="color: #3b82f6; font-size: 20px;">🛡️</td>
                    <td style="color: #ffffff; font-size: 14px;">100% buyer protection on all purchases</td>
                </tr>
            </table>
        </div>
        
        <div style="text-align: center;">
            <a href="https://fanpass.com/events" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; font-size: 16px;">
                {t('start_exploring')} →
            </a>
        </div>
    """
    
    return {
        'subject': f"🎉 {t('welcome')}",
        'html': build_email(content)
    }


# ============== SEND EMAIL FUNCTION ==============

async def send_email(to_email: str, subject: str, html_content: str) -> Dict[str, Any]:
    """Send email using Resend (async, non-blocking)"""
    if not RESEND_API_KEY or RESEND_API_KEY == 're_your_api_key_here':
        logger.warning("Resend API key not configured - email not sent")
        return {"status": "skipped", "message": "Email service not configured"}
    
    params = {
        "from": SENDER_EMAIL,
        "to": [to_email],
        "subject": subject,
        "html": html_content
    }
    
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent to {to_email}: {subject}")
        return {"status": "success", "email_id": result.get("id")}
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return {"status": "error", "message": str(e)}


# ============== HIGH-LEVEL EMAIL FUNCTIONS ==============

async def send_order_confirmation(order: Dict, event: Dict, ticket: Dict, buyer_email: str, lang: str = 'en'):
    """Send order confirmation to buyer"""
    email_data = order_confirmation_email(order, event, ticket, lang)
    return await send_email(buyer_email, email_data['subject'], email_data['html'])


async def send_seller_notification(order: Dict, event: Dict, ticket: Dict, seller_email: str, lang: str = 'en'):
    """Send sale notification to seller"""
    email_data = seller_sale_notification_email(order, event, ticket, lang)
    return await send_email(seller_email, email_data['subject'], email_data['html'])


async def send_price_drop_alert(event: Dict, old_price: float, new_price: float, user_email: str, lang: str = 'en'):
    """Send price drop alert to user"""
    email_data = price_drop_alert_email(event, old_price, new_price, lang)
    return await send_email(user_email, email_data['subject'], email_data['html'])


async def send_welcome(user_name: str, user_email: str, lang: str = 'en'):
    """Send welcome email to new user"""
    email_data = welcome_email(user_name, lang)
    return await send_email(user_email, email_data['subject'], email_data['html'])
