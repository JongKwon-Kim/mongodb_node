const express = require('express');
const app = express();
const { userRouter, blogRouter } = require('./routes')
const mongoose = require('mongoose');
//const { generateFakeData } = require("../faker2")


const MONGO_URI = 'mongodb+srv://admin:admin@mongodbtutorial.dh2vq.mongodb.net/BlogService?retryWrites=true&w=majority';

const server = async() => {
    try{
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false })
        //mongoose.set("debug", true);
        console.log('MongoDB connected');
        app.use(express.json());
    
        app.use('/user', userRouter);
        app.use('/blog', blogRouter);
        //app.use('/blog/:blogId/comment', commentRouter);
        
        app.listen(3000, async() => {
            console.log('server listening on port 3000');
            //await generateFakeData(3, 5, 20);
        });
    }catch(err){
        console.log(err);
    }
}

server();