var nconf   = require('nconf');
var winston = require('winston');
var logger  = new winston.Logger();
var ROOT    = process.cwd();

if (process.env.NODE_ENV == 'production') {
  nconf.use('file', { file: ROOT + '/config/production.json' });
} else {
  nconf.use('file', { file: ROOT + '/config/development.json' });
  logger.add(winston.transports.Console);
}

logger.add(winston.transports.File, { filename: nconf.get('logpath') + nconf.get('logfile') });

module.exports = logger;
