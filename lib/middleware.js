var logger = require('./logger'),
    express = require('express');

module.exports = function(config) {
  var app = express();
  var proxify = require('./middleware/proxify')(config);

  app.get('/proxify/:width/:height', proxify);
  
  return app;
}
