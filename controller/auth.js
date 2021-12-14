const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
require('dotenv').config();
const User = require('../models/user');

const signup = async (req, res, next) => {
   try {
        const payload = req.body;
        const userExists = await User.findOne({email: payload.email});
        if(userExists) {
            return res.status(403).json({
                error: "Email already taken"
            });
        }

        const user = new User(payload);
        await user.save();

        res.status(200).json({message: "Signup Success! Please login"});
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

const signin = async (req, res, next) => {
    try {
        //find the user based on email
        const {email, password} = req.body;
        await User.findOne({email}, (err, user) => {
            if(err || !user){
                return res.status(401).json({
                    error: "not match in our credentials"
                });
            }
            //if user found make sure the email and password match
            if(!user.authenticate(password)){
                return res.status(401).json({
                    error: "Email or Password wrong"
                });
            }
            //generate a token with user id and secret
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
            //persist the token as 't' in cookie with expiry date
            res.cookie("t", token, {expire: new Date() + 9999 });
            //return response with user and token to a frontend client
            const {_id, name, email} = user;
            return res.json({ token, user: {_id, name, email}});
        });
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

const signout = (req, res, next) => {
    res.clearCookie("t");
    return res.json({message: "Signout Success"});
}

const requireSignIn = expressJwt({
    //if token is valid, express jwt appends the verfied users id
    //in auth key to the request object
    secret: process.env.JWT_SECRET, algorithms: ['HS256'], userProperty: "auth" 
});

module.exports = {
    signup,
    signin,
    signout,
    requireSignIn
}