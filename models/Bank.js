
const mongoose  = require('mongoose')


const BankSchema = new mongoose.Schema({
      bankName:{
          type:String,
          enum:["Kasikorn Bank","Siam Commercial Bank","Bangkok Bank","TMB Bank","Krungthai Bank"],
          required:[true,"Please specify a bank name"]
      },
      accountNumber:{
          type:String,
          require:[true,"Please add a account number"],
          unique:true,
          length:[10,"Please add a valid account number"],
          minlength:10,
          maxlength:10
      },
      balance:{
          type:Number,
          required:true,
          default:1000
      },
      user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true      
      }


})

module.exports = mongoose.model('Bank',BankSchema)