define ['core', 'manager', 'util', 'underscore', 'exports'], (Caramal, Manager, Util, _, exports) ->

  class Channel

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

    ###*
     * 消息缓存区
     * @type {Array}
    ###
    message_buffer: []

    ###*
     * 频道状态
     * @type {[String]}
    ###
    state: 'open'

    ###*
     * socket.io 的 Socket 对象
     * @type {[Socket]}
    ###
    socket: null

    ###*
     * 管理器对象
     * @type {[type]}
    ###
    manager: Caramal.MessageManager

    constructor: (@name, @options = {}) ->
      @bindSocket(@manager.client);
      @_buildCommands()

    bindSocket: (@socket) ->

    _buildCommands: () ->

      for cmd in @commands
        @exposeCommand(cmd)

    exposeCommand: (method) ->
      if @hasOwnProperty method
        throw new Error("always has #{method} property or function")

      @[method] = (args..., options) =>
        @command(method, args, options)

    ###*
     * 接受到消息数据的回调
     * @param  {[hash]} msg 消息数据
    ###
    onMessage: (msg) ->

    ###*
     * 来至服务端的命令回调
     * @param  {hash} command 命令对象
    ###
    onCommand: (command) ->

    ###*
     * 处发事件的回调
     * @param  {hash} event 事件对象
    ###
    onEvent: (event) ->

    ###*
     * 更换消息管理器，会使得这个 Channel 完全处理于别一个消息处理机制中
     * @param {MessageManager} @manager 消息管理器对象
    ###
    setManager: (@manager) ->

    ###*
     * 激活频道，为了处理用户空闲，离开与消息通知等功能， 在用户进入输入时，实际上会自动调用
     * @return {[type]} [description]
    ###
    active: () ->

    ###*
     * 反激活频道，使频道进入无人状态，消息会到来，会由 OnMessage 处发变成 OnDeactiveMessage 处发
     * @return {[type]} [description]
    ###
    deactive: () ->


    isActive: () ->

    ###*
     * 发送消息
     * @param  {Hash} msg 消息结构
     * @return {[type]}     [description]
    ###
    send: (channel, msg) ->
      @socket.emit(channel, msg)

    ###*
     * 执行命令
     * @param  {String} cmd     命令名称, 像是 commands 中的名称
     * @param  {[Hash]} options 参数结构
     * @return {[type]}         [description]
    ###
    command: (cmd, args..., options) ->

        return unless Util.contain(@commands, cmd)

        console.log "#{cmd.toTitleCase()}Command"
        # Util.classify()


    create: () ->
      channel_name = @generateId()
      @manager.channels[channgel_name] = new Channel(Util.generateId())

  exports.Channel = Channel
