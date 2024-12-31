## rdpgw开源网关教程

### 一、简介

RDPGW 旨在提供 MS 远程桌面网关的完全开源替代品，包括访问策略。

RDPGW 是远程桌面网关协议的实现。这允许您通过 HTTPS 将官方 Microsoft 客户端连接到远程桌面。例如，这些桌面可以是在 Kubernetes 上的容器中运行的 XRDP 桌面。

Github地址：[https://github.com/bolkedebruin/rdpgw](https://github.com/bolkedebruin/rdpgw)

此教程来源：[https://github.com/bolkedebruin/rdpgw/issues/118](https://github.com/bolkedebruin/rdpgw/issues/118)

构建好的镜像，国内可下载：[https://share.weiyun.com/4ycr5XAn](https://share.weiyun.com/4ycr5XAn)

### 二、构建docker镜像

国内网络不行，推荐在阿里云或者腾讯云组一台国外服务器临时构建一下

#### 2.1 克隆项目

```shell
git clone https://github.com/bolkedebruin/rdpgw
```

#### 2.2 修改run.sh脚本

切换到 /rdpgw/dev/docker 目录

```
cd ./rdpgw/dev/docker
```

编辑run.sh脚本为如下内容

```shell
#!/bin/sh

USER=rdpgw

cd /opt/rdpgw || exit 1
/opt/rdpgw/rdpgw-auth -n rdpgw -s /tmp/rdpgw-auth.sock &

# drop privileges and run the application
su -c /opt/rdpgw/rdpgw "${USER}" -- "$@" &
wait
exit $?
```

#### 2.3 构建镜像

```shell
docker build -t rdpgw-ntlm:latest .
```

#### 2.4 导出镜像

```shell
docker save -o rdpgw.tar rdpgw-ntlm:latest
```

#### 2.5 导入镜像

```shell
docker load -i rdpgw.tar
```

### 三、创建配置文件

#### 3.1 创建对应目录

```shell
mkdir -p /root/appdata/opt/rdpgw

mkdir -p /root/appdata/ect/rdpgw
```

#### 3.2 创建容器配置文件

创建kk.yaml配置文件

```shell
nano /root/kk.yaml
```

内容如下

```yaml
---
services:

  app:
    image: rdpgw-ntlm:latest

    ports:
      - 9443:9443

    restart: on-failure

    volumes:
      - ./appdata/opt/rdpgw/rdpgw.yaml:/opt/rdpgw/rdpgw.yaml
      - ./appdata/opt/rdpgw/rdpgw-auth.yaml:/opt/rdpgw/rdpgw-auth.yaml
      - ./appdata/ect/rdpgw/default.rdp:/etc/rdpgw/default.rdp
      - ./appdata/opt/rdpgw/server.pem:/opt/rdpgw/server.pem
      - ./appdata/opt/rdpgw/key.pem:/opt/rdpgw/key.pem

    environment:
      RDPGW_SERVER__CERT_FILE: /opt/rdpgw/server.pem
      RDPGW_SERVER__KEY_FILE: /opt/rdpgw/key.pem
      RDPGW_SERVER__SESSION_STORE: "file"
      RDPGW_SERVER__GATEWAY_ADDRESS: https://192.168.1.72
      RDPGW_SERVER__PORT: "9443"
```

#### 3.3 配置rdpgw.yaml

创建rdpgw.yaml配置文件

```shell
nano /root/appdata/opt/rdpgw/rdpgw.yaml
```

内容如下

```yaml
Server:
  Authentication:
    - ntlm

  BasicAuthTimeout: "5"

  #启用本地证书
  Tls: "enable"
  CertFile: server.pem
  KeyFile: key.pem

  #要连接主机的ip
  Hosts:
    - "192.168.1.73:3389"
    - "192.168.1.74:3389"

  #连接时，在上诉Hosts中查询
  HostSelection: "unsigned"

  SessionKey: "GENERATE A 32 CHAR KEY" # CHANNGE
  SessionEncryptionKey: "GENERATE A 32 CHAR KEY" # CHANNGE

AuthSocket: /tmp/rdpgw-auth.sock

Caps:
  #SmartCardAuth: false
  SmartCardAuth: false

  #禁用身份身份令牌验证，启动其他方式认证（比如用户名和密码）
  TokenAuth: false

  #空闲超时自动断开（分钟）
  IdleTimeout: 120

  #启用粘贴板
  EnableClipboard: true

  #启用驱动器映射功能
  EnableDrive: "true"

  #启动打印机共享功能
  EnablePrinter: false

  #启用即插即用（PnP）设备支持
  EnablePnp: false

  #启用端口映射功能
  EnablePort: false

Client:
  defaults: "/etc/rdpgw/default.rdp"
  #用户格式，可以改为{{ username }}@vdi.cloud.com
  UsernameTemplate: "{{ username }}"
  SplitUserDomain: "false"

Security:
  PAATokenSigningKey: "GENERATE A 32 CHAR KEY" # CHANNGE
  UserTokenEncryptionKey: "GENERATE A 32 CHAR KEY" # CHANNGE
  EnableUserToken: "true"
  VerifyClientIp: "true"
```

#### 3.4 创建用户账号文件

此配置记录了虚拟机的账号密码

创建rdpgw-auth.yaml配置文件

```shell
nano /root/appdata/opt/rdpgw/rdpgw-auth.yaml
```

内容如下

```yaml
Users:
 - {Username: "user01@vdi.cloud.com", Password: "abc@2020"}
 - {Username: "user02@vdi.cloud.com", Password: "abc@2020"}
```

#### 3.5 创建ssl自签名证书


通过openssl创建ssl证书

添加国家，地区，倒数第二个填ip

```shell
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /root/appdata/opt/rdpgw/key.pem -out /root/appdata/opt/rdpgw/server.pem
```

#### 3.6 创建rdp配置文件

创建default.rdp配置文件

```shell
nano /root/appdata/ect/rdpgw/default.rdp
```

内容如下

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
```

#### 3.7 更改目录权限

```shell
chmod  -R 644 /root/appdata/
```

### 四、运行

#### 4.1 运行容器

```shell
docker compose -f /root/kk.yaml up -d
```

#### 4.2 检查运行日志

```shell
docker logs -f root-app-1
```

### 五、连接

#### 5.1 安装证书

把前面的server.pem保存到windows系统上，改名为ip.crt的文件

证书安装到本地计算机->受信任的根证书颁发机构


#### 5.2 创建rdp连接文件

新建文件为如下内容

```
screen mode id:i:2
use multimon:i:0
desktopwidth:i:1920
desktopheight:i:1080
session bpp:i:32
winposstr:s:0,1,750,249,1550,849
compression:i:1
keyboardhook:i:2
audiocapturemode:i:0
videoplaybackmode:i:1
connection type:i:7
networkautodetect:i:1
bandwidthautodetect:i:1
displayconnectionbar:i:1
enableworkspacereconnect:i:0
disable wallpaper:i:0
allow font smoothing:i:0
allow desktop composition:i:0
disable full window drag:i:1
disable menu anims:i:1
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
full address:s:192.168.8.75
audiomode:i:0
redirectprinters:i:1
redirectcomports:i:0
redirectsmartcards:i:1
redirectclipboard:i:1
redirectposdevices:i:0
autoreconnection enabled:i:1
authentication level:i:2
prompt for credentials:i:0
negotiate security layer:i:1
remoteapplicationmode:i:0
alternate shell:s:
shell working directory:s:
gatewayhostname:s:192.168.8.62:9443
gatewayusagemethod:i:1
gatewaycredentialssource:i:4
gatewayprofileusagemethod:i:1
promptcredentialonce:i:1
gatewaybrokeringtype:i:0
use redirection server name:i:0
rdgiskdcproxy:i:0
kdcproxyname:s:
redirectwebauthn:i:1
drivestoredirect:s:
enablerdsaadauth:i:0
```

保存后重命名为template.rdp，双击输入账号和密码连接

特殊情况，如果网关是windows网关时，用户名前面需要增加网关和虚拟机的主机名才能识别

```
username:s:VM01\administrator
password:s:123456
gatewayusername:s:WIN-ID68U3TKHD6\administrator
```

#### 5.3 使用wfreerdp连接

wfreerdp下载链接：[https://ci.freerdp.com/job/freerdp-nightly-windows/](https://ci.freerdp.com/job/freerdp-nightly-windows/)

```
wfreerdp.exe Default.rdp /p:123456
```

#### 5.4 启用rfx优化参数

```
.\wfreerdp.exe /v:192.168.1.232 /u:administrator /p:123456 /f /sound:latency:200 -window-drag /rfx
```

#### 5.5 双屏显示

```
xfreerdp3 /v:192.168.1.232 /u:administrator /p:123456 /f /rfx /cert:ignore -window-drag /multimon /dynamic-resolution +monitors:0,1
```
