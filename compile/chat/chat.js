(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['core', 'chat/channel', 'chat/manager', 'util', 'exports'], function(Caramal, Channel, MessageManager, Util, exports) {
    var Chat;
    Chat = (function(_super) {
      __extends(Chat, _super);

      Chat.prototype.commands = ['open', 'join'];

      Chat.prototype.type = Channel.TYPES['chat'];

      Chat.beforeCommand('open', function(options) {
        if (options == null) {
          options = {};
        }
        return Util.merge(options, {
          type: this.channel.type,
          user: this.channel.user
        });
      });

      Chat.afterCommand('open', function(ret) {
        return this.channel.room = ret;
      });

      /**
       * 单一用户聊天
       * @param  {String} login  用户登陆名
       * @return {Chat}          Chat 对象
      */


      function Chat(user, options) {
        this.user = user;
        this.options = options;
        Chat.__super__.constructor.call(this, this.options);
      }

      /**
       * 发送消息
       * @param  {Hash} msg 消息结构
       * @return {[type]}     [description]
      */


      Chat.prototype.send = function(msg) {
        msg = (function() {
          if (typeof msg === 'string') {
            return {
              msg: msg
            };
          } else if (Util.isObject(msg)) {
            return msg;
          } else {
            throw new Error('invalid message type');
          }
        })();
        msg.room = this.room;
        return this.socket.emit('chat', JSON.stringify(msg));
      };

      /**
       * 暂时离开的通知
      */


      Chat.prototype.afk = function() {
        return this.socket.emit('afk', JSON.stringify({
          room: this.room
        }));
      };

      /**
       * 正在输入的功能
      */


      Chat.prototype.being_input = function() {
        return this.socket.emit('inputing', JSON.stringify({
          room: this.room
        }));
      };

      Chat.create = function(user, options) {
        var manager;
        if (options == null) {
          options = {};
        }
        manager = options.manager || this.default_manager;
        return manager.addNamedChannel(user, new Chat(user, options));
      };

      return Chat;

    })(Channel);
    Caramal.MessageManager.registerDispatch('command', function(info, next) {
      var channel;
      if (info.type === Channel.TYPES['chat']) {
        Caramal.log('Receive Comamnd:', info);
      }
      switch (info.action) {
        case 'join':
          if (info.type === Channel.TYPES['chat']) {
            channel = Caramal.MessageManager.roomOfChannel(info.room);
            channel = channel != null ? channel : Chat.create(info.from, {
              room: info.room
            });
            return channel.command('join');
          } else {
            return next();
          }
          break;
        default:
          return next();
      }
    });
    Caramal.MessageManager.registerDispatch('message', function(info, next) {
      var channel;
      Caramal.log('Receive Message:', info);
      channel = Caramal.MessageManager.roomOfChannel(info.room);
      if (channel != null) {
        return channel.emit('message', info);
      } else {
        return next();
      }
    });
    Caramal.MessageManager.registerDispatch('event', function(event, next) {
      var channel;
      Caramal.log('Receive Event:', event);
      channel = Caramal.MessageManager.roomOfChannel(event.room);
      if (channel != null) {
        return channel.emit('event', event);
      } else {
        return next();
      }
    });
    return exports.Chat = Chat;
  });

}).call(this);
