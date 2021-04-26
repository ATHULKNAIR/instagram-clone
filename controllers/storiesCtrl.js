
const Stories = require('../models/storiesModel');
const User = require('../models/userModel');
const Reply = require('../models/replyModel');


const storiesCtrl = {


    addStories : async (req,res)=>{
        try {
            const {stories, text,tags} = req.body;
            const user = req.user.id;
            
            let story = await Stories.create({stories ,text ,tags ,user});
            await User.findByIdAndUpdate(req.user.id,{
                $push:{stories : stories._id}
            })
            story = await story.populate({path : "user", select :"photo username"})
            .execPopulate();
            res.status(500).json({success:true,data:story});
        } catch (err) {
            return res.status(500).json({msg:err.message});
        }
    },
    deleteStories : async (req,res)=>{
        try {
            const story = await Stories.findById(req.params.id);
            if(!story){
                return res.status(400).json({message:"No story found"})
            }if(story.user.toString() !== req.user.id){
                return res.status(400).json({message:"You cannot delete this story"})
            }
            await User.findByIdAndUpdate(req.user.id,{
                $pull : {stories : req.params.id}
            })
            await story.remove();
            res.status(200).json({success:true,message:"Story deleted"})
        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    },
    getStories : async (req,res)=>{

        try {
           const stories = await Stories.find();
           res.status(200).json({data :stories}); 
        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    },

    giveReply : async (req,res)=>{
        try {
           const stories = await Stories.findById(req.params.id);
           if(!stories) {
               return res.status(404).json({message:"No story found"});
           } 

           let reply = await Reply.create({
               user: req.user.id,
               stories : req.params.id,
               reply : req.body.reply
           });

           stories.replies.push(reply._id);
           await stories.save();

           reply = await reply.populate({path:"user",select:"photo username"})
           .execPopulate();
           res.status(200).json({success:true, data: reply});
        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    }

}

module.exports = storiesCtrl;