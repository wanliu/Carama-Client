define(['caramal', 'chat'], function(Caramal) {
  Caramal.debug = true;

  var url = 'http://localhost:5001',
    options ={
      // transports: ['websocket'],
      'force new connection': true
    };

  var client = Caramal.connect(url, options);
  var token = 'temp:1ec41430-6ecb-11e3-87b5-1bc916eec6fa'

  Caramal.MessageManager.setClient(client);

  describe('Caramal Temporary test ', function(done){

    // 打开一个会话， 会返回一个 rid
    it('open temporary', function(done){
      group = Caramal.Temporary.of(token);
      group.open(function(group){
        group.room.should.not.be.empty;
        done();
      });

    });

    it ('wait join temporary', function(done){
      // var channels = Caramal.MessageManager.channels,
      //     length = Object.keys(channels).length;
      client.emit('remote', JSON.stringify({
        action: 'join',
        type: 3,
        group: token
        // room: '5858518'
      }));

      client.on('message', function(info){
        group = Caramal.MessageManager.nameOfChannel(token, Channel.TYPES['temporary']);
        // group.room.should.eql('5858518');
        done();
      });
    });


    it ('recevice message', function(done){

      group = Caramal.Temporary.of(token);
      group.open(function(group){
        group.send('hello world');
        console.log(group.room)
      })

      group.onMessage(function(msg){
        msg.msg.should.eql('hello world');
        done();
      })

      console.log(group._listeners);
    });
  });
});
