(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['core', 'chat/channel', 'chat/chat', 'util', 'exports'], function(Caramal, Channel, Chat, Util, exports) {
    var Group;
    Group = (function(_super) {
      __extends(Group, _super);

      Group.prototype.commands = ['open', 'join'];

      Group.prototype.type = Channel.TYPES['group'];

      Group.beforeCommand('open', function(options) {
        if (options == null) {
          options = {};
        }
        return Util.merge(options, {
          type: this.channel.type,
          group: this.channel.group
        });
      });

      Group.afterCommand('open', function(ret) {
        return this.channel.room = ret;
      });

      function Group(group, options) {
        this.group = group;
        this.options = options;
        Group.__super__.constructor.call(this, this.options);
      }

      /**
       * 发送消息
       * @param  {Hash} msg 消息结构
       * @return {[type]}     [description]
      */


      Group.prototype.send = function(msg) {
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

      Group.create = function(group, options) {
        var manager;
        if (options == null) {
          options = {};
        }
        manager = options.manager || this.default_manager;
        return manager.addNamedChannel(group, new Group(group, options));
      };

      return Group;

    })(Channel);
    Caramal.MessageManager.registerDispatch('command', function(info, next) {
      var channel;
      if (info.type === Channel.TYPES['group']) {
        Caramal.log('Receive Comamnd:', info);
      }
      switch (info.action) {
        case 'join':
          if (info.type === Channel.TYPES['group']) {
            channel = Caramal.MessageManager.roomOfChannel(info.room);
            if (info.group != null) {
              channel = channel != null ? channel : Group.create(info.group, {
                room: info.room
              });
              return channel.command('join');
            } else {
              return next();
            }
          } else {
            return next();
          }
          break;
        default:
          return next();
      }
    });
    return exports.Group = Group;
  });

}).call(this);
