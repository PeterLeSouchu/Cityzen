import errors from '../errors/errors.js';
import ApiError from '../errors/api.error.js';

const { activityError } = errors;

const validationSchema =
  (
    schema,
    reqProperty = undefined,
    method = undefined,
    acceptConvert = false
  ) =>
  async (req, _, next) => {
    console.log('req.file dans la validation', req.file);

    try {
      if (method === 'update') {
        await schema.validateAsync(req, { convert: acceptConvert });
        return next();
      }

      await schema.validateAsync(req[reqProperty], { convert: acceptConvert });
      return next();
    } catch (err) {
      console.log('Provenant du validateur :', err.name, err.message);
      next(
        new ApiError(activityError.details, activityError.message.input, null)
      );
    }
  };

export default validationSchema;
