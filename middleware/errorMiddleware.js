const Constant = require('../utilities/Constant');

const errorMiddleware = (err, req, res, next) => {
  console.error('Server error:', err);
 Constant.catchMiddleWareError(res,err)
};

module.exports = errorMiddleware;
