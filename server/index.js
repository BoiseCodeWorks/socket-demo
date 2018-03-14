var express = require('express');
var app = express();
var port = 3000;

//create server for socket and connect socket to it
var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(port, function () {
	console.log('Server listening at port:', port);
});


//socket stuff
let connectedUsers = {}
let rooms = {}

//on('connection') is triggered everytime a client connects to the socket
io.on('connection', socket=>{
	console.log('User Connected')

	//responds to user to confirm connection
    socket.emit('CONNECTED', {
        socket: socket.id,
        message: 'Welcome to the Jungle',
	})

	//listens for user to join room
	socket.on('join', (name)=>{		
		if (name) {
			//adds connection to room
			socket.join('BCW');
			socket.user = name;

			//adds connection to connected users
			connectedUsers[name] = name

			//responds to connection with room data
			socket.emit('joinedRoom', {
				roomName: 'BCW',
				connectedUsers: connectedUsers
			})

			//notifies room of new connection
			io.to('BCW').emit('newUser', name);
		}
	});

	//listens for user to leave
	socket.on('leave', ()=>{
		//confirms connection exists
		if(socket.user){
			//removes user from connected users
			delete connectedUsers[socket.user]
			//notifies room of user leaving
			io.to('BCW').emit('left', socket.user);
		}
	});

	//listens for new messages from connection
	socket.on('message', function (text) {
		if (text) {
			io.to('BCW').emit('message', { user: socket.user, message: text });
		}	
	});

	//handles socket discconection
	socket.on('disconnect', (reason) => {
		//confirms connection exists
		if(socket.user){
			//removes user from connected users
			delete connectedUsers[socket.user]
			//notifies room of user leaving
			io.to('BCW').emit('left', socket.user);
		}
    });
});