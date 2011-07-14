(function() {
  var app, checkServer, express, io, request, serverList;
  express = require('express');
  request = require('request');
  app = express.createServer();
  io = require('socket.io').listen(app);
  io.enable('browser client minification');
  app.configure('development', function() {
    return app.use(express.static(__dirname + '/views'));
  });
  app.listen(8888);
  serverList = [
    {
      name: 'GOOGLE',
      ip: 'http://74.125.224.83'
    }, {
      name: 'YAHOO',
      ip: 'http://67.195.160.76'
    }, {
      name: 'UNKNOWN',
      ip: 'http://67.195.160.99'
    }
  ];
  checkServer = function(socket, server) {
    var status;
    status = 'dead';
    return request({
      uri: server.ip
    }, function(error, response, body) {
      if (!(error != null)) {
        status = 'alive';
      }
      return socket.emit('response', {
        name: server.name,
        ip: server.ip,
        status: status
      });
    });
  };
  io.sockets.on('connection', function(socket) {
    var server, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = serverList.length; _i < _len; _i++) {
      server = serverList[_i];
      _results.push(checkServer(socket, server));
    }
    return _results;
  });
}).call(this);
