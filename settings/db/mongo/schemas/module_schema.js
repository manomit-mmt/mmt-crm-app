'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  pluralName: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  moduleType: {
    type: String,
    default: ''
  },
  status: {
    type: Boolean,
    default: true,
  }
}, {
  versionKey: false,
  timestamps: true
});

module.exports = mongoose.model('ModuleMaster', moduleSchema);
