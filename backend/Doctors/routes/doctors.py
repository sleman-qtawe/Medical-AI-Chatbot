from flask import request, jsonify
from bson import ObjectId

def register_doctor_routes(app, db):
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
