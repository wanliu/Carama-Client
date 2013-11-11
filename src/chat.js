var Caramel = require('./core').Caramel,
    EventEmitter = require('events').EventEmitter,
    util = require('util');


var Chat = function(options){
    this.socket = options.socket;

};

util.inherits(Chat, EventEmitter);

/*
 * 首先要打开一个对话
 * user 指定用户名, callback 成功后的回调， error 错误后的回调
 * chat = client.openChat(user, function(){
 *
 * }, function(){
 *
 * })
 */

Chat.prototype.send = function(msg, callback, error) {
    this.$emit(this.id, msg)
};

Chat.prototype.$emit = function(id, msg){
    id = 'chat-$' + id;
    this.socket.$emit(id, msg)
};


Caramel.Chat = Chat;
