import upload from "../config/multer.upload.middlewares.js"
import ApiError from "../errors/api.error.js";

function uploadErrorHandler (req, res, next) {
  if(!req.file) {
    const requestError = new ApiError('Invalid file type or file too large', {
      status: 400,
    });
    requestError.name = 'BadRequest';
    requestError.code = '1203';
    return next(requestError);
  }

  return next();
}

export default uploadErrorHandler;