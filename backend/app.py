from flask_cors import CORS
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os
import bcrypt
from email_validator import validate_email, EmailNotValidError
from flask import Flask, request, jsonify 
# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Set MongoDB URI
app.config["MONGO_URI"] = "mongodb+srv://mj219213:456321798@cluster0.u81fqqi.mongodb.net/Medecal?retryWrites=true&w=majority&appName=Cluster0"

mongo = PyMongo(app)
db = mongo.db  # Get the database
users_collection = db.users  # Collection for users


#sign_up 
@app.route('/users', methods=['POST'])
def addUsersFromSignUp():
    data = request.get_json()  

    required_fields = ["username", "userid", "email", "password", "userGender"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        validate_email(data["email"])
    except EmailNotValidError as e:
        return jsonify({"error": f"Invalid email format: {str(e)}"}), 400
    
    
    if len(data["password"]) < 4:
        return jsonify({"error": "Password must be at least 4 characters long"}), 400
    
   
    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already exists"}), 400
    

    hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt())

 
    new_user = {
        "username": data["username"],
        "userid": data["userid"],
        "email": data["email"],
        "password": hashed_password,  
        "userGender": data["userGender"]
    }

    result = users_collection.insert_one(new_user)
    return jsonify({"message": "User added successfully", "id": str(result.inserted_id)}), 201

#login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if "email" not in data or "password" not in data:
        return jsonify({"error": "Email and password are required"}), 400

    user = users_collection.find_one({"email": data["email"]})
    
    if user and bcrypt.checkpw(data["password"].encode('utf-8'), user["password"]):
        return jsonify({"message": "Login successful", "username": user["username"]}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

if __name__ == '__main__':
    app.run(debug=True)