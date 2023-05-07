const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const MongoStore = require('connect-mongo')(session); // Import the connect-mongo library

const bodyparser=require('body-parser');
const app=new express();
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(express.static("./public"));

mongoose.connect('mongodb://127.0.0.1:27017/demouser', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((error) => {
  console.log('MongoDB connection error: ${error}');
});

// const store = new MongoStore({
//     mongooseConnection: mongoose.connection,
//     collection: 'user'
//   });
app.use(session({
    secret: '3a09a3031445c3d3d9c69c4f90c34b9d311562a87752fcf1f6709c92eb962e4c',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  }));

app.get("/",(req,res)=>{
 res.sendFile("/views/index.html",{root:__dirname});
});

app.get("/viewDetails",(req,res)=>{
  res.sendFile("/views/viewDetails.html",{root:__dirname});
});

app.get("/forms1",(req,res)=>{
  res.sendFile("/views/forms1.html",{root:__dirname});
});

// app.get("/signup",(req,res)=>{
//   res.sendFile("signup.html",{root:__dirname});
// });

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  });

  const User = mongoose.model('User', userSchema);


  app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
  
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
  
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
  
    await newUser.save();
  
    req.session.user = newUser;
    res.json(newUser);
  });


app.listen(3000,()=>{console.log("server listening on port 3000")});