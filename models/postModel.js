const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title :{
        type : String,
        required:  true
    },
    body:{
        type: String
    },
    image : {
        type: String,
        required : true
    },
    likes:[{
        type: ObjectId,
        ref : "User"
    }],
    comments: [{
        text : String,
        postedBy : {
            type :ObjectId,
            ref : "User"
        }
    }],
    postedBy : {
        type : ObjectId,
        ref : "User"
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Post",postSchema);