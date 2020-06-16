'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    data: {
        type: Schema.Types.Mixed
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

module.exports = mongoose.model('Contact', contactSchema);