import jwt
import datetime
import os
from functools import wraps
from flask import request, jsonify
from dotenv import load_dotenv

load_dotenv()

# Set JWT_SECRET_KEY in a .env file (or your environment) for production use.
# Falls back to a dev-only key so the app still runs out of the box.
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'dev-only-insecure-key-change-me')
TOKEN_EXPIRATION_HOURS = 24

def generate_token(user_id, username, email):
    payload = {
        'user_id': user_id,
        'username': username,
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=TOKEN_EXPIRATION_HOURS),
        'iat': datetime.datetime.utcnow()
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        payload = decode_token(token)
        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        return f(payload, *args, **kwargs)
    
    return decorated