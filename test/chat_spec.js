define(['caramal', 'chat'], function(Caramal) {

  var url = 'http://localhost:5001',
    options ={
      // transports: ['websocket'],
      'force new connection': true
    },
    client = Caramal.connect(url, options);

  Caramal.MessageManager.setClient(client);

  describe('Caramal Chat test ', function(){
    it('open chat', function(done){
      chat = Caramal.Chat.create('hysios')
      chat.open()

      client.on('message', function(data){
        var info = JSON.parse(data);

        if (info.action == 'join') {
          console.log(info, info.action);
          done();
        }
      })
    });
  });
});
