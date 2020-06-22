'use strict';

/*********************************
 *    GLOBAL HELPER INITIALIZE   *
 *    GLOBAL VARIABLES INITIALIZE *
 *********************************/
require('dotenv').config();
// require('./helpers').globalHelper;

/*********************************
 *       MODULES INITIALIZE      *
 *********************************/

/**
 *
 * This is the main server config
 *
 * */

const cluster = require('cluster');

const express = require('express');

const app = express();
const db = require('./db');
const http = require('http');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./user.yaml');

// const entryPoint = require('./entry-point');
const receiveFromPatient = require('./utility/receive-from-patient');

if(cluster.isMaster) {
    const cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    cluster.on('exit', worker => {
      console.log('Worker %d died :(', worker.id);
      cluster.fork();
    });
}
else {

  db.connect(
    process.env.MONGO_URI
  )

    .then(() => require('./middlewares')(app))

    .then(() => require('./routes').attach(app))

    .then(() => {
      // entryPoint();
      
      receiveFromPatient();
      return Promise.resolve(app);
    })


    .then(() => {
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      
      http.createServer(app).listen(5000, () => {
        console.log(
          'Http Server is running On:',
          5000
        );

      });
    });
}