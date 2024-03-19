const mongoose = require('mongoose')
const { Schema } = require('zod')
mongoose.connect('mongodb+srv://shivdev:1234567890@devcluster.nsg2kp7.mongodb.net/coinstack')


const UserSchema = new mongoose.Schema({
    
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
})

const AccountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : "User",
        required : true,
    } ,
    balance : {
       type :  Number,
       required : true
    }
})

const Account = mongoose.model('Account', AccountSchema)
const User = mongoose.model('User', UserSchema)


module.exports = {
    Account,
    User
}