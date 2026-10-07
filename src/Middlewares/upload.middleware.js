const multer = require('multer');
const path = require('path');

// Configure disk storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    // Unique filename: fieldname-timestamp.ext
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File filter (Images only)
const checkFileTypes = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! (jpeg, jpg, png, webp)'));
  }
};

// Initialize multer upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB Max Limit
  fileFilter(req, file, cb) {
    checkFileTypes(file, cb);
  },
});

module.exports = upload;