'use strict';

const joi = require('joi');

const signupDataSet = {
    email: joi.string().email({ tlds: { allow: false } }),
    password: joi.string().required(),
    name: joi.string().required(),
    companyName: joi.string().required(),
    mobileNumber: [
        joi.string().required(),
        joi.string().min(10),
        joi.string().max(10)
    ]
};

const loginDataSet = {
    email: joi.string().required(),
    password: joi.string().required(),
};
  
const signupValidation = async config => {
    try {
      const value = await joi.validate(config, signupDataSet);
      return value;
    } catch (err) {
      return err;
    }
};

const loginValidation = async config => {
    try {
        const value = await joi.validate(config, loginDataSet);
        return value;
    } catch (err) {
        return err;
    }
}

module.exports = {
    signupValidation,
    loginValidation,
}