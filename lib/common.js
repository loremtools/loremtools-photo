;(function() {

  var common = {}, config;

  module.exports = function(cfg) {
    config = cfg;
    return common;
  };

  common.friendlyPath = function(unfriendlyPath){
    return decodeURI(unfriendlyPath).replace(/^\//, '').replace(/\/$/, '');
  }

})();
