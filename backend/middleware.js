const express = require('express')
const {JWT_SECRET} = require("./config")
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())

const authMiddleware = (req, res, next) => {
    const authHeader  = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }
        const token = authHeader.split(' ')[1]
        try {
            const decoded = jwt.verify(token, JWT_SECRET)            
            req.userId = decoded.userId
            next() 
        }
        catch(error){
             
            console.error('JWT Verfication error', error.message)
            console.log("JWT Token", JWT_SECRET)
            return res.status(403).json({});
        }

}

module.exports = {
    authMiddleware
}