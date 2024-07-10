// TIERCE MODULES
import 'dotenv/config';
import bcrypt from 'bcrypt';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';

// EXTERNAL MODULES

import userDatamapper from '../models/user.datamapper.js';
import { hashPassword } from '../utils/bcrypt.js';

const signupController = {
  async sendOTP(req, res) {
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

    // Make the transporter
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const htmlCode = `
      <h1> CityZen </h1>
      <p>Bonjour ${pseudo},</p>
      <p>Nous vous souhaitons la bienvenue chez CityZen! </p>
      <p>Pour valider votre inscription, il ne vous suffit plus qu'à renseigner le code suivant sur la plateforme: <span>${OTP}</span></p>
      <p>À tout de suite !</p>
    `;

    async function sendMail(transporter, htmlCode) {
      // Send mail with defined transporter object
      try {
        const info = await transporter.sendMail({
          from: `"Ryad - Equipe CityZen" <cef>`,
          to: 'r.chair@hotmail.fr',
          subject: 'CityZen - Votre code de confirmation',
          // text: "Hello world?",
          html: htmlCode,
        });

        console.log('Message sent: %s', info.messageId);
      } catch (err) {
        console.log('Send message error:', err);
        return res.status(500).json({ error: err });
      }
    }

    sendMail(transporter, htmlCode);

    res
      .status(200)
      .json({ info: 'OTP sented', session: req.session.signupDatas });
  },

  async checkUserByOTP(req, res) {
    console.log(req.session.signupDatas);
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
