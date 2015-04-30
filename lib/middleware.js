var logger = require('./logger'),
    express = require('express');

module.exports = function(config) {
  var app = express();
  
  var proxify = require('./middleware/proxify')(config);
  app.get('/proxify/:width/:height', proxify);

  var full = require('./middleware/proxify-converter')(config);
  app.get('/proxify/:width/:height/:taxotype/:taxolist/:filename.:filetype', full);
  
  var resizer = require('./middleware/resizer')(config);
  app.get('/resizer/:modifiers/*', resizer);

  return app;
}
