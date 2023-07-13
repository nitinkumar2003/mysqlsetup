const db = require('../db/dbCon');
const Constant = require("../utilities/Constant.js");
const tryCatchMiddleware = require('../middleware/tryCatchMiddleware.js');

const getGenders = async (req, res, next) => {
  await db.beginTransaction();
  const [rows] = await db.query(`CALL sp_getGenders()`);
  Constant.handleSuccess(res, rows[0], 'Data retrieved successfully');
  await db.commit();
};

const getCountries = async (req, res, next) => {
  await db.beginTransaction();
  const [rows] = await db.query(`CALL sp_tblCountries()`);
  Constant.handleSuccess(res, rows[0], 'Data retrieved successfully');
  await db.commit();
};

const genderController = tryCatchMiddleware(getGenders);
const countriesController = tryCatchMiddleware(getCountries);

module.exports = { genderController: genderController, countriesController: countriesController};
