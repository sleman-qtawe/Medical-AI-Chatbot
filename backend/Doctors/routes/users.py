from flask import request, jsonify
from email_validator import validate_email, EmailNotValidError
import bcrypt

def register_user_routes(app, db):
    users_collection = db["patients"]

    @app.route('/patients', methods=['POST'])
    def add_user():
        data = request.get_json()
        required_fields = ["username", "userid", "email", "password", "userGender" , "phone"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        try:
            validate_email(data["email"])
        except EmailNotValidError as e:
            return jsonify({"error": f"Invalid email: {str(e)}"}), 400

        if len(data["password"]) < 4:
            return jsonify({"error": "Password too short"}), 400

        if users_collection.find_one({"email": data["email"]}):
            return jsonify({"error": "Email already exists"}), 400

        hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt())

        new_user = {
            "username": data["username"],
            "userid": data["userid"],
            "email": data["email"],
            "password": hashed_password,
            "userGender": data["userGender"],
            "phone":data["phone"]
        }

        result = users_collection.insert_one(new_user)
        return jsonify({"message": "User created", "id": str(result.inserted_id)}), 201
       


 
      
