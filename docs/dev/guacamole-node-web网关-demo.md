## guacamole-node-web网关-demo

需要搭配guacamole服务端使用

这个项目通过guacamole-lite连接到guacd服务，guacd连接到目标RDP服务器

### 一、项目结构

```bash
[root@localhost opendesk-mvp-bak-h13]# tree -L 2
.
├── certs
│   ├── cert.pem
│   └── key.pem
├── index.html
├── node_modules
│   ├── anymatch
│   ├── balanced-match
│   ├── binary-extensions
│   ├── brace-expansion
│   ├── braces
│   ├── chokidar
│   ├── debug
│   ├── deep-extend
│   ├── fill-range
│   ├── glob-parent
│   ├── guacamole-common-js
│   ├── guacamole-lite
│   ├── has-flag
│   ├── ignore-by-default
│   ├── is-binary-path
│   ├── is-extglob
│   ├── is-glob
│   ├── is-number
│   ├── minimatch
│   ├── ms
│   ├── nodemon
│   ├── normalize-path
│   ├── picomatch
│   ├── pstree.remy
│   ├── readdirp
│   ├── semver
│   ├── simple-update-notifier
│   ├── supports-color
│   ├── to-regex-range
│   ├── touch
│   ├── undefsafe
│   └── ws
├── package.json
├── package-lock.json
├── rdp.html
└── server.js
```

### 二、安装包依赖

package.json

```json
{
  "name": "guacamole",
  "version": "1.0.0",
  "description": "Guacamole远程桌面网关服务器",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "guacamole",
    "rdp",
    "remote-desktop",
    "websocket"
  ],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "guacamole-common-js": "^1.5.0",
    "guacamole-lite": "^1.2.0",
    "nodemon": "^3.1.14"
  }
}
```

### 三、启动文件

server.js

```js
/**
 * Guacamole远程桌面网关服务器
 * 
 * 该服务器实现了以下核心功能：
 * 1. HTTP服务器：提供静态文件服务和API接口
 * 2. Token生成：为客户端生成加密的连接令牌
 * 3. WebSocket代理：通过guacamole-lite连接到guacd服务
 * 
 * 技术栈：
 * - Node.js HTTP模块：处理HTTP请求
 * - guacamole-lite：WebSocket到guacd的代理层
 * - AES-256-CBC：令牌加密算法
 * 
 * 使用流程：
 * 1. 客户端访问首页获取HTML页面
 * 2. 客户端调用/api/token获取加密令牌
 * 3. 客户端使用令牌通过WebSocket连接到/guacamole/路径
 * 4. guacamole-lite将WebSocket流量转发到guacd服务
 * 5. guacd连接到目标RDP服务器
 */

// 导入Node.js内置模块（ESM语法）
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// 导入第三方模块（ESM语法）
import GuacamoleLite from 'guacamole-lite';

// 获取当前文件路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// SSL证书配置
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem'))
};

/**
 * 加密密钥（用于Token加密）
 * 注意：生产环境中应使用环境变量存储此密钥，不要硬编码！
 * 密钥长度必须为32字节（256位）以支持AES-256-CBC
 */
const SECRET_KEY = 'MySuperSecretKeyForParamsToken12';

/**
 * 会话存储（内存中）
 * key: sessionId
 * value: { userId, expiresAt }
 */
const sessions = new Map();

/**
 * 会话有效期（毫秒）- 30分钟
 */
const SESSION_EXPIRE_TIME = 30 * 60 * 1000;

/**
 * 生成会话ID
 * @returns {string} - 随机会话ID
 */
function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * 解析Cookie
 * @param {string} cookieHeader - Cookie头
 * @returns {Object} - 解析后的Cookie对象
 */
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    cookies[name] = value;
  });
  return cookies;
}

/**
 * 验证会话
 * @param {string} sessionId - 会话ID
 * @returns {boolean} - 是否有效
 */
function validateSession(sessionId) {
  if (!sessionId) return false;

  const session = sessions.get(sessionId);
  if (!session) return false;

  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return false;
  }

  session.expiresAt = Date.now() + SESSION_EXPIRE_TIME;
  return true;
}

/**
 * 加密Token函数
 * 
 * 使用AES-256-CBC算法对连接配置进行加密
 * 生成的Token包含初始化向量(IV)和加密后的连接参数
 * 
 * @param {Object} value - 需要加密的连接配置对象
 * @returns {string} - 加密后的Base64编码Token
 */
function encryptToken(value) {
  // 生成16字节的随机初始化向量(IV)
  // IV用于确保相同的明文每次加密都产生不同的密文
  const iv = crypto.randomBytes(16);

  // 创建AES-256-CBC加密器
  // 参数：算法名称、密钥（转换为Buffer）、初始化向量
  const cipher = crypto.createCipheriv(
    'AES-256-CBC',
    Buffer.from(SECRET_KEY),
    iv
  );

  // 将连接配置对象序列化为JSON字符串，然后加密
  // update方法返回Base64编码的部分密文
  let encrypted = cipher.update(JSON.stringify(value), 'utf8', 'base64');

  // final方法完成加密并返回剩余的密文
  encrypted += cipher.final('base64');

  // 组合IV和加密值，序列化为JSON后再进行Base64编码
  // 这样客户端可以解析出IV用于解密
  const data = {
    iv: iv.toString('base64'),    // IV转换为Base64字符串
    value: encrypted              // 加密后的连接参数
  };

  // 返回最终的Token字符串
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

/**
 * 创建HTTP服务器
 * 
 * 处理以下路由：
 * - GET /               : 返回index.html首页
 * - GET /guacamole-common-js/guacamole.min.js : 返回Guacamole客户端库
 * - POST /api/token     : 返回加密的连接Token
 * - OPTIONS *           : 处理CORS预检请求
 */
const server = https.createServer(sslOptions, (req, res) => {
  // 设置CORS响应头，允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理CORS预检请求（OPTIONS方法）
  // 浏览器在发送实际请求前会先发送OPTIONS请求检查服务器是否允许跨域
  if (req.method === 'OPTIONS') {
    res.writeHead(200);  // 返回200状态码表示允许跨域
    res.end();           // 结束响应
    return;              // 提前返回，不处理后续逻辑
  }

  // 路由：首页
  if (req.url === '/') {
    // 读取index.html文件
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        // 文件读取失败，返回500错误
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        // 文件读取成功，返回HTML内容
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }

  // 路由：Guacamole客户端JavaScript库
  else if (req.url === '/guacamole-common-js/guacamole.min.js') {
    // 构建guacamole-common-js库的路径
    const guacamoleJSPath = path.join(
      __dirname,
      'node_modules',
      'guacamole-common-js',
      'dist',
      'cjs',
      'guacamole-common.min.js'
    );

    fs.readFile(guacamoleJSPath, (err, data) => {
      if (err) {
        // 文件不存在，返回404错误
        res.writeHead(404);
        res.end('Not found');
      } else {
        // 返回JavaScript文件
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
      }
    });
  }

  // 路由：RDP页面（需要认证）
  else if (req.url === '/rdp') {
    const cookies = parseCookies(req.headers.cookie);
    if (!validateSession(cookies.sessionId)) {
      res.writeHead(302, { 'Location': '/' });
      res.end();
      return;
    }

    fs.readFile(path.join(__dirname, 'rdp.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading rdp.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }

  // 路由：登录API
  else if (req.url === '/api/login') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body);

        if (username === 'admin' && password === 'abc@2020') {
          const sessionId = generateSessionId();
          sessions.set(sessionId, {
            userId: username,
            expiresAt: Date.now() + SESSION_EXPIRE_TIME
          });

          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': `sessionId=${sessionId}; HttpOnly; SameSite=Strict; Path=/`
          });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false }));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false }));
      }
    });
  }

  // 路由：Token生成API（需要认证）
  else if (req.url.startsWith('/api/token')) {
    const cookies = parseCookies(req.headers.cookie);
    if (!validateSession(cookies.sessionId)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    const params = new URLSearchParams(req.url.split('?')[1]);
    // const width = params.get('width') || 1920;
    // const height = params.get('height') || 1080;
    const width = params.get('width');
    const height = params.get('height');

    const tokenObj = {
      connection: {
        type: "rdp",
        settings: {
          "hostname": "192.168.1.120",
          "port": "3389",
          "username": "administrator",
          "password": "123456",
          "security": "any",
          "ignore-cert": true,
          "width": width,
          "height": height,
          "color-depth": 32,
          // "dpi": 96,
          // "glyph-caching": true,
          // "jpeg-quality": 90,
          "enable-gfx": true,
          // "enable-offscreen-cache": false,
          // "disable-glyph-caching": true,
          // "disable-offscreen-caching": true,
          // "disable-bitmap-caching": true,
          // "force-lossless": true,
          "resize-method": "display-update",
          // "enable-display-update": true,
          "disable-copy": false,
          "disable-paste": false,
          "clipboard-encoding": "utf-8",
          "enable-wallpaper": true,
          "enable-font-smoothing": true,
          "enable-full-window-drag": false,
          "enable-desktop-composition": true,
          "enable-theming": true,
          "enable-audio": true,
          "enable-printing": false,
          "enable-drive": false,
          "enable-smartcard": false,
          "enable-usb": false,
          "enable-printer": false,
          "enable-comport": true,
          "enable-clipboard": true,
          "redirect-clipboard": true,
          "redirect-drives": true,
          "redirect-printers": true,
          "redirect-smartcards": true,
          "redirect-usb": true,
          "rdpdr-drive": true
        }
      }
    };

    const token = encryptToken(tokenObj);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ token }));
  }

  else {
    res.writeHead(404);
    res.end('Not found');
  }
});

/**
 * WebSocket服务器配置
 * 
 * guacamole-lite需要将WebSocket服务器附加到HTTP服务器上
 */
const websocketOptions = {
  server: server,           // 绑定到上面创建的HTTP服务器
  path: '/guacamole/'       // WebSocket连接路径
};

/**
 * guacd服务配置
 * 
 * guacd是Guacamole的守护进程，负责处理远程桌面协议
 * 需要确保guacd服务正在运行
 */
const guacdOptions = {
  host: '127.0.0.1',       // guacd服务地址（本地）
  port: 4822               // guacd默认端口
};

/**
 * 客户端配置
 * 
 * 配置Token解密所需的加密参数
 */
const clientOptions = {
  crypt: {
    cypher: 'AES-256-CBC', // 加密算法，必须与encryptToken函数一致
    key: SECRET_KEY         // 解密密钥，必须与加密时使用的密钥一致
  }
};

/**
 * 创建GuacamoleLite实例
 * 
 * guacamole-lite充当WebSocket和guacd之间的代理：
 * 1. 接收客户端WebSocket连接
 * 2. 解析客户端发送的Token获取连接配置
 * 3. 建立到guacd的TCP连接
 * 4. 在WebSocket和guacd之间转发数据
 */
const guacServer = new GuacamoleLite(
  websocketOptions,
  guacdOptions,
  clientOptions
);

/**
 * 监听连接事件
 * 
 * 当有新的客户端连接时触发
 * @param {Object} clientConnection - 客户端连接对象
 * @param {Object} args - 连接参数（包含Token解析后的信息）
 */
guacServer.on('connection', (clientConnection, args) => {
  console.log('New connection:', args);
});

/**
 * 监听错误事件
 * 
 * 当发生错误时触发（如guacd连接失败、Token验证失败等）
 * @param {Error} error - 错误对象
 */
guacServer.on('error', (error) => {
  console.error('Guacamole error:', error);
});

/**
 * 启动HTTP服务器
 * 
 * 服务器监听443端口
 */
server.listen(443, () => {
  console.log('Server running on https://localhost:443');
});
```

### 四、登陆页面

index.html

```html
<!DOCTYPE html>
<html>
<head>
  <title>Guacamole RDP - Login</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .login-container {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      width: 100%;
      max-width: 400px;
    }
    .login-container h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
      font-size: 24px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #555;
      font-weight: 500;
    }
    .form-group input {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid #ddd;
      border-radius: 6px;
      font-size: 16px;
      transition: border-color 0.3s;
      outline: none;
    }
    .form-group input:focus {
      border-color: #667eea;
    }
    .form-group input::placeholder {
      color: #aaa;
    }
    .btn {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }
    .btn:active {
      transform: translateY(0);
    }
    .error-message {
      display: none;
      background: #f8d7da;
      color: #721c24;
      padding: 10px 15px;
      border-radius: 6px;
      margin-bottom: 20px;
      text-align: center;
    }
    .loading {
      display: none;
      text-align: center;
      color: #667eea;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <h2>OpenDesk RDP Login</h2>
    <div class="error-message" id="error-message">Invalid username or password</div>
    <div class="loading" id="loading">Connecting...</div>
    <form id="login-form">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" placeholder="Enter username" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter password" required>
      </div>
      <button type="submit" class="btn">Login</button>
    </form>
  </div>

  <script>
    document.getElementById('login-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const errorDiv = document.getElementById('error-message');
      const loadingDiv = document.getElementById('loading');
      
      errorDiv.style.display = 'none';
      loadingDiv.style.display = 'block';
      
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
          window.open('/rdp', '_blank', 'noopener,noreferrer');
        } else {
          errorDiv.style.display = 'block';
        }
      } catch (error) {
        console.error('Login error:', error);
        errorDiv.style.display = 'block';
      } finally {
        loadingDiv.style.display = 'none';
      }
    });
  </script>
</body>
</html>
```

五、连接页面

rdp.html

```html
<!DOCTYPE html>
<html>
<head>
  <title>Guacamole RDP - Remote Desktop</title>
 <meta charset="UTF-8">
  <script src="/guacamole-common-js/guacamole.min.js"></script>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    #display {
      width: 100%;
      height: 100%;
    }
    #fullscreen-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      background: rgba(0, 0, 0, 0.4);
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 20px;
      cursor: move;
      z-index: 1000;
      transition: background 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    }
    #fullscreen-btn:hover {
      background: rgba(0, 0, 0, 0.6);
    }
    #fullscreen-btn.dragging {
      cursor: grabbing;
      background: rgba(0, 0, 0, 0.7);
    }
  </style>
</head>
<body>
  <div id="display"></div>
  <textarea id="clipboard-textarea" style="position: fixed; left: -9999px; top: -9999px; width: 1px; height: 1px;"></textarea>
  <button id="fullscreen-btn">⛶</button>
  
  <script>
    let client = null;
    let remoteClipboardText = '';
    let lastLocalClipboard = '';
    let ignoreNextClipboardChange = false;
    let clipboardSyncEnabled = true;

    function isAutoSyncEnabled() {
      return clipboardSyncEnabled;
    }

    async function getToken(width, height) {
      const response = await fetch(`/api/token?width=${width}&height=${height}`);
      const data = await response.json();
      return data.token;
    }

    async function readClipboard() {
      if (document.hidden) {
        return '';
      }
      
      if (navigator.clipboard) {
        try {
          return await navigator.clipboard.readText();
        } catch (err) {
          if (err.name !== 'NotAllowedError') {
          }
        }
      }
      
      const textarea = document.getElementById('clipboard-textarea');
      textarea.value = '';
      textarea.select();
      
      try {
        if (document.execCommand('paste')) {
          return textarea.value;
        }
      } catch (err) {
      }
      
      return '';
    }

    async function writeClipboard(text) {
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch (err) {
        }
      }
      
      const textarea = document.getElementById('clipboard-textarea');
      textarea.value = text;
      textarea.select();
      
      try {
        return document.execCommand('copy');
      } catch (err) {
        console.error('Failed to write clipboard:', err);
        return false;
      }
    }

    async function sendClipboardToRemote(showAlert = true) {
      if (!client) {
        if (showAlert) alert('客户端未初始化');
        return;
      }
      
      const text = await readClipboard();
      if (!text) {
        if (showAlert) alert('剪贴板为空或无法读取');
        return;
      }
      
      if (text === lastLocalClipboard) {
        return;
      }
      
      try {
        var stream = client.createClipboardStream('text/plain');
        var writer = new Guacamole.StringWriter(stream);
        writer.sendText(text);
        writer.sendEnd();
        lastLocalClipboard = text;
        if (showAlert) alert('已发送剪贴板内容到远程桌面');
      } catch (err) {
        if (showAlert) alert('发送失败: ' + err.message);
      }
    }

    async function pasteFromRemote(showAlert = true) {
      if (!remoteClipboardText) {
        if (showAlert) alert('远程剪贴板为空');
        return;
      }
      
      ignoreNextClipboardChange = true;
      if (await writeClipboard(remoteClipboardText)) {
        if (showAlert) alert('已从远程桌面复制内容到本地剪贴板');
      } else {
        if (showAlert) alert('复制失败，请手动复制以下内容:\n\n' + remoteClipboardText);
      }
      setTimeout(() => { ignoreNextClipboardChange = false; }, 500);
    }

    async function connect() {
      try {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        const token = await getToken(width, height);
        const tunnel = new Guacamole.WebSocketTunnel('wss://' + window.location.host + '/guacamole/');
        client = new Guacamole.Client(tunnel);

        client.onerror = function(error) {
        };

        client.onstatechange = function(state) {
        };

        client.onclipboard = function(stream, mimetype) {
          const reader = new Guacamole.StringReader(stream);
          reader.ontext = function(text) {
            remoteClipboardText = text;
            if (isAutoSyncEnabled()) {
              pasteFromRemote(false);
            }
          };
          reader.onend = function() {
          };
        };

        async function checkLocalClipboard() {
          if (!isAutoSyncEnabled()) return;
          if (!client) return;
          
          try {
            const currentText = await readClipboard();
            if (currentText && currentText !== lastLocalClipboard && !ignoreNextClipboardChange) {
              await sendClipboardToRemote(false);
            }
          } catch (err) {
          }
        }

        setInterval(checkLocalClipboard, 1000);

        const displayDiv = document.getElementById('display');
        displayDiv.innerHTML = '';
        displayDiv.appendChild(client.getDisplay().getElement());

        const mouse = new Guacamole.Mouse(client.getDisplay().getElement());
        mouse.onEach(['mousedown', 'mouseup', 'mousemove', 'mousewheel'],
          e => client.sendMouseState(e.state));

        const keyboard = new Guacamole.Keyboard(window);
        keyboard.onkeydown = keysym => client.sendKeyEvent(1, keysym);
        keyboard.onkeyup = keysym => client.sendKeyEvent(0, keysym);

        client.connect('token=' + token);
      } catch (error) {
        console.error('Failed to connect:', error);
        alert('Failed to connect: ' + error.message);
      }
    }

    function toggleFullscreen(e) {
      if (!hasMoved) {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => {
          });
        } else {
          document.exitFullscreen().catch(err => {
          });
        }
      }
      hasMoved = false;
    }

    let isDragging = false;
    let hasMoved = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;
    const dragThreshold = 5;

    const fullscreenBtn = document.getElementById('fullscreen-btn');

    fullscreenBtn.addEventListener('mousedown', function(e) {
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      offsetX = e.clientX - fullscreenBtn.getBoundingClientRect().left;
      offsetY = e.clientY - fullscreenBtn.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      
      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      
      if (dx > dragThreshold || dy > dragThreshold) {
        hasMoved = true;
        fullscreenBtn.classList.add('dragging');
        
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        
        const maxX = window.innerWidth - fullscreenBtn.offsetWidth;
        const maxY = window.innerHeight - fullscreenBtn.offsetHeight;
        
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));
        
        fullscreenBtn.style.left = x + 'px';
        fullscreenBtn.style.top = y + 'px';
        fullscreenBtn.style.right = 'auto';
      }
    });

    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        fullscreenBtn.classList.remove('dragging');
      }
    });

    document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);

    document.addEventListener('fullscreenchange', function() {
      const btn = document.getElementById('fullscreen-btn');
      if (document.fullscreenElement) {
        btn.textContent = '⛶';
      } else {
        btn.textContent = '⛶';
      }
    });

    window.addEventListener('resize', function() {
      if (client) {
        client.disconnect();
      }
      connect();
    });

    connect();
  </script>
</body>
</html>
```

### 五、浏览器登陆

浏览器输入https:// + ip，账户：admin，密码：abc@2020，即可登陆rdp远程，支持Linux和windows

注意：当前demo仅实现声音、粘贴板同步和全屏按钮功能，其他的功能未实现
