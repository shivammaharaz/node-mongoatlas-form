const express=require('express')
const mongoose=require('mongoose')
const { Schema, model } = require('mongoose')
const app=express();
const cors=require('cors')

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const port= process.env.PORT || 3000
const Db='mongodb+srv://Shivam:2001@cluster0.bxo7vjp.mongodb.net/DemoData';

mongoose.connect(Db).then(()=>{
    console.log('connected to atlas')
}).catch((err)=>console.log(err))

const Test= new Schema({
    __id:String,
    name:{
        type:String,
        required:[true,'full name not provided , you cannot submit data without name']
    },
    email:{
        type:String,
        unique:[true,"email already exists in database!"],
        required:[true,"email not provided , cannot submit without email"]
    },
    phone:String,
    feedback:String
})

app.get('/',(req,resp)=>{
    resp.sendFile(__dirname+"/public/index.html")
})

app.post('/signup', async(req,resp)=>{
    let formData={
        __id:req.body.id,
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        feedback:req.body.feedback
    }
    const DbModel=new model('Data',Test)
    const result= new DbModel(formData)
    const data=await  result.save()
    console.log(data)
    return resp.redirect('/')
})


app.get('/data', async (req,resp)=>{
    const DbModel=new model('Data',Test)
    const data= await DbModel.find({})
    resp.send(JSON.stringify(data))
 
})
app.get('/data/:key', async (req,resp)=>{
    const DbModel=new model('Data',Test)
    const data= await DbModel.find({
        "$or":[
            {"__id":{$regex:req.params.key}}
        ]
    })

    resp.send(JSON.stringify(data))
    
 
})
app.listen(port)
