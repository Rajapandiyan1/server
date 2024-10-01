const express = require('express');
const app = express();
const body = require('body-parser');
const mongoose =require('mongoose')
const path = require('path');
const cors = require('cors')
const cookie = require('cookie-parser')
const LogReg = require('./Routers/RegisterLog');
const ForgotRoute =require('./Routers/ForgotRoute');
const Homedatas=require('./Routers/HomeRoute');
const {verifyAuthPerson} = require('./Auth/tokenAuthen');
require('dotenv').config(); 

  app.use(cors({ origin: 'http://localhost:3000',methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],credentials:true }));
  
app.use(cookie());
app.use(body.urlencoded({extended:true}));
app.use(body.json());

( async function(){
await mongoose.connect(process.env.DB_URL).then(()=>{
}).catch(()=>{
  // process.exit(1)  
})
})();


app.use(LogReg);
app.use(Homedatas)
app.use(ForgotRoute);
app.get('/',(req,res,next)=>{
  console.log(req.cookies['myoption']);
  
  res.send({ok:true,message:"myoption",cookie:req.cookies['myoption']|| 'ok'})
})
app.listen(3000);