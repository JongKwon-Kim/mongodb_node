const { Router } = require("express");
const commentRouter = Router( {mergeParams:true} );
const { Blog, User, Comment }  = require("../models");
const { isValidObjectId, startSession } = require('mongoose');
//const { resolveSoa } = require("dns");



commentRouter.post("/", async(req, res) => {
    //const session = await startSession();
    let comment;
    try{
        //await session.startTransaction(async() => {
            const { blogId } = req.params;
            const { content, userId} = req.body;
            if(!isValidObjectId(blogId)) return res.status(400).send( { err: "blogId is invalid" });
            if(!isValidObjectId(userId)) return res.status(400).send( { err: "userId is invalid" });
            if(typeof content !== 'string') return res.status(400).send( { err:"content is required" });
    
    
            const [blog, user] = await Promise.all( [
                Blog.findById(blogId, {}, {  }),
                User.findById(userId, {}, {  }),
            ] )
            if(!blog || !user) return res.status(400).send( { err: "blog or user dose not exist"} );
            if(!blog.islive) return res.status(400).send( { err: "blog is not available"} );
    
            comment = new Comment( { 
                content, 
                user, 
                userFullName:`${user.name.first} ${user.name.last}`, 
                blog }
            );
            //await session.abortTransaction();

            // await Promise.all( [ 
            //     comment.save( {  } ),
            //     Blog.updateOne( { _id: blogId }, { $push: { comments: comment } } ),
            // ] );

            await Promise.all( [
                comment.save(),
                Blog.updateOne( { _id: blogId }, 
                    {$inc: { commentCount: 1}, 
                        $push:{ 
                            comments: { 
                                $each: [ comment ], $slice: -3 }} } )
            ] );

        //});

        return res.send( { comment } )
        
    }catch(err){
        return res.status(400).send( { err: err.message })
    }finally{
        // await session.endSession();
    }
})

commentRouter.get("/", async(req, res) => {
    const { blogId } = req.params;
    if(!isValidObjectId(blogId)) return res.status(400).send( { err: "blogId is invalid" });

    const comments = await Comment.find( { blog: blogId } );
    return res.send( { comments });
})

commentRouter.patch("/:commentId", async(req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    if( typeof content !== 'string') return res.status(400).send( { err: "content is required"});
    const [ comment ] = await Promise.all( [ 
        Comment.findOneAndUpdate( { _id: commentId }, { content }, { new: true } ),
        Blog.updateOne( 
            { 'comments._id' : commentId }, 
            { "comments.$.content": content  }
        ),
    ] );
    
    return res.send({ comment });
})

module.exports = { commentRouter };