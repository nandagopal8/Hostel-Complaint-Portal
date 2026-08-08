import express from 'express';
import {
  getDashboardStats,
  getAllComplaints,
  updateComplaintStatus,
  adminDeleteComplaint,
  getAllStudents,
  toggleStudentStatus,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All admin routes: must be authenticated AND admin
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/students', getAllStudents);
router.put('/students/:id/status', toggleStudentStatus);
router.get('/complaints', getAllComplaints);
router.put('/complaints/:id/status', updateComplaintStatus);
router.delete('/complaints/:id', adminDeleteComplaint);

export default router;
