require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error',(error)=>console.error(error))
db.once('open',()=>console.log("Connected to database"))

app.use(express.json())
const shoppingRouter = require('./routes/skillsync')
app.use('/skillsync',shoppingRouter)

app.listen(3000,()=> console.log('server started'))