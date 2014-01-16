define ['core', 'chat/channel', 'chat/chat', 'util', 'exports'], (Caramal, Channel, Chat, Util, exports) ->

  class Group extends Channel
    commands: [
      'open',
      'join'
    ]

    hooks: {}

    type: Channel.TYPES['group']

    @beforeCommand 'open', (options = {}) ->
      @channel.setState('opening')
      Util.merge options, { type: @channel.type, group: @channel.group }

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
      manager.addNamedChannel(group, new Group(group, options))

    @of: (group, options = {}) ->
      manager = options.manager || @default_manager
      group = manager.nameOfChannel(group)
      group || @create(group, options)


  Caramal.MessageManager.registerDispatch 'command', (info, next) ->

    if info.type == Channel.TYPES['group']
      Caramal.log('Receive Comamnd:', info)

    switch info.action
      when 'join'
        if info.type == Channel.TYPES['group']
          channel = Caramal.MessageManager.nameOfChannel(info.group)

          unless channel? && channel.room is info.room
            channel = Group.create(info.group, {room: info.room})
            channel.command('join', info.room)
            channel.setState('open')
            Caramal.MessageManager.emit('channel:new', channel)
        else
          next()
      else
        next()

  exports.Group = Group






