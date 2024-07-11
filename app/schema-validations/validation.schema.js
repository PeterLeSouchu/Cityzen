const validationSchema = (schema, reqProperty) => async (req, _, next
) => {
  try {
    await schema.validateAsync(req[reqProperty]);
    next();
  } catch (err) {
    console.log('Provenant du validateur :', err.name, err.message);
    next(err);
  }
}

export default validationSchema;