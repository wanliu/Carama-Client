(function() {
  var __slice = [].slice;

  define(['core', 'manager', 'util', 'underscore', 'exports'], function(Caramal, Manager, Util, _, exports) {
    var Channel;
    Channel = (function() {
      /**
       * 最大消息数
       * @type {Number}
      */

      var MAXIMUM_MESSAGES;

      MAXIMUM_MESSAGES = 2000;

      /**
       * 有效命令列表
       * @type {Array}
      */


      Channel.prototype.commands = ['open', 'join', 'close'];

      /**
       * 消息缓存区
       * @type {Array}
      */


      Channel.prototype.message_buffer = [];

      /**
       * 频道状态
       * @type {[String]}
      */


      Channel.prototype.state = 'open';

      /**
       * socket.io 的 Socket 对象
       * @type {[Socket]}
      */


      Channel.prototype.socket = null;

      /**
       * 管理器对象
       * @type {[type]}
      */


      Channel.prototype.manager = Caramal.MessageManager;

      function Channel(name, options) {
        this.name = name;
        this.options = options != null ? options : {};
        this.bindSocket(this.manager.client);
        this._buildCommands();
      }

      Channel.prototype.bindSocket = function(socket) {
        this.socket = socket;
      };

      Channel.prototype._buildCommands = function() {
        var cmd, _i, _len, _ref, _results;
        _ref = this.commands;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cmd = _ref[_i];
          _results.push(this.exposeCommand(cmd));
        }
        return _results;
      };

      Channel.prototype.exposeCommand = function(method) {
        var _this = this;
        if (this.hasOwnProperty(method)) {
          throw new Error("always has " + method + " property or function");
        }
        return this[method] = function() {
          var args, options, _i;
          args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), options = arguments[_i++];
          return _this.command(method, args, options);
        };
      };

      /**
       * 接受到消息数据的回调
       * @param  {[hash]} msg 消息数据
      */


      Channel.prototype.onMessage = function(msg) {};

      /**
       * 来至服务端的命令回调
       * @param  {hash} command 命令对象
      */


      Channel.prototype.onCommand = function(command) {};

      /**
       * 处发事件的回调
       * @param  {hash} event 事件对象
      */


      Channel.prototype.onEvent = function(event) {};

      /**
       * 更换消息管理器，会使得这个 Channel 完全处理于别一个消息处理机制中
       * @param {MessageManager} @manager 消息管理器对象
      */


      Channel.prototype.setManager = function(manager) {
        this.manager = manager;
      };

      /**
       * 激活频道，为了处理用户空闲，离开与消息通知等功能， 在用户进入输入时，实际上会自动调用
       * @return {[type]} [description]
      */


      Channel.prototype.active = function() {};

      /**
       * 反激活频道，使频道进入无人状态，消息会到来，会由 OnMessage 处发变成 OnDeactiveMessage 处发
       * @return {[type]} [description]
      */


      Channel.prototype.deactive = function() {};

      Channel.prototype.isActive = function() {};

      /**
       * 发送消息
       * @param  {Hash} msg 消息结构
       * @return {[type]}     [description]
      */


      Channel.prototype.send = function(channel, msg) {
        return this.socket.emit(channel, msg);
      };

      /**
       * 执行命令
       * @param  {String} cmd     命令名称, 像是 commands 中的名称
       * @param  {[Hash]} options 参数结构
       * @return {[type]}         [description]
      */


      Channel.prototype.command = function() {
        var args, cmd, options, _i;
        cmd = arguments[0], args = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), options = arguments[_i++];
        if (!Util.contain(this.commands, cmd)) {
          return;
        }
        return console.log("" + (cmd.toTitleCase()) + "Command");
      };

      Channel.prototype.create = function() {
        var channel_name;
        channel_name = this.generateId();
        return this.manager.channels[channgel_name] = new Channel(Util.generateId());
      };

      return Channel;

    })();
    return exports.Channel = Channel;
  });

}).call(this);
