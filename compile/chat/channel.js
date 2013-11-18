(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  define(['core', 'chat/manager', 'util', 'event', 'exports'], function(Caramal, Manager, Util, Event, exports) {
    var Channel;
    Channel = (function(_super) {
      var MAXIMUM_MESSAGES;

      __extends(Channel, _super);

      /**
       * 最大消息数
       * @type {Number}
      */


      MAXIMUM_MESSAGES = 2000;

      /**
       * 有效命令列表
       * @type {Array}
      */


      Channel.prototype.commands = ['open', 'join', 'close'];

      Channel.nextId = 0;

      Channel.hooks = {};

      /**
       * 管理器对象
       * @type {[type]}
      */


      Channel.default_manager = Caramal.MessageManager;

      Channel.TYPES = {
        normal: 0,
        chat: 1,
        group: 2
      };

      function Channel(options) {
        var manager;
        this.options = options != null ? options : {};
        this.id = Channel.nextId++;
        /**
         * 消息缓存区
         * @type {Array}
        */

        this.message_buffer = [];
        /**
         * 频道状态
         * @type {[String]}
        */

        this.state = 'open';
        manager = this.options.manager || this.constructor.default_manager;
        this.setOptions(this.options);
        this.setManager(manager);
        /**
         * socket.io 的 Socket 对象
         * @type {[Socket]}
        */

        this.bindSocket(this.manager.client);
        this._buildCommands();
      }

      Channel.prototype.setOptions = function(options) {
        var name, opt, _results;
        _results = [];
        for (name in options) {
          opt = options[name];
          _results.push(this[name] = opt);
        }
        return _results;
      };

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
          var args, callback, data, last, options;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          last = args.splice(-1)[0];
          if (Util.isFunc(last)) {
            callback = last;
          }
          data = args[0], options = args[1];
          return _this.command(method, data, options, callback);
        };
      };

      /**
       * 接受到消息数据的回调
       * @param  {[hash]} msg 消息数据
      */


      Channel.prototype.onMessage = function(message_callback) {
        this.message_callback = message_callback;
        return this.on('message', this.message_callback);
      };

      /**
       * 来至服务端的命令回调
       * @param  {hash} command 命令对象
      */


      Channel.prototype.onCommand = function(command_callback) {
        this.command_callback = command_callback;
        return this.on('command', this.command_callback);
      };

      /**
       * 处发事件的回调
       * @param  {hash} event 事件对象
      */


      Channel.prototype.onEvent = function(event_callback) {
        this.event_callback = event_callback;
        return this.on('event', this.event_callback);
      };

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
        return this.socket.emit(channel, JSON.stringify(msg));
      };

      /**
       * 执行命令
       * @param  {String} cmd     命令名称, 像是 commands 中的名称
       * @param  {[Hash]} options 参数结构
       * @return {[type]}         [description]
      */


      Channel.prototype.command = function(cmd, data, options, callback) {
        var class_name, command, klass;
        if (data == null) {
          data = null;
        }
        if (options == null) {
          options = {};
        }
        if (!this.commands.contain(cmd)) {
          return;
        }
        class_name = "" + (cmd.toTitleCase()) + "Command";
        klass = Caramal[class_name];
        if (klass == null) {
          throw new Error("not have Caramal." + class_name + " class");
        }
        command = new klass(this, cmd, options);
        this._setupHooks(cmd, command);
        if (options['return'] != null) {
          this.manager.addReturnCommand(command);
        }
        return command.execute(data, callback);
      };

      Channel.prototype._setupHooks = function(cmd, command) {
        var hook, hooks, name, _results;
        hooks = this.constructor.hooks;
        _results = [];
        for (name in hooks) {
          hook = hooks[name];
          if (hook.name === cmd) {
            if (hook.type === 'before') {
              _results.push(command.beforeExecute(hook.proc));
            } else if (hook.type === 'after') {
              _results.push(command.afterExecute(hook.proc));
            } else {

            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      Channel.create = function(options) {
        var manager;
        if (options == null) {
          options = {};
        }
        manager = options.manager || this.default_manager;
        return manager.addChannel(Channel.nextId, new Channel(options));
      };

      Channel.beforeCommand = function(cmd, callback) {
        return this.hooks["before_" + cmd] = {
          name: cmd,
          proc: callback,
          type: 'before'
        };
      };

      Channel.afterCommand = function(cmd, callback) {
        return this.hooks["after_" + cmd] = {
          name: cmd,
          proc: callback,
          type: 'after'
        };
      };

      return Channel;

    })(Event);
    return exports.Channel = Channel;
  });

}).call(this);
