var express = require('express');
var app = express();

var server = app.listen(process.env.PORT || 8080);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

	console.log("connect")
	socket.emit('okay');
});