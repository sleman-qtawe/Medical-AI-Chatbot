import os
from flask_pymongo import PyMongo
from dotenv import load_dotenv
from datetime import datetime
from bson import ObjectId

load_dotenv()  

def init_db(app):
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    mongo = PyMongo(app)
    return mongo


class Appointment:
    @staticmethod
    def create(db, data):
        appointment = {
            "business_id": data["business_id"],
            "doctor_id": data["doctor_id"],
            "taxonomy_id": data["taxonomy_id"],
            "date": datetime.strptime(data["date"], "%Y-%m-%d"),
            "time": data["time"],
            "user_id": ObjectId(data["user_id"]),
            "status": "confirmed",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        return db.appointments.insert_one(appointment)

    @staticmethod
    def cancel(db, appointment_id, user_id):
        return db.appointments.update_one(
            {"_id": ObjectId(appointment_id), "user_id": ObjectId(user_id)},
            {"$set": {"status": "cancelled", "updated_at": datetime.utcnow()}}
        )