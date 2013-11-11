# Caramal Client design specification

### 引用

```html
<SCRIPT type='type/javascript' src='.../caramal-client.js'></SCRIPT>
```


### 使用

```js
  window.caramal_client = CaramalClient.connect({ url: 'host', token: 'adfasdfasdfadsf'});
    
  // 重复使用
  window.caramal_client = window.caramal_client ||
                          CaramalClient.connect({ url: 'host', token: 'adfasdfasdfadsf'});
```


### 状态事件绑定

```js

  // 连接成功
  caramal_client.on('connect', function () {
    console.log('connected');
  });

  // 连接中... 
  caramal_client.on('connecting', function () {
    console.log('connecting');
  });
  
  // 断开连接 error 是错误提示, booted  被踢
  caramal_client.on('disconnect', function (error) {
    console.log('disconnect' + error);
  });

  // 连接失败
  caramal_client.on('connect_failed', function () {
    console.log('connect_failed');
  });
  
  // 发生错误
  caramal_client.on('error', function (err) {
    console.log('error: ' + err);
  });
  
  // 重连失败
  caramal_client.on('reconnect_failed', function () {
    console.log('reconnect_failed');
  });
  
  // 重新连接成功
  caramal_client.on('reconnect', function () {
    console.log('reconnected ');
  });
  
  // 重新连接中...
  caramal_client.on('reconnecting', function () {
    console.log('reconnecting');
  });

```

### 订阅通知

```js 
  caramal_client.subscribe('/transaction/completed', function(data){
    //...
  });
```

### 发布通知
目前来说，会设计在服务器，因为发布跟与数据持久有关，所以我们希望在服务端进行


# 聊天对话部分
