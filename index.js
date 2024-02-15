const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
require("dotenv").config();
const mongoose = require('mongoose');
const port = process.env.PORT || 4000;
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/demo');

  console.log('db connected')
}
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneno: Number,
    selectedDate: Date
});

const User = mongoose.model('User', userSchema);
const server = express();
server.use(cors());
server.use(bodyParser.json());

// Create
server.post('/api',async (req,res)=>{
  
  let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.phoneno = req.body.phoneno;
    user.selectedDate = req.body.selectedDate;
    const doc = await user.save();
    console.log(doc);
  });
   
server.post('/api', (req, res) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port:465,
    secure:true,
    debuger:true,
    logger:true,
    secureConnection:false,
    auth: {
      user: process.env.USER ,
      pass: process.env.APP_PASSWORD,
    },
    tls:{
      rejectUnAuthorized:true
    },
  });
  
  const mailOptions = {
    from: {name:"Welcome Mail", address:process.env.USER}, 
    to: req.body.email, 
    subject: "Hello ✔",
    text: "Hello world?", 
    html: "<b>Hello world?</b>",
  }
  
  const sendMail=async(transporter, mailOptions)=>{
    try {
        await transporter.sendMail(mailOptions)
        console.log("mail sended");
    } catch (error) {
        console.log(error);
        
    }}
  sendMail(transporter,mailOptions);


  const phoneNumber = req.body.phoneNumber;
  const phoneRegex = /^\+(?:[0-9]●?){6,14}[0-9]$/;
  if (phoneRegex.test(phoneNumber)) {
    res.json({ valid: true, message: 'Phone number is valid.' });
  } else {
    res.send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="0; url=/invalidPage.html">
        </head>
        <body>
          <p>Redirecting to invalid page...</p>
        </body>
      </html>
    `);
  }
});


server.get('/api',async (req,res)=>{
    const docs = await User.find({});
    res.json(docs)
})


server.listen(port,()=>{
    console.log('server started')
    console.log(port)
})
