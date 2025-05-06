from flask import Flask, request, jsonify
import json
from supabase import create_client, Client
from compare import compare_pet_to_many

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

    if not data or 'pet_name' not in data or 'pet_picture' not in data or 'postid' not in data or 'userid' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    pet_name = data['pet_name']
    pet_picture = data['pet_picture']
    postid = data['postid']
    userid = data['userid']

    #all other posts
    response = supabase.table('posts').select('postid, imageurl, petname, userid').execute()
    posts = response.data

    if len(posts) < 1:
        return jsonify({"error": "Not enough posts"}), 500

    new_pet = {
        "imageurl": pet_picture,
        "petname": pet_name,
        "postid": postid,
        "userid": userid
    }
    
    # compare with  #all other posts 
    other_pets = [p for p in posts if p['postid'] != postid]

    result = compare_pet_to_many(new_pet, other_pets)

    return jsonify({ "result": result }), 200

if __name__ == '__main__':
    app.run(debug=True)
