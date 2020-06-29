'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const masterGroupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    relationalName: {
        type: String,
        required: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'MasterGroup',
    },
    moduleName: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: String,
        default: null,
    },
    companyId: {
        type: String
    }
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('MasterGroup', masterGroupSchema);