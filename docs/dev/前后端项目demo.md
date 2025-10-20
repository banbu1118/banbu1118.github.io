# 前后端项目demo

这个项目测试使用一个端口搭建前后端服务，并加载ss证书

## 一、项目结构

```
my-project/
├─ server/
│  └─ index.js      # Express 后端入口
├─ client/
│  └─ package.json
└─ package.json
```

## 二、初始化项目

在项目根目录执行

```shell
npm init -y
```

编辑package.json，启用es模块，配置node启动命令

```json
{
  "type": "module",
  "scripts": {
    "start": "node server/index.js"
  }
}
```

## 三、安装依赖

```shell
npm install express
npm install -D vite vue@3
```

## 四、创建 Vue 3 前端

进入 client 目录

```shell
cd client
npm init vite@latest . -- --template vue
npm install
```

这会生成 Vue 3 项目。Vite 默认端口是 5173，我们后面会把构建结果交给 Express 提供。

## 五、构建前端

在 client/package.json 添加一个构建命令

```json
"scripts": {
  "dev": "vite",
  "build": "vite build"
}
```

生成前端文件：dist目录

```shell
npm run build
```

## 六、生成ss证书

在server里新建cert目录

```shell
mkdir cert
cd cert
openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

## 七、创建项目启动文件

在server里新建index.js

```js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import fs from 'fs';

// 获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8443; // 端口

// ------------------------
// 提供前端静态文件
// ------------------------
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

// ------------------------
// 示例 API
// ------------------------
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express HTTPS!' });
});

// ------------------------
// SPA fallback
// ------------------------
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

// ------------------------
// 读取证书
// ------------------------
const options = {
  key: fs.readFileSync(path.join(__dirname, 'cert/server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'cert/server.crt'))
};

// ------------------------
// 启动 HTTPS 服务器
// ------------------------
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server running at https://localhost:${PORT}`);
});
```

## 八、启动项目

在项目根目录运行命令

```shell
npm start
```

## 九、测试

- 前端测试

浏览器访问：https://ip:8443

- 后端测试

因为是get方法，可以使用浏览器测试

```
https://localhost:8443/api/hello
```

