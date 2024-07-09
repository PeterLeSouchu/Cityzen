const catchHandlerController = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (err) {
    console.log('catch une erreur');
    next(err);
  }
}

export default catchHandlerController;