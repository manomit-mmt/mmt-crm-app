'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fieldTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true,
    },
    settings: {
        type: Schema.Types.Mixed,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('FieldType', fieldTypeSchema);