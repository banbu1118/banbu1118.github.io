# oidc-server测试搭建

## 版本1

### oidc服务端

```js
import express from 'express';
import { Provider } from 'oidc-provider';

// 环境变量控制发行者与端口
const PORT = Number(process.env.PORT || 3000);
const ISSUER_URL = `http://192.168.1.2:${PORT}`;

// 客户端
const clients = [{
    client_id: 'rdpgw',
    client_secret: '01cd304c-6f43-4480-9479-618eb6fd578f',
    redirect_uris: ['https://192.168.1.60:9443/callback'],
    response_types: ['code'],
    grant_types: ['authorization_code'],
    token_endpoint_auth_method: 'client_secret_basic',
}];

// 配置
const configuration = {
    clients,
    features: {
        devInteractions: { enabled: true },
        introspection: { enabled: true },
        revocation: { enabled: true },
    },
    cookies: {
        // 开发环境简单密钥，生产请使用安全密钥并通过环境变量传入
        keys: [process.env.COOKIE_KEY || 'dev-secret'],
    },
    claims: {
        // 定义 scope 返回字段
        openid: ['sub', 'username', 'preferred_username'],
        profile: ['username', 'preferred_username', 'email'],
    },
    findAccount: async (ctx, id) => {
        const users = {
            'admin': {
                sub: 'admin',
                username: 'admin',
                password: 'admin',
                email: 'admin@example.com',
            },
            'user01': {
                sub: 'user01',
                username: 'user01',
                password: '12345678',
                email: 'user01@example.com',
            },
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
                    preferred_username: user.username,
                    email: user.email,
                };
            },
        };
    },
};

// 启动 Provider 并用 Express 包装，提供 /health
const oidc = new Provider(ISSUER_URL, configuration);

const app = express();
app.get('/health', (req, res) => {
    res.status(200).send('ok');
});
app.use(oidc.callback());

app.listen(PORT,'127.0.0.1',() => {
    console.log(`OIDC Provider 运行在: ${ISSUER_URL}`);
});
```



### oidc客户端

rdpgw.yaml

```yaml
Server:
  Authentication:
    - openid
  BasicAuthTimeout: 5
  GatewayAddress: https://192.168.1.60:9443
  Port: 9443
  Hosts:
    - localhost:3389
  HostSelection: any
  Tls: auto
  CertFile: /etc/rdpgw/server.pem
  KeyFile: /etc/rdpgw/key.pem
  SessionStore: cookie
  SessionKey: thisisasessionkeyreplacethisjetzt
  SessionEncryptionKey: thisisasessionkeyreplacethisnunu!
OpenId:
  ProviderUrl: http://192.168.1.2:3000
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
  VerifyClientIp: true
```

## 版本2

### oidc服务端启用https

```js
import fs from 'fs';
import https from 'https';
import express from 'express';
import { Provider } from 'oidc-provider';

// 环境变量控制发行者与端口
const PORT = Number(process.env.PORT || 3000);

// 使用 HTTPS 的 URL
const ISSUER_URL = `https://192.168.1.2:${PORT}`;

// 读取证书
const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
};

// 客户端
const clients = [{
    client_id: 'rdpgw',
    client_secret: '01cd304c-6f43-4480-9479-618eb6fd578f',
    redirect_uris: ['https://192.168.1.60:9443/callback'],
    response_types: ['code'],
    grant_types: ['authorization_code'],
    token_endpoint_auth_method: 'client_secret_basic',
}];

// 配置
const configuration = {
    clients,
    features: {
        devInteractions: { enabled: true },
        introspection: { enabled: true },
        revocation: { enabled: true },
    },
    cookies: {
        keys: [process.env.COOKIE_KEY || 'dev-secret'],
    },
    claims: {
        openid: ['sub', 'username', 'preferred_username'],
        profile: ['username', 'preferred_username', 'email'],
    },
    findAccount: async (ctx, id) => {
        const users = {
            'admin': { sub: 'admin', username: 'admin', password: 'admin', email: 'admin@example.com' },
            'user01': { sub: 'user01', username: 'user01', password: '12345678', email: 'user01@example.com' },
        };
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
};

// 启动 Provider
const oidc = new Provider(ISSUER_URL, configuration);

const app = express();
app.get('/health', (req, res) => res.status(200).send('ok'));
app.use(oidc.callback());

// 用 HTTPS 启动
https.createServer(options, app).listen(PORT,'127.0.0.1',() => {
    console.log(`OIDC Provider 运行在: ${ISSUER_URL}`);
});
```

### oidc客户端

```js
Server:
  Authentication:
    - openid
  BasicAuthTimeout: 5
  GatewayAddress: https://192.168.1.60:9443
  #GatewayAddress: https://qiannian012.uunat.com:9443
  Port: 9443
  Hosts:
    - localhost:3389
  HostSelection: any
  Tls: auto
  CertFile: /etc/rdpgw/server.crt
  KeyFile: /etc/rdpgw/key.pem
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

### oidc加载证书

把oidc服务端的证书拷贝到oidc客户端的/etc/rdpgw/和Linux系统的/usr/local/share/ca-certificates/目录，把server.pem改名为server.crt，

```shell
# 创建证书配置文件
cat > server.cnf << 'EOF'
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
x509_extensions = v3_req

[dn]
C = CN
ST = Beijing
L = Beijing
O = Dev
OU = IT
CN = 192.168.1.2

[v3_req]
keyUsage = keyEncipherment, dataEncipherment, digitalSignature
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
IP.1 = 192.168.1.2
DNS.1 = localhost
EOF

# 生成私钥和证书请求
openssl req -new -newkey rsa:2048 -nodes \
  -keyout server.key -out server.csr -config server.cnf

# 生成自签名证书（包含SANs）
openssl x509 -req -days 365 -in server.csr \
  -signkey server.key -out server.crt -extensions v3_req -extfile server.cnf

#证书检查
openssl x509 -in server.crt -noout -text | grep -A 5 "Subject Alternative Name"

#记得改名

/etc/rdpgw/

/usr/local/share/ca-certificates/

#oidc客户端系统更新证书
update-ca-certificates
```

## 自动登陆获取rdp

### oidc服务端

```js
import fs from 'fs';
import https from 'https';
import express from 'express';
import { Provider } from 'oidc-provider';

// 环境变量控制发行者与端口
const PORT = Number(process.env.PORT || 3000);

// 使用 HTTPS 的 URL
const ISSUER_URL = `https://192.168.1.2:${PORT}`;

// 读取证书
const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
};

// 客户端
const clients = [{
    client_id: 'rdpgw',
    client_secret: '01cd304c-6f43-4480-9479-618eb6fd578f',
    redirect_uris: ['https://192.168.1.60:8443/callback'],
    response_types: ['code'],
    grant_types: ['authorization_code'],
    token_endpoint_auth_method: 'client_secret_basic',
}];

// 配置
const configuration = {
    clients,
    features: {
        devInteractions: { enabled: true },
        introspection: { enabled: true },
        revocation: { enabled: true },
    },
    cookies: {
        keys: [process.env.COOKIE_KEY || 'dev-secret'],
    },
    claims: {
        openid: ['sub', 'username', 'preferred_username'],
        profile: ['username', 'preferred_username', 'email'],
    },
    findAccount: async (ctx, id) => {
        const users = {
            'admin': { sub: 'admin', username: 'admin', password: 'admin', email: 'admin@example.com' },
            'user01': { sub: 'user01', username: 'user01', password: '12345678', email: 'user01@example.com' },
        };
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
};

// 启动 Provider
const oidc = new Provider(ISSUER_URL, configuration);

const app = express();
app.get('/health', (req, res) => res.status(200).send('ok'));
app.use(oidc.callback());

// 用 HTTPS 启动
https.createServer(options, app).listen(PORT,'127.0.0.1',() => {
    console.log(`OIDC Provider 运行在: ${ISSUER_URL}`);
});
```

### 自动登陆（模拟浏览器）

```js
import { chromium } from 'playwright';
import path from 'path';

async function loginAndDownload() {
  const browser = await chromium.launch({ headless: true }); // ✅ headless 模式
  const context = await browser.newContext({
    acceptDownloads: true,
    ignoreHTTPSErrors: true, // 忽略自签名证书
  });
  const page = await context.newPage();

  const downloadPath = process.cwd();
  console.log('下载文件将保存到：', downloadPath);

  // 1️⃣ 打开登录页面
  await page.goto('https://192.168.1.60:9443/connect?host=192.168.1.61:3389', { waitUntil: 'networkidle' });

  // 2️⃣ 填写登录表单
  await page.waitForSelector('form input[name="login"]', { timeout: 60000 });
  await page.fill('form input[name="login"]', 'admin');
  await page.fill('form input[name="password"]', 'admin');
  await page.click('button.login.login-submit');
  await page.waitForLoadState('networkidle');

  // 3️⃣ 点击 Authorize / Continue
  await page.waitForSelector('button:has-text("Continue")', { timeout: 60000 });

  // 触发下载
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("Continue")')
  ]);

  const savePath = path.join(downloadPath, 'template.rdp');
  await download.saveAs(savePath);
  console.log('文件已保存：', savePath);

  await browser.close();
}

loginAndDownload();
```

### http自动登陆

```js
import https from 'https';
import fs from 'fs';
import { parse } from 'node-html-parser';
import { URL } from 'url';

class OIDCAuth {
  constructor() {
    this.cookieJar = new Map(); // 使用 Map 来管理 Cookie
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    this.maxRedirects = 10;
  }

  // 解析和存储 Cookie
  parseCookies(setCookieHeaders) {
    if (!setCookieHeaders) return;
    
    setCookieHeaders.forEach(cookieHeader => {
      const cookie = cookieHeader.split(';')[0].trim();
      const [name, ...valueParts] = cookie.split('=');
      const value = valueParts.join('=');
      
      if (name && value) {
        this.cookieJar.set(name, value);
      }
    });
  }

  // 生成 Cookie 头
  getCookieHeader() {
    const cookies = [];
    for (const [name, value] of this.cookieJar) {
      cookies.push(`${name}=${value}`);
    }
    return cookies.join('; ');
  }

  async request(options, postData = null, redirectCount = 0) {
    return new Promise((resolve, reject) => {
      // 添加 Cookie 头
      const headers = {
        'User-Agent': this.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Cookie': this.getCookieHeader(),
        ...options.headers
      };

      const req = https.request({
        rejectUnauthorized: false,
        port: options.port || 443,
        ...options,
        headers
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          // 解析和存储新的 Cookie
          if (res.headers['set-cookie']) {
            this.parseCookies(res.headers['set-cookie']);
          }

          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            data,
            url: `https://${options.hostname}:${options.port || 443}${options.path}`
          };

          console.log(`请求完成: ${options.method} ${options.path} -> ${res.statusCode}`);
          console.log(`当前 Cookie 数量: ${this.cookieJar.size}`);

          // 处理重定向
          if ((res.statusCode === 302 || res.statusCode === 301 || res.statusCode === 303) && 
              res.headers.location && 
              redirectCount < this.maxRedirects) {
            console.log(`重定向 [${redirectCount + 1}/${this.maxRedirects}]: ${res.headers.location}`);
            this.handleRedirect(res.headers.location, options, postData, redirectCount + 1)
              .then(resolve)
              .catch(reject);
          } else {
            resolve(response);
          }
        });
      });
      
      if (postData) {
        req.write(postData);
      }
      req.on('error', reject);
      req.end();
    });
  }

  async handleRedirect(location, previousOptions, postData, redirectCount) {
    try {
      let url;
      if (location.startsWith('http')) {
        url = new URL(location);
      } else {
        const baseHost = previousOptions.hostname;
        const basePort = previousOptions.port || 443;
        url = new URL(location, `https://${baseHost}:${basePort}`);
      }

      const newOptions = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'Cookie': this.getCookieHeader()
        }
      };

      return await this.request(newOptions, null, redirectCount);
    } catch (error) {
      throw new Error(`重定向处理失败: ${error.message}`);
    }
  }

  saveDebugInfo(filename, content, response = null) {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      content: content,
      response: response ? {
        statusCode: response.statusCode,
        url: response.url,
        headers: response.headers
      } : null,
      cookies: Array.from(this.cookieJar.entries())
    };
    fs.writeFileSync(`${filename}.json`, JSON.stringify(debugInfo, null, 2));
    fs.writeFileSync(`${filename}.html`, content);
    console.log(`调试信息已保存到: ${filename}.json 和 ${filename}.html`);
  }

  async loginAndDownload() {
    try {
      console.log('开始 OIDC 认证流程...');
      console.log('初始 Cookie 数量:', this.cookieJar.size);
      
      // 1. 初始请求
      const initialResponse = await this.request({
        hostname: '192.168.1.60',
        port: 9443,
        path: '/connect?host=192.168.1.61:3389',
        method: 'GET'
      });

      console.log('初始请求完成，当前 Cookie 数量:', this.cookieJar.size);

      // 2. 如果最终到达登录页面，处理登录
      if (initialResponse.statusCode === 200 && initialResponse.url.includes('/interaction/')) {
        await this.handleLoginPage(initialResponse.data, initialResponse.url);
      } else {
        console.log('未到达登录页面，状态码:', initialResponse.statusCode);
        this.saveDebugInfo('debug_initial_response', initialResponse.data, initialResponse);
      }

    } catch (error) {
      console.error('认证失败：', error);
    }
  }

  async handleLoginPage(html, currentUrl) {
    const root = parse(html);
    const forms = root.querySelectorAll('form');
    
    console.log(`找到 ${forms.length} 个表单`);
    
    if (forms.length === 0) {
      console.log('未找到表单，无法继续');
      return;
    }

    const loginForm = forms[0];
    const formAction = loginForm.getAttribute('action');
    const formMethod = loginForm.getAttribute('method') || 'POST';

    console.log(`提交登录表单到: ${formAction}`);
    console.log('当前 Cookie:', this.getCookieHeader());

    // 提取所有表单字段
    const formInputs = loginForm.querySelectorAll('input');
    const formData = new URLSearchParams();
    
    console.log('表单字段详情:');
    formInputs.forEach(input => {
      const name = input.getAttribute('name');
      const value = input.getAttribute('value') || '';
      const type = input.getAttribute('type');
      
      console.log(`  ${name} (${type}): "${value}"`);
      
      if (name) {
        if (type === 'text' && (name.includes('login') || name.includes('username'))) {
          formData.append(name, 'admin');
        } else if (type === 'password') {
          formData.append(name, 'admin');
        } else {
          // 保持所有隐藏字段和其他字段的原始值
          formData.append(name, value);
        }
      }
    });

    console.log('最终表单数据:', formData.toString());

    // 确定目标 URL
    let targetUrl;
    if (formAction.startsWith('http')) {
      targetUrl = new URL(formAction);
    } else {
      targetUrl = new URL(formAction, currentUrl);
    }

    console.log(`目标URL: ${targetUrl.toString()}`);

    // 立即提交登录表单，避免会话过期
    const loginResult = await this.request({
      hostname: targetUrl.hostname,
      port: targetUrl.port || 443,
      path: targetUrl.pathname + targetUrl.search,
      method: formMethod,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': `https://${targetUrl.hostname}:${targetUrl.port || 443}`,
        'Referer': currentUrl
      }
    }, formData.toString());

    console.log('登录结果状态码:', loginResult.statusCode);
    console.log('登录结果URL:', loginResult.url);
    console.log('登录后 Cookie 数量:', this.cookieJar.size);

    this.saveDebugInfo('debug_after_login', loginResult.data, loginResult);

    // 分析登录结果
    if (loginResult.statusCode === 302 || loginResult.statusCode === 303) {
      console.log('登录成功，正在处理重定向...');
      // 重定向会自动处理，等待最终结果
    } else if (loginResult.statusCode === 200) {
      await this.handlePostLogin(loginResult.data, loginResult.url);
    } else {
      console.log(`登录返回状态码: ${loginResult.statusCode}`);
      await this.analyzeError(loginResult);
    }
  }

  async handlePostLogin(html, currentUrl) {
    console.log('处理登录后页面...');
    const root = parse(html);
    
    // 检查是否有授权确认表单
    const authForm = root.querySelector('form');
    const continueButton = root.querySelector('button[value="Continue"]') || 
                          root.querySelector('input[value="Continue"]') ||
                          root.querySelector('button:contains("Continue")');

    if (authForm && continueButton) {
      console.log('找到授权确认表单，提交授权...');
      
      const formInputs = authForm.querySelectorAll('input');
      const formData = new URLSearchParams();
      
      formInputs.forEach(input => {
        const name = input.getAttribute('name');
        const value = input.getAttribute('value') || '';
        if (name) {
          formData.append(name, value);
        }
      });

      const formAction = authForm.getAttribute('action');
      
      const authResult = await this.request({
        hostname: '192.168.1.2',
        port: 3000,
        path: formAction,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://192.168.1.2:3000',
          'Referer': currentUrl
        }
      }, formData.toString());

      this.checkAndSaveRDP(authResult);
    } else {
      // 可能直接返回了 RDP 文件或其他内容
      this.checkAndSaveRDP({ data: html, statusCode: 200, headers: {} });
    }
  }

  async analyzeError(response) {
    console.log('错误分析:');
    const root = parse(response.data);
    const errorElements = root.querySelectorAll('pre');
    errorElements.forEach(pre => {
      console.log(pre.textContent);
    });
  }

  checkAndSaveRDP(response) {
    if (response.data && (
        response.data.includes('screen mode id') || 
        response.data.includes('full address') ||
        response.data.includes('username') ||
        response.data.includes('password'))) {
      
      const filename = 'template.rdp';
      fs.writeFileSync(filename, response.data);
      console.log('✅ RDP 文件已保存：', filename);
      return true;
    } else {
      this.saveDebugInfo('debug_final_response', response.data, response);
      console.log('响应内容不是 RDP 文件，已保存调试信息');
      return false;
    }
  }
}

// 设置环境变量避免 TLS 警告
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 使用
const auth = new OIDCAuth();
auth.loginAndDownload();
```

### http自动登陆精简版本

```js
import https from 'https';
import fs from 'fs';
import { parse } from 'node-html-parser';
import { URL } from 'url';

class OIDCAuth {
  constructor() {
    this.cookieJar = new Map();
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
    this.maxRedirects = 10;
  }

  parseCookies(setCookieHeaders) {
    if (!setCookieHeaders) return;
    setCookieHeaders.forEach(cookieHeader => {
      const cookie = cookieHeader.split(';')[0].trim();
      const [name, ...valueParts] = cookie.split('=');
      const value = valueParts.join('=');
      if (name && value) this.cookieJar.set(name, value);
    });
  }

  getCookieHeader() {
    return Array.from(this.cookieJar.entries()).map(([name, value]) => `${name}=${value}`).join('; ');
  }

  async request(options, postData = null, redirectCount = 0) {
    return new Promise((resolve, reject) => {
      const headers = {
        'User-Agent': this.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Cookie': this.getCookieHeader(),
        ...options.headers
      };

      const req = https.request({
        rejectUnauthorized: false,
        port: options.port || 443,
        ...options,
        headers
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.headers['set-cookie']) {
            this.parseCookies(res.headers['set-cookie']);
          }

          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            data,
            url: `https://${options.hostname}:${options.port || 443}${options.path}`
          };

          // 处理重定向
          if ((res.statusCode === 302 || res.statusCode === 301 || res.statusCode === 303) && 
              res.headers.location && redirectCount < this.maxRedirects) {
            this.handleRedirect(res.headers.location, options, postData, redirectCount + 1)
              .then(resolve)
              .catch(reject);
          } else {
            resolve(response);
          }
        });
      });
      
      if (postData) req.write(postData);
      req.on('error', reject);
      req.end();
    });
  }

  async handleRedirect(location, previousOptions, postData, redirectCount) {
    const baseUrl = `https://${previousOptions.hostname}:${previousOptions.port || 443}`;
    const url = location.startsWith('http') ? new URL(location) : new URL(location, baseUrl);
    
    return await this.request({
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: 'GET',
      headers: { 'Cookie': this.getCookieHeader() }
    }, null, redirectCount);
  }

  async loginAndDownload() {
    try {
      console.log('开始 OIDC 认证流程...');
      
      // 发起初始请求并自动处理所有重定向
      const finalResponse = await this.request({
        hostname: '192.168.1.60',
        port: 9443,
        path: '/connect?host=192.168.1.61:3389',
        method: 'GET'
      });

      console.log('最终响应状态码:', finalResponse.statusCode);
      
      // 检查最终响应是否为 RDP 文件
      if (this.isRDPFile(finalResponse.data)) {
        this.saveRDPFile(finalResponse.data);
      } else {
        console.log('最终响应不是 RDP 文件，检查内容...');
        // 如果不是 RDP 文件，可能是登录页面，尝试处理
        await this.processPage(finalResponse.data, finalResponse.url);
      }

    } catch (error) {
      console.error('认证失败：', error);
    }
  }

  async processPage(html, currentUrl) {
    const root = parse(html);
    
    // 检查是否是登录页面
    const loginForm = root.querySelector('form');
    if (loginForm && this.isLoginForm(loginForm)) {
      console.log('发现登录表单，正在登录...');
      await this.submitLoginForm(loginForm, currentUrl);
      return;
    }
    
    // 检查是否是授权确认页面
    const authForm = root.querySelector('form');
    if (authForm && this.isAuthForm(authForm)) {
      console.log('发现授权确认表单，正在确认...');
      await this.submitAuthForm(authForm, currentUrl);
      return;
    }
    
    console.log('未知页面类型，无法继续处理');
  }

  isLoginForm(form) {
    const inputs = form.querySelectorAll('input');
    const hasUsername = Array.from(inputs).some(input => 
      input.getAttribute('type') === 'text' && 
      (input.getAttribute('name')?.includes('login') || input.getAttribute('name')?.includes('username'))
    );
    const hasPassword = Array.from(inputs).some(input => 
      input.getAttribute('type') === 'password'
    );
    return hasUsername && hasPassword;
  }

  isAuthForm(form) {
    const buttons = form.querySelectorAll('button, input[type="submit"]');
    return Array.from(buttons).some(button => 
      button.textContent?.includes('Continue') || 
      button.getAttribute('value')?.includes('Continue') ||
      button.textContent?.includes('Authorize') ||
      button.getAttribute('value')?.includes('Authorize')
    );
  }

  async submitLoginForm(loginForm, currentUrl) {
    const formAction = loginForm.getAttribute('action');
    const formMethod = loginForm.getAttribute('method') || 'POST';

    // 构建表单数据
    const formData = new URLSearchParams();
    loginForm.querySelectorAll('input').forEach(input => {
      const name = input.getAttribute('name');
      const value = input.getAttribute('value') || '';
      const type = input.getAttribute('type');
      
      if (name) {
        if (type === 'text' && (name.includes('login') || name.includes('username'))) {
          formData.append(name, 'admin');
        } else if (type === 'password') {
          formData.append(name, 'admin');
        } else {
          formData.append(name, value);
        }
      }
    });

    const targetUrl = formAction.startsWith('http') ? new URL(formAction) : new URL(formAction, currentUrl);
    
    const result = await this.request({
      hostname: targetUrl.hostname,
      port: targetUrl.port || 443,
      path: targetUrl.pathname + targetUrl.search,
      method: formMethod,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': `https://${targetUrl.hostname}:${targetUrl.port || 443}`,
        'Referer': currentUrl
      }
    }, formData.toString());

    // 处理登录后的重定向或页面
    if (result.statusCode === 200) {
      await this.processPage(result.data, result.url);
    }
  }

  async submitAuthForm(authForm, currentUrl) {
    const formData = new URLSearchParams();
    authForm.querySelectorAll('input').forEach(input => {
      const name = input.getAttribute('name');
      const value = input.getAttribute('value') || '';
      if (name) formData.append(name, value);
    });

    const formAction = authForm.getAttribute('action');
    const targetUrl = formAction.startsWith('http') ? new URL(formAction) : new URL(formAction, currentUrl);

    const result = await this.request({
      hostname: targetUrl.hostname,
      port: targetUrl.port || 443,
      path: targetUrl.pathname + targetUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': `https://${targetUrl.hostname}:${targetUrl.port || 443}`,
        'Referer': currentUrl
      }
    }, formData.toString());

    // 检查最终结果是否为 RDP 文件
    if (this.isRDPFile(result.data)) {
      this.saveRDPFile(result.data);
    } else if (result.statusCode === 200) {
      await this.processPage(result.data, result.url);
    }
  }

  isRDPFile(content) {
    return content && (
      content.includes('screen mode id') || 
      content.includes('full address') ||
      content.includes('session bpp') ||
      content.includes('desktopwidth')
    );
  }

  saveRDPFile(content) {
    fs.writeFileSync('template.rdp', content);
    console.log('✅ RDP 文件已保存：template.rdp');
  }
}

// 使用
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
new OIDCAuth().loginAndDownload();
```

### default.rdp

```
connection type:i:7
bandwidthautodetect:i:1
networkautodetect:i:1
audiomode:i:2
autoreconnect max retries:i:5
autoreconnection enabled:i:1
session bpp:i:32
smart sizing:i:1
redirectclipboard:i:1
drivestoredirect:s:*
```

