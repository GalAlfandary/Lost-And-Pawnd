# utils.py
from supabase import create_client
import os
import json

with open('./secrets2.json', 'r') as f:
    secrets = json.load(f)

supabase = create_client(secrets["SUPABASE_URL_KEY"], secrets["SUPABASE_ANON_KEY_SEC"])

def add_alert(postid_1, user_1, postid_2, user_2, similarity):
    """
    Add a new alert row to the Supabase 'alerts' table.
    """
    try:
        supabase.table('alerts').insert([{
            "postid_1": postid_1,
            "user_1": user_1,
            "postid_2": postid_2,
            "user_2": user_2,
            "similarity": similarity
        }]).execute()
        print(f"✅ Alert inserted for users {user_1} and {user_2}")
    except Exception as e:
        print(f"❌ Error inserting alert: {e}")
