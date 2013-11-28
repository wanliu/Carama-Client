Caramal.debug = true;

var url = 'http://localhost:5001',
  options ={
    // transports: ['websocket'],
    'force new connection': true
  };

var client = Caramal.connect(url, options);

Caramal.MessageManager.setClient(client);

describe('Caramal Chat test ', function(done){

  // 打开一个会话， 会返回一个 rid
  it('open chat', function(done){
    chat = Caramal.Chat.of('hysios')
    chat.open(function(chat){
      chat.room.should.not.be.empty;
      done();
    });

  });

  it ('wait join chat', function(done){
    // var channels = Caramal.MessageManager.channels,
    //     length = Object.keys(channels).length;
    client.emit('remote', {
      action: 'join',
      type: 1,
      room: '123412341234',
      from: 'hyysios',
    });

    client.on('message', function(info){
      chat = Caramal.MessageManager.nameOfChannel('hyysios');
      chat.room.should.eql('123412341234');
      done();
    });
  });


  it ('recevice message', function(done){

    chat = Caramal.Chat.of('hysios');
    chat.open(function(chat){
      chat.send('hello world');
    })

    chat.onMessage(function(msg){
      msg.msg.should.eql('hello world');
      done();
    })
  });

  it ('recevice a notice', function(done){

    chat = Caramal.Chat.of('hysios');

    chat.open(function(chat){
      client.emit('remote', {
        user: 'hysios',
        action: 'notice',
        room: chat.room,
        type: 3
      });
      // chat.being_input()
    })

    chat.onEvent(function(msg){
      msg.type.should.eql(3)
      done();
    })
  });
});
