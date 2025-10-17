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

配置 .npmrc 文件

```
registry=https://registry.npmmirror.com/
electron_mirror=https://npmmirror.com/mirrors/electron/
```

main.js

```js
// 从 Electron 模块中导入 app（控制应用生命周期）和 BrowserWindow（创建窗口）对象
import { app, BrowserWindow } from "electron"

// 定义创建主窗口的函数
const createWindow = () => {
    // 创建一个新的浏览器窗口实例
    const mainWindow = new BrowserWindow({
        width: 1300, // 窗口宽度（像素）
        height: 750, // 窗口高度（像素）
        icon: "resource/images/vdi.ico", // 窗口图标（本地文件路径）
        autoHideMenuBar: false, // 是否自动隐藏菜单栏（false 表示显示菜单栏）
        resizable: false, // 禁止调整窗口大小（如果取消注释则用户无法拖拽调整）
        x: 0, // 窗口左上角的水平坐标（相对于屏幕左上角）
        y: 0, // 窗口左上角的垂直坐标
    })

    // 在窗口中加载指定的网页（这里是外部网站）
    mainWindow.loadURL("https://www.baidu.com")

    // 设置当网页尝试打开新窗口时（例如点击 target="_blank" 的链接）
    mainWindow.webContents.setWindowOpenHandler(details => {
        // 拦截请求，改为在当前窗口中加载新页面
        mainWindow.loadURL(details.url)
        // 返回 action: 'deny' 表示禁止 Electron 创建新窗口
        return { action: 'deny' }
    })
}

// 当 Electron 完成初始化并准备好创建窗口时执行
app.whenReady().then(() => {
    createWindow() // 调用上面定义的函数创建主窗口
})

// 🚀 说明：
// app.whenReady() 是异步的，会在 Electron 完全初始化（包括渲染进程环境）后触发。
// BrowserWindow 是 Electron 提供的类，用于创建原生窗口并加载网页内容。
// setWindowOpenHandler() 可以拦截网页的 window.open() 行为，防止弹出新窗口。
```

运行项目

```shell
npm start
```

## 二、解决 VSCode 终端打印中文乱码

main.js

```js
// 从 Electron 模块中导入 app（控制应用生命周期）和 BrowserWindow（创建窗口）对象
import { app, BrowserWindow } from "electron"

console.log("中文测试");

// 定义创建主窗口的函数
const createWindow = () => {
    // 创建一个新的浏览器窗口实例
    const mainWindow = new BrowserWindow({
        width: 1300, // 窗口宽度（像素）
        height: 750, // 窗口高度（像素）
        icon: "resource/images/vdi.ico", // 窗口图标（本地文件路径）
        autoHideMenuBar: false, // 是否自动隐藏菜单栏（false 表示显示菜单栏）
        resizable: false, // 禁止调整窗口大小（如果取消注释则用户无法拖拽调整）
        x: 0, // 窗口左上角的水平坐标（相对于屏幕左上角）
        y: 0, // 窗口左上角的垂直坐标
    })

    // 在窗口中加载指定的网页（这里是外部网站）
    mainWindow.loadURL("https://www.baidu.com")

    // 设置当网页尝试打开新窗口时（例如点击 target="_blank" 的链接）
    mainWindow.webContents.setWindowOpenHandler(details => {
        // 拦截请求，改为在当前窗口中加载新页面
        mainWindow.loadURL(details.url)
        // 返回 action: 'deny' 表示禁止 Electron 创建新窗口
        return { action: 'deny' }
    })
}

// 当 Electron 完成初始化并准备好创建窗口时执行
app.whenReady().then(() => {
    createWindow() // 调用上面定义的函数创建主窗口
})

// 🚀 说明：
// app.whenReady() 是异步的，会在 Electron 完全初始化（包括渲染进程环境）后触发。
// BrowserWindow 是 Electron 提供的类，用于创建原生窗口并加载网页内容。
// setWindowOpenHandler() 可以拦截网页的 window.open() 行为，防止弹出新窗口。
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

> 注意：
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
// 从 Electron 模块中导入 app（控制应用生命周期）和 BrowserWindow（创建窗口）对象
import { app, BrowserWindow } from "electron"

console.log("中文测试");

// 定义创建主窗口的函数
const createWindow = () => {
    // 创建一个新的浏览器窗口实例
    const mainWindow = new BrowserWindow({
        width: 1300, // 窗口宽度（像素）
        height: 750, // 窗口高度（像素）
        icon: "resource/images/vdi.ico", // 窗口图标（本地文件路径）
        autoHideMenuBar: false, // 是否自动隐藏菜单栏（false 表示显示菜单栏）
        resizable: false, // 禁止调整窗口大小（如果取消注释则用户无法拖拽调整）
        x: 0, // 窗口左上角的水平坐标（相对于屏幕左上角）
        y: 0, // 窗口左上角的垂直坐标
    })

    // 在窗口中加载指定的网页（这里是外部网站）
    // mainWindow.loadURL("https://www.baidu.com")

    // 加载本地的 HTML 文件（相对于当前文件的路径）
    mainWindow.loadFile("resource/renderer/views/index.html")

    // 设置当网页尝试打开新窗口时（例如点击 target="_blank" 的链接）
    mainWindow.webContents.setWindowOpenHandler(details => {
        // 拦截请求，改为在当前窗口中加载新页面
        mainWindow.loadURL(details.url)
        // 返回 action: 'deny' 表示禁止 Electron 创建新窗口
        return { action: 'deny' }
    })
}

// 当 Electron 完成初始化并准备好创建窗口时执行
app.whenReady().then(() => {
    createWindow() // 调用上面定义的函数创建主窗口
})

// 🚀 说明：
// app.whenReady() 是异步的，会在 Electron 完全初始化（包括渲染进程环境）后触发。
// BrowserWindow 是 Electron 提供的类，用于创建原生窗口并加载网页内容。
// setWindowOpenHandler() 可以拦截网页的 window.open() 行为，防止弹出新窗口。
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

> 注意：
> nodeIntegration: true, contextIsolation: true
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

## 六、进程间通信 IPC

进程间通信 IPC(Inter-Process Communication)

Electron 应用由多个进程组成, 包括一个主进程和一个或多个渲染进程

进程之间由于安全原因不能直接共享数据, 需通过 IPC 来进行数据交换


新版 Electron 推荐使用双向通信 ipcRenderer.invoke 和 ipcMain.handle 进行进程间的通信，不推荐使用传统的单向通信 ipcRenderer.send 和 ipcMain.on

ipcRenderer.invoke 发送请求并等待响应, 返回一个 Promise

ipcRenderer.send 发送请求但不等待响应, 没有返回值



ipcMain.handle 在主进程中定义, 是接收者, 用于接收来自渲染进程的消息

ipcRenderer.invoke 在预加载脚本中调用, 是发送者, 用于向主进程发送消息



ipcRenderer.invoke(channel, data)

channel 是一个字符串,用于标识通信的通道,不同的通道名称可以调用不同的功能

发送者通过指定的 channel 发送数据,接收者通过监听相同的 channel 来接收数据

main.js

```js
import { app, BrowserWindow, ipcMain } from "electron"
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
            preload: path.resolve(__dirname, "resource/preload/preload.mjs"), //预加载脚本
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

//定义了一个处理函数, 用于响应名为 sendDataToMain 的异步调用
//当渲染进程通过 sendDataToMain 发起调用时, 处理函数会被触发
ipcMain.handle("sendDataToMain", (e, data) => {
    console.log(data)

    return data
})
```

resource\preload\preload.mjs

```mjs
import os from 'os'
import { contextBridge, ipcRenderer } from "electron"

console.log("preload.mjs")

contextBridge.exposeInMainWorld('DRAPI', {
    url: "dengruicode.com",
    version: os.version(),
    sendDataToMain: async data => {
        //向主进程发起一个名为 sendDataToMain 的异步调用, 并携带 data 数据
        return await ipcRenderer.invoke('sendDataToMain', data)
    }
})
```

resource\renderer\js\index.js

```js
// console.log("index.js");
// console.log("index.js", window)

DRAPI.sendDataToMain("dengruicode.com").then(data => {
    console.log("data:", data)
}).catch(err => {
    console.log("err:", err)
})
```

Electron IPC 数据流图，展示 主进程 ↔ preload ↔ 渲染进程 的通信关系和流程

```
+-------------------+        invoke/send         +-------------------+
|                   |--------------------------->|                   |
|   Renderer        |                            |   Preload         |
|   Process         |                            |   (Sandbox)       |
|  index.js         |                            | preload.mjs       |
|                   |<---------------------------| exposeInMainWorld |
+-------------------+        return/promise     +-------------------+
        ^                                           |
        |                                           |
        |   invoke IPC / async call                |
        |                                           v
        |                                 +-------------------+
        |                                 |                   |
        |                                 |   Main Process    |
        |                                 |   main.js         |
        |                                 |                   |
        +---------------------------------| ipcMain.handle     |
                                          | return value       |
                                          +-------------------+
```

- 流程说明

1. **渲染进程**调用 `DRAPI.sendDataToMain(data)`
   - 这是网页 JS 发起请求。
2. **preload 脚本**通过 `ipcRenderer.invoke('sendDataToMain', data)`
   - 作为安全桥梁，把请求传给主进程。
3. **主进程**通过 `ipcMain.handle('sendDataToMain', callback)`
   - 接收到消息，处理逻辑（如打印或返回数据）。
4. **主进程返回结果** → preload → 渲染进程 `.then()`
   - 异步返回 Promise，让渲染进程继续处理。

## 七、设置主题

main.js

```js
import { app, BrowserWindow, ipcMain, nativeTheme } from "electron"
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
            preload: path.resolve(__dirname, "resource/preload/preload.mjs"), //预加载脚本
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

//定义了一个处理函数, 用于响应名为 sendDataToMain 的异步调用
//当渲染进程通过 sendDataToMain 发起调用时, 处理函数会被触发
ipcMain.handle("sendDataToMain", (e, data) => {
    console.log(data)

    return data
})

//切换主题
ipcMain.handle("toggleTheme", () => {
    if (nativeTheme.shouldUseDarkColors) { //如果系统为深色主题时
        nativeTheme.themeSource = 'light' //设置为浅色主题
        return "浅色主题"
    } else {
        nativeTheme.themeSource = 'dark' //设置为深色主题
        return "深色主题"
    }
})
```

resource\preload\preload.mjs

```mjs
import os from 'os'
import { contextBridge, ipcRenderer } from "electron"

console.log("preload.mjs")

contextBridge.exposeInMainWorld('DRAPI', {
    url: "dengruicode.com",
    version: os.version(),
    sendDataToMain: async data => {
        //向主进程发起一个名为 sendDataToMain 的异步调用, 并携带 data 数据
        return await ipcRenderer.invoke('sendDataToMain', data)
    },
    //切换主题
    toggleTheme: () => { 
        return ipcRenderer.invoke('toggleTheme')
    }
})
```

resource\renderer\js\index.js

```js
// console.log("index.js");
// console.log("index.js", window)

DRAPI.sendDataToMain("dengruicode.com").then(data => {
    console.log("data:", data)
}).catch(err => {
    console.log("err:", err)
})

//切换主题
document.querySelector('#toggleTheme').addEventListener('click', async () => {
    let theme = await DRAPI.toggleTheme()
    console.log(theme)
})
```

resource\renderer\views\index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'">
  <title>客户端测试</title>
  <link rel="stylesheet" href="../css/base.css">
</head>
<body>
  dengruicode.com

  <button id="toggleTheme">切换主题</button>
  <script src="../js/index.js"></script>
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

/* 深色主题 */
@media (prefers-color-scheme: dark) {
    a {
        color: #fff;
    }

    body {
        color: #fff;
        background: #272727;
    }
}
```

>切换主题的逻辑是：渲染进程发起 IPC → preload 安全桥 → 主进程操作 nativeTheme → 返回结果 → 渲染进程更新界面/打印日志

## 八、预加载脚本通用调用方法

resource\preload\preload.mjs

```mjs
import os from 'os'
import { contextBridge, ipcRenderer } from "electron"

console.log("preload.mjs")

contextBridge.exposeInMainWorld('DRAPI', {
    url: "dengruicode.com",
    version: os.version(),
    // sendDataToMain: async data => {
    //     //向主进程发起一个名为 sendDataToMain 的异步调用, 并携带 data 数据
    //     return await ipcRenderer.invoke('sendDataToMain', data)
    // },
    // //切换主题
    // toggleTheme: () => { 
    //     return ipcRenderer.invoke('toggleTheme')
    // }
    invokeWithData: async (channel, data) => {
        return await ipcRenderer.invoke(channel, data) //发送者通过指定的 channel 发送数据
    },
    invoke: async channel => {
        return await ipcRenderer.invoke(channel)
    },
})
```

resource\renderer\js\index.js

```js
// console.log("index.js");
// console.log("index.js", window)

// DRAPI.sendDataToMain("dengruicode.com").then(data => {
//     console.log("data:", data)
// }).catch(err => {
//     console.log("err:", err)
// })

// //切换主题
// document.querySelector('#toggleTheme').addEventListener('click', async () => {
//     let theme = await DRAPI.toggleTheme()
//     console.log(theme)
// })

DRAPI.invokeWithData("sendDataToMain", "dengruicode.com").then(data => {
    console.log("data:", data)
}).catch(err => {
    console.log("err:", err)
})

document.querySelector('#toggleTheme').addEventListener('click', async () => {
    //let theme = await DRAPI.toggleTheme()
    let theme = await DRAPI.invoke("toggleTheme")
    console.log(theme)
})
```

## 九、设置菜单和绑定快捷键

main.js

```js
import { app, BrowserWindow, ipcMain, nativeTheme, Menu, shell } from "electron"
import os from "os"
import url from 'url'
import path from 'path'

let __filename = url.fileURLToPath(import.meta.url)
let __dirname = path.dirname(__filename)

// console.log(os.version());
// console.log("中文测试");

const createMenu = () => {
    //基础模板
    let template = [
        {
            label: '工具(T)',
            submenu: [
                {
                    label: '刷新',
                    accelerator: 'F5',
                    click: (item, focuseWindow) => {
                        if (focuseWindow) {
                            focuseWindow.reload()
                        }
                    }
                },
                {
                    label: '切换开发者工具',
                    accelerator: 'F12',
                    click: (item, focuseWindow) => {
                        if (focuseWindow) {
                            focuseWindow.webContents.toggleDevTools()
                        }
                    }
                }
            ]
        },
        {
            label: '帮助(H)',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        shell.openExternal('https://dengruicode.com') //打开外部链接
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

//创建窗口
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1300, //设置窗口宽度(单位:像素)
        height: 750, //设置窗口高度
        icon: "resource/images/code.ico", //设置窗口图标
        // autoHideMenuBar: true, //隐藏菜单栏
        // resizable: false, //禁止调整窗口大小
        x: 0, //x表示窗口左上角的水平坐标(单位:像素)
        y: 0, //y表示窗口左上角的垂直坐标

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.resolve(__dirname, "resource/preload/preload.mjs"), //预加载脚本
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
    createMenu()
    createWindow()
})

//定义了一个处理函数, 用于响应名为 sendDataToMain 的异步调用
//当渲染进程通过 sendDataToMain 发起调用时, 处理函数会被触发
ipcMain.handle("sendDataToMain", (e, data) => {
    console.log(data)

    return data
})

//切换主题
ipcMain.handle("toggleTheme", () => {
    if (nativeTheme.shouldUseDarkColors) { //如果系统为深色主题时
        nativeTheme.themeSource = 'light' //设置为浅色主题
        return "浅色主题"
    } else {
        nativeTheme.themeSource = 'dark' //设置为深色主题
        return "深色主题"
    }
})
```

## 十、设置系统托盘

main.js

```js
import { app, BrowserWindow, ipcMain, nativeTheme, Menu, shell, Tray } from "electron"
import os from "os"
import url from 'url'
import path from 'path'

let __filename = url.fileURLToPath(import.meta.url)
let __dirname = path.dirname(__filename)

// console.log(os.version());
// console.log("中文测试");

const createMenu = () => {
    //基础模板
    let template = [
        {
            label: '工具(T)',
            submenu: [
                {
                    label: '刷新',
                    accelerator: 'F5',
                    click: (item, focuseWindow) => {
                        if (focuseWindow) {
                            focuseWindow.reload()
                        }
                    }
                },
                {
                    label: '切换开发者工具',
                    accelerator: 'F12',
                    click: (item, focuseWindow) => {
                        if (focuseWindow) {
                            focuseWindow.webContents.toggleDevTools()
                        }
                    }
                }
            ]
        },
        {
            label: '帮助(H)',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        shell.openExternal('https://dengruicode.com') //打开外部链接
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

//创建窗口
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1300, //设置窗口宽度(单位:像素)
        height: 750, //设置窗口高度
        icon: "resource/images/code.ico", //设置窗口图标
        // autoHideMenuBar: true, //隐藏菜单栏
        // resizable: false, //禁止调整窗口大小
        x: 0, //x表示窗口左上角的水平坐标(单位:像素)
        y: 0, //y表示窗口左上角的垂直坐标

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.resolve(__dirname, "resource/preload/preload.mjs"), //预加载脚本
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

//创建托盘
const createTray = () => {
    const icon = "resource/images/code.ico" //托盘图标
    let template = [
        {
            label: '关于',
            click: () => {
                shell.openExternal('https://dengruicode.com') //打开外部链接
            }
        },
        {
            label: '退出',
            click: () => {
                app.quit()
            }
        }
    ]

    const menu = Menu.buildFromTemplate(template) //根据模板构建菜单
    const tray = new Tray(icon)
    tray.setContextMenu(menu) //设置菜单
}

//当应用准备就绪后创建窗口
app.whenReady().then(() => {
    createMenu()
    createWindow()
    createTray()
})

//定义了一个处理函数, 用于响应名为 sendDataToMain 的异步调用
//当渲染进程通过 sendDataToMain 发起调用时, 处理函数会被触发
ipcMain.handle("sendDataToMain", (e, data) => {
    console.log(data)

    return data
})

//切换主题
ipcMain.handle("toggleTheme", () => {
    if (nativeTheme.shouldUseDarkColors) { //如果系统为深色主题时
        nativeTheme.themeSource = 'light' //设置为浅色主题
        return "浅色主题"
    } else {
        nativeTheme.themeSource = 'dark' //设置为深色主题
        return "深色主题"
    }
})
```

## 十一、关闭窗口时隐藏到系统托盘

main.js

```js
import { app, BrowserWindow, ipcMain, nativeTheme, Menu, shell, Tray } from "electron"
import os from "os"
import url from 'url'
import path from 'path'

let __filename = url.fileURLToPath(import.meta.url)
let __dirname = path.dirname(__filename)

// console.log(os.version());
// console.log("中文测试");

//创建菜单
const createMenu = () => {
    //基础模板
    let template = [
        {
            label: '工具(T)',
            submenu: [
                {
                    label: '刷新',
                    accelerator: 'F5',
                    click: (item, focuseWindow) => {
                        if (focuseWindow) {
                            focuseWindow.reload()
                        }
                    }
                },
                {
                    label: '切换开发者工具',
                    accelerator: 'F12',
                    click: (item, focuseWindow) => {
                        if (focuseWindow) {
                            focuseWindow.webContents.toggleDevTools()
                        }
                    }
                }
            ]
        },
        {
            label: '帮助(H)',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        shell.openExternal('https://dengruicode.com') //打开外部链接
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

//创建窗口
let mainWindow = null
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1300, //设置窗口宽度(单位:像素)
        height: 750, //设置窗口高度
        icon: "resource/images/code.ico", //设置窗口图标
        // autoHideMenuBar: true, //隐藏菜单栏
        // resizable: false, //禁止调整窗口大小
        x: 0, //x表示窗口左上角的水平坐标(单位:像素)
        y: 0, //y表示窗口左上角的垂直坐标

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.resolve(__dirname, "resource/preload/preload.mjs"), //预加载脚本
        }
    })

    // mainWindow.loadURL("https://www.dengruicode.com") //加载指定的 url
    mainWindow.loadFile("resource/renderer/views/index.html") //加载指定的 html 文件

    //当尝试打开新窗口时, 阻止默认行为, 在当前窗口加载 url
    mainWindow.webContents.setWindowOpenHandler(details => {
        mainWindow.loadURL(details.url)
        return { action: 'deny' } //阻止默认行为
    })

    mainWindow.on('close', (e) => {
        e.preventDefault()
        mainWindow.hide()
    })

    //监听窗口完全关闭事件 [当窗口被完全关闭并从内存中移除时, closed 事件会被触发]
    mainWindow.on("closed", () => {
        mainWindow = null //避免内存泄漏、防止未知错误
    })
}

//创建托盘
const createTray = () => {
    const icon = "resource/images/code.ico" //托盘图标
    let template = [
        {
            label: '关于',
            click: () => {
                shell.openExternal('https://dengruicode.com') //打开外部链接
            }
        },
        {
            label: '打开',
            click: () => {
                mainWindow.show()
            }
        },
        {
            label: '退出',
            click: () => {
                mainWindow.destroy()
                app.quit()
            }
        }
    ]

    const menu = Menu.buildFromTemplate(template) //根据模板构建菜单
    const tray = new Tray(icon)
    tray.setContextMenu(menu) //设置菜单
}

//当应用准备就绪后创建窗口
app.whenReady().then(() => {
    createMenu()
    createWindow()
    createTray()
})

//定义了一个处理函数, 用于响应名为 sendDataToMain 的异步调用
//当渲染进程通过 sendDataToMain 发起调用时, 处理函数会被触发
ipcMain.handle("sendDataToMain", (e, data) => {
    console.log(data)

    return data
})

//切换主题
ipcMain.handle("toggleTheme", () => {
    if (nativeTheme.shouldUseDarkColors) { //如果系统为深色主题时
        nativeTheme.themeSource = 'light' //设置为浅色主题
        return "浅色主题"
    } else {
        nativeTheme.themeSource = 'dark' //设置为深色主题
        return "深色主题"
    }
})
```

## 十二、对话框

main.js

```js
import { app, BrowserWindow, ipcMain, nativeTheme, Menu, shell, Tray, dialog } from "electron"
import os from "os"
import url from 'url'
import path from 'path'

let __filename = url.fileURLToPath(import.meta.url)
let __dirname = path.dirname(__filename)

// console.log(os.version());
// console.log("中文测试");

//创建菜单
const createMenu = () => {
    //基础模板
    let template = [
        {
            label: '工具(T)',
            submenu: [
                {
                    label: '刷新',
                    accelerator: 'F5',
                    click: (item, focuseWindow) => {
                        if (focuseWindow) {
                            focuseWindow.reload()
                        }
                    }
                },
                {
                    label: '切换开发者工具',
                    accelerator: 'F12',
                    click: (item, focuseWindow) => {
                        if (focuseWindow) {
                            focuseWindow.webContents.toggleDevTools()
                        }
                    }
                }
            ]
        },
        {
            label: '帮助(H)',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        shell.openExternal('https://dengruicode.com') //打开外部链接
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

//创建窗口
let mainWindow = null
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1300, //设置窗口宽度(单位:像素)
        height: 750, //设置窗口高度
        icon: "resource/images/code.ico", //设置窗口图标
        // autoHideMenuBar: true, //隐藏菜单栏
        // resizable: false, //禁止调整窗口大小
        x: 0, //x表示窗口左上角的水平坐标(单位:像素)
        y: 0, //y表示窗口左上角的垂直坐标

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.resolve(__dirname, "resource/preload/preload.mjs"), //预加载脚本
        }
    })

    // mainWindow.loadURL("https://www.dengruicode.com") //加载指定的 url
    mainWindow.loadFile("resource/renderer/views/index.html") //加载指定的 html 文件

    //当尝试打开新窗口时, 阻止默认行为, 在当前窗口加载 url
    mainWindow.webContents.setWindowOpenHandler(details => {
        mainWindow.loadURL(details.url)
        return { action: 'deny' } //阻止默认行为
    })

    mainWindow.on('close', (e) => {
        e.preventDefault()
        mainWindow.hide()
    })

    //监听窗口完全关闭事件 [当窗口被完全关闭并从内存中移除时, closed 事件会被触发]
    mainWindow.on("closed", () => {
        mainWindow = null //避免内存泄漏、防止未知错误
    })
}

//创建托盘
const createTray = () => {
    const icon = "resource/images/code.ico" //托盘图标
    let template = [
        {
            label: '关于',
            click: () => {
                shell.openExternal('https://dengruicode.com') //打开外部链接
            }
        },
        {
            label: '打开',
            click: () => {
                mainWindow.show()
            }
        },
        {
            label: '退出',
            click: () => {
                mainWindow.destroy()
                app.quit()
            }
        }
    ]

    const menu = Menu.buildFromTemplate(template) //根据模板构建菜单
    const tray = new Tray(icon)
    tray.setContextMenu(menu) //设置菜单
}

//弹出消息框
const openMsg = () => {
    dialog.showMessageBox({
        type: "error", //info, error, warning
        icon: "resource/images/code.ico", //自定义图标
        title: "邓瑞编程",
        message: "dengruicode.com",
        // detail: "网站"
    })
}

//弹出确认框
const openConfirm = async () => {
    const result = await dialog.showMessageBox({
        type: "warning", //info, error, warning
        icon: "resource/images/code.ico", //自定义图标
        title: "邓瑞编程",
        message: "确认删除?",
        detail: "该记录删除后无法恢复~",
        buttons: ["确认", "取消"]
    })

    //console.log(result)

    if (result.response === 0) {
        console.log("确认")
    } else {
        console.log("取消")
    }
}

//当应用准备就绪后创建窗口
app.whenReady().then(() => {
    createMenu()
    createWindow()
    createTray()
    // openMsg()
    // openConfirm()
})

//定义了一个处理函数, 用于响应名为 sendDataToMain 的异步调用
//当渲染进程通过 sendDataToMain 发起调用时, 处理函数会被触发
ipcMain.handle("sendDataToMain", (e, data) => {
    console.log(data)

    return data
})

//切换主题
ipcMain.handle("toggleTheme", () => {
    if (nativeTheme.shouldUseDarkColors) { //如果系统为深色主题时
        nativeTheme.themeSource = 'light' //设置为浅色主题
        return "浅色主题"
    } else {
        nativeTheme.themeSource = 'dark' //设置为深色主题
        return "深色主题"
    }
})

//选择文件
ipcMain.handle("selectFile", async () => {
    const result = await dialog.showOpenDialog({
        icon: "resource/images/code.ico", //自定义图标
        title: "打开",
        //properties: ["multiSelections"] //允许多选
    })

    //console.log(result)

    if (!result.canceled) { //如果用户没有点击取消
        return result.filePaths
    } else {
        return null
    }
})
```

resource\renderer\js\index.js

```js
// console.log("index.js");
// console.log("index.js", window)

// DRAPI.sendDataToMain("dengruicode.com").then(data => {
//     console.log("data:", data)
// }).catch(err => {
//     console.log("err:", err)
// })

// //切换主题
// document.querySelector('#toggleTheme').addEventListener('click', async () => {
//     let theme = await DRAPI.toggleTheme()
//     console.log(theme)
// })

DRAPI.invokeWithData("sendDataToMain", "dengruicode.com").then(data => {
    console.log("data:", data)
}).catch(err => {
    console.log("err:", err)
})

document.querySelector('#toggleTheme').addEventListener('click', async () => {
    //let theme = await DRAPI.toggleTheme()
    let theme = await DRAPI.invoke("toggleTheme")
    console.log(theme)
})

//选择文件
document.querySelector('#selectFile').addEventListener('click', async () => {
    let result = await DRAPI.invoke("selectFile")
    console.log(result)

    if (result) {
        document.querySelector("#selectedFile").value = result
    }
})
```

resource\renderer\views\index.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'">
  <title>客户端测试</title>
  <link rel="stylesheet" href="../css/base.css">
</head>

<body>
  dengruicode.com

  <button id="toggleTheme">切换主题</button>

  <button id="selectFile">选择文件</button> <br>
  <textarea id="selectedFile" style="width: 600px;height: 120px;"></textarea>

  <script src="../js/index.js"></script>
</body>

</html>
```

## 十三、打开新窗口

main.js

```js
import { app, BrowserWindow, ipcMain, nativeTheme, Menu, shell, Tray, dialog } from "electron"
import os from "os"
import url from 'url'
import path from 'path'

let __filename = url.fileURLToPath(import.meta.url)
let __dirname = path.dirname(__filename)

// console.log(os.version());
// console.log("中文测试");

//创建菜单
const createMenu = () => {
    //基础模板
    let template = [
        {
            label: '工具(T)',
            submenu: [
                {
                    label: '刷新',
                    accelerator: 'F5',
                    click: (item, focuseWindow) => {
                        if (focuseWindow) {
                            focuseWindow.reload()
                        }
                    }
                },
                {
                    label: '切换开发者工具',
                    accelerator: 'F12',
                    click: (item, focuseWindow) => {
                        if (focuseWindow) {
                            focuseWindow.webContents.toggleDevTools()
                        }
                    }
                }
            ]
        },
        {
            label: '帮助(H)',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        shell.openExternal('https://dengruicode.com') //打开外部链接
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

//创建窗口
let mainWindow = null
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1300, //设置窗口宽度(单位:像素)
        height: 750, //设置窗口高度
        icon: "resource/images/code.ico", //设置窗口图标
        // autoHideMenuBar: true, //隐藏菜单栏
        // resizable: false, //禁止调整窗口大小
        x: 0, //x表示窗口左上角的水平坐标(单位:像素)
        y: 0, //y表示窗口左上角的垂直坐标

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.resolve(__dirname, "resource/preload/preload.mjs"), //预加载脚本
        }
    })

    // mainWindow.loadURL("https://www.dengruicode.com") //加载指定的 url
    mainWindow.loadFile("resource/renderer/views/index.html") //加载指定的 html 文件

    //当尝试打开新窗口时, 阻止默认行为, 在当前窗口加载 url
    mainWindow.webContents.setWindowOpenHandler(details => {
        mainWindow.loadURL(details.url)
        return { action: 'deny' } //阻止默认行为
    })

    mainWindow.on('close', (e) => {
        e.preventDefault()
        mainWindow.hide()
    })

    //监听窗口完全关闭事件 [当窗口被完全关闭并从内存中移除时, closed 事件会被触发]
    mainWindow.on("closed", () => {
        mainWindow = null //避免内存泄漏、防止未知错误
    })
}

//创建托盘
const createTray = () => {
    const icon = "resource/images/code.ico" //托盘图标
    let template = [
        {
            label: '关于',
            click: () => {
                shell.openExternal('https://dengruicode.com') //打开外部链接
            }
        },
        {
            label: '打开',
            click: () => {
                mainWindow.show()
            }
        },
        {
            label: '退出',
            click: () => {
                mainWindow.destroy()
                app.quit()
            }
        }
    ]

    const menu = Menu.buildFromTemplate(template) //根据模板构建菜单
    const tray = new Tray(icon)
    tray.setContextMenu(menu) //设置菜单
}

//弹出消息框
const openMsg = () => {
    dialog.showMessageBox({
        type: "error", //info, error, warning
        icon: "resource/images/code.ico", //自定义图标
        title: "邓瑞编程",
        message: "dengruicode.com",
        // detail: "网站"
    })
}

//弹出确认框
const openConfirm = async () => {
    const result = await dialog.showMessageBox({
        type: "warning", //info, error, warning
        icon: "resource/images/code.ico", //自定义图标
        title: "邓瑞编程",
        message: "确认删除?",
        detail: "该记录删除后无法恢复~",
        buttons: ["确认", "取消"]
    })

    //console.log(result)

    if (result.response === 0) {
        console.log("确认")
    } else {
        console.log("取消")
    }
}

//当应用准备就绪后创建窗口
app.whenReady().then(() => {
    createMenu()
    createWindow()
    createTray()
    // openMsg()
    // openConfirm()
})

//定义了一个处理函数, 用于响应名为 sendDataToMain 的异步调用
//当渲染进程通过 sendDataToMain 发起调用时, 处理函数会被触发
ipcMain.handle("sendDataToMain", (e, data) => {
    console.log(data)

    return data
})

//切换主题
ipcMain.handle("toggleTheme", () => {
    if (nativeTheme.shouldUseDarkColors) { //如果系统为深色主题时
        nativeTheme.themeSource = 'light' //设置为浅色主题
        return "浅色主题"
    } else {
        nativeTheme.themeSource = 'dark' //设置为深色主题
        return "深色主题"
    }
})

//选择文件
ipcMain.handle("selectFile", async () => {
    const result = await dialog.showOpenDialog({
        icon: "resource/images/code.ico", //自定义图标
        title: "打开",
        //properties: ["multiSelections"] //允许多选
    })

    //console.log(result)

    if (!result.canceled) { //如果用户没有点击取消
        return result.filePaths
    } else {
        return null
    }
})

//打开网站
ipcMain.handle("openWeb", e => {
    //从事件发送者 e.sender 获取获取到 父窗口(触发此事件的浏览器窗口) 的实例
    const parentWindow = BrowserWindow.fromWebContents(e.sender)

    const childWindow = new BrowserWindow({ //子窗口
        width: 400, //设置窗口宽度(单位:像素)
        height: 690, //设置窗口高度
        icon: "resource/images/code.ico", //设置窗口图标
        autoHideMenuBar: true, //隐藏菜单栏
        //resizable: false, //禁止调整窗口大小
        x: 700, //x表示窗口左上角的水平坐标(单位:像素)
        y: 100, //y表示窗口左上角的垂直坐标
        parent:parentWindow, //指定当前窗口的父窗口(当前窗口会在父窗口之上显示)
        modal:true //作为一个模态窗口打开, 模态窗口会阻止用户与父窗进行交互
    })

    childWindow.loadURL("https://dengruicode.com") //加载指定的 url

    //当尝试打开新窗口时, 阻止默认行为, 在当前窗口加载 url
    childWindow.webContents.setWindowOpenHandler(details => {
        childWindow.loadURL(details.url)
        return { action: 'deny' } //阻止默认行为
    })
})
```

resource\renderer\js\index.js

```js
// console.log("index.js");
// console.log("index.js", window)

// DRAPI.sendDataToMain("dengruicode.com").then(data => {
//     console.log("data:", data)
// }).catch(err => {
//     console.log("err:", err)
// })

// //切换主题
// document.querySelector('#toggleTheme').addEventListener('click', async () => {
//     let theme = await DRAPI.toggleTheme()
//     console.log(theme)
// })

DRAPI.invokeWithData("sendDataToMain", "dengruicode.com").then(data => {
    console.log("data:", data)
}).catch(err => {
    console.log("err:", err)
})

document.querySelector('#toggleTheme').addEventListener('click', async () => {
    //let theme = await DRAPI.toggleTheme()
    let theme = await DRAPI.invoke("toggleTheme")
    console.log(theme)
})

//选择文件
document.querySelector('#selectFile').addEventListener('click', async () => {
    let result = await DRAPI.invoke("selectFile")
    console.log(result)

    if (result) {
        document.querySelector("#selectedFile").value = result
    }
})

//打开网站
document.querySelector('#openWeb').addEventListener('click', () => {
    DRAPI.invoke("openWeb")
})
```

resource\renderer\views\index.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'">
  <title>客户端测试</title>
  <link rel="stylesheet" href="../css/base.css">
</head>

<body>
  dengruicode.com

  <button id="openWeb">打开网站</button>

  <button id="toggleTheme">切换主题</button>

  <button id="selectFile">选择文件</button> <br>
  <textarea id="selectedFile" style="width: 600px;height: 120px;"></textarea>

  <script src="../js/index.js"></script>
</body>

</html>
```

## 十四、发送通知

main.js

```js
import { app, BrowserWindow, ipcMain, nativeTheme, Menu, shell, Tray, dialog, Notification } from "electron"
import os from "os"
import url from 'url'
import path from 'path'

let __filename = url.fileURLToPath(import.meta.url)
let __dirname = path.dirname(__filename)

// console.log(os.version());
// console.log("中文测试");

//创建菜单
const createMenu = () => {
    //基础模板
    let template = [
        {
            label: '工具(T)',
            submenu: [
                {
                    label: '刷新',
                    accelerator: 'F5',
                    click: (item, focuseWindow) => {
                        if (focuseWindow) {
                            focuseWindow.reload()
                        }
                    }
                },
                {
                    label: '切换开发者工具',
                    accelerator: 'F12',
                    click: (item, focuseWindow) => {
                        if (focuseWindow) {
                            focuseWindow.webContents.toggleDevTools()
                        }
                    }
                }
            ]
        },
        {
            label: '帮助(H)',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        shell.openExternal('https://dengruicode.com') //打开外部链接
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

//创建窗口
let mainWindow = null
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1300, //设置窗口宽度(单位:像素)
        height: 750, //设置窗口高度
        icon: "resource/images/code.ico", //设置窗口图标
        // autoHideMenuBar: true, //隐藏菜单栏
        // resizable: false, //禁止调整窗口大小
        x: 0, //x表示窗口左上角的水平坐标(单位:像素)
        y: 0, //y表示窗口左上角的垂直坐标

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.resolve(__dirname, "resource/preload/preload.mjs"), //预加载脚本
        }
    })

    // mainWindow.loadURL("https://www.dengruicode.com") //加载指定的 url
    mainWindow.loadFile("resource/renderer/views/index.html") //加载指定的 html 文件

    //当尝试打开新窗口时, 阻止默认行为, 在当前窗口加载 url
    mainWindow.webContents.setWindowOpenHandler(details => {
        mainWindow.loadURL(details.url)
        return { action: 'deny' } //阻止默认行为
    })

    mainWindow.on('close', (e) => {
        e.preventDefault()
        mainWindow.hide()
    })

    //监听窗口完全关闭事件 [当窗口被完全关闭并从内存中移除时, closed 事件会被触发]
    mainWindow.on("closed", () => {
        mainWindow = null //避免内存泄漏、防止未知错误
    })
}

//创建托盘
const createTray = () => {
    const icon = "resource/images/code.ico" //托盘图标
    let template = [
        {
            label: '关于',
            click: () => {
                shell.openExternal('https://dengruicode.com') //打开外部链接
            }
        },
        {
            label: '打开',
            click: () => {
                mainWindow.show()
            }
        },
        {
            label: '退出',
            click: () => {
                mainWindow.destroy()
                app.quit()
            }
        }
    ]

    const menu = Menu.buildFromTemplate(template) //根据模板构建菜单
    const tray = new Tray(icon)
    tray.setContextMenu(menu) //设置菜单
}

//弹出消息框
const openMsg = () => {
    dialog.showMessageBox({
        type: "error", //info, error, warning
        icon: "resource/images/code.ico", //自定义图标
        title: "邓瑞编程",
        message: "dengruicode.com",
        // detail: "网站"
    })
}

//弹出确认框
const openConfirm = async () => {
    const result = await dialog.showMessageBox({
        type: "warning", //info, error, warning
        icon: "resource/images/code.ico", //自定义图标
        title: "邓瑞编程",
        message: "确认删除?",
        detail: "该记录删除后无法恢复~",
        buttons: ["确认", "取消"]
    })

    //console.log(result)

    if (result.response === 0) {
        console.log("确认")
    } else {
        console.log("取消")
    }
}

//当应用准备就绪后创建窗口
app.whenReady().then(() => {
    createMenu()
    createWindow()
    createTray()
    // openMsg()
    // openConfirm()
})

//定义了一个处理函数, 用于响应名为 sendDataToMain 的异步调用
//当渲染进程通过 sendDataToMain 发起调用时, 处理函数会被触发
ipcMain.handle("sendDataToMain", (e, data) => {
    console.log(data)

    return data
})

//切换主题
ipcMain.handle("toggleTheme", () => {
    if (nativeTheme.shouldUseDarkColors) { //如果系统为深色主题时
        nativeTheme.themeSource = 'light' //设置为浅色主题
        return "浅色主题"
    } else {
        nativeTheme.themeSource = 'dark' //设置为深色主题
        return "深色主题"
    }
})

//选择文件
ipcMain.handle("selectFile", async () => {
    const result = await dialog.showOpenDialog({
        icon: "resource/images/code.ico", //自定义图标
        title: "打开",
        //properties: ["multiSelections"] //允许多选
    })

    //console.log(result)

    if (!result.canceled) { //如果用户没有点击取消
        return result.filePaths
    } else {
        return null
    }
})

//打开网站
ipcMain.handle("openWeb", e => {
    //从事件发送者 e.sender 获取获取到 父窗口(触发此事件的浏览器窗口) 的实例
    const parentWindow = BrowserWindow.fromWebContents(e.sender)

    const childWindow = new BrowserWindow({ //子窗口
        width: 400, //设置窗口宽度(单位:像素)
        height: 690, //设置窗口高度
        icon: "resource/images/code.ico", //设置窗口图标
        autoHideMenuBar: true, //隐藏菜单栏
        //resizable: false, //禁止调整窗口大小
        x: 700, //x表示窗口左上角的水平坐标(单位:像素)
        y: 100, //y表示窗口左上角的垂直坐标
        parent: parentWindow, //指定当前窗口的父窗口(当前窗口会在父窗口之上显示)
        modal: true //作为一个模态窗口打开, 模态窗口会阻止用户与父窗进行交互
    })

    childWindow.loadURL("https://dengruicode.com") //加载指定的 url

    //当尝试打开新窗口时, 阻止默认行为, 在当前窗口加载 url
    childWindow.webContents.setWindowOpenHandler(details => {
        childWindow.loadURL(details.url)
        return { action: 'deny' } //阻止默认行为
    })
})

//发送通知
ipcMain.handle("sendNotify", async () => {
    const notify = new Notification({
        icon: "resource/images/code.ico", //自定义图标
        title: "邓瑞编程",
        body: "dengruicode.com"
    })

    notify.show()
})
```

resource\renderer\js\index.js

```js
// console.log("index.js");
// console.log("index.js", window)

// DRAPI.sendDataToMain("dengruicode.com").then(data => {
//     console.log("data:", data)
// }).catch(err => {
//     console.log("err:", err)
// })

// //切换主题
// document.querySelector('#toggleTheme').addEventListener('click', async () => {
//     let theme = await DRAPI.toggleTheme()
//     console.log(theme)
// })

DRAPI.invokeWithData("sendDataToMain", "dengruicode.com").then(data => {
    console.log("data:", data)
}).catch(err => {
    console.log("err:", err)
})

document.querySelector('#toggleTheme').addEventListener('click', async () => {
    //let theme = await DRAPI.toggleTheme()
    let theme = await DRAPI.invoke("toggleTheme")
    console.log(theme)
})

//选择文件
document.querySelector('#selectFile').addEventListener('click', async () => {
    let result = await DRAPI.invoke("selectFile")
    console.log(result)

    if (result) {
        document.querySelector("#selectedFile").value = result
    }
})

//打开网站
document.querySelector('#openWeb').addEventListener('click', () => {
    DRAPI.invoke("openWeb")
})

//发送通知
document.querySelector('#sendNotify').addEventListener('click', () => {
    DRAPI.invoke("sendNotify")
})

```

resource\renderer\views\index.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'">
  <title>客户端测试</title>
  <link rel="stylesheet" href="../css/base.css">
</head>

<body>
  dengruicode.com

  <button id="openWeb">打开网站</button>

  <button id="sendNotify">发送通知</button>

  <button id="toggleTheme">切换主题</button>

  <button id="selectFile">选择文件</button> <br>
  <textarea id="selectedFile" style="width: 600px;height: 120px;"></textarea>

  <script src="../js/index.js"></script>
</body>

</html>
```

## 十五、应用打包和解决图标丢失问题

安装 electron-builder

```shell
npm i electron-builder -D
```

配置 .npmrc 文件

```shell
registry=https://registry.npmmirror.com/
electron_mirror=https://npmmirror.com/mirrors/electron/
electron_builder_binaries_mirror=https://registry.npmmirror.com/-/binary/electron-builder-binaries/
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
    "pack": "electron-builder --dir",
    "build": "electron-builder"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "electron": "^38.2.1",
    "electron-builder": "^26.0.12"
  }
}
```

应用打包：构建包含应用程序的文件夹(免安装软件)

```shell
npm run pack
```

构建应用程序

 ```shell
 npm run build
 ```

> 注意：
> 若运行 npm run pack 或 npm run build 时报错如下:
> cannot execute cause=exit status
> 解决方法:
> 以管理员身份运行 powershell

解决打包后安装的软件 "系统托盘" 和 "通知" 图标丢失问题

系统托盘图标

```js
//const icon = "resource/images/code.ico" //托盘图标
const icon = path.resolve(__dirname,"resource/images/code.ico")
```

发送通知图标

```js
//icon:"resource/images/code.ico", //自定义图标
icon:path.resolve(__dirname,"resource/images/code.ico"),
```

## 十六、自定义打包配置

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
    "pack": "electron-builder --dir",
    "build": "electron-builder"
  },
  "build": {
    "productName": "客户端",
    "appId": "vdiclient",
    "win": {
      "icon": "resource/images/code.ico",
      "target": [
        {
          "target": "nsis",
          "arch": [
            "x64"
          ]
        }
      ]
    },
    "nsis": {
      "oneClick": false,
      "perMachine": true,
      "allowToChangeInstallationDirectory": true
    }
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "electron": "^38.2.1",
    "electron-builder": "^26.0.12"
  }
}
```

运行npm run build如果报图标错误， code.ico 像素至少 256x256
