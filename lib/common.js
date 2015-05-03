var logger = require('./logger'),
    fs = require('fs'),
    request = require('request'),
    dateformat = require('dateformat');

var common = {}, config;

module.exports = function(cfg) {
  config = cfg;
  return common;
};

common.friendlyPath = function(unfriendlyPath){
  return decodeURI(unfriendlyPath).replace(/^\//, '').replace(/\/$/, '');
}

common.genFilename = function(extension, folder) {
  var filename = dateformat(new Date(), "yyyy-mm-dd_HH-MM-ss_");
  filename += Math.floor(Math.random() * 9);
  var cachedFolder = folder || './.cache/';
  return [cachedFolder, filename, '.', (extension || 'jpg')].join('');
}

common.download = function(uri, filename, callback) {
  request.head(uri, function(err, res, body) {

    logger.debug(' + Download: content-type:' + res.headers['content-type']);
    logger.debug(' + Download: content-length:' + res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

common.error = function(req, res, next, status, message, errorObject) {
  if (config.render === false) {
    return next(JSON.stringify({ message : message, error : errorObject}));
  }
  return res.status(status).json({ message : message, error : errorObject});
};

common.sanitize = function(value, type) {
  if (typeof type === 'undefined') {
    type = 'number';
  }
  switch (type) {
  case 'number':
    return value.toString().replace(/[^0-9]/, '') * 1;
  case 'alphanumeric':
    return value.replace(/[^a-z0-9]/i, '');
  case 'alpha':
    return value.replace(/[^a-z]/i, '');
  default:
    return value.replace(/[^0-9]/, '');
  }
};
