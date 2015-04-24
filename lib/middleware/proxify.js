var logger = require('../logger'),
    httpProxy = require('http-proxy'),
    proxy = httpProxy.createServer({});

module.exports = function(config) {

  return function(req, res, next) {
    logger.info('middleware[proxify]: invoke ...');

    var targetHost = 'http://' + config.targetHost;
    var targetPath = '/' + req.params.width + '/' + req.params.height + '/';

    logger.info([' =@ Invoked URL: ', targetHost, targetPath].join(''));

    req.url = targetPath;
    return proxy.proxyRequest(req, res, {
      target: targetHost,
      headers: {
        host: config.targetHost
      }
    })
  }
}
