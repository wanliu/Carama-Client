define(['caramal', 'chat/channel', 'chat/manager', 'chat/chat'], function(Caramal, Channel, Chat) {

  describe("Channel", function(){

    it("create", function(){
      channel = Channel.create();
      Caramal.MessageManager.channels[channel.id].should.eq(channel);
    })

    it("chat create", function(){
      chat = Caramal.Chat.create('hyysios');
      Caramal.MessageManager.channels['hyysios'].should.eq(chat);
    });
  })
});
