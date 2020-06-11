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
    status: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: String,
        default: null,
    },
    moduleId: [{ type: Schema.Types.ObjectId, ref: 'ModuleMaster'}],
    inModuleId: [{ type: Schema.Types.ObjectId, ref: 'ModuleMaster'}]
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('MasterGroup', masterGroupSchema);