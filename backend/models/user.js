const mongoose= require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    contactList:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }],
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: null
    }],
})
module.exports = mongoose.model("User", userSchema);