define ['core', 'chat/channel', 'chat/chat', 'util', 'exports'], (Caramal, Channel, Chat, Util, exports) ->

  class Group extends Channel
    commands: [
      'open',
      'join',
      'record',
      'history',
      'stop_record'
    ]

    hooks: {}

    type: Channel.TYPES['group']

    @beforeCommand 'open', (options = {}) ->
      @channel.setState('opening')
      Util.merge options, { type: @channel.type, group: @channel.group }

    @afterCommand 'open', (ret, room) ->
      @channel.setState('open')
      @channel.room = room

    constructor: (@id, @options) ->
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

    @create: (id, options = {}) ->
      manager = options.manager || @default_manager
      manager.addNamedChannel(id, new Group(id, options))

    @of: (id, options = {}) ->
      manager = options.manager || @default_manager
      channel = manager.nameOfChannel(id)
      channel || @create(id, options)


  Caramal.MessageManager.registerDispatch 'command', (info, next) ->
    
    if info.type is Channel.TYPES['group']
      Caramal.log('Receive Comamnd:', info)

    switch info.action
      when 'join'
        if info.type is Channel.TYPES['group']
          channel = Caramal.MessageManager.nameOfChannel(info.group)

          # unless channel? && channel.room is info.room
          #   channel = Group.create(info.group, {room: info.room})
          #   channel.command('join', info.room, (err, msg) ->
          #     if err?
          #       console.error('fails to join room! becouse of', err)
          #     else
          #       channel.setState('open')
          #       Caramal.MessageManager.emit('channel:new', channel)
          #   )
          unless channel?
            channel = Group.create(info.from, {room: info.room})
            channel.command('join', info.room, {}, (ch, err, msg) ->
              if err?
                console.error('fails to join room! becouse of', err)
              else
                channel.setState('open')
                Caramal.MessageManager.emit('channel:new', channel)
            )
          else if channel.room isnt info.room # 断线重连，Caramal-Server重启
            channel.command('join', info.room, {}, (ch, err, msg) ->
              if err?
                console.error('fails to join room! becouse of', err)
              else
                channel.command('record', info.room)
                channel.room = info.room
                # channel.setState('open')
                # Caramal.MessageManager.emit('channel:new', channel)
            )
        else
          next()
      else
        next()

  exports.Group = Group

