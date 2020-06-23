'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailFeedSchema = new Schema({
    fromEmail: {
        type: String,
        required: true
    },
    toEmail: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    companyId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    contactId: {
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

module.exports = mongoose.model('EmailFeed', emailFeedSchema);