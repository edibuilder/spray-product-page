from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from database import init_db, create_user, verify_user, subscribe_email, get_user_by_id
from auth import generate_token, token_required, decode_token

app = Flask(__name__)

CORS(app)

init_db()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Server is running'})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({'error': 'Username, email and password are required'}), 400
    
    if len(password) < 4:
        return jsonify({'error': 'Password must be at least 4 characters'}), 400
    
    result = create_user(username, email, password)
    
    if result['success']:
        token = generate_token(result['user_id'], username, email)
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': result['user_id'],
                'username': username,
                'email': email
            },
            'discount': 20,
            'message': 'Registration successful! You get 20% discount!'
        }), 201
    else:
        return jsonify({'error': result['error']}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    result = verify_user(email, password)
    
    if result['success']:
        token = generate_token(result['user_id'], result['username'], result['email'])
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': result['user_id'],
                'username': result['username'],
                'email': result['email']
            },
            'discount': 20,
            'message': f'Welcome back, {result["username"]}! You get 20% discount!'
        }), 200
    else:
        return jsonify({'error': result['error']}), 401

@app.route('/api/check-auth', methods=['GET'])
@token_required
def check_auth(payload):
    user = get_user_by_id(payload['user_id'])
    if user:
        return jsonify({
            'authenticated': True,
            'user': user,
            'discount': 20
        }), 200
    return jsonify({'authenticated': False}), 401

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    result = subscribe_email(email)
    
    if result['success']:
        return jsonify({
            'success': True,
            'message': 'Successfully subscribed to newsletter!'
        }), 200
    else:
        return jsonify({'error': result['error']}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')