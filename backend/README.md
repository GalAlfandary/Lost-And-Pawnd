


# Create python environment
```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

```

# Activate environment
```
cd backend
source venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt

```

# Launch quart server
```
python app.py

#test with: http://127.0.0.1:5000/is_alive

```

# Test
```
POST to http://127.0.0.1:5000/compare
with body
{
  "pet_name": "Buddy",
  "pet_picture": "https://ozoffxmrvyanboydvakh.supabase.co/storage/v1/object/public/pet-images/pets/Lina-test-1-1746009697227.jpg"
}

```

