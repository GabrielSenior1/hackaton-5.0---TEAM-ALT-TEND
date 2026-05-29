from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware to add common security headers to all responses.
    Implements OWASP recommended headers.
    """

    async def dispatch(self, request, call_next):
        response: Response = await call_next(request)
        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"
        # Clickjacking protection
        response.headers["X-Frame-Options"] = "DENY"
        # Referrer policy
        response.headers["Referrer-Policy"] = "no-referrer"
        # Content Security Policy – basic restrictive policy
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
        # HSTS – enforce HTTPS (only works when served over HTTPS)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        return response
