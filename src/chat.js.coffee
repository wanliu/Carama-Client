define ['core', 'channel', 'manager', 'exports'], (Caramal, Channel, MessageManager, exports) ->

  class Chat extends Channel

    commands: [
      'open',
      'join'
    ]

    ###*
     * 单一用户聊天
     * @param  {String} login  用户登陆名
     * @return {Chat}          Chat 对象
    ###
    constructor: (login, @options) ->
      super

    create: (each_other, options) ->
      @manager.channels[each_other] ||= new Chat(each_other, options)

  Caramal.MessageManager.registerDispatch 'message', (info, next) ->

    switch info.action
      when 'join'
        if info.type == 1
          info.room
          chat = Chat.create(info.from, {room: info.room})
          chat.command('join')
        else
          next()
      else
        next()


  exports.Chat = Chat





