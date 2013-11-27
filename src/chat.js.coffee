define ['caramal',
  'chat/command',
  'chat/channel',
  'chat/chat',
  'chat/group',
  'chat/manager',
  'exports'],
  (Caramal,
   Command,
   Channel,
   Chat,
   Group,
   ClientMessageManager,
   exports) ->

    Caramal.Channel = Channel
    Caramal.Chat = Chat
    Caramal.Group = Group
    Caramal.ClientMessageManager = ClientMessageManager
    Caramal