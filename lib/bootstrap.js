;(function() {

  module.exports = function(config) {
    if (!config){
      throw new Error('No config specified');
    }
    
    if (!config.targetHost) {
      throw new Error('targetHost must be specified');
    }
    config.targetPort = config.targetPort || 80;
    config.urlRoot = config.urlRoot || 'loremphoto';

    var common = require('./common')(config);
    config.urlRoot = common.friendlyPath(config.urlRoot);

    var middleware = require('./middleware')(config);

    return middleware;
  };

})();