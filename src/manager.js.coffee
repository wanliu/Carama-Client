define ['core', 'exports'], (Caramal, exports) ->

  class Dispatchers

    dispatch_queue = []

    constructor: (@name) ->

    attach: (dispatch) ->
      dispatch_queue.push(dispatch)

    process: (msg) ->

      chunk_call = (callback) ->
        do_next = false
        next = () ->
          do_next = true
        callback(msg, next)
        do_next

      for dispatch in dispatch_queue
        if chunk_call(dispatch)
          break


  class ClientMessageManager

    message_dispatchs: {}

    constructor: (@client) ->
      return  unless @client?
      # throw new Error('you must initialize window.client object!') unless @client?
      @bind()

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
        @dispatch_process(name, data)

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


  Caramal.MessageManager ||= new ClientMessageManager(window.client)

  exports.ClientMessageManager = ClientMessageManager