from flask import Flask
from flask_cors import CORS
from utils.db import init_db
from routes.doctors import register_doctor_routes
from routes.users import register_user_routes
from routes.chatbot import chat_handler
from routes.login import login_handler, verify_otp_handler
import os

app = Flask(__name__)

# Setup CORS
frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
CORS(app, supports_credentials=True, resources={r"/*": {"origins": frontend_url}})

# Init DB
mongo = init_db(app)
db = mongo.db

# Register routes
register_doctor_routes(app, db)
register_user_routes(app, db)


# Add login routes manually
@app.route('/login', methods=['POST'])
def login():
    return login_handler()

@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    return verify_otp_handler()


@app.route('/chat', methods=['POST'])
def chat():
    return chat_handler()

if __name__ == '__main__':
    app.run(debug=False)
