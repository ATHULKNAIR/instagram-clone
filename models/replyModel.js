const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const replySchema = new mongoose.Schema({
    user: {
        type : ObjectId,
        ref: "User",
        required : true
    },
    stories : {
        type :ObjectId,
        ref : "Stories",
        required: true
    },
    reply : {
        type :String,
        required : true
    },
    createdAt : {
        type :Date,
        default : Date.now
    }
});

module.exports = mongoose.model("Reply",replySchema);