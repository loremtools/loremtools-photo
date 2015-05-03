
module.exports = function(config) {
  if (!config){
    throw new Error('No config specified');
  }
  
  if (!config.proxifyList) {
    throw new Error('proxifyList must be specified');
  }

  if (!config.PHOTO_STORE_DIR) {
    throw new Error('PHOTO_STORE_DIR must be specified');
  }

  if (!config.PHOTO_CACHE_DIR) {
    throw new Error('PHOTO_CACHE_DIR must be specified');
  }
  
  var common = require('./common')(config);
  config.urlRoot = common.friendlyPath(config.urlRoot || 'loremphoto');

  var middleware = require('./middleware')(config);
  return middleware;
};
