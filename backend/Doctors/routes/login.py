from flask import request, jsonify
from twilio.rest import Client
import bcrypt
import traceback
from datetime import datetime, timedelta

def login_handler(db):
    client = Client('ACcaa5498d9e4283deee25955f480d1f43', 'f9e41816a59aacf0a37b9d3e40c4ffc5')
    otp_collection = db["otp_verifications"]
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    if email == 'admin@gmail.com' and password == '12345':
        return jsonify({
            "message": "Login success",
            "user": {
                "email": email,
                "name": "Admin",
                "role": 'admin'
            },
            "token": "admin_token",
            "verified": True
        }), 200

    user = db["patients"].find_one({'email': email})
    role = 'patient'

    if not user:
        user = db["doctors"].find_one({'email': email})
        role = 'doctor'

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    hashed_pw = user['password']
    if isinstance(hashed_pw, str):
        hashed_pw = hashed_pw.encode('utf-8')

    if not bcrypt.checkpw(password.encode('utf-8'), hashed_pw):
        return jsonify({"error": "Invalid credentials"}), 401

    phone = user.get("phone")
    if not phone:
        return jsonify({"error": "Phone number not found"}), 400

    if phone.startswith('0'):
        phone = '+972' + phone[1:]

    service = 'VA879b9c4bb6adc0206ece89c713a24511'

    try:
        # Clear any existing OTPs for this phone
        otp_collection.delete_many({"phone": phone})
        
        verification = client.verify.v2.services(service).verifications.create(
            to=phone, channel='sms'
        )
        
        otp_collection.insert_one({
            "email": email,
            "phone": phone,
            "sent_at": datetime.utcnow(),
            "used": False
        })

        return jsonify({
            "message": "OTP sent to your phone",
            "user": {
                "email": email,
                "phone": phone,  # Include phone in response
                "name": user.get("username", ""),
                "role": role,
                "_id": str(user.get("_id", ""))
            },
            "token": "pending_verification",
            "verified": False
        }), 200

    except Exception as e:
        print("[LOGIN] Error sending OTP:\n", traceback.format_exc())
        return jsonify({"error": "Failed to send OTP", "details": str(e)}), 500

def verify_otp_handler(db):
    client = Client('ACcaa5498d9e4283deee25955f480d1f43', 'f9e41816a59aacf0a37b9d3e40c4ffc5')
    otp_collection = db["otp_verifications"]
    data = request.get_json()

    phone = data.get('phone')
    code = data.get('code')
    service = 'VA879b9c4bb6adc0206ece89c713a24511'

    if not phone or not code:
        return jsonify({"error": "Missing phone or code"}), 400

    if phone.startswith('0'):
        phone = '+972' + phone[1:]

    # Check if there's a pending OTP for this phone
    pending_otp = otp_collection.find_one({
        "phone": phone,
        "used": False,
        "sent_at": {"$gt": datetime.utcnow() - timedelta(minutes=5)}
    })

    if not pending_otp:
        return jsonify({"error": "No pending OTP verification found or OTP expired"}), 400

    try:
        verification_check = client.verify.v2.services(service).verification_checks.create(
            to=phone, code=code
        )

        if verification_check.status == "approved":
            # Mark OTP as used
            otp_collection.update_one(
                {"_id": pending_otp["_id"]},
                {"$set": {"used": True, "verified_at": datetime.utcnow()}}
            )
            
            # Get user details
            user = db["patients"].find_one({"phone": phone}) or db["doctors"].find_one({"phone": phone})
            
            return jsonify({
                "message": "Verification successful",
                "user": {
                    "email": user["email"],
                    "name": user.get("username", ""),
                    "role": "patient" if "patients" in user else "doctor",
                    "_id": str(user["_id"])
                },
                "token": "verified_token",
                "verified": True
            }), 200
        else:
            return jsonify({"error": "Invalid or expired code"}), 400

    except Exception as e:
        print("[VERIFY] Error verifying OTP:\n", traceback.format_exc())
        return jsonify({"error": "OTP verification failed", "details": str(e)}), 500