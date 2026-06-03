export const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400);
    const error = new Error('Validation failed');
    error.errors = parsed.error.flatten().fieldErrors;
    return next(error);
  }
  req.body = parsed.data;
  next();
};
