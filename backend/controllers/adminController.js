import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';

/**
 * @desc    Admin dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Protected (Admin)
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalComplaints = await Complaint.countDocuments();

    // Status breakdown
    const statusAgg = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const statusStats = { Pending: 0, Assigned: 0, 'In Progress': 0, Resolved: 0, Closed: 0 };
    statusAgg.forEach(({ _id, count }) => { statusStats[_id] = count; });

    // Today's complaints
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayComplaints = await Complaint.countDocuments({
      createdAt: { $gte: startOfDay },
    });

    // Monthly stats for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyAgg = await Complaint.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Category breakdown
    const categoryAgg = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Priority breakdown
    const priorityAgg = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.json({
      totalStudents,
      totalComplaints,
      statusStats,
      todayComplaints,
      monthlyStats: monthlyAgg,
      categoryStats: categoryAgg,
      priorityStats: priorityAgg,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all complaints with search/filter/pagination
 * @route   GET /api/admin/complaints
 * @access  Protected (Admin)
 */
export const getAllComplaints = async (req, res, next) => {
  try {
    const {
      status, category, priority, hostelBlock,
      search, page = 1, limit = 10,
      startDate, endDate,
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (hostelBlock) filter.hostelBlock = hostelBlock;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { complaintId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .populate('student', 'name email phone hostelBlock roomNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      complaints,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update complaint status, assignedTo, adminComment
 * @route   PUT /api/admin/complaints/:id/status
 * @access  Protected (Admin)
 */
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, assignedTo, adminComment } = req.body;

    const complaint = await Complaint.findById(req.params.id).populate(
      'student',
      'name email'
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const prevStatus = complaint.status;

    if (status) complaint.status = status;
    if (assignedTo !== undefined) complaint.assignedTo = assignedTo;
    if (adminComment !== undefined) complaint.adminComment = adminComment;

    await complaint.save();

    // Send notification to student if status changed
    if (status && status !== prevStatus) {
      let notifType = 'status_change';
      let message = `Your complaint "${complaint.title}" status changed to ${status}.`;

      if (status === 'Assigned') {
        notifType = 'assigned';
        message = `Your complaint "${complaint.title}" has been assigned to ${assignedTo || 'a team member'}.`;
      } else if (status === 'Resolved') {
        notifType = 'resolved';
        message = `Great news! Your complaint "${complaint.title}" has been resolved.`;
      } else if (status === 'Closed') {
        notifType = 'closed';
        message = `Your complaint "${complaint.title}" has been closed.`;
      }

      await createNotification({
        userId: complaint.student._id,
        message,
        complaintId: complaint._id,
        type: notifType,
      });
    }

    const updated = await Complaint.findById(complaint._id).populate(
      'student',
      'name email phone hostelBlock roomNumber'
    );

    res.json({ message: 'Complaint updated successfully', complaint: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin delete any complaint
 * @route   DELETE /api/admin/complaints/:id
 * @access  Protected (Admin)
 */
export const adminDeleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted by admin' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all registered students
 * @route   GET /api/admin/students
 * @access  Protected (Admin)
 */
export const getAllStudents = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const filter = { role: 'student' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(filter);
    const students = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Attach complaint count per student
    const studentsWithCounts = await Promise.all(
      students.map(async (s) => {
        const complaintCount = await Complaint.countDocuments({ student: s._id });
        return { ...s.toObject(), complaintCount };
      })
    );

    res.json({
      students: studentsWithCounts,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle student active status (enable/disable account)
 * @route   PUT /api/admin/students/:id/status
 * @access  Protected (Admin)
 */
export const toggleStudentStatus = async (req, res, next) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.isActive = !student.isActive;
    await student.save();

    res.json({
      message: `Student account ${student.isActive ? 'activated' : 'deactivated'}`,
      isActive: student.isActive,
    });
  } catch (error) {
    next(error);
  }
};
