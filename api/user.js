const express=require('express')
const catchAsyncError = require("../middleware/catchAsyncError.js");
const {registerController,loginController,getUser}  = require("../controller/userController.js");
// const authVerify=require('../middleware/authVerify.js')
const Router=new express.Router();

Router.post('/register/',catchAsyncError(registerController))
Router.post('/login/',catchAsyncError(loginController))
Router.get('/',catchAsyncError(getUser))

module.exports=Router