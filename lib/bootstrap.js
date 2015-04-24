
module.exports = function(config) {
  if (!config){
    throw new Error('No config specified');
  }
  
  if (!config.proxifyList) {
    throw new Error('proxifyList must be specified');
  }
  
  var common = require('./common')(config);
  config.urlRoot = common.friendlyPath(config.urlRoot || 'loremphoto');

  var middleware = require('./middleware')(config);

  return middleware;
};
