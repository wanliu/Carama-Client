(function() {
  var __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['core', 'util'], function(Caramal, Util) {
    var CloseCommand, Command, CommandOption, JoinCommand, OpenCommand, _ref, _ref1, _ref2;
    CommandOption = (function() {
      CommandOption.prototype.default_options = {
        maximum_reply: 0,
        alive_timeout: 5000,
        default_action: null,
        repeat_reply: false
      };

      function CommandOption(options) {
        var _base;
        this.options = options;
        (_base = this.options)['id'] || (_base['id'] = Util.generateId());
        Util.merge(this.options, this.default_options);
        this.methodlizm(this.options);
      }

      CommandOption.prototype.methodlizm = function(hash) {
        var k, v, _results;
        _results = [];
        for (k in hash) {
          v = hash[k];
          _results.push(this[k] = v);
        }
        return _results;
      };

      return CommandOption;

    })();
    Command = (function() {
      function Command(channel, name, option) {
        this.channel = channel;
        this.name = name;
        this.option = option;
        this.socket = this.channel.socket;
        this.option = new CommandOption(this.options);
      }

      Command.prototype.execute = function() {
        var args, options, _i;
        args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), options = arguments[_i++];
        this._doBeforeCallback(args, options);
        args.push(options);
        return this.doExecute.apply(this, args);
      };

      Command.prototype.doExecute = function() {
        var args, options, _i;
        args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), options = arguments[_i++];
      };

      Command.prototype.beforeExecute = function(before_callback) {
        this.before_callback = before_callback;
      };

      Command.prototype.afterExecute = function(after_callback) {
        this.after_callback = after_callback;
      };

      Command.prototype.onReturnExecute = function(return_callback) {
        this.return_callback = return_callback;
      };

      Command.prototype._doBeforeCallback = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (Util.isFunc(this.before_callback)) {
          return this.before_callback.apply(this, args);
        }
      };

      Command.prototype._doAfterCallback = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (Util.isFunc(this.after_callback)) {
          return this.after_callback.apply(this, args);
        }
      };

      Command.prototype._doReturnCallback = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (Util.isFunc(this.return_callback)) {
          return this.return_callback.apply(this, args);
        }
      };

      Command.prototype.setOption = function(data) {
        return this.option = new CommandOption(data);
      };

      Command.prototype.sendCommand = function(cmd, data, callback) {
        var send_data;
        if (callback == null) {
          callback = this._doAfterCallback;
        }
        send_data = Util.merge({
          command_id: this.option.id
        }, data);
        return this.socket.emit(cmd, send_data, callback);
      };

      return Command;

    })();
    OpenCommand = (function(_super) {
      __extends(OpenCommand, _super);

      function OpenCommand() {
        _ref = OpenCommand.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      OpenCommand.prototype.doExecute = function(room, options) {
        if (room == null) {
          room = null;
        }
        if (options == null) {
          options = {};
        }
        return this.sendCommand('open', options);
      };

      return OpenCommand;

    })(Command);
    JoinCommand = (function(_super) {
      __extends(JoinCommand, _super);

      function JoinCommand() {
        _ref1 = JoinCommand.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      JoinCommand.prototype.execute = function(room, options, callback) {
        if (room == null) {
          room = null;
        }
        if (options == null) {
          options = {};
        }
        if (callback == null) {
          callback = null;
        }
        return this.sendCommand('join', options, callback);
      };

      return JoinCommand;

    })(Command);
    CloseCommand = (function(_super) {
      __extends(CloseCommand, _super);

      function CloseCommand() {
        _ref2 = CloseCommand.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      CloseCommand.prototype.execute = function(room, options, callback) {
        if (room == null) {
          room = null;
        }
        if (options == null) {
          options = {};
        }
        if (callback == null) {
          callback = null;
        }
        return this.sendCommand('leave', options, callback);
      };

      return CloseCommand;

    })(Command);
    Caramal.Command = Command;
    Caramal.OpenCommand = OpenCommand;
    Caramal.JoinCommand = JoinCommand;
    return Caramal.CloseCommand = CloseCommand;
  });

}).call(this);
