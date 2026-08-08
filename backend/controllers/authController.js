import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Generates a signed JWT for a given user ID
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

/**
 * @desc    Register a new student
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, hostelBlock, roomNumber } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      hostelBlock,
      roomNumber,
      role: 'student', // Students can only self-register
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        hostelBlock: user.hostelBlock,
        roomNumber: user.roomNumber,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user and return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Include password field (excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Your account has been deactivated' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        hostelBlock: user.hostelBlock,
        roomNumber: user.roomNumber,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/auth/profile
 * @access  Protected
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current user profile (with optional profile image upload)
 * @route   PUT /api/auth/profile
 * @access  Protected
 */
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, phone, hostelBlock, roomNumber } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (hostelBlock) user.hostelBlock = hostelBlock;
    if (roomNumber) user.roomNumber = roomNumber;

    // If a profile image was uploaded via Multer
    if (req.file) {
      user.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    const updated = await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        hostelBlock: updated.hostelBlock,
        roomNumber: updated.roomNumber,
        role: updated.role,
        profileImage: updated.profileImage,
        createdAt: updated.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password for authenticated user
 * @route   PUT /api/auth/change-password
 * @access  Protected
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save(); // Pre-save hook re-hashes the new password

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};
