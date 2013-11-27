define ['core', 'chat/channel', 'chat/manager', 'util', 'exports'], (Caramal, Channel, MessageManager, Util, exports) ->

  class Chat extends Channel
    ###
    Example
      Caramal.MessageManager.setClient(clients.client);
      # => SocketNamespace {socket: Socket, name: "", flags: Object, json: Flag, ackPackets: 0…}
      chat = Caramal.Chat.create('hysios')
      # => Chat {user: "hysios", options: Object, id: 0, message_buffer: Array[0], state: "open"…}
      chat.onMessage(function(msg){
         console.log(msg);
      });
      # => 1
      chat.send('hi')
      # => SocketNamespace {socket: Socket, name: "", flags: Object, json: Flag, ackPackets: 0…}
      channel
      # => Chat {user: "hysios", options: Object, id: 0, message_buffer: Array[0], state: "open"…}
      # => Object {msg: "hi", user: "hyysios", action: "chat"} VM4331:3
      chat.send('everybody')
      # => SocketNamespace {socket: Socket, name: "", flags: Object, json: Flag, ackPackets: 0…}
      # => Object {msg: "everybody", user: "hyysios", action: "chat"} VM4331:3
    ###

    commands: [
      'open',
      'join',
      'record',
      'stop_record',
      'history'
    ]

    hooks: {}

    type: Channel.TYPES['chat']

    @beforeCommand 'open', (options = {}) ->
      @channel.setState('opening')
      Util.merge options, { type: @channel.type, user: @channel.user }

    @afterCommand 'open', (ret, room) ->
      @channel.setState('open')
      @channel.room = room

    ###*
     * 单一用户聊天
     * @param  {String} login  用户登陆名
     * @return {Chat}          Chat 对象
    ###
    constructor: (@user, @options) ->
      super(@options)

    ###*
     * 发送消息
     * @param  {Hash} msg 消息结构
    ###
    send: (msg) ->
      msg = if typeof msg == 'string'
              { msg: msg }
            else if Util.isObject(msg)
              msg
            else
              throw new Error('invalid message type')

      msg.room = @room

      @socket.emit('chat', JSON.stringify(msg))

    ###*
     * 暂时离开的通知
    ###
    afk: () ->
      @socket.emit('afk', JSON.stringify({
        room: @room }))

    ###*
     * 正在输入的功能
    ###
    being_input: () ->
      @socket.emit('inputing', JSON.stringify({
        room: @room }))

    @create: (user, options = {}) ->
      manager = options.manager || @default_manager
      manager.addNamedChannel(user, new Chat(user, options))

    @of: (user, options = {}) ->
      manager = options.manager || @default_manager
      chat = manager.nameOfChannel(user)
      chat || @create(user, options)

  Caramal.MessageManager.registerDispatch 'command', (info, next) ->
    if info.type == Channel.TYPES['chat']
      Caramal.log('Receive Comamnd:', info)

    switch info.action
      when 'join'
        if info.type == Channel.TYPES['chat']
          channel = Caramal.MessageManager.nameOfChannel(info.from)
          unless channel?
            channel = Chat.create(info.from, {room: info.room})
            channel.command('join', info.room)
            channel.setState('open')
            Caramal.MessageManager.emit('channel:new', channel)
        else
          next()
      else
        next()

  Caramal.MessageManager.registerDispatch 'message', (info, next) ->

    Caramal.log('Receive Message:', info)
    channel = Caramal.MessageManager.roomOfChannel(info.room)
    if channel?
      channel.emit('message', info)
    else
      next()


  Caramal.MessageManager.registerDispatch 'event', (event, next) ->

    Caramal.log('Receive Event:', event)

    channel = Caramal.MessageManager.roomOfChannel(event.room)
    if channel?
      channel.emit('event', event)
    else
      next()


  exports.Chat = Chat





