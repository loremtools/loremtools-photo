var express = require('express'),
    querystring = require('querystring'),
    httpProxy = require('http-proxy');

var logger = require('./logger');

module.exports = function(config) {
  var app = express();
  var proxy = httpProxy.createServer({});

  app.all('/:width/:height', function(req, res) {
    var proxyUrl = '/' + req.params.width + '/' + req.params.height + '/';

    logger.info('targetPath:' + proxyUrl);

    req.url = proxyUrl;
    return proxy.proxyRequest(req, res, {
      target: 'http://' + config.targetHost,
      headers: {
        host: config.targetHost
      }
    });
  });

  return app;
}
