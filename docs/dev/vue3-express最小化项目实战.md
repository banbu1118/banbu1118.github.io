# vue3-express最小化项目实战

## 一、配置后端

- 创建express-vue-login项目

```bash
mkdir express-vue-login
```

- 进入express-vue-login 项目

```bash
cd express-vue-login
```

- 创建服务端server目录

```bash
mkdir server

cd server
```

- 初始化项目

```bash
npm init -y
```

- 安装依赖

```bash
npm install express cors
```

- 配置文件

```bash
nano server.js
```

内容如下

```js
// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

// 使用 express 内置的 json 解析中间件
app.use(cors());
app.use(express.json());  // 代替 body-parser.json()

// 模拟用户数据
const users = [
  { username: 'test', password: 'password123' }
];

// 登录接口
app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      res.json({ message: '登录成功', success: true });
    } else {
      res.status(401).json({ message: '用户名或密码错误', success: false });
    }
  } catch (err) {
    res.status(500).json({ message: '服务器错误', success: false });
  }
});

app.listen(port, () => {
  console.log(`服务器正在运行在 http://localhost:${port}`);
});
```

## 二、配置前端

- 安装vue

```bash
cd /express-vue-login

npm install -g @vue/cli
```

- 创建vue项目

```bash
vue create client
```

- 进入vue项目

```bash
cd client
```

- 安装依赖

```bash
npm install axios
```

- 配置文件

```bash
nano src/components/HelloWorld.vue
```

内容如下

```vue
<template>
  <div>
    <h1>登录</h1>
    <form @submit.prevent="login">
      <div>
        <label for="username">用户名：</label>
        <input v-model="username" id="username" type="text" required />
      </div>
      <div>
        <label for="password">密码：</label>
        <input v-model="password" id="password" type="password" required />
      </div>
      <button type="submit">登录</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      message: '',
      apiBaseUrl: ''
    };
  },
  created() {
    // 自动获取当前页面的域名或IP
    this.apiBaseUrl = `http://${window.location.hostname}:5000`;
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(`${this.apiBaseUrl}/login`, {
          username: this.username,
          password: this.password
        });
        if (response.data.success) {
          this.message = '登录成功!';
        }
      } catch (error) {
        this.message = error.response?.data?.message || '登录失败';
      }
    }
  }
};
</script>

````

## 三、启动项目

- 启动后端

```bash
cd express-vue-login/server/

node server.js
```

- 启动前端

```bash
cd express-vue-login/client/

npm run serve
```

浏览器访问http://ip:8080

账户：test

密码：password123

## 四、打包项目

* 打包后端

删除node_modules模块目录，保留必要文件

```bash
cp -r server dist_server

tar -czvf dist_server.tar.gz dist_server
```

- 打包前端

dist目录会生成所有的静态文件，可以使用nginx部署

```bash
cd express-vue-login/client/

npm run build

tar -czvf dist.tar.gz dist
```

## 五、生产环境部署项目

- 部署后端

```bash
tar -xzvf dist_server.tar.gz

cd dist_server

npm install --production
```

- 使用pm2部署后端

```bash
#安装pm2
npm install pm2 -g

#启动后端
pm2 start server.js

#配置开机自启
pm2 startup

#保存当前进程列表
pm2 save
```

- 部署前端

```bash
tar -xzvf dist.tar.gz

cp -r dist /
```

- 使用nginx部署前端

这里把访问端口改为了8000，区别开发环境8080端口

```bash
apt install nginx -y

nano /etc/nginx/nginx.conf
```

内容如下

```shell
worker_processes  auto;

events {
    worker_connections  1024;
}

http {
    server {
        listen 8000;

        # 设置 server_name，绑定域名或 IP 地址
        server_name example.com;  # 你可以用实际的域名，或者直接使用 localhost 或 IP 地址

        # 设置根目录
        root /dist;  # 这里指向你打包后的 dist 目录

        # 默认的首页
        index index.html;

        # 配置 Vue 3 路由的处理（解决刷新时 404 问题）
        location / {
            try_files $uri $uri/ /index.html;
        }

    }

error_log /var/log/nginx/error.log debug;

}
```

- 检查nginx配置

```bash
nginx -t
```

- 配置nginx服务

```bash
systemctl enable nginx

systemctl restart nginx
```

浏览器访问http://ip:8000
