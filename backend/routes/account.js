const express = require('express')
const { Account, User } = require('../db')
const zod = require('zod')
const { authMiddleware } = require('../middleware')
const { default: mongoose } = require('mongoose')
const app = express()
const accountRouter = express.Router()

accountRouter.get("/balance",authMiddleware,async (req,res)=>{
    const account = await Account.findOne({
        userId : req.userId
    })
    res.json({
        balance : account.balance
    })
})


accountRouter.post("/transfer", authMiddleware, async (req, res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    const {amount, to} = req.body;
    const account = await Account.findOne({userId : req.userId}).session(session)
    if(!account || account.balance < amount){
        
        await session.abortTransaction();
        return res.status(400).json({
            message : "Insufficient balance",
            userId : req.userId
        })
    }

    const toAccount = await Account.findOne({userId : to}).session(session)
    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message : "Invalid Account"
        })
    }

    try{

    await Account.findByIdAndUpdate(account._id, { $inc : {balance : -amount}}).session(session)
    await Account.findByIdAndUpdate(toAccount._id, { $inc : {balance : amount}}).session(session)
    await session.commitTransaction();   
    res.json({
        message: "Transaction successful"
    });
    }catch(error){
        await session.abortTransaction();
        res.status(500).json({ message: "Transaction failed" , error : error});
    }
    finally{
        session.endSession();
    }

})


module.exports = accountRouter