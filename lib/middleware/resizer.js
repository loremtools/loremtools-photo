var _ = require('lodash'),
    logger = require('../logger'),
    fs = require('fs'),
    easyimage = require('easyimage'),
    dateformat = require('dateformat');

var modDefs = {
  "w": {
    name: 'width',
    type: 'number'
  },
  "h": {
    name: 'height',
    type: 'number'
  }
};

module.exports = function(config) {
  var common = require('../common')(config);

  var parseModifiers = function(modStr) {
    var modifiers = {};

    var modArr = modStr.split('-');

    _.each(modArr, function(item) {
      var key = item[0];
      var value = item.slice(1);
      
      var modDef = modDefs[key];
      if (modDef) {
        modifiers[modDef.name] = common.sanitize(value, modDef.type);
      }
    });

    return modifiers;
  };

  return function(req, res, next) {
    logger.info('middleware[resizer]: invoke ...');
    
    logger.info(' =@ :url:' + req.params[0]);

    var modStr = req.params.modifiers;
    logger.info(' =@ modifiers (String):' + modStr);
    var modObj = parseModifiers(modStr);
    logger.info(' =@ modifiers (JSON):' + JSON.stringify(modObj, null, 2));

    
  }
}
