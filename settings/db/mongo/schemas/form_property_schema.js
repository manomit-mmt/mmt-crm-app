'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formPropertySchema = new Schema({
    formName: {
        type: String,
        required: true
    },
    property: {
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

module.exports = mongoose.model('FormProperty', formPropertySchema);