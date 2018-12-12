var express = require("express");
var app = express();
var port = 3000;

//create server for socket and connect socket to it
var server = require("http").createServer(app);
var io = require("socket.io")(server);


//
let Socket = require("./socket")
let socket = new Socket(io)




server.listen(port, function () {
  console.log("Server listening at port:", port);
});
