const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/connectDB')
const router = require('./routes/index')
const cookiesParser = require('cookie-parser')
const {app , server} = require('./socket/index')

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,             
  };
  
app.use(cors(corsOptions));
app.options('*', cors()); // Handle preflight requests

app.use(express.json())
app.use(cookiesParser())
const PORT = process.env.PORT || 8080

app.get("/",(request,response)=>{
    response.json({
        message : "server running at " + PORT
    })
})

//api endpoints
app.use('/api',router)

connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log("server running at " + PORT)
    })
})
