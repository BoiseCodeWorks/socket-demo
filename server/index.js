var express = require("express");
var app = express();
var port = 3000;

//create server for socket and connect socket to it
var server = require("http").createServer(app);
var io = require("socket.io")(server);

server.listen(port, function() {
  console.log("Server listening at port:", port);
});

//socket stuff
let connectedUsers = {};
let rooms = {};

io.on("connection", socket => {
  console.log("User Connected");

  //notify connector of successfull connection
  socket.emit("CONNECTED", {
    socket: socket.id,
    message: "Successfully Connected"
  });

  //join a room
  socket.on("join", data => {
    //insure connection passed name
    if (data.name) {
      //attaches name to socket
      socket.user = data.name;

      //adds connection to room
      socket.join("BCW");

      //adds user to connectedUsers
      connectedUsers[data.name] = data.name;

      //notify connection of room connection
      socket.emit("joinedRoom", {
        roomName: "BCW",
        connectedUsers: connectedUsers
      });

      //notify room of new connection
      io.to("BCW").emit("newUser", { userName: data.name });
    }
	});
	
	//connection leaves room
	socket.on('leave', data=>{
		//confirm they were in a room
		if(socket.user){
			//remove from connected room
			delete connectedUsers[socket.user]
			io.to('BCW').emit('left', socket.user)
		}
	})

	//connection disconnectsd
	socket.on('disconnect', data=>{
		if(socket.user){
			//remove from connected room
      delete connectedUsers[socket.user]
			io.to('BCW').emit('left', socket.user)
		}
	})

	socket.on('message', data=>{
		if(data.message && data.user){
      console.log('message received')
			io.to('BCW').emit('newMessage', data)
		}
	})

});