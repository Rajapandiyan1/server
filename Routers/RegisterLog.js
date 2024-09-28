const Router = require('express').Router();
const path = require('path');
const RegisterModel = require('../Model/RegisterModel');
const {verifyToken,verifyAuthPerson} = require('../Auth/tokenAuthen')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../Model/UserModel')

// verified *
Router.post('/register',async (req,res,next)=>{
    let body = req.body;
    try{
        let data =await RegisterModel.findOne({email:body.email});
        if(!body.password){ throw {ok:false,message:'password is required'};}
        else{ if(body.password.length<8)throw {ok:false,message:'password length minimum 8'}}
        
        if(!data){
           let {fullname,email,_id}=await new RegisterModel({...body,password:await bcrypt.hash(body.password,10)}).save();
           
           if(fullname && email){
               //
               let data= await new UserModel({fullname,email,RegisterId:_id,topics:[]}).save();
               let jwts =await jwt.sign({fullname,email,idUser:data._id},process.env.JWT_SECRET);
               if(!data) return res.send({ok:false,message:'Sorry Register Failed'});
             return  await res.cookie('myoption',jwts,{
                httpOnly: true,
                secure: false, 
                sameSite: 'none',      // Required for cross-origin cookies
                maxAge: 24 * 60 * 60 * 1000 * 7  // Cookie will expire in 1 day
              }).send({url:`Dashboard/${data.fullname}/${data._id}`,ok:true,message:'Register successfully'});
               
           }else{
          return  res.send({ok:false,message:'sorry server side register some problem'})
           }
        }
        else{
           return res.send({ok:false,message: body.email+ 'email is already extist !'})
        }
    }catch(e){
        let message;
        if(e.message.includes(':')){
            message=e.message.split(':');
            message.shift();
            message= message.join(':');
        }else{
            message=e.message;
        }
    
return res.send({ok:false,message})
    }
})
// verified
Router.post('/login',async (req,res,next)=>{
    try{
        
        let {email,password} = req.body;

        if(!email.endsWith('@gmail.com')) return res.send({ok:false,message:'email end @gmail.com is required'});
        
        if(password.length<7) return res.send({ok:false,message:'password minimum length is 8'});

        let data = await RegisterModel.findOne({email});
        if(!data){ // 0 is false
           return res.send({ok:false,message:`sorry ! you arenot register in this email ${req.body.email}`})
        }
        let bcryptdata=await bcrypt.compare(password,data.password,async (err,result)=>{
            if(err){ return res.send({ok:false,message:'sorry password wrong , please check your password'});}
            let dataUser =await UserModel.findOne({RegisterId:data.id});
            if(result) {
                let jwts=await jwt.sign({email:data.email,idUser:dataUser._id},process.env.JWT_SECRET,{expiresIn:'2d'});
                res.cookie('myoption',jwts,{ httpOnly: true, secure: false })
                return res.send({ok:true,url:`/Dashboard/${data.fullname}/${dataUser._id}`})
                
            } else{
                res.send({ok:false,message:'Login failed. Please check your credentials.'})
            }
        });
    }catch(e){
      return  res.send({ok:false,message:'server problem'})
    }

});


module.exports = Router;