'use strict';

const routes = {};
routes.patient = require('./patient');
routes.doctor = require('./doctor');
const attach = app => {
  app.use('/patient', routes.patient);
  app.use('/doctor', routes.doctor);
  return app;
};

module.exports.attach = attach;
