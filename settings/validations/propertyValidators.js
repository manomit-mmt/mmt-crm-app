'use strict';

const joi = require('joi');

const createPropertyDataset = {
    fieldLabel: joi.string().required(),
    fieldType: joi.object().required(),
    groupId: joi.string().required(),
    
};

const createPropertyValidation = async config => {
    try {
      const value = await joi.validate(config, createPropertyDataset);
      return value;
    } catch (err) {
      return err;
    }
};

module.exports = {
    createPropertyValidation,
}