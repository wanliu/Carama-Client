define ['core', 'util'], (Caramal, Util) ->

  class CommandOption
    default_options: {
      maximum_reply: 0,         # 最大命令回复数
      alive_timeout: 5000,      # 等待时长
      default_action: null,     # 超过默认触发
      repeat_reply: false       # 可否重复回复
    }

    constructor: (@options) ->
      @options['id'] ||= Util.generateId()
      Util.merge @options, @default_options
      @methodlizm(@options)

    methodlizm: (hash) ->
      for k,v of hash
        @[k] = v

  class Command

    constructor: (@channel, @name, @option) ->
      @socket = @channel.socket
      @option = new CommandOption(@options)

    execute: (args..., options) ->
      @_doBeforeCallback(args, options)
      args.push options
      @doExecute.apply(@, args)

    doExecute: (args..., options) ->
      ;

    beforeExecute: (@before_callback) ->

    afterExecute: (@after_callback) ->

    onReturnExecute: (@return_callback) ->

    _doBeforeCallback: (args...) ->
      if Util.isFunc(@before_callback)
        @before_callback.apply(@, args)

    _doAfterCallback: (args...) ->
      if Util.isFunc(@after_callback)
        @after_callback.apply(@, args)

    _doReturnCallback: (args...) ->
      if Util.isFunc(@return_callback)
        @return_callback.apply(@, args)

    setOption: (data) ->
      @option = new CommandOption(data)

    sendCommand: (cmd, data, callback = @_doAfterCallback) ->
      send_data = Util.merge {
                    command_id: @option.id,
                  }, data
      @socket.emit cmd, send_data, callback

  class OpenCommand extends Command

    doExecute: (room = null, options = {}) ->
      @sendCommand 'open', options

  class JoinCommand extends Command

    execute: (room = null, options = {}, callback = null) ->
      @sendCommand 'join', options, callback

  class CloseCommand extends Command

    execute: (room = null, options = {}, callback = null) ->
      @sendCommand 'leave', options, callback

  Caramal.Command = Command
  Caramal.OpenCommand = OpenCommand
  Caramal.JoinCommand = JoinCommand
  Caramal.CloseCommand = CloseCommand
