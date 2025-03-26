from bson import ObjectId
from flask import Flask, jsonify, request
import os
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

app = Flask(__name__)
CORS(app)

# ✅ Get MongoDB URI from .env file
mongo_uri = os.getenv("MONGO_URI")
##if not mongo_uri:
  ##  raise ValueError("❌ MONGO_URI is not set in the environment!")

# ✅ Connect to MongoDB Atlas
##try:
client = MongoClient(mongo_uri, server_api = ServerApi('1'))  # 5-second timeout
   ## client.admin.command('ping')  # Test connection
print("✅ Successfully connected to MongoDB Atlas!")
db = client["Cluster0"]  # Make sure this matches your actual database name in Atlas
doctors_collection = db["Doctors"]  # Collection where items are stored
##except Exception as e:
##print("❌ MongoDB connection failed:", e)
   ## db = None  # Prevent app from running if DB is not connected


@app.route('/')
def home():
    return jsonify({"message": "Welcome to my Flask API!", "version": "1.0"})




@app.route('/deleteDoctor/<int:id>', methods=['DELETE'])
def deleteItem(id):
     result = doctors_collection.delete_one({"_id": id})
     if result.deleted_count == 0:
        return jsonify({"error": "doctor not found"}), 404

     return jsonify({"message": "doctor deleted"})




if __name__ == '__main__':
    app.run(debug=True)
