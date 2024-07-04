import Controller from "./index.controller.js";

class SigninController extends Controller {

  constructor(datamapper) {
    super();
    this.datamapper = datamapper;
  }

  checkUser() {
    console.log('we check the user')
  }
}

export default SigninController;