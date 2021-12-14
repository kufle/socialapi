const _ = require('lodash');
const User = require('../models/user');

const userByID = async (req, res, next, id) => {
    await User.findById(id).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "User not found"
            });
        }
        req.profile = user;
        next();
    });
}

const hasAuthorization = (req,res,next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
    if(!authorized) {
        return res.status(403).json({
            error: "User is not authorized to perform this action"
        });
    }
}

const allUsers = async (req, res, next) => {
    try {
        const user = await User.find((err, users) => {
            if(err){
                return res.status(400).json({ error: err})
            }
            res.json({users})
        }).select("name email created updated");
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

const getUser = async (req, res, next) => {
    try {
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        return res.json(req.profile);
    } catch (error) {
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

const updateUser = async (req, res, next) => {
    try {
        let user = req.profile;
        user = _.extend(user, req.body);
        user.updated = Date.now();
        await user.save((err) => {
            if(err){
                return res.status(401).json({err: "You are not authorized to perform this action"})
            }
            req.profile.hashed_password = undefined;
            req.profile.salt = undefined;
            res.json({user})
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

const deleteUser = async(req, res, next) => {
    let user = req.profile;
    user.remove((err, user) => {
        if(err){
            return res.status(401).json({error: err});
        }
        res.json({message: "User deleted successfully"});
    });
}

module.exports = { 
    userByID,
    hasAuthorization,
    allUsers,
    getUser,
    updateUser,
    deleteUser
 };