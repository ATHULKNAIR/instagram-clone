const express =require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({
    useTempFiles : true
}))


mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
},(err)=>{
    if(err) throw err;
    console.log("Connected to MongoDB..!")
})

app.get('/:id',(req,res)=>{
    res.json(req.params.id)
})

app.use('/api/user',require('./routes/userRoutes'));
app.use('/api/post',require('./routes/postRoutes'));
app.use('/api/stories',require('./routes/storiesRoutes'));
app.use('/api/',require('./routes/authRoutes'));
app.use('/api',require('./routes/upload'));

app.listen(3000,()=>{
    console.log('Server Listening to port 3000')
})