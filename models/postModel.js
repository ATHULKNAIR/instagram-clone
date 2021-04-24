const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    caption :{
        type : String,
        required:  [true,"Please enter a caption"]
    },
    tags:{
        type: [String]
    },
    files : {
        type: [String],
        validate : (v)=> v===null || v.length >0
    },
    likes:[{
        type: ObjectId,
        ref : "User"
    }],
    likesCount : [{
        type: Number,
        default :0
    }],
    comments: [{
        text : String,
        
    }],
    commentsCount : {
        type: Number,
        default :0
    },
   user : {
        type : ObjectId,
        ref : "User"
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Post",postSchema);