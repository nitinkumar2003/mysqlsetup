const db=require('../db/dbCon')
const tryCatchScope = (controllerFn) => {
    return async (req, res, next) => {
      try {
        await controllerFn(req, res, next);
      } catch (error) {
        await db.rollback();
        next(error); // Pass the error to the next middleware (error handling middleware)
      }
    };
  };
  
  module.exports = tryCatchScope;
  