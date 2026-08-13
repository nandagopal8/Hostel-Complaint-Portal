import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Admin seeder
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─── Connect to MongoDB Atlas ────────────────────────────────────────────────
connectDB().then(() => seedAdmin());

// ─── Security & Parsing Middleware ──────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow static file serving
  })
);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps, curl)
      if (!origin) return callback(null, true);

      const allowed = [
        'http://localhost:5173',
        'http://localhost:3000',
      ];

      // Add CLIENT_URL from env if provided
      if (process.env.CLIENT_URL) {
        allowed.push(process.env.CLIENT_URL.replace(/\/$/, '')); // strip trailing slash
      }

      const cleanOrigin = origin.replace(/\/$/, ''); // strip trailing slash

      if (
        allowed.includes(cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app') ||
        cleanOrigin.endsWith('.onrender.com')
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS not allowed for: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ─── Static Files (Uploaded Images) ─────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ─── Error Handling ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Admin Seeder ────────────────────────────────────────────────────────────
/**
 * Creates a default admin user on first run if none exists.
 * Credentials are read from .env (ADMIN_EMAIL / ADMIN_PASSWORD)
 */
async function seedAdmin() {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Super Admin',
        email: process.env.ADMIN_EMAIL || 'admin@hostel.edu',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin',
        isActive: true,
      });
      console.log('✅ Default admin account created');
      console.log(`   Email:    ${process.env.ADMIN_EMAIL || 'admin@hostel.edu'}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    }
  } catch (err) {
    console.error('Admin seed error:', err.message);
  }
}

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});
