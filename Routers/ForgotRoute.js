const Route =require('express').Router();
const path =require('path');
const {generateOtp,sendmail} = require('../Utils/NodeMailer')
const RegisterModel = require('../Model/RegisterModel');
const userModel = require('../Model/UserModel')
const bcrypt = require('bcryptjs');
const OtpModel = require('../Model/OTPModel');
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken')

Route.post('/forgot',async (req,res,next)=>{

    let body = req.body;
    let data=await RegisterModel.findOne({email:body.email});
    if(!data) return res.send({ok:false,message:'sorry you not register this email '+body.email})
    let id = data._id;
    sendmail(req,res,generateOtp(),id);    
});
Route.post('/forgot/otp/:id',async(req,res,next)=>{
    let otp=req.body.otp;
    let id=req.params.id; 
    let data=await OtpModel.findOne({idUser:new mongoose.Types.ObjectId(id)});
    if(!data) return res.send({ok:false,message:"invalid user otp"});
    let hashOtp = data.otp;
    bcrypt.compare(String(otp),hashOtp,(err,result)=>{
        if(err) return res.send({ok:false,message:'otp invalid'});
        if(data.expires < Date.now()) return res.send({ok:false,message:'otp expired'}) 
        if(!result) return res.send({ok:false,message:"invalid otp"})
            res.send({ok:true,message:'otp succesfully'})
        // res.status(302).redirect('/forgot/setPassword/'+id)
    })
});

Route.post('/forgot/setPassword/:id',async (req,res,next)=>{
let id=req.params.id;
let setPassword= req.body.setPassword;
if(setPassword){
    let updata=await RegisterModel.findByIdAndUpdate({_id:id},{password:await bcrypt.hash(setPassword,10)});
    let userModels = await userModel.findOne({RegisterId:new mongoose.Types.ObjectId(id)});
    let jwts =await jwt.sign({fullname:userModels.fullname,email:userModels.email,idUser:userModels._id},process.env.JWT_SECRET);
    if(!userModels) return res.send({ok:false,message:"Invalid user"});
        if(updata){
        return res.clearCookie('forgot').cookie('myoption',process.env.JWT_SECRET).send({ok:true,message:'password update successfully',dashboardUrl:`/${userModels.fullname}/${userModels._id}`});
    } 
    return res.send({ok:false,message:'sorry ! Invalid user , please register'})
        
}
res.send({ok:false,message:'sorry password missing ! check send your password'})
});
module.exports = Route;