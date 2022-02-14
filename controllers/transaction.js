const Transaction = require("../models/Transaction");
const Bank = require("../models/Bank")

//@desc create withdraw transaction
//@route Post /withdraw/:id
//@access Private
exports.withDraw = async (req,res,next)=>{
    try{
        const bank = await Bank.findById(req.params.id)
        let {amount} = req.body
        amount = amount.trim()
    
        if(!bank){
            return res.status(400).json({success:false,message:"Invalid bank account"})
        }
        
        const ownBank = await checkOwnBank(req.user,req.params.id)
        if(!ownBank){
            return res.status(400).json({success:false,message:"Cannot withdraw by other bank account"})
        }
        
 

        const validAmount = Number.parseInt(amount)
        if(!validAmount){
            return res.status(400).json({success:false,message:"Please specify amount"})
        }   

        if( amount != validAmount || validAmount < 0  ){
            return res.status(400).json({success:false,message:"Inavlid amount"})
        }

        if(bank.balance < validAmount ){
            return res.status(400).json({success:false,message:"Insufficient balance"})
        }



        bank.balance = bank.balance - validAmount
        await bank.save();
        const transaction = await Transaction.create({
            action:"withdraw",
            amount:validAmount,
            from:bank.id
        })
        

        return res.status(200).redirect(`/Bank/${req.params.id}`)

    }catch(err){
        console.log(err.stack);
        res.status(400).json({success:false,message:"Cannot withdraw"})
    }
}

//@desc create deposit transaction
//@route Post /deposit/:id
//@access Private
exports.deposit = async (req,res,next)=>{
    try{
        const bank = await Bank.findById(req.params.id)
        const {amount} = req.body
        
    
        if(!bank){
            return res.status(400).json({success:false,message:"Invalid bank account"})
        }
        
        const ownBank = await checkOwnBank(req.user,req.params.id)
        if(!ownBank){
            return res.status(400).json({success:false,message:"Cannot deposit by other bank account"})
        }

        const validAmount = Number.parseInt(amount)
        if(!validAmount){
            return res.status(400).json({success:false,message:"Please specify amount"})
        }   

        if( amount != validAmount || validAmount < 0  ){
            return res.status(400).json({success:false,message:"Inavlid amount"})
        }




        bank.balance = bank.balance + validAmount
        await bank.save();
        const transaction = await Transaction.create({
            action:"deposit",
            amount:validAmount,
            to:bank.id,
        })
        

        return res.status(200).redirect(`/Bank/${req.params.id}`)

    }catch(err){
        console.log(err.stack);
        res.status(400).json({success:false,message:"Cannot deposit"})
    }
}

//@desc create deposit transaction
//@route Post /transfer/:id
//@access Private
exports.transfer = async (req,res,next)=>{
    try{

        const {amount , bankName , accountNumber } = req.body
        
        const bank = await Bank.findById(req.params.id)
        const recipentBank = await Bank.findOne({bankName:bankName,accountNumber:accountNumber})
        
        if(!bank){
            return res.status(400).json({success:false,message:"Invalid bank account"})
        }

        if(!recipentBank){
            return res.status(400).json({success:false,message:"Inavlid recipient bank account"})
        }
        
        const ownBank = await checkOwnBank(req.user,req.params.id)
        if(!ownBank){
            return res.status(400).json({success:false,message:"Cannot tranfer by  other bank account"})
        }

        const validAmount = Number.parseInt(amount)

        if(!validAmount){
            return res.status(400).json({success:false,message:"Please specify amount"})
        }   
 
        if( amount != validAmount || validAmount > bank.balance  ){
            return res.status(400).json({success:false,message:"Inavlid amount"})
        }



        bank.balance = bank.balance - validAmount
        recipentBank.balance = recipentBank.balance + validAmount
        await bank.save();
        await recipentBank.save();

        const transaction = await Transaction.create({
            action:"transfer",
            amount:validAmount,
            from:bank.id,
            to:recipentBank.id
        })
        

        // return res.status(200).json({success:true,data:{from:bank,to:recipentBank},transaction:transaction})
        return res.status(200).redirect(`/Bank/${req.params.id}`)

    }catch(err){
        console.log(err.stack);
        res.status(400).json({success:false,message:"Cannot transfer"})
    }
}


//@desc Get transaction
//@route Get /transaction/:id
//@access Public
exports.getTransactions = async (req,res,next)=>{
    const bank = await  Bank.findById(req.params.id)

    if(!bank){
        return res.status(400).json({success:false,message:"Invalid bank account id"})
    }

    const ownBank = await checkOwnBank(req.user,req.params.id)
    if(!ownBank){
        return res.status(400).json({success:false,message:"Cannot get other bank account"})
    }

    const paymentWithdraw = await Transaction.find({from:bank.id,action:"withdraw"}).select("amount createdAt").sort("+createdAt")

    const paymentDeposit = await Transaction.find({to:bank.id,action:"deposit"}).select("amount createdAt").sort("+createdAt")

    const transferDeposit = await Transaction.find({to:bank.id,action:"transfer"}).select("amount from amount createdAt").populate({
        path:"from",
        select:"bankName user",
        populate:{
            path:"user",
            select:"firstname lastname"
        }
    }).sort("+createdAt")

    const transferWithdraw = await Transaction.find({from:bank.id,action:"transfer"}).select("amount to amount createdAt").populate({
        path:"to",
        select:"bankName user",
        populate:{
            path:"user",
            select:"firstname lastname"
        }
    }).sort("+createdAt")

    return res.status(200).json({success:true,data:{paymentWithdraw,paymentDeposit,transferDeposit,transferWithdraw}})
    // const transactionDeposit = await Transaction.find({from:bank.id,action:"deposit"})
    // const transactionTransferRecieve = await Tra

}

const checkOwnBank = async (user,bankId)=>{
    const bank  = await Bank.findById(bankId).populate({
        path:"user",
        select:"_id"
    })


    if(bank.user.id != user.id){
        return false
    }

    return true
}


