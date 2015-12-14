socketConfig = function(socket) {
          socket.on('player-positions', function(data) {
     clearBG();
      var keys = Object.keys(data);
      for (var i = 0; i < keys.length; i++) {
        var player = data[keys[i]];
        drawPlayer(player);
      }
      
    });
}

console.log("loaded");