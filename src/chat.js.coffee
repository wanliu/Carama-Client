define ['caramal',
  'chat/command',
  'chat/channel',
  'chat/chat',
  'chat/group',
  'chat/temporary',
  'chat/manager',
  'exports'],
  (Caramal,
   Command,
   Channel,
   Chat,
   Group,
   Temporary,
   ClientMessageManager,
   exports) ->

    Caramal.Channel = Channel
    Caramal.Chat = Chat
    Caramal.Group = Group
    Caramal.Temporary = Temporary
    Caramal.ClientMessageManager = ClientMessageManager
    Caramal