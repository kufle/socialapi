const router = require('express').Router();
const multer = require('multer');
const { createPostValidator } = require('../validator');
const {getPosts, createPost} = require('../controller/post');
const { requireSignIn } = require('../controller/auth');
const { userByID } = require('../controller/user');

router.get("/", requireSignIn, getPosts);
router.post("/post", multer().none(), requireSignIn, createPostValidator, createPost);

//any routes containing :userId, our app will first execute userByID
router.param("userId", userByID);

module.exports = router;