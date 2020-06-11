const cors = require('cors');
const logger = require('morgan');
const compression = require('compression')
const helmet = require('helmet');
const bodyParser = require('body-parser');

module.exports = app => {
  app
    .use(bodyParser.json({limit: '20mb'}))
    .use(bodyParser.urlencoded({extended: true}))
    .use(compression())
    .use(logger('dev'))
    .use(cors())
    .use(helmet())
  return app;
};
