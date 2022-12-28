const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    profile: {
        type: String,
        desc: String,
        img: {
            data: Buffer,
            contentType: String
        }
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('User', userSchema)