const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    service:{
        type: String,
        requires : true
    }
})


module.exports = mongoose.model('service',serviceSchema);