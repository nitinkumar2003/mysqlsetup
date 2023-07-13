const express=require('express');
const catchAsyncError=require('../middleware/catchAsyncError')
const {createOtp,sendOtp}=require('../controller/otpController')
const authVerify=require('../middleware/authVerify.js')

const Router=new express.Router()

Router.post('/sendOtp/',authVerify,catchAsyncError(createOtp))
Router.post('/verifyOtp/',authVerify,catchAsyncError(sendOtp))
module.exports=Router