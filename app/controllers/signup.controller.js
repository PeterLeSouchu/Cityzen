// TIERCE MODULES
import 'dotenv/config';
// import bcrypt from 'bcrypt';
import otpGenerator from 'otp-generator';

// EXTERNAL MODULES
import userDatamapper from '../models/user.datamapper.js';
import nodemailer from 'nodemailer';
import { hashPassword } from '../utils/bcrypt.js';
// import sendMail from '../utils/send-mail.js';
// import transporter from '../config/transporter.config.js';
// import generateHTMLMail from '../config/html-mail.config.js';
import errors from '../errors/errors.js';
import ApiError from '../errors/api.error.js';

const { internalServerError, userError, forbidden } = errors;

const signupController = {
  async sendOTP(req, res, next) {
    try {
      const { email, password, passwordConfirm, pseudo } = req.body;

      const userExist = await userDatamapper.show(email);
      if (userExist) {
        next(
          new ApiError(userError.details, userError.message.alreadyStored, null)
        );
        return;
      }

      if (password !== passwordConfirm) {
        next(
          new ApiError(
            userError.details,
            userError.message.passwordDontMatch,
            null
          )
        );
        return;
      }

      const hash = await hashPassword(password);

      const OTP = otpGenerator.generate(6);
      console.log(OTP);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: {
          name: 'Cityzen Team',
          address: 'cityzen688@gmail.com',
        },
        to: `${email}`, // list of receivers
        subject: 'OTP Code', // Subject line
        html: `<h1> CityZen </h1>
            <p>Bonjour ${pseudo},</p>
            <p>Nous vous souhaitons la bienvenue chez CityZen! </p>
            <p>Pour valider votre inscription, il ne vous suffit plus qu'à renseigner le code suivant sur la plateforme: <span> ${OTP}</span></p>
            <p>À tout de suite !</p>
          `,
      });

      // const htmlText = generateHTMLMail(pseudo, OTP);

      // sendMail(transporter, htmlText);

      req.session.signupDatas = {
        email,
        hash,
        pseudo,
        OTP,
      };

      res
        .status(200)
        .json({ info: 'OTP sented', session: req.session.signupDatas });
    } catch (error) {
      throw new ApiError(
        internalServerError.details,
        internalServerError.message.global,
        error
      );
    }
  },

  async checkUserByOTP(req, res, next) {
    try {
      if (!req.session?.signupDatas) {
        next(
          new ApiError(
            forbidden.details,
            forbidden.message.permissionDenied,
            null
          )
        );
        return;
      }

      // Get storing datas
      const { email, hash, pseudo, OTP } = req.session.signupDatas;

      // Get sended OTP
      const sendedOTP = req.body.OTP;

      if (OTP !== sendedOTP || sendedOTP.length < 6) {
        next(
          new ApiError(
            userError.details,
            userError.message.passwordDontMatch,
            null
          )
        );
        return;
      }

      const createdUser = await userDatamapper.save(email, hash, pseudo);
      delete createdUser.password;

      delete req.session.signupDatas;
      req.session.userId = createdUser.id;

      res.status(200).json({ data: [createdUser] });
    } catch (error) {
      throw new ApiError(
        internalServerError.details,
        internalServerError.message.global,
        error
      );
    }
  },
};

export default signupController;
