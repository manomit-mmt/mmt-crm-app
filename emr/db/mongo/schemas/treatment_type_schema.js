'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const treatmentType = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('TreatmentType', treatmentType);