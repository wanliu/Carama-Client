define ['core', 'event', 'exports'], (Caramal, Event, exports) ->

  class Dispatchers

    # dispatch_queue: []

    constructor: (@name) ->
      @dispatch_queue = []

    attach: (dispatch) ->
      @dispatch_queue.push(dispatch)

    process: (msg) ->

      chunk_call = (callback) ->
        do_next = false
        next = () ->
          do_next = true
        callback(msg, next)
        do_next

      for dispatch in @dispatch_queue
        unless chunk_call(dispatch)
          break


  class ClientMessageManager extends Event

    constructor: (@client) ->
      super
      @message_dispatchs = {}
      @return_commands = {}
      @channels = { 0: {}, 1: {}, 2: {}, 3: {} }
      return  unless @client?
      @client.on 'connect', () =>
        @clent.emit('get-unread', {}, @setUnreadMsg)
      # throw new Error('you must initialize window.client object!') unless @client?
      @bind()

    addReturnCommand: (command) ->
      unless command.option && command.option.id?
        throw new Error('return command must have id property')

      @return_commands[command.option.id] = command


    bind: () ->
      @unBind()
      @client.on 'message', (info) =>
        try
          if @isEventMessage(info)
            @dispatch_process('event', info)
          else
            @dispatch_process('command', info)
        catch e
          @onError(e)

      @client.on 'chat', (data) =>
        @dispatch_process('message', data)

      @client.on 'system_info', (data) =>
        @dispatch_process('system_info', data)

      @client.emit 'get-unread', {}, (err, unreadMsgs) =>
        @setUnreadMsg(err, unreadMsgs)

      # @client.on 'reconnect', () =>
      #   @clent.emit 'get-unread', {}, (err, unreadMsgs) =>
      #     @setUnreadMsg(err, unreadMsgs)

    setUnreadMsg: (err, unreadMsgs) ->
      @unreadMsgs = unreadMsgs
      @emit('resetUnreadMsgs', {})

    dispatch_process: (name, data) ->
      dispatch = @message_dispatchs[name]
      if dispatch?
        try
          info = @parseJSON(data)
          dispatch.process(info)
        catch e
          @onError(e)

    parseJSON: (data) ->
      if typeof data == 'string'
        JSON.parse data
      else if typeof data == 'object'
        data
      else
        throw new Error 'invalid data type'

    isEventMessage: (data) ->
      info = @parseJSON(data)
      info.action == 'notice'

    unBind: () ->
      if @client?
        @client.unsubscribe('message')
        @client.unsubscribe('chat')
        @client.unsubscribe('system_info')

    setClient: (@client) ->
      @bind()

    registerDispatch: (message, dispatcher) ->
      dispatchers = @message_dispatchs[message] ||= new Dispatchers(message)
      dispatchers.attach(dispatcher)

    onError: (e) ->
      console.log(e)

    addChannel: (id, channel, type) ->
      @channels[type][id.toString()] = channel

    addNamedChannel: (name, channel, type) ->
      @channels[type][name] = channel

    ofChannel: (id, type) ->
      @channels[type][id.toString()]

    nameOfChannel: (name, type) ->
      @channels[type][name]

    roomOfChannel: (room) ->
      chat = null
      for i, chns of @channels
        for id, chn of chns
          if chn.room == room
            chat = chn
            break
      chat


  Caramal.MessageManager ||= new ClientMessageManager(window.client)

  exports.ClientMessageManager = ClientMessageManager