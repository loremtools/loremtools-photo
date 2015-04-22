var proxyTarget = 'lorempixel.com';
var serverPort = 8091;


var http = require('http'),
    httpProxy = require('http-proxy');

var proxy = httpProxy.createServer({});

http.createServer(function (req, res) {
  proxy.web(req, res, {
    target: 'http://' + proxyTarget,
    headers: {
      host: proxyTarget
    }
  });
}).listen(serverPort);

console.log('http server started on port ' + serverPort + ' ...');
