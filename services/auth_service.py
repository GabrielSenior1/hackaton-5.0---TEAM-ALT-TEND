import os
from fastapi import Security, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth

# Inicializar Firebase Admin una sola vez
if not firebase_admin._apps:
    try:
        # En producción o si se tiene el JSON, usar credentials.Certificate('path/to/key.json')
        # Para desarrollo o Cloud Run, si GOOGLE_APPLICATION_CREDENTIALS está seteado, se inicializa por defecto
        # Para el propósito de este hackathon, podemos inicializarlo con credenciales por defecto 
        # asumiendo que el entorno tiene acceso, o si hay un error, lo registramos.
        # NOTA: Para validar JWT sin verificar contra el proyecto completo, a veces se requiere el Project ID.
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred, {
            'projectId': 'kanku-635ca',
        })
    except ValueError:
        # Si ApplicationDefault falla, inicializamos solo con el Project ID (suficiente para verificar firmas de JWT de Firebase)
        firebase_admin.initialize_app(options={'projectId': 'kanku-635ca'})
    except Exception as e:
        print(f"Error inicializando Firebase Admin: {e}")

security = HTTPBearer()

def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verifica el token JWT enviado en la cabecera Authorization: Bearer <token>.
    Devuelve un diccionario con la información del usuario si es válido.
    """
    token = credentials.credentials
    try:
        # verify_id_token comprueba la firma, expiración y audiencia
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido o expirado: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
