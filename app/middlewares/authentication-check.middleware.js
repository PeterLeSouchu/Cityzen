import ApiError from '../errors/api.error.js';

const authenticationCheck = (req, res, next) => {
  if (!req.session.userId) {
    const requestError = new ApiError(
      'Forbidden. You need to be connected to access this route',
      {
        status: 403,
      }
    );
    requestError.name = 'Forbidden';
    throw requestError;
  }

  next();
};

export default authenticationCheck;
