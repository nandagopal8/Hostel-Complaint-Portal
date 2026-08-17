import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Pre-create upload directories so Render never hits ENOENT ──────────────
const ensureDir = (folder) => {
  const dir = path.join(__dirname, '..', 'uploads', folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created upload directory: ${dir}`);
  }
  return dir;
};

// Create both folders at module load time (runs once on server start)
ensureDir('complaints');
ensureDir('profiles');

/**
 * Creates a Multer disk storage engine for a given upload folder.
 * Directory is guaranteed to exist before Multer writes to it.
 */
const createStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dest = ensureDir(folder); // create if missing on every request too
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

/**
 * File type filter — only allows images
 */
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
  }
};

// Upload middleware for complaint images (max 5MB)
export const uploadComplaintImage = multer({
  storage: createStorage('complaints'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single('complaintImage');

// Upload middleware for profile pictures (max 2MB)
export const uploadProfileImage = multer({
  storage: createStorage('profiles'),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single('profileImage');

/**
 * Wraps multer to return clean JSON errors instead of crashing
 */
export const handleMulterError = (uploadFn) => (req, res, next) => {
  uploadFn(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum allowed size exceeded.' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};
