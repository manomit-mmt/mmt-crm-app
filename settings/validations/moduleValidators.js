'use strict';

const joi = require('joi');

const moduleMasterDataSet = {
    name: joi.string().required(),
    moduleType: joi.string().required()
};

const moduleMasterValidation = async config => {
    try {
      const value = await joi.validate(config, moduleMasterDataSet);
      return value;
    } catch (err) {
      return err;
    }
};

module.exports = {
    moduleMasterValidation,
}