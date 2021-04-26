const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username :{
        type: String,
        required : [true,"Please enter your username"],
        unique:true
    },
    fullname:{
        type : String,
        required: [true,"Please enter your fullname"]
    },
    email : {
        type: String,
        required : [true,"Please enter your Email"],
        unique:true
    },
    password : {
        type: String,
        required :[true,"Please enter your password"],
        minlength:[6,"Password should be more than 6 characters"]
    },
    photo :{
        type: String,
        // default : 
    },

    aboutMe : String,

    followers : [{
        type : ObjectId,
        ref :"User"
    }],
    followersCount : {
        type : Number,
        default : 0
    },
    following : [{
        type : ObjectId,
        ref : "User"
    }],
    followingCount : {
        type: Number,
        default :0
    },
    posts : [{
        type : ObjectId,
        ref :"Post"
    }],
    postCount : {
        type: Number,
        default :0
    },
    stories :[{
        type: ObjectId,
        ref:"Stories"
    }],
    createdAt : {
        type: Date,
        default : Date.now
    }
});


module.exports = mongoose.model("User",userSchema);