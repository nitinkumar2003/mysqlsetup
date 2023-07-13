const db = require('../db/dbCon')
const tryCatchMiddleware = require('../middleware/tryCatchMiddleware')
const Constant = require('../utilities/Constant')
const { isEmpty, validateField, validateObject, validateJsonRegisterUser } = require('../utilities/errorHandlerController')
const { regexCom, $Commonfun } = require('../utilities/commonLib')
const jwt = require('jsonwebtoken')



const userRegister = async (req, res, next) => {
    let { userName, userEmail, userPassword, genderId, countryId, statusId } = req.body;

    let jsonRegisterUser = { userName: userName, userEmail: userEmail, userPassword: userPassword }

    let jsonRegisterUserValidate = {
        userName: { value: userName, regex: regexCom.onlyString },
        userEmail: { value: userEmail, regex: regexCom.emailRegex },
        userPassword: { value: userPassword, regex: regexCom.passwordRegex },
    };


    const validateErr = validateJsonRegisterUser(jsonRegisterUserValidate)
    const objectError = validateObject(jsonRegisterUser);
    validateErr !== null && Constant.handleBadReq(res, jsonRegisterUser, validateErr)
    objectError !== null && Constant.handleBadReq(res, jsonRegisterUser, objectError)
    console.log('validateErr', validateErr)

    let userId = $Commonfun.generateUuid(userEmail);
    // let userPswd=$Commonfun.getHashPassword(userPassword) 

    await db.beginTransaction();
    const [rows] = await db.query('CALL sp_InsertRegisterUser(?, ?, ?, ?, ?, ?, ?)', [userName, userEmail, userPassword, userId, genderId, countryId, statusId]);
    console.log('affectedRows result', rows)
    Constant.handleSuccess(res, rows[0], 'Registration successfull');
    await db.commit();
}

const userLogin = async (req, res, next) => {
    let { userPassword, userEmail } = req.body
    let jsonRegisterUser = { userPassword, userEmail }
    const objectError = validateObject(jsonRegisterUser);
    objectError !== null && Constant.handleBadReq(res, jsonRegisterUser, objectError)

    await db.beginTransaction();
    await db.query('CALL sp_Login(?, ?, @out_userId)', [userEmail, userPassword]);
    const [result] = await db.query('SELECT @out_userId AS out_userId');
    const { out_userId } = result[0];
    console.log('JWT_SECRET_KET', process.env.JWT_SECRET_KEY, process.env.JWT_SECRET_KEY_VALUE)
    const token = jwt.sign({ out_userId }, process.env.JWT_SECRET_KEY_VALUE, { expiresIn: '24h' });
    res.json({ status: 200, message: 'login Successfull', token: token })
    await db.commit();



}

const getUserInfo=async(req,res,next)=>{
let {userId}=req.query
console.log('userId',userId)
let loginUser = { userId: userId }
const objectError = validateObject(loginUser);
objectError !== null && Constant.handleBadReq(res, loginUser, objectError)
await db.beginTransaction()
// let [rows]=await db.query('CALL sp_getUserInfo(? ,)',[userId])
// let [rows] = await db.query('CALL sp_getUserInfo(? ,@o_message)', [userId]);
// let [rows] = await db.query('CALL sp_getUserInfo(?)', [userId]);
let [rows] = await db.query('CALL sp_getUser(?)', [userId]);
console.log(rows[0])
// const [result] = await db.query('SELECT @o_message AS o_message');
// const { o_message } = result[0];

// (o_message !=='' || rows[0] ==undefined)  && Constant.handleBadReq(res, loginUser, o_message)
Constant.handleSuccess(res, rows[0], 'Data retrieved successfully');
// console.log('rows',o_message,rows,rows[0])
await db.commit()


}
let getUser=tryCatchMiddleware(getUserInfo)
let registerController = tryCatchMiddleware(userRegister)
let loginController = tryCatchMiddleware(userLogin)
module.exports = { registerController, loginController,getUser }