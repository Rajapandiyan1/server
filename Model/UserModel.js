let mongoose = require('mongoose');

let UserSchema =new mongoose.Schema({

    fullname:{
        type:String,
        required:[true,'name is required']
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
    RegisterId:{
type:String,
required:[true,'RegisterId is important']
    },
    topics:[
        {
            topicsName:{
                type:String,
                // required:[true,'Topics name is required']
            },
            topicsId:{
                type:mongoose.Types.ObjectId,
                ref:'topic'
                // required:[true,'Topics id important']
            }
        }
    ]

})

let UserModel = mongoose.model('User',UserSchema);

module.exports= UserModel;