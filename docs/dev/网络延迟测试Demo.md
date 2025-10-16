# 网络延迟测试Demo

使用tcp和ws模拟ping 64k数据包测延迟，目的是快速判断网络延迟和带宽

tcp模拟需要单独使用一个端口，集成express项目中没有成功

ws和http共享一个端口，经过测试没有问题，故使用ws模拟延迟测试

## tcp测试网络延迟

- 服务端

```js
import net from 'net';

const PORT = 3000;
const SERVER_PACKET_SIZE = 64*1024;

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    // 收到数据后回发同样大小的数据
    socket.write(data);
  });
});

server.listen(PORT, () => {
  console.log(`TCP Echo Server listening on port ${PORT}`);
});
```

- 客户端

```js
import net from 'net';

const SERVER_IP = '192.168.1.60';
const PORT = 3000;
const PACKET_SIZE = 64*1024;

function testTcpPing(ip, port, packetSize) {
  return new Promise((resolve) => {
    const client = new net.Socket();
    const payload = Buffer.alloc(packetSize, 'A');
    const start = Date.now();

    client.connect(port, ip, () => {
      client.write(payload);
    });

    let receivedBytes = 0;
    client.on('data', (data) => {
      receivedBytes += data.length;
      if (receivedBytes >= packetSize) {
        const latency = Date.now() - start;
        client.destroy();
        resolve(latency);
      }
    });

    client.on('error', () => resolve(null));
  });
}

(async () => {
  const latency = await testTcpPing(SERVER_IP, PORT, PACKET_SIZE);
  console.log(`TCP Ping 模拟延迟: ${latency} ms`);
})();
```

## ws测试网络延迟

带jwt认证

- 服务端

server.js

```js
import express from 'express';
import { createServer } from 'http';
import { startWsEchoServer } from './wsEchoServer.js';

const app = express();
app.use(express.json());

// 注册原有路由

const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);

// 启动 WebSocket Echo
startWsEchoServer(httpServer);

httpServer.listen(PORT, async () => {
  try {
    if (process.env.NODE_ENV === 'development') await sequelize.sync();
    console.log(`🚀 HTTP + WebSocket 服务器启动: http://localhost:${PORT}`);
  } catch (err) {
    console.error('启动失败:', err);
  }
});
```

wsAuth.js

```js
// src/utils/wsAuth.js
import { jwtVerify } from 'jose';

/**
 * WebSocket 认证封装
 * @param {import('http').IncomingMessage} req
 * @returns {Promise<object>} 返回用户 payload
 */
export async function wsAuth(req) {
  // 获取 token
  const url = new URL(req.url, `http://${req.headers.host}`);
  let token = url.searchParams.get('token') || req.headers['sec-websocket-protocol']?.split(' ')[0];
  // console.log(token)
  if (!token) throw new Error('未提供 Token');

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload; // 返回用户信息
  } catch (err) {
    throw new Error('Token 无效或已过期');
  }
}
```

wsEchoServer.js

```js
import { WebSocketServer } from 'ws';
import { wsAuth } from './wsAuth.js';

export function startWsEchoServer(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws-echo' });

  wss.on('connection', async (ws, req) => {
    try {
      const user = await wsAuth(req); // 调用封装方法
      ws.user = user; // 保存用户信息
    } catch (err) {
      ws.close(4001, err.message);
      return;
    }

    // 认证通过，开始回显
    ws.on('message', (message) => {
      ws.send(message);
    });

    ws.on('close', () => {});
    ws.on('error', () => {});
  });

  console.log('✅ WebSocket Echo 已挂载在 /ws-echo (需要认证)');

  return wss;
}
```

.env

```
JWT_SECRET=your_jwt_secret
```

- 客户端

```js
import WebSocket from 'ws';

const SERVER_URL = 'ws://192.168.1.60:3000/ws-echo';
const PACKET_SIZE = 64 * 1024;
const INTERVAL_MS = 2000;

// 你的 JWT token
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTc2MDYyNTMwNCwiZXhwIjoxNzYwNjMyNTA0fQ.SIK3haqf50lSWujw3ylhU5BdHsxQhXdWFVDt-PaYDic'
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runLoop() {
  while (true) {
    // 在 URL 上附加 token
    const ws = new WebSocket(`${SERVER_URL}?token=${TOKEN}`);

    await new Promise((resolve, reject) => {
      ws.on('open', resolve);
      ws.on('error', reject);
    }).catch(err => {
      console.log('❌ WebSocket连接失败:', err.message);
      return sleep(INTERVAL_MS);
    });

    const payload = Buffer.alloc(PACKET_SIZE, 'A');
    const start = Date.now();

    ws.on('message', (data) => {
      const latency = Date.now() - start;
      console.log(`📶 WebSocket延迟: ${latency} ms`);
      ws.close();
    });

    ws.on('error', (err) => {
      console.log('❌ WebSocket测试失败:', err.message);
      ws.close();
    });

    // 发送数据
    ws.send(payload);

    await sleep(INTERVAL_MS);
  }
}

runLoop();
```

