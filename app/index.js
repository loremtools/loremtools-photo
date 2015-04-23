var targetHost = 'lorempixel.com';
var serverPort = 8091;

var express = require('express');

var app = express();

app.use('/loremphoto', require('../lib/bootstrap.js')({
  targetHost: targetHost,
  urlRoot : 'loremphoto'
}), function(req, res, next) {
  return res.render('loremphoto', { });
});

var server = app.listen(serverPort, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
