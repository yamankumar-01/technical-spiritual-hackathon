import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Strict mapping of allowed MIME types to their corresponding valid file extensions
const MIME_EXTENSION_MAP = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
  'application/pdf': ['pdf'],
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const rawExt = path.extname(file.originalname || '').toLowerCase().replace('.', '');
    const mime = (file.mimetype || '').toLowerCase();
    const validExtensions = MIME_EXTENSION_MAP[mime] || [];
    const safeExt = validExtensions.includes(rawExt) ? rawExt : validExtensions[0] || 'bin';

    // Cryptographically random, collision-resistant, safe filename
    const randomName = crypto.randomBytes(16).toString('hex');
    cb(null, `proof-${Date.now()}-${randomName}.${safeExt}`);
  },
});

const fileFilter = (req, file, cb) => {
  const mime = (file.mimetype || '').toLowerCase();
  const rawExt = path.extname(file.originalname || '').toLowerCase().replace('.', '');

  const validExtensions = MIME_EXTENSION_MAP[mime];

  // Must have a recognized safe MIME type AND matching extension
  if (validExtensions && validExtensions.includes(rawExt)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only genuine image files (JPEG, PNG, WebP) and PDF documents are accepted.'
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
    files: 1,
  },
  fileFilter,
});
