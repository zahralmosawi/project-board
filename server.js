//IMPORTS
const express = require('express')
const app = express()
const morgan = require('morgan')
const methodOverride = require('method-override')
const dotenv = require('dotenv').config()
const conntectToDB = require('./config/db')
const session = require('express-session')
const projectRoutes = require('./routes/project.routes')
const authRoutes = require('./routes/userRoutes')
const isSignedIn = require('./middleware/isSignedIn')

//Middleware
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.set('view engine', 'ejs') //more specific on which view engine we are using
//
app.use(session({secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))

conntectToDB()

//Routes
app.use('/auth', authRoutes)
app.use(isSignedIn) 
app.use('/projects', projectRoutes)


const port = process.env.PORT || 3000

const server = app.listen(port,()=>{
    console.log("Listening on port " + port)
})

//log error in the terminal if the port is used
server.on('error', (error)=>{
    if(error.code === "EADDRINUSE"){
        console.error(`Port ${port} is already in use.`)
    }else{
        console.error('Server error: ', error.message)
    }
})