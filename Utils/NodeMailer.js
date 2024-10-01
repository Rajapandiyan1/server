const bcrypt = require('bcryptjs');
const nodemailer =require('nodemailer');
const OtpModel = require('./../Model/OTPModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


function generateOtp(params) {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return String(otp);
}
async function sendmail(req,res,otp,ids) {
    try{

        let body=req.body;
        let optExists =await OtpModel.findOne({idUser:new mongoose.Types.ObjectId(ids)});
        if(optExists) await OtpModel.findOneAndDelete({idUser:new mongoose.Types.ObjectId(ids)});
        let otpsave=await new OtpModel({otp:await bcrypt.hash(otp,10),idUser:new mongoose.Types.ObjectId(ids)}).save();
        // let verify=
        let transport=await nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'myoptiom360@gmail.com',
                pass:'lgwh ujdf rlqx xgmz'
            }
        });
        let sendAddress={from:'rajapandiyan1163@gmail.com',to:body.email,subject:'Myoption website forgot password otp',text:otp};
        let sendmailer=await transport.sendMail(sendAddress,async(err,info)=>{
        
            if(err) return res.send({ok:false,message:err});
    
              return  res.cookie('forgot',await jwt.sign({ids:ids},process.env.JWT_SECRET),{
                httpOnly: true,
                secure: true, 
                sameSite: 'none',      // Required for cross-origin cookies
                maxAge: 24 * 60 * 60 * 1000 * 7  // Cookie will expire in 1 day
              }).status(200).send({ok:true,registerId:ids});
        })
    }catch(e){
        res.send({ok:false,message:e.message})
    }

}

module.exports = {sendmail,generateOtp};