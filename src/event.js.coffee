define ['util'], (Util) ->

  class Event

    constructor: () ->
      @_listeners = {}
      @_contexts = {}


    addEventListener: (event, callback, context) ->
      unless (callbacks = @_listeners[event])?
        callbacks = @_listeners[event] = []

      unless (contexts = @_contexts[event])?
        contexts = @_contexts[event] = []


      if Util.isArray(callbacks)
        callbacks.push callback
        contexts.push context

    removeEventListener: (event, callback) ->
      callbacks = @_listeners[event]
      contexts = @_contexts[event]
      if callbacks? && Util.isArray(callbacks)
        for cb, i in callbacks
          if Util.isFunc(cb) && callback == cb
            contexts.splice(i,1)
            return callbacks.splice(i, 1)[0]

    once: (event, callback) ->
     if callbacks? && Util.isArray(callbacks)
      for cb, i in callbacks
        if Util.isFunc(cb) && callback == cb
          return

      @on(event, callback)


    on: (event, callback, context) ->
      @addEventListener(event, callback, context)

    emit: (event, args...) ->
      callbacks = @_listeners[event] || []
      contexts = @_contexts[event] || []

      for callback, i in callbacks
        if Util.isFunc(callback)
          context = contexts[i]
          if context?
            callback.apply(context, args)
          else
            @call_mulit_args(callback, args)

    call_mulit_args: (callback, args) ->
      if args.length > 4
        callback(args[0], args[1], args[2], args[3], args[4])
      else if args.length > 3
        callback(args[0], args[1], args[2], args[3])
      else if args.length > 2
        callback(args[0], args[1], args[2])
      else if args.length > 1
        callback(args[0], args[1])
      else if args.length > 0
        callback(args[0])
      else
        callback()

    send: (event, data) ->


