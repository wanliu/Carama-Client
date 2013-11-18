define ['core', 'chat/channel', 'chat/manager', 'util', 'exports'], (Caramal, Channel, MessageManager, Util, exports) ->

  class Chat extends Channel

    commands: [
      'open',
      'join'
    ]

    type: Channel.TYPES['chat']

    @beforeCommand 'open', (options = {}) ->
      Util.merge options, { type: @channel.type, user: @channel.user }

    @afterCommand 'open', (ret) ->
      @channel.room = ret

      # Util.merge options, { type: 1, user: @channel.user }

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
     * @return {[type]}     [description]
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


  Caramal.MessageManager.registerDispatch 'command', (info, next) ->
    if info.type == Channel.TYPES['chat']
      Caramal.log('Receive Comamnd:', info)

    switch info.action
      when 'join'
        if info.type == Channel.TYPES['chat']
          channel = Caramal.MessageManager.roomOfChannel(info.room)
          channel = if channel? then channel else Chat.create(info.from, {room: info.room})
          channel.command('join')
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





