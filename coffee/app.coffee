express = require 'express'
request = require 'request'

# create a new instance of express
app = express.createServer()

# listen for websocket connection on the express app port
io = require('socket.io').listen(app)
io.enable('browser client minification');

# serve static content
app.configure 'development', ->
    app.use express.static __dirname + '/views'

# listen for requests
app.listen 8888

# list of servers to check
serverList = [
	{ name: 'GOOGLE', ip: 'http://74.125.224.83' },
	{ name: 'YAHOO', ip: 'http://67.195.160.76' },
	{ name: 'UNKNOWN', ip: 'http://67.195.160.99' }
]

# check server and return response to client
checkServer = (socket, server) ->
	status = 'dead'
	request uri: server.ip, (error, response, body) ->
		status = 'alive' if not error?
		socket.emit 'response', { name: server.name, ip: server.ip, status: status }

# incoming websockets connections
io.sockets.on 'connection', (socket) ->
	checkServer(socket, server) for server in serverList