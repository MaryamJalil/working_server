const mongoose = require("mongoose");
const Schema = mongoose.Schema

const Appointment = new Schema({
    time: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }, 
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient'
    }
  
    
});

module.exports = mongoose.model('Appointment', Appointment)