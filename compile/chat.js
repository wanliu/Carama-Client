(function() {
  define(['core', 'chat/command', 'chat/channel', 'chat/chat', 'chat/group', 'chat/manager', 'exports'], function(Caramal, Command, Channel, Chat, Group, ClientMessageManager, exports) {
    Caramal.Channel = Channel;
    Caramal.Chat = Chat;
    Caramal.Group = Group;
    return Caramal.ClientMessageManager = ClientMessageManager;
  });

}).call(this);
