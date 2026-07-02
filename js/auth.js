window.ElegAuth = (function () {
    const API_BASE = 'http://localhost:5001/api';
    const TOKEN_KEY = 'elegante_token';
    const USER_KEY = 'elegante_user';
 
    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }
 
    function getUser() {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    }
 
    function saveSession(token, user) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
 
    function clearSession() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
 
    async function register(username, email, password) {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
            saveSession(data.token, data.user);
        }
        return { ok: res.ok, data };
    }
 
    async function login(email, password) {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
            saveSession(data.token, data.user);
        }
        return { ok: res.ok, data };
    }
 
    async function checkAuth() {
        const token = getToken();
        if (!token) return null;
 
        try {
            const res = await fetch(`${API_BASE}/check-auth`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) {
                clearSession();
                return null;
            }
            const data = await res.json();
            return data.authenticated ? data.user : null;
        } catch (err) {
            // Backend not reachable — treat as logged out rather than throwing
            return null;
        }
    }
 
    function logout() {
        clearSession();
    }
 
    return { register, login, checkAuth, logout, getUser, getToken };
})();
 