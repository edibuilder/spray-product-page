# Elegante — Spray.Co
 
A responsive product landing page for a fragrance brand, with a Flask backend powering user accounts and a newsletter signup. Members get an automatic 20% discount applied to the product price after logging in.
 
## Features
 
- Parallax hero sections with scroll-triggered reveal animations
- Product gallery with thumbnail switching
- Countdown timer for a limited-time offer
- Cart & wishlist (persisted in `localStorage`)
- Customer reviews with a star-rating submission form (persisted in `localStorage`)
- Newsletter signup connected to a Flask API
- User registration / login (JWT-based) with an automatic 20% member discount applied to the price on login
- Fully responsive layout (desktop, tablet, mobile)
## Tech Stack
 
**Frontend**
- HTML5, CSS3 (custom properties / no framework)
- Vanilla JavaScript (no build step required)
- Google Fonts (Cormorant Garamond + Jost), Font Awesome icons
**Backend**
- Python 3, Flask
- Flask-CORS
- SQLite (via `sqlite3`)
- PyJWT for authentication tokens
- Werkzeug for password hashing
## Project Structure
 
```
project/
├── index.html
├── css/
│   ├── style.css
│   ├── product.css
│   ├── reviews.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── countdown.js
│   ├── scroll-animation.js
│   ├── product-gallery.js
│   ├── cart-wishlist.js
│   ├── reviews.js
│   ├── newsletter.js
│   ├── auth.js
│   └── auth-ui.js
├── images/
│   ├── home.jpg
│   ├── parfume1.png
│   ├── parfume2.png
│   └── parfume3.png
└── backend/
    ├── app.py
    ├── auth.py
    ├── database.py
    ├── requirements.txt
    ├── .env.example
    └── instance/
        └── spray.db        (created automatically on first run)
```
 
## Getting Started
 
### Prerequisites
 
- [Python 3.9+](https://www.python.org/downloads/)
- [VS Code](https://code.visualstudio.com/) with the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (or any static file server)
### 1. Clone the repository
 
```bash
git clone https://github.com/edibuilder/spray-product-page.git
cd spray-product-page
```
 
### 2. Set up and run the backend
 
```bash
cd backend
pip install -r requirements.txt
```
 
(Optional but recommended) create a `.env` file with your own secret key:
 
```bash
cp .env.example .env
```
Then open `.env` and replace the placeholder with a random string. If skipped, a dev-only fallback key is used automatically.
 
Start the server:
 
```bash
python app.py
```
 
You should see:
 
```
Database initialized successfully!
 * Running on http://127.0.0.1:5001
```
 
**Keep this terminal running** — it's the API server for login, registration, and the newsletter form. A SQLite database (`instance/spray.db`) is created automatically on first run.
 
### 3. Run the frontend
 
Open the project root folder in VS Code, right-click `index.html`, and select **"Open with Live Server"**. The site will open at an address like `http://127.0.0.1:5500/index.html`.
 
> The frontend must be served over `http://` (via Live Server or similar) — opening `index.html` directly as a `file://` path will block the API requests to the backend.
 
### 4. Try it out
 
- Create an account or sign in from the header — the product price automatically drops by an extra 20%
- Subscribe to the newsletter
- Add the product to your cart or wishlist
- Leave a review
## API Endpoints
 
| Method | Endpoint             | Description                          |
|--------|-----------------------|---------------------------------------|
| GET    | `/api/health`          | Health check                          |
| POST   | `/api/register`        | Create a new account                  |
| POST   | `/api/login`            | Log in and receive a JWT token        |
| GET    | `/api/check-auth`       | Validate a token (requires `Authorization: Bearer <token>`) |
| POST   | `/api/subscribe`        | Subscribe an email to the newsletter  |
 
## Notes
 
- The backend runs in Flask debug mode on port `5001` by default — this is intended for local development only.
- Cart, wishlist, and reviews are stored in the browser's `localStorage` and are not shared across devices.
- Passwords are hashed with Werkzeug before being stored; never commit `instance/spray.db` or `.env` with real secrets to version control.
