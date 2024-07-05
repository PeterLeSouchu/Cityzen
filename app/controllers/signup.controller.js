import otpGenerator from "otp-generator";

const signupController = {

  sendOTP(req, res) {
    const OTP = otpGenerator.generate(6);
    console.log(req.body);
    console.log(OTP);
  },

  checkUserByOTP(req, res) {

    

    console.log('check by OTP code')
  }
}

export default signupController;