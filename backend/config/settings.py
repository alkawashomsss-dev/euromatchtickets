import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent.parent
# override=True ensures our production .env Stripe LIVE key wins over any
# pre-seeded sk_test_* placeholder in the container environment.
load_dotenv(ROOT_DIR / '.env', override=True)

MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME')
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', '')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', '')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://euromatchtickets.com')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY') or os.environ.get('EMERGENT_LLM_KEY')
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
PLATFORM_COMMISSION = 0.0
