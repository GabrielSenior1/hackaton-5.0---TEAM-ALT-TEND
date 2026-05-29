import requests

payload = {
    "items": [
        {"name": "Test", "description": "Desc", "price": 0, "quantity": 1}
    ],
    "comprador_email": "test@example.com",
    "success_url": "http://localhost:3000/success",
    "cancel_url": "http://localhost:3000/cancel",
    "metadata": {"test": "1"}
}

try:
    res = requests.post("http://localhost:8000/api/v1/pagos/checkout-cart", json=payload)
    print(res.status_code)
    print(res.text)
except Exception as e:
    print(e)
