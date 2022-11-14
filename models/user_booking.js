const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    username:{
        type: String,
        required : true,
    },
    service:{
        type: String,
        required: true,
    },
    date:{
        type : Date,
        required : true
    },
    slot:{
        type: String,
        required: true,
        enum:['Slot 1','Slot 2','Slot 3','Slot 4','Slot 5']
    },
    place:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required : true,
        enum : ['pending','approved','rejected']
    }
})


module.exports = mongoose.model('booking',bookingSchema);