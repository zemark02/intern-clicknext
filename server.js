const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const _path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')

dotenv.config({path:'./config/config.env'})

connectDB();

const app = express();
app.set('views',_path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(_path.join(__dirname, 'public')))

//add cookie parser
app.use(cookieParser());
app.use(session({secret:process.env.SESSION,resave:false,saveUninitialized:false}))


const auth = require('./routes/auth')
const bank = require('./routes/bank')
const transaction = require('./routes/transaction')
app.use(express.json())
app.use('/',auth)
app.use('/',bank)
app.use('/',transaction)


const PORT  = process.env.PORT || 3318

const server = app.listen(PORT ,()=>{
    console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`);
})

process.on('unhandledRejection',(err,Promise)=>{
    console.log(`Error : ${err.message}`);
    server.close(()=>process.exit(1));
})