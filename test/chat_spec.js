define(['caramal', 'chat'], function(Caramal) {
  Caramal.debug = true;

  var url = 'http://localhost:5001',
    options ={
      // transports: ['websocket'],
      'force new connection': true
    };

  // var  hysios = Caramal.connect(url + '/hysios', options);
  // hysios.set('user', 'hysios');

  // var  baby = Caramal.connect(url + '/baby', options);
  // baby.set('user', 'baby')
  //
  var client = Caramal.connect(url, options);

  Caramal.MessageManager.setClient(client);

  describe('Caramal Chat test ', function(done){

    // 打开一个会话， 会返回一个 rid
    it('open chat', function(done){
      chat = Caramal.Chat.create('hysios')
      chat.open(function(){
        chat.room.should.not.be.empty;
        done();
      })

    });

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
    })


    it ('recevice message', function(done){

      chat  = Caramal.Chat.create('hysios')
      chat.open(function(){
        chat.send('hello world')
      })

      chat.onMessage(function(msg){
        msg.msg.should.eql('hello world');
        done();
      })
    })

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
