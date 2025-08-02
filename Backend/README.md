# 🏨 Hotel Booking Backend API

A **Node.js + Express** backend for hotel bookings with JWT authentication, role-based access, and Swagger documentation.

## 🌟 Features

### User Auth
- Register/login with JWT
- Password hashing (bcrypt)

### Hotel Management
- Add/update hotels & rooms
- Image uploads (Cloudinary)

### Booking System
- Check availability
- Create/cancel bookings

### Recent Searches
- Track user search history

### Admin Controls
- Role-based permissions (user/admin)

## 🛠️ Tech Stack

| Layer       | Technology               |
|-------------|--------------------------|
| **Backend** | Node.js, Express         |
| **Database**| MongoDB Atlas            |
| **Auth**    | JWT, bcryptjs            |
| **Storage** | Cloudinary (images)      |
| **Docs**    | Swagger (OpenAPI 3.0)    |

## 🔌 API Endpoints

**Base URL**: `http://localhost:3000/api`

| Category  | Endpoints                |
|-----------|--------------------------|
| Auth      | `POST /user/register`<br>`POST /user/login` |
| Hotels    | `GET /hotels`<br>`POST /hotels` (Admin) |
| Rooms     | `GET /rooms`<br>`POST /rooms` (Owner) |
| Bookings  | `POST /bookings/book`<br>`GET /bookings/user` |

📌 **Protected routes require JWT in headers**:
```http
Authorization: Bearer <your_token>


🚀 Quick Start
1. Clone & Install

git clone https://github.com/your-repo/hotel-booking.git
cd hotel-booking/Backend
npm install


2. Configure Environment
Create .env file:

MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000


3. Run the Server

npm start

4. Access APIs
Backend: http://localhost:3000/api

Swagger Docs: http://localhost:3000/api-docs

📚 Documentation
Explore the interactive Swagger UI for:

Full endpoint details

Request/response examples

Live API testing

🔗 Local Swagger Docs

📂 Project Structure

Backend/
├── configs/          # DB, Cloudinary, etc.
├── controllers/      # Route handlers
├── models/           # MongoDB schemas
├── routes/           # Express routes
├── middleware/       # Auth, uploads
├── docs/
│   └── swagger.yaml  # API specs
├── server.js         # Entry point
└── README.md

🛡️ Security Notes
Passwords hashed with bcrypt

JWT tokens expire after 24h

Admin routes protected by role checks

📝 License
MIT © MIT


