// Based on the tutorial:
// http://tutorialzine.com/2012/08/nodejs-drawing-game/

//Restrictions on HEROKU:
// Doesn't support installing dependencies with npm with node 0.8
// Doesn't support websocekts.
// Including libraries
var knox = require('knox');

var client = knox.createClient({
    key: 'AKIAIDZAMIX2REQZACVA',
	secret: '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'
  , bucket: 'bucket222'
});
var stringafile ='';
var stringaip ='';
/*
var object = { foo: "bar" };
var string = JSON.stringify(object);
var req = client.put('/test/obj.json', {
    'Content-Length': string.length
  , 'Content-Type': 'application/json'
});
req.on('response', function(res){
  if (200 == res.statusCode) {
    console.log('saved to %s', req.url);
  }
});
req.end(string);

*/
var roomVal;
var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	nstatic = require('node-static'); // for serving files

// This will make all the files in the current folder
// accessible from the web
var fileServer = new nstatic.Server('./');
	
// This is the port for our web server.
// you will need to go to http://localhost:3000 to see it
var port = process.env.PORT || 8080; // Cloud9 + Heroku || localhost
app.listen(port);

// If the URL of the socket server is opened in a browser
function handler (request, response) {
	if(request.url != "/" && request.url != ""){
		assetPath = request.url.split("/")[1];
		if(assetPath != "assets" && assetPath != "js" && assetPath != "favicon.ico" ){
			var path = request.url;
			roomVal = path.split("/")[1];
			console.log(roomVal+ ": my Room");
			request.url = "/";
		}
	}
	else{
		roomVal = 'room1';
	}
	request.addListener('end', function () {
        fileServer.serve(request, response);
    });
}

// Delete this row if you want to see debug messages
 io.set('log level', 1);

// Heroku doesn't support websockets so...
// Detect if heroku via config vars
// https://devcenter.heroku.com/articles/config-vars
// heroku config:add HEROKU=true --app node-drawing-game
if (process.env.HEROKU === 'true') {
    io.configure(function () {
        io.set("transports", ["xhr-polling"]);
        io.set("polling duration", 20);
    });
}

// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['room1','room2','room3'];

// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {
/*									  
client.get('filelog.txt').on('response', function(res){
var miadata =	new Date();											  
stringaip = socket.handshake.address.address  + ' ' + miadata.getDate() +'/' + miadata.getMonth() + '/' + miadata.getYear() 
+ ' ' + miadata.getHours() +':' + miadata.getMinutes() +':' + miadata.getSeconds();
 // console.log(stringaip);
  // console.log(res.headers);
  res.setEncoding('utf8');
  res.on('data', function(chunk){
//    console.log(chunk);
stringafile = stringafile + chunk;
//     console.log(stringafile);
  }); 
}).end();									  

var buffer = new Buffer(stringafile + stringaip + '\n');
var headers = {
  'Content-Type': 'text/plain'
};
client.putBuffer(buffer, '/filelog.txt', headers, function(err, res){
  // Logic
});

*/
	// Start listening for mouse move events
	socket.on('mousemove', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.to(socket.room).emit('moving', data);
	});
	
socket.on('salvasulserver', function (data) {
		
	//	var object = { foo: data.dataserver };
	var datidalclient = data.dataserver.replace(/^data:image\/\w+;base64,/, "");
var buf = new Buffer(datidalclient, 'base64');
//var string = 'scrivo qualche cosa';
var req = client.put(data.orario + '.png', {
    'Content-Length': buf.length,
	'Content-Type': 'image/png'
});
req.on('response', function(res){
  if (200 == res.statusCode) {
//    console.log('saved to %s', req.url);
  }
});
req.end(buf);		
		
	});	

socket.on('doppioclick', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.emit('doppioclickser', data);
		
	});	

socket.on('chat', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.emit('chatser', data);
		
	});	
socket.on('fileperaltri', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.emit('fileperaltriser', data);
		
	});	

socket.on('camperaltri', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.emit('camperaltriser', data);		
	});	
	
	/* multi chat */
	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		if(rooms.indexOf(roomVal) < 0){ // doesn't exist
					if(roomVal != null && roomVal != undefined)
						rooms.push(roomVal);
		}
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		socket.room = roomVal;
		// add the client's username to the global list
		usernames[username] = username;
		// send client to room 1
		//socket.join('room1');
		socket.join(roomVal);
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ roomVal);
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to(roomVal).emit('updatechat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, roomVal);
	});

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});

	socket.on('switchRoom', function(newroom){
		// leave the current room (stored in session)
		socket.leave(socket.room);
		// join new room, received as function parameter
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
	
	socket.on('askForClients',function(){
			//var clients = io.sockets.manager.roomClients[socket.id]
			var clients = io.sockets.clients(socket.room);
			var clientNames = [];
			for (var i=0; i<clients.length; i++)
			  {
				clientNames.push(clients[i].username);
				
			  }
			socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', 'hello');
			console.log("hello");
	});
	socket.on('changeUserName',function(newName){
			socket.username = newName;
	});
	
	socket.on('dropImage',function(data){
			socket.broadcast.emit('addImage', data);
	});
	
});