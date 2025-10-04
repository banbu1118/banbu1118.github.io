# Electron快速入门

配套学习视频资料：邓瑞编程-Electron快速入门

邓瑞编程官方教程：https://www.dengruicode.com/classes?uuid=1f57f190ad364d91a1cadcf32dc3df1c

Electron中文官网：https://www.electronjs.org/zh/docs/latest/

本教程未获取邓瑞编程授权，仅作用学习使用，无商业目的！！！

## 一、安装和配置 Electron

Electron是一个使用 JS、HTML 和 CSS 构建桌面应用程序的跨平台框架

[PNG 到 ICO 转换器 |免费在线图标转换器](https://convertico.com/)

初始化项目

```shell
npm init -y
```

安装electron

```shell
npm i electron -D
```

配置package.json，使用es语法，配置start命令

```json
{
  "name": "client",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "type": "module",
  "scripts": {
    "start": "electron .",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "electron": "^38.2.1"
  }
}
```

main.js

```js
import { app, BrowserWindow } from "electron"

//创建窗口
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1300, //设置窗口宽度(单位:像素)
        height: 750, //设置窗口高度
        icon: "resource/images/code.ico", //设置窗口图标
        autoHideMenuBar: false, //隐藏菜单栏
        // resizable: false, //禁止调整窗口大小
        x: 0, //x表示窗口左上角的水平坐标(单位:像素)
        y: 0, //y表示窗口左上角的垂直坐标
    })

    mainWindow.loadURL("https://www.dengruicode.com") //加载指定的 url

    //当尝试打开新窗口时, 阻止默认行为, 在当前窗口加载 url
    mainWindow.webContents.setWindowOpenHandler(details => {
        mainWindow.loadURL(details.url)
        return { action: 'deny' } //阻止默认行为
    })
}

//当应用准备就绪后创建窗口
app.whenReady().then(() => {
    createWindow()
})
```

运行项目

```shell
npm start
```

## 二、解决 VSCode 终端打印中文乱码

main.js

```js
import { app, BrowserWindow } from "electron"

console.log("中文测试");

//创建窗口
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1300, //设置窗口宽度(单位:像素)
        height: 750, //设置窗口高度
        icon: "resource/images/code.ico", //设置窗口图标
        autoHideMenuBar: false, //隐藏菜单栏
        // resizable: false, //禁止调整窗口大小
        x: 0, //x表示窗口左上角的水平坐标(单位:像素)
        y: 0, //y表示窗口左上角的垂直坐标
    })

    mainWindow.loadURL("https://www.dengruicode.com") //加载指定的 url

    //当尝试打开新窗口时, 阻止默认行为, 在当前窗口加载 url
    mainWindow.webContents.setWindowOpenHandler(details => {
        mainWindow.loadURL(details.url)
        return { action: 'deny' } //阻止默认行为
    })
}

//当应用准备就绪后创建窗口
app.whenReady().then(() => {
    createWindow()
})
```

package.json

```json
{
  "name": "client",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "type": "module",
  "scripts": {
    "start": "chcp 65001 && electron .",
    "dev": "chcp 65001 && nodemon --exec electron .",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "electron": "^38.2.1"
  }
}
```

> [!NOTE]
> chcp 65001
> chcp(Change Code Page) 用于改变活动控制台窗口的代码页，65001 是 UTF-8 编码的代码页编号

```
npm start (start是npm中被预定义为运行项目的入口脚本)
npm run dev (dev并不是npm预定义的脚本)
```

## 三、加载本地 html 和解决 CSP 警告

快捷键 ：打开开发者工具 Ctrl+Shift+I，页面刷新 Ctrl+R

CSP内容安全策略警告：Electron Security Warning (Insecure Content-Security-Policy)

main.js

加载本地html

```js
import { app, BrowserWindow } from "electron"

console.log("中文测试");

//创建窗口
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1300, //设置窗口宽度(单位:像素)
        height: 750, //设置窗口高度
        icon: "resource/images/code.ico", //设置窗口图标
        autoHideMenuBar: true, //隐藏菜单栏
        // resizable: false, //禁止调整窗口大小
        x: 0, //x表示窗口左上角的水平坐标(单位:像素)
        y: 0, //y表示窗口左上角的垂直坐标
    })

    // mainWindow.loadURL("https://www.dengruicode.com") //加载指定的 url
    mainWindow.loadFile("resource/renderer/views/index.html") //加载指定的 html 文件

    //当尝试打开新窗口时, 阻止默认行为, 在当前窗口加载 url
    mainWindow.webContents.setWindowOpenHandler(details => {
        mainWindow.loadURL(details.url)
        return { action: 'deny' } //阻止默认行为
    })
}

//当应用准备就绪后创建窗口
app.whenReady().then(() => {
    createWindow()
})
```

resource\renderer\views\index.html

配置meta标签，处理CSP内容安全策略警告

```
default-src 'self' 只允许加载同源的资源
script-src 'self' 只允许加载同源的脚本
style-src 'self' 'unsafe-inline'
'self' 只允许加载同源的样式
'unsafe-inline' 允许内联样式

注意：同源策略是浏览器的一种安全机制，通过对比协议、域名和端口这三部分来确定资源是否"同源",只有同源的资源才能进行交互
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'">
  <title>客户端测试</title>
  <link rel="stylesheet" href="../css/base.css">
  <script src="../js/index.js"></script>
</head>
<body>
  dengruicode.com
</body>
</html>
```

resource\renderer\css\base.css

```css
/*
    作者: 邓瑞
    版本: 1.3
    网站: www.dengruicode.com
    日期: 2024-08-18
*/
* {
    margin: 0;
    padding: 0;
}

body {
	font-size: 14px;
    font-family: "仓耳与墨 W02";
}

a {
    outline: none;
    text-decoration: none;
    cursor: pointer;
}

ul,
li {
    list-style-type: none;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-weight: normal;
}

input:focus,
textarea:focus,
select:focus {
    outline: none;
}

img {
    border: none;
}

iframe {
    border: none;
}

/* Chrome 滚动条样式 */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-thumb {
    background: #d8dadb;
}

::-webkit-scrollbar-thumb:hover {
    background: #c3c2c2;
}

/* color */
.blue {
    color: #1e9eff;
}

.green {
    color: #15baaa;
}

.orange {
    color: #feb801;
}

.red {
    color: #f75a23;
}
```

resource\renderer\js\index.js

```js
console.log("dengruicode.com");
```

## 四、主进程和渲染进程

> 简单理解：
> 主进程（Main Process） ≈ main.js
> 渲染进程（Renderer Process） ≈ 运行在 BrowserWindow 里的网页环境（HTML + JS + CSS）

在 Electron 中,应用主要被分为两个部分：主进程(Main Process)和渲染进程(Renderer Process)

主进程负责管理应用生命周期和所有窗口，而每个打开的网页或 html 文件则运行在一个独立的渲染进程中

主进程 ：Electron 启动时会查找 package.json 中 main 字段指定的文件 main.js 作为主进程入口，可以直接使用 Node.js API

主进程 main.js 示例:

```js
 import os from 'os'
 console.log(os.version()) //内核版本
```

渲染进程：渲染进程通常运行在浏览器环境中，受限于安全限制, 渲染进程默认不可以直接使用 Node.js API，允许在渲染进程中直接使用 Node.js API (不推荐在生产环境中使用)

```js
const mainWindow = new BrowserWindow({
         webPreferences: {
             nodeIntegration: true,
             contextIsolation: false,
         }
     })
```

 适用场景：需要在渲染进程中直接使用 Node.js API
 注意：该配置降低了安全性, 使 Node.js 的全局对象完全对渲染进程开放

渲染进程 index.js 示例CJS规范：

```js
 const os = require('os')
console.log(os.userInfo()) //当前用户的信息 
```

## 五、预加载脚本

预加载脚本 (是在渲染进程加载页面之前运行的脚本)，在渲染进程和主进程之间提供一个安全的桥梁，使得主进程和渲染进程能够安全的通信

main.js

```js
import { app, BrowserWindow } from "electron"
import os from "os"
import url from 'url'
import path from 'path'

let __filename = url.fileURLToPath(import.meta.url)
let __dirname = path.dirname(__filename)

// console.log(os.version());
// console.log("中文测试");

//创建窗口
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1300, //设置窗口宽度(单位:像素)
        height: 750, //设置窗口高度
        icon: "resource/images/code.ico", //设置窗口图标
        autoHideMenuBar: true, //隐藏菜单栏
        // resizable: false, //禁止调整窗口大小
        x: 0, //x表示窗口左上角的水平坐标(单位:像素)
        y: 0, //y表示窗口左上角的垂直坐标

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.resolve(__dirname,"resource/preload/preload.mjs"), //预加载脚本
        }
    })

    // mainWindow.loadURL("https://www.dengruicode.com") //加载指定的 url
    mainWindow.loadFile("resource/renderer/views/index.html") //加载指定的 html 文件

    //当尝试打开新窗口时, 阻止默认行为, 在当前窗口加载 url
    mainWindow.webContents.setWindowOpenHandler(details => {
        mainWindow.loadURL(details.url)
        return { action: 'deny' } //阻止默认行为
    })
}

//当应用准备就绪后创建窗口
app.whenReady().then(() => {
    createWindow()
})
```

> 注意：nodeIntegration: true, contextIsolation: true
> 适用场景：需要在预加载脚本中使用 Node.js API
> 可提高一定的安全性,因为Node.js的全局对象(global)与渲染器进程的全局对象(window)相互隔离

resource\preload\preload.mjs

```js
import os from 'os'
import { contextBridge } from "electron"

console.log("preload.mjs")

contextBridge.exposeInMainWorld('DRAPI', {
    url: "dengruicode.com",
    version: os.version()
})
```

resource\renderer\js\index.js

```js
// console.log("index.js");
console.log("index.js", window)
```

