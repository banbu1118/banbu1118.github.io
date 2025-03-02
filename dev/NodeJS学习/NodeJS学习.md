# NodeJS学习

## 一、简介

### 1.1 简介

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，允许开发者使用 JavaScript 编写服务器端代码。

它采用事件驱动、非阻塞 I/O 模型，使其轻量且高效，尤其适合数据密集型实时应用。 

### 1.2 使用场景

|使用场景|示例|
| ---- | ---- |
| 服务器端开发 | web服务器 |
| 开发工具类应用 | vscode等 |
| 桌面应用开发 | electron框架开发跨平台桌面应用 |

### 1.3 下载安装

官网下载：[https://nodejs.org/zh-cn/download](https://nodejs.org/zh-cn/download)，推荐使用LTS版本

安装后，使用node命令查看版本

```
C:\Users\kk>node -v
v22.14.0
```

### 1.4 前端核心技术体系

![](./images/1.png)

### 1.5 学习教程

尚硅谷视频：[https://www.bilibili.com/video/BV1gM411W7ex/](https://www.bilibili.com/video/BV1gM411W7ex/)

### 1.6 注意事项

- 浏览器中的Javascript

![](./images/2.png)

- Node.js中的Javascript

![](./images/3.png)

注意：

1. Node.js中不能使用BOM和DOM的API，可以使用console和定时器API

2. Node.js中的顶级对象为global，也可用globalThis访问顶级对象(globalThis === global)

### 1.7 相关资料

https://nodejs.cn/

## 二、Buffer

### 2.1 概念

Buffer 是一个类似于数组的 `对象` ，用于表示固定长度的字节序列

Buffer 本质是一段内存空间，专门用来处理 `二进制数据` 。

![](./images/4.png)

### 2.2 特点

1. Buffer 大小固定且无法调整
2. Buffer 性能较好，可以直接对计算机内存进行操作
3. 每个元素的大小为 1 字节（byte）

![](./images/5.png)

### 2.3 使用

#### 1. 创建 Buffer

Node.js 中创建 Buffer 的方式主要如下几种：

1. Buffer.alloc

```javascript
//创建了一个长度为 10 字节的 Buffer，相当于申请了 10 字节的内存空间，每个字节的值为 0
let buf_1 = Buffer.alloc(10); // 结果为 <Buffer 00 00 00 00 00 00 00 00 00 00>
```

2. Buffer.allocUnsafe

```javascript
//创建了一个长度为 10 字节的 Buffer，buffer 中可能存在旧的数据, 可能会影响执行结果，所以叫
unsafe
let buf_2 = Buffer.allocUnsafe(10);
```

3. Buffer.from

```javascript
//通过字符串创建 Buffer
let buf_3 = Buffer.from('hello');
//通过数组创建 Buffer
let buf_4 = Buffer.from([105, 108, 111, 118, 101, 121, 111, 117]);
```

#### 2. Buffer 与字符串的转化

我们可以借助 toString 方法将 Buffer 转为字符串

```javascript
let buf_4 = Buffer.from([105, 108, 111, 118, 101, 121, 111, 117]);
console.log(buf_4.toString())
```

> toString 默认是按照 utf-8 编码方式进行转换的。

#### 3. Buffer 的读写

Buffer 可以直接通过 [] 的方式对数据进行处理。

```javascript
//读取
console.log(buf_3[1]);
//修改
buf_3[1] = 97;
//查看字符串结果
console.log(buf_3.toString());
```

> 注意:
> 1. 如果修改的数值超过 255 ，则超过 8 位数据会被舍弃
> 2. 一个 utf-8 的字符 一般 占 3 个字节

## 三、fs模块

fs 全称为 file system ，称之为 文件系统 ，是 Node.js 中的 内置模块 ，可以对计算机中的磁盘进行操作

### 3.1 文件写入

文件写入就是将 数据 保存到 文件 中，我们可以使用如下几个方法来实现该效果

| 方法                      | 说明     |
| ------------------------- | -------- |
| writeFile                 | 异步写入 |
| writeFIleSync             | 同步写入 |
| appendFile/appendFileSync | 追加写入 |
| createWriteStream         | 流式写入 |

#### 1. writeFile 异步写入

语法： fs.writeFile(file, data[, options], callback)

参数说明：

* file 文件名

*  data 待写入的数据

* options 选项设置 （可选）

* callback 写入回调

返回值： undefined

代码示例：

```javascript
// require 是 Node.js 环境中的'全局'变量，用来导入模块
const fs = require('fs');
//将 『三人行，必有我师焉。』 写入到当前文件夹下的『座右铭.txt』文件中
fs.writeFile('./座右铭.txt', '三人行，必有我师焉。', err => {
//如果写入失败，则回调函数调用时，会传入错误对象，如写入成功，会传入 null
if(err){
console.log(err);
return;
}
console.log('写入成功')；
});
```

#### 2. writeFileSync 同步写入

语法: fs.writeFileSync(file, data[, options])

参数与 fs.writeFile 大体一致，只是没有 callback 参数

返回值： undefined

代码示例：

```javascript
try{
fs.writeFileSync('./座右铭.txt', '三人行，必有我师焉。');
}catch(e){
console.log(e);
}
```

> Node.js 中的磁盘操作是由其他 线程 完成的，结果的处理有两种模式：
>
> * 同步处理 JavaScript 主线程 会等待 其他线程的执行结果，然后再继续执行主线程的代码，
>   效率较低
>
> * 异步处理 JavaScript 主线程 不会等待 其他线程的执行结果，直接执行后续的主线程代码，
>   效率较好

#### 3. appendFile / appendFileSync 追加写入

appendFile 作用是在文件尾部追加内容，appendFile 语法与 writeFile 语法完全相同
语法:

fs.appendFile(file, data[, options], callback)

fs.appendFileSync(file, data[, options])

返回值： 二者都为 undefined

实例代码：

```javascript
fs.appendFile('./座右铭.txt','择其善者而从之，其不善者而改之。', err => {
if(err) throw err;
console.log('追加成功')
});
fs.appendFileSync('./座右铭.txt','\r\n温故而知新, 可以为师矣');
```

#### 4. createWriteStream 流式写入

语法： fs.createWriteStream(path[, options])

参数说明：

* path 文件路径

* (options 选项配置（ 可选 ）

返回值： Object

代码示例：

```javascript
let ws = fs.createWriteStream('./观书有感.txt');
ws.write('半亩方塘一鉴开\r\n');
ws.write('天光云影共徘徊\r\n');
ws.write('问渠那得清如许\r\n');
ws.write('为有源头活水来\r\n');
ws.end();
```

> 程序打开一个文件是需要消耗资源的 ，流式写入可以减少打开关闭文件的次数。
> 流式写入方式适用于 大文件写入或者频繁写入 的场景, writeFile 适合于 写入频率较低的场景

#### 5. 写入文件的场景

文件写入 在计算机中是一个非常常见的操作，下面的场景都用到了文件写入

* 下载文件

* 安装软件

* 保存程序日志，如 Git

* 编辑器保存文件

* 视频录制

> 当 需要持久化保存数据 的时候，应该想到 文件写入

### 3.2 文件读取

文件读取顾名思义，就是通过程序从文件中取出其中的数据，我们可以使用如下几种方式：

| 方法             | 说明     |
| ---------------- | -------- |
| readFile         | 异步读取 |
| readFileSync     | 同步读取 |
| createReadStream | 流式读取 |

#### 1. readFile 异步读取

语法： fs.readFile(path[, options], callback)

参数说明：

* path 文件路径

* options 选项配置

* callback 回调函数

返回值： undefined

代码示例：

```javascript
//导入 fs 模块
const fs = require('fs');
fs.readFile('./座右铭.txt', (err, data) => {
if(err) throw err;
console.log(data);
});
fs.readFile('./座右铭.txt', 'utf-8',(err, data) => {
if(err) throw err;
console.log(data);
});
```

#### 2. readFileSync 同步读取

语法： fs.readFileSync(path[, options])


参数说明：

* path 文件路径

* options 选项配置

返回值： string | Buffer

代码示例：

```javascript
let data = fs.readFileSync('./座右铭.txt');
let data2 = fs.readFileSync('./座右铭.txt', 'utf-8');
```

#### 3. createReadStream 流式读取

语法： fs.createReadStream(path[, options])

参数说明：

* path 文件路径

* options 选项配置（ 可选 ）

返回值： Object

代码示例：

```javascript
//创建读取流对象
let rs = fs.createReadStream('./观书有感.txt');
//每次取出 64k 数据后执行一次 data 回调
rs.on('data', data => {
console.log(data);
console.log(data.length);
});
//读取完毕后, 执行 end 回调
rs.on('end', () => {
console.log('读取完成')
})
```

#### 4. 读取文件应用场景

* 电脑开机

* 程序运行

* 编辑器打开文件

* 查看图片

* 播放视频

* 播放音乐

* Git 查看日志

* 上传文件

* 查看聊天记录

### 3.3 文件移动与重命名

在 Node.js 中，我们可以使用 rename 或 renameSync 来移动或重命名 文件或文件夹
语法：

fs.rename(oldPath, newPath, callback)

fs.renameSync(oldPath, newPath)

参数说明：

* oldPath 文件当前的路径

* newPath 文件新的路径

* callback 操作后的回调

代码示例：

```javascript
fs.rename('./观书有感.txt', './论语/观书有感.txt', (err) =>{
if(err) throw err;
console.log('移动完成')
});
fs.renameSync('./座右铭.txt', './论语/我的座右铭.txt');
```

### 3.4 文件删除

在 Node.js 中，我们可以使用 unlink 或 unlinkSync 来删除文件
语法：

fs.unlink(path, callback)

fs.unlinkSync(path)

参数说明：

* path 文件路径

* callback 操作后的回调

代码示例：

```javascript
const fs = require('fs');
fs.unlink('./test.txt', err => {
if(err) throw err;
console.log('删除成功');
});
fs.unlinkSync('./test2.txt');
```

### 3.5 文件夹操作

借助 Node.js 的能力，我们可以对文件夹进行 创建 、 读取 、 删除 等操作

| 方法                  | 说明       |
| --------------------- | ---------- |
| mkdir / mkdirSync     | 创建文件夹 |
| readdir / readdirSync | 读取文件夹 |
| rmdir / rmdirSync     | 删除文件夹 |

#### 1. mkdir 创建文件夹

在 Node.js 中，我们可以使用 mkdir 或 mkdirSync 来创建文件夹
语法：

fs.mkdir(path[, options], callback)

fs.mkdirSync(path[, options])

参数说明：

* path 文件夹路径

* options 选项配置（ 可选 ）

* callback 操作后的回调

示例代码：

```javascript
//异步创建文件夹
fs.mkdir('./page', err => {
if(err) throw err;
console.log('创建成功');
});
//递归异步创建
fs.mkdir('./1/2/3', {recursive: true}, err => {
if(err) throw err;
console.log('递归创建成功');
});
//递归同步创建文件夹
fs.mkdirSync('./x/y/z', {recursive: true});
```

#### 2. readdir 读取文件夹

在 Node.js 中，我们可以使用 readdir 或 readdirSync 来读取文件夹
语法：

fs.readdir(path[, options], callback)

fs.readdirSync(path[, options])

参数说明：

* path 文件夹路径

* options 选项配置（ 可选 ）

* callback 操作后的回调

示例代码：

```javascript
//异步读取
fs.readdir('./论语', (err, data) => {
if(err) throw err;
console.log(data);
});
//同步读取
let data = fs.readdirSync('./论语');
console.log(data);
```

#### 3. rmdir 删除文件夹

在 Node.js 中，我们可以使用 rmdir 或 rmdirSync 来删除文件夹
语法：

fs.rmdir(path[, options], callback)

fs.rmdirSync(path[, options])

参数说明：

* path 文件夹路径

* options 选项配置（ 可选 ）

* callback 操作后的回调

示例代码：

```javascript
//异步删除文件夹
fs.rmdir('./page', err => {
if(err) throw err;
console.log('删除成功');
});
//异步递归删除文件夹
fs.rmdir('./1', {recursive: true}, err => {
if(err) {
console.log(err);
}
console.log('递归删除')
});
//同步递归删除文件夹
fs.rmdirSync('./x', {recursive: true})
```

### 3.6 查看资源状态

在 Node.js 中，我们可以使用 stat 或 statSync 来查看资源的详细信息

语法：

fs.stat(path[, options], callback)

fs.statSync(path[, options])

参数说明：

* path 文件夹路径

* options 选项配置（ 可选 ）

* callback 操作后的回调

示例代码：

```javascript
//异步获取状态
fs.stat('./data.txt', (err, data) => {
if(err) throw err;
console.log(data);
});
//同步获取状态
let data = fs.statSync('./data.txt');
```

结果值对象结构：

* size 文件体积

* birthtime 创建时间

* mtime 最后修改时间

* isFile 检测是否为文件

* isDirectory 检测是否为文件夹
* ....

### 3.7 相对路径问题

fs 模块对资源进行操作时，路径的写法有两种：

* 相对路径

  * ./座右铭.txt 当前目录下的座右铭.txt

  * 座右铭.txt 等效于上面的写法

  * ../座右铭.txt 当前目录的上一级目录中的座右铭.txt

* 绝对路径

  * D:/Program Files windows 系统下的绝对路径

  * /usr/bin Linux 系统下的绝对路径

> 相对路径中所谓的 当前目录 ，指的是 命令行的工作目录 ，而并非是文件的所在目录
> 所以当命令行的工作目录与文件所在目录不一致时，会出现一些 BUG

### 3.8 __dirname

__dirname 与 require 类似，都是 Node.js 环境中的'全局'变量

__dirname 保存着 当前文件所在目录的绝对路径 ，可以使用 __dirname 与文件名拼接成绝对路径

代码示例：

```javascript
let data = fs.readFileSync(__dirname + '/data.txt');
console.log(data);
```

> 使用 fs 模块的时候，尽量使用 __dirname 将路径转化为绝对路径，这样可以避免相对路径产生的
> Bug

### 3.9 练习

1. 编写一个 JS 文件，实现复制文件的功能
2. 文件重命名

## 四、path模块

path 模块提供了 操作路径 的功能，这是几个较为常用的几个 API：

| API           | 说明                     |
| ------------- | ------------------------ |
| path.resolve  | 拼接规范的绝对路径常用   |
| path.sep      | 获取操作系统的路径分隔符 |
| path.parse    | 解析路径并返回对象       |
| path.basename | 获取路径的基础名称       |
| path.dirname  | 获取路径的目录名         |
| path.extname  | 获得路径的扩展名         |

代码示例：

```javascript
const path = require('path');
//获取路径分隔符
console.log(path.sep);
//拼接绝对路径
console.log(path.resolve(__dirname, 'test'));
//解析路径
let pathname = 'D:/program file/nodejs/node.exe';
console.log(path.parse(pathname));
//获取路径基础名称
console.log(path.basename(pathname))
//获取路径的目录名
console.log(path.dirname(pathname));
//获取路径的扩展名
console.log(path.extname(pathname));
```

## 五、http协议

### 5.1 概念

HTTP（hypertext transport protocol）协议；中文叫超文本传输协议
是一种基于TCP/IP的应用层通信协议

这个协议详细规定了 浏览器 和万维网 服务器 之间互相通信的规则。

协议中主要规定了两个方面的内容

* 客户端：用来向服务器发送数据，可以被称之为请求报文
* 服务端：向客户端返回数据，可以被称之为响应报文

> 报文：可以简单理解为就是一堆字符串

### 5.2 请求报文的组成

* 请求行

* 请求头

* 空行

* 请求体

### 5.3 http的请求行

* 请求方法（get、post、put、delete等）

* 请求 URL（统一资源定位器）

    例如： http://www.baidu.com:80/index.html?a=100&b=200#logo

    * http： 协议（https、ftp、ssh等

    * www.baidu.com 域名
    * 80 端口号
    * /index.html 路径
    * a=100&b=200 查询字符串
    * #logo 哈希（锚点链接）
* HTTP协议版本号

### 5.4 http请求头

格式：『头名：头值』

常见的请求头有：

| 请求头                              | 解释                                                         |
| ----------------------------------- | ------------------------------------------------------------ |
| Host                                | 主机名                                                       |
| Connection                          | 连接的设置 keep-alive（保持连接）；close（关闭连接）         |
| Cache-Control                       | 缓存控制 max-age = 0 （没有缓存）                            |
| Upgrade-<br/>Insecure-<br/>Requests | 将网页中的http请求转化为https请求（很少用）老网站升级        |
| User-Agent                          | 用户代理，客户端字符串标识，服务器可以通过这个标识来识别这个请求来自<br/>哪个客户端 ，一般在PC端和手机端的区分 |
| Accept                              | 设置浏览器接收的数据类型                                     |
| Accept-Encoding                     | 设置接收的压缩方式                                           |
| Accept-<br/>Language                | 设置接收的语言 q=0.7 为喜好系数，满分为1                     |
| Cookie                              | 后面单独讲                                                   |

### 5.5 http的请求体

请求体内容的格式是非常灵活的，

（可以是空）==> GET请求，

（也可以是字符串，还可以是JSON）===> POST请求

例如：

* 字符串：keywords=手机&price=2000
* JSON：{"keywords":"手机","price":2000}

### 5.6 响应报文的组成

* 相应行

    ```
    HTTP/1.1 200 OK
    ```
    
    * HTTP/1.1：HTTP协议版本号
    
    * 200：响应状态码 404 Not Found 500 Internal Server Error
    
    * 还有一些状态码，参考： https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status
    
    * OK：响应状态描述

* 响应头

  ```
  Cache-Control:缓存控制 private 私有的，只允许客户端缓存数据
  Connection 链接设置
  Content-Type:text/html;charset=utf-8 设置响应体的数据类型以及字符集,响应体为html，字符集
  utf-8
  Content-Length:响应体的长度，单位为字节
  ```

* 空行

* 响应体
    响应体内容的类型是非常灵活的，常见的类型有 HTML、CSS、JS、图片、JSON

### 5.7 创建http服务

使用 nodejs 创建 HTTP 服务

#### 1. 操作步骤

```javascript
//1. 导入 http 模块
const http = require('http');

//2. 创建服务对象 create 创建 server 服务
// request 意为请求. 是对请求报文的封装对象, 通过 request 对象可以获得请求报文的数据
// response 意为响应. 是对响应报文的封装对象, 通过 response 对象可以设置响应报文
const server = http.createServer((request, response) => {
response.end('Hello HTTP server');
});

//3. 监听端口, 启动服务
server.listen(9000, () => {
console.log('服务已经启动, 端口 9000 监听中...');
});
```

> http.createServer 里的回调函数的执行时机： 当接收到 HTTP 请求的时候，就会执行

#### 2. 测试

浏览器请求对应端口

```
http://127.0.0.1:9000
```

#### 3. 注意事项

1. 命令行 ctrl + c 停止服务

2. 当服务启动后，更新代码 必须重启服务才能生效

3. 响应内容中文乱码的解决办法

   ```javascript
   response.setHeader('content-type','text/html;charset=utf-8');
   ```

4. 端口号被占用

  ```javascript
  Error: listen EADDRINUSE: address already in use :::9000
  ```

  1）关闭当前正在运行监听端口的服务 （ 使用较多 ）
  2）修改其他端口号

5. HTTP 协议默认端口是 80 。HTTPS 协议的默认端口是 443, HTTP 服务开发常用端口有 3000，8080，8090，9000 等

> 如果端口被其他程序占用，可以使用 资源监视器 找到占用端口的程序，然后使用 任务管理器关闭对应的程序

### 5.8 浏览器查看 HTTP 报文

点击步骤

![](./images/6.png)

#### 1. 查看请求行与请求头

![](./images/7.png)

#### 2. 查看请求体

![](./images/8.png)

#### 3. 查看 URL 查询字符串

![](./images/9.png)

#### 4. 查看响应行与响应头

![](./images/10.png)

#### 5. 查看响应体

![](./images/11.png)

### 5.9 获取 HTTP 请求报文

想要获取请求的数据，需要通过 request 对象

| 含义           | 语法                                                         | 重点掌握 |
| -------------- | ------------------------------------------------------------ | -------- |
| 请求方法       | request.method                                               | *        |
| 请求版本       | request.httpVersion                                          |          |
| 请求路径       | request.url                                                  | *        |
| URL 路径       | require('url').parse(request.url).pathname                   | *        |
| URL 查询字符串 | require('url').parse(request.url, true).query                | *        |
| 请求头         | request.headers                                              | *        |
| 请求体         | request.on('data', function(chunk){})<br/>request.on('end', function(){}); |          |

注意事项：
1. request.url 只能获取路径以及查询字符串，无法获取 URL 中的域名以及协议的内容
2. request.headers 将请求信息转化成一个对象，并将属性名都转化成了『小写』
3. 关于路径：如果访问网站的时候，只填写了 IP 地址或者是域名信息，此时请求的路径为『 / 』
4. 关于 favicon.ico：这个请求是属于浏览器自动发送的请求

#### 1. 练习

按照以下要求搭建 HTTP 服务

| 请求类型(方法) | 请求地址 | 响应体结果 |
| -------------- | -------- | ---------- |
| get            | /login   | 登录页面   |
| get            | /reg     | 注册页面   |

```javascript
//1、引入http模块
const http = require("http");

//2、建立服务
const server = http.createServer((request,response)=>{
let {url,method} = request; //对象的解构赋值
//设置响应头信息
//解决中文乱码
response.setHeader("Content-Type","text/html;charset=utf-8")
if(url == "/register" && method == "GET"){
response.end("注册页面");
}else if(url=="/login" && method == "GET"){
response.end("登录页面");
}else{
response.end("<h1>404 Not Found</h1>")
}
})

//3、监听端口
server.listen(8000,()=>{
console.log('服务启动中....');
})
```

### 5.10 设置 HTTP 响应报文

| 作用             | 语法                                         |
| ---------------- | -------------------------------------------- |
| 设置响应状态码   | response.statusCode                          |
| 设置响应状态描述 | response.statusMessage （ 用的非常少 ）      |
| 设置响应头信息   | response.setHeader('头名', '头值')           |
| 设置响应体       | response.write('xx')<br/>response.end('xxx') |

```javascript
//write 和 end 的两种使用情况：
//1. write 和 end 的结合使用 响应体相对分散
response.write('xx');
response.write('xx');
response.write('xx');
response.end(); //每一个请求，在处理的时候必须要执行 end 方法的

//2. 单独使用 end 方法 响应体相对集中
response.end('xxx');
```

#### 1. 练习

搭建 HTTP 服务，响应一个 4 行 3 列的表格，并且要求表格有 隔行换色效果 ，且 点击 单元格能 高亮显示

```javascript
//1.导入http模块
const http = require('http')

//2.创建服务对象
const server = http.createServer((request, response) => {
    response.end(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        td{
            padding: 20px 40px;
        }
        table tr:nth-child(odd){
            background-color: #fcb;
        }
        table tr:nth-child(even){
            background-color: #fdf;
        }
        table,td{
            border-collapse: collapse;
        }
    </style>
    </head>
    <body>
        <table border="1">
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>
        <script>
            //获取所有的td
            const tds = document.querySelectorAll('td');
            //遍历td
            tds.forEach(item => {
                item.onclick = function() {
                    this.style.background = '#222';
                    }
                })
            
        </script>
    
    </body>
    </html>
        `)
})

//3.监听端口，启动服务
server.listen(9000, () => {
    console.log("服务已经启动");

})
```

### 5.11 网页资源的基本加载过程

![](./images/12.png)

网页资源的加载都是循序渐进的，首先获取 HTML 的内容， 然后解析 HTML 在发送其他资源的请求，如CSS，Javascript，图片等。 

理解了这个内容对于后续的学习与成长有非常大的帮助

### 5.12 静态资源服务

静态资源是指 内容长时间不发生改变的资源 ，例如图片，视频，CSS 文件，JS文件，HTML文件，字体文件等

动态资源是指 内容经常更新的资源 ，例如百度首页，网易首页，京东搜索列表页面等

#### 1. 网站根目录或静态资源目录

HTTP 服务在哪个文件夹中寻找静态资源，那个文件夹就是 静态资源目录 ，也称之为 网站根目录

> 思考：vscode 中使用 live-server 访问 HTML 时， 它启动的服务中网站根目录是谁？

#### 2. 网页中的 URL

网页中的 URL 主要分为两大类：相对路径与绝对路径

##### (1) 绝对路径

绝对路径可靠性强，而且相对容易理解，在项目中运用较多

| 形式                   | 特点                                                         |
| ---------------------- | ------------------------------------------------------------ |
| http://atguigu.com/web | 直接向目标资源发送请求，容易理解。网站的外链会用到此形式     |
| //atguigu.com/web      | 与页面 URL 的协议拼接形成完整 URL 再发送请求。大型网站用的比较多 |
| /web                   | 与页面 URL 的协议、主机名、端口拼接形成完整 URL 再发送请求。中小<br/>型网站 |

##### (2) 相对路径

相对路径在发送请求时，需要与当前页面 URL 路径进行 计算 ，得到完整 URL 后，再发送请求，学习阶段用的较多

例如当前网页 url 为 http://www.atguigu.com/course/h5.html

| 形式               | 最终的 URL                                |
| ------------------ | ----------------------------------------- |
| ./css/app.css      | http://www.atguigu.com/course/css/app.css |
| js/app.js          | http://www.atguigu.com/course/js/app.js   |
| ../img/logo.png    | http://www.atguigu.com/img/logo.png       |
| ../../mp4/show.mp4 | http://www.atguigu.com/mp4/show.mp4       |

##### (3) 网页中使用 URL 的场景小结

包括但不限于如下场景：

* a 标签 href
* link 标签 href
* script 标签 src
  img 标签 src
* video audio 标签 src
* form 中的 action
* AJAX 请求中的 URL

#### 3. 设置资源类型（mime类型）

媒体类型（通常称为 Multipurpose Internet Mail Extensions 或 MIME 类型 ）是一种标准，用来表示文档、文件或字节流的性质和格式。

```
mime 类型结构： [type]/[subType]
例如： text/html text/css image/jpeg image/png application/json
```

HTTP 服务可以设置响应头 Content-Type 来表明响应体的 MIME 类型，浏览器会根据该类型决定如何处理资源

下面是常见文件对应的 mime 类型

```
html: 'text/html',
css: 'text/css',
js: 'text/javascript',
png: 'image/png',
jpg: 'image/jpeg',
gif: 'image/gif',
mp4: 'video/mp4',
mp3: 'audio/mpeg',
json: 'application/json'
```

> 对于未知的资源类型，可以选择 application/octet-stream 类型，浏览器在遇到该类型的响应时，会对响应体内容进行独立存储，也就是我们常见的 下载 效果

```javascript
require('http').createServer((request, response) => {
    //获取请求的方法已经路径
    let { url, method } = request;
    //判断请求方式以及请求路径
    if (method == "GET" && url == "/index.html") {
        //需要响应文件中的内容
        let data = require('fs').readFileSync(__dirname + '/index.html');
        response.end(data);
    } else if (method == "GET" && url == "/css/app.css") {
        //需要响应文件中的内容
        let data = require('fs').readFileSync(__dirname + '/public/css/app.css');
        response.end(data);
    } else if (method == "GET" && url == "/js/app.js") {
        //需要响应文件中的内容
        let data = require('fs').readFileSync(__dirname + '/public/js/app.js');
        response.end(data);
    }
    else {
        //404响应
        response.statusCode = 404;
        response.end("<h1>404 Not Found</h1>");
    }
}).listen(80, () => {
    console.log('80端口正在启动中....');
})
```

很明显上面的代码，当只要有一个请求路径就需要进行判断，显然这种方式不够完美，那么我们需要封装

```javascript
require('http').createServer((request, response) => {
    //获取请求的方法已经路径
    let { url, method } = request;
    //文件夹路径
    let rootDir = __dirname + '/public';
    //拼接文件路径
    let filePath = rootDir + url;
    //读取文件内容
    fs.readFile(filePath, (err, data) => {
        //判断
        if (err) {
            //如果出现错误，响应404状态码
            response.statusCode = 404;
            response.end('<h1>404 Not Found</h1>');
        } else {
            //响应文件内容
            response.end(data);
        }
    })
}).listen(80, () => {
    console.log('80端口正在启动中....');
})
```

#### 4. GET 和 POST 请求场景小结

GET 请求的情况：

* 在地址栏直接输入 url 访问

* 点击 a 链接

* link 标签引入 css

* script 标签引入 js

* img 标签引入图片

* form 标签中的 method 为 get （不区分大小写）

* ajax 中的 get 请求

POST 请求的情况：

* form 标签中的 method 为 post（不区分大小写）
* AJAX 的 post 请求

### 5.13 GET和POST请求的区别

GET 和 POST 是 HTTP 协议请求的两种方式。

* GET 主要用来获取数据，POST 主要用来提交数据

* GET 带参数请求是将参数缀到 URL 之后，在地址栏中输入 url 访问网站就是 GET 请求，
  POST 带参数请求是将参数放到请求体中

* POST 请求相对 GET 安全一些，因为在浏览器中参数会暴露在地址栏

* GET 请求大小有限制，一般为 2K，而 POST 请求则没有大小限制

## 六、模块化

### 6.1 介绍

#### 1. 什么是模块化与模块 ?

将一个复杂的程序文件依据一定规则（规范）拆分成多个文件的过程称之为 模块化

其中拆分出的 每个文件就是一个模块 ，模块的内部数据是私有的，不过模块可以暴露内部数据以便其他模块使用

#### 2. 什么是模块化项目 ?

编码时是按照模块一个一个编码的， 整个项目就是一个模块化的项目

#### 3. 模块化好处

下面是模块化的一些好处：

* 防止命名冲突

* 高复用性
* 高维护性

### 6.2 模块暴露数据

#### 1. 模块初体验

可以通过下面的操作步骤，快速体验模块化

* 创建 me.js

```javascript
//声明函数
function tiemo(){
console.log('贴膜....');
}
//暴露数据
module.exports = tiemo;
```

* 创建 index.js

```javascript
//导入模块
const tiemo = require('./me.js');
//调用函数
tiemo();
```

#### 2. 暴露数据

模块暴露数据的方式有两种：

1. module.exports = value

2. exports.name = value

> 使用时有几点注意：
> * module.exports 可以暴露 任意 数据
> * 不能使用 exports = value 的形式暴露数据，模块内部 module 与 exports 的隐式关系exports = module.exports = {} ，require 返回的是目标模块中 module.exports 的值

![](./images/13.png)

### 6.3 导入（引入）模块

在模块中使用 require 传入文件路径即可引入文件

```javascript
const test = require('./me.js');
```

require 使用的一些注意事项：

1. 对于自己创建的模块，导入时路径建议写 相对路径 ，且不能省略 ./ 和 ../

2. js 和 json 文件导入时可以不用写后缀，c/c++编写的 node 扩展文件也可以不写后缀，但是一般用不到

3. 如果导入其他类型的文件，会以 js 文件进行处理

4. 如果导入的路径是个文件夹，则会 首先 检测该文件夹下 package.json 文件中 main 属性对应的文件，
如果存在则导入，反之如果文件不存在会报错。
如果 main 属性不存在，或者 package.json 不存在，则会尝试导入文件夹下的 index.js 和index.json ，
如果还是没找到，就会报错

5. 导入 node.js 内置模块时，直接 require 模块的名字即可，无需加 ./ 和 ../

### 6.4 导入模块的基本流程

这里我们介绍一下 require 导入 自定义模块 的基本流程

1. 将相对路径转为绝对路径，定位目标文件

2. 缓存检测

3. 读取目标文件代码

4. 包裹为一个函数并执行（自执行函数）。通过 arguments.callee.toString() 查看自执行函数

5. 缓存模块的值

6. 返回 module.exports 的值

![](./images/14.png)

### 6.5 CommonJS 规范

module.exports 、 exports 以及 require 这些都是 CommonJS 模块化规范中的内容。

而 Node.js 是实现了 CommonJS 模块化规范，二者关系有点像 JavaScript 与 ECMAScript

## 七、包管理工具

### 7.1概念介绍

#### 1. 包是什么

英文单词是 package ，代表了一组特定功能的源码集合

#### 2. 包管理工具

管理『包』的应用软件，可以对「包」进行下载安装，更新，删除，上传等操作

借助包管理工具，可以快速开发项目，提升开发效率

包管理工具是一个通用的概念，很多编程语言都有包管理工具，所以掌握好包管理工具非常重要

#### 3. 常用的包管理工具

下面列举了前端常用的包管理工具

* npm

* yarn

* cnpm

### 7.2 npm

npm 全称 Node Package Manager ，翻译为中文意思是『Node 的包管理工具』

npm 是 node.js 官方内置的包管理工具，是 必须要掌握住的工具

#### 1. npm的安装

node.js 在安装时会 自动安装 npm ，所以如果你已经安装了 node.js，可以直接使用 npm

可以通过 npm -v 查看版本号测试，如果显示版本号说明安装成功，反之安装失败

![](./images/15.png)

> 查看版本时可能与上图版本号不一样，不过不影响正常使用

#### 2. npm 基本使用

##### (1) 初始化

创建一个空目录，然后以此目录作为工作目录 启动命令行工具 ，执行 npm init

![](./images/16.png)

npm init 命令的作用是将文件夹初始化为一个『包』， 交互式创建 package.json 文件

package.json 是包的配置文件，每个包都必须要有 package.json

package.json 内容示例：

```
{
    "name": "01_npm",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC"
}
```

> 初始化的过程中还有一些注意事项：
> 
> 1. package name ( 包名 ) 不能使用中文、大写，默认值是 文件夹的名称 ，所以文件夹名称也不能使用中文和大写
> 
> 2. version ( 版本号 )要求 x.x.x 的形式定义， x 必须是数字，默认值是 1.0.0
> 
> 3. ISC 证书与 MIT 证书功能上是相同的，关于开源证书扩展阅读 http://www.ruanyifeng.com/blog/2011/05/how_to_choose_free_software_licenses.html
>
> 4. package.json 可以手动创建与修改
>
> 5. 使用 npm init -y 或者 npm init --yes 极速创建 package.json

##### (2) 搜索包

搜索包的方式有两种

1. 命令行 『npm s/search 关键字』

2. 网站搜索 网址是 https://www.npmjs.com/

> 经常有同学问，『我怎样才能精准找到我需要的包？』
>
> 这个事儿需要大家在实践中不断的积累，通过看文章，看项目去学习去积累

##### (3) 下载安装包

我们可以通过 npm install 和 npm i 命令安装包

```shell
# 格式
npm install <包名>
npm i <包名>
# 示例
npm install uniq
npm i uniq
```

运行之后文件夹下会增加两个资源

* node_modules 文件夹 存放下载的包
* package-lock.json 包的锁文件 ，用来锁定包的版本

> 安装 uniq 之后，uniq 就是当前这个包的一个依赖包 ，有时会简称为依赖
> 
> 比如我们创建一个包名字为 A，A 中安装了包名字是 B，我们就说 B 是 A 的一个依赖包 ，也会说A 依赖 B

##### (4) require 导入 npm 包基本流程

1. 在当前文件夹下 node_modules 中寻找同名的文件夹

2. 在上级目录中下的 node_modules 中寻找同名的文件夹，直至找到磁盘根目录

#### 3. 生产环境与开发环境

开发环境是程序员专门用来写代码的环境，一般是指程序员的电脑，开发环境的项目一般只能程序员自己访问

生产环境是项目代码正式运行的环境，一般是指正式的服务器电脑，生产环境的项目一般每个客户都可以访问

#### 4. 生产依赖与开发依赖

我们可以在安装时设置选项来区分 依赖的类型 ，目前分为两类：

| 类型     | 命令                                    | 补充                                                         |
| -------- | --------------------------------------- | ------------------------------------------------------------ |
| 生产依赖 | npm i -S uniq<br/>npm i --save uniq     | -S 等效于 --save， -S 是默认选项<br/>包信息保存在 package.json 中 dependencies 属性 |
| 开发依赖 | npm i -D less<br/>npm i --save-dev less | -D 等效于 --save-dev<br/>包信息保存在 package.json 中 devDependencies 属性 |

> 举个例子方便大家理解，比如说做蛋炒饭需要大米，油，葱，鸡蛋，锅，煤气，铲子等
> 
> 其中锅，煤气，铲子属于开发依赖，只在制作阶段使用
> 
> 而大米，油，葱，鸡蛋属于生产依赖，在制作与最终食用都会用到
> 
> 所以开发依赖是只在开发阶段使用的依赖包，而生产依赖是开发阶段和最终上线运行阶段都用到的依赖包

#### 5. 全局安装

我们可以执行安装选项 -g 进行全局安装

```shell
npm i -g nodemon
```

全局安装完成之后就可以在命令行的任何位置运行 nodemon 命令

该命令的作用是 自动重启 node 应用程序

> 说明：
>
> - 全局安装的命令不受工作目录位置影响
> 
> - 可以通过 npm root -g 可以查看全局安装包的位置
> 
> - 不是所有的包都适合全局安装 ， 只有全局类的工具才适合，可以通过 查看包的官方文档来确定安装方式 ，这里先不必太纠结

##### (1) 修改 windows 执行策略

如果运行时报错，可以执行如下命令

以 管理员身份 打开 powershell 命令行，选全是A

```powershell
set-ExecutionPolicy remoteSigned
```

#### 6. 安装包依赖

在项目协作中有一个常用的命令就是 npm i ，通过该命令可以依据 package.json 和 package-lock.json 的依赖声明安装项目依赖

```shell
npm i
npm install
```

> node_modules 文件夹大多数情况都不会存入版本库

#### 7. 安装指定版本的包

项目中可能会遇到版本不匹配的情况，有时就需要安装指定版本的包，可以使用下面的命令的

```shell
## 格式
npm i <包名@版本号>
## 示例
npm i jquery@1.11.2
```

#### 8. 删除依赖

项目中可能需要删除某些不需要的包，可以使用下面的命令

```shell
## 局部删除
npm remove uniq
npm r uniq
## 全局删除
npm remove -g nodemon
```

#### 9. 配置命令别名

通过配置命令别名可以更简单的执行命令

配置 package.json 中的 scripts 属性

```shell
{
.
.
.
"scripts": {
"server": "node server.js",
"start": "node index.js",
},
.
.
}
```

配置完成之后，可以使用别名执行命令

```shell
npm run server
npm run start
```

不过 start 别名比较特别，使用时可以省略 run

```shell
npm start
```

> 补充说明：
> 
> - npm start 是项目中常用的一个命令，一般用来启动项目
> 
> - npm run 有自动向上级目录查找的特性，跟 require 函数也一样
> 
> - 对于陌生的项目，我们可以通过查看 scripts 属性来参考项目的一些操作

### 7.3 cnpm

#### 1. 介绍

cnpm 是一个淘宝构建的 npmjs.com 的完整镜像，也称为『淘宝镜像』，网址 https://npmmirror.com/

cnpm 服务部署在国内 阿里云服务器上 ， 可以提高包的下载速度

官方也提供了一个全局工具包 cnpm ，操作命令与 npm 大体相同

#### 2. 安装

我们可以通过 npm 来安装 cnpm 工具

```shell
npm install -g cnpm --registry=https://registry.npmmirror.com
```

#### 3. 操作命令

| 功能         | 命令                                                         |
| ------------ | ------------------------------------------------------------ |
| 初始化       | cnpm init / cnpm init                                        |
| 安装包       | cnpm i uniq<br/>cnpm i -S uniq<br/>cnpm i -D uniq<br/>cnpm i -g nodemon |
| 安装项目依赖 | cnpm i                                                       |
| 删除         | cnpm r uniq                                                  |

#### 4. npm 配置淘宝镜像

用 npm 也可以使用淘宝镜像，配置的方式有两种

- 直接配置

- 工具配置

##### (1) 直接配置（不推荐）

执行如下命令即可完成配置

```shell
npm config set registry https://registry.npmmirror.com/
```

##### (2) 工具配置（推荐）

使用 nrm 配置 npm 的镜像地址 npm registry manager

1. 安装 nrm

```shell
npm i -g nrm
```

2. 修改镜像

```shell
nrm use taobao
```

3. 检查是否配置成功（选做）

```shell
npm config list
```

检查 registry 地址是否为 https://registry.npmmirror.com/ , 如果是则表明成功

> 补充说明：
> 
> 1.建议使用第二种方式 进行镜像配置，因为后续修改起来会比较方便
>
> 2.虽然 cnpm 可以提高速度，但是 npm 也可以通过淘宝镜像进行加速，所以 npm 的使用率还是高于 cnpm

### 7.4 yarn

#### 1. yarn 介绍

yarn 是由 Facebook 在 2016 年推出的新的 Javascript 包管理工具，官方网址： https://yarnpkg.com/

#### 2. yarn 特点

yarn 官方宣称的一些特点

- 速度超快：yarn 缓存了每个下载过的包，所以再次使用时无需重复下载。 同时利用并行下载以最大化资源利用率，因此安装速度更快

- 超级安全：在执行代码之前，yarn 会通过算法校验每个安装包的完整

- 超级可靠：使用详细、简洁的锁文件格式和明确的安装算法，yarn 能够保证在不同系统上无差异的工作

#### 3. yarn安装

我们可以使用 npm 安装 yarn

```shell
npm i -g yarn
```

#### 4. yarn 常用命令

| 功能         | 命令                                                         |
| ------------ | ------------------------------------------------------------ |
| 初始化       | yarn init / yarn init -y                                     |
| 安装包       | yarn add uniq 生产依赖<br/>yarn add less --dev 开发依赖<br/>yarn global add nodemon 全局安装 |
| 删除包       | yarn remove uniq 删除项目依赖包<br/>yarn global remove nodemon 全局删除包 |
| 安装项目依赖 | yarn                                                         |
| 运行命令别名 | yarn <别名> # 不需要添加 run                                 |

> 注意： yarn全局安装的包不可用 ，yarn 全局安装包的位置可以通过 yarn global bin
来查看，手动添加环境变量

#### 5. yarn 配置淘宝镜像

可以通过如下命令配置淘宝镜像

```shell
yarn config set registry https://registry.npmmirror.com/
```

可以通过 yarn config list 查看 yarn 的配置项

#### 6. npm 和 yarn 选择

大家可以根据不同的场景进行选择

1. 个人项目

如果是个人项目， 哪个工具都可以 ，可以根据自己的喜好来选择

2. 公司项目

如果是公司要根据项目代码来选择，可以 通过锁文件判断 项目的包管理工具

npm 的锁文件为 package-lock.json

yarn 的锁文件为 yarn.lock

> 包管理工具 不要混着用，切记，切记，切记

### 7.5 管理发布包

#### 1. 创建与发布

我们可以将自己开发的工具包发布到 npm 服务上，方便自己和其他开发者使用，操作步骤如下：

1. 创建文件夹，并创建文件 index.js， 在文件中声明函数，使用 module.exports 暴露

2. npm 初始化工具包，package.json 填写包的信息 (包的名字是唯一的)

3. 注册账号 https://www.npmjs.com/signup

4. 激活账号 （ 一定要激活账号 ）

5. 修改为官方的官方镜像 (命令行中运行 nrm use npm )

6. 命令行下 npm login 填写相关用户信息

7. 命令行下 npm publish 提交包 👌

#### 2. 更新包

后续可以对自己发布的包进行更新，操作步骤如下

1. 更新包中的代码

2. 测试代码是否可用

3. 修改 package.json 中的版本号

4. 发布更新

```shell
npm publish
```

#### 3. 删除包

执行如下命令删除包

```shell
npm unpublish --force
```

> 删除包需要满足一定的条件， https://docs.npmjs.com/policies/unpublish
> 
> - 你是包的作者
> 
> - 发布小于 24 小时
> 
> - 大于 24 小时后，没有其他包依赖，并且每周小于 300 下载量，并且只有一个维护者

### 7.6 扩展内容

在很多语言中都有包管理工具，比如：

| 语言       | 包管理工具          |
| ---------- | ------------------- |
| PHP        | composer            |
| Python     | pip                 |
| Java       | maven               |
| Go         | go mod              |
| JavaScript | npm/yarn/cnpm/other |
| Ruby       | rubyGems            |

除了编程语言领域有包管理工具之外，操作系统层面也存在包管理工具，不过这个包指的是『 软件包 』

| 操作系统 | 包管理工具 | 网址                                |
| -------- | ---------- | ----------------------------------- |
| Centos   | yum        | https://packages.debian.org/stable/ |
| Ubuntu   | apt        | https://packages.ubuntu.com/        |
| MacOS    | homebrew   | https://brew.sh/                    |
| Windows  | chocolatey | https://chocolatey.org/             |

### 7.7 nvm

#### 1. 介绍

nvm 全称 Node Version Manager 顾名思义它是用来管理 node 版本的工具，方便切换不同版本的Node.js

#### 2. 使用

nvm 的使用非常的简单，跟 npm 的使用方法类似

##### (1) 下载安装

首先先下载 nvm，下载地址 https://github.com/coreybutler/nvm-windows/releases ，

选择 nvm-setup.exe 下载即可（网络异常的小朋友可以在资料文件夹中获取）

##### (2) 常用命令

| 命令                  | 说明                            |
| --------------------- | ------------------------------- |
| nvm list available    | 显示所有可以下载的 Node.js 版本 |
| nvm list              | 显示已安装的版本                |
| nvm install 18.12.1   | 安装 18.12.1 版本的 Node.js     |
| nvm install latest    | 安装最新版的 Node.js            |
| nvm uninstall 18.12.1 | 删除某个版本的 Node.js          |
| nvm use 18.12.1       | 切换 18.12.1 的 Node.js         |

## 八、express

### 8.1 express 介绍

express 是一个基于 Node.js 平台的极简、灵活的 WEB 应用开发框架，官方网址： https://www.expressjs.com.cn/

简单来说，express 是一个封装好的工具包，封装了很多功能，便于我们开发 WEB 应用（HTTP 服务）

### 8.2 express 使用

#### 1. express下载

express 本身是一个 npm 包，所以可以通过 npm 安装

```shell
npm init
npm i express
```

#### 2. express 初体验

大家可以按照这个步骤进行操作：

##### (1) 创建 JS 文件，键入如下代码

```javascript
//导入 express
const express = require('express');

//创建应用对象
const app = express();

//创建路由规则
app.get('/home', (req, res) => {
    res.end('hello express server');
});

//监听端口 启动服务
app.listen(3000, () => {
    console.log('服务已经启动, 端口监听为 3000...');
});
```

##### (2) 命令行下执行该脚本

```shell
node <文件名>
# 或者
nodemon <文件名>
```

##### (3) 访问

然后在浏览器就可以访问 http://127.0.0.1:3000/home 👌

### 8.3 express路由

#### 1. 什么是路由

官方定义：路由确定了应用程序如何响应客户端对特定端点的请求

#### 2. 路由的使用

一个路由的组成由 `请求方法` ， `路径` 和 `回调函数` 组成

express 中提供了一系列方法，可以很方便的使用路由，使用格式如下：

```javascript
app.<method>(path，callback)
```

代码示例：

```javascript
//导入 express
const express = require('express');

//创建应用对象
const app = express();

//创建路由规则
app.get('/home', (req, res) => {
    res.send('网站首页');
});

//首页路由
app.get('/', (req, res) => {
    res.send('我才是真正的首页')
})

//登陆post路哟
app.post('/login', (req, res) => {
    res.send('登陆成功')
})

//匹配所有的请求
app.all('/search', (req, res) => {
    res.send('1秒钟为您找到相关结果100000000个')
})

//自定义404路由
app.all('*', (req, res) => {
    res.send('<h1>404 Not Found</h1>')
})

//监听端口 启动服务
app.listen(3000, () => {
    console.log('服务已经启动, 端口监听为 3000...');
});
```

#### 3. 获取请求参数

express 框架封装了一些 API 来方便获取请求报文中的数据，并且兼容原生 HTTP 模块的获取方式

```javascript
//导入 express
const express = require('express');

//创建应用对象
const app = express();

//创建请求的路由规则
app.get('/request', (req, res) => {
    //1.获取报文的方式与http获取方式是兼容的
    console.log(req.method);
    console.log(req.url);
    console.log(req.httpVersion);
    console.log(req.headers);

    //2.express 独有的获取报文的方式
    //获取查询字符串
    console.log(req.query);
    //获取指定的请求头
    console.log(req.get('host'));
    res.send('请求报文的获取')
})

//监听端口 启动服务
app.listen(3000, () => {
    console.log('服务已经启动, 端口监听为 3000...');
});
```

#### 4. 获取路由参数

```javascript
app.get('/:id.html', (req, res) => {
res.send('商品详情, 商品 id 为' + req.params.id);
});
```

### 8.4 express响应设置

express 框架封装了一些 API 来方便给客户端响应数据，并且兼容原生 HTTP 模块的获取方式

```javascript
//导入 express
const express = require('express');

//创建应用对象
const app = express();

//创建路由规则
app.get('/response', (req, res) => {
    //1.express中设置响应的方式兼容http模块的方式
    res.statusCode = 404;
    res.statusMessage = 'xxx';
    //设置响应头utf-8编码，让响应的内容不乱码
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.write('响应体');
    res.end('xxx');

    //2. express 的响应方法
    res.status(500); //设置响应状态码
    res.set('xxx', 'yyy');//设置响应头
    res.send('中文响应不乱码');//设置响应体
    //连贯操作
    res.status(404).set('xxx', 'yyy').send('你好朋友')

    //3. 其他响应
    res.redirect('http://atguigu.com')//重定向
    res.download('./package.json');//下载响应
    res.json();//响应 JSON
    res.sendFile(__dirname + '/home.html') //响应文件内容  
});

//监听端口 启动服务
app.listen(3000, () => {
    console.log('服务已经启动, 端口监听为 3000...');
});
```

### 8.5 express中间件

#### 1. 什么是中间件

中间件（Middleware）本质是一个回调函数

中间件函数 可以像路由回调一样访问 请求对象（request） ， 响应对象（response）

#### 2. 中间件的作用

中间件的作用 就是 使用函数封装公共操作，简化代码

####  3. 中间件的类型

- 全局中间件
- 路由中间件

##### (1) 定义全局中间件

每一个请求 到达服务端之后 都会执行全局中间件函数

声明中间件函数

```javascript
let recordMiddleware = function(request,response,next){
//实现功能代码
//.....
//执行next函数(当如果希望执行完中间件函数之后，仍然继续执行路由中的回调函数，必须调用next)
next();
}
```

![](./images/17.png)

应用中间件

```javascript
app.use(recordMiddleware);
```

声明时可以直接将匿名函数传递给 use

```javascript
app.use(function (request, response, next) {
console.log('定义第一个中间件');
next();
})
```

##### (2) 多个全局中间件

express 允许使用 app.use() 定义多个全局中间件

```javascript
app.use(function (request, response, next) {
console.log('定义第一个中间件');
next();
})
app.use(function (request, response, next) {
console.log('定义第二个中间件');
next();
})
```

##### (3) 定义路由中间件

如果 只需要对某一些路由进行功能封装 ，则就需要路由中间件

调用格式如下：

```javascript
app.get('/路径',`中间件函数`,(request,response)=>{
});
app.get('/路径',`中间件函数1`,`中间件函数2`,(request,response)=>{
});
```

#### 4. 静态资源中间件

express 内置处理静态资源的中间件

```javascript
//引入express框架
const express = require('express');
//创建服务对象
const app = express();
//静态资源中间件的设置，将当前文件夹下的public目录作为网站的根目录
app.use(express.static('./public')); //当然这个目录中都是一些静态资源
//如果访问的内容经常变化，还是需要设置路由
//但是，在这里有一个问题，如果public目录下有index.html文件，单独也有index.html的路由，
//则谁书写在前，优先执行谁
app.get('/index.html',(request,response)=>{
respsonse.send('首页');
});
//监听端口
app.listen(3000,()=>{
console.log('3000 端口启动....');
});
```

> 注意事项:
> 1. index.html 文件为默认打开的资源
> 2. 如果静态资源与路由规则同时匹配，谁先匹配谁就响应
> 3. 路由响应动态资源，静态资源中间件响应静态资源

#### 5. 获取请求体数据 body-parser

express 可以使用 body-parser 包处理请求体

```javascript
npm i body-parser
```

第二步：导入 body-parser 包

```javascript
const bodyParser = require('body-parser');
```

第三步：获取中间件函数

```javascript
//处理 querystring 格式的请求体
let urlParser = bodyParser.urlencoded({extended:false}));
//处理 JSON 格式的请求体
let jsonParser = bodyParser.json();
```

第四步：设置路由中间件，然后使用 request.body 来获取请求体数据

```javascript
app.post('/login', urlParser, (request,response)=>{
//获取请求体数据
//console.log(request.body);
//用户名
console.log(request.body.username);
//密码
console.log(request.body.userpass);
response.send('获取请求体数据');
});
```

获取到的请求体数据：

```javascript
[Object: null prototype] { username: 'admin', userpass: '123456' }
```

### 8.6 Router

#### 1. 什么是 Router

express 中的 Router 是一个完整的中间件和路由系统，可以看做是一个小型的 app 对象。

#### 2. Router 作用

对路由进行模块化，更好的管理路由

#### 3. Router 使用

创建独立的 JS 文件（homeRouter.js）

```javascript
//1. 导入 express
const express = require('express');
//2. 创建路由器对象
const router = express.Router();
//3. 在 router 对象身上添加路由
router.get('/', (req, res) => {
res.send('首页');
})
router.get('/cart', (req, res) => {
res.send('购物车');
});
//4. 暴露
module.exports = router;
```

主文件

```javascript
const express = require('express');
const app = express();
//5.引入子路由文件
const homeRouter = require('./routes/homeRouter');
//6.设置和使用中间件
app.use(homeRouter);
app.listen(3000,()=>{
console.log('3000 端口启动....');
})
```

### 8.7 JS 模板引擎

#### 1. 什么是模板引擎

模板引擎是分离 用户界面和业务数据 的一种技术

#### 2. 什么是 EJS

EJS 是一个高效的 Javascript 的模板引擎

官网: https://ejs.co/

中文站： https://ejs.bootcss.com/

#### 3. EJS 初体验

下载安装EJS

```javascript
npm i ejs --save
```

代码示例

```javascript
//1.引入ejs
const ejs = require('ejs');
//2.定义数据
let person = ['张三','李四','王二麻子'];
//3.ejs解析模板返回结构
//<%= %> 是ejs解析内容的标记，作用是输出当前表达式的执行结构
let html = ejs.render(‘<%= person.join(",") %>’, {person:person});
//4.输出结果
console.log(html);
```

命令行下运行

#### 4. EJS 常用语法

执行JS代码

```javascript
<% code %>
```

输出转义的数据到模板上

```javascript
<%= code %>
```

输出非转义的数据到模板上

```javascript
<%- code %>
```

