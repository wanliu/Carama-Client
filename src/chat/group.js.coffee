define ['core', 'chat/channel', 'chat/chat', 'util', 'exports'], (Caramal, Channel, Chat, Util, exports) ->

  class Group extends Channel
    commands: [
      'open',
      'join'
    ]

    type: Channel.TYPES['group']

    @beforeCommand 'open', (options = {}) ->
      Util.merge options, { type: @channel.type, group: @channel.group }

    @afterCommand 'open', (ret) ->
      @channel.room = ret

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

      @socket.emit('chat', JSON.stringify(msg))

    @create: (group, options = {}) ->
      manager = options.manager || @default_manager
      manager.addNamedChannel(group, new Group(group, options))

  Caramal.MessageManager.registerDispatch 'command', (info, next) ->

    if info.type == Channel.TYPES['group']
      Caramal.log('Receive Comamnd:', info)

    switch info.action
      when 'join'
        if info.type == Channel.TYPES['group']
          channel = Caramal.MessageManager.roomOfChannel(info.room)
          if info.group?
            channel = if channel? then channel else Group.create(info.group, {room: info.room})
            channel.command('join')
          else
            next()
        else
          next()
      else
        next()

  exports.Group = Group






