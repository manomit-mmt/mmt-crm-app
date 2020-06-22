'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
        maxlength: 10,
        minlength: 10,
    },
    gender: {
        type: String,
        enum: ['MALE','FEMALE','OTHER'],
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department'
    },
    education: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: ''
    },
    loginId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);