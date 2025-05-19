from flask import Flask, request, jsonify, session
from flask_cors import CORS, cross_origin
import google.generativeai as genai
import requests
from dotenv import load_dotenv
import os
import re

load_dotenv()



genai.configure(api_key='AIzaSyCuz7VK0DU7EtdmMHhNidccJfU36j6CADs')
gemini_model = genai.GenerativeModel('models/gemini-1.5-pro')

businesses = [
    {"id": "4000000008541", "name": "30040 - קרדיולוגיה"},
    {"id": "4000000008542", "name": "31200 - גסטרואנטרולוגיה"},
    {"id": "4000000008543", "name": "30300 - נוירולוגיה"},
    {"id": "4000000008544", "name": "46350 - CT"}
]

taxonomies = dict()

def get_businesses_handler():
    return jsonify(businesses)

   



def select_business_handler():
    data = request.get_json()
    business_id = data.get("business_id")
    print(f"the saved business id : {business_id} ")
    session['business_id'] = business_id
    print("Session contents:", session)
    print(f"the session business id : {business_id} ")
    return jsonify({"message": f"Selected business {business_id} saved in session."})


def get_checkups_handler():
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight successful"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response, 200

    print("Session contents:", session)
    business_id = request.json.get("business_id")
    print(f"the saved business id : {business_id}")
    if not business_id:
        return jsonify({"error": "No business selected"}), 400

    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "cred": {
            "token": "9503d8c38fcc56d66a6521a4c8cb936e8d9d2b98",
            "user": "67e16ca737b5a2a807677e83"
        },
        "method": "business.get_profile_by_id",
        "params": {
            "business": {"id": business_id},
            "with_networks": True,
            "worker_sorting_type": "workload"
        }
    }

    response = requests.post("https://apiv2.gbooking.ru/rpc", json=payload, headers={"Content-Type": "application/json"})

    if response.status_code == 200:
        try:
            data = response.json()
            taxonomies = data["result"]["business"]["taxonomies"]
            doctors = data["result"]["business"]["resources"]

            result = []
            seen_names = []
            doctors_result = []

            for item in taxonomies:
                name = item.get("alias", {}).get("he-il")

                if not name or not re.search(r'[A-Za-zא-ת]', name):
                    continue

                taxonomy_id = item.get("id")

                if name and taxonomy_id and name not in seen_names:
                    result.append({
                        "id": taxonomy_id,
                        "name": name
                    })
                    seen_names.append(name)

            for doctor in doctors:
                doctor_id = doctor.get("id")
                doctor_name = doctor.get("nickname")
                if doctor_name and doctor_id not in doctors:
                    doctors_result.append({
                        "id": doctor_id,
                        "name": doctor_name
                    })
            taxonomies = result

            print(f"The taxonomies list is in the func {taxonomies}")
            print(f"The doctors list is in the func {doctors_result}")

            return jsonify({"checkups": result})

        except KeyError:
            return jsonify({"error": "Taxonomies not found"}), 500
    else:
        return jsonify({"error": f"Request failed with status code {response.status_code}"}), response.status_code


def get_slots_handler():
    data = request.get_json()
    business_id = data.get("business_id")
    selected_taxonomy_id = data.get("taxonomy_id")

    if not business_id or not selected_taxonomy_id:
        return jsonify({"error": "Missing parameters"}), 400

    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "cred": {
            "token": "9503d8c38fcc56d66a6521a4c8cb936e8d9d2b98",
            "user": "67e16ca737b5a2a807677e83"
        },
        "method": "business.get_profile_by_id",
        "params": {
            "business": {"id": business_id},
            "with_networks": True,
            "worker_sorting_type": "workload"
        }
    }
    response = requests.post("https://apiv2.gbooking.ru/rpc", json=payload, headers={"Content-Type": "application/json"})
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch data"}), response.status_code

    data = response.json()
    doctors = data["result"]["business"]["resources"]

    matching_doctors = [doc for doc in doctors if selected_taxonomy_id in doc.get("taxonomies", [])]

    url = "https://cracslots.gbooking.ru/rpc"
    headers = {"Content-Type": "application/json"}
    slots_results = []

    for doctor in matching_doctors:
        doctor_id = doctor["id"]
        doctor_name = doctor.get("nickname", "Unknown Doctor")

        payload_slots = {
            "jsonrpc": "2.0",
            "id": 1,
            "cred": {
                "token": "9503d8c38fcc56d66a6521a4c8cb936e8d9d2b98",
                "user": "67e16ca737b5a2a807677e83"
            },
            "method": "CracSlots.GetCRACResourcesAndRooms",
            "params": {
                "business": {
                    "id": business_id,
                    "widget_configuration": {
                        "cracServer": "CRAC_PROD3",
                        "mostFreeEnable": True
                    },
                    "general_info": {
                        "timezone": "Asia/Jerusalem"
                    }
                },
                "filters": {
                    "resources": [{"id": doc["id"], "duration": 30} for doc in matching_doctors],
                    "taxonomies": [selected_taxonomy_id],
                    "rooms": [],
                    "date": {
                        "from": "2025-05-15T00:00:00.000Z",
                        "to": "2025-05-30T00:00:00.000Z"
                    }
                }
            }
        }

        resp_slots = requests.post(url, json=payload_slots, headers=headers)
        if resp_slots.status_code == 200:
            resp_data = resp_slots.json()
            slot_days = resp_data.get("result", {}).get("slots", [])
            times = []
            for day in slot_days:
                date_str = day.get("date", "").split("T")[0]
                for resource in day.get("resources", []):
                    if resource.get("resourceId") != doctor_id:
                        continue
                    for slot in resource.get("cutSlots", []):
                        if slot.get("available") is True:
                            start_hours = int(slot["start"]) // 60
                            start_minutes = int(slot["start"]) % 60
                            time_str = f"{start_hours:02d}:{start_minutes:02d}"
                            times.append({"date": date_str, "time": time_str})
            slots_results.append({
                "doctor_id": doctor_id,
                "doctor_name": doctor_name,
                "slots": times
            })
        else:
            slots_results.append({
                "doctor_id": doctor_id,
                "doctor_name": doctor_name,
                "slots": [],
                "error": "Failed to fetch slots"
            })

    return jsonify({"slots": slots_results})


##@app.route("/send-message", methods=["POST", "OPTIONS"])
##@cross_origin()
def send_message():
    if request.method == "OPTIONS":
        # CORS preflight response
        response = jsonify({"message": "CORS preflight successful"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response, 200

    data = request.get_json()
    message = data.get("message")
    if not message:
        return jsonify({"response": "No message provided."}), 400

    try:
        response = gemini_model.generate_content(message)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"}), 500

##@app.route("/business-profile", methods=["GET"])
def business_profile():
    business_id = session.get("business_id")
    if not business_id:
        return jsonify({"error": "No business selected"}), 400
    data = fetch_business_data(business_id)
    return jsonify(data)

def fetch_business_data(business_id):
    # Dummy function simulating GBooking API data
    return {
        "id": business_id,
        "name": next((b["name"] for b in businesses if b["id"] == business_id), "Unknown"),
        "description": "This is a sample business profile.",
        "services": ["Service 1", "Service 2", "Service 3"],
    }

def get_gemini_response(user_message):
    business_id = session.get("business_id")
    if not business_id:
        return "Please select a business before proceeding."

    business_data = fetch_business_data(business_id)

    department_names = [b["name"] for b in businesses]
    department_list_str = ", ".join(department_names)

    prompt = (
        "You are a smart assistant for a medical center. "
        f"The available departments are: {department_list_str}. "
        "If the user wants to book an appointment, ask them to choose one of these departments. "
        f"\n\nUser: {user_message}"
    )

    response = gemini_model.generate_content(prompt)
    print(f"Gemini Response: {response.text}")
    return response.text

##@app.route("/chat", methods=["POST"])
def chat_handler():
    try:
        data = request.get_json()
        message = data.get('message')
        if not message:
            return jsonify({'error': 'Message is required'}), 400

        response = get_gemini_response(message)
        return jsonify({'response': response})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500
