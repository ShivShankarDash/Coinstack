const express = require('express')
const app = express()
const userRouter = express.Router()
const zod = require('zod')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config')
const { User, Account } = require('../db')

const signUpBody = zod.object({
    username : zod.string().email(),
    firstName : zod.string(),
    lastName : zod.string(),
    password : zod.string()
})


userRouter.post("/signup", async (req,res)=>{
    const success = signUpBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message : "Email Already Taken/Incorrect Inputs"
        })
    }

    const existingUser = await User.findOne({
        username : req.body.username
    })

    if(existingUser){
        return res.status(411).json({
            message : "Email already taken/Incorrect Inputs"
        })
    }
    const user = await User.create({
        username : req.body.username,
        password : req.body.password,
        firstName : req.body.firstName,
        lastName: req.body.lastName
    })


    const userId = user._id


    await Account.create({
        userId,
        balance : 1 + Math.random() * 10000
        
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        message : "User created successfully",
        token : token
    })
})

const signInBody = zod.object({
    username : zod.string().email(),
    password : zod.string()
})

userRouter.post("/signin", (req,res)=>{

const success = signInBody.safeParse(req.body)
if(!success){
    return res.status(411).json({
        message : "Incorrect Inputs"
    })
}
const user = User.findOne({
    username : req.body.username,
    password : req.body.password
})

if(user){
    const token = jwt.sign({userId : user._id},JWT_SECRET)
    res.json({
        token : token
    })
    return;
}

res.status(411).json({
    message : "Error while logging in"
})

})

const updatedBody = zod.object({
    password : zod.string().optional(),
    firstName : zod.string().optional(),
    lastName : zod.string().optional()
})

userRouter.put("/", async (req,res)=>{

const success = updatedBody.safeParse(req.body)
if(success){
    res.status(411).json({
        message : "Error while updating information"
    })
}

await User.updateOne({_id : req.userId},req.body)
res.json({
    message : "User updated successfully"
})

})

userRouter.get("/bulk", async (req, res)=>{
    const filter = req.query.filter || ""
    const users = await User.find({
        '$or' : [{
            firstName : {
                '$regex' : filter
            }
        }, {
            lastName : {
                '$regex' : filter
            }
        }]
    })
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })

})


module.exports = userRouter