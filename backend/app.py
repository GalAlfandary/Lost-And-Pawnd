from flask import Flask, request, jsonify
import json
from supabase import create_client, Client
from compare import compare_pets, compare_pet_to_many

# Load secrets once at startup
with open('./secrets2.json', 'r') as f:
    secrets = json.load(f)

url = secrets["SUPABASE_URL_KEY"]
key = secrets["SUPABASE_ANON_KEY_SEC"]

supabase: Client = create_client(url, key)

app = Flask(__name__)

@app.route('/is_alive', methods=['GET'])
def is_alive():
    return jsonify({"status": "Server is up"}), 200

@app.route('/compare', methods=['POST'])
def compare():
    data = request.get_json()

    if not data or 'pet_name' not in data or 'pet_picture' not in data:
        return jsonify({"error": "Missing 'pet_name' or 'pet_picture' in request"}), 400

    pet_name = data['pet_name']
    pet_picture = data['pet_picture']

    try:
        
        response = supabase.table('posts').select('postid, imageurl, petname').execute()
        posts = response.data

        if len(posts) < 1:
            return jsonify({"error": "Not enough posts in the database"}), 500

        # Use pet info from request as post1
        new_pet = {
            "imageurl": pet_picture,
            "petname": pet_name
        }

        other_pets = posts[1:8] 

        result = compare_pet_to_many(new_pet, other_pets)


        return jsonify({
            "result": result
        }), 200

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
