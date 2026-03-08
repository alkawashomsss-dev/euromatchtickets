"""
Database configuration and connection management
"""
import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME')

if not mongo_url:
    raise ValueError("MONGO_URL environment variable is required")
if not db_name:
    raise ValueError("DB_NAME environment variable is required")

client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=30000, connectTimeoutMS=30000)
db = client[db_name]


def get_database():
    """Get database instance"""
    return db


def get_client():
    """Get MongoDB client"""
    return client


async def close_connection():
    """Close database connection"""
    try:
        client.close()
        logger.info("Database connection closed")
    except Exception as e:
        logger.error(f"Error closing database connection: {e}")
