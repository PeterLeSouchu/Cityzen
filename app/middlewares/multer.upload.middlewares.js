import multer from 'multer';
// import { fileURLToPath } from 'url';
import path from 'node:path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(import.meta.dirname, '/uploads'));
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + '_' + file.filename;
        req.body.image = filename;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

export default upload;
