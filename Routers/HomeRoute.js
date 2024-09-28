let UserModel = require('../Model/UserModel');
let Route = require('express').Router();
let {verifyApi} = require('../Auth/tokenAuthen')
let TopicModel = require('../Model/TopicsModel');
const { default: mongoose } = require('mongoose');

// verified *

Route.get('/authperson',verifyApi,(req,res,next)=>{
    res.send({ok:true,message:'Your are Auhtenticated person',authen:true,dashboardUrl:`/${req.body.userName}/${req.body.userId}`})
})
Route.get('/home/topics/:id',verifyApi,async(req,res,next)=>{
    try{
        let id= req.params.id;
        let data = await UserModel.findOne({_id:id}).populate('topics.topicsId');
        if(!data) return res.send({ok:false,message:'Invalid user data'});
        let topics = data.topics;
        res.send({ok:true,message:'topics get successfully',datas:{topics}})
    }catch(e){
        let message;
        if(e.message.startsWith('Cast to ObjectId failed for value')){
           return res.send({ok:false,message:"Invalid User"})
        }
        if(e.message.includes(':')){
            message=e.message.split(':');
            message.shift();
            message= message.join(':');
        }else{
            message=e.message;
        }
    res.send({ok:false,message})
      
    }
});
 
// verified *
Route.post('/createTopics/:id',verifyApi,async(req,res,next)=>{
    try{
        let body=req.body;
        let id=req.params.id;
        if(!body.QandA) throw {ok:false,message:'QandA is required'}
        let userdata=await UserModel.findById({_id:id});
        if(!userdata) return res.send({ok:false,message:'Sorry Invalid user'});
        let topicsName=body.topics;
        let {topics}=await UserModel.findById({_id:id}).populate('topics.topicsId');
        let find=await topics.find( data => data.topicsName==topicsName);
        
        if(find != undefined) return res.send({ok:false,message:'Sorry Topics Name is already use so you another use or edit to add question'})
        let topicsdata=await new TopicModel(body).save();
        let save=await  UserModel.findOneAndUpdate({_id:id},{topics:[...userdata.topics,{topicsName:topicsdata.topics,topicsId:new mongoose.Types.ObjectId(topicsdata._id)}]})
        if(!topicsdata) return res.send({ok:false,message:'sorry topics not insert server problem'})
            res.send({ok:true,"message":" topics add successfully"})
    }catch(e){
        let message;
        if(e.message.startsWith('Cast to ObjectId failed for value')){
           return res.send({ok:false,message:"Invalid User"})
        }
        if(e.message.includes(':')){
            message=e.message.split(':');
            message.shift();
            message= message.join(':');
        }else{
            message=e.message;
        }
    res.send({ok:false,message})
      }
});
// verified * edit button and home start
Route.get('/topics/QandA/:id',verifyApi,async(req,res,next)=>{
    try{
        let id = req.params.id;
        let QandA=await TopicModel.findById({_id:id});
        if(!QandA) return res.send({ok:false,message:'Invalid user to topics data'});
        res.send({ok:true,message:'get topics successfully',data:QandA})
    }catch(e){
        let message;
        let customderr=`Cast to ObjectId failed for value"`;
        if(e.message.startsWith(customderr)){
           return res.send({ok:false,message:"Invalid Id"})
        }
        if(e.message.includes(':')){
            message=e.message.split(':');
            message.shift();
            message= message.join(':');
        }else{
            message=e.message;
        }
        res.send({ok:false,message})
    }
})
// Verified * add topics to questions and answer
Route.put('/addNewQuestion/:id',verifyApi,async function(req,res,next){
    let id=req.params.id;
    try{
        let body = req.body;
        if(!body.question) throw {ok:false,message:'Question is Required'}
        if(!body.answer) throw {ok:false,message:'Answer is Required'}
        let data=await TopicModel.findById({_id:id});
        if(!data) return res.send({ok:false,message:'sorry ! Invalid Id in topic'});
        let {QandA} = data;
        let copyData=[...QandA,body];
        let update=await TopicModel.findByIdAndUpdate({_id:id},{QandA:copyData});
        if(!update) return res.send({ok:false,message:'sorry Invalid id'});
        res.send({ok:true,message:'add successfully',data:body});
    }catch(e){
        res.send({ok:false,message:e.message})
    }

})
// verified * topics question delete ok
Route.delete('/removeTopicsQuestion/:id',verifyApi,async(req,res,next)=>{
    try{
        let id=req.params.id;
        let body=req.body;
        let data=await TopicModel.findById({_id:id});
        if(!data) return res.send({ok:false,message:'sorry ! Invalid Id in topic'});
        let {QandA} = data;
        if(body.index >= QandA.length) return res.send({ok:false,message:'sorry invalid index'});
        let copyData=[...QandA];
        let problem=copyData.splice(body.index,1);
        let update=await TopicModel.findByIdAndUpdate({_id:id},{QandA:copyData});
        if(!update) return res.send({ok:false,message:'delete failed !'})
        res.send({ok:true,message:'Delete successfully',index:body.index})
    }catch(e){
        let message;

        if(e.message.includes(':')){
            message=e.message.split(':');
            message.shift();
            message= message.join(':');
        }else{
            message=e.message;
        }
    res.send({ok:false,message})
     }
})
// verified * 
Route.put('/replaceTopicsQuestion/:id',verifyApi,async (req,res,next)=>{
    try{
        const id = req.params.id;
        const body= req.body;
        let {QandA}=await TopicModel.findById({_id:id});
        if(body.index>=QandA.length) return res.send({ok:false,message:'sorry invalid index send body'});
        let copyQanA = [...QandA];
        let changeArr=copyQanA.splice(body.index,1,body.data);
        let reps=await TopicModel.findOneAndUpdate({_id:id},{QandA:copyQanA});
        if(!reps) return res.send({ok:false,message:'sorry edit data some problem to server'})
        res.send({ok:true,message:'replace successfully',data:copyQanA})
    }catch(e){
        if(e.message.startsWith('Cast to ObjectId failed for value'))return res.send({ok:false,message:'Invalid user'})
        if(e.message.startsWith(`Cannot destructure property 'QandA' of`))return res.send({ok:false,message:'Invalid user'})
            
        res.send({message:e.message})   
    }
})
// Verified * to delete topics ok fronten
Route.delete('/deleteTopics/:id',verifyApi,async(req,res,next)=>{
    try{

            const id = req.params.id;
            let data =await UserModel.findById({_id:req.body.userId});
            if(!data) return res.send({ok:false,message:'you aren`t authorization person'});
            let findData=data.topics.filter((datas) =>{ if(datas.topicsId!=id){
                return datas;
            }});
            let deletesTopicsUser=await UserModel.findByIdAndUpdate({_id:req.body.userId},{topics:findData});
            if(!deletesTopicsUser) return res.send({ok:false,message:'delete unsuccessfully 2'});
           let topic=await TopicModel.findByIdAndDelete({_id:id})
           if(!topic) return res.send({ok:false,message:'Invalid Topics Data'})
            res.send({ok:true,message:'delete successfully'})
    }catch(e){
        let message;
        if(e.message.startsWith('Cast to ObjectId failed for value')){
           return res.send({ok:false,message:"Invalid User"})
        }
        if(e.message.includes(':')){
            message=e.message.split(':');
            message.shift();
            message= message.join(':');
        }else{
            message=e.message;
        }
        res.send({ok:false,message})
       }
})
module.exports = Route;