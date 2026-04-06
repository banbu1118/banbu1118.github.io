# oauth身份认证学习

## 一、最小化实现

### 创建项目安装依赖

```
mkdir express-oauth2-provider
cd express-oauth2-provider
npm init -y
npm install express oauth2-server
```

### 文件结构

```
express-oauth2-provider/
├── server.js
└── model.js
```

### server.js

```js
// server.js
import express from "express";
import OAuth2Server from "oauth2-server";
import crypto from "crypto";
import { model } from "./model.js";

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false })); // 处理表单请求体 (application/x-www-form-urlencoded)

// ✅ 初始化 OAuth2 Server
const oauth = new OAuth2Server({
  model,
  accessTokenLifetime: 60 * 60, // 1小时
  allowBearerTokensInQueryString: true,
});

// 用来保存 state
const stateStore = {};

// ===== 授权页面 =====
app.get("/authorize", (req, res) => {
  const { client_id, redirect_uri, state } = req.query;

  if (!client_id || !redirect_uri) {
    return res.status(400).send("缺少 client_id 或 redirect_uri");
  }

  const currentState = state || crypto.randomBytes(8).toString("hex");
  stateStore[currentState] = true;

  res.send(`
    <h2>OAuth2 授权页面</h2>
    <form method="POST" action="/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${currentState}&response_type=code">
      用户名: <input name="username" /><br>
      密码: <input name="password" type="password" /><br>
      <button type="submit">授权</button>
    </form>
  `);
});

// ===== 提交授权 =====
app.post("/authorize", async (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);

  const state = req.query.state;

  if (!state || !stateStore[state]) {
    return res.status(400).send("Invalid or missing state");
  }

  try {
    const user = await model.getUser(req.body.username, req.body.password);
    if (!user) return res.status(401).send("用户名或密码错误");

    const code = await oauth.authorize(request, response, {
      authenticateHandler: {
        handle: () => user,
      },
    });

    // 拼回 state 并重定向
    const redirectUri = new URL(response.headers.location);
    redirectUri.searchParams.set("state", state);
    delete stateStore[state];

    res.redirect(redirectUri.toString());
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// ===== 获取 token =====
app.post("/token", async (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);

  try {
    const token = await oauth.token(request, response);
    res.json(token);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// ===== 受保护资源（/secure）=====
app.get("/secure", async (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);

  try {
    const token = await oauth.authenticate(request, response);
    res.json({
      message: "你已成功访问受保护资源！",
      user: token.user,
    });
  } catch (err) {
    res.status(401).json({ error: "无效 token" });
  }
});

app.listen(3000, () => {
  console.log("OAuth2 Provider 运行在 http://localhost:3000");
});

```

### model.js

```js
// model.js
import crypto from "crypto";

const users = [{ id: 1, username: "admin", password: "admin" }];
const clients = [
  {
    id: "client1",
    clientId: "client1",
    clientSecret: "secret",
    grants: ["authorization_code", "refresh_token"],
    redirectUris: ["http://localhost:4000/callback"],
  },
];
const tokens = {};
const codes = {};

export const model = {
  // ✅ 获取客户端信息
  getClient: async (clientId, clientSecret) => {
    const client = clients.find((c) => c.clientId === clientId);
    if (!client) return null;
    // 授权阶段可能没有 clientSecret
    if (clientSecret && client.clientSecret !== clientSecret) return null;
    return client;
  },

  // ✅ 获取用户
  getUser: async (username, password) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    return user || null;
  },

  // ✅ 保存授权码
  saveAuthorizationCode: async (code, client, user) => {
    codes[code.authorizationCode] = { ...code, client, user };
    return codes[code.authorizationCode];
  },

  // ✅ 获取授权码
  getAuthorizationCode: async (authorizationCode) => {
    return codes[authorizationCode] || null;
  },

  // ✅ 撤销授权码
  revokeAuthorizationCode: async (code) => {
    delete codes[code.authorizationCode];
    return true;
  },

  // ✅ 保存 token
  saveToken: async (token, client, user) => {
    tokens[token.accessToken] = { ...token, client, user };
    return tokens[token.accessToken];
  },

  // ✅ 获取 token
  getAccessToken: async (accessToken) => {
    return tokens[accessToken] || null;
  },

  verifyScope: async () => true,
};

```

### 创建客户端

```
client-app/
  ├─ client.js
  └─ package.json
```

### 安装依赖


```
cd client-app
npm init -y
npm install express

```

### client.js

```js
import express from "express";
import http from "http";
import querystring from "querystring";

const app = express();

const CLIENT_ID = "client1";
const CLIENT_SECRET = "secret";
const REDIRECT_URI = "http://localhost:4000/callback";
const AUTH_SERVER_HOST = "localhost";
const AUTH_SERVER_PORT = 3000;

app.get("/", (req, res) => {
  const authUrl = `http://${AUTH_SERVER_HOST}:${AUTH_SERVER_PORT}/authorize?` +
    querystring.stringify({
      response_type: "code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      state: "123abc",
    });
  res.send(`<a href="${authUrl}">点击登录 (OAuth2 授权码模式)</a>`);
});

app.get("/callback", (req, res) => {
  const { code } = req.query;
  if (!code) return res.send("未收到授权码 code");

  // 用授权码换取 access_token
  const postData = querystring.stringify({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const tokenReqOptions = {
    hostname: AUTH_SERVER_HOST,
    port: AUTH_SERVER_PORT,
    path: "/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const tokenReq = http.request(tokenReqOptions, (tokenRes) => {
    let data = "";
    tokenRes.on("data", (chunk) => (data += chunk));
    tokenRes.on("end", () => {
      let body;
      try {
        body = JSON.parse(data);
      } catch (err) {
        return res.send("解析 token 响应失败: " + err.message);
      }

      const accessToken = body.accessToken;
      if (!accessToken) return res.send("没有拿到 access_token");

      // 使用 access_token 访问受保护资源
      const secureReqOptions = {
        hostname: AUTH_SERVER_HOST,
        port: AUTH_SERVER_PORT,
        path: "/secure",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const secureReq = http.request(secureReqOptions, (secureRes) => {
        let secureData = "";
        secureRes.on("data", (chunk) => (secureData += chunk));
        secureRes.on("end", () => {
          let body2;
          try {
            body2 = JSON.parse(secureData);
          } catch (err) {
            return res.send("解析受保护资源响应失败: " + err.message);
          }

          res.send(`
            <h3>授权成功！</h3>
            <h4>Access Token:</h4>
            <pre>${JSON.stringify(body, null, 2)}</pre>
            <h4>受保护资源返回：</h4>
            <pre>${JSON.stringify(body2, null, 2)}</pre>
          `);
        });
      });

      secureReq.on("error", (err) => res.send("访问受保护资源出错：" + err.message));
      secureReq.end();
    });
  });

  tokenReq.on("error", (err) => res.send("请求 token 出错：" + err.message));
  tokenReq.write(postData);
  tokenReq.end();
});

app.listen(4000, () => {
  console.log("OAuth2 Client 启动在 http://localhost:4000");
});

```

### 访问

访问http://localhost:4000，输入账户admin和密码admin获得授权

## 二、优化

### 增加 https 和 刷新刷新令牌功能

### server.js

````js
import express from "express";
import OAuth2Server from "oauth2-server";
import crypto from "crypto";
import https from "https";
import fs from "fs";
import { model } from "./model.js";

const app = express();

// ===== 解析请求 =====
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ===== 初始化 OAuth2 Server =====
const oauth = new OAuth2Server({
  model,
  accessTokenLifetime: 60 * 60,          // 1小时
  refreshTokenLifetime: 60 * 60 * 24 * 30, // 30天
  allowBearerTokensInQueryString: true,
});

// ===== state 管理 =====
const stateStore = {};

// ===== 授权页面 =====
app.get("/authorize", (req, res) => {
  const { client_id, redirect_uri, state } = req.query;

  if (!client_id || !redirect_uri) {
    return res.status(400).send("缺少 client_id 或 redirect_uri");
  }

  const currentState = state || crypto.randomBytes(8).toString("hex");
  stateStore[currentState] = true;

  res.send(`
    <h2>OAuth2 授权页面 (HTTPS + JWT)</h2>
    <form method="POST" action="/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${currentState}&response_type=code">
      用户名: <input name="username" /><br>
      密码: <input name="password" type="password" /><br>
      <button type="submit">授权</button>
    </form>
  `);
});

// ===== 提交授权 =====
app.post("/authorize", async (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);
  const state = req.query.state;

  if (!state || !stateStore[state]) return res.status(400).send("Invalid or missing state");

  try {
    const user = await model.getUser(req.body.username, req.body.password);
    if (!user) return res.status(401).send("用户名或密码错误");

    const code = await oauth.authorize(request, response, {
      authenticateHandler: { handle: () => user },
    });

    const redirectUri = new URL(response.headers.location);
    redirectUri.searchParams.set("state", state);
    delete stateStore[state];

    res.redirect(redirectUri.toString());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.name, error_description: err.message });
  }
});

// ===== 获取 Token =====
app.post("/token", async (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);

  try {
    const token = await oauth.token(request, response);
    res.json(token);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.name, error_description: err.message });
  }
});

// ===== 受保护资源 =====
app.get("/secure", async (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);

  try {
    const token = await oauth.authenticate(request, response);
    res.json({
      message: "✅ 你已成功访问受保护资源（通过 HTTPS + JWT 验证）！",
      user: token.user,
    });
  } catch (err) {
    res.status(401).json({ error: "无效 token" });
  }
});

// ===== 启动 HTTPS 服务器 =====
const options = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

https.createServer(options, app).listen(3000, () => {
  console.log("✅ OAuth2 Provider 运行在 https://localhost:3000");
});

````

### model.js

```js
import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";

// 模拟数据库
const users = [{ id: 1, username: "admin", password: "admin" }];
const clients = [
  {
    id: "client1",
    clientId: "client1",
    clientSecret: "secret",
    grants: ["authorization_code", "refresh_token"],
    redirectUris: ["https://localhost:4000/callback"],
  },
];

// token 与授权码存储
const codes = {};
const tokens = {};

const JWT_SECRET = new TextEncoder().encode("your_jwt_secret_key_123");

export const model = {
  // === 客户端 ===
  getClient: async (clientId, clientSecret) => {
    const client = clients.find((c) => c.clientId === clientId);
    if (!client) return null;
    if (clientSecret && client.clientSecret !== clientSecret) return null;
    return client;
  },

  // === 用户 ===
  getUser: async (username, password) => {
    return users.find((u) => u.username === username && u.password === password) || null;
  },

  // === 授权码 ===
  saveAuthorizationCode: async (code, client, user) => {
    codes[code.authorizationCode] = { ...code, client, user };
    return codes[code.authorizationCode];
  },
  getAuthorizationCode: async (authorizationCode) => codes[authorizationCode] || null,
  revokeAuthorizationCode: async (code) => {
    delete codes[code.authorizationCode];
    return true;
  },

  // === 生成并保存 Token（JWT） ===
  saveToken: async (token, client, user) => {
    const payload = {
      sub: user.id,
      username: user.username,
      client_id: client.clientId,
      scope: token.scope,
    };

    const accessToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(JWT_SECRET);

    const refreshToken = crypto.randomBytes(32).toString("hex");

    const savedToken = {
      accessToken,
      accessTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      refreshToken,
      refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      client,
      user,
    };

    tokens[refreshToken] = savedToken;
    tokens[accessToken] = savedToken;

    return savedToken;
  },

  // === 验证 Access Token ===
  getAccessToken: async (accessToken) => {
    try {
      const { payload } = await jwtVerify(accessToken, JWT_SECRET);
      const token = tokens[accessToken];
      if (!token) return null;
      return { ...token, user: { id: payload.sub, username: payload.username } };
    } catch (e) {
      return null;
    }
  },

  // === 刷新令牌 ===
  getRefreshToken: async (refreshToken) => tokens[refreshToken] || null,
  revokeToken: async (token) => {
    delete tokens[token.refreshToken];
    return true;
  },

  verifyScope: async () => true,
};

```

### client.js

```js
import express from "express";
import https from "https";
import fs from "fs";

const app = express();

// ==== HTTPS 证书配置（开发用自签名）====
const httpsOptions = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

// ==== OAuth2 客户端信息 ====
const CLIENT_ID = "client1";
const CLIENT_SECRET = "secret";
const REDIRECT_URI = "https://localhost:4000/callback";
const AUTH_SERVER = "https://localhost:3000"; // OAuth2 服务器地址

// 忽略自签证书（仅开发用）
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// 首页：展示授权登录链接
app.get("/", (req, res) => {
  const authUrl = `${AUTH_SERVER}/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&state=123abc`;

  res.send(`<a href="${authUrl}">点击登录 (OAuth2 授权码模式)</a>`);
});

// 回调：OAuth2 服务器授权后跳转到这里
app.get("/callback", (req, res) => {
  const { code } = req.query;
  if (!code) return res.send("❌ 未收到授权码 code");

  const postData = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  }).toString();

  const tokenUrl = new URL(`${AUTH_SERVER}/token`);

  const tokenOptions = {
    hostname: tokenUrl.hostname,
    port: tokenUrl.port,
    path: tokenUrl.pathname,
    method: "POST",
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const tokenReq = https.request(tokenOptions, (tokenRes) => {
    let data = "";
    tokenRes.on("data", (chunk) => (data += chunk));
    tokenRes.on("end", () => {
      try {
        const tokenData = JSON.parse(data);
        if (!tokenData.accessToken) {
          return res.send(`<pre>获取 Token 失败：${JSON.stringify(tokenData, null, 2)}</pre>`);
        }

        // 自动刷新函数
        const refreshToken = async (refresh_token) => {
          return new Promise((resolve, reject) => {
            const refreshData = new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token,
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
            }).toString();

            const refreshOptions = {
              hostname: tokenUrl.hostname,
              port: tokenUrl.port,
              path: tokenUrl.pathname,
              method: "POST",
              rejectUnauthorized: false,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(refreshData),
              },
            };

            const refreshReq = https.request(refreshOptions, (r) => {
              let result = "";
              r.on("data", (chunk) => (result += chunk));
              r.on("end", () => resolve(JSON.parse(result)));
            });

            refreshReq.on("error", reject);
            refreshReq.write(refreshData);
            refreshReq.end();
          });
        };

        // 使用 access_token 访问受保护资源
        const secureUrl = new URL(`${AUTH_SERVER}/secure`);
        const secureOptions = {
          hostname: secureUrl.hostname,
          port: secureUrl.port,
          path: secureUrl.pathname,
          method: "GET",
          rejectUnauthorized: false,
          headers: { Authorization: `Bearer ${tokenData.accessToken}` },
        };

        const secureReq = https.request(secureOptions, (secureRes) => {
          let secureData = "";
          secureRes.on("data", (chunk) => (secureData += chunk));
          secureRes.on("end", async () => {
            let secureJson = JSON.parse(secureData);

            res.send(`
              <h2>授权成功 ✅</h2>
              <h3>Access Token</h3>
              <pre>${JSON.stringify(tokenData, null, 2)}</pre>

              <h3>受保护资源</h3>
              <pre>${JSON.stringify(secureJson, null, 2)}</pre>

              ${
                tokenData.refreshToken
                  ? `<a href="/refresh?token=${tokenData.refreshToken}">🔁 使用 refresh_token 刷新令牌</a>`
                  : ""
              }
            `);
          });
        });

        secureReq.on("error", (err) => res.send("访问受保护资源出错：" + err.message));
        secureReq.end();
      } catch (err) {
        res.send("解析 token 响应出错：" + err.message);
      }
    });
  });

  tokenReq.on("error", (err) => res.send("获取 Token 出错：" + err.message));
  tokenReq.write(postData);
  tokenReq.end();
});

// 刷新令牌接口
app.get("/refresh", (req, res) => {
  const { token } = req.query;
  if (!token) return res.send("❌ 缺少 refresh_token");

  const postData = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: token,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  }).toString();

  const tokenUrl = new URL(`${AUTH_SERVER}/token`);

  const refreshOptions = {
    hostname: tokenUrl.hostname,
    port: tokenUrl.port,
    path: tokenUrl.pathname,
    method: "POST",
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const refreshReq = https.request(refreshOptions, (refreshRes) => {
    let data = "";
    refreshRes.on("data", (chunk) => (data += chunk));
    refreshRes.on("end", () => {
      const newToken = JSON.parse(data);
      res.send(`
        <h2>刷新令牌成功 ✅</h2>
        <pre>${JSON.stringify(newToken, null, 2)}</pre>
        <a href="/">返回首页</a>
      `);
    });
  });

  refreshReq.on("error", (err) => res.send("刷新失败：" + err.message));
  refreshReq.write(postData);
  refreshReq.end();
});

// 启动 HTTPS 客户端
https.createServer(httpsOptions, app).listen(4000, () => {
  console.log("✅ OAuth2 Client 启动在 https://localhost:4000");
});

```

## 三、升级为OIDC认证

| 特性     | OAuth2       | OIDC                                           |
| -------- | ------------ | ---------------------------------------------- |
| 目标     | 授权访问资源 | 认证用户身份 + 授权访问资源                    |
| Token    | Access Token | Access Token + ID Token                        |
| ID Token | ❌            | ✅ JWT，包含用户身份信息（sub, name, email 等） |
| Scope    | scope        | scope + `openid`（必选）                       |

### server.js

```js
// server.js
import express from "express";
import OAuth2Server from "oauth2-server";
import crypto from "crypto";
import https from "https";
import fs from "fs";
import { model } from "./model.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const oauth = new OAuth2Server({
  model,
  accessTokenLifetime: 60 * 60,
  refreshTokenLifetime: 60 * 60 * 24 * 30,
  allowBearerTokensInQueryString: true,
});

const stateStore = {};

// ===== 授权页面 =====
app.get("/authorize", (req, res) => {
  const { client_id, redirect_uri, state, scope } = req.query;

  if (!client_id || !redirect_uri) return res.status(400).send("缺少 client_id 或 redirect_uri");

  const currentState = state || crypto.randomBytes(8).toString("hex");
  stateStore[currentState] = true;

  res.send(`
    <h2>OIDC 授权页面</h2>
    <form method="POST" action="/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${currentState}&response_type=code&scope=${scope}">
      用户名: <input name="username" /><br>
      密码: <input name="password" type="password" /><br>
      <button type="submit">授权</button>
    </form>
  `);
});

// ===== 提交授权 =====
app.post("/authorize", async (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);
  const state = req.query.state;

  if (!state || !stateStore[state]) return res.status(400).send("Invalid or missing state");

  try {
    const user = await model.getUser(req.body.username, req.body.password);
    if (!user) return res.status(401).send("用户名或密码错误");

    const code = await oauth.authorize(request, response, { authenticateHandler: { handle: () => user } });

    const redirectUri = new URL(response.headers.location);
    redirectUri.searchParams.set("state", state);
    delete stateStore[state];

    res.redirect(redirectUri.toString());
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// ===== Token =====
app.post("/token", async (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);

  try {
    const token = await oauth.token(request, response);
    res.json(token); // 包含 accessToken + idToken + refreshToken
  } catch (err) {
    res.status(500).json({ error: err.name, error_description: err.message });
  }
});

// ===== 受保护资源 =====
app.get("/secure", async (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);

  try {
    const token = await oauth.authenticate(request, response);
    res.json({ message: "✅ 已访问受保护资源", user: token.user });
  } catch (err) {
    res.status(401).json({ error: "invalid_token" });
  }
});

// ===== OIDC /userinfo =====
app.get("/userinfo", async (req, res) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);

  try {
    const token = await oauth.authenticate(request, response);
    res.json({ sub: token.user.id, username: token.user.username, email: token.user.username + "@example.com" });
  } catch (err) {
    res.status(401).json({ error: "invalid_token" });
  }
});

// ===== 启动 HTTPS =====
const options = { key: fs.readFileSync("./key.pem"), cert: fs.readFileSync("./cert.pem") };
https.createServer(options, app).listen(3000, () => console.log("✅ OIDC Provider 运行在 https://localhost:3000"));

```

### model.js

```js
// model.js
import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";

// 模拟数据库
const users = [{ id: 1, username: "admin", password: "admin" }];
const clients = [
  {
    id: "client1",
    clientId: "client1",
    clientSecret: "secret",
    grants: ["authorization_code", "refresh_token"],
    redirectUris: ["https://localhost:4000/callback"],
  },
];

// token 与授权码存储
const codes = {};
const tokens = {};

const JWT_SECRET = new TextEncoder().encode("your_jwt_secret_key_123");

export const model = {
  getClient: async (clientId, clientSecret) => {
    const client = clients.find((c) => c.clientId === clientId);
    if (!client) return null;
    if (clientSecret && client.clientSecret !== clientSecret) return null;
    return client;
  },

  getUser: async (username, password) =>
    users.find((u) => u.username === username && u.password === password) || null,

  saveAuthorizationCode: async (code, client, user) => {
    codes[code.authorizationCode] = { ...code, client, user };
    return codes[code.authorizationCode];
  },

  getAuthorizationCode: async (authorizationCode) => codes[authorizationCode] || null,
  revokeAuthorizationCode: async (code) => {
    delete codes[code.authorizationCode];
    return true;
  },

  saveToken: async (token, client, user) => {
    const payload = {
      sub: user.id,
      username: user.username,
      client_id: client.clientId,
      scope: token.scope,
    };

    // access token
    const accessToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(JWT_SECRET);

    // id_token (OIDC)
    let idToken;
    if (token.scope && token.scope.includes("openid")) {
      idToken = await new SignJWT({
        iss: "https://localhost:3000",
        sub: user.id.toString(),
        aud: client.clientId,
        username: user.username,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(JWT_SECRET);
    }

    const refreshToken = crypto.randomBytes(32).toString("hex");

    const savedToken = {
      accessToken,
      accessTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      refreshToken,
      refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      client,
      user,
      idToken,
    };

    tokens[refreshToken] = savedToken;
    tokens[accessToken] = savedToken;

    return savedToken;
  },

  getAccessToken: async (accessToken) => {
    try {
      const { payload } = await jwtVerify(accessToken, JWT_SECRET);
      const token = tokens[accessToken];
      if (!token) return null;
      return { ...token, user: { id: payload.sub, username: payload.username } };
    } catch (e) {
      return null;
    }
  },

  getRefreshToken: async (refreshToken) => tokens[refreshToken] || null,
  revokeToken: async (token) => {
    delete tokens[token.refreshToken];
    return true;
  },

  verifyScope: async () => true,
};

```

### client.js

```js
// client.js
import express from "express";
import https from "https";
import fs from "fs";

const app = express();

// ==== HTTPS 证书配置（开发用自签名）====
const httpsOptions = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

// ==== OAuth2 / OIDC 客户端信息 ====
const CLIENT_ID = "client1";
const CLIENT_SECRET = "secret";
const REDIRECT_URI = "https://localhost:4000/callback";
const AUTH_SERVER = "https://localhost:3000"; // OIDC 服务器地址

// ==== 临时保存 token ====
let lastAccessToken = null;
let lastRefreshToken = null;

// 首页：展示授权登录链接
app.get("/", (req, res) => {
  const authUrl = `${AUTH_SERVER}/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&state=123abc&scope=openid`;

  res.send(`<a href="${authUrl}">点击登录 (OIDC 授权码模式)</a>`);
});

// 回调：获取授权码
app.get("/callback", (req, res) => {
  const { code } = req.query;
  if (!code) return res.send("❌ 未收到授权码 code");

  // 用授权码换取 access_token + id_token
  const bodyParams = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const tokenUrl = new URL(`${AUTH_SERVER}/token`);
  const options = {
    hostname: tokenUrl.hostname,
    port: tokenUrl.port,
    path: tokenUrl.pathname,
    method: "POST",
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(bodyParams.toString()),
    },
  };

  const tokenReq = https.request(options, (tokenRes) => {
    let data = "";
    tokenRes.on("data", (chunk) => (data += chunk));
    tokenRes.on("end", () => {
      try {
        const tokenData = JSON.parse(data);

        if (!tokenData.accessToken) return res.send("❌ 获取 Token 失败");

        // 保存 token 用于后续请求
        lastAccessToken = tokenData.accessToken;
        lastRefreshToken = tokenData.refreshToken;

        res.send(`
          <h2>授权成功 ✅</h2>
          <pre>accessToken: ${tokenData.accessToken}</pre>
          <pre>idToken: ${tokenData.idToken}</pre>
          <pre>refreshToken: ${tokenData.refreshToken}</pre>
          <a href="/userinfo">获取用户信息 (/userinfo)</a><br>
          <a href="/refresh">刷新令牌 (/refresh)</a>
        `);
      } catch (err) {
        res.send("解析 token 响应出错：" + err.message);
      }
    });
  });

  tokenReq.on("error", (err) => res.send("获取 Token 出错：" + err.message));
  tokenReq.write(bodyParams.toString());
  tokenReq.end();
});

// 获取用户信息
app.get("/userinfo", (req, res) => {
  if (!lastAccessToken) return res.send("❌ 没有 accessToken，请先授权");

  const userInfoUrl = new URL(`${AUTH_SERVER}/userinfo`);
  const options = {
    hostname: userInfoUrl.hostname,
    port: userInfoUrl.port,
    path: userInfoUrl.pathname,
    method: "GET",
    rejectUnauthorized: false,
    headers: { Authorization: `Bearer ${lastAccessToken}` },
  };

  const userReq = https.request(options, (userRes) => {
    let data = "";
    userRes.on("data", (chunk) => (data += chunk));
    userRes.on("end", () => {
      res.send(`<h2>/userinfo 返回：</h2><pre>${data}</pre><a href="/">返回首页</a>`);
    });
  });

  userReq.on("error", (err) => res.send("访问 /userinfo 出错：" + err.message));
  userReq.end();
});

// 刷新 access_token
app.get("/refresh", (req, res) => {
  if (!lastRefreshToken) return res.send("❌ 没有 refreshToken，请先授权");

  const bodyParams = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: lastRefreshToken,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const tokenUrl = new URL(`${AUTH_SERVER}/token`);
  const options = {
    hostname: tokenUrl.hostname,
    port: tokenUrl.port,
    path: tokenUrl.pathname,
    method: "POST",
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(bodyParams.toString()),
    },
  };

  const refreshReq = https.request(options, (refreshRes) => {
    let data = "";
    refreshRes.on("data", (chunk) => (data += chunk));
    refreshRes.on("end", () => {
      try {
        const newToken = JSON.parse(data);
        lastAccessToken = newToken.accessToken;
        lastRefreshToken = newToken.refreshToken;

        res.send(`
          <h2>刷新令牌成功 ✅</h2>
          <pre>${JSON.stringify(newToken, null, 2)}</pre>
          <a href="/userinfo">获取用户信息 (/userinfo)</a><br>
          <a href="/">返回首页</a>
        `);
      } catch (err) {
        res.send("解析刷新响应出错：" + err.message);
      }
    });
  });

  refreshReq.on("error", (err) => res.send("刷新令牌失败：" + err.message));
  refreshReq.write(bodyParams.toString());
  refreshReq.end();
});

// 启动 HTTPS 客户端
https.createServer(httpsOptions, app).listen(4000, () => {
  console.log("✅ OIDC Client 运行在 https://localhost:4000");
});

```

## 四、使用axios版本

### server.js

```js
// server.js
import express from "express";
import https from "https";
import fs from "fs";
import crypto from "crypto";
import { model } from "./model.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 初始化 HTTPS 证书（开发用自签名）
const httpsOptions = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

// 保存临时 state
const stateStore = {};

// ===== 授权页面 =====
app.get("/authorize", (req, res) => {
  const { client_id, redirect_uri, state, response_type, scope } = req.query;

  if (!client_id || !redirect_uri) return res.status(400).send("缺少 client_id 或 redirect_uri");

  const currentState = state || crypto.randomBytes(8).toString("hex");
  stateStore[currentState] = true;

  res.send(`
    <h2>OIDC 授权页面</h2>
    <form method="POST" action="/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${currentState}&response_type=${response_type}&scope=${scope}">
      用户名: <input name="username" /><br>
      密码: <input name="password" type="password" /><br>
      <button type="submit">授权</button>
    </form>
  `);
});

// ===== 提交授权 =====
app.post("/authorize", async (req, res) => {
  const { client_id, redirect_uri, state, response_type, scope } = req.query;

  if (!state || !stateStore[state]) return res.status(400).send("Invalid or missing state");

  try {
    const user = await model.getUser(req.body.username, req.body.password);
    if (!user) return res.status(401).send("用户名或密码错误");

    // 生成授权码
    const authorizationCode = crypto.randomBytes(16).toString("hex");
    await model.saveAuthorizationCode(
      { authorizationCode, expiresAt: new Date(Date.now() + 5 * 60 * 1000), redirectUri: redirect_uri },
      await model.getClient(client_id),
      user
    );

    // 拼回 state 重定向
    const redirectUrl = new URL(redirect_uri);
    redirectUrl.searchParams.set("code", authorizationCode);
    redirectUrl.searchParams.set("state", state);

    delete stateStore[state];
    res.redirect(redirectUrl.toString());
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// ===== 颁发 Token（access_token / id_token / refresh_token） =====
app.post("/token", async (req, res) => {
  const { grant_type, code, refresh_token, client_id, client_secret, redirect_uri } = req.body;

  try {
    let token;

    if (grant_type === "authorization_code") {
      const savedCode = await model.getAuthorizationCode(code);
      if (!savedCode) return res.status(400).json({ error: "invalid_grant" });

      token = await model.saveToken(
        { scope: "openid" },
        await model.getClient(client_id, client_secret),
        savedCode.user
      );

      // 授权码只能用一次
      await model.revokeAuthorizationCode(savedCode);
    } else if (grant_type === "refresh_token") {
      const savedToken = await model.getRefreshToken(refresh_token);
      if (!savedToken) return res.status(400).json({ error: "invalid_grant" });

      token = await model.saveToken(
        { scope: "openid" },
        savedToken.client,
        savedToken.user
      );

      await model.revokeToken(savedToken);
    } else {
      return res.status(400).json({ error: "unsupported_grant_type" });
    }

    res.json({
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      idToken: token.accessToken, // 简单起见，用同一个 JWT
      tokenType: "Bearer",
      expiresIn: 3600,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", error_description: err.message });
  }
});

// ===== UserInfo 接口 =====
app.get("/userinfo", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "invalid_token" });

  const token = authHeader.replace("Bearer ", "");
  const access = await model.getAccessToken(token);
  if (!access) return res.status(401).json({ error: "invalid_token" });

  res.json({ sub: access.user.id, username: access.user.username });
});

// ===== 启动 HTTPS 服务 =====
https.createServer(httpsOptions, app).listen(3000, () => {
  console.log("✅ OIDC Provider 运行在 https://localhost:3000");
});

```

### model.js

```js
// model.js
import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";

// 模拟数据库
const users = [{ id: 1, username: "admin", password: "admin" }];
const clients = [
  {
    id: "client1",
    clientId: "client1",
    clientSecret: "secret",
    grants: ["authorization_code", "refresh_token"],
    redirectUris: ["https://localhost:4000/callback"],
  },
];

// token 与授权码存储
const codes = {};
const tokens = {};

const JWT_SECRET = new TextEncoder().encode("your_jwt_secret_key_123");

export const model = {
  getClient: async (clientId, clientSecret) => {
    const client = clients.find((c) => c.clientId === clientId);
    if (!client) return null;
    if (clientSecret && client.clientSecret !== clientSecret) return null;
    return client;
  },

  getUser: async (username, password) =>
    users.find((u) => u.username === username && u.password === password) || null,

  saveAuthorizationCode: async (code, client, user) => {
    codes[code.authorizationCode] = { ...code, client, user };
    return codes[code.authorizationCode];
  },

  getAuthorizationCode: async (authorizationCode) => codes[authorizationCode] || null,
  revokeAuthorizationCode: async (code) => {
    delete codes[code.authorizationCode];
    return true;
  },

  saveToken: async (token, client, user) => {
    const payload = {
      sub: user.id,
      username: user.username,
      client_id: client.clientId,
      scope: token.scope,
    };

    // access token
    const accessToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(JWT_SECRET);

    // id_token (OIDC)
    let idToken;
    if (token.scope && token.scope.includes("openid")) {
      idToken = await new SignJWT({
        iss: "https://localhost:3000",
        sub: user.id.toString(),
        aud: client.clientId,
        username: user.username,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(JWT_SECRET);
    }

    const refreshToken = crypto.randomBytes(32).toString("hex");

    const savedToken = {
      accessToken,
      accessTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      refreshToken,
      refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      client,
      user,
      idToken,
    };

    tokens[refreshToken] = savedToken;
    tokens[accessToken] = savedToken;

    return savedToken;
  },

  getAccessToken: async (accessToken) => {
    try {
      const { payload } = await jwtVerify(accessToken, JWT_SECRET);
      const token = tokens[accessToken];
      if (!token) return null;
      return { ...token, user: { id: payload.sub, username: payload.username } };
    } catch (e) {
      return null;
    }
  },

  getRefreshToken: async (refreshToken) => tokens[refreshToken] || null,
  revokeToken: async (token) => {
    delete tokens[token.refreshToken];
    return true;
  },

  verifyScope: async () => true,
};

```

### client.js

```js
// client.js
import express from "express";
import https from "https";
import fs from "fs";
import axios from "axios";

const app = express();

// ==== HTTPS 证书配置（开发用自签名）====
const httpsOptions = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

// ==== OAuth2 / OIDC 客户端信息 ====
const CLIENT_ID = "client1";
const CLIENT_SECRET = "secret";
const REDIRECT_URI = "https://localhost:4000/callback";
const AUTH_SERVER = "https://localhost:3000"; // OIDC 服务器地址

// ==== HTTPS Agent，允许自签证书（开发用）====
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// ==== 临时保存 token ====
let lastAccessToken = null;
let lastRefreshToken = null;

// 首页：展示授权登录链接
app.get("/", (req, res) => {
  const authUrl = `${AUTH_SERVER}/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&state=123abc&scope=openid`;

  res.send(`<a href="${authUrl}">点击登录 (OIDC 授权码模式)</a>`);
});

// 回调：获取授权码并换取 access_token / id_token
app.get("/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.send("❌ 未收到授权码 code");

  try {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    const tokenResp = await axios.post(`${AUTH_SERVER}/token`, params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      httpsAgent,
    });

    const tokenData = tokenResp.data;
    if (!tokenData.accessToken) return res.send("❌ 获取 Token 失败");

    lastAccessToken = tokenData.accessToken;
    lastRefreshToken = tokenData.refreshToken;

    res.send(`
      <h2>授权成功 ✅</h2>
      <pre>accessToken: ${tokenData.accessToken}</pre>
      <pre>idToken: ${tokenData.idToken}</pre>
      <pre>refreshToken: ${tokenData.refreshToken}</pre>
      <a href="/userinfo">获取用户信息 (/userinfo)</a><br>
      <a href="/refresh">刷新令牌 (/refresh)</a>
    `);
  } catch (err) {
    res.send("❌ 获取 Token 出错：" + err.message);
  }
});

// 获取用户信息
app.get("/userinfo", async (req, res) => {
  if (!lastAccessToken) return res.send("❌ 没有 accessToken，请先授权");

  try {
    const userResp = await axios.get(`${AUTH_SERVER}/userinfo`, {
      headers: { Authorization: `Bearer ${lastAccessToken}` },
      httpsAgent,
    });
    res.send(`<h2>/userinfo 返回：</h2><pre>${JSON.stringify(userResp.data, null, 2)}</pre><a href="/">返回首页</a>`);
  } catch (err) {
    res.send("❌ 访问 /userinfo 出错：" + err.message);
  }
});

// 刷新 access_token
app.get("/refresh", async (req, res) => {
  if (!lastRefreshToken) return res.send("❌ 没有 refreshToken，请先授权");

  try {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: lastRefreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    const refreshResp = await axios.post(`${AUTH_SERVER}/token`, params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      httpsAgent,
    });

    const newToken = refreshResp.data;
    lastAccessToken = newToken.accessToken;
    lastRefreshToken = newToken.refreshToken;

    res.send(`
      <h2>刷新令牌成功 ✅</h2>
      <pre>${JSON.stringify(newToken, null, 2)}</pre>
      <a href="/userinfo">获取用户信息 (/userinfo)</a><br>
      <a href="/">返回首页</a>
    `);
  } catch (err) {
    res.send("❌ 刷新令牌失败：" + err.message);
  }
});

// 启动 HTTPS 客户端
https.createServer(httpsOptions, app).listen(4000, () => {
  console.log("✅ OIDC Client 运行在 https://localhost:4000");
});

```

## 五、rdpgw集成

### oidc服务端版本1

```js
import { Provider } from 'oidc-provider';

// 客户端
const clients = [{
  client_id: 'rdpgw',
  client_secret: '01cd304c-6f43-4480-9479-618eb6fd578f',
  redirect_uris: ['https://192.168.1.60:9443/callback'],
  response_types: ['code'],
}];

// 配置
const configuration = {
  clients,
  features: {
    devInteractions: { enabled: true },
  },
  claims: {
    // 定义 profile scope 返回哪些字段
    openid: ['sub'],
    profile: ['username', 'email'], 
  },
  findAccount: async (ctx, id) => {
    const users = {
      'admin': { sub: 'admin', username: 'admin', password: 'admin', email: 'admin@example.com' },
    };

    const user = users[id];
    if (!user) return undefined;

    return {
      accountId: id,
      async claims(use, scope) {
        // scope 是客户端请求的 scope
        return {
          sub: user.sub,
          username: user.username,
          email: user.email,
        };
      },
    };
  },
};

// 启动 Provider
const oidc = new Provider('http://192.168.1.2:3000', configuration);

oidc.listen(3000, () => {
  console.log('OIDC Provider 运行在: http://192.168.1.2:3000');
});
```

```shell
docker --run name rdpgw bolkedebruin/rdpgw:latest \
  -e RDPGW_SERVER__CERT_FILE=/etc/rdpgw/cert.pem
  -e RDPGW_SERVER__KEY_FILE=/etc/rdpgw.cert.pem
  -e RDPGW_SERVER__GATEWAY_ADDRESS=https://localhost:443
  -e RDPGW_SERVER__SESSION_KEY=thisisasessionkeyreplacethisjetz  # 32 characters
  -e RDPGW_SERVER__SESSION_ENCRYPTION_KEY=thisisasessionkeyreplacethisnunu # 32 characters
  -e RDPGW_OPEN_ID__PROVIDER_URL=http://keycloak:8080/auth/realms/rdpgw
  -e RDPGW_OPEN_ID__CLIENT_ID=rdpgw
  -e RDPGW_OPEN_ID__CLIENT_SECRET=01cd304c-6f43-4480-9479-618eb6fd578f
  -e RDPGW_SECURITY__SECURITY_PAA_TOKEN_SIGNING_KEY=prettypleasereplacemeinproductio # 32 characters
  -v conf:/etc/rdpgw

```

```
你没理解我的意思，我想改造现在的oidc服务端，预制好rdpgw客户端的所有信息，
oidc的id：rdpgw
oidc客户端访地址：https://192.168.1.60:9443
oidc的PROVIDER_URL：https://192.168.1.2:3000/auth/reams/rdpgw
oidc客户端SECRET：01cd304c-6f43-4480-9479-618eb6fd578f
```

```
http://192.168.1.60:8080/auth/realms/rdpgw/protocol/openid-connect/auth?client_id=rdpgw&redirect_uri=https%3A%2F%2F192.168.1.60%3A9443%2Fcallback&response_type=code&scope=openid+profile+email&state=2ab6cac84a3b8e87b5b68d5dc2a52cf0
```

```
https://192.168.1.60:9443/connect?host=192.168.1.61:3389
https://192.168.1.60:9443/connect
```

```
https://192.168.1.60:9443/callback?code=bcfe5f6b3a52680add80791a5e3b1926e3a740df&state=f1b2284e023c4febd84ffadb248ea85b
```

```
http://192.168.1.60:8080/auth/realms/rdpgw/protocol/openid-connect/auth?client_id=rdpgw&redirect_uri=https%3A%2F%2F192.168.1.60%3A9443%2Fcallback&response_type=code&scope=openid+profile+email&state=031151c97a45bc904d3f1791303bdd99
```

```
http://192.168.1.60:3000/authorize?client_id=rdpgw&redirect_uri=https%3A%2F%2F192.168.1.60%3A9443%2Fcallback&response_type=code&scope=openid+profile+email&state=4061e0935b3746a9ddf6b722edf3cd54
```

```
Login Success
Access Token: eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDLVpCbnMzRzViMHVxUlBQWkZ1XzZCZlFYUVFod3lJWnpIT1YyRXNzRTgwIn0.eyJleHAiOjE3NjE3Njc4MDcsImlhdCI6MTc2MTc2NzUwNywiYXV0aF90aW1lIjoxNzYxNzY3NTA3LCJqdGkiOiJvbnJ0YWM6Y2IxZGM3MDgtOTQxYS0zZWM0LWRjYmEtMzJhNzVkYzM0Mjk0IiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMS42MDo4MDgwL2F1dGgvcmVhbG1zL3JkcGd3IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImNmODhhNTIxLTQzNWQtNGQwMC1hMmExLWI2Mjk0OTJhNWNjZSIsInR5cCI6IkJlYXJlciIsImF6cCI6InJkcGd3Iiwic2lkIjoiYzAxYmUyOWEtY2U1Ni1kZmM1LWM5MGEtZDY2NDgwOTYyYWQ5IiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiYWRtaW4gYWRtaW4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiIsImdpdmVuX25hbWUiOiJhZG1pbiIsImZhbWlseV9uYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQHJkcGd3In0.kHf-tUqRfUtq3dNNx9SYrGzYzjoswLH_U6O8w4D_ywG0TNIJd7dTKTjMbJ88Tat9jg4Rc2mRCKvmPX4UYfXfTnxfvW3DC7DmO-gJkFtT78jLOLoQFHECpF5URV7yBbg2DWqdoK2mY2Lh6-dfDPfGaisEB_dIKJ1ml6fk8acstbLXWH40B0RsiGhU8t8wdal4m-4SOAVwDCWyOOi0LRF4Wep2DCsOeANKhbTjIZW5n5DGW3SKrDrxNBdHaTMe2yHzVMzEXa2HHhgz0xkZCaAo7NA2e5zW6qsV8NtuCACsgPmzCmVeQcZVHeNrF7kid_q0qJES1t5r0Am8UOuBvu0xhw

ID Token: eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDLVpCbnMzRzViMHVxUlBQWkZ1XzZCZlFYUVFod3lJWnpIT1YyRXNzRTgwIn0.eyJleHAiOjE3NjE3Njc4MDcsImlhdCI6MTc2MTc2NzUwNywiYXV0aF90aW1lIjoxNzYxNzY3NTA3LCJqdGkiOiIwNDQ1MDQ2ZS01MGZlLTEzNjctNTNiNy1hZWI5NzM2N2Q5ODgiLCJpc3MiOiJodHRwOi8vMTkyLjE2OC4xLjYwOjgwODAvYXV0aC9yZWFsbXMvcmRwZ3ciLCJhdWQiOiJyZHBndyIsInN1YiI6ImNmODhhNTIxLTQzNWQtNGQwMC1hMmExLWI2Mjk0OTJhNWNjZSIsInR5cCI6IklEIiwiYXpwIjoicmRwZ3ciLCJzaWQiOiJjMDFiZTI5YS1jZTU2LWRmYzUtYzkwYS1kNjY0ODA5NjJhZDkiLCJhdF9oYXNoIjoicE1RTWV2TXp3ckdrcmR3NENCUnRZZyIsImFjciI6IjEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6ImFkbWluIGFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRtaW4iLCJnaXZlbl9uYW1lIjoiYWRtaW4iLCJmYW1pbHlfbmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkByZHBndyJ9.Yy78vE9D2Ca-Hkq6TnlhlYivkbUTZ2Liim7sVd94Y3sG53W5hsgU8B69qDkuLABFrLBDDIrEb807mk_0IS_SguWWgFaI7t_j0eDLTmHjR6ek_9id52LGQXnaMVx6wGIg6ytkkzBsoMDf7qPq-AOrtG9LynuwRS7BFBSSmCeVkeXyb0rxZC-wTsI1YGb5LRfc27GBjLCxS0agky4RAULLJlGcvjYytzBD1k6-iKVLnW-CB7sXr2A7v8p49flUM0bEvRJPIvUIVv7o_kMOmrgAu7nJF3G5t8t7ljaHYKVG2v9pmejTU_9W5GzvW6qOvBkksqafGrhUAYA1E5DiLOSeXA

User Info: {"sub":"cf88a521-435d-4d00-a2a1-b629492a5cce","email_verified":true,"name":"admin admin","preferred_username":"admin","given_name":"admin","family_name":"admin","email":"admin@rdpgw"}
```

```
Login Success
User Info:
{
  "sub": "cf88a521-435d-4d00-a2a1-b629492a5cce",
  "email_verified": true,
  "name": "admin admin",
  "preferred_username": "admin",
  "given_name": "admin",
  "family_name": "admin",
  "email": "admin@rdpgw"
}
Client Info (from Introspection):
{
  "exp": 1761768919,
  "iat": 1761768619,
  "auth_time": 1761767507,
  "jti": "onrtac:9e01eed3-8ef0-c468-7c5e-86b338227ead",
  "iss": "http://192.168.1.60:8080/auth/realms/rdpgw",
  "aud": "account",
  "sub": "cf88a521-435d-4d00-a2a1-b629492a5cce",
  "typ": "Bearer",
  "azp": "rdpgw",
  "sid": "c01be29a-ce56-dfc5-c90a-d66480962ad9",
  "acr": "0",
  "realm_access": {
    "roles": [
      "offline_access",
      "uma_authorization"
    ]
  },
  "resource_access": {
    "account": {
      "roles": [
        "manage-account",
        "manage-account-links",
        "view-profile"
      ]
    }
  },
  "scope": "openid profile email",
  "email_verified": true,
  "name": "admin admin",
  "preferred_username": "admin",
  "given_name": "admin",
  "family_name": "admin",
  "email": "admin@rdpgw",
  "client_id": "rdpgw",
  "username": "admin",
  "token_type": "Bearer",
  "active": true
}
Tokens:
Access Token: eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDLVpCbnMzRzViMHVxUlBQWkZ1XzZCZlFYUVFod3lJWnpIT1YyRXNzRTgwIn0.eyJleHAiOjE3NjE3Njg5MTksImlhdCI6MTc2MTc2ODYxOSwiYXV0aF90aW1lIjoxNzYxNzY3NTA3LCJqdGkiOiJvbnJ0YWM6OWUwMWVlZDMtOGVmMC1jNDY4LTdjNWUtODZiMzM4MjI3ZWFkIiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMS42MDo4MDgwL2F1dGgvcmVhbG1zL3JkcGd3IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImNmODhhNTIxLTQzNWQtNGQwMC1hMmExLWI2Mjk0OTJhNWNjZSIsInR5cCI6IkJlYXJlciIsImF6cCI6InJkcGd3Iiwic2lkIjoiYzAxYmUyOWEtY2U1Ni1kZmM1LWM5MGEtZDY2NDgwOTYyYWQ5IiwiYWNyIjoiMCIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiYWRtaW4gYWRtaW4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiIsImdpdmVuX25hbWUiOiJhZG1pbiIsImZhbWlseV9uYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQHJkcGd3In0.E6ey-X8mcNytHWC9qJUEVyvPoOIpNluQpWVlFMYFfgFTqtNgKCNE0oe0olpOpPv1qDBvypBfTIEi7x-57gRC7lpJ9AkWNNNn6laNI6boqc8xY5XkJAThszDPaYJZB1q3Crqc-ZiwjOkPIP_o2eFlSs2YqnI18gkIFRsooehYPNV_9xzfa2zlG1Dh31pZvbGTEXnoqskMUCDDFl295Wkjti9KXRQQWvVjQppFYYsRy0QQEPhWsC9UPqTJZlH4ZQuR2W6R17VZUBzl6eBpyiu9yVrmWL8yL4yXVcoSg8EqP9igHtlH6uuCWQFbS4Bv7Cw8WA0n60_hNRR5u20DQdbv7g

ID Token: eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDLVpCbnMzRzViMHVxUlBQWkZ1XzZCZlFYUVFod3lJWnpIT1YyRXNzRTgwIn0.eyJleHAiOjE3NjE3Njg5MTksImlhdCI6MTc2MTc2ODYxOSwiYXV0aF90aW1lIjoxNzYxNzY3NTA3LCJqdGkiOiJlMjM2MDY3OC0zYTU0LWVkOWEtYmNlZi1mZGQyMjFhZWNkZGIiLCJpc3MiOiJodHRwOi8vMTkyLjE2OC4xLjYwOjgwODAvYXV0aC9yZWFsbXMvcmRwZ3ciLCJhdWQiOiJyZHBndyIsInN1YiI6ImNmODhhNTIxLTQzNWQtNGQwMC1hMmExLWI2Mjk0OTJhNWNjZSIsInR5cCI6IklEIiwiYXpwIjoicmRwZ3ciLCJzaWQiOiJjMDFiZTI5YS1jZTU2LWRmYzUtYzkwYS1kNjY0ODA5NjJhZDkiLCJhdF9oYXNoIjoielNKcTQtY0c2czRhVGZUV1dRcnVvUSIsImFjciI6IjAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6ImFkbWluIGFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRtaW4iLCJnaXZlbl9uYW1lIjoiYWRtaW4iLCJmYW1pbHlfbmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkByZHBndyJ9.bNqAfIxFJ92oO5KoCeQofFcWO-f3EDGMO_CWYOu2LE45jXkkPlR4cH769zd4aF2GeQgnzAXYwdtRJPZ8bnVU-b1pBZPjEElw5UEyofClHweY2FOMa-tIB0xD0LWtEtqL6bzUoM3Zb54zbaAyfVMkOE51Qtqa-RjrmgOMRhzJzTqkj526lmB30EbeKRxecgbv-ri4gSLdUFkalhnhuBRq_RkBq2yQ67B8OBNBNXQTvufXii8fbD2NZD4U9Im8Q5mvIvdM-h7KrpzJqgQft1ROS-ggmcOp-Qa3Xof46krryDC9OUm3STMH3ZORC7B9C9VdXBkEC-Q2M5FbihAVGjAXEA
```

```
Login Success
User Info:
{
  "sub": "cf88a521-435d-4d00-a2a1-b629492a5cce",
  "email_verified": true,
  "name": "admin admin",
  "preferred_username": "admin",
  "given_name": "admin",
  "family_name": "admin",
  "email": "admin@rdpgw"
}
Client Info (from Introspection):
{
  "exp": 1761770678,
  "iat": 1761770378,
  "auth_time": 1761767507,
  "jti": "onrtac:ce6f5067-2a61-6b73-b6d8-9c85d808d5a1",
  "iss": "http://192.168.1.60:8080/auth/realms/rdpgw",
  "aud": "account",
  "sub": "cf88a521-435d-4d00-a2a1-b629492a5cce",
  "typ": "Bearer",
  "azp": "rdpgw",
  "sid": "c01be29a-ce56-dfc5-c90a-d66480962ad9",
  "acr": "0",
  "realm_access": {
    "roles": [
      "offline_access",
      "uma_authorization"
    ]
  },
  "resource_access": {
    "account": {
      "roles": [
        "manage-account",
        "manage-account-links",
        "view-profile"
      ]
    }
  },
  "scope": "openid profile email",
  "email_verified": true,
  "name": "admin admin",
  "preferred_username": "admin",
  "given_name": "admin",
  "family_name": "admin",
  "email": "admin@rdpgw",
  "client_id": "rdpgw",
  "username": "admin",
  "token_type": "Bearer",
  "active": true
}
All Clients (Admin API):
[
  {
    "id": "189f9f54-53c4-4ee6-953d-89cd7ffb57e5",
    "clientId": "account",
    "name": "${client_account}",
    "rootUrl": "${authBaseUrl}",
    "baseUrl": "/realms/rdpgw/account/",
    "surrogateAuthRequired": false,
    "enabled": true,
    "alwaysDisplayInConsole": false,
    "clientAuthenticatorType": "client-secret",
    "secret": "c69db5d7-c439-4d35-a2c1-08c4fdb3688b",
    "redirectUris": [
      "/realms/rdpgw/account/*"
    ],
    "webOrigins": [],
    "notBefore": 0,
    "bearerOnly": false,
    "consentRequired": false,
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": false,
    "serviceAccountsEnabled": false,
    "publicClient": false,
    "frontchannelLogout": false,
    "protocol": "openid-connect",
    "attributes": {
      "realm_client": "false",
      "post.logout.redirect.uris": "+"
    },
    "authenticationFlowBindingOverrides": {},
    "fullScopeAllowed": false,
    "nodeReRegistrationTimeout": 0,
    "defaultClientScopes": [
      "web-origins",
      "acr",
      "profile",
      "roles",
      "basic",
      "email"
    ],
    "optionalClientScopes": [
      "address",
      "phone",
      "offline_access",
      "microprofile-jwt"
    ],
    "access": {
      "view": true,
      "configure": true,
      "manage": true
    }
  },
  {
    "id": "4a2267f8-f5ec-476e-80d7-ed3de9192b2c",
    "clientId": "account-console",
    "name": "${client_account-console}",
    "rootUrl": "${authBaseUrl}",
    "baseUrl": "/realms/rdpgw/account/",
    "surrogateAuthRequired": false,
    "enabled": true,
    "alwaysDisplayInConsole": false,
    "clientAuthenticatorType": "client-secret",
    "redirectUris": [
      "/realms/rdpgw/account/*"
    ],
    "webOrigins": [],
    "notBefore": 0,
    "bearerOnly": false,
    "consentRequired": false,
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": false,
    "serviceAccountsEnabled": false,
    "publicClient": true,
    "frontchannelLogout": false,
    "protocol": "openid-connect",
    "attributes": {
      "realm_client": "false",
      "post.logout.redirect.uris": "+",
      "pkce.code.challenge.method": "S256"
    },
    "authenticationFlowBindingOverrides": {},
    "fullScopeAllowed": false,
    "nodeReRegistrationTimeout": 0,
    "protocolMappers": [
      {
        "id": "ed550929-d497-46c1-a9d7-6651bd18376c",
        "name": "audience resolve",
        "protocol": "openid-connect",
        "protocolMapper": "oidc-audience-resolve-mapper",
        "consentRequired": false,
        "config": {}
      }
    ],
    "defaultClientScopes": [
      "web-origins",
      "acr",
      "profile",
      "roles",
      "basic",
      "email"
    ],
    "optionalClientScopes": [
      "address",
      "phone",
      "offline_access",
      "microprofile-jwt"
    ],
    "access": {
      "view": true,
      "configure": true,
      "manage": true
    }
  },
  {
    "id": "52e68355-e534-44cb-8eeb-7dff46f0e6dd",
    "clientId": "admin-cli",
    "name": "${client_admin-cli}",
    "surrogateAuthRequired": false,
    "enabled": true,
    "alwaysDisplayInConsole": false,
    "clientAuthenticatorType": "client-secret",
    "redirectUris": [],
    "webOrigins": [],
    "notBefore": 0,
    "bearerOnly": false,
    "consentRequired": false,
    "standardFlowEnabled": false,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": true,
    "serviceAccountsEnabled": false,
    "publicClient": true,
    "frontchannelLogout": false,
    "protocol": "openid-connect",
    "attributes": {
      "realm_client": "false",
      "client.use.lightweight.access.token.enabled": "true",
      "post.logout.redirect.uris": "+"
    },
    "authenticationFlowBindingOverrides": {},
    "fullScopeAllowed": true,
    "nodeReRegistrationTimeout": 0,
    "defaultClientScopes": [
      "web-origins",
      "acr",
      "profile",
      "roles",
      "basic",
      "email"
    ],
    "optionalClientScopes": [
      "address",
      "phone",
      "offline_access",
      "microprofile-jwt"
    ],
    "access": {
      "view": true,
      "configure": true,
      "manage": true
    }
  },
  {
    "id": "2cbb3518-9901-4d6c-b11c-f686651a974b",
    "clientId": "broker",
    "name": "${client_broker}",
    "surrogateAuthRequired": false,
    "enabled": true,
    "alwaysDisplayInConsole": false,
    "clientAuthenticatorType": "client-secret",
    "secret": "088c21ed-165d-4e5a-bce3-e78755992f93",
    "redirectUris": [],
    "webOrigins": [],
    "notBefore": 0,
    "bearerOnly": false,
    "consentRequired": false,
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": false,
    "serviceAccountsEnabled": false,
    "publicClient": false,
    "frontchannelLogout": false,
    "protocol": "openid-connect",
    "attributes": {
      "realm_client": "true",
      "post.logout.redirect.uris": "+"
    },
    "authenticationFlowBindingOverrides": {},
    "fullScopeAllowed": false,
    "nodeReRegistrationTimeout": 0,
    "defaultClientScopes": [
      "web-origins",
      "acr",
      "profile",
      "roles",
      "basic",
      "email"
    ],
    "optionalClientScopes": [
      "address",
      "phone",
      "offline_access",
      "microprofile-jwt"
    ],
    "access": {
      "view": true,
      "configure": true,
      "manage": true
    }
  },
  {
    "id": "3d5c3a65-8cdc-44ba-8796-3297643b75fc",
    "clientId": "rdpgw",
    "surrogateAuthRequired": false,
    "enabled": true,
    "alwaysDisplayInConsole": false,
    "clientAuthenticatorType": "client-secret",
    "secret": "01cd304c-6f43-4480-9479-618eb6fd578f",
    "redirectUris": [
      "*"
    ],
    "webOrigins": [],
    "notBefore": 0,
    "bearerOnly": false,
    "consentRequired": false,
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": true,
    "serviceAccountsEnabled": false,
    "publicClient": false,
    "frontchannelLogout": false,
    "protocol": "openid-connect",
    "attributes": {
      "saml.assertion.signature": "false",
      "saml.force.post.binding": "false",
      "saml.multivalued.roles": "false",
      "saml.encrypt": "false",
      "post.logout.redirect.uris": "+",
      "saml.server.signature": "false",
      "saml.server.signature.keyinfo.ext": "false",
      "exclude.session.state.from.auth.response": "false",
      "realm_client": "false",
      "saml_force_name_id_format": "false",
      "saml.client.signature": "false",
      "tls.client.certificate.bound.access.tokens": "false",
      "saml.authnstatement": "false",
      "display.on.consent.screen": "false",
      "saml.onetimeuse.condition": "false"
    },
    "authenticationFlowBindingOverrides": {},
    "fullScopeAllowed": true,
    "nodeReRegistrationTimeout": -1,
    "defaultClientScopes": [
      "web-origins",
      "acr",
      "profile",
      "roles",
      "basic",
      "email"
    ],
    "optionalClientScopes": [
      "address",
      "phone",
      "offline_access",
      "microprofile-jwt"
    ],
    "access": {
      "view": true,
      "configure": true,
      "manage": true
    }
  },
  {
    "id": "3cb3e0b6-30c5-489d-be07-108091a5001c",
    "clientId": "realm-management",
    "name": "${client_realm-management}",
    "surrogateAuthRequired": false,
    "enabled": true,
    "alwaysDisplayInConsole": false,
    "clientAuthenticatorType": "client-secret",
    "redirectUris": [],
    "webOrigins": [],
    "notBefore": 0,
    "bearerOnly": true,
    "consentRequired": false,
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": false,
    "serviceAccountsEnabled": false,
    "publicClient": false,
    "frontchannelLogout": false,
    "protocol": "openid-connect",
    "attributes": {
      "realm_client": "true",
      "post.logout.redirect.uris": "+"
    },
    "authenticationFlowBindingOverrides": {},
    "fullScopeAllowed": false,
    "nodeReRegistrationTimeout": 0,
    "defaultClientScopes": [
      "web-origins",
      "profile",
      "roles",
      "email"
    ],
    "optionalClientScopes": [
      "address",
      "phone",
      "offline_access",
      "microprofile-jwt"
    ],
    "access": {
      "view": true,
      "configure": true,
      "manage": true
    }
  },
  {
    "id": "2b47364b-4842-4a4d-a2f2-85d3a68fecab",
    "clientId": "security-admin-console",
    "name": "${client_security-admin-console}",
    "rootUrl": "${authAdminUrl}",
    "baseUrl": "/admin/rdpgw/console/",
    "surrogateAuthRequired": false,
    "enabled": true,
    "alwaysDisplayInConsole": false,
    "clientAuthenticatorType": "client-secret",
    "redirectUris": [
      "/admin/rdpgw/console/*"
    ],
    "webOrigins": [
      "+"
    ],
    "notBefore": 0,
    "bearerOnly": false,
    "consentRequired": false,
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": false,
    "serviceAccountsEnabled": false,
    "publicClient": true,
    "frontchannelLogout": false,
    "protocol": "openid-connect",
    "attributes": {
      "realm_client": "false",
      "client.use.lightweight.access.token.enabled": "true",
      "post.logout.redirect.uris": "+",
      "pkce.code.challenge.method": "S256"
    },
    "authenticationFlowBindingOverrides": {},
    "fullScopeAllowed": true,
    "nodeReRegistrationTimeout": 0,
    "protocolMappers": [
      {
        "id": "6441f21d-7608-404a-8d29-9c652a55a585",
        "name": "locale",
        "protocol": "openid-connect",
        "protocolMapper": "oidc-usermodel-attribute-mapper",
        "consentRequired": false,
        "config": {
          "user.attribute": "locale",
          "id.token.claim": "true",
          "access.token.claim": "true",
          "claim.name": "locale",
          "jsonType.label": "String",
          "userinfo.token.claim": "true"
        }
      }
    ],
    "defaultClientScopes": [
      "web-origins",
      "acr",
      "profile",
      "roles",
      "basic",
      "email"
    ],
    "optionalClientScopes": [
      "address",
      "phone",
      "offline_access",
      "microprofile-jwt"
    ],
    "access": {
      "view": true,
      "configure": true,
      "manage": true
    }
  }
]
All Users (Admin API):
[
  {
    "id": "cf88a521-435d-4d00-a2a1-b629492a5cce",
    "username": "admin",
    "firstName": "admin",
    "lastName": "admin",
    "email": "admin@rdpgw",
    "emailVerified": true,
    "userProfileMetadata": {
      "attributes": [
        {
          "name": "username",
          "displayName": "${username}",
          "required": true,
          "readOnly": true,
          "validators": {
            "username-prohibited-characters": {
              "ignore.empty.value": true
            },
            "multivalued": {
              "max": "1"
            },
            "length": {
              "max": 255,
              "ignore.empty.value": true,
              "min": 3
            },
            "up-username-not-idn-homograph": {
              "ignore.empty.value": true
            }
          },
          "multivalued": false
        },
        {
          "name": "email",
          "displayName": "${email}",
          "required": false,
          "readOnly": false,
          "validators": {
            "multivalued": {
              "max": "1"
            },
            "length": {
              "max": 255,
              "ignore.empty.value": true
            },
            "email": {
              "ignore.empty.value": true
            }
          },
          "multivalued": false
        },
        {
          "name": "firstName",
          "displayName": "${firstName}",
          "required": false,
          "readOnly": false,
          "validators": {
            "person-name-prohibited-characters": {
              "ignore.empty.value": true
            },
            "multivalued": {
              "max": "1"
            },
            "length": {
              "max": 255,
              "ignore.empty.value": true
            }
          },
          "multivalued": false
        },
        {
          "name": "lastName",
          "displayName": "${lastName}",
          "required": false,
          "readOnly": false,
          "validators": {
            "person-name-prohibited-characters": {
              "ignore.empty.value": true
            },
            "multivalued": {
              "max": "1"
            },
            "length": {
              "max": 255,
              "ignore.empty.value": true
            }
          },
          "multivalued": false
        }
      ],
      "groups": [
        {
          "name": "user-metadata",
          "displayHeader": "User metadata",
          "displayDescription": "Attributes, which refer to user metadata"
        }
      ]
    },
    "enabled": true,
    "createdTimestamp": 1595913346106,
    "totp": false,
    "disableableCredentialTypes": [],
    "requiredActions": [],
    "notBefore": 0,
    "access": {
      "manage": true
    }
  }
]
Tokens:
Access Token: eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDLVpCbnMzRzViMHVxUlBQWkZ1XzZCZlFYUVFod3lJWnpIT1YyRXNzRTgwIn0.eyJleHAiOjE3NjE3NzA2NzgsImlhdCI6MTc2MTc3MDM3OCwiYXV0aF90aW1lIjoxNzYxNzY3NTA3LCJqdGkiOiJvbnJ0YWM6Y2U2ZjUwNjctMmE2MS02YjczLWI2ZDgtOWM4NWQ4MDhkNWExIiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMS42MDo4MDgwL2F1dGgvcmVhbG1zL3JkcGd3IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImNmODhhNTIxLTQzNWQtNGQwMC1hMmExLWI2Mjk0OTJhNWNjZSIsInR5cCI6IkJlYXJlciIsImF6cCI6InJkcGd3Iiwic2lkIjoiYzAxYmUyOWEtY2U1Ni1kZmM1LWM5MGEtZDY2NDgwOTYyYWQ5IiwiYWNyIjoiMCIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiYWRtaW4gYWRtaW4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiIsImdpdmVuX25hbWUiOiJhZG1pbiIsImZhbWlseV9uYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQHJkcGd3In0.RU-eumLxuTM9ex1-xlnDVRVaM4YAfh_fdOrf-MC_C43hsIbX097By85FCE2ftur36PhJP-Ysp_esKrIAB0-HSwJhpZy2EIHfmcmSOjALToHtdMF7mpjSFYXB931qLGNKNHyiyYaYY4PmI7bMQnHAxGwLqWCvXk6_YvXV0RL6V60gRF0z3egdYf5SYLAHlamYhS9BXqqS18-sZvBOBPGOu_kHZTg_vIhOt_LRsPCVE7_JMRf4izTe5ldjbbLbu29CIMDmYGlANQMYu8RVpIDWlHVAyOLrWerSWZZZqfjrInamFG3B-lnyfRskIxdidmi_oz1f82g3dXFdxLdHSU6ISQ

ID Token: eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDLVpCbnMzRzViMHVxUlBQWkZ1XzZCZlFYUVFod3lJWnpIT1YyRXNzRTgwIn0.eyJleHAiOjE3NjE3NzA2NzgsImlhdCI6MTc2MTc3MDM3OCwiYXV0aF90aW1lIjoxNzYxNzY3NTA3LCJqdGkiOiJlZjU4MjczMy1hNzkzLTlmOGQtNTZjYi1jMzExYmJjYjVlZGEiLCJpc3MiOiJodHRwOi8vMTkyLjE2OC4xLjYwOjgwODAvYXV0aC9yZWFsbXMvcmRwZ3ciLCJhdWQiOiJyZHBndyIsInN1YiI6ImNmODhhNTIxLTQzNWQtNGQwMC1hMmExLWI2Mjk0OTJhNWNjZSIsInR5cCI6IklEIiwiYXpwIjoicmRwZ3ciLCJzaWQiOiJjMDFiZTI5YS1jZTU2LWRmYzUtYzkwYS1kNjY0ODA5NjJhZDkiLCJhdF9oYXNoIjoiN3lqV2NmQ0lTajVVS1VEUVcwd01BZyIsImFjciI6IjAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6ImFkbWluIGFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRtaW4iLCJnaXZlbl9uYW1lIjoiYWRtaW4iLCJmYW1pbHlfbmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkByZHBndyJ9.BnKS8DMhFDRFTpBQ7yMaV6w30beIN-y91DjBSqJYCW4ttT5eKIJpCWj82qJTb64wHcYSDakBf3d6pukc3eBTVG1t365bcsUKc7tnMIeMJx27OQiQmBbU_uuy5PY2nIWUOiixVm_KkX6qxaJxMmyeyoeOFOtAjzJxRe8suaAFt7i-iV-z_jU8qW6DyTDvE7Podz47SyolTVQT8GFtjZ2Yw6ZaJ6BoUIuB03bOJ5ZEoYe5ATAjLyptO5M_1jzoPvEEKULxUyigHgjx6ee9Ai-zE8AT2fYbX6gb043qmNhXOIlbxwxbDJyXW8ddobdxLFLEz7qDUY71FrjDHJKMhc2e7A
```

````
Login Success
User Info:
{
  "sub": "cf88a521-435d-4d00-a2a1-b629492a5cce",
  "email_verified": true,
  "name": "admin admin",
  "preferred_username": "admin",
  "given_name": "admin",
  "family_name": "admin",
  "email": "admin@rdpgw"
}
Token Introspection:
{
  "exp": 1761771825,
  "iat": 1761771525,
  "auth_time": 1761767507,
  "jti": "onrtac:61219b8a-aa9b-91bb-6a3b-acd674f18325",
  "iss": "http://192.168.1.60:8080/auth/realms/rdpgw",
  "aud": "account",
  "sub": "cf88a521-435d-4d00-a2a1-b629492a5cce",
  "typ": "Bearer",
  "azp": "rdpgw",
  "sid": "c01be29a-ce56-dfc5-c90a-d66480962ad9",
  "acr": "0",
  "realm_access": {
    "roles": [
      "offline_access",
      "uma_authorization"
    ]
  },
  "resource_access": {
    "account": {
      "roles": [
        "manage-account",
        "manage-account-links",
        "view-profile"
      ]
    }
  },
  "scope": "openid profile email",
  "email_verified": true,
  "name": "admin admin",
  "preferred_username": "admin",
  "given_name": "admin",
  "family_name": "admin",
  "email": "admin@rdpgw",
  "client_id": "rdpgw",
  "username": "admin",
  "token_type": "Bearer",
  "active": true
}
All Clients:
[
  {
    "id": "189f9f54-53c4-4ee6-953d-89cd7ffb57e5",
    "clientId": "account",
    "name": "${client_account}",
    "rootUrl": "${authBaseUrl}",
    "baseUrl": "/realms/rdpgw/account/",
    "surrogateAuthRequired": false,
    "enabled": true,
    "alwaysDisplayInConsole": false,
    "clientAuthenticatorType": "client-secret",
    "secret": "c69db5d7-c439-4d35-a2c1-08c4fdb3688b",
    "redirectUris": [
      "/realms/rdpgw/account/*"
    ],
    "webOrigins": [],
    "notBefore": 0,
    "bearerOnly": false,
    "consentRequired": false,
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": false,
    "serviceAccountsEnabled": false,
    "publicClient": false,
    "frontchannelLogout": false,
    "protocol": "openid-connect",
    "attributes": {
      "realm_client": "false",
      "post.logout.redirect.uris": "+"
    },
    "authenticationFlowBindingOverrides": {},
    "fullScopeAllowed": false,
    "nodeReRegistrationTimeout": 0,
    "defaultClientScopes": [
      "web-origins",
      "acr",
      "profile",
      "roles",
      "basic",
      "email"
    ],
    "optionalClientScopes": [
      "address",
      "phone",
      "offline_access",
      "microprofile-jwt"
    ],
    "access": {
      "view": true,
      "configure": true,
      "manage": true
    }
  },
  {
    "id": "4a2267f8-f5ec-476e-80d7-ed3de9192b2c",
    "clientId": "account-console",
    "name": "${client_account-console}",
    "rootUrl": "${authBaseUrl}",
    "baseUrl": "/realms/rdpgw/account/",
    "surrogateAuthRequired": false,
    "enabled": true,
    "alwaysDisplayInConsole": false,
    "clientAuthenticatorType": "client-secret",
    "redirectUris": [
      "/realms/rdpgw/account/*"
    ],
    "webOrigins": [],
    "notBefore": 0,
    "bearerOnly": false,
    "consentRequired": false,
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": false,
    "serviceAccountsEnabled": false,
    "publicClient": true,
    "frontchannelLogout": false,
    "protocol": "openid-connect",
    "attributes": {
      "realm_client": "false",
      "post.logout.redirect.uris": "+",
      "pkce.code.challenge.method": "S256"
    },
    "authenticationFlowBindingOverrides": {},
    "fullScopeAllowed": false,
    "nodeReRegistrationTimeout": 0,
    "protocolMappers": [
      {
        "id": "ed550929-d497-46c1-a9d7-6651bd18376c",
        "name": "audience resolve",
        "protocol": "openid-connect",
        "protocolMapper": "oidc-audience-resolve-mapper",
        "consentRequired": false,
        "config": {}
      }
    ],
    "defaultClientScopes": [
      "web-origins",
      "acr",
      "profile",
      "roles",
      "basic",
      "email"
    ],
    "optionalClientScopes": [
      "address",
      "phone",
      "offline_access",
      "microprofile-jwt"
    ],
    "access": {
      "view": true,
      "configure": true,
      "manage": true
    }
  },
  {
    "id": "52e68355-e534-44cb-8eeb-7dff46f0e6dd",
    "clientId": "admin-cli",
    "name": "${client_admin-cli}",
    "surrogateAuthRequired": false,
    "enabled": true,
    "alwaysDisplayInConsole": false,
    "clientAuthenticatorType": "client-secret",
    "redirectUris": [],
    "webOrigins": [],
    "notBefore": 0,
    "bearerOnly": false,
    "consentRequired": false,
    "standardFlowEnabled": false,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": true,
    "serviceAccountsEnabled": false,
    "publicClient": true,
    "frontchannelLogout": false,
    "protocol": "openid-connect",
    "attributes": {
      "realm_client": "false",
      "client.use.lightweight.access.token.enabled": "true",
      "post.logout.redirect.uris": "+"
    },
    "authenticationFlowBindingOverrides": {},
    "fullScopeAllowed": true,
    "nodeReRegistrationTimeout": 0,
    "defaultClientScopes": [
      "web-origins",
      "acr",
      "profile",
      "roles",
      "basic",
      "email"
    ],
    "optionalClientScopes": [
      "address",
      "phone",
      "offline_access",
      "microprofile-jwt"
    ],
    "access": {
      "view": true,
      "configure": true,
      "manage": true
    }
  },
  {
    "id": "2cbb3518-9901-4d6c-b11c-f686651a974b",
    "clientId": "broker",
    "name": "${client_broker}",
    "surrogateAuthRequired": false,
    "enabled": true,
    "alwaysDisplayInConsole": false,
    "clientAuthenticatorType": "client-secret",
    "secret": "088c21ed-165d-4e5a-bce3-e78755992f93",
    "redirectUris": [],
    "webOrigins": [],
    "notBefore": 0,
    "bearerOnly": false,
    "consentRequired": false,
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": false,
    "serviceAccountsEnabled": false,
    "publicClient": false,
    "frontchannelLogout": false,
    "protocol": "openid-connect",
    "attributes": {
      "realm_client": "true",
      "post.logout.redirect.uris": "+"
    },
    "authenticationFlowBindingOverrides": {},
    "fullScopeAllowed": false,
    "nodeReRegistrationTimeout": 0,
    "defaultClientScopes": [
      "web-origins",
      "acr",
      "profile",
      "roles",
      "basic",
      "email"
    ],
    "optionalClientScopes": [
      "address",
      "phone",
      "offline_access",
      "microprofile-jwt"
    ],
    "access": {
      "view": true,
      "configure": true,
      "manage": true
    }
  },
  {
    "id": "3d5c3a65-8cdc-44ba-8796-3297643b75fc",
    "clientId": "rdpgw",
    "surrogateAuthRequired": false,
    "enabled": true,
    "alwaysDisplayInConsole": false,
    "clientAuthenticatorType": "client-secret",
    "secret": "01cd304c-6f43-4480-9479-618eb6fd578f",
    "redirectUris": [
      "*"
    ],
    "webOrigins": [],
    "notBefore": 0,
    "bearerOnly": false,
    "consentRequired": false,
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": true,
    "serviceAccountsEnabled": false,
    "publicClient": false,
    "frontchannelLogout": false,
    "protocol": "openid-connect",
    "attributes": {
      "saml.assertion.signature": "false",
      "saml.force.post.binding": "false",
      "saml.multivalued.roles": "false",
      "saml.encrypt": "false",
      "post.logout.redirect.uris": "+",
      "saml.server.signature": "false",
      "saml.server.signature.keyinfo.ext": "false",
      "exclude.session.state.from.auth.response": "false",
      "realm_client": "false",
      "saml_force_name_id_format": "false",
      "saml.client.signature": "false",
      "tls.client.certificate.bound.access.tokens": "false",
      "saml.authnstatement": "false",
      "display.on.consent.screen": "false",
      "saml.onetimeuse.condition": "false"
    },
    "authenticationFlowBindingOverrides": {},
    "fullScopeAllowed": true,
    "nodeReRegistrationTimeout": -1,
    "defaultClientScopes": [
      "web-origins",
      "acr",
      "profile",
      "roles",
      "basic",
      "email"
    ],
    "optionalClientScopes": [
      "address",
      "phone",
      "offline_access",
      "microprofile-jwt"
    ],
    "access": {
      "view": true,
      "configure": true,
      "manage": true
    }
  },
  {
    "id": "3cb3e0b6-30c5-489d-be07-108091a5001c",
    "clientId": "realm-management",
    "name": "${client_realm-management}",
    "surrogateAuthRequired": false,
    "enabled": true,
    "alwaysDisplayInConsole": false,
    "clientAuthenticatorType": "client-secret",
    "redirectUris": [],
    "webOrigins": [],
    "notBefore": 0,
    "bearerOnly": true,
    "consentRequired": false,
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": false,
    "serviceAccountsEnabled": false,
    "publicClient": false,
    "frontchannelLogout": false,
    "protocol": "openid-connect",
    "attributes": {
      "realm_client": "true",
      "post.logout.redirect.uris": "+"
    },
    "authenticationFlowBindingOverrides": {},
    "fullScopeAllowed": false,
    "nodeReRegistrationTimeout": 0,
    "defaultClientScopes": [
      "web-origins",
      "profile",
      "roles",
      "email"
    ],
    "optionalClientScopes": [
      "address",
      "phone",
      "offline_access",
      "microprofile-jwt"
    ],
    "access": {
      "view": true,
      "configure": true,
      "manage": true
    }
  },
  {
    "id": "2b47364b-4842-4a4d-a2f2-85d3a68fecab",
    "clientId": "security-admin-console",
    "name": "${client_security-admin-console}",
    "rootUrl": "${authAdminUrl}",
    "baseUrl": "/admin/rdpgw/console/",
    "surrogateAuthRequired": false,
    "enabled": true,
    "alwaysDisplayInConsole": false,
    "clientAuthenticatorType": "client-secret",
    "redirectUris": [
      "/admin/rdpgw/console/*"
    ],
    "webOrigins": [
      "+"
    ],
    "notBefore": 0,
    "bearerOnly": false,
    "consentRequired": false,
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": false,
    "serviceAccountsEnabled": false,
    "publicClient": true,
    "frontchannelLogout": false,
    "protocol": "openid-connect",
    "attributes": {
      "realm_client": "false",
      "client.use.lightweight.access.token.enabled": "true",
      "post.logout.redirect.uris": "+",
      "pkce.code.challenge.method": "S256"
    },
    "authenticationFlowBindingOverrides": {},
    "fullScopeAllowed": true,
    "nodeReRegistrationTimeout": 0,
    "protocolMappers": [
      {
        "id": "6441f21d-7608-404a-8d29-9c652a55a585",
        "name": "locale",
        "protocol": "openid-connect",
        "protocolMapper": "oidc-usermodel-attribute-mapper",
        "consentRequired": false,
        "config": {
          "user.attribute": "locale",
          "id.token.claim": "true",
          "access.token.claim": "true",
          "claim.name": "locale",
          "jsonType.label": "String",
          "userinfo.token.claim": "true"
        }
      }
    ],
    "defaultClientScopes": [
      "web-origins",
      "acr",
      "profile",
      "roles",
      "basic",
      "email"
    ],
    "optionalClientScopes": [
      "address",
      "phone",
      "offline_access",
      "microprofile-jwt"
    ],
    "access": {
      "view": true,
      "configure": true,
      "manage": true
    }
  }
]
All Users:
[
  {
    "id": "cf88a521-435d-4d00-a2a1-b629492a5cce",
    "username": "admin",
    "firstName": "admin",
    "lastName": "admin",
    "email": "admin@rdpgw",
    "emailVerified": true,
    "userProfileMetadata": {
      "attributes": [
        {
          "name": "username",
          "displayName": "${username}",
          "required": true,
          "readOnly": true,
          "validators": {
            "username-prohibited-characters": {
              "ignore.empty.value": true
            },
            "multivalued": {
              "max": "1"
            },
            "length": {
              "max": 255,
              "ignore.empty.value": true,
              "min": 3
            },
            "up-username-not-idn-homograph": {
              "ignore.empty.value": true
            }
          },
          "multivalued": false
        },
        {
          "name": "email",
          "displayName": "${email}",
          "required": false,
          "readOnly": false,
          "validators": {
            "multivalued": {
              "max": "1"
            },
            "length": {
              "max": 255,
              "ignore.empty.value": true
            },
            "email": {
              "ignore.empty.value": true
            }
          },
          "multivalued": false
        },
        {
          "name": "firstName",
          "displayName": "${firstName}",
          "required": false,
          "readOnly": false,
          "validators": {
            "person-name-prohibited-characters": {
              "ignore.empty.value": true
            },
            "multivalued": {
              "max": "1"
            },
            "length": {
              "max": 255,
              "ignore.empty.value": true
            }
          },
          "multivalued": false
        },
        {
          "name": "lastName",
          "displayName": "${lastName}",
          "required": false,
          "readOnly": false,
          "validators": {
            "person-name-prohibited-characters": {
              "ignore.empty.value": true
            },
            "multivalued": {
              "max": "1"
            },
            "length": {
              "max": 255,
              "ignore.empty.value": true
            }
          },
          "multivalued": false
        }
      ],
      "groups": [
        {
          "name": "user-metadata",
          "displayHeader": "User metadata",
          "displayDescription": "Attributes, which refer to user metadata"
        }
      ]
    },
    "enabled": true,
    "createdTimestamp": 1595913346106,
    "totp": false,
    "disableableCredentialTypes": [],
    "requiredActions": [],
    "notBefore": 0,
    "access": {
      "manage": true
    }
  }
]
All Roles:
[
  {
    "id": "fbe3d870-1ab5-417b-aa2e-95bbedb04215",
    "name": "default-roles-rdpgw",
    "description": "${role_default-roles}",
    "composite": true,
    "clientRole": false,
    "containerId": "rdpgw"
  },
  {
    "id": "7d3e9415-407c-4701-978f-7a74da6475fd",
    "name": "offline_access",
    "description": "${role_offline-access}",
    "composite": false,
    "clientRole": false,
    "containerId": "rdpgw"
  },
  {
    "id": "f9204e59-ba61-4a16-be12-8e887b0f0dde",
    "name": "uma_authorization",
    "description": "${role_uma_authorization}",
    "composite": false,
    "clientRole": false,
    "containerId": "rdpgw"
  }
]
All Groups:
[]
Authentication Flows:
[
  {
    "id": "e8ff7ab3-6563-48b7-be51-95964de28761",
    "alias": "browser",
    "description": "browser based authentication",
    "providerId": "basic-flow",
    "topLevel": true,
    "builtIn": true,
    "authenticationExecutions": [
      {
        "authenticator": "auth-cookie",
        "authenticatorFlow": false,
        "requirement": "ALTERNATIVE",
        "priority": 10,
        "autheticatorFlow": false,
        "userSetupAllowed": false
      },
      {
        "authenticator": "auth-spnego",
        "authenticatorFlow": false,
        "requirement": "DISABLED",
        "priority": 20,
        "autheticatorFlow": false,
        "userSetupAllowed": false
      },
      {
        "authenticator": "identity-provider-redirector",
        "authenticatorFlow": false,
        "requirement": "ALTERNATIVE",
        "priority": 25,
        "autheticatorFlow": false,
        "userSetupAllowed": false
      },
      {
        "authenticatorFlow": true,
        "requirement": "ALTERNATIVE",
        "priority": 30,
        "autheticatorFlow": true,
        "flowAlias": "forms",
        "userSetupAllowed": false
      }
    ]
  },
  {
    "id": "974c609c-25f5-47f9-8adf-3704d49e7260",
    "alias": "clients",
    "description": "Base authentication for clients",
    "providerId": "client-flow",
    "topLevel": true,
    "builtIn": true,
    "authenticationExecutions": [
      {
        "authenticator": "client-secret",
        "authenticatorFlow": false,
        "requirement": "ALTERNATIVE",
        "priority": 10,
        "autheticatorFlow": false,
        "userSetupAllowed": false
      },
      {
        "authenticator": "client-jwt",
        "authenticatorFlow": false,
        "requirement": "ALTERNATIVE",
        "priority": 20,
        "autheticatorFlow": false,
        "userSetupAllowed": false
      },
      {
        "authenticator": "client-secret-jwt",
        "authenticatorFlow": false,
        "requirement": "ALTERNATIVE",
        "priority": 30,
        "autheticatorFlow": false,
        "userSetupAllowed": false
      },
      {
        "authenticator": "client-x509",
        "authenticatorFlow": false,
        "requirement": "ALTERNATIVE",
        "priority": 40,
        "autheticatorFlow": false,
        "userSetupAllowed": false
      }
    ]
  },
  {
    "id": "b3020265-1e8b-4335-aa74-42695a31e883",
    "alias": "direct grant",
    "description": "OpenID Connect Resource Owner Grant",
    "providerId": "basic-flow",
    "topLevel": true,
    "builtIn": true,
    "authenticationExecutions": [
      {
        "authenticator": "direct-grant-validate-username",
        "authenticatorFlow": false,
        "requirement": "REQUIRED",
        "priority": 10,
        "autheticatorFlow": false,
        "userSetupAllowed": false
      },
      {
        "authenticator": "direct-grant-validate-password",
        "authenticatorFlow": false,
        "requirement": "REQUIRED",
        "priority": 20,
        "autheticatorFlow": false,
        "userSetupAllowed": false
      },
      {
        "authenticatorFlow": true,
        "requirement": "CONDITIONAL",
        "priority": 30,
        "autheticatorFlow": true,
        "flowAlias": "Direct Grant - Conditional OTP",
        "userSetupAllowed": false
      }
    ]
  },
  {
    "id": "1a9660a3-d943-4194-a730-0f6180d117e4",
    "alias": "docker auth",
    "description": "Used by Docker clients to authenticate against the IDP",
    "providerId": "basic-flow",
    "topLevel": true,
    "builtIn": true,
    "authenticationExecutions": [
      {
        "authenticator": "docker-http-basic-authenticator",
        "authenticatorFlow": false,
        "requirement": "REQUIRED",
        "priority": 10,
        "autheticatorFlow": false,
        "userSetupAllowed": false
      }
    ]
  },
  {
    "id": "89da7a79-acef-4e64-bf60-f5bb8e1da08f",
    "alias": "first broker login",
    "description": "Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account",
    "providerId": "basic-flow",
    "topLevel": true,
    "builtIn": true,
    "authenticationExecutions": [
      {
        "authenticatorConfig": "review profile config",
        "authenticator": "idp-review-profile",
        "authenticatorFlow": false,
        "requirement": "REQUIRED",
        "priority": 10,
        "autheticatorFlow": false,
        "userSetupAllowed": false
      },
      {
        "authenticatorFlow": true,
        "requirement": "REQUIRED",
        "priority": 20,
        "autheticatorFlow": true,
        "flowAlias": "User creation or linking",
        "userSetupAllowed": false
      }
    ]
  },
  {
    "id": "b961a8c5-beaa-4868-94f5-1f66b859dfe2",
    "alias": "registration",
    "description": "registration flow",
    "providerId": "basic-flow",
    "topLevel": true,
    "builtIn": true,
    "authenticationExecutions": [
      {
        "authenticator": "registration-page-form",
        "authenticatorFlow": true,
        "requirement": "REQUIRED",
        "priority": 10,
        "autheticatorFlow": true,
        "flowAlias": "registration form",
        "userSetupAllowed": false
      }
    ]
  },
  {
    "id": "76b03ccd-1420-4fd3-9e9a-4458da896775",
    "alias": "reset credentials",
    "description": "Reset credentials for a user if they forgot their password or something",
    "providerId": "basic-flow",
    "topLevel": true,
    "builtIn": true,
    "authenticationExecutions": [
      {
        "authenticator": "reset-credentials-choose-user",
        "authenticatorFlow": false,
        "requirement": "REQUIRED",
        "priority": 10,
        "autheticatorFlow": false,
        "userSetupAllowed": false
      },
      {
        "authenticator": "reset-credential-email",
        "authenticatorFlow": false,
        "requirement": "REQUIRED",
        "priority": 20,
        "autheticatorFlow": false,
        "userSetupAllowed": false
      },
      {
        "authenticator": "reset-password",
        "authenticatorFlow": false,
        "requirement": "REQUIRED",
        "priority": 30,
        "autheticatorFlow": false,
        "userSetupAllowed": false
      },
      {
        "authenticatorFlow": true,
        "requirement": "CONDITIONAL",
        "priority": 40,
        "autheticatorFlow": true,
        "flowAlias": "Reset - Conditional OTP",
        "userSetupAllowed": false
      }
    ]
  }
]
Tokens:
Access Token: eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDLVpCbnMzRzViMHVxUlBQWkZ1XzZCZlFYUVFod3lJWnpIT1YyRXNzRTgwIn0.eyJleHAiOjE3NjE3NzE4MjUsImlhdCI6MTc2MTc3MTUyNSwiYXV0aF90aW1lIjoxNzYxNzY3NTA3LCJqdGkiOiJvbnJ0YWM6NjEyMTliOGEtYWE5Yi05MWJiLTZhM2ItYWNkNjc0ZjE4MzI1IiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMS42MDo4MDgwL2F1dGgvcmVhbG1zL3JkcGd3IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImNmODhhNTIxLTQzNWQtNGQwMC1hMmExLWI2Mjk0OTJhNWNjZSIsInR5cCI6IkJlYXJlciIsImF6cCI6InJkcGd3Iiwic2lkIjoiYzAxYmUyOWEtY2U1Ni1kZmM1LWM5MGEtZDY2NDgwOTYyYWQ5IiwiYWNyIjoiMCIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiYWRtaW4gYWRtaW4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiIsImdpdmVuX25hbWUiOiJhZG1pbiIsImZhbWlseV9uYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQHJkcGd3In0.VMJGLWjV-veuz_L_ba9q_357z0x9jZl04nZwiAw6RjTMzADrmufoZBHlzP67xTq_RjXQOdqfCc_UHVCOpY7nQUQkS_rMeDQUm8D5w9fmT8WeLwueIpo-CB7uZziA44FUcDbpq2id9GSqzd9QRaNOEoirtwJJE5NG8tykkXxSrASbZzaoxa4QL77IpqXlgJ-Jrw9N16V6HyfZAdmOiAfDZj32LXUmilVd-4R-NklL-OdQK5oSQ2-k8BKYFSKyVPh4qJHpwkGkSFVaMWZ4PRKQA2pp0SVMIiZjMJ7E8_ib6nAlsvx-1nEUiAvO8nvhQy9h81Zmb2ugY_g3FVegEPSHvw

ID Token: eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDLVpCbnMzRzViMHVxUlBQWkZ1XzZCZlFYUVFod3lJWnpIT1YyRXNzRTgwIn0.eyJleHAiOjE3NjE3NzE4MjUsImlhdCI6MTc2MTc3MTUyNSwiYXV0aF90aW1lIjoxNzYxNzY3NTA3LCJqdGkiOiI2YTllMmE5MS02ZGM0LTcwNTItNGEwMC1hMzkxYTA5MDFmZjEiLCJpc3MiOiJodHRwOi8vMTkyLjE2OC4xLjYwOjgwODAvYXV0aC9yZWFsbXMvcmRwZ3ciLCJhdWQiOiJyZHBndyIsInN1YiI6ImNmODhhNTIxLTQzNWQtNGQwMC1hMmExLWI2Mjk0OTJhNWNjZSIsInR5cCI6IklEIiwiYXpwIjoicmRwZ3ciLCJzaWQiOiJjMDFiZTI5YS1jZTU2LWRmYzUtYzkwYS1kNjY0ODA5NjJhZDkiLCJhdF9oYXNoIjoiY0x5MzJCaU1ITHFKbmJpdVdQNmQyQSIsImFjciI6IjAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6ImFkbWluIGFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRtaW4iLCJnaXZlbl9uYW1lIjoiYWRtaW4iLCJmYW1pbHlfbmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkByZHBndyJ9.A8BhXxhHpvKrLO_pLWaDQA2n1UZpSGQK87LJlY1kLy5470iMxp_6_OMg6XvrfvGIjTr6RaOfAnEexj_eubDginJsJJcGtxHxowF9efFU60ZL_huqYYUdpFPF4of5z9qIP7FAvcQTEDq_w2Aa8zachNIgREFQIAFcmlqxf4-ADyE46YRGXzmK1bQ9OLhRXlCnYkZx8Wpy1R-mOLWSDp2njqWxqeg-jRB0-i7uQ9qfnHZq4mz0wm4voEnDF3imGLI1lMdCf3edk8L6Hl33dQ-1IsJn0C0MOn5eUQOuMz3GZsqAnfYNq-yhKjU6awv60wEuq4xDp7Rir06NqG-Ppsw4tQ
````

获取keycloak所有的client.js

```
// server.js
import express from 'express';
import axios from 'axios';
import qs from 'querystring';
import https from 'https';
import fs from 'fs';

const app = express();
const PORT = 443;

// ================= OIDC / Keycloak 配置 =================
const PROVIDER_URL = 'http://192.168.1.60:8080/auth/realms/rdpgw';
const CLIENT_ID = 'rdpgw';
const CLIENT_SECRET = '01cd304c-6f43-4480-9479-618eb6fd578f';
const REDIRECT_URI = 'https://192.168.1.2:443/callback';

// Keycloak Admin 用户 (用于调用 Admin API)
const ADMIN_REALM = 'master';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin'; // 请修改成你的 admin 密码

// ================= 首页 =================
app.get('/', (req, res) => {
  const authUrl = `${PROVIDER_URL}/protocol/openid-connect/auth?` +
    `client_id=${CLIENT_ID}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  res.send(`<a href="${authUrl}">Login with OIDC</a>`);
});

// ================= 回调地址 =================
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('No code received');

  try {
    // 1️⃣ 获取用户 token
    const tokenResp = await axios.post(
      `${PROVIDER_URL}/protocol/openid-connect/token`,
      qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const { access_token, id_token } = tokenResp.data;

    // 2️⃣ 获取用户信息
    const userInfoResp = await axios.get(
      `${PROVIDER_URL}/protocol/openid-connect/userinfo`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    // 3️⃣ token introspection
    const introspectResp = await axios.post(
      `${PROVIDER_URL}/protocol/openid-connect/token/introspect`,
      qs.stringify({ token: access_token, client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    // 4️⃣ 获取 Admin Token
    const adminTokenResp = await axios.post(
      `http://192.168.1.60:8080/auth/realms/${ADMIN_REALM}/protocol/openid-connect/token`,
      qs.stringify({
        grant_type: 'password',
        client_id: 'admin-cli',
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const adminToken = adminTokenResp.data.access_token;

    // ================= Admin API: 获取全部信息 =================

    // 获取所有客户端
    const clientsResp = await axios.get(
      `http://192.168.1.60:8080/auth/admin/realms/rdpgw/clients`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    // 获取所有用户
    const usersResp = await axios.get(
      `http://192.168.1.60:8080/auth/admin/realms/rdpgw/users`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    // 获取所有角色（Realm roles）
    const rolesResp = await axios.get(
      `http://192.168.1.60:8080/auth/admin/realms/rdpgw/roles`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    // 获取所有组
    const groupsResp = await axios.get(
      `http://192.168.1.60:8080/auth/admin/realms/rdpgw/groups`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    // 获取认证流程（Authentication Flows）
    const authFlowsResp = await axios.get(
      `http://192.168.1.60:8080/auth/admin/realms/rdpgw/authentication/flows`,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    // ================= 返回整合信息 =================
    res.send(`
      <h1>Login Success</h1>
      <h2>User Info:</h2>
      <pre>${JSON.stringify(userInfoResp.data, null, 2)}</pre>

      <h2>Token Introspection:</h2>
      <pre>${JSON.stringify(introspectResp.data, null, 2)}</pre>

      <h2>All Clients:</h2>
      <pre>${JSON.stringify(clientsResp.data, null, 2)}</pre>

      <h2>All Users:</h2>
      <pre>${JSON.stringify(usersResp.data, null, 2)}</pre>

      <h2>All Roles:</h2>
      <pre>${JSON.stringify(rolesResp.data, null, 2)}</pre>

      <h2>All Groups:</h2>
      <pre>${JSON.stringify(groupsResp.data, null, 2)}</pre>

      <h2>Authentication Flows:</h2>
      <pre>${JSON.stringify(authFlowsResp.data, null, 2)}</pre>

      <h2>Tokens:</h2>
      <p>Access Token: ${access_token}</p>
      <p>ID Token: ${id_token}</p>
    `);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error fetching all server info');
  }
});

// ================= 启动 HTTPS 服务器 =================
const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`OIDC client listening at https://localhost:${PORT}`);
});

```

