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

    constructor: (@channel, @name, @options = {}) ->
      @socket = @channel.socket
      @option = new CommandOption(@options)

    execute: (data) ->
      @_doBeforeCallback(data, {})
      @doExecute(data, {})

    doExecute: (data, options) ->
      ;

    beforeExecute: (@before_callback) ->

    afterExecute: (@after_callback) ->

    onReturnExecute: (@return_callback) ->

    _doBeforeCallback: (data, options) ->
      if Util.isFunc(@before_callback)
        @before_callback(data, options)

    _doAfterCallback: (data, options) ->
      if Util.isFunc(@after_callback)
        @after_callback(data, options)

    _doReturnCallback: (data, options) ->
      if Util.isFunc(@return_callback)
        @return_callback(data, options)

    sendCommand: (cmd, data = {}, callback = @_doAfterCallback) ->
      send_data = Util.merge {
                    command_id: @option.id,
                  }, data
      @socket.emit cmd, JSON.stringify(send_data), callback

  class OpenCommand extends Command

    doExecute: (data, options = {}) ->
      @sendCommand 'open', data

  class JoinCommand extends Command

    doExecute: (data, options = {}, callback = null) ->
      debugger
      unless data?
        data = {room: @channel.options.room }
      @sendCommand 'join', data, callback

  class CloseCommand extends Command

    doExecute: (data, options = {}, callback = null) ->
      @sendCommand 'leave', data, callback

  Caramal.Command = Command
  Caramal.OpenCommand = OpenCommand
  Caramal.JoinCommand = JoinCommand
  Caramal.CloseCommand = CloseCommand
