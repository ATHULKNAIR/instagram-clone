const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const storiesSchema = new mongoose.Schema({
    user : {
        type : ObjectId,
        ref:"User"
    },
    stories : {
        type:[String],
        validate : (v)=> v==null || v.length >0
    },
    text : {
        type :String
    },
    tags : {
        type: [String]
    },
    replies:[{
        text:String,
        type:ObjectId,
        ref:"Reply"
    }]

},{
    timestamps :true
});

module.exports = mongoose.model("Stories",storiesSchema)
