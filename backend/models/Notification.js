import mongoose from 'mongoose';

/**
 * Notification Schema
 * Created server-side whenever complaint status changes
 * Students can mark individual or all notifications as read
 */
const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      default: null,
    },
    type: {
      type: String,
      enum: ['status_change', 'assigned', 'resolved', 'closed', 'general'],
      default: 'general',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
