require("dotenv").config();
const express = require('express');
const mrzRoute = require('./routes/mrz.recognize.route');
const helmet = require("helmet");
const cors = require('cors');

let app = express()

//allow cors rigin
app.use(cors())
//securite issu
app.use(helmet())
//use routes

app.get("/", (req, res)=>{res.send("OK")})

app.use(mrzRoute)
 
//transfare 404 error to error handler
app.use((req, res, next)=>{
  next({code : 404})
})

//error handler
app.use((err, req, res, next)=>{
  if(err.code){
    return res.status(err.code).json({err : err})
  }
  res.status(400)
  if (req.fileValidationError) {
    return res.send(req.fileValidationError);
  }
  if (!req.file) {
    return res.send('Please select an image to upload');
  }
  if (err) {
    return res.send(err);
  }
})

//app listen
app.listen(process.env.PORT || 8001, (err)=>{
  console.log(`server listening on port ${process.env.PORT || 8001}`);
})