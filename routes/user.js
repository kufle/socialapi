const router = require('express').Router();
const multer = require('multer');

const { allUsers, userByID, getUser, updateUser, deleteUser } = require('../controller/user');
const { requireSignIn } = require('../controller/auth');

router.get('/users', allUsers);
router.get('/user/:userId', requireSignIn,getUser);
router.put('/user/:userId',multer().none(), requireSignIn,updateUser);
router.delete('/user/:userId',multer().none(), requireSignIn, deleteUser);

//any routes containing :userId, our app will first execute userByID
router.param("userId", userByID);

module.exports = router;