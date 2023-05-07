const express = require("express");
const mongoose=require('mongoose');
const bodyParser = require('body-parser');

const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const app=new express();

app.use(express.static("./public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',(req,res)=>{
    res.sendFile("./views/index.html",{root:__dirname});
});
app.get('/forms1',(req,res)=>{
    res.sendFile("./views/forms1.html",{root:__dirname});
});
app.get('/viewdetails',(req,res)=>{
    res.sendFile("./views/viewDetails.html",{root:__dirname});
});


//define schema
const signupschema=new mongoose.Schema({

    username:{
        type:String,
       required:true

   },
   email:{
       type:String,
       unique:true,
       required:true
   },
   password:{
       type:String,
       required:true
   },
});
//create model
const userDetails=mongoose.model('userDetails',signupschema);

mongoose.connect('mongodb://127.0.0.1:27017/myproject', {useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>{
        console.log("successfully connected");
       
        //signup user
        app.post('/submit', async (req,res)=>{
            const {username,email,password}=req.body;

            //hash password
            const saltRound=10;
            const hPassword=await bcrypt.hash(password,saltRound);

            const signupData=new userDetails({username,email,password:hPassword});
            try{
                await signupData.save();
                res.send('signup successful');
            }catch(error){
                console.error(error);
                res.status(500).send('user already exist');
            }
            
        });
        app.post('/login', async (req,res)=>{
            const {username,password}=req.body;

            //find user by mail
            const user=await userDetails.findOne({username});
            if(user && await bcrypt.compare(password,user.password)){
                const token=jwt.sign({id:user._id},'mysecretkey');
                //res.json({token});
                res.send('logged in')
            }
            else{
                res.send('invalid email or password');
            }
        });

        //example protectedroute
        app.get('/protected', authenticateToken,(req,res)=>{
            res.send('hello,${req.user.name}');
        });

        app.listen(3001,()=> console.log("Server up and running on port 3000"));

    })
    .catch((error)=>{
        console.log('error connecting to mongodb')
    });
    
    //middleware for authenticating Token
    function authenticateToken(req,res,next){
        const authHeader=req.headers['authorization'];
        const token=authHeader && authHeader.split(' ')[1];

        if(token == null) return res.sendStatus(401);
        jwt.verify(token,'mysectretkey', (err,user)=>{
            if(err) return res.sendStatus(403);

            req.user=user;
            next();
        });
    }






       