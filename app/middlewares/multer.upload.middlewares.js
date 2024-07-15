import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Définir __dirname dans les modules ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../image'));
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + '_' + file.originalname;
    req.body.image = filename;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

export default upload;
