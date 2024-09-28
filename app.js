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

  app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
  
app.use(cookie());
app.use(body.urlencoded({extended:true}));
app.use(body.json());

( async function(){
await mongoose.connect(process.env.DB_URL).then(()=>{
}).catch(()=>{
  process.exit(1)  
})
})();
app.use(LogReg);
app.use(Homedatas)
app.use(ForgotRoute);
app.get('/',(req,res,next)=>{
  res.send({ok:true,message:"myoption"})
})
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname,'view', 'build', 'index.html'));
//   });
//   app.get('myoption/',(req,res,next)=>{
//     let cookie = req.cookies['myoption'] || null;
//     if(!cookie){
//         return res.status(302).redirect('/register');
//     }
//     let verify = verifyToken(cookie)
//     console.log(verify)
//     if(verify.ok)res.status(302).redirect('/dashboard');
//     else res.status(302).redirect('/register')
// })
// app.get('/authentication',(req,res,next)=>{
// })
// app.use((req,res,next)=>{
    
//     res.status(404).send('Page not found')
// });
app.listen(3001);