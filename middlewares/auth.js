const jwt = require('jsonwebtoken')
const User = require('../models/User')

//Protect routes
exports.protect = async (req,res,next)=>{
    let token = req.headers.cookie

    if(!token){
        return res.status(401).render('login' , {data:{success:false,message:"Please Login"}})
    }

    token = token.split("token=")
    if(token.length <= 0 ) {
        return res.status(401).render('login' , {data:{success:false,message:"Please Login"}})
    }

    token = token[1].trim();

    try{
        const decode = await jwt.verify(token,process.env.JWT_SECRET)

        console.log(decode);

        req.user = await User.findById(decode.id);

        next()
    }catch(err){
        console.log(err.stack);
        return res.status(401).render('login' , {data:{success:false,message:"Please Login"}})
    }
}

