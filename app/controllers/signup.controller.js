import "dotenv/config";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

const signupController = {

  sendOTP(req, res) {
    const OTP = otpGenerator.generate(6);
    console.log(req.body);
    console.log(OTP);

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
          subject: "Hello ✔", // Subject line
          // text: "Hello world?", // plain text body
          html: htmlCode, // html body
        });
        
        console.log("Message sent: %s", info.messageId);

      } catch (err) {
        console.log('Send message error:', err);
      }
    }

    sendMail(transporter, htmlCode);
  },

  checkUserByOTP(req, res) {

    

    console.log('check by OTP code')
  }
}

export default signupController;