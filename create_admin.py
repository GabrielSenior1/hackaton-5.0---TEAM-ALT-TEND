import requests

API_KEY = "AIzaSyACqc7-okw0dPfOU9CkTSL8ZECEZAwKazI"
email = "admin@kanku.com"
password = "admin125"

# Try to create user
res = requests.post(f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={API_KEY}", json={
    "email": email,
    "password": password,
    "returnSecureToken": True
})
data = res.json()

if "error" in data and data["error"]["message"] == "EMAIL_EXISTS":
    print("User exists, logging in...")
    res = requests.post(f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}", json={
        "email": email,
        "password": password,
        "returnSecureToken": True
    })
    data = res.json()

if "localId" in data:
    print("Auth success for", data["localId"])
    id_token = data["idToken"]
    local_id = data["localId"]
    
    firestore_url = f"https://firestore.googleapis.com/v1/projects/kanku-635ca/databases/(default)/documents/vendedores/{local_id}"
    doc = {
        "fields": {
            "email": {"stringValue": email},
            "nombreMarca": {"stringValue": "Administrador"},
            "rol": {"stringValue": "admin"}
        }
    }
    # Update document in firestore
    f_res = requests.patch(firestore_url, headers={"Authorization": f"Bearer {id_token}"}, json=doc)
    print("Firestore update status:", f_res.status_code)
else:
    print("Failed to authenticate:", data)
