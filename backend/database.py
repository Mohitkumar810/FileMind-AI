from pymongo import MongoClient

# MongoDB connection
MONGO_URI = "mongodb://localhost:27017/"

client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000
)

# Test MongoDB connection
try:
    client.admin.command("ping")
    print("MongoDB connected successfully!")
except Exception as e:
    print("MongoDB connection failed!")
    print(e)

# Database
db = client["FileMindAI"]

# Collections
users_collection = db["users"]
files_collection = db["files"]
chats_collection = db["chats"]