const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    place:{
        type: String,
        requires : true
    }
})


module.exports = mongoose.model('place',placeSchema);