# 搭建oidc-provider服务

这个oidc服务主要为rdpgw提供身份认证

## 一、开发测试版本

测试版本取消了很多安全冗余设计，方便测试理解

```js
// 导入必要的模块
import fs from 'fs';           // 文件系统模块，用于读取证书文件
import https from 'https';       // HTTPS 模块，用于创建 HTTPS 服务器
import express from 'express';   // Express 框架，用于处理 HTTP 请求
import { Provider } from 'oidc-provider';  // OIDC 提供者模块，用于实现 OpenID Connect 功能

// 环境变量控制发行者与端口
// 这里硬编码为 3000，生产环境中建议使用环境变量
const PORT = 3000;

// 使用 HTTPS 的 URL
// 发行者 URL，用于标识 OIDC 提供者的唯一地址
const ISSUER_URL = `https://192.168.1.2:${PORT}`;

/**
 * 检查证书文件是否存在
 * 如果证书文件不存在，输出错误信息并退出进程
 */
const checkCertificates = () => {
    // 检查私钥文件是否存在
    if (!fs.existsSync('./server.key')) {
        console.error('Error: server.key file not found');
        process.exit(1);
    }
    // 检查证书文件是否存在
    if (!fs.existsSync('./server.crt')) {
        console.error('Error: server.crt file not found');
        process.exit(1);
    }
};

// 执行证书检查
checkCertificates();

// 读取证书
// HTTPS 服务器配置选项
const options = {
    key: fs.readFileSync('./server.key'),  // 读取私钥文件
    cert: fs.readFileSync('./server.crt'), // 读取证书文件
};

// 用户数据
// 存储用户信息的对象，这里只包含一个 admin 用户
const users = {
    'admin': { sub: 'admin', username: 'admin', password: 'abc@2021', email: 'admin@example.com' }
};

// 客户端
// 存储 OIDC 客户端信息的数组
const clients = [{
    client_id: 'rdpgw',                            // 客户端 ID
    client_secret: '01cd304c-6f43-4480-9479-618eb6fd578f',  // 客户端密钥
    redirect_uris: ['https://192.168.1.50:9443/callback'],  // 重定向 URI
    response_types: ['code'],                      // 响应类型，使用授权码模式
    grant_types: ['authorization_code'],           // 授权类型，使用授权码模式
    token_endpoint_auth_method: 'client_secret_basic',  // 令牌端点认证方法
}];

// 配置
// OIDC 提供者的配置对象
const configuration = {
    clients,  // 客户端配置
    features: {
        devInteractions: { enabled: false },  // 禁用开发模式交互界面
        introspection: { enabled: true },     // 启用令牌内省功能
        revocation: { enabled: true },        // 启用令牌撤销功能
    },
    cookies: {
        keys: ['dev-secret'],  // Cookie 签名密钥，生产环境应使用安全的随机值
        secure: true,          // 只通过 HTTPS 发送 Cookie
        httpOnly: true,        // 禁止 JavaScript 访问 Cookie
        sameSite: 'lax',       // 限制跨站 Cookie 发送
    },
    claims: {
        // 定义不同作用域下返回的声明
        openid: ['sub', 'username', 'preferred_username'],  // openid 作用域返回的声明
        profile: ['username', 'preferred_username', 'email'],  // profile 作用域返回的声明
    },
    // 查找用户账户的函数
    findAccount: async (ctx, id) => {
        const user = users[id];  // 根据 ID 查找用户
        if (!user) return undefined;  // 如果用户不存在，返回 undefined

        // 返回账户对象，包含账户 ID 和获取声明的方法
        return {
            accountId: id,
            // 异步函数，根据作用域返回用户声明
            async claims(use, scope) {
                return {
                    sub: user.sub,                  // 主题标识符
                    username: user.username,        // 用户名
                    preferred_username: user.username,  // 首选用户名
                    email: user.email,              // 电子邮件
                };
            },
        };
    },
    // 配置登录和同意页面的 URL
    interactions: {
        url: (ctx, interaction) => {
            const { prompt } = interaction;
            // 如果是同意提示，返回同意页面 URL
            if (prompt && prompt.name === 'consent') {
                return `/interaction/${interaction.uid}/consent`;
            }
            // 否则返回登录页面 URL
            return `/interaction/${interaction.uid}`;
        },
    },
};

// 启动 Provider
// 创建 OIDC 提供者实例
const oidc = new Provider(ISSUER_URL, configuration);

// 创建 Express 应用实例
const app = express();

// 配置 CORS (跨域资源共享)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');  // 允许所有来源，生产环境应限制为特定域名
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');  // 允许的 HTTP 方法
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // 允许的 HTTP 头部
    if (req.method === 'OPTIONS') {
        return res.status(200).end();  // 处理 OPTIONS 请求
    }
    next();  // 继续处理请求
});

// 解析请求体
// 解析 URL 编码的请求体
app.use(express.urlencoded({ extended: true }));
// 解析 JSON 格式的请求体
app.use(express.json());

// 健康检查端点
// 用于监控服务状态
app.get('/health', (req, res) => res.status(200).send('ok'));

// 登录页面
// 处理登录页面请求
app.get('/interaction/:uid', async (req, res) => {
    try {
        // 获取交互详情
        const details = await oidc.interactionDetails(req, res);
        const { uid, prompt, params } = details;
        
        // 打印交互详情，用于调试
        console.log('Interaction details:', JSON.stringify(details, null, 2));
        console.log('Prompt:', prompt);
        console.log('Params:', params);
        
        // 简单的登录表单
        res.send(`
            <html>
                <head>
                    <title>Login</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; }
                        .login-form { max-width: 300px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                        .form-group { margin-bottom: 15px; }
                        label { display: block; margin-bottom: 5px; }
                        input { width: 100%; padding: 8px; box-sizing: border-box; }
                        button { width: 100%; padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; }
                        button:hover { background-color: #45a049; }
                        .error { color: red; margin-top: 10px; }
                    </style>
                </head>
                <body>
                    <div class="login-form">
                        <h2>Login</h2>
                        <form method="post" action="/interaction/${uid}/login">
                            <div class="form-group">
                                <label>Username:</label>
                                <input type="text" name="username" required>
                            </div>
                            <div class="form-group">
                                <label>Password:</label>
                                <input type="password" name="password" required>
                            </div>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        // 处理错误
        console.error('Error rendering login page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// 处理登录提交
// 处理登录表单提交
app.post('/interaction/:uid/login', async (req, res) => {
    try {
        const { uid } = req.params;
        const { username, password } = req.body;
        
        // 打印登录尝试信息
        console.log('Login attempt for user:', username);
        console.log('Interaction ID:', uid);
        
        // 用户验证
        const user = users[username];
        if (!user || user.password !== password) {
            // 验证失败
            console.log('Invalid credentials for user:', username);
            return res.send(`
                <html>
                    <head>
                        <title>Login Error</title>
                    </head>
                    <body>
                        <h2>Invalid credentials</h2>
                        <p>Please try again.</p>
                        <a href="/interaction/${uid}">Back to login</a>
                    </body>
                </html>
            `);
        }
        
        // 登录成功
        console.log('Login successful for user:', username);
        
        // 构建登录结果
        const result = {
            login: {
                accountId: user.sub,  // 使用用户的 sub 作为账户 ID
            },
        };
        
        console.log('Attempting to finish login interaction with result:', result);
        
        // 完成登录交互
        await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
        
        console.log('Login interaction finished successfully');
    } catch (error) {
        // 处理错误
        console.error('Error processing login:', error);
        res.status(500).send('Internal Server Error');
    }
});

// 同意页面
// 处理同意页面请求
app.get('/interaction/:uid/consent', async (req, res) => {
    try {
        // 获取交互详情
        const details = await oidc.interactionDetails(req, res);
        const { uid, prompt, params } = details;
        
        // 打印同意交互详情
        console.log('Consent interaction details:', JSON.stringify(details, null, 2));
        
        // 简单的同意表单
        res.send(`
            <html>
                <head>
                    <title>Consent</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; }
                        .consent-form { max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                        .scope-list { margin: 20px 0; }
                        .scope-item { margin: 5px 0; }
                        button { padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; }
                        button:hover { background-color: #45a049; }
                    </style>
                </head>
                <body>
                    <div class="consent-form">
                        <h2>Consent</h2>
                        <p>Client <strong>${params.client_id}</strong> is requesting access to:</p>
                        <div class="scope-list">
                            ${params.scope.split(' ').map(scope => `<div class="scope-item">• ${scope}</div>`).join('')}
                        </div>
                        <form method="post" action="/interaction/${uid}/consent">
                            <button type="submit">Allow</button>
                        </form>
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        // 处理错误
        console.error('Error rendering consent page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// 处理同意提交
// 处理同意表单提交
app.post('/interaction/:uid/consent', async (req, res) => {
    try {
        const { uid } = req.params;

        // 获取交互详情
        const interactionDetails = await oidc.interactionDetails(req, res);
        const { prompt, params, session } = interactionDetails;

        let grant;

        // 如果已经存在授权，找到并使用它
        if (interactionDetails.grantId) {
            grant = await oidc.Grant.find(interactionDetails.grantId);
        } else {
            // 否则创建新的授权
            grant = new oidc.Grant({
                accountId: session.accountId,  // 使用会话中的账户 ID
                clientId: params.client_id,    // 使用客户端 ID
            });
        }

        // 添加缺失的 OIDC 作用域
        if (prompt.details.missingOIDCScope) {
            grant.addOIDCScope(prompt.details.missingOIDCScope.join(' '));
        }

        // 保存授权
        const grantId = await grant.save();

        // 构建同意结果
        const result = { consent: { grantId } };

        // 完成同意交互
        await oidc.interactionFinished(req, res, result);

    } catch (err) {
        // 处理错误
        console.error(err);
        res.status(500).send('consent error');
    }
});

// 全局错误处理
// 处理所有未捕获的错误
app.use((err, req, res, next) => {
    console.error('Error:', err);
    // 返回错误响应
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500,
        },
    });
});

// 注册 oidc 路由
// 注册 OIDC 提供者的回调路由
app.use(oidc.callback());

// 用 HTTPS 启动
// 创建 HTTPS 服务器并启动
https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
    console.log(`OIDC Provider 运行在: ${ISSUER_URL}`);
    console.log(`健康检查: ${ISSUER_URL}/health`);
    console.log(`发现端点: ${ISSUER_URL}/.well-known/openid-configuration`);
});
```

## 二、生产版本

为方便测试，日志打印了每次启动生成的oidc用户密码，cookie密钥，客户端密钥

```js
import fs from 'fs';
import https from 'https';
import express from 'express';
import { Provider } from 'oidc-provider';
import crypto from 'crypto';

// 环境变量控制发行者与端口
const PORT = Number(process.env.PORT || 3000);

// 生成随机密码并加密
const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const bytes = crypto.randomBytes(36);
    let password = '';
    for (let i = 0; i < 36; i++) {
        password += chars.charAt(bytes[i] % chars.length);
    }
    return password;
};

// 每次启动生成admin用户密码
const password = generateRandomPassword();
console.log('Generated password:', password);

// 生成cookie密钥
const cookieKey = crypto.randomBytes(32).toString('hex');
console.log('Generated cookie key:', cookieKey);

// 生成客户端密钥
const clientSecret = crypto.randomBytes(16).toString('hex');
console.log('Generated client secret:', clientSecret);


// 使用 HTTPS 的 URL
const ISSUER_URL = `https://192.168.1.2:${PORT}`;

const Client_Host = 'https://192.168.1.50:9443';

// 检查证书文件是否存在
const checkCertificates = () => {
    if (!fs.existsSync('./server.key')) {
        console.error('Error: server.key file not found');
        process.exit(1);
    }
    if (!fs.existsSync('./server.crt')) {
        console.error('Error: server.crt file not found');
        process.exit(1);
    }
};

checkCertificates();

// 读取证书
const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
};

// 用户数据
const users = {
    'admin': { sub: 'admin', username: 'admin', password: password, email: 'admin@example.com' }
};

// 客户端
const clients = [{
    client_id: 'rdpgw',
    client_secret: clientSecret,
    redirect_uris: [`${Client_Host}/callback`],
    response_types: ['code'],
    grant_types: ['authorization_code'],
    token_endpoint_auth_method: 'client_secret_basic',
}];

// 配置
const configuration = {
    clients,
    features: {
        devInteractions: { enabled: false },
        introspection: { enabled: true },
        revocation: { enabled: true },
    },
cookies: {
  keys: [cookieKey],
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
},
    claims: {
        openid: ['sub', 'username', 'preferred_username'],
        profile: ['username', 'preferred_username', 'email'],
    },
    findAccount: async (ctx, id) => {
        const user = users[id];
        if (!user) return undefined;

        return {
            accountId: id,
            async claims(use, scope) {
                return {
                    sub: user.sub,
                    username: user.username,
                    preferred_username: user.username,
                    email: user.email,
                };
            },
        };
    },
    // 配置登录页面
    interactions: {
        url: (ctx, interaction) => {
            const { prompt } = interaction;
            if (prompt && prompt.name === 'consent') {
                return `/interaction/${interaction.uid}/consent`;
            }
            return `/interaction/${interaction.uid}`;
        },
    },
};

// 启动 Provider
const oidc = new Provider(ISSUER_URL, configuration);

const app = express();

// 允许的域名列表
const allowedOrigins = [Client_Host];

// 配置CORS和安全头部
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // 安全头部
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// 解析请求体
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => res.status(200).send('ok'));

// 登录页面
app.get('/interaction/:uid', async (req, res) => {
    try {
        const details = await oidc.interactionDetails(req, res);
        const { uid, prompt, params } = details;
        
        // HTML转义函数
        const escapeHtml = (str) => {
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        };
        
        // 简单的登录表单
        res.send(`
            <html>
                <head>
                    <title>Login</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; }
                        .login-form { max-width: 300px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                        .form-group { margin-bottom: 15px; }
                        label { display: block; margin-bottom: 5px; }
                        input { width: 100%; padding: 8px; box-sizing: border-box; }
                        button { width: 100%; padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; }
                        button:hover { background-color: #45a049; }
                        .error { color: red; margin-top: 10px; }
                    </style>
                </head>
                <body>
                    <div class="login-form">
                        <h2>Login</h2>
                        <form method="post" action="/interaction/${escapeHtml(uid)}/login">
                            <div class="form-group">
                                <label>Username:</label>
                                <input type="text" name="username" required>
                            </div>
                            <div class="form-group">
                                <label>Password:</label>
                                <input type="password" name="password" required>
                            </div>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error rendering login page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// 处理登录提交
app.post('/interaction/:uid/login', async (req, res) => {
    try {
        const { uid } = req.params;
        let { username, password } = req.body;
        
        // 输入验证
        if (!username || !password) {
            console.log('Missing username or password');
            // HTML转义函数
            const escapeHtml = (str) => {
                return str
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
            };
            return res.send(`
                <html>
                    <head>
                        <title>Login Error</title>
                    </head>
                    <body>
                        <h2>Missing username or password</h2>
                        <p>Please provide both username and password.</p>
                        <a href="/interaction/${escapeHtml(uid)}">Back to login</a>
                    </body>
                </html>
            `);
        }
        
        // 清理输入
        username = username.trim();
        password = password.trim();
        
        // 验证长度
        if (username.length < 3 || username.length > 20) {
            console.log('Invalid username length:', username);
            // HTML转义函数
            const escapeHtml = (str) => {
                return str
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
            };
            return res.send(`
                <html>
                    <head>
                        <title>Login Error</title>
                    </head>
                    <body>
                        <h2>Invalid username</h2>
                        <p>Username must be between 3 and 20 characters.</p>
                        <a href="/interaction/${escapeHtml(uid)}">Back to login</a>
                    </body>
                </html>
            `);
        }
        
        // 验证用户名格式（只允许字母、数字和下划线）
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            console.log('Invalid username format:', username);
            // HTML转义函数
            const escapeHtml = (str) => {
                return str
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
            };
            return res.send(`
                <html>
                    <head>
                        <title>Login Error</title>
                    </head>
                    <body>
                        <h2>Invalid username</h2>
                        <p>Username can only contain letters, numbers, and underscores.</p>
                        <a href="/interaction/${escapeHtml(uid)}">Back to login</a>
                    </body>
                </html>
            `);
        }
        
        console.log('Login attempt for user:', username);
        console.log('Interaction ID:', uid);
        
        // 用户验证
        const user = users[username];
        if (!user || user.password !== password) {
            console.log('Invalid credentials for user:', username);
            // HTML转义函数
            const escapeHtml = (str) => {
                return str
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
            };
            return res.send(`
                <html>
                    <head>
                        <title>Login Error</title>
                    </head>
                    <body>
                        <h2>Invalid credentials</h2>
                        <p>Please try again.</p>
                        <a href="/interaction/${escapeHtml(uid)}">Back to login</a>
                    </body>
                </html>
            `);
        }
        
        console.log('Login successful for user:', username);
        
        const result = {
            login: {
                accountId: user.sub,
            },
        };
        
        console.log('Attempting to finish login interaction with result:', result);
        
        await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
        
        console.log('Login interaction finished successfully');
    } catch (error) {
        console.error('Error processing login:', error);
        res.status(500).send('Internal Server Error');
    }
});

// 同意页面
app.get('/interaction/:uid/consent', async (req, res) => {
    try {
        const details = await oidc.interactionDetails(req, res);
        const { uid, prompt, params } = details;
        
        console.log('Consent interaction details:', JSON.stringify(details, null, 2));
        
        // HTML转义函数
        const escapeHtml = (str) => {
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        };
        
        // 简单的同意表单
        res.send(`
            <html>
                <head>
                    <title>Consent</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; }
                        .consent-form { max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                        .scope-list { margin: 20px 0; }
                        .scope-item { margin: 5px 0; }
                        button { padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; }
                        button:hover { background-color: #45a049; }
                    </style>
                </head>
                <body>
                    <div class="consent-form">
                        <h2>Consent</h2>
                        <p>Client <strong>${escapeHtml(params.client_id)}</strong> is requesting access to:</p>
                        <div class="scope-list">
                            ${params.scope.split(' ').map(scope => `<div class="scope-item">• ${escapeHtml(scope)}</div>`).join('')}
                        </div>
                        <form method="post" action="/interaction/${escapeHtml(uid)}/consent">
                            <button type="submit">Allow</button>
                        </form>
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error rendering consent page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// 处理同意提交
app.post('/interaction/:uid/consent', async (req, res) => {
    try {
        const { uid } = req.params;

        const interactionDetails = await oidc.interactionDetails(req, res);
        const { prompt, params, session } = interactionDetails;

        let grant;

        if (interactionDetails.grantId) {
            grant = await oidc.Grant.find(interactionDetails.grantId);
        } else {
            grant = new oidc.Grant({
                accountId: session.accountId,
                clientId: params.client_id,
            });
        }

        if (prompt && prompt.details && prompt.details.missingOIDCScope) {
            grant.addOIDCScope(prompt.details.missingOIDCScope.join(' '));
        }

        const grantId = await grant.save();

        const result = { consent: { grantId } };

        await oidc.interactionFinished(req, res, result);

    } catch (err) {
        console.error(err);
        res.status(500).send('consent error');
    }
});

// 全局错误处理
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // 始终返回通用错误信息，不暴露详细错误
    res.status(err.status || 500).json({
        error: {
            message: 'Internal Server Error',
            status: err.status || 500,
        },
    });
});

// 注册oidc路由
app.use(oidc.callback());

// 用 HTTPS 启动
https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
    console.log(`OIDC Provider 运行在: ${ISSUER_URL}`);
    console.log(`健康检查: ${ISSUER_URL}/health`);
    console.log(`发现端点: ${ISSUER_URL}/.well-known/openid-configuration`);
});
```

## 三、rdpgw客户端配置

rdpgw.yaml配置

```yaml
Server:
  Authentication:
    - openid
  BasicAuthTimeout: 5
  GatewayAddress: https://192.168.1.50:9443
  Port: 9443
  Hosts:
    - localhost:3389
  HostSelection: any
  Tls: auto
  CertFile: /etc/rdpgw/server.crt
  KeyFile: /etc/rdpgw/server.key
  SessionStore: cookie
  SessionKey: thisisasessionkeyreplacethisjetzt
  SessionEncryptionKey: thisisasessionkeyreplacethisnunu!
OpenId:
  ProviderUrl: https://192.168.1.2:3000
  ClientId: rdpgw
  ClientSecret: 01cd304c-6f43-4480-9479-618eb6fd578f
Caps:
 SmartCardAuth: false
 TokenAuth: true
 IdleTimeout: 10
 EnablePrinter: true
 EnablePort: true
 EnablePnp: true
 EnableDrive: true
 EnableClipboard: true
Client:
  defaults: /etc/rdpgw/default.rdp
  NoUsername: true
  SplitUserDomain: true
Security:
  PAATokenSigningKey: thisisasessionkeyreplacethisjetzt
  UserTokenEncryptionKey: thisisasessionkeyreplacethisjetzt
  EnableUserToken: false
  VerifyClientIp: false

```

## 四、rdpgw注意事项

- 证书生成

推荐使用openssl生成证书

```shell
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/rdpgw/server.key -out /etc/rdpgw/server.crt -subj "/C=CN/ST=Beng/O=Dev/OU=IT/CN=192.168.1.2" -addext "subjectAltName=DNS:localhost,IP:192.168.1.2"
```

- 系统载入证书

```shell
#复制到系统证书目录
cp server.crt /usr/local/share/ca-certificates/

#更新 CA 证书信任库
update-ca-certificates

#重启服务
systemctl restart rdpgw.service
```

- 测试获取rdp文件

在浏览器输入以下地址，通过oidc认证后获取rdp连接文件

```shell
https://192.168.1.50:9443/connect?host=192.168.1.110:3389
```

- rdpgw日志排查

```shell
journalctl -u inrdpgw.service -n 50 --no-pager
```

* 生成44位随机字符

用作rdpgw密钥

```shell
openssl rand -base64 32
```
