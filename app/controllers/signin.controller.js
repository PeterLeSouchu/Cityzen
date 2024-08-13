// TIERCE MODULES
import bcrypt from 'bcrypt';

// EXTERNAL MODULES
import userDatamapper from '../models/user.datamapper.js';
import errors from '../errors/errors.js';

const { internalServerError, userError } = errors;

const signinController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const userExist = await userDatamapper.show(email);
      if (!userExist) {
        next(new ApiError(userError.details, userError.message.notFound, null));
        return;
      }

      const passwordHashFromDB = userExist.password;

      const isGoodPassword = await bcrypt.compare(password, passwordHashFromDB);
      if (!isGoodPassword) {
        next(
          new ApiError(
            userError.details,
            userError.message.permissionDenied,
            null
          )
        );
        return;
      }

      req.session.userId = userExist.id;
      delete userExist.password;

      res.status(200).json({ data: [userExist] });
    } catch (error) {
      throw new ApiError(
        internalServerError.details,
        internalServerError.message.global,
        error
      );
    }
  },
};

export default signinController;
