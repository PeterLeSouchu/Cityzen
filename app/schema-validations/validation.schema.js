const validationSchema = (schema, reqProperty = undefined, method = undefined, acceptConvert = false) => async (req, _, next
) => {
  try {
    if(method === 'update') {
      await schema.validateAsync(req, {convert: acceptConvert});
      next();
    }

    await schema.validateAsync(req[reqProperty], {convert: acceptConvert});
    next();
  } catch (err) {
    console.log('Provenant du validateur :', err.name, err.message);
    next(err);
  }
}

export default validationSchema;