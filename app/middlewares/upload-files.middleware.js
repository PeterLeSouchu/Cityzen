import upload from "../config/multer.upload.middlewares.js"

async function uploadImage (req, res, next) {
  await upload.single('image');

  if(!req.file) {
    const requestError = new ApiError('Invalid file type or file too large', {
      status: 400,
    });
    requestError.name = 'BadRequest';
    throw requestError;
  }

  return next();
}

export default uploadImage;