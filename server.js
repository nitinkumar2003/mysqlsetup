const express=require('express');
const cors=require('cors');
const app=express()
const bodyParser=require('body-parser')
require('dotenv').config()
const user=require('./api/user.js')
const masterApi=require('./api/master.js')
const otp=require('./api/otp.js')

const errorMiddleware=require('./middleware/errorMiddleware.js')
const uncaughtExceptionMiddleware=require('./middleware/uncaughtExceptionMiddleware.js')

require('./db/dbCon')



//middleware-----------------------------------------------
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// api route-----------------------------------------------------
  app.get('/',(req,res)=>{ res.send('this is a gaming server ')})

  app.use('/api/master',masterApi)
  app.use('/api/user',user)
  app.use('/api/otp',otp)

// handle api middleware--------------------------------

    app.use(errorMiddleware)
    app.use(uncaughtExceptionMiddleware)
 //server ------------------------------------
  const PORT=process.env.SERVER_PORT || 4002
  let server=app.listen(PORT,(err,res)=>{
    var host=server.address().address
    var port=server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
  })



  