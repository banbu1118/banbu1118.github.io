## NodeJS学习

### 一、简介

#### 1.1 简介

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，允许开发者使用 JavaScript 编写服务器端代码。

它采用事件驱动、非阻塞 I/O 模型，使其轻量且高效，尤其适合数据密集型实时应用。 

#### 1.2 使用场景

|使用场景|示例|
| ---- | ---- |
| 服务器端开发 | web服务器 |
| 开发工具类应用 | vscode等 |
| 桌面应用开发 | electron框架开发跨平台桌面应用 |

#### 1.3 下载安装

官网下载：[https://nodejs.org/zh-cn/download](https://nodejs.org/zh-cn/download)，推荐使用LTS版本

安装后，使用node命令查看版本

```
C:\Users\kk>node -v
v22.14.0
```

#### 1.4 前端核心技术体系

![](./images/1.png)

#### 1.5 学习教程

尚硅谷视频：[https://www.bilibili.com/video/BV1gM411W7ex/](https://www.bilibili.com/video/BV1gM411W7ex/)

#### 1.6 注意事项

- 浏览器中的Javascript

![](./images/2.png)

- Node.js中的Javascript

![](./images/3.png)

注意：

1.Node.js中不能使用BOM和DOM的API，可以使用console和定时器API

2.Node.js中的顶级对象为global，也可用globalThis访问顶级对象(globalThis === global)

