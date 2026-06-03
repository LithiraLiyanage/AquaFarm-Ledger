export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  if (err.name === 'CastError') statusCode = 404;
  if (err.code === 11000) statusCode = 409;
  res.status(statusCode).json({
    success: false,
    message: err.code === 11000 ? 'Duplicate value already exists.' : err.message,
    errors: err.errors || undefined,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
