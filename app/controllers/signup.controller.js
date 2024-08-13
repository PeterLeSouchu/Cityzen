// TIERCE MODULES
import 'dotenv/config';
import bcrypt from 'bcrypt';
import otpGenerator from 'otp-generator';

// EXTERNAL MODULES
import userDatamapper from '../models/user.datamapper.js';
import { hashPassword } from '../utils/bcrypt.js';
import sendMail from '../utils/send-mail.js';
import transporter from '../config/transporter.config.js';
import { htmlCode } from '../config/html-mail.config.js';

const signupController = {
  async sendOTP(req, res) {
    try {
      const { email, password, passwordConfirm, pseudo } = req.body;

      const userExist = await userDatamapper.show(email);
      if (userExist) {
        return res.status(400).json({ error: 'The user already exist' });
      }

      if (password !== passwordConfirm) {
        return res.status(400).json({ error: "passwords don't match" });
      }

      const OTP = otpGenerator.generate(6);

      console.log(OTP);

      const hash = await hashPassword(password);

      req.session.signupDatas = {
        email,
        hash,
        pseudo,
        OTP,
      };

      sendMail(transporter, htmlCode);

      res
        .status(200)
        .json({ info: 'OTP sented', session: req.session.signupDatas });
    } catch (error) {}
  },

  async checkUserByOTP(req, res) {
    if (!req.session?.signupDatas) {
      return res.status(404).json({ error: 'Bad Request' });
    }

    const { email, hash, pseudo, OTP } = req.session.signupDatas;
    const sendedOTP = req.body.OTP;

    if (OTP !== sendedOTP || sendedOTP.length < 6) {
      return res.status(400).json({ error: 'The OTP does not match' });
    }

    const createdUser = await userDatamapper.save(email, hash, pseudo);
    delete createdUser.password;

    delete req.session.signupDatas;
    req.session.userId = createdUser.id;

    res.status(200).json({ data: [createdUser] });
  },
};

export default signupController;
