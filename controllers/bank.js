const Bank = require("../models/Bank");
const Transaction = require('../models/Transaction')
//@desc create bank
//@route Post /addBankAccount
//@access Private
exports.addBankAccount = async (req, res, next) => {
  try {
    const { bankName, accountNumber } = req.body;
    let checkDigit = true
    checkDigit = [...accountNumber].every(data=>{
      if(! ["1","2","3","4","5","6","7","8","9","0"].includes(data)) return false
    })

    if(!checkDigit){
      return res.status(400).redirect("/Banks?createSuccessfully=false");
    }
    const bank = await Bank.create({
        bankName: bankName,
        accountNumber: accountNumber,
        user:req.user.id
    });
    res.createFail = false
    res.status(200).redirect("/Banks?createSuccessfully=true")

  } catch (err) {
    console.log(err.stack);

    res.status(400).redirect("/Banks?createSuccessfully=false");
  }
};

//@desc login
//@route Get /Bank/:id
//@access Public
exports.getBank = async (req, res, next) => {

  const  id  = req.params.id;

  if (!id ) {
    return res
      .status(400)
      .json({ success: true, msg: "Invalid id to get bank account" });
  }

  const bank = await Bank.findById(id).populate({
      path:"user",
      select:"firstname lastname username _id"
  })

  if (!bank) {
    return res.status(400).json({ success: false, message: "Invalid id to get bank account" });
  }

  if(bank.user.id != req.user.id){
      return res.status(400).json({success:false,message:"Cannot get other bank"})

  }

  getTransactions(req,res,next,bank)
};


const getTransactions = async (req,res,next,bank)=>{


  const ownBank = await checkOwnBank(req.user,bank.id)
  if(!ownBank){
      return res.status(400).json({success:false,message:"Cannot get other bank account"})
  }

  const paymentWithdraw = await Transaction.find({from:bank.id,action:"withdraw"}).select("amount createdAt action").sort("-createdAt")

  const paymentDeposit = await Transaction.find({to:bank.id,action:"deposit"}).select("amount createdAt action").sort("-createdAt")

  const transferDeposit = await Transaction.find({to:bank.id,action:"transfer"}).select("amount from amount createdAt action").populate({
      path:"from",
      select:"bankName user",
      populate:{
          path:"user",
          select:"firstname lastname"
      }
  }).sort("-createdAt")

  const transferWithdraw = await Transaction.find({from:bank.id,action:"transfer"}).select("amount to amount createdAt action").populate({
      path:"to",
      select:"bankName user",
      populate:{
          path:"user",
          select:"firstname lastname"
      }
  }).sort("-createdAt")
  
  console.log(transferWithdraw);
  // return res.status(200).json({success:true,data:{paymentWithdraw,paymentDeposit,transferDeposit,transferWithdraw,bank:bank}})
  return res.status(200).render("bank",{success:true,data:{paymentWithdraw,paymentDeposit,transferDeposit,transferWithdraw,bank:bank}})

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



//@desc login
//@route Get /Banks
//@access Private
exports.getBanks = async (req,res,next)=>{
  try{
    const {createSuccessfully} = req.query
    const banks = await Bank.find({user:req.user.id}).populate({
      path:"user",
      select:"firstname lastname username _id"
    })

    return res.status(200).render("feed",{data:{success:true,banks:banks,createSuccessfully:createSuccessfully}})
  }catch(err){
    console.log(err.stack);
    return res.status(400).json({success:false,message:"conflict server"})
  }
}




//@desc login
//@route Delete /deleteBank/:id
//@access Private
exports.deleteBank = async (req,res,next)=>{
  try{
    const id = req.params.id
    if(!id){
      return res.status(400).json({success:false,message:"Invalid id"})
    }

    const bankAccount = await Bank.findById(id).populate({
      path:'user',
      select:"_id"
    });
    if(!bankAccount){
      return res.status(400).json({success:false,message:"Cannot find an id for delete bank account"})
    }

    if(req.user.id != bankAccount.user.id){
      return res.status(400).json({success:false,message:"Cannot delete other bank account"})
    }

    await bankAccount.remove();

    res.status(200).json({success:true,data:{}})


  }catch(err){
    console.log(err.stack);
  }
}

