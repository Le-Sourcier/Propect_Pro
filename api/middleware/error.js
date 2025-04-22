export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default error
  let error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.status = 400;
  } else if (err.name === 'UnauthorizedError') {
    error.status = 401;
  }

  res.status(error.status).json({
    error: error.message
  });
};

export default {
  errorHandler
};