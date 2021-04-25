const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authCtrl = {

    register : async (req,res)=>{
        try {
           const {fullname,username,email,password} = req.body;
           const user = await User.findOne({email});
           if(user){
               return res.status(400).json({msg:"Email already exists"})
           }
           if(password.length <6){
               return res.status(400).json({msg:"Password too short"})
           }

           // password encryption
           const passwordHash = await bcrypt.hash(password,10)
           const newUser = new User({
               fullname,username,email,password:passwordHash
           })

           //save to database
           await newUser.save();

           // create token for authentication
           const accesstoken = createAccessToken({id:newUser._id})
           const refreshtoken = createRefreshToken({id:newUser._id})

           res.cookie('refreshtoken',refreshtoken,{
               httpOnly:true,
               path : 'auth/refresh_token',
               maxAge : 7*24*60*60*1000  // 7d
           })
           res.json({accesstoken})
        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    },

    login : async (req,res)=>{
        try {
            const {email, password} = req.body;
            const user = await User.findOne({email})
            if(!user){
                return res.status(400).json({msg:"User doesn't exist"})
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Incorrect password."})

            // if login success, create token
            const accesstoken = createAccessToken({id:user._id});
            const refreshtoken = createRefreshToken({id :user._id});

            res.cookie('refreshtoken',refreshtoken,{
                httpOnly: true,
                path : '/auth/refresh_token',
                maxAge : 7*24*60*60*1000
            })

            res.json({id :user._id,accesstoken})
        } catch (err) {
            res.status(500).json({msg:err.message})
        }
    },

    logout : async (req,res)=>{
        try {
           res.clearCookie('refreshtoken',{path : '/auth/refresh_token'})
           return res.json({msg:"Logged Out"}) 
        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    },

    refreshToken : (req,res)=>{

        try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token){
                return res.status(400).json({msg:"Please Login or Register"})
            }
            jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
                if(err) return res.status(400).json({msg:"Please Login or Register"})
               
                const accesstoken = createAccessToken({id:user.id})
                res.json({accesstoken})
            })
           
        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    },

    userInformation : async (req,res)=>{
        try {
            const user = await User.findById(req.user.id)
            if(!user) return res.status(400).json({msg:"User does not exist"})

            res.json({user})
            } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    }
}

const createAccessToken = (user)=>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})
}
const createRefreshToken = (user)=>{
    return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'})
}


module.exports = authCtrl;