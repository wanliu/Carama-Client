define ['socket.io', 'core'], (io, Caramal) ->

  class Caramal.Client

    constructor: (@url, @options) ->
      @socket = io.connect(@url, @options)

    on: (event, callback) ->
      @socket.on(event, callback)

    subscribe: (channel, callback) ->
      @on(channel, callback)

    unsubscribe: (channel, callback) ->
      @socket.removeListener(channel);

    emit: (event, data, callback) ->
      @socket.emit(event, data, callback)

  Caramal.connect = (url , options) ->

    new Caramal.Client(url, options)