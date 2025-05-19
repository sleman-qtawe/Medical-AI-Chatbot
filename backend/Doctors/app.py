from flask import Flask 
from flask_cors import CORS , cross_origin
from utils.db import init_db
from routes.doctors import register_doctor_routes
from routes.users import register_user_routes
from routes.chatbot import  get_businesses_handler , select_business_handler, get_checkups_handler , get_slots_handler
from routes.login import login_handler, verify_otp_handler
from routes.appointments import book_appointment_handler, cancel_appointment_handler
import os


app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "super-secret-key")
app.config['SESSION_COOKIE_NAME'] = 'my_session_cookie'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False  
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  


CORS(app,
     origins=["http://localhost:5173"], 
     supports_credentials=True,
     methods=["GET", "POST", "OPTIONS"],
     )


# Init DB
mongo = init_db(app)
db = mongo.db

# Register routes
register_doctor_routes(app, db)
register_user_routes(app, db)


# Add login routes manually
@app.route('/login', methods=['POST'])
def login():
    return login_handler(db)

@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    return verify_otp_handler(db)


@app.route('/businesses', methods=['GET'])
def get_businesses():
    return get_businesses_handler()

@app.route("/checkups", methods=["POST", "OPTIONS"])
@cross_origin(supports_credentials=True)
def get_checkups():
    return get_checkups_handler()


@app.route('/select-business', methods=['POST'])
def select_business():
    return select_business_handler()

@app.route('/slots', methods=['POST'])
def get_slots():
    return get_slots_handler()

@app.route('/book-appointment', methods=['POST'])
@cross_origin(supports_credentials=True)
def book_appointment():
    return book_appointment_handler(db)

@app.route('/cancel-appointment', methods=['POST'])
@cross_origin(supports_credentials=True)
def cancel_appointment():
    return cancel_appointment_handler(db)

if __name__ == "__main__":
    app.run(debug=True)