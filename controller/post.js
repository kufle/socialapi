const Post = require('../models/post');

//Get Post
const getPosts = async (req, res) => {
    try {
        let posts = await Post.find().select("_id title body");
        return res.json(posts);
    } catch (err) {
        next(err);
    }
}

//create Post
const createPost = async (req, res, next) => {
    try {
        const post = new Post(req.body);
        await post.save();
        return res.json(post);
    } catch (err) {
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err);
    }
}

module.exports = {
    getPosts,
    createPost
}
