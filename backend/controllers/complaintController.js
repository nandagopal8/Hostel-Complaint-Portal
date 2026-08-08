import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';

/**
 * @desc    Create a new complaint
 * @route   POST /api/complaints
 * @access  Protected (Student)
 */
export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority, hostelBlock, roomNumber } = req.body;

    const complaintData = {
      student: req.user._id,
      title,
      description,
      category,
      priority,
      hostelBlock,
      roomNumber,
    };

    if (req.file) {
      complaintData.complaintImage = `/uploads/complaints/${req.file.filename}`;
    }

    const complaint = await Complaint.create(complaintData);
    await complaint.populate('student', 'name email hostelBlock roomNumber');

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get complaints for the logged-in student
 * @route   GET /api/complaints
 * @access  Protected (Student)
 */
export const getMyComplaints = async (req, res, next) => {
  try {
    const { status, category, priority, page = 1, limit = 10, search } = req.query;

    const filter = { student: req.user._id };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
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
 * @desc    Get a single complaint by ID (student can only view their own)
 * @route   GET /api/complaints/:id
 * @access  Protected
 */
export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      'student',
      'name email phone hostelBlock roomNumber'
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Students can only view their own complaints
    if (
      req.user.role === 'student' &&
      complaint.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    res.json({ complaint });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a complaint (student can only edit before it's processed)
 * @route   PUT /api/complaints/:id
 * @access  Protected (Student — owner only)
 */
export const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this complaint' });
    }

    if (complaint.status !== 'Pending') {
      return res
        .status(400)
        .json({ message: 'Cannot edit complaint once it is being processed' });
    }

    const { title, description, category, priority, hostelBlock, roomNumber } = req.body;
    if (title) complaint.title = title;
    if (description) complaint.description = description;
    if (category) complaint.category = category;
    if (priority) complaint.priority = priority;
    if (hostelBlock) complaint.hostelBlock = hostelBlock;
    if (roomNumber) complaint.roomNumber = roomNumber;
    if (req.file) {
      complaint.complaintImage = `/uploads/complaints/${req.file.filename}`;
    }

    const updated = await complaint.save();
    res.json({ message: 'Complaint updated successfully', complaint: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a complaint (student can only delete Pending complaints)
 * @route   DELETE /api/complaints/:id
 * @access  Protected (Student — owner only)
 */
export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this complaint' });
    }

    if (complaint.status !== 'Pending') {
      return res
        .status(400)
        .json({ message: 'Cannot delete complaint once it is being processed' });
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student dashboard statistics
 * @route   GET /api/complaints/stats
 * @access  Protected (Student)
 */
export const getStudentStats = async (req, res, next) => {
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

    res.json({ stats: result, recentComplaints: recent });
  } catch (error) {
    next(error);
  }
};
