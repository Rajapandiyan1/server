const jwt = require('jsonwebtoken');
const UserModel = require('../Model/UserModel');
// authen peroson only check true or false
function verifyToken(token) {
    if(!token) return {ok:false,authen:false,message:'athuentication personal only access this url'}
    let verify = jwt.verify(token,process.env.JWT_SECRET);
    if(verify) return {ok:true,authen:true,message:'athuentication person',data:verify};
    else return {ok:false,authen:false,message:'athuentication personal only access this url'};
}
async function verifyApi(req,res,next) {
    try{
        let cookie =await req.cookies['myoption'] || null;
        if(!cookie) return res.send({ok:false,message:'sorry ,you aren`t athuentication person ',authen:false});
        let verify=await verifyToken(cookie);
        let userId=verify.data.idUser;
        let valid=await UserModel.findById({_id:userId});
        if(!valid)return res.status(401).send({ok:false,message:'sorry you aren`t athuentication person ',authen:false})
        if(!verify.ok) return res.send({ok:false,message:'you aren`t athuentication person , sorry',authen:false});
        req.body.userId=valid._id;
        req.body.userName=valid.fullname;
        next()
    }catch(e){
        if(e.message.startsWith('Cast to ObjectId failed for value')){
           return res.send({ok:false,message:"Invalid User"})
        }

        res.send({ok:false,message:e.message})
    
    }
}
// atuhen person check to redirect page or page not found
async function verifyAuthPerson(req,res,next) {
    try{
        let cookie = req.cookies['myoption'] || null;
        if(!cookie) return res.send({Authen:false,message:'You not authne'})
        let verify =await jwt.verify(cookie,process.env.JWT_SECRET);
        let data=verify.idUser;
        let valid=await UserModel.findById({_id:req.params.id}) || null;
        if(!valid)return res.send({ok:false,message:'<h1>Sorry this page not avaliable</h1>'})
        if(valid && valid.fullname!=req.params.name) return res.send({ok:false,message:`<h1>Sorry this page not avaliable to ${req.params.name}</h1>`})
        if(!valid) throw {ok:false,message:'page not found'};
        next();
    }catch(e){
        let customderr=`Cast to ObjectId failed for value \"{ _id: '66df1c33998b8a3685582c2' }\" (type Object) at path \"_id\" for model \"User\"`;
        if(e.message.startsWith('Cast to ObjectId failed for value')){
           return res.send({ok:false,message:"Invalid User"})
        }

        res.send({ok:false,message:e.message})
    }
}

module.exports={verifyToken,verifyAuthPerson,verifyApi};