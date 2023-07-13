const db = require('../db/dbCon')
const nodemailer = require('nodemailer')
const tryCatchMiddleware = require('../middleware/tryCatchMiddleware')
const Constant = require('../utilities/Constant')

const create = async (req, res, next) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secureConnection:false,
        auth: {
          user: process.env.EMAIL_USER_NAME,
          pass: process.env.EMAI_GENERATE_PASSWORD
        }
      });
   
      
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
    var mailOptions = {
      from: 'nitinkumarja2003@gmail.com',
      to: 'janmedanitn@mailinator.com',
      subject: 'Otp',
      text: `your otp ${otp}`
    };

   let info= await transporter.sendMail(mailOptions);
    console.log('Email sent successfully',info);





    // Execute database query
    let userId = 'nitinank';
    await db.beginTransaction();
    const [rows] = await db.query('CALL sp_InsertOtp(?,?)', [userId, otp]);
    await db.commit();
    console.log('Stored procedure executed successfully');
    Constant.handleSuccess(res, rows[0], 'Otp Sent successfully');
   


}
const compare=async(req,res,next)=>{
  await db.beginTransaction();

  let updateStatus=false
  let providedOTP=511520
  let userId = 'nitinankaaa';
  await db.query('CALL sp_VerifyOTP(?, ?, ?, @message)', [userId, providedOTP, updateStatus]);
  const [result] = await db.query('SELECT @message AS message');
  const { message } = result[0];
  await db.commit();
  res.json({ success: true, message });
}

const createOtp=tryCatchMiddleware(create)
const sendOtp=tryCatchMiddleware(compare)
module.exports = {createOtp,sendOtp}