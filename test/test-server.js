var io = require('socket.io').listen(5001);
console.log('listen socket.io at 5001');

function log(msg) {
  console.log('test-server:', msg);
}

clients = [];

io.set('log level', 1);

var generateId = function() {
  return  Math.abs(Math.random() * Math.random() * Date.now() | 0).toString() + Math.abs(Math.random() * Math.random() * Date.now() | 0).toString();
};

io.on('connection', function (socket) {
  console.log('connect');

  // var userName;
  // socket.on('connection name',function(user){
  //   userName = user.name;
  //   clients[user.name] = socket;
  //   io.sockets.emit('new user', user.name + " has joined.");
  // });

  socket.on('message', function(msg){
    try {
      var info = JSON.parse(msg);
      console.log(msg);
    } catch (e) {
      console.log(e.message)
    }
  });

  socket.on('open', function(data){
    try {
      var info = JSON.parse(data);

      switch(info.type) {
      case 0:
        break;
      case 1:
        io.sockets.emit('message', JSON.stringify({action: 'join', room: generateId(), type: info.type }))
        break;
      case 2:
        break;
      }
    } catch (e) {
      console.log(e.message)
    }

  });

  socket.on('join', function(data){
    try {
      var info = JSON.parse(data);
      console.log(info);

      socket.join(info.room)
    } catch (e) {
      console.log(e.message)
    }
  })





  // socket.on('private message', function(msg){
  //   fromMsg = {from:userName, txt:msg.txt}
  //   clients[msg.to].emit('private message', fromMsg);
  // });

  // socket.on('disconnect', function(){
  //   delete clients[userName];
  // });
});