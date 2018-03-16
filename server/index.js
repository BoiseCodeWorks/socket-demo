var express = require('express');
var app = express();
var port = 3000;

//create server for socket and connect socket to it


app.listen(port, function () {
	console.log('Server listening at port:', port);
});


//socket stuff
