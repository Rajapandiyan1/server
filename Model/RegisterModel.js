let mongoose = require('mongoose');
const { type } = require('os');

let registerSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required :[true,"Name is required"], 
    },
    email : {
        type:String,
        required:[true,"Email is required"],
        validate:{
            validator:function(value){
                return value.endsWith('@gmail.com')
            }
        ,
        message: (props)=>{return `email is @gmail.com is required`}
        }

    },
    password:{
        type:String,
        required:[true,'password is required'],
    },
    createAt:{
        type :String,
        default: `${new Date().toLocaleDateString('en-In')} - ${new Date().toLocaleTimeString('en-In')}`
    }
});
let RegisterModel =  mongoose.model('Register',registerSchema);
module.exports =RegisterModel;