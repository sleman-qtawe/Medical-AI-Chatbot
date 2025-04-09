from flask import request, jsonify
from bson import ObjectId
import bcrypt

def check_valid_email(app, db):
    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()  
        required_fields = ['email', 'password']

        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        email = data['email']
        password = data['password']
        new_user = None

        # Admin
        if email == 'admin@gmail.com' and password == '12345':
            new_user = {
                "email": email,
                "name": "Admin",
                "role": 'admin'
            }
            return jsonify({
                "message": "Login success",
                "user": new_user,
                "token": "admin_token"
            }), 200

        # patients
        patient = db["patients"].find_one({'email': email})
        if patient:
            hashed_pw = patient['password']
            if isinstance(hashed_pw, str):
                hashed_pw = hashed_pw.encode('utf-8')
            if bcrypt.checkpw(password.encode('utf-8'), hashed_pw):
                new_user = {
                    "_id": str(patient["_id"]),
                    "id": patient.get("id"),
                    "name": patient.get("name"),
                    "email": patient.get("email"),
                    "userGender": patient.get("userGender"),
                    "role": 'patient'
                }
                return jsonify({
                    "message": "Login success",
                    "user": new_user,
                    "token": "some_patient_token"
                }), 200

        # doctors
        doctor = db["doctors"].find_one({'email': email})
        if doctor:
            hashed_pw = doctor['password']
            if isinstance(hashed_pw, str):
                hashed_pw = hashed_pw.encode('utf-8')
            if bcrypt.checkpw(password.encode('utf-8'), hashed_pw):
                new_user = {
                    "_id": str(doctor["_id"]),
                    "id": doctor.get("id"),
                    "name": doctor.get("name"),
                    "email": doctor.get("email"),
                    "speciality": doctor.get("speciality"),
                    "role": 'doctor'
                }
                return jsonify({
                    "message": "Login success",
                    "user": new_user,
                    "token": "some_doctor_token"
                }), 200

        return jsonify({"error": "Invalid credentials"}), 401
