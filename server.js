// const express = require("express");
//  const bodyParser = require("body-parser");
// const mongoclient=require('mongodb').MongoClient;
// const app= new express();
// app.use(express.static("./public"));
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("./public"));
// app.use(bodyParser.urlencoded({extended: true}));
// const url='mongodb://127.0.0.1:27017';
// const client=new mongoclient(url,{useNewUrlParser:true,useUnifiedTechnology:true});

// async function test(){
//   try{
//     await client.connect();
//     console.log('connected');
//   }catch(error){
//     console.log('successfully connected');
//   }
// }
// test();
// // const dbname='myproject';
// // mongoclient.connect(url,(err,client)=>{
// //     if(err) throw err;
// //     const db=client.db(dbname);
// //     app.listen(3000,()=>{ console.log("Server up and running on port 3000")});

// // })

// // app.post('/forms1', function(req, res) {
// //     const collection = db.collection('userDetails');
// //     const user = {
// //       name: req.body.username,
      
// //       password: req.body.password
// //     };
  
// //     collection.insertOne(user, function(err, result) {
// //       if (err) throw err;
  
// //       res.send('User created');
// //     });
// //   });

// const crypto = require('crypto');

// // Generate a random 32-byte secret key
// const secretKey = crypto.randomBytes(32).toString('hex');

// console.log(secretKey);




// app.get('/',(req,res)=>{
//     res.sendFile("./views/index.html",{root:__dirname});
// });
// // app.get('/home',(req,res)=>{
// //     res.sendFile("./views/home.html",{root:__dirname});
// // });
// app.get('/forms1',(req,res)=>{
//     res.sendFile("./views/forms1.html",{root:__dirname});
// });
// app.get('/viewDetails',(req,res)=>{
//     res.sendFile("./views/viewDetails.html",{root:__dirname});
// });
// app.get('/verify',(req,res)=>{
//     res.sendFile("./views/verify.html",{root:__dirname});
// });


const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/member');
const app = express();
const port = 3001;

//mongodb connection
mongoose.connect('mongodb://127.0.0.1:27017/myproject', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(`Error connecting to MongoDB: ${err}`));

app.use(bodyParser.json());

app.use(express.static("./public"));
app.use(bodyParser.urlencoded({extended: true}));
app.get('/',(req,res)=>{
  res.sendFile("./views/index.html",{root:__dirname});
});
app.get('/home',(req,res)=>{
  res.sendFile("./views/home.html",{root:__dirname});
});
app.get('/signup',(req,res)=>{
  res.sendFile("./views/signup.html",{root:__dirname});
});
app.get('/login',(req,res)=>{
  res.sendFile("./views/login.html",{root:__dirname});
});
app.get('/verify',(req,res)=>{
  res.sendFile("./views/verify.html",{root:__dirname});
});


//Register new user
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send('Please fill out all fields');
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      
      return res.status(400).send(`<script>alert('User already registered');</script>`  );
    }
  
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    
    res.status(201).send( `<script>alert(' created account');</script>` );
  });


//login authentication
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log(req.body);
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send(`<script>alert('Invalid username or password');</script>`);
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).send(`<script>alert('Invalid username or password');</script>`);
    }
    const token = jwt.sign({ username }, 'secret');
    //res.status(200).send(`<script>alert('Logged in successfully')</script>`);
    res.redirect('/');
  });
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});