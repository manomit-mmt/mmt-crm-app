'use strict';

const joi = require('joi');

const patientDataSet = {
    name: joi.string().required(),
    mobileNumber: joi.string().required(),
    dob: joi.string().required(),
    address: joi.string().required(),
    gender: joi.string().required(),
    treatmentType: joi.string().required(),
    bloodGroup: joi.string().allow('')
};

const doctorDataSet = {
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  mobileNumber: joi.string().required(),
  gender: joi.string().required(),
  dob: joi.string().required(),
  designation: joi.string().required(),
  department: joi.string().required(),
  education: joi.string().required(),
  profileImage: joi.string().allow('')
};

const doctorDataSetEdit = {
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  gender: joi.string().required(),
  dob: joi.string().required(),
  designation: joi.string().required(),
  department: joi.string().required(),
  education: joi.string().required(),
  profileImage: joi.string().allow(''),
  loginId: joi.string().required(),
  doctorId: joi.string().required(),
};

const patientValidation = async config => {
    try {
      const value = await joi.validate(config, patientDataSet);
      return value;
    } catch (err) {
      return err;
    }
};

const doctorValidation = async config => {
  try {
    const value = await joi.validate(config, doctorDataSet);
    return value;
  } catch(err) {
    return err;
  }
};

const doctorValidationEdit = async config => {
  try {
    const value = await joi.validate(config, doctorDataSetEdit);
    return value;
  } catch(err) {
    return err;
  }
};

module.exports = {
    patientValidation,
    doctorValidation,
    doctorValidationEdit,
}