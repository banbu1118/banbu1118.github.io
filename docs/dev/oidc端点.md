# oidc端点

## 访问地址

https://192.168.1.2:3000/.well-known/openid-configuration

```
{
  "authorization_endpoint": "https://192.168.1.2:3000/auth",
  "claims_parameter_supported": false,
  "claims_supported": [
    "sub",
    "username",
    "preferred_username",
    "email",
    "sid",
    "auth_time",
    "iss"
  ],
  "code_challenge_methods_supported": [
    "S256"
  ],
  "end_session_endpoint": "https://192.168.1.2:3000/session/end",
  "grant_types_supported": [
    "implicit",
    "authorization_code",
    "refresh_token"
  ],
  "issuer": "https://192.168.1.2:3000",
  "jwks_uri": "https://192.168.1.2:3000/jwks",
  "authorization_response_iss_parameter_supported": true,
  "response_modes_supported": [
    "form_post",
    "fragment",
    "query"
  ],
  "response_types_supported": [
    "code id_token",
    "code",
    "id_token",
    "none"
  ],
  "scopes_supported": [
    "openid",
    "offline_access",
    "profile"
  ],
  "subject_types_supported": [
    "public"
  ],
  "token_endpoint_auth_methods_supported": [
    "client_secret_basic",
    "client_secret_jwt",
    "client_secret_post",
    "private_key_jwt",
    "none"
  ],
  "token_endpoint_auth_signing_alg_values_supported": [
    "HS256",
    "RS256",
    "PS256",
    "ES256",
    "Ed25519",
    "EdDSA"
  ],
  "token_endpoint": "https://192.168.1.2:3000/token",
  "id_token_signing_alg_values_supported": [
    "RS256"
  ],
  "pushed_authorization_request_endpoint": "https://192.168.1.2:3000/request",
  "request_uri_parameter_supported": false,
  "userinfo_endpoint": "https://192.168.1.2:3000/me",
  "introspection_endpoint": "https://192.168.1.2:3000/token/introspection",
  "dpop_signing_alg_values_supported": [
    "ES256",
    "Ed25519",
    "EdDSA"
  ],
  "revocation_endpoint": "https://192.168.1.2:3000/token/revocation",
  "claim_types_supported": [
    "normal"
  ]
}
```

## 获取所有接口代码

```js
import https from 'https';

// 你的 OIDC Provider 的 issuer URL
const ISSUER_URL = 'https://192.168.1.2:3000';

// 因为你使用自签名证书，所以要关闭证书验证（仅测试时可用）
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 请求 Discovery 文档
https.get(`${ISSUER_URL}/.well-known/openid-configuration`, (res) => {
  let data = '';

  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    try {
      const config = JSON.parse(data);
      console.log('✅ OIDC 配置端点信息:\n');
      console.table(
        Object.entries(config)
          .filter(([k, v]) => typeof v === 'string' && v.startsWith('https'))
          .map(([k, v]) => ({ name: k, url: v }))
      );
    } catch (err) {
      console.error('解析失败:', err);
      console.log('返回原始数据:\n', data);
    }
  });
}).on('error', (err) => {
  console.error('请求失败:', err);
});

```

## 测试结果

```shell
C:\Users\kk\Desktop\oidc-test\moni>node k4.js 
(node:11848) Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections and HTTPS requests insecure by disabling certificate verification.
(Use `node --trace-warnings ...` to show where the warning was created)
✅ OIDC 配置端点信息:

┌─────────┬─────────────────────────────────────────┬────────────────────────────────────────────────┐
│ (index) │ name                                    │ url                                            │
├─────────┼─────────────────────────────────────────┼────────────────────────────────────────────────┤
│ 0       │ 'authorization_endpoint'                │ 'https://192.168.1.2:3000/auth'                │
│ 1       │ 'end_session_endpoint'                  │ 'https://192.168.1.2:3000/session/end'         │
│ 2       │ 'issuer'                                │ 'https://192.168.1.2:3000'                     │
│ 3       │ 'jwks_uri'                              │ 'https://192.168.1.2:3000/jwks'                │
│ 4       │ 'token_endpoint'                        │ 'https://192.168.1.2:3000/token'               │
│ 5       │ 'pushed_authorization_request_endpoint' │ 'https://192.168.1.2:3000/request'             │
│ 6       │ 'userinfo_endpoint'                     │ 'https://192.168.1.2:3000/me'                  │
│ 7       │ 'introspection_endpoint'                │ 'https://192.168.1.2:3000/token/introspection' │
│ 8       │ 'revocation_endpoint'                   │ 'https://192.168.1.2:3000/token/revocation'    │
└─────────┴─────────────────────────────────────────┴────────────────────────────────────────────────┘
```

