const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: [true,'Username cannot be blank']
    },
    password:{
        type: String,
        required :[true, 'Password cannot be blank']
    }

})

module.exports = mongoose.model('user',userSchema);