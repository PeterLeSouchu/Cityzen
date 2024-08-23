const catchHandlerController = (controller) => async (req, res, next) => {
  try {
    console.log('Je suis le try du controller catchHandlerController');
    await controller(req, res, next);
  } catch (err) {
    console.log('Je suis le catch du controller catchHandlerController');
    console.log(err);
    next(err);
  }
};

export default catchHandlerController;
