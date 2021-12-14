const router = require('express').Router();
const multer = require('multer');
const { userSignupValidator } = require('../validator');
const { signup, signin, signout } = require('../controller/auth');
const { userByID } = require('../controller/user');

router.post('/signup',multer().none(), userSignupValidator, signup);
router.post('/signin', multer().none(), signin);
router.post('/signout', multer().none(), signout);

//any routes containing :userId, our app will first execute userByID
router.param("userId", userByID);

module.exports = router;