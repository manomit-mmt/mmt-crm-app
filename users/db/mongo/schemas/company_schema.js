'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    domain: {
        type: String,
        default: ''
    }
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('Company', companySchema);