const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    min: 9,
},
  description: {
    type: String,
    default: 'Non-Veg'
  }
});

module.exports = mongoose.model('Patient', patientSchema)