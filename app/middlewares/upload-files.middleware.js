// EXTERNAL MODULES
import upload from '../config/multer.upload.middlewares.js';
import ApiError from '../errors/api.error.js';
import errors from '../errors/errors.js';

const { fileError } = errors;

function uploadErrorHandler(req, res, next) {
  if (!req.file) {
    next(new ApiError(fileError.details, fileError.message.notAllowed, null));
    return;
  }

  return next();
}

export default uploadErrorHandler;
