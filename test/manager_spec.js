define(['caramal', 'chat/manager' ], function(Caramal, ClientMessageManager) {
  Caramal.debug = true;

  var url = 'http://localhost:5001',
    options ={
      // transports: ['websocket'],
      'force new connection': true
    };

  var client = Caramal.connect(url, options);

  Caramal.MessageManager.setClient(client);

    describe('ClientMessageManager', function() {

      it('on channel:new event', function(done){

        client.emit('remote', JSON.stringify({
          action: 'join',
          type: 1,
          room: '123412341234',
          from: 'hyysios',
        }));

        Caramal.MessageManager.on('channel:new', function(channel){
          channel.room.should.eql('123412341234');
          done();
        });
      })
    })
});
