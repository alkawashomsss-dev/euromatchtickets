from motor.motor_asyncio import AsyncIOMotorClient
from config.settings import MONGO_URL, DB_NAME

client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=30000, connectTimeoutMS=30000)
db = client[DB_NAME]
