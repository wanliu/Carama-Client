define ['core', 'exports'], (Caramal, exports) ->

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


  class ClientMessageManager

    constructor: (@client) ->
      @message_dispatchs = {}
      @return_commands = {}
      @channels = {}
      return  unless @client?
      # throw new Error('you must initialize window.client object!') unless @client?
      @bind()

    addReturnCommand: (command) ->
      unless command.option && command.option.id?
        throw new Error('return command must have id property')

      @return_commands[command.option.id] = command


    bind: () ->
      @unBind()
      @client.on 'message', (data) =>
        try
          info = JSON.parse data
          if @isEventMessage(info)
            @dispatch_process('event', info)
          else
            @dispatch_process('command', info)

        catch e
          @onError(e)

      @client.on 'chat', (data) =>
        @dispatch_process('message', data)

    dispatch_process: (name, data) ->
      dispatch = @message_dispatchs[name]
      if dispatch?
        try
          info = if typeof data == 'string'
                   JSON.parse data
                 else if typeof data == 'object'
                   data
                 else
                   throw new Error 'invalid data type'

          dispatch.process(info)
        catch e
          @onError(e)

    isEventMessage: (info) ->
      info.action == 'notice'


    unBind: () ->
      if @client?
        @client.unsubscribe('message')
        @client.unsubscribe('chat')

    setClient: (@client) ->
      @bind()

    registerDispatch: (message, dispatcher) ->
      dispatchers = @message_dispatchs[message] ||= new Dispatchers(message)
      dispatchers.attach(dispatcher)

    onError: (e) ->
      console.log(e)

    addChannel: (id, channel) ->
      @channels[id.toString()] = channel

    addNamedChannel: (name, channel) ->
      @channels[name] = channel

    ofChannel: (id) ->
      @channels[id.toString()]

    nameOfChannel: (name) ->
      @channels[name]

    roomOfChannel: (room) ->
      for id, chn of @channels
        if chn.options && chn.options.room == room
          return chn
      null


  Caramal.MessageManager ||= new ClientMessageManager(window.client)

  exports.ClientMessageManager = ClientMessageManager