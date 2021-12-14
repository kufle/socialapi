const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const postSchema = Schema({
    title: {
        type: String,
        required: [true, 'Title Required'],
        minlength: 4,
        maxlength: 150
    },
    body: {
        type: String,
        required: [true, 'Body Required'],
        minlength: 4,
        maxlength: 2000
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

module.exports = model('Post', postSchema);