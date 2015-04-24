var logger = require('../logger'),
    httpProxy = require('http-proxy'),
    proxy = httpProxy.createServer({});

module.exports = function(config) {

  return function(req, res, next) {
    logger.info('middleware[proxify]: invoke ...');

    var proxify = config.proxifyList[0];

    var targetHost = 'http://' + proxify.host + 
        ((proxify.port == 80) ? '' : ':' + proxify.port);

    var replacements = {
      "%width%": req.params.width,
      "%height%": req.params.height
    };
    var targetPath = proxify.path.replace(/%\w+%/g, function(all) {
      return replacements[all] || all;
    });

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
