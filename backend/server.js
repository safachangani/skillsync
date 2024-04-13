require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const corsOptions ={
    origin:'http://localhost:3000' || 'http://localhost:3001', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.use(express.json())
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error',(error)=>console.error(error))
db.once('open',()=>console.log("Connected to database"))

const skillSycRouter = require('./routes/skillsync')
app.use('/skillsync',skillSycRouter)

app.listen(9000,()=> console.log('server started'))