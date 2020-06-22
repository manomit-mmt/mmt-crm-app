'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
        maxlength: 10,
        minlength: 10,
    },
    dob: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-', ''],
        default: ''
    },
    address: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['MALE','FEMALE','OTHER'],
        required: true
    },
    treatmentType: {
        type: Schema.Types.ObjectId,
        ref: 'TreatmentType'
    },
    companyId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);