# jwt用户认证系统示例

实现注册、登录和权限保护功能

## 示例代码

server.js

```js
import express from 'express';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import cors from 'cors';

const app = express();
const PORT = 3000;

// 用于签名和验证 JWT 的密钥
const secretKey = new TextEncoder().encode('your_secret_key_here');

app.use(cors());
app.use(express.json());

// 模拟用户数据库（实际中请用数据库）
const users = [];

// 注册接口
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: '用户已存在' });
    }

    // bcrypt 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.json({ message: '注册成功' });
});

// 登录接口
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user) return res.status(400).json({ message: '用户不存在' });

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: '密码错误' });

    // 生成 JWT
    const token = await new jose.SignJWT({ username })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secretKey);

    res.json({ message: '登录成功', token });
});

// 受保护的接口
app.get('/profile', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: '缺少 Token' });

    const token = authHeader.split(' ')[1];
    try {
        const { payload } = await jose.jwtVerify(token, secretKey);
        res.json({ message: '访问成功', user: payload });
    } catch (err) {
        res.status(401).json({ message: 'Token 无效或过期' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
```

## 注册

```shell
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "password": "123456"
  }'
```

## 登陆

```shell
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "password": "123456"
  }'
```

## 访问

```shell
curl --location --request GET 'http://localhost:3000/profile' \
--header 'Authorization: Bearer 粘贴上一步返回的token'
```

