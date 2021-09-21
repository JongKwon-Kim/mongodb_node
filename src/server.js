const express = require('express');
const app = express();
const { userRouter, blogRouter } = require('./routes')
const mongoose = require('mongoose');
//const { generateFakeData } = require("../faker2")


const { MONGO_URI, PORT } = process.env;
if( !MONGO_URI ) throw new ("MONGO_URI is required!!!");
if( !PORT ) throw new ("PORT is required!!!");


const server = async() => {
    try{
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false })
        //mongoose.set("debug", true);
        console.log('MongoDB connected');
        app.use(express.json());
    
        app.use('/user', userRouter);
        app.use('/blog', blogRouter);
        //app.use('/blog/:blogId/comment', commentRouter);
        
        app.listen(PORT, async() => {
            console.log(`server listening on port ${PORT}`);
            //await generateFakeData(3, 5, 20);
        });
    }catch(err){
        console.log(err);
    }
}

server();
