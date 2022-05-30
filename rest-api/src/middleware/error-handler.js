const errorHandler = (error, req, res, next) => {
  //Custom string error messages
  // trigged when => throw 'string'
  if (typeof error === 'string') {
    const is404 = error.toLowerCase().endsWith('not found');
    const statusCode = is404 ? 404 : 400;
    return res.status(statusCode).json({ status: statusCode, message: error });
  }

  //Mongoose validation error
  if (error.name === 'ValidationError') {
    return res.status(400).json({ status: 400, message: error.message });
  }

  //Any other error
  return res.status(500).json({
    status: 500,
    message: error.message ? error.message : 'An Error Has Occurred',
  });
};

module.exports = errorHandler;
