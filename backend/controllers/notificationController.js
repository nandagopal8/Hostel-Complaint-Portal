import Notification from '../models/Notification.js';

/**
 * @desc    Get all notifications for the logged-in user
 * @route   GET /api/notifications
 * @access  Protected
 */
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false,
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark a single notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Protected
 */
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark all notifications as read for the current user
 * @route   PUT /api/notifications/read-all
 * @access  Protected
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper — creates a notification (used internally by admin controller)
 */
export const createNotification = async ({ userId, message, complaintId, type }) => {
  try {
    await Notification.create({ userId, message, complaintId, type });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};
