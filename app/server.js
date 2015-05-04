var logger = require('../lib/logger');
var express = require('express');
var app = express();

var proxifyList = [
  { host: 'lorempixel.com', port: 80, path: '/%width%/%height%/'}
];
var SERVER_PORT = process.env.PORT || 7700;

app.use('/loremphoto', require('../lib/bootstrap.js')({
  urlRoot : 'loremphoto',
  proxifyList: proxifyList,
  PHOTO_STORE_DIR: process.env.STORE_DIR || '.store',
  PHOTO_CACHE_DIR: process.env.CACHE_DIR || '.cache'
}), function(req, res, next) {
  return res.render('loremphoto', { });
});

var server = app.listen(SERVER_PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  logger.info('Example app listening at http://%s:%s', host, port);
});
