'use strict';

const routes = {};
routes.user = require('./user');
//routes.admin = require('./admin');
const attach = app => {
  app.use('/user', routes.user);
  return app;
};

module.exports.attach = attach;
