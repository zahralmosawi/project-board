//IMPORTS
const express = require('express')
const app = express()
const morgan = require('morgan')
const methodOverride = require('method-override')
const dotenv = require('dotenv').config()
const conntectToDB = require('./config/db')
const session = require('express-session')
const projectRoutes = require('./routes/projectRoutes')
const authRoutes = require('./routes/userRoutes')
const isSignedIn = require('./middleware/isSignedIn')
const passUserToView = require('./middleware/passUserToView')
const homeRoutes = require('./routes/home-routes')


//Middleware
const path = require('path') // For path manipulation
app.use(express.static(path.join(__dirname, 'public'))) 
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.set('view engine', 'ejs') //more specific on which view engine we are using
// Session configuration
app.use(session({secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))
app.use(passUserToView)

// Connect to database
conntectToDB()

// Routes
app.get('/', (req,res)=>{
    res.render('landing')
})

app.use('/home', homeRoutes)
app.use('/auth', authRoutes)

app.use(isSignedIn) //All routes below this middleware require authentication
app.use('/project', projectRoutes)


//PORT
const port = process.env.PORT || 3000

const server = app.listen(port,()=>{
    console.log("Listening on port " + port)
})

// Error handling
server.on('error', (error)=>{
    if(error.code === "EADDRINUSE"){
        console.error(`Port ${port} is already in use.`)
    }else{
        console.error('Server error: ', error.message)
    }
})