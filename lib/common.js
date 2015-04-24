var fs = require('fs'),
    request = require('request');

var logger = require('./logger');

var common = {}, config;

module.exports = function(cfg) {
  config = cfg;
  return common;
};

common.friendlyPath = function(unfriendlyPath){
  return decodeURI(unfriendlyPath).replace(/^\//, '').replace(/\/$/, '');
}

common.download = function(uri, filename, callback) {
  request.head(uri, function(err, res, body) {

    logger.debug(' + Download: content-type:' + res.headers['content-type']);
    logger.debug(' + Download: content-length:' + res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};