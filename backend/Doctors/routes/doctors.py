from flask import request, jsonify
from bson import ObjectId
from email_validator import validate_email, EmailNotValidError
import bcrypt 

def register_doctor_routes(app, db):
    doctors_collection = db["doctors"]
    departments_collection = db["departments"]

    @app.route('/doctors', methods=['GET'])
    def get_doctors():
        doctors = list(doctors_collection.find())
        for doc in doctors:
            doc["_id"] = str(doc["_id"])
        return jsonify(doctors)
    

    @app.route('/doctors', methods=['POST'])
    def add_doctor():
        data = request.get_json()
        required_fields = ["id", "name", "email","speciality", "password","phone" ]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        try:
            validate_email(data["email"])
        except EmailNotValidError as e:
            return jsonify({"error": f"Invalid email: {str(e)}"}), 400

        if len(data["password"]) < 4:
            return jsonify({"error": "Password too short"}), 400

        if doctors_collection.find_one({"email": data["email"]}):
            return jsonify({"error": "Email already exists"}), 400

        hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt())

        new_user = {
            "id": data["id"],
            "name": data["name"],
            "email": data["email"],
            "speciality": data["speciality"],
            "password": hashed_password,
            "phone":data["phone"]
            
        }

        result = doctors_collection.insert_one(new_user)
        return jsonify({"message": "User created", "id": str(result.inserted_id)}), 201

    @app.route('/doctors/<doctor_id>', methods=['PATCH'])
    def update_doctor(doctor_id):
        data = request.json
        result = doctors_collection.update_one({"_id": ObjectId(doctor_id)}, {"$set": data})
        if result.matched_count == 0:
            return jsonify({"error": "Doctor not found"}), 404
        return jsonify({"message": "Doctor updated"}), 200
    
    
    @app.route('/addDepartment', methods=['POST'])
    def add_department():
     data = request.get_json()
     print(f"Received data: {data}")  # Add this log line
    
     required_fields = ["name", "building", "floor", "rooms"]
     if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Check if the department already exists
     if departments_collection.find_one({"name": data["name"]}):
        return jsonify({"error": "Department already exists"}), 400

    # Create a new department object and insert it into the database
     new_department = {
        "name": data["name"],
        "building": data["building"],
        "floor": data["floor"],
        "rooms": data["rooms"]
      }

     result = departments_collection.insert_one(new_department)
     return jsonify({"message": "Department created", "name": str(result.inserted_id)}), 201

