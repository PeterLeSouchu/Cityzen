import { fileTypeFromFile } from 'file-type';
import path from 'node:path';

async function checkFile(req, res, next) {
  if(req.file) { // To handle the patch case because a pathc dont contains an image everytime
    const filePath = path.join(import.meta.dirname, '../../public/images', req.session.imageName);
    const fileExtension = await fileTypeFromFile(filePath);
    
    if(!process.env.ALLOWED_EXTENSION_FILES.includes(fileExtension.ext)) {
      const fileError = new Error("File type not allowed", {
        status: 400,
      });
      fileError.name = 'File type not allowed';
      next(fileError);
    }
  }
  next();
}

export default checkFile; 
