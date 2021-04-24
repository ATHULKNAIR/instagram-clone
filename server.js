const express =require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());


app.get('/',(req,res)=>{
    res.json("Hello World")
})

app.use('/api/user',require('./routes/userRoutes'));
app.use('/api/post',require('./routes/postRoutes'));

app.listen(3000,()=>{
    console.log('Server Listening to port 3000')
})