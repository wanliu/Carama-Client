define ['core', 'chat/manager', 'util', 'event', 'exports'], (Caramal, Manager, Util, Event, exports) ->

  class Channel extends Event

    ###*
     * 最大消息数
     * @type {Number}
    ###
    MAXIMUM_MESSAGES = 2000

    ###*
     * 有效命令列表
     * @type {Array}
    ###
    commands: [
      'open',
      'join',
      'close'
    ]

    @nextId = 0

    ###*
     * 管理器对象
     * @type {Caramal.ClientMessageManager}
    ###
    @default_manager = Caramal.MessageManager

    @TYPES = {
      normal: 0,
      chat: 1,
      group: 2
    }

    constructor: (@options = {}) ->
      super
      @id = Channel.nextId++

      ###*
       * 消息缓存区
       * @type {Array}
      ###
      @message_buffer = []

      ###*
       * 频道状态
       * @type {String}
      ###
      @_state = 'inactive'
      @_active = false

      manager = @options.manager || @constructor.default_manager
      @setOptions(@options)
      @setManager(manager)

      ###*
       * socket.io 的 Socket 对象
       * @type {Socket}
      ###
      @bindSocket(@manager.client);
      @_buildCommands()

    setOptions: (options) ->
      for name, opt of options
        @[name] = opt

    setState: (@_state) ->

    getState: () ->
      @_state

    bindSocket: (@socket) ->

    _buildCommands: () ->

      for cmd in @commands
        @exposeCommand(cmd)

    exposeCommand: (method) ->
      if @hasOwnProperty method
        throw new Error("always has #{method} property or function")

      @[method] = (data = null, options = {}, callback = null)  =>


        if Util.isFunc(data)
          callback = data
          data = null
          options = {}
        else if Util.isFunc(options)
          callback = options
          options = {}

        @command(method, data, options, callback)

    ###*
     * 接受到消息数据的回调
     * @param  {Function} message_callback 消息回调
    ###
    onMessage: (@message_callback, context) ->
      @on('message', @message_callback, context)

    ###*
     * 来至服务端的命令回调
     * @param  {Function} command 命令对象
    ###
    onCommand: (@command_callback, context) ->
      @on('command', @command_callback, context)

    ###*
     * 处发事件的回调
     * @param  {Function} event 事件对象
    ###
    onEvent: (@event_callback, context) ->
      @on('event', @event_callback, context)

    ###*
     * 错误回调
     * @param  {Function} @error_callback 错误回调
    ###
    onError: (@error_callback) ->
      @setState('faild')
      @on('error', @error_callback)

    ###*
     * 更换消息管理器，会使得这个 Channel 完全处理于别一个消息处理机制中
     * @param {MessageManager} @manager 消息管理器对象
    ###
    setManager: (@manager) ->

    ###*
     * 激活频道，为了处理用户空闲，离开与消息通知等功能， 在用户进入输入时，实际上会自动调用
    ###
    active: () ->
      @_active = true

    ###*
     * 反激活频道，使频道进入无人状态，消息会到来，会由 OnMessage 处发变成 OnDeactiveMessage 处发
    ###
    deactive: () ->
      @_active = false


    isActive: () ->
      @_active

    ###*
     * 发送消息
     * @param  {Object} msg 消息结构
    ###
    send: (channel, msg) ->
      @socket.emit(channel, JSON.stringify(msg))

    ###*
     * 执行命令
     * @param  {String} cmd     命令名称, 像是 commands 中的名称
     * @param  {Object} options 参数结构
    ###
    command: (cmd, data = null, options = {}, callback) ->

      return unless @commands.contain(cmd)

      class_name = "#{cmd.toCamelCase()}Command"
      klass = Caramal[class_name]
      throw new Error("not have Caramal.#{class_name} class") unless klass?

      command = new klass(@, cmd, options)

      @_setupHooks(cmd, command)

      @manager.addReturnCommand(command) if options['return']?
      command.execute(data, callback)

    _setupHooks: (cmd, command) ->
      hooks = @hooks
      for name, hook of hooks
        if hook.name == cmd
          if hook.type == 'before'
            command.beforeExecute(hook.proc)
          else if hook.type == 'after'
            command.afterExecute(hook.proc)
          else
            ;

    @create: (options = {}) ->
      manager = options.manager || @default_manager
      manager.addChannel(Channel.nextId, new Channel(options))

    @of: (id) ->
      manager = options.manager || @default_manager
      manager.ofChannel(id)

    @beforeCommand: (cmd, callback) ->
      @prototype.hooks["before_#{cmd}"] = {
        name: cmd,
        proc: callback
        type: 'before',
      }

    @afterCommand = (cmd, callback) ->
      @prototype.hooks["after_#{cmd}"] = {
        name: cmd,
        proc: callback
        type: 'after',
      }


  exports.Channel = Channel
