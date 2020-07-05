'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Password } = require('../../../utility/');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    verifyEmail: {
      type: Boolean,
      default: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role'
    },
    deleted: {
      type: Number,
      default: 0,
    },
    mobileNumber: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password
      }
    },
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

module.exports = mongoose.model('User', userSchema);
