'use strict';

const routes = {};
routes.tasks = require('./tasks');
//routes.admin = require('./admin');
const attach = app => {
  app.use('/task', routes.tasks);
  return app;
};

module.exports.attach = attach;
