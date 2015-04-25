var logger = require('../logger'),
    fs = require('fs'),
    easyimage = require('easyimage'),
    dateformat = require('dateformat');

module.exports = function(config) {

  return function(req, res, next) {
    logger.info('middleware[demo]: invoke ...');

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

    var filename = dateformat(new Date(), "yyyy-mm-dd_hh-MM-ss");
    filename += Math.floor(Math.random() * 9);
    var cachedFolder = './.cache/';

    var originalImg = cachedFolder + filename + '.jpg';
    var convertedImg = '';

    var filetype = req.params.filetype;

    var common = require('../common')(config);
    common.download(targetHost + targetPath, originalImg, function() {
      
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

      if (filetype === undefined || filetype === null || 
          filetype === 'jpg' || filetype === 'jpeg'){
        renderImage(originalImg);
      } else {
        convertedImg = cachedFolder + filename + '.' + filetype;
        easyimage.convert({
           src: originalImg, 
           dst: convertedImg
        }).then(
          function(image) {
            console.log('Converted: ' + image.width + ' x ' + image.height);
            renderImage(convertedImg);
          },
          function (err) {
            console.log(err);
          }
        ); //easyimage.convert().then()  
      }
    }); // common.download()
  }
}
