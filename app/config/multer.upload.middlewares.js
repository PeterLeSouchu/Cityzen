import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Set __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuring multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/images'));
  },
  
  filename: (req, file, cb) => {
    const filename = Date.now() + '_' + file.originalname;
    req.session.imageName = filename;
    cb(null, filename);
  },
});

// Configuring accepted files
const allowedFileTypes = process.env.ALLOWED_EXTENSION_FILES;
function fileFilter(req, file, cb) {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


const upload = multer({
  storage: storage,
  limits: {
    files: 1,
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter,
});

export default upload;
