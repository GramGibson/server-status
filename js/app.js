(function() {
  var app, checkServer, express, io, request, server_list;
  express = require('express');
  request = require('request');
  app = express.createServer();
  io = require('socket.io').listen(app);
  io.enable('browser client minification');
  app.configure('development', function() {
    return app.use(express.static(__dirname + '/views'));
  });
  app.listen(9000);
  server_list = [
    {
      id: 0,
      name: 'Google',
      ip: 'http://74.125.224.83'
    }, {
      id: 1,
      name: 'Yahoo',
      ip: 'http://67.195.160.76'
    }, {
      id: 2,
      name: 'Unknown',
      ip: 'http://0.0.0.0'
    }, {
      id: 3,
      name: 'Slashdot',
      ip: 'http://216.34.181.45'
    }, {
      id: 4,
      name: 'MSNBC',
      ip: 'http://65.55.53.235'
    }, {
      id: 5,
      name: 'Hacker News',
      ip: 'http://174.132.225.106'
    }
  ];
  checkServer = function(socket, server) {
    var status;
    status = 'dead';
    return request({
      uri: server.ip,
      timeout: 2000
    }, function(error, response, body) {
      if (!(error != null)) {
        status = 'alive';
      }
      return socket.emit('response', {
        id: server.id,
        name: server.name,
        ip: server.ip,
        status: status
      });
    });
  };
  io.sockets.on('connection', function(socket) {
    var server, _i, _len;
    socket.emit('server_list', server_list);
    for (_i = 0, _len = server_list.length; _i < _len; _i++) {
      server = server_list[_i];
      checkServer(socket, server);
    }
    return socket.on('refresh_status', function(req) {
      var server, _j, _len2, _results;
      _results = [];
      for (_j = 0, _len2 = server_list.length; _j < _len2; _j++) {
        server = server_list[_j];
        if (server.id === req.id) {
          _results.push(checkServer(socket, server));
        }
      }
      return _results;
    });
  });
}).call(this);
