from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv 

load_dotenv()

# Get MongoDB URI from environment variable
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://default:password@cluster0.mongodb.net/?appName=Cluster0")
DATABASE_NAME = "roof_hunt_db"

# Create MongoDB client
client = MongoClient(MONGODB_URI, server_api=ServerApi('1'))

# Get database
db = client[DATABASE_NAME]

# Collections
properties_collection = db["properties"]

# Verify connection
def check_connection():
    try:
        client.admin.command('ping')
        print("✓ Successfully connected to MongoDB!")
        return True
    except Exception as e:
        print(f"✗ Failed to connect to MongoDB: {e}")
        return False

# Close connection
def close_connection():
    client.close()
    print("MongoDB connection closed")
