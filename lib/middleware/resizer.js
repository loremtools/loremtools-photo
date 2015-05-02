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
    logger.info(' =@ :url:' + imageUrl);

    var modStr = req.params.modifiers;
    logger.info(' =@ modifiers (String):' + modStr);
    
    var modObj = parseModifiers(modStr);
    logger.info(' =@ modifiers (JSON):' + JSON.stringify(modObj, null, 2));

    var originalImg = common.genFilename('jpg');
    var filetype = null;

    common.download(imageUrl, originalImg, function() {
      
      var renderImage = function(filePath) {
        fs.stat(filePath, function(err){
          if (err){
            console.log(err);
            //return common.error(req, res, next, 404, 'File not found', err);
          }
          
          var fstream = fs.createReadStream(filePath);
          fstream.on('error', function(err){
            console.log(err);
            //return common.error(req, res, next, 404, 'File not found', err);
          });

          return fstream.pipe(res);
        });
      }

      convertedImg = 'resize_crop' + originalImg;

      easyimage.thumbnail({
           src: originalImg,
           dst: convertedImg,
           width: modObj.width,
           height: modObj.height
        }).then(
        function(image) {
          console.log('Converted: ' + image.width + ' x ' + image.height);
          renderImage(convertedImg);
        },
        function (err) {
          console.log(err);
        }
      ); //easyimage.thumbnail().then()
    }); // common.download()
  }
}
