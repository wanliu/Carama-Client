define ['core', 'chat/channel', 'chat/chat', 'util', 'exports'], (Caramal, Channel, Chat, Util, exports) ->

  class Temporary extends Channel
    commands: [
      'open',
      'join',
      'record',
      'history',
      'stop_record'
    ]

    hooks: {}

    type: Channel.TYPES['temporary']

    @beforeCommand 'open', (options = {}) ->
      @channel.setState('opening')
      Util.merge options, { type: @channel.type, group: @channel.name }

    @afterCommand 'open', (ret, room) ->
      @channel.setState('open')
      @channel.room = room

    constructor: (@group, @options) ->
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

      @socket.emit('chat', msg)

    @create: (group, options = {}) ->
      manager = options.manager || @default_manager
      manager.addNamedChannel(group, new Temporary(group, options))

    @of: (group, options = {}) ->
      manager = options.manager || @default_manager
      channel = manager.nameOfChannel(group)
      channel || @create(group, options)


  Caramal.MessageManager.registerDispatch 'command', (info, next) ->
    
    if info.type is Channel.TYPES['temporary']
      Caramal.log('Receive Comamnd:', info)

    switch info.action
      when 'join'
        if info.type is Channel.TYPES['temporary']
          channel = Caramal.MessageManager.nameOfChannel(info.group)
          unless channel?
            channel = Temporary.create(info.group, {room: info.room, name: info.name})
            channel.command('join', info.room, {}, (ch, err, msg) ->
              if err?
                console.error('fails to join room! becouse of', err)
              else
                channel.setState('open')
                channel.emit('open')
                Caramal.MessageManager.emit('channel:new', channel)
            )
          else if channel.room isnt info.room  # 断线重连，Caramal-Server重启
            channel.command('join', info.room, {}, (ch, err, msg) ->
              if err?
                console.error('fails to join room! becouse of', err)
              else
                if info.mode is 1   # 仅在mode为1时需要记录
                  channel.command('record', info.room)
                channel.room = info.room
                channel.name = info.name
                channel.emit('open')
                # channel.setState('open')
                # Caramal.MessageManager.emit('channel:new', channel)
            )
        else
          next()
      else
        next()

  exports.Temporary = Temporary

