const authenticationCheck = (req, res, next) => {

  // if(!req.session.userId) {
  //   return res.status(403).json({error: 'You need to be connected to access this route'});
  // }

  next();

};

export default authenticationCheck;