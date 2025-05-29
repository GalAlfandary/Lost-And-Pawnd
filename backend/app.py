from quart import Quart, request, jsonify
import json
from supabase import create_client, Client
from compare import compare_pet_to_many

# Load secrets once at startup
with open('./secrets2.json', 'r') as f:
    secrets = json.load(f)

url = secrets["SUPABASE_URL_KEY"]
key = secrets["SUPABASE_ANON_KEY_SEC"]

supabase: Client = create_client(url, key)

app = Quart(__name__)

@app.route('/is_alive', methods=['GET'])
async def is_alive():
    return jsonify({"status": "Server is up"}), 200

@app.route('/compare', methods=['POST'])
async def compare():
    data = await request.get_json()

    if not data or 'pet_name' not in data or 'pet_picture' not in data or 'postid' not in data or 'userid' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    pet_name = data['pet_name']
    pet_picture = data['pet_picture']
    postid = data['postid']
    userid = data['userid']

    is_lost = data.get("lost") 
    # find out if THIS post is lost or pawnd
    if is_lost is None:
        resp = supabase.table('posts').select('lost').eq('postid', postid).single().execute()
        if not resp.data: 
            return jsonify({"error": "Cannot read post type"}), 500
        is_lost = resp.data['lost']

    # fetch ONLY opposite-type, still-existing posts 
    other_resp = (
        supabase.table('posts')
        .select('postid, imageurl, petname, userid')
        .eq('lost', not is_lost)          # opposite group
        .neq('postid', postid)            # skip self
        .execute()
    )
    other_pets = other_resp.data or []
    if not other_pets:
        return jsonify({"message": "No opposite-type posts to compare"}), 200


    # assemble the “new_pet” record 
    new_pet = dict(
        imageurl = pet_picture,
        petname  = pet_name,
        postid   = postid,
        userid   = userid,
    )
    
    result = await compare_pet_to_many(new_pet, other_pets)

    return jsonify({ "result": result }), 200

if __name__ == '__main__':
    app.run(debug=True)
