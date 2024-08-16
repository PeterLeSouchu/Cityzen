// const catchHandlerController = (controller) => async (req, res, next) => {
//   try {
//     await controller(req, res, next);
//   } catch (err) {
//     console.log('catch une erreur');
//     next(err);
//   }
// };

// export default catchHandlerController;

import ApiError from '../errors/api.error.js';
import errors from '../errors/errors.js';

const { internalServerError } = errors;

const catchHandlerController = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (err) {
    console.log('catch une erreur');
    next(
      new ApiError(
        internalServerError.details,
        internalServerError.message.global,
        err
      )
    );
  }
};

export default catchHandlerController;
