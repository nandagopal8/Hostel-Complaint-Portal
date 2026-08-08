import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getStudentStats,
} from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadComplaintImage, handleMulterError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All complaint routes require authentication
router.use(protect);

router.get('/stats', getStudentStats);
router
  .route('/')
  .get(getMyComplaints)
  .post(handleMulterError(uploadComplaintImage), createComplaint);

router
  .route('/:id')
  .get(getComplaintById)
  .put(handleMulterError(uploadComplaintImage), updateComplaint)
  .delete(deleteComplaint);

export default router;
