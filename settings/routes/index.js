'use strict';


const routes = {};
routes.settings = require('./settings');
routes.property = require('./property');
routes.contact = require('./contact');
const attach = app => {
  app.use('/module-settings', routes.settings);
  app.use('/property', routes.property);
  app.use('/contact', routes.contact);
  return app;
};

module.exports.attach = attach;
