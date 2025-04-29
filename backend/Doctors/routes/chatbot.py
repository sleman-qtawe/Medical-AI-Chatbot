from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Gemini Pro Setup
genai.configure(api_key='AIzaSyCuz7VK0DU7EtdmMHhNidccJfU36j6CADs')  # <-- Your Gemini API Key
gemini_model = genai.GenerativeModel('models/gemini-1.5-pro')
models = genai.list_models()

for model in models:
    print(model.name, "-", model.supported_generation_methods)

# Fetch business data from GBooking API
def fetch_business_data():
    try:
        url = "https://apiv2.gbooking.ru/rpc"
        headers = {'Content-Type': 'application/json'}
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "cred": {
                "token": "9503d8c38fcc56d66a6521a4c8cb936e8d9d2b98",
                "user": "67e16ca737b5a2a807677e83"
            },
            "method": "business.get_profile_by_id",
            "params": {
                "business": {
                    "id": "4000000008541"  # ID for the business
                },
                "with_networks": True,
                "worker_sorting_type": "workload"
            }
        }
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            raise ValueError(f"Failed to fetch data. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error in fetch_business_data: {str(e)}")
        return {"error": "Failed to fetch business data."}

# Extract department names and IDs
def get_departments_and_ids(business_data):
    try:
        departments = []
        if 'result' in business_data and 'networks' in business_data['result']:
            networks = business_data['result']['networks']
            for network in networks:
                if 'businessName' in network and 'internalID' in network:
                    departments.append({
                        "name": network.get('businessName'),
                        "id": network.get('internalID')  # استخدام internalID
                    })
                    print(f"Department name: {network.get('businessName')}, id: {network.get('internalID')}")

        return departments
    except Exception as e:
        print(f"Error in get_departments_and_ids: {str(e)}")
        return []
    
# Match department name with its ID
def get_selected_department_id(departments, selected_name):
    for dept in departments:
         if dept["name"].strip() == selected_name.strip():
            print(f"Selected department: {dept['name']} -> ID: {dept['id']}")
            return dept["id"]
    print("No matching department found.")
    return None




# Extract department roles (workers) based on department ID
def get_department_roles(department_id):
    try:
        url = "https://apiv2.gbooking.ru/rpc"
        headers = {'Content-Type': 'application/json'}
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "cred": {
                "token": "9503d8c38fcc56d66a6521a4c8cb936e8d9d2b98",
                "user": "67e16ca737b5a2a807677e83"
            },
            "method": "department.get_workers_by_department_id",
            "params": {
                "department_id": department_id
            }
        }
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            data = response.json()
            if 'result' in data and 'workers' in data['result']:
                return data['result']['workers']  # Return list of workers (roles)
        else:
            raise ValueError(f"Failed to fetch data. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error in get_department_roles: {str(e)}")
        return []

# Gemini chat logic
def get_gemini_response(user_message):
    business_data = fetch_business_data()
    departments = get_departments_and_ids(business_data)
    
    # نسحب فقط أسماء الأقسام من القائمة
    department_names = [d["name"] for d in departments]
    
    # Gemini prompt to suggest departments
    prompt = (
        "You are a smart assistant working for a medical center. "
        f"Please ask the user to choose one of the following departments: {department_names}. "
        "Once the user chooses, confirm the choice and proceed."
        f"\n\nUser: {user_message}"
    )

    # استخراج رد المساعد
    response = gemini_model.generate_content(prompt)
    print(f"Gemini Response: {response.text}")

    # محاولة استخراج اسم القسم من رد المستخدم:
    selected_id = get_selected_department_id(departments, user_message)
    if selected_id:
        print(f"Selected department ID: {selected_id}")
        # هنا يمكنك استخدام selected_id لاحقًا مثلاً لجلب المواعيد
    else:
        print("Department not found in list.")

    return response.text


# Handle all messages through Gemini
def get_bot_response(user_message):
    return get_gemini_response(user_message)

# Main chat endpoint
@app.route('/chat', methods=['POST'])
def chat_handler():
    try:
        data = request.get_json()
        message = data.get('message')
        if not message:
            return jsonify({'error': 'Message is required'}), 400

        response = get_bot_response(message)
        return jsonify({'response': response})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500

# Endpoint to get roles for a department
@app.route('/get_roles', methods=['POST'])
def get_roles_handler():
    try:
        data = request.get_json()
        department_id = data.get('department_id')  # Get the selected department ID
        if not department_id:
            return jsonify({'error': 'Department ID is required'}), 400
        
        # Fetch the roles (workers) for the selected department
        roles = get_department_roles(department_id)
        if not roles:
            return jsonify({'error': 'No available roles found for this department'}), 404
        
        return jsonify({'roles': roles})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
