'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const masterFieldSchema = new Schema({
    fieldLabel: {
        type: String,
        required: true,
        unique: true
    },
    internalName: {
        type: String,
        required: true,
        unique: true,
    },
    fieldType: {
        type: String,
        required: true,
    },
    choices: [{ type: String }],
    tooltip: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: '',
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'MasterGroup'
    },
    isRequired: {
        type: Boolean,
        default: false
    },
    isUnique: {
        type: Boolean,
        default: false,
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
    },

}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('MasterField', masterFieldSchema);