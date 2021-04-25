const router = require('express').Router();
const cloudinary = require('cloudinary');
const auth = require('../middlewares/requireLogin');
const fs = require('fs');

//  we will upload images to cloudinary

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
})

// upload  image 

router.post('/upload',auth,(req,res)=>{
    try {
       console.log(req.files);
       if(!req.files || Object.keys(req.files).length ===0){
           return res.status(400).send("No files were uploaded")
       }

       const file = req.files.file;
       if(file.size > 1024*1024*5){
           removeTemp(file.tempFilePath)
           return res.status(400).json({msg:"Size too large"}) 
       }        
       if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'video/mp4'){
        removeTemp(file.tempFilePath)  
        return res.status(400).json({msg:"file format is incorrect"})
       }

       cloudinary.v2.uploader.upload(file.tempFilePath,{folder : "instaPost"},async (err,result)=>{
           if(err) throw err;
           removeTemp(file.tempFilePath)
           res.json({public_id : result.public_id, url : result.secure_url})
       })


    } catch (err) {
        return res.status(500).json({msg:err.message})
    }
})

router.post('/destroy',auth,(req,res)=>{
    try {
        const {public_id} = req.body;
        if(!public_id) {
            return res.status(400).json({msg:"No image selected"})
        }
        cloudinary.v2.uploader.destroy(public_id, async (err,result)=>{
            if(err) throw err;

            res.json({msg:"Deleted Image"});
        })
    } catch (err) {
        return res.status(500).json({msg:err.message})
    }
})

const removeTemp = (path)=>{
    fs.unlink(path,err=>{
        if(err) throw err;
    })
}

module.exports = router;