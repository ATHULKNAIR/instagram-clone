const mongoose = require('mongoose');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');

const postCtrl = {

    getPosts : async (req,res)=>{
        try {
            const posts = await Post.find();
         
            res.status(200).json({success : true, data:posts});
           
        } catch (err) {
            return res.status(500).json({msg:err.msg})
        }   
    },

    getPost : async (req,res)=>{
        try {
           const post = await Post.findById(req.params.id)
           .populate({path : "comments",select:"text", populate:{path:"user",select:"username photo"}})
           .populate({path:"user",select:"username photo"})
           .lean()
           .exec(); 

           if(!post){
               return res.status(404).json({message:"No post found for this id"})
           }

           const likes = post.likes.map((like)=>like.toString());
           post.isLiked = likes.includes(req.user.id);

           post.comments.forEach((comment)=>{
               comment.isCommentMine = false;
               const userStr = comment.user._id.toString();
               if(userStr === req.user.id){
                   comment.isCommentMine = true;
               }
           });
           res.status(200).json({success : true , data: post});
        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    },

    deletePost : async (req,res)=>{
        try {
            const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message:"No post found for this id"});
        }      

        if(post.user.toString() !== req.user.id){
            return res.status(401),json({message:"Your cannot delete this post"})
        }
        await User.findByIdAndUpdate(req.user.id,{
            $pull :  {posts: req.params.id},
            $inc : {postCount : -1}
        });
        await post.remove();
        res.status(200).json({success: true , data :{}});
        } catch (err) {
            return res.status(500).json({message:err.message});
        }
    },

    addPost : async (req,res)=>{
       try {
        const {caption, files, tags} = req.body;
        const user = req.user.id;

        let post = await Post.create({caption , files, tags, user});

        await User.findByIdAndUpdate(req.user.id,{
            $push:{posts:post._id},
            $inc : {postCount : 1}
        });

        post = await post.populate({path:"user", select:"photo username fullname"})
        .execPopulate();

        res.status(200).json({success:true, data:post});
       } catch (err) {
           res.status(500).json({message:err.message})
       }
    },

    toggleLike : async (req,res)=>{
        try {
            const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message:"No post found"})
        }
        
        if(post.likes.includes(req.user.id)){
            const index = post.likes.indexOf(req.user.id);
            post.likes.splice(index,1);
            post.likesCount = post.likesCount -1;
            await post.save();
        }else{
            post.likes.push(req.user.id);
            post.likesCount = post.likesCount + 1;
            await post.save();
        }
        res.status(200).json({success: true , data:{}});
        } catch (err) {
            return res.status(500).json({message:err.message})
        }
    },

    addComment : async (req,res)=>{
        try {
           const post = await Post.findById(req.params.id);
           if(!post){
               return res.status(404).json({message:"No post found.."})
           } 

           let comment = await Comment.create({
               user : req.user.id,
               post : req.params.id,
               reply : req.body.reply
           });

           post.comments.push(comment._id);
           post.commentsCount = post.commentsCount +1 ;
           await post.save();

           comment = await comment.populate({path : "user",select : "photo username fullname"})
           .execPopulate();
           res.status(200).json({success : true, data: comment});
        } catch (err) {
            return res.status(500).json({message:err.message})
        }
    },

    deleteComment : async (req,res)=>{
       try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message:"No post found.."});
        }

        const comment = await Comment.findOne({
            _id:req.params.commentId,
            post : req.params.id
        });

        if(!comment){
            return res.status(404).json({message:"No comment found.."});
        }
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({message:"You cannot delete this comment"})
        }

        const index = post.comments.indexOf(comment._id);
        post.comments.splice(index,1);
        post.commentsCount = post.commentsCount -1;
        await post.save();

        await comment.remove();
        res.status(200).json({success : true,data : {}});
        
       } catch (err) {
           return res.send(500).json({message:err.message});
       }
    },

    searchPost : async (req,res)=>{
        try {
            if(!req.query.caption && !req.query.tag){
                return res.status(400).json({message:"Please enter caption or tag"});
            }
            let posts = [];
            if(req.query.caption){
                const regex = new RegExp(req.query.caption,"i");
                posts = await Post.find({caption : regex});
            }
            if(req.query.tag){
                posts = posts.concat([await Post.find({tags : req.query.tag})]);
            }
            res.status(200).json({success : true, data: posts});
        } catch (err) {
            return res.status(500).json({message:err.message});
        }
    }

}

module.exports = postCtrl;