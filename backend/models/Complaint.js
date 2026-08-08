import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Complaint Schema
 * Tracks complaint lifecycle from Pending → Closed
 * complaintId is auto-generated as a short unique ID (e.g. CMP-abc12)
 */
const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      default: () => 'CMP-' + uuidv4().slice(0, 8).toUpperCase(),
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Electrical',
        'Plumbing',
        'Water Supply',
        'Wi-Fi / Internet',
        'Furniture',
        'Room Cleaning',
        'Washroom',
        'Mess / Food',
        'Security',
        'Others',
      ],
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
    hostelBlock: {
      type: String,
      required: [true, 'Hostel block is required'],
      enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'Other'],
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
    },
    complaintImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
      default: 'Pending',
    },
    assignedTo: {
      type: String, // Admin name or department
      default: '',
    },
    adminComment: {
      type: String,
      default: '',
      maxlength: [500, 'Admin comment cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

// Indexes for faster search/filter queries
complaintSchema.index({ student: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ hostelBlock: 1 });
complaintSchema.index({ createdAt: -1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
