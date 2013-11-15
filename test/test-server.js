var io = require('socket.io').listen(5001);
console.log('listen socket.io at 5001');

function log(msg) {
  console.log('test-server:', msg);
}

clients = [];

io.set('log level', 1);

io.on('connection', function (socket) {
  console.log('connect');

  // var userName;
  // socket.on('connection name',function(user){
  //   userName = user.name;
  //   clients[user.name] = socket;
  //   io.sockets.emit('new user', user.name + " has joined.");
  // });

  socket.on('message', function(msg){
    log(msg);
    io.sockets.emit('message', msg);
  });

  // socket.on('private message', function(msg){
  //   fromMsg = {from:userName, txt:msg.txt}
  //   clients[msg.to].emit('private message', fromMsg);
  // });

  // socket.on('disconnect', function(){
  //   delete clients[userName];
  // });
});