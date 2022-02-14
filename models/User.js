const bcrypt = require('bcryptjs')
const mongoose  = require('mongoose')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:[true,'Please add a name']
    },

    lastname:{
        type:String,
        required:[true,'Please add a name']
    },
    username:{
        type:String,
        required:[true,"Please add a username"],
    },
    password:{
        type:String,
        required:[true,'Please add a password'],
        minlength:6,
        select:false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }

})

UserSchema.pre("save",async function(){
    const salt = await bcrypt.genSalt(Number.parseInt(process.env.salt));
    this.password = await bcrypt.hash(this.password,salt);
})

UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
}

UserSchema.methods.matchPassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword,this.password)
}

module.exports = mongoose.model('User',UserSchema)