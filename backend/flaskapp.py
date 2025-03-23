from flask import Flask,request,jsonify
import json
from flask_cors import CORS
from dotenv import dotenv_values
import os
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from pymongo import MongoClient
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"])

uri =''

client = MongoClient(uri, server_api=ServerApi('1'))

db = client.get_database("cluster0")

doctors_collection = db.doctors

@app.route('/get_doctors',methods=["GET"])
def get_doctors():
    return list(doctors_collection.find({}, {'_id': 0}))


@app.route('/add_doctor',methods=["POST"])
def add_doctor():
    doct = request.json
    doctors_collection.insert_one(doct)
    return list(doctors_collection.find({}, {'_id': 0}))
