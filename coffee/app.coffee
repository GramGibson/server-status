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
server_list = [
	{ id: 0, name: 'Google', ip: 'http://74.125.224.83' },
	{ id: 1, name: 'Yahoo', ip: 'http://67.195.160.76' },
	{ id: 2, name: 'Unknown', ip: 'http://0.0.0.0' },
	{ id: 3, name: 'Slashdot', ip: 'http://216.34.181.45' },
	{ id: 4, name: 'MSNBC', ip: 'http://65.55.53.235' },
	{ id: 5, name: 'Hacker News', ip: 'http://174.132.225.106' }
]

# check server and return response to client
checkServer = (socket, server) ->
	status = 'dead'
	request uri: server.ip, (error, response, body) ->
		status = 'alive' if not error?
		socket.emit 'response', { id: server.id, name: server.name, ip: server.ip, status: status }

# incoming websockets connections
io.sockets.on 'connection', (socket) ->
	# send server list to client
	socket.emit 'server_list', server_list
	
	# check servers
	checkServer(socket, server) for server in server_list
	
	# check server and refresh status
	socket.on 'refresh_status', (req) ->
		checkServer(socket, server) for server in server_list when server.id == req.id