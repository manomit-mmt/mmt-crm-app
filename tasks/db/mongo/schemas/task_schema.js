'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    description: {
      type: String,
      required: true
    },
    dueDate: {
      type: String,
      required: true
    },
    dueTime: {
      type: String,
      required: true
    },
    taskTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'TaskType'
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
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


module.exports = mongoose.model('Task', taskSchema);
