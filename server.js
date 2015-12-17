var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var logic = require('./logic');
var hostedGame = require('./host');

var game = new hostedGame.HostedGame({'sockets' : io.sockets});

app.use(express.static(path.join(__dirname, 'public')));
server.listen(3000, function() {
  //console.log('listening');
});

var now = Date.now();
var last = now;
var dt = 0.00;
var rate = 10;

var originTime = Date.now();

connect = function(socket) {

  game.connectPlayer(socket);
}

io.on('connection', function(socket) {

  game.connectPlayer(socket);
  socket.emit('time', {'time' : originTime});

  socket.on('input', function(data) {
    game.input(socket, data);
  });
});

var loopAsync = function() {
  setTimeout(loop, 10);
  //setImmediate(loop);
}

function loop() {
  now = Date.now();
  var delta = now - last;
  last = now;

  dt = dt + delta;

  originTime+= delta;

  if (dt < rate) {
    loopAsync();
    return;
  } else {
    var updates = [];
    while (dt > rate) {
      dt -= rate;
      updates = updates.concat(game.loop());
    }
    
    var rep = game.representationThings();
    
    rep = {'players' : rep['players'], 'updates' : updates}; // 'updates' : updates};
    io.sockets.emit("game.rep.things", rep);
    //io.to specific player
    loopAsync();
  }

}

loopAsync();


