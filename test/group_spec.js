define(['caramal', 'chat'], function(Caramal) {
  Caramal.debug = true;

  var url = 'http://localhost:5001',
    options ={
      // transports: ['websocket'],
      'force new connection': true
    };

  var client = Caramal.connect(url, options);

  Caramal.MessageManager.setClient(client);

  describe('Caramal Group test ', function(done){

    // 打开一个会话， 会返回一个 rid
    it('open group', function(done){
      group = Caramal.Group.create('chinese people');
      group.open(function(){
        group.room.should.not.be.empty;
        done();
      });

    });

    it ('wait join group', function(done){
      // var channels = Caramal.MessageManager.channels,
      //     length = Object.keys(channels).length;
      client.emit('remote', JSON.stringify({
        action: 'join',
        type: 2,
        group: 'hunan people',
        room: '483848343434',
      }));

      client.on('message', function(info){
        group = Caramal.MessageManager.nameOfChannel('hunan people');
        group.room.should.eql('483848343434');
        done();
      });
    });


    it ('recevice message', function(done){

      chat = Caramal.Chat.create('chinese people');
      chat.open(function(){
        chat.send('hello world');
      })

      chat.onMessage(function(msg){
        msg.msg.should.eql('hello world');
        done();
      })
    });
  });
});
