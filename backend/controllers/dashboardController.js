import Complaint from '../models/Complaint.js';

/**
 * @desc    Student dashboard statistics (called by complaintController.getStudentStats)
 * @route   GET /api/dashboard/stats
 * @access  Protected (Student)
 *
 * Separated here for future expansion (e.g., analytics, charts data)
 */
export const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const stats = await Complaint.aggregate([
      { $match: { student: studentId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const result = {
      total: 0,
      Pending: 0,
      Assigned: 0,
      'In Progress': 0,
      Resolved: 0,
      Closed: 0,
    };

    stats.forEach(({ _id, count }) => {
      result[_id] = count;
      result.total += count;
    });

    const recent = await Complaint.find({ student: studentId })
      .sort({ createdAt: -1 })
      .limit(5);

    const categoryBreakdown = await Complaint.aggregate([
      { $match: { student: studentId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({ stats: result, recentComplaints: recent, categoryBreakdown });
  } catch (error) {
    next(error);
  }
};
