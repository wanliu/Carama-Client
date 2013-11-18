(function() {
  var __hasProp = {}.hasOwnProperty,
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
        if (!Util.isObject(this.options)) {
          this.options = {};
        }
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
      function Command(channel, name, options) {
        this.channel = channel;
        this.name = name;
        this.options = options != null ? options : {};
        this.socket = this.channel.socket;
        this.option = new CommandOption(this.options);
      }

      Command.prototype.execute = function(data, callback) {
        data = this._doBeforeCallback(data);
        return this.doExecute(data, callback);
      };

      Command.prototype.doExecute = function(data, callback) {};

      Command.prototype.beforeExecute = function(before_callback) {
        this.before_callback = before_callback;
      };

      Command.prototype.afterExecute = function(after_callback) {
        this.after_callback = after_callback;
      };

      Command.prototype.onReturnExecute = function(return_callback) {
        this.return_callback = return_callback;
      };

      Command.prototype._doBeforeCallback = function(data) {
        if (Util.isFunc(this.before_callback)) {
          return this.before_callback(data);
        }
      };

      Command.prototype._doAfterCallback = function(data) {
        if (Util.isFunc(this.after_callback)) {
          return this.after_callback(data);
        }
      };

      Command.prototype._doReturnCallback = function(data) {
        if (Util.isFunc(this.return_callback)) {
          return this.return_callback(data);
        }
      };

      Command.prototype.sendCommand = function(cmd, data, callback) {
        var send_data,
          _this = this;
        if (data == null) {
          data = {};
        }
        send_data = Util.merge({
          command_id: this.option.id
        }, data);
        return this.socket.emit(cmd, JSON.stringify(send_data), function(ret) {
          _this._doAfterCallback(ret);
          if (Util.isFunc(callback)) {
            return callback(ret);
          }
        });
      };

      return Command;

    })();
    OpenCommand = (function(_super) {
      __extends(OpenCommand, _super);

      function OpenCommand() {
        _ref = OpenCommand.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      OpenCommand.prototype.doExecute = function(data, callback) {
        if (data == null) {
          data = {};
        }
        return this.sendCommand('open', data, callback);
      };

      return OpenCommand;

    })(Command);
    JoinCommand = (function(_super) {
      __extends(JoinCommand, _super);

      function JoinCommand() {
        _ref1 = JoinCommand.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      JoinCommand.prototype.doExecute = function(data, callback) {
        if (callback == null) {
          callback = null;
        }
        if (data == null) {
          data = {
            room: this.channel.options.room
          };
        }
        return this.sendCommand('join', data, callback);
      };

      return JoinCommand;

    })(Command);
    CloseCommand = (function(_super) {
      __extends(CloseCommand, _super);

      function CloseCommand() {
        _ref2 = CloseCommand.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      CloseCommand.prototype.doExecute = function(data, callback) {
        if (callback == null) {
          callback = null;
        }
        return this.sendCommand('leave', data, callback);
      };

      return CloseCommand;

    })(Command);
    Caramal.Command = Command;
    Caramal.OpenCommand = OpenCommand;
    Caramal.JoinCommand = JoinCommand;
    return Caramal.CloseCommand = CloseCommand;
  });

}).call(this);
