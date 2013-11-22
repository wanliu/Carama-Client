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

current_user = 'hysios';

user_sockets = {};

io.on('connection', function (socket) {
  console.log('connect:', socket.id);
  user_sockets[socket.id] = socket;


  // var userName;
  // socket.on('connection name',function(user){
  //   userName = user.name;
  //   clients[user.name] = socket;
  //   io.sockets.emit('new user', user.name + " has joined.");
  // });

  socket.on('message', function(msg){
    try {
      var info = JSON.parse(msg);
      console.log('onMessage:', msg);
    } catch (e) {
      console.log('Error:', e.message)
    }
  });

  socket.on('open', function(data, callback){
    try {
      var info = JSON.parse(data);
      console.log('open command:', info)
      switch(info.type) {
      case 0:
        break;
      case 1:
        room = generateId();
        io.sockets.emit('message', JSON.stringify({
          action: 'join',
          room: room,
          from: current_user,
          type: info.type }))
        callback(null, room);
        break;
      case 2:
        room = generateId();
        io.sockets.emit('message', JSON.stringify({
          action: 'join',
          room: room,
          group: info.group,
          type: info.type }))
        callback(null, room);
        break;
      }
    } catch (e) {
      console.log(e.message)
    }

  });

  socket.on('remote', function(data, callback){
    try {
      var info = JSON.parse(data);
      console.log('remote:', info);
      socket.emit('message', JSON.stringify(info));
    } catch (e) {
      console.log(e.message)
    }
  })

  socket.on('join', function(data, callback){
    try {
      console.log('join:', data);
      var info = JSON.parse(data);
      socket.join(info.room)
    } catch (e) {
      console.log(e.message)
    }
  })


  socket.on('chat', function(data){
    try {
      var info = JSON.parse(data);
      msg = JSON.stringify(info);
      for (var id in user_sockets) {
        var socket = user_sockets[id];

        socket.emit('chat', JSON.stringify(info));
      }
    } catch (e) {
      console.log(e.message)
    }
  })

  socket.on('being_input', function(data){
    try {
      var info = JSON.parse(data);

      var room = info.room,
        info = {
            user: current_user,
            action: 'notice',
            room: room,
            type: 3
        };
      console.log('still inputing');

      socket.broadcast.to(info.room).emit('message', JSON.stringify(info));
    } catch (e) {
      console.log(e.message)
    }

  });

  socket.on('disconnect', function(){
    console.log('disconnect:', socket.id);
  })

  // socket.on('private message', function(msg){
  //   fromMsg = {from:userName, txt:msg.txt}
  //   clients[msg.to].emit('private message', fromMsg);
  // });

  // socket.on('disconnect', function(){
  //   delete clients[userName];
  // });
});