const mongoose = require('mongoose');
const {objectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name :{
        type: String,
        required : true
    },
    email : {
        type: String,
        required : true
    },
    password : {
        type: String,
        required :true
    },
    resetToken : String,
    expireToken : Date,
    photo :{
        type: String,
        // default : 
    },
    followers : [{
        type : objectId,
        ref :"User"
    }],
    following : [{
        type : ObjectId,
        ref : "User"
    }]
})

module.exports = mongoose.model("User",userSchema);