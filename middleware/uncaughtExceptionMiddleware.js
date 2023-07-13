const uncaughtExceptionMiddleware = (err, req, res, next) => {
    console.error(err);
    const statusCode = 500;
  
    const responseBody = {
      error: {
        message: 'Internal Server Error',
      },
    };
  
    // Send the response
    res.status(statusCode).json(responseBody);
  };
  
  module.exports = uncaughtExceptionMiddleware;
  