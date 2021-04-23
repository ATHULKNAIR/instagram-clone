const express =require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());


app.get('/',(req,res)=>{
    res.json("Hello World")
})

app.listen(3000,()=>{
    console.log('Server Listening to port 3000')
})