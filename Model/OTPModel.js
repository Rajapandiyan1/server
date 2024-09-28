const mongoose = require('mongoose');
const { type } = require('os');

let OTPSchema = new mongoose.Schema({
    idUser:{
        type:mongoose.Types.ObjectId,
        required:[true,'Id is required']
    },
    otp:{
        type:String,
        required:[true,'otp is required']
    },
    expires:{
        type : Number,
        default:Date.now() + 115 * 60000
    }
})

let OtpModel = mongoose.model('Otp',OTPSchema);

module.exports=OtpModel;