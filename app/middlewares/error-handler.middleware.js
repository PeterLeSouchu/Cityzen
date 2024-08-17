const catchHandlerController = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
    console.log('aucune ereurrrrrrrrr');
  } catch (err) {
    console.log('catch une erreur');
    console.log("Voici l'erreur");
    console.log(err);
    next(err);
  }
};

export default catchHandlerController;
