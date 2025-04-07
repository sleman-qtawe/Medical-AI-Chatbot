import os
from flask_pymongo import PyMongo
from dotenv import load_dotenv

load_dotenv()  

def init_db(app):
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    mongo = PyMongo(app)
    return mongo
