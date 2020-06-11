'use strict';


const routes = {};
routes.settings = require('./settings');
routes.property = require('./property');
const attach = app => {
  app.use('/module-settings', routes.settings);
  app.use('/property', routes.property)
  return app;
};

module.exports.attach = attach;
