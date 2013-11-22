define ['util'], (Util) ->

  class Event

    constructor: () ->
      @_listeners = {}


    addEventListener: (event, callback, context) ->
      callback.context = context
      unless (callbacks = @_listeners[event])?
        callbacks = @_listeners[event] = []

      if Util.isArray(callbacks)
        callbacks.push callback

    removeEventListener: (event, callback) ->
      callbacks = @_listeners[event]
      if callbacks? && Util.isArray(callbacks)
        for cb, i in callbacks
          if Util.isFunc(cb) && callback == cb
            return callbacks.splice(i, 1)[0]

    once: (event, callback) ->
     if callbacks? && Util.isArray(callbacks)
      for cb, i in callbacks
        if Util.isFunc(cb) && callback == cb
          return

      @on(event, callback)


    on: (event, callback, context) ->
      @addEventListener(event, callback)

    emit: (event, data) ->
      callbacks = @_listeners[event] || []

      for callback in callbacks
        if Util.isFunc(callback)
          if callback.context?
            callback.call(callback.context, data)
          else
            callback(data)


    send: (event, data) ->


