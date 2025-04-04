from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)
db = mongo.db
doctors_collection = db["doctors"]

@app.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = list(doctors_collection.find())
    for doc in doctors:
        doc["_id"] = str(doc["_id"])
    return jsonify(doctors)

@app.route('/doctors', methods=['POST'])
def add_doctor():
    data = request.json
    doctors_collection.insert_one(data)
    return jsonify({"message": "Doctor added"}), 201

@app.route('/doctors/<doctor_id>', methods=['PATCH'])
def update_doctor(doctor_id):
    data = request.json
    result = doctors_collection.update_one({"_id": ObjectId(doctor_id)}, {"$set": data})
    if result.matched_count == 0:
        return jsonify({"error": "Doctor not found"}), 404
    return jsonify({"message": "Doctor updated"}), 200

if __name__ == '__main__':
    app.run(debug=True)
