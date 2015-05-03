var logger = require('../logger'),
    _ = require('lodash'),
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
    
    var imageUrl = req.params[0];
    logger.info(' =@ image-url:' + imageUrl);

    var modStr = req.params.modifiers;
    logger.info(' =@ modifiers (String):' + modStr);
    
    var modObj = parseModifiers(modStr);
    logger.info(' =@ modifiers (JSON):' + JSON.stringify(modObj, null, 2));

    var filename = common.genFilename();
    var filetype = null;

    var originImg = ['.', config.PHOTO_STORE_DIR, filename].join('/');
    var targetImg = ['.', config.PHOTO_CACHE_DIR, filename].join('/');

    common.download(imageUrl, originImg, function() {
      var renderImage = function(filePath) {
        fs.stat(filePath, function(err) {
          if (err) {
            logger.error(err);
            return common.error(req, res, next, 404, 'File not found', err);
          }
          
          var fstream = fs.createReadStream(filePath);
          fstream.on('error', function(err) {
            logger.error(err);
            return common.error(req, res, next, 404, 'Cannot open File', err);
          });

          return fstream.pipe(res);
        });
      }

      easyimage.thumbnail({
           src: originImg,
           dst: targetImg,
           width: modObj.width,
           height: modObj.height
        }).then(
        function(image) {
          logger.debug('Converted: ' + image.width + ' x ' + image.height);
          return renderImage(targetImg);
        },
        function (err) {
          logger.error(err);
          return common.error(req, res, next, 404, 'Cannot resize/crop image', err);
        }
      ); //easyimage.thumbnail().then()
    }); // common.download()
  }
}
