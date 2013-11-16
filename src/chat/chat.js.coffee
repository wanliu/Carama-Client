define ['core', 'chat/channel', 'chat/manager', 'util', 'exports'], (Caramal, Channel, MessageManager, Util, exports) ->

  class Chat extends Channel

    commands: [
      'open',
      'join'
    ]

    @beforeCommand 'open', (options) ->

      Util.merge options, { type: 1, user: @channel.user }

    ###*
     * 单一用户聊天
     * @param  {String} login  用户登陆名
     * @return {Chat}          Chat 对象
    ###
    constructor: (@user, @options) ->
      super(@options)

    @create: (user, options = {}) ->
      manager = options.manager || @default_manager
      # channel = manager.ofNamedChannel(user)
      # if channel?
      #   return channel

      manager.addNamedChannel(user, new Chat(user, options))


  Caramal.MessageManager.registerDispatch 'command', (info, next) ->

    switch info.action
      when 'join'
        if info.type == 1
          channel = Caramal.MessageManager.ofNamedChannel(info.from)
          channel = if channel? then channel else Chat.create(info.from, {room: info.room})
          channel.command('join')
        else
          next()
      else
        next()


  exports.Chat = Chat





