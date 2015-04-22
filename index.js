var proxyTarget = 'lorempixel.com';
var serverPort = 8091;

var express = require('express'),
    querystring = require('querystring'),
    httpProxy = require('http-proxy');

var proxy = httpProxy.createServer({});

var app = express();

app.all('/:width/:height', function(req, res) {
  var proxyUrl = '/' + req.params.width + '/' + req.params.height + '/';
  req.url = proxyUrl;
  return proxy.proxyRequest(req, res, {
    target: 'http://' + proxyTarget,
    headers: {
      host: proxyTarget
    }
  });
});

var server = app.listen(serverPort, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
