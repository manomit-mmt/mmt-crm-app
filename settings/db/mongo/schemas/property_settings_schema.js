'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySettingsSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: 'FieldType',
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
    objectType: {
        type: Schema.Types.ObjectId,
        ref: 'ObjectType',
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

module.exports = mongoose.model('PropertySetting', propertySettingsSchema);