// TIERCE MODULES
import bcrypt from 'bcrypt';

import userDatamapper from '../models/user.datamapper.js';

const signinController = {
  async login(req, res) {
    const { email, password } = req.body;

    const userExist = await userDatamapper.show(email);
    if (!userExist) {
      return res
        .status(400)
        .json({ error: 'The provided informations is wrong' });
    }

    const passwordHashFromDB = userExist.password;

    const isGoodPassword = await bcrypt.compare(password, passwordHashFromDB);
    if (!isGoodPassword) {
      return res
        .status(400)
        .json({ error: 'The provided informations is wrong' });
    }

    req.session.userId = userExist.id;
    delete userExist.password;
    // res.cookie.userId = userExist.id; 
    // delete userExist.password;

    res.status(200).json({ data: [userExist] });
  },
};

export default signinController;
