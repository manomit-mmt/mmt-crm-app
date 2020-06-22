'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deptSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Department', deptSchema);