import ApiError from '../errors/api.error.js';
import errors from '../errors/errors.js';

const { forbidden } = errors;

const authenticationCheck = (req, _, next) => {
  if (!req.session.userId) {
    throw new ApiError(forbidden, null);
  }
  next();
};

export default authenticationCheck;
