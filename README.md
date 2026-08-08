# 🏫 Hostel Complaint Portal

A **production-ready, full-stack MERN application** for managing hostel complaints in a college environment. Built with React, Node.js, Express, MongoDB Atlas, JWT authentication, and Multer file uploads.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (free tier works)

---

### 2. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user with read/write access
4. Whitelist your IP (or `0.0.0.0/0` for development)
5. Get your connection string: `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/hostel_portal`

---

### 3. Backend Setup

```bash
cd backend

# Edit .env — replace MONGO_URI with your Atlas connection string
notepad .env

# Install dependencies
npm install

# Start development server
npm run dev
```

The backend will start at **http://localhost:5000**

> ✅ On first run, a default admin account is auto-created:  
> **Email:** admin@hostel.edu  
> **Password:** Admin@123456

---

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at **http://localhost:5173**

---

## 🔑 Default Credentials

| Role    | Email               | Password      |
|---------|---------------------|---------------|
| Admin   | admin@hostel.edu    | Admin@123456  |
| Student | Register yourself   | —             |

---

## 📁 Project Structure

```
hostel-complaint-portal/
├── backend/
│   ├── config/db.js              # MongoDB Atlas connection
│   ├── controllers/              # Business logic (MVC)
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   ├── adminController.js
│   │   ├── dashboardController.js
│   │   └── notificationController.js
│   ├── middleware/               # JWT, admin guard, Multer, error handler
│   ├── models/                   # Mongoose schemas (User, Complaint, Notification)
│   ├── routes/                   # Express route definitions
│   ├── uploads/                  # File storage (complaints/, profiles/)
│   ├── .env                      # Environment variables
│   └── server.js                 # Express app entry point
│
└── frontend/
    └── src/
        ├── components/           # Reusable UI components
        ├── context/AuthContext.jsx
        ├── layouts/AppLayout.jsx
        ├── pages/
        │   ├── public/           # Home, Login, Register, About, Contact, 404
        │   ├── student/          # Dashboard, Complaints, Profile, Notifications
        │   └── admin/            # Dashboard, Complaints, Students, Reports
        ├── services/             # Axios API calls
        └── utils/helpers.js      # Utility functions
```

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint                   | Access    |
|--------|----------------------------|-----------|
| POST   | /api/auth/register         | Public    |
| POST   | /api/auth/login            | Public    |
| GET    | /api/auth/profile          | Protected |
| PUT    | /api/auth/profile          | Protected |
| PUT    | /api/auth/change-password  | Protected |

### Complaints (Student)
| Method | Endpoint                    | Access    |
|--------|-----------------------------|-----------|
| POST   | /api/complaints             | Protected |
| GET    | /api/complaints             | Protected |
| GET    | /api/complaints/stats       | Protected |
| GET    | /api/complaints/:id         | Protected |
| PUT    | /api/complaints/:id         | Protected |
| DELETE | /api/complaints/:id         | Protected |

### Admin
| Method | Endpoint                          | Access |
|--------|-----------------------------------|--------|
| GET    | /api/admin/dashboard              | Admin  |
| GET    | /api/admin/complaints             | Admin  |
| PUT    | /api/admin/complaints/:id/status  | Admin  |
| DELETE | /api/admin/complaints/:id         | Admin  |
| GET    | /api/admin/students               | Admin  |
| PUT    | /api/admin/students/:id/status    | Admin  |

### Notifications
| Method | Endpoint                      | Access    |
|--------|-------------------------------|-----------|
| GET    | /api/notifications            | Protected |
| PUT    | /api/notifications/read-all   | Protected |
| PUT    | /api/notifications/:id/read   | Protected |

---

## 🎨 Features

### Student
- ✅ Register / Login / Logout
- ✅ Edit profile + upload profile picture
- ✅ Change password
- ✅ File complaints with image upload
- ✅ View, filter, search complaints
- ✅ Track complaint status (visual timeline)
- ✅ Delete/view complaints
- ✅ Real-time notifications (auto-polls every 30s)

### Admin
- ✅ Dashboard with charts (Recharts)
- ✅ Manage all complaints with full search/filter
- ✅ Update status + assign + add comments
- ✅ Notifications auto-sent to student on status change
- ✅ Student management (enable/disable accounts)
- ✅ Reports with bar charts and pie charts

---

## 🔒 Security
- JWT tokens with 7-day expiry
- bcrypt password hashing (12 salt rounds)
- Helmet.js HTTP security headers
- CORS restricted to frontend origin
- Protected routes (backend + frontend)
- Role-based authorization
- File type + size validation on uploads
- MongoDB injection protection via Mongoose

---

## 🚢 Deployment

### Backend → Render / Railway
1. Push code to GitHub
2. Create new Web Service on Render
3. Set environment variables (copy from `.env`)
4. Set start command: `node server.js`

### Frontend → Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Set `VITE_API_URL=https://your-backend-url.onrender.com/api`
4. Deploy

### MongoDB → Atlas
Already configured for cloud — just update `MONGO_URI` in production env vars.

---

## 🛠 Tech Stack
| Layer       | Technology                    |
|-------------|-------------------------------|
| Frontend    | React 18, Vite, React Router  |
| HTTP Client | Axios                         |
| Charts      | Recharts                      |
| Toasts      | react-hot-toast               |
| Backend     | Node.js, Express.js           |
| Database    | MongoDB Atlas, Mongoose       |
| Auth        | JWT, bcrypt.js                |
| File Upload | Multer                        |
| Security    | Helmet, CORS                  |

---

## 📞 Support

For issues or feature requests, file a complaint through the portal itself! 😄
