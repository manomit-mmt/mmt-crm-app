'use strict';

const routes = {};
routes.tasks = require('./tasks');
routes.notes = require('./notes');
routes.emailFeed = require('./emailFeed');
routes.activity = require('./activity');
//routes.admin = require('./admin');
const attach = app => {
  app.use('/task', routes.tasks);
  app.use('/note', routes.notes);
  app.use('/email-feed', routes.emailFeed);
  app.use('/activity', routes.activity);
  return app;
};

module.exports.attach = attach;
