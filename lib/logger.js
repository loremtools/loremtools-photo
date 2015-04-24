// default log file level is info (which is the lowest by default)
var logFileLevel = 'info';

if (process.env.NODE_ENV == 'production') {
    // only write logs with a level of 'error' or above when in production
    logFileLevel = 'error';
}

var _ = require('lodash');
var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ 
      json: false, 
      timestamp: true,
      level: logFileLevel
    }),
    new winston.transports.File({ 
      filename: __dirname + '/../debug.log', 
      json: false,
      level: logFileLevel
    })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ 
      json: false, 
      timestamp: true,
      level: logFileLevel
    }),
    new winston.transports.File({ 
      filename: __dirname + '/../error.log', 
      json: false,
      level: logFileLevel
    })
  ],
  exitOnError: false
});

logger.isLevelEnabled = function(level) {
  return _.any(this.transports, function(transport) {
    return (transport.level && this.levels[transport.level] <= this.levels[level])
      || (!transport.level && this.levels[this.level] <= this.levels[level]);
  }, this);
};

module.exports = logger;
