import "dotenv/config";
import bcrypt from 'bcrypt';
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

const signupController = {

  sendOTP(req, res) {
    const { email, password } = req.body;
    const OTP = otpGenerator.generate(6, {

    });

    console.log(OTP);

    req.session.signupDatas = {
      email,
      password,
      OTP,
    }

    // Make the transporter
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const htmlCode = `
      <h1> CityZen </h1>
      <p>Pour valider votre inscription, veuillez renseigner le code suivant sur la plateforme: <span>${OTP}</span></p>
    `;

    async function sendMail(transporter, htmlCode) {
      // Send mail with defined transporter object
      try {
        const info = await transporter.sendMail({
          from: `"Ryad - Equipe CityZen" <cef>`, // sender address
          to: "r.chair@hotmail.fr", // list of receivers
          subject: "CityZen - Votre code de confirmation", // Subject line
          // text: "Hello world?", // plain text body
          html: htmlCode, // html body
        });
        
        console.log("Message sent: %s", info.messageId);

      } catch (err) {
        console.log('Send message error:', err);
      }
    }

    // sendMail(transporter, htmlCode);

    res.status(200).json({info: 'OTP sented'});
  },

  async checkUserByOTP(req, res) {
    if(!req.session?.signupDatas) {
      res.status(404).json({error: 'Bad Request'})
    }

    const { email, password, OTP } = req.session.signupDatas;
    const sendedOTP = req.body.OTP;

    if(OTP !== sendedOTP) {
      res.status(400).json({error: 'The OTP does not match'});
    }

    const SALT_ROUNDS = 10;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    // const createdUser = await userDatamapper.store(email, hash);
    const createdUser = [{id: 2, email, hash}];

    res.status(200).json({data: createdUser});
  }
}

export default signupController;