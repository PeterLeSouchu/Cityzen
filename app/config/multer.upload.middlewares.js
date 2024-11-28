import multer from 'multer';

const storage = multer.memoryStorage();

// Configuring accepted files
const allowedFileTypes = process.env.ALLOWED_EXTENSION_FILES;
function fileFilter(req, file, cb) {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024, // 2MB
  },
  fileFilter,
});

export default upload;
