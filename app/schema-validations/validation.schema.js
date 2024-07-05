const validationSchema = (schema) => async (req, _, next
) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    console.log('dans le validator', err.name, err.message);
    next(err);
  }
}

export default validationSchema;