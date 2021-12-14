const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const uuidv1 = require('uuid').v1;
const crypto = require('crypto');

const UserSchema = Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date
});

UserSchema.virtual('password')
.set(function(password){
    //create temporary variable called _password
    this._password = password
    //generate timestamps
    this.salt = uuidv1();
    //encrypt password
    this.hashed_password = this.encryptPassword(password);
})
.get(function(){
    return this._password;
});

//methods
UserSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password){
        if(!password) return "";
        try {
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    }
}

module.exports = model('user', UserSchema);