
const mongoose = require('mongoose');

const hospitalSchema = mongoose.Schema({
    hospitalName: {
        type: String,
        required:true
    },
    doctor: {
        // type: Schema.Types.ObjectId,
        // ref: 'Doctor'
        type:String,
        required: true,

    },
    date:{
        type:Date,
        required: true,

    },
    // time: {
    //     type: Date,
    //     default:null
    //   },
    
},
{ timestamps: true }

    

);

module.exports = mongoose.model('Hospital', hospitalSchema);