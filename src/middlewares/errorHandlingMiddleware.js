const { StatusCodes } = require('http-status-codes');

function errorHandler(err, req, res, next) {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Internal Server Error',
  };

  if (err.name === 'ValidationError') {
    defaultError.statusCode = 400;
    defaultError.message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  res.status(defaultError.statusCode).json(defaultError);
}

module.exports = errorHandler;
