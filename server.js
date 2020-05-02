// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));


var users = [];
var marks = [];

function User(id, x, y, dir) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.dir = dir;
}

function Mark(x, y, color, rnoise) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.rnoise = rnoise;
}

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

setInterval(heartbeat, 33);


//send out update to all the current clients of each user's location and marks
function heartbeat() {
  io.sockets.emit('heartbeatUsers', users);
  io.sockets.emit('heartbeatMarks', marks);
}

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    console.log("We have a new client: " + socket.id);

    //when user first enters the game, add the user to list of all users
    socket.on('start', function(data) {
      console.log(socket.id + ' ' + data.x + ' ' + data.y);
      var user = new User(socket.id, data.x, data.y, data.dir);
      users.push(user);
    });

    //update user's location
    socket.on('update', function(data) {
      //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
      var user = users[0];

      //should probably change to using a dictionary later on to make this lookup faster than a loop
      for (var i = 1; i < users.length; i++) {
        //found user to update
        if (socket.id == users[i].id) {
          user = users[i];
        }
      }

      //check to make sure user is not null (getting error when game first loads if we don't check for this, probably something to look into later on)
      if(user) {
        user.x = data.x;
        user.y = data.y;
        user.dir = data.dir;
      }

    });

    //add mark
    socket.on('new mark', function(data) {
      var mark = new Mark(data.x, data.y, data.color, data.rnoise);
      marks.push(mark)
    });


    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);
