var Caramel = require('./core').Caramel,
    Chat = require('./chat').Chat,
    Group = require('./group').Group;



/**
* 连接通信服务器，指定一个 url
* client = Client.connect('http://localhost:3000');
*
* 一对一的通信
* 首先要打开一个对话
* user 指定用户名, callback 成功后的回调， error 错误后的回调
* chat = client.openChat(user, function(){
*
* }, function(){
*
* })
*
* 向用户发送信息
* // msg 消息对象, callback 成功后的回调，error 错误后的回调
* chat.send(msg, function(){
*
* }, function() {
*
* });
*
*
* 来自用户发来的对话
* chat 对象， msg 消息对象
* client.onChat(function(chat, msg){
*     chat.user; // 发送消息的对象
*     // 如果对话已经打开
*     if (ChatDialog.isOpen(chat)) {
*         // 转发给 chat 对象
*         chat.emit('message', msg);
*     } else {
*         // display message unreads count.
*     }
*
* })
*
* 接收到对方消息
* chat.on('message', function(msg){
*     // msg 消息对象的显示，通常会打开一个消息对话框
*     var dialog = ChatDialog.open(chat);
*     // 在这里 msg 消息对象并不是文本，而是一个 json 结构，有时候 msg 还是异步消息
*     // 异步消息: 决定了消息并不完整显示在用户界面中， 像是包含图片的文本，很多时候发送消息出去时，
*     // 图片的地址还没有确定，这时候我们会先给消息，确定一个 ResourceID, 然后把消息转发去出，
*     // 当图片上传到图片服务器后，消息服务器会把这条消息中 ResourceID 替然成，直正的 url,
*     // 并返回消息给接收方， 接收方在接收到真正的地址后，会替换之前的 ResourceID ， 这一切都是在
*     // msg 内部完成的
*     dialog.addMessageObject(msg);
* });
*
* chat 的通知
* 对方正在输入。。。
* chat.on('another_typing', function(){
*     // 通常会显示一个5 秒的动画提示
* })
*
* // 对方离开了
* chat.on('leave', function(){
*
* })
*
* // 出错
* chat.onError(function(err){
*
* });
*
* = 向一个群组发送信息
* 当然，Caramel 是可以建立群组通信的。
*
* 首先应当，打开一个群组；
* group 指定一个群组名，callback 成功后的回调， error 错误后的回调
* var group = client.openGroup(group, function(){
*
* }, function(err){
*
* });
*
* 使用 Group 对象来发送信息, msg 信息对象，callback 成功后的回调， error 错误后的回调
* group.send(msg, function(){
*
* }, function(err){
*
* });
*
* 群组收到的消息
* group.on('message', function(msg){
*     // msg 消息对象的显示，通常会打开一个消息对话框
*     var dialog = GroupDialog.open(group);
*     // 在这里 msg 消息对象并不是文本，而是一个 json 结构，有时候 msg 还是异步消息
*     // 异步消息: 决定了消息并不完整显示在用户界面中， 像是包含图片的文本，很多时候发送消息出去时，
*     // 图片的地址还没有确定，这时候我们会先给消息，确定一个 ResourceID, 然后把消息转发去出，
*     // 当图片上传到图片服务器后，消息服务器会把这条消息中 ResourceID 替然成，直正的 url,
*     // 并返回消息给接收方， 接收方在接收到真正的地址后，会替换之前的 ResourceID ， 这一切都是在
*     // msg 内部完成的
*     dialog.addMessageObject(msg);
* });
*
* // 有人离开了
* group.on('leave', function(user, socket){
*
* })
*
* // 出错
* group.onError(function(err){
*
* });
*
* 群组能发送指令, cmd 命令， callback ,成功回调， error 失败回调
* group.command(cmd, function(info){
*
* }, function(err) {
*
* });
*
* 群组命令
* ================
* INFO 群基本信息 (包括: 在线人数/总人数等，管理员等，权限等)
* MEMBERS 成员列表
* KICK 将某一用户，移除群组
* MUTE 将某一用户，禁止发言
* UP_OP 将某一用户，升级为管理员
* DOWN_OP 将某一管理员用户，降级为普通用户
* JOIN 加入某用户
* INVITE 邀请某用户加入
* SET_OPTION 设置群组选项
* GET_OPTION 读取群组选项
*
* // 接受到命令通知
* group.on('command', function(cmd, msg){
*
* });
*
* // 用户加入的通知（只有管理员会收到，可以选项配置）
* group.on('joined', function(user, msg){
*
* })
*
* // 用户被踢的通知（只有管理员会收到，可以选项配置）
* group.on('kicked', function(user, msg){
*
* })
*
* ========================
* 社交化部分
*
* domain 域，options 参数, callback 成功回调， error 失败回调
* var social = client.openSocial(domain, options, function(){
*
* }, function(){
*
* })
*
* 新消息
* soical.onNews(function(news, socket){
*
* });
*
* 推信息
* social.publish(msg, function(){
*
* }, function(){
*
* })
*
* =========================
* 可编程部分
* 建立一个通信频道，频道可以指定，固定的用户进入通信，并且不会打扰到不相关的人
* 频道，也可以邀请用户的加入，在用户确认后，才进入频道
* channel = client.establishChannel({users: ['hysios', 'xiaomi']}, function(channel, socket){
*     channel.invite(['user', 'xiaomi']);
* });
*
* 用户可以监听 Channel 事件，通过监听 invite 事件，用户可以在收到邀请通知时候，进行处理
* reject 方法，可以拒绝这个邀请，
* accept 方法显然是接受
* client.onNotifChannel('invite', function(notif, socket){
*     notif.reject();
* });
*
* 系统通知还有多种
*
* 用户向你发来信息
* client.onNotif('message', function(notif, socket){
*
* });
*     *
*/

Caramel.connect = function(url, options) {
   // return this.io.connect(url, options);
};

console.log(Caramel);

