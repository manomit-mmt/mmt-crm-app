'use strict';

const joi = require('joi');

const taskDataSet = {
    title: joi.string().required(),
    description: joi.string().required(),
    dueDate: joi.string().required(),
    dueTime: joi.string().required(),
    companyId: joi.string().required(),
    userId: joi.string().required(),
    taskTypeId: joi.string().required(),
    contactId: joi.string().required(),
};

const taskValidation = async config => {
    try {
      const value = await joi.validate(config, taskDataSet);
      return value;
    } catch (err) {
      return err;
    }
};

module.exports = {
    taskValidation,
}