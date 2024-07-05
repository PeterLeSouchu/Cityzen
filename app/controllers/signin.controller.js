// import Controller from "./index.controller.js";



const SigninController = {

  checkUser(req, res) {
    const { email, password } = req.body;

    console.log(email, password)
  }
}

// class SigninController extends Controller {

//   constructor(datamapper) {
//     super(instances);
//     this.datamapper = datamapper;
//   }

//   checkUser() {
//     console.log('we check the user')
//   }
// }

export default SigninController;