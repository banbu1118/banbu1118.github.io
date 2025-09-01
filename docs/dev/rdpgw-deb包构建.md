# rdpgw-deb包构建

构建好的镜像，国内可下载：[https://share.weiyun.com/lNWxpZ2a](https://share.weiyun.com/lNWxpZ2a)

## 一、构建环境

Debian12

## 二、准备编译环境

```bash
apt update
apt install git build-essential dpkg-dev fakeroot libpam0g-dev -y
```

## 三、go依赖

go版本要求1.19以上

- 检查go版本

```bash
go version
```

- 移除旧版本

```bash
apt remove golang-go -y
```

- 安装新版本（例如1.22）

```bash
wget https://go.dev/dl/go1.24.1.linux-amd64.tar.gz
rm -rf /usr/local/go
tar -C /usr/local -xzf go1.24.1.linux-amd64.tar.gz
```

- 将 Go 环境变量添加到 `.bashrc` 文件 

```bash
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc
```

-  重启检查验证版本 

```bash
go version
```

## 四、go代理

国内网络不行，需要代理

- 修改Go模块代理

```bash
go env -w GOPROXY=https://goproxy.cn,direct
```


## 五、rdpgw打包deb

- 获取rdpgw项目

```bash
git clone https://github.com/bolkedebruin/rdpgw.git
```

- 进入rdpgw目录编辑

```bash
cd rdpgw
make
```

 编译后生成的文件通常在

```bash
./bin/rdpgw
```

- 创建deb包目录结构

```bash
mkdir -p rdpgw-deb/DEBIAN
mkdir -p rdpgw-deb/usr/bin
mkdir -p rdpgw-deb/usr/sbin
mkdir -p rdpgw-deb/etc/rdpgw
mkdir -p rdpgw-deb/lib/systemd/system
mkdir -p rdpgw-deb/usr/share/doc/rdpgw
```

- 复制编译好的 rdpgw 到包目录

```bash
cp bin/rdpgw rdpgw-deb/usr/bin/
cp bin/rdpgw-auth rdpgw-deb/usr/sbin/
```

- 创建默认配置文件（支持NTLM认证）

```bash
nano rdpgw-deb/etc/rdpgw/rdpgw.yaml
```

内容如下

```yaml
Server:
  Authentication:
    - ntlm
  BasicAuthTimeout: 5
  AuthSocket: /run/rdpgw-auth.sock
  GatewayAddress: localhost
  Port: 9443
  Hosts:
    - localhost:3389
  HostSelection: any
  Tls: enable
  CertFile: /etc/rdpgw/server.pem
  KeyFile: /etc/rdpgw/key.pem
Caps:
  SmartCardAuth: false
  TokenAuth: false
  IdleTimeout: 10
  EnablePrinter: true
  EnablePort: true
  EnablePnp: true
  EnableDrive: true
  EnableClipboard: true
Client:
  UsernameTemplate: "{{ username }}"
  SplitUserDomain: false
Security:
  PAATokenSigningKey: thisisasessionkeyreplacethisjetzt
  UserTokenEncryptionKey: thisisasessionkeyreplacethisjetzt
  EnableUserToken: false
  VerifyClientIp: trufalsee
```

- 创建默认用户配置

```bash
nano rdpgw-deb/etc/rdpgw/rdpgw-auth.yaml
```

内容如下

```yaml
Users:
 - {Username: "administrator", Password: "123456"}
```

- 创建 rdpgw systemd 服务

```bash
nano rdpgw-deb/lib/systemd/system/rdpgw.service
```

内容如下

```bash
[Unit]
Description=RDP Gateway Service
After=network.target
StartLimitBurst=5
StartLimitInterval=10s

[Service]
Type=simple
User=root
ExecStart=/usr/bin/rdpgw -c /etc/rdpgw/rdpgw.yaml
Restart=on-failure
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

- 创建 rdpgw-auth systemd 服务

```bash
nano rdpgw-deb/lib/systemd/system/rdpgw-auth.service
```

内容如下

```bash
[Unit]
Description=RDP Gateway Auth Service
After=network.target
StartLimitBurst=5
StartLimitInterval=10s

[Service]
Type=simple
User=root
ExecStart=/usr/sbin/rdpgw-auth -c /etc/rdpgw/rdpgw-auth.yaml -s /run/rdpgw-auth.sock
Restart=on-failure
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

- 添加copyright信息

```bash
nano rdpgw-deb/usr/share/doc/rdpgw/copyright
```

内容如下

```bash
Format: https://www.debian.org/doc/packaging-manuals/copyright-format/1.0/
Source: https://github.com/bolkedebruin/rdpgw

Files: *
Copyright: bolkedebruin
License: Apache-2.0

Files: debian/*
Copyright: banbu1118 <service@1902802324@qq.com>
License: Apache-2.0
```

- 创建 Debian 控制文件

```bash
nano rdpgw-deb/DEBIAN/control
```

内容如下

```bash
Package: rdpgw
Version: 2.0.2
Section: net
Priority: optional
Architecture: amd64
Maintainer: banbu1118 <service@1902802324@qq.com>
Description: Secure RDP Gateway using HTTPS and NTLM authentication
 Provides secure remote desktop access via HTTPS/WebSocket with NTLM authentication.
```

- 编写安装脚本（postinst）

```bash
nano rdpgw-deb/DEBIAN/postinst
```

内容如下

```bash
#!/bin/sh
set -e

# 设置可执行权限
chmod +x /usr/bin/rdpgw
chmod +x /usr/sbin/rdpgw-auth

# 配置ssl证书
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/rdpgw/key.pem \
  -out /etc/rdpgw/server.pem \
  -subj "/C=US/ST=VA/L=SomeCity/O=MyCompany/CN=rdpgw" \
  > /dev/null 2>&1

# 启用服务并开机自启动
systemctl daemon-reload
systemctl enable rdpgw
systemctl enable rdpgw-auth
systemctl start rdpgw
systemctl start rdpgw-auth

echo "rdpgw has been installed and enabled."
```

- 打包成deb包

```bash
chmod 755 rdpgw-deb/DEBIAN/postinst

fakeroot dpkg-deb --build rdpgw-deb
```

生成deb包完成，安装测试

- 打包时指定包名（可选）

```bash
fakeroot dpkg-deb --build rdpgw-deb rdpgw_2.0.2_amd64.deb
```

## 六、测试

- 安装测试

```bash
dpkg -i rdpgw-deb.deb
```

- deb包结构检查命令

```bash
dpkg-deb -c rdpgw-deb.deb
```

- 查看包信息

```bash
dpkg -l rdpgw
```

