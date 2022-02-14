const mongoose  = require('mongoose')


const TransactionSchema = new mongoose.Schema({
    action:{
        type:String,
        enum:["withdraw","deposit","transfer"],
        require:true
    },
    from:{
        type:mongoose.Schema.ObjectId,
        ref:"Bank", 
    },
    to:{
        type:mongoose.Schema.ObjectId,
        ref:"Bank",
    },
    amount:{
        type:Number,
        required:[true,"Please spicify amount"],
        min:0
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model('Transaction',TransactionSchema)