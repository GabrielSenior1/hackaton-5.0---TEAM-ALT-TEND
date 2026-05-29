from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer()

# Try to initialize Firebase Admin SDK automatically.
# In a local dev environment without Service Account JSON, this might fail or not work for token verification,
# but verify_id_token only requires the project ID which it infers from the token itself or default app.
try:
    if not firebase_admin._apps:
        firebase_admin.initialize_app()
except Exception as e:
    logger.warning(f"No se pudo inicializar Firebase Admin SDK por defecto: {e}")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verifica el token JWT enviado por el cliente (Firebase Auth).
    Si el token es válido, retorna los datos decodificados del usuario (uid, email, etc.).
    """
    token = credentials.credentials
    try:
        # En entornos de hackathon/desarrollo local sin credenciales completas, 
        # podríamos aceptar un token de prueba si fuera necesario.
        if token == "mock-token-123":
            logger.warning("Usando mock-token-123 para propósitos de prueba local.")
            return {"uid": "mock-user-123", "email": "admin@kanku.com"}
            
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        logger.error(f"Error verificando token de autenticación: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Autenticación inválida o token expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        )
