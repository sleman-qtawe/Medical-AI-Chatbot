from flask import Flask
from flask_cors import CORS
from utils.db import init_db
from routes.doctors import register_doctor_routes
from routes.users import register_user_routes
from routes.login import check_valid_email


app = Flask(__name__)
CORS(app)

mongo = init_db(app)
db = mongo.db

register_doctor_routes(app, db)
register_user_routes(app, db)
check_valid_email(app, db)  
if __name__ == '__main__':
    app.run(debug=True)
