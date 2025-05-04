


# Create python environment
```
python -m venv venv
```

# Activate environment
```
cd backend
source venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt

```

# Launch script
```
python test-1.py
```

# Launch Flask server
```
python app.py
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

