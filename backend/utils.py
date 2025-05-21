# utils.py
from supabase import create_client
import os
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

with open('./secrets2.json', 'r') as f:
    secrets = json.load(f)

supabase = create_client(secrets["SUPABASE_URL_KEY"], secrets["SUPABASE_ANON_KEY_SEC"])

def send_match_email(user_email, pet_name, match_pet_name, similarity):
    """
    Send an email notification about a pet match using Mailjet SMTP
    """
    try:
        print(f"\n📧 Attempting to send email to: {user_email}")
        print(f"📝 Email content:")
        print(f"   - Pet: {pet_name}")
        print(f"   - Matched with: {match_pet_name}")
        print(f"   - Similarity: {round(similarity * 100, 2)}%")

        # Create message
        msg = MIMEMultipart()
        msg['From'] = secrets["SMTP_EMAIL"]
        msg['To'] = user_email
        msg['Subject'] = '🐾 New Pet Match Found!'

        # Create HTML content
        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #4CAF50;">🐾 Pet Match Alert! 🐾</h2>
                <p>We found a potential match for your pet <strong>{pet_name}</strong>!</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3>Match Details:</h3>
                    <ul>
                        <li>Matched Pet: {match_pet_name}</li>
                        <li>Similarity Score: {round(similarity * 100, 2)}%</li>
                    </ul>
                </div>

                <p>Please log in to your Lost & Pawnd account to view the full details and contact the other pet owner.</p>
                
                <p style="margin-top: 30px;">Best regards,<br>Lost & Pawnd Team</p>
            </body>
        </html>
        """

        msg.attach(MIMEText(html, 'html'))

        print("🔌 Connecting to SMTP server...")
        # Connect to SMTP server
        server = smtplib.SMTP(secrets["SMTP_HOST"], secrets["SMTP_PORT"])
        server.starttls()
        print("🔑 Logging in to SMTP server...")
        server.login(secrets["SMTP_USER"], secrets["SMTP_PASSWORD"])
        
        print("📤 Sending email...")
        # Send email
        server.send_message(msg)
        server.quit()
        
        print(f"✅ Email successfully sent to {user_email}")
        return True
    except Exception as e:
        print(f"❌ Error sending email: {str(e)}")
        print(f"   SMTP Host: {secrets['SMTP_HOST']}")
        print(f"   SMTP Port: {secrets['SMTP_PORT']}")
        print(f"   From Email: {secrets['SMTP_EMAIL']}")
        return False

async def add_alert(postid_1, user_1, postid_2, user_2, similarity):
    """
    Add a new alert row to the Supabase 'alerts' table and send email notifications.
    """
    try:
        print("\n🔔 Starting add_alert function")
        print(f"📊 Alert details:")
        print(f"   - Post 1: {postid_1}")
        print(f"   - User 1: {user_1}")
        print(f"   - Post 2: {postid_2}")
        print(f"   - User 2: {user_2}")
        print(f"   - Similarity: {similarity}")

        # Insert alert into database
        print("💾 Inserting alert into database...")
        alert_result = supabase.table('alerts').insert([{
            "postid_1": postid_1,
            "user_1": user_1,
            "postid_2": postid_2,
            "user_2": user_2,
            "similarity": similarity
        }]).execute()
        
        print(f"✅ Alert inserted for users {user_1} and {user_2}")

        # Get pet and user details for email
        print("🔍 Fetching pet and user details...")
        post1 = supabase.table('posts').select('petname, userid').eq('postid', postid_1).single().execute()
        post2 = supabase.table('posts').select('petname, userid').eq('postid', postid_2).single().execute()
        
        user1 = supabase.table('users').select('email').eq('userid', user_1).single().execute()
        user2 = supabase.table('users').select('email').eq('userid', user_2).single().execute()

        print("📧 Sending emails to both users...")
        # Send emails to both users
        send_match_email(
            user1.data['email'],
            post1.data['petname'],
            post2.data['petname'],
            similarity
        )
        
        send_match_email(
            user2.data['email'],
            post2.data['petname'],
            post1.data['petname'],
            similarity
        )

    except Exception as e:
        print(f"❌ Error in add_alert: {str(e)}")
        print("Stack trace:")
        import traceback
        traceback.print_exc()
