define(['caramal', 'chat'], function(Caramal) {
  Caramal.debug = true;

  var url = 'http://localhost:5001',
    options ={
      // transports: ['websocket'],
      'force new connection': true
    };
  var client;

  before(function(){
    client = Caramal.connect(url, options);
    Caramal.MessageManager.setClient(client);
  })

  after(function(){
    client.close();
  })

  describe('Caramal Chat test ', function(done){

    // 打开一个会话， 会返回一个 rid
    it('open chat', function(done){
      chat = Caramal.Chat.of('hysios')
      chat.open(function(chat){
        chat.room.should.not.be.empty;
        done();
      });

    });

    it('join chat', function(done){

      chat = Caramal.Chat.of('test1')
      chat.join('1111111111111')

      setTimeout(function(){
        done();
      }, 1000)
      // chat.info(function(chat, info){
      //   console.log(info);
      // })
    })

    it ('wait join chat', function(done){
      // var channels = Caramal.MessageManager.channels,
      //     length = Object.keys(channels).length;
      client.emit('remote', JSON.stringify({
        action: 'join',
        type: 1,
        room: '123412341234',
        from: 'hyysios',
      }));

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
        client.emit('remote', JSON.stringify({
          user: 'hysios',
          action: 'notice',
          room: chat.room,
          type: 3
        }));
        // chat.being_input()
      })

      chat.onEvent(function(msg){
        msg.type.should.eql(3)
        done();
      })
    });

    //   // hysios.on('message', function(data){
    //   //   var info = JSON.parse(data);

    //   //   if (info.action == 'join') {
    //   //     done();
    //   //   }
    //   // })
    //   // setTimeout(function(){ done()}, 1000);
    // });

    // it('send message', function(done){
    //   chat = Caramal.Chat.create('hyysios');
    //   chat.open(function(ret){
    //     chat.send({msg: 'hello world'});
    //   });


    //   chat.onMessage(function(msg){
    //     msg.msg.should.eq('hello world');
    //     done();
    //   });
    // })

    // it ('onMessage', function(done){
    //   hysios.emit('chat', JSON.stringify({msg: 'I am a message'}));

    //   hysios.on('message', function(data){
    //     console.log('hysios:', data);
    //   })

    //   baby.on('message', function(data){
    //     console.log('baby:', data)
    //   })

    //   setTimeout(function(){ done()}, 1000);
    // })
  });
});
