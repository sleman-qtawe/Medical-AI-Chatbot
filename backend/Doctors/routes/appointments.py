from flask import request, jsonify
from utils.db import Appointment
from bson import ObjectId
from datetime import datetime

def book_appointment_handler(db):
    try:
        data = request.get_json()

        required_fields = ["business_id", "doctor_id", "taxonomy_id", "date", "time", "user_id"]
        if not all(field in data for field in required_fields):
            return jsonify({KeyError}), 400

        result = Appointment.create(db, data)

        return jsonify({
            "appointment_id": str(result.inserted_id),
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e),
        }), 500

def cancel_appointment_handler(db):
    try:
        data = request.get_json()

        if not data.get("appointment_id") or not data.get("user_id"):
            return jsonify({
                "error": "Appointment ID and User ID are required",
            }), 400

        result = Appointment.cancel(db, data["appointment_id"], data["user_id"])

        if result.modified_count == 0:
            return jsonify({
                "error": "Appointment not found or not authorized",
            }), 404

        return jsonify({
            "message": "Appointment cancelled successfully",
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e),
        }), 500
