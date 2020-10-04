const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        Age: {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32
        },
        Experience: {
            type: String,
            required: true,
            maxlength: 2000
        },
        fees: {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32
        },
        Date:{
            type:Date
        }
        
    },
    { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);