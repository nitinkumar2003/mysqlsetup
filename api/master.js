const express=require('express')
const catchAsyncError = require('../middleware/catchAsyncError')
const {genderController,countriesController}   = require("../controller/masterController.js");
const authVerify=require('../middleware/authVerify.js')


const Router=new express.Router()

    Router.get('/gender',authVerify,catchAsyncError(genderController))
    Router.get('/counteries',authVerify,catchAsyncError(countriesController))

module.exports=Router