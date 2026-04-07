# rdpgw-oidc-deb构建

构建好的镜像，国内可下载：[https://share.weiyun.com/z0UQgB9t](https://share.weiyun.com/z0UQgB9t)

## 一、构建环境

Debian13

## 二、准备编译环境

```shell
apt update
apt install git build-essential dpkg-dev fakeroot libpam0g-dev -y
```

## 三、go依赖

go版本要求1.19以上

* 检查go版本

```shell
go version
```

* 移除旧版本

```shell
apt remove golang-go -y
```

* 安装新版本（例如1.26.1）

```shell
wget https://go.dev/dl/go1.26.1.linux-amd64.tar.gz
rm -rf /usr/local/go
tar -C /usr/local -xzf go1.26.1.linux-amd64.tar.gz
```

* 将 Go 环境变量添加到` .bashrc` 文件

```shell
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc
```

* 重启检查验证版本

```shell
go version
```

## 四、go代理

国内网络不行，需要代理

* 修改Go模块代理

```shell
go env -w GOPROXY=https://goproxy.cn,direct
```

## 五、rdpgw打包deb

* 获取rdpgw项目

```shell
git clone https://github.com/bolkedebruin/rdpgw.git
```

* 进入rdpgw目录编辑

```shell
cd rdpgw
make
```

编译后生成的文件通常在

```shell
./bin/rdpgw
```


- 创建deb包目录结构

```shell
mkdir -p rdpgw-deb/DEBIAN
mkdir -p rdpgw-deb/usr/bin
mkdir -p rdpgw-deb/etc/rdpgw
mkdir -p rdpgw-deb/lib/systemd/system
mkdir -p rdpgw-deb/usr/share/doc/rdpgw
```

- 复制编译好的 rdpgw 到包目录

```shell
cp bin/rdpgw rdpgw-deb/usr/bin/
```

- 创建默认配置文件（支持OIDC认证）

内网网关

```shell
nano rdpgw-deb/etc/rdpgw/inrdpgw.yaml
```

内容如下

```yaml
Server:
  Authentication:
    - openid
  BasicAuthTimeout: 5
  GatewayAddress: https://192.168.1.60:8443
  Port: 8443
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
  ProviderUrl: https://127.0.0.1:3001
  ClientId: rdpgw
  ClientSecret: 01cd304c-6f43-4480-9479-618eb6fd578f
Caps:
 SmartCardAuth: true
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

- 创建默认配置文件（支持OIDC认证）

公网网关

```shell
nano rdpgw-deb/etc/rdpgw/outrdpgw.yaml
```

内容如下

```yaml
Server:
  Authentication:
    - openid
  BasicAuthTimeout: 5
  GatewayAddress: https://vdi.rdpgw.com:9443
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
  ProviderUrl: https://127.0.0.1:3001
  ClientId: rdpgw
  ClientSecret: 01cd304c-6f43-4480-9479-618eb6fd578f
Caps:
 SmartCardAuth: true
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

- 创建rdp默认配置文件

```shell
nano rdpgw-deb/etc/rdpgw/default.rdp
```

内容如下

```shell
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

- 创建 rdpgw systemd 服务

内网网关

```shell
nano rdpgw-deb/lib/systemd/system/inrdpgw.service
```

内容如下

```shell
[Unit]
Description=RDP Gateway Service
After=network.target
StartLimitBurst=5
StartLimitInterval=10s

[Service]
Type=simple
User=root
ExecStart=/usr/bin/rdpgw -c /etc/rdpgw/inrdpgw.yaml
Restart=on-failure
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

- 创建 rdpgw systemd 服务

公网网关

```shell
nano rdpgw-deb/lib/systemd/system/outrdpgw.service
```

内容如下

```shell
[Unit]
Description=RDP Gateway Service
After=network.target
StartLimitBurst=5
StartLimitInterval=10s

[Service]
Type=simple
User=root
ExecStart=/usr/bin/rdpgw -c /etc/rdpgw/outrdpgw.yaml
Restart=on-failure
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

- 添加copyright信息

```shell
nano rdpgw-deb/usr/share/doc/rdpgw/copyright
```

内容如下

```shell
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

```shell
nano rdpgw-deb/DEBIAN/control
```

内容如下

```shell
Package: rdpgw
Version: 1.0.1
Section: net
Priority: optional
Architecture: amd64
Maintainer: banbu1118 <service@1902802324@qq.com>
Description: Secure RDP Gateway using HTTPS and OIDC authentication
 Provides secure remote desktop access via HTTPS/WebSocket with OIDC authentication.
```

- 编写安装脚本（postinst）

```shell
nano rdpgw-deb/DEBIAN/postinst
```

内容如下

```shell
#!/bin/sh
set -e

# 设置可执行权限
chmod +x /usr/bin/rdpgw

# 配置ssl证书
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/rdpgw/server.key -out /etc/rdpgw/server.crt -subj "/C=CN/ST=Beijing/L=Beijing/O=Dev/OU=IT/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

# 设置证书权限
chmod 600 /etc/rdpgw/server.key
chmod 644 /etc/rdpgw/server.crt

#系统加载证书
cp /etc/rdpgw/server.crt /usr/local/share/ca-certificates/server.crt
update-ca-certificates

# 启用服务并开机自启动
systemctl daemon-reload
systemctl enable inrdpgw
systemctl enable outrdpgw
systemctl start inrdpgw
systemctl start outrdpgw

echo "rdpgw has been installed and enabled."
```

- 打包成deb包

```shell
chmod 755 rdpgw-deb/DEBIAN/postinst

fakeroot dpkg-deb --build rdpgw-deb
```

生成deb包完成，安装测试

- 打包时指定包名（可选）

```shell
fakeroot dpkg-deb --build rdpgw-deb rdpgw_oidc_1.1.3_amd64.deb
```

## 六、测试

- 安装测试

```shell
dpkg -i rdpgw-deb.deb
```

- deb包结构检查命令

```shell
dpkg-deb -c rdpgw-deb.deb
```

- 查看包信息

```shell
dpkg -l rdpgw
```

