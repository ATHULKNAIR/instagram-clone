 
const Post = require('../models/postModel');
const User = require('../models/userModel');

const userCtrl = {
   
    getUsers : async (req,res)=>{
       try {
        let users = await User.find().select("-password").lean().exec();
        users.forEach((user)=>{
            user.isFollowing = false;
            const followers = user.followers.map((follower)=>follower._id.toString());
            if (followers.includes(req.user.id)){
                user.isFollowing = true;
            }
        });
        users = users.filter((user)=>user._id.toString() !==req.user.id);
        res.status(200).json({success: true, data :users})
       } catch (error) {
           res.status(500).json({message: "No user"})
       }

    },

    getUser : async (req,res)=>{
        const user = await User.findOne({username : req.params.username})
        .select("-password")
        .populate({path : "posts",select : "files commentsCount likesCount"})
        .populate({path : "savedPosts",select : "files comentsCount likesCount"})
        .populate({path : "followers",select : "photo username fullname"})
        .populate({path : "following", select : "photo username fullname"})
        .lean()
        .exec();

        if(!user){
            return res.status(404).json({message:`${req.params.username} not found`})
        }
        user.isFollowing = false;
        const followers = user.followers.map((follower)=>follower._id.toString());
        user.followers.forEach((follower)=>{
            follower.isFollowing = false;
            if(req.user.following.includes(follower._id.toString())){
                follower.isFollowing = true;
            }
        });
        user.following.forEach((user)=>{
            user.isFollowing = false;
            if(req.following.includes(user._id.toString())){
                user.isFollowing = true;
            }
        });

        if(followers.includes(req.user.id)){
            user.isFollowing = true;
        }

        user.isMe = req.user.id === user._id.toString();
        res.status(200).json({success: true, data :user});
    },

    follow : async (req,res)=>{
        const user = await User.findById(req.params.id);
        if(!user){
            res.status(404).json({message:`No User found for id : ${req.params.id}`});
        }

        if(req.params.id === req.user.id){
            return res.status(400).send("You cannot un/follow yourself");
        }
        if(user.followers.includes(req.user.id)){
            return res.status(400).json({message:"You already follow this user"})
        }

        await User.findByIdAndUpdate(req.params.id,{
            $push:{followers : req.user.id},
            $inc :{followersCount :1}
        });
        await User.findByIdAndUpdate(req.user.id,{
            $push:{following : req.params.id},
            $inc : {followingCount : 1}
        });
        res.status(200).json({success: true , message:"Followed"});
    },

    unfollow : async (req,res)=>{
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({message:`No user found for id : ${req.params.id}`});
        }
        if(req.params.id === req.user.id){
            return res.status(400).json({message:"You cannot un/follow yourself"});
        }
        await User.findByIdAndUpdate(req.params.id,{
            $pull : {followers :req.user.id},
            $inc :{followersCount :-1}
        });
        await User.findByIdAndUpdate(req.user.id,{
            $pull : {following : req.params.id},
            $inc : { followingCount :-1}
        });
        res.status(200).json({success : true, message: "unfollowed"});
    },

    feed : async (req,res)=>{
        const following = req.user.following;
        const users = await User.find()
        .where("_id")
        .in(following.concat([req.user.id]))
        .exec();

        const postIds = users.map((user)=>user.posts).flat();

        const posts = await Post.find()
        .populate({path : "comments", select : "text", populate : {path : "user", select: "photo fullname username"}})
        .populate({path : "user",select: "photo fullname username"})
        .sort("-createdAt")
        .where("_id")
        .in(postIds)
        .lean()
        .exec();

        posts.forEach((post)=>{
            post.isLiked = false;
            const likes = post.likes.map((like)=>like.toString());
            if(likes.includes(req.user.id)){
                post.isLiked = true;
            }
            
            post.isSaved = false;
            const savedPosts = req.user.savedPosts.map((post)=>post.toString());
            if(savedPosts.includes(post._id)){
                post.isSaved = true;
            }

            post.isMine = false;
            if(post.user._id.toString()===req.user.id){
                post.isMine = true;
            }

            post.comments.map((comment)=>{
                comment.isComentMine = false;
                if(comments.user._id.toString()=== req.user.id){
                    comment.isComentMine = true;
                }
            })

        });
        res.status(200).json({success : true, data : posts});
    },

    searchUser : async (req,res)=>{
        if(!req.query.username){
            return res.status(400).json({message:"userName cannot be empty"})
        }
        const regex = new RegExp(req.query.username,"i");
        const users = await User.find({username:regex});

        res.status(200).json({success: true,data: users});
    },

    editUser : async (req,res)=>{
        const {photo ,username,fullname,aboutMe,email} = req.body;
        const fieldsToUpdate = {};

        if(photo) fieldsToUpdate.photo = photo;
        if(username) fieldsToUpdate.username = username;
        if(fullname) fieldsToUpdate.fullname = fullname;
        if(email) fieldsToUpdate.email = email;

        const user = await User.findByIdAndUpdate(req.user.id,{$set : {...fieldsToUpdate , aboutMe}},{
            new:true,runValidators : true
        })
        .select("photo username fullname email aboutMe");
        res.status(200).json({success: true, data :user});
    }
}

module.exports = userCtrl;