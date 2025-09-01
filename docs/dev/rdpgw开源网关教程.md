## rdpgw开源网关教程

### 一、简介

RDPGW 旨在提供 MS 远程桌面网关的完全开源替代品，包括访问策略。

RDPGW 是远程桌面网关协议的实现。这允许您通过 HTTPS 将官方 Microsoft 客户端连接到远程桌面。例如，这些桌面可以是在 Kubernetes 上的容器中运行的 XRDP 桌面。

Github地址：[https://github.com/bolkedebruin/rdpgw](https://github.com/bolkedebruin/rdpgw)

此教程来源：[https://github.com/bolkedebruin/rdpgw/issues/118](https://github.com/bolkedebruin/rdpgw/issues/118)

构建好的镜像，国内可下载：[https://share.weiyun.com/4ycr5XAn](https://share.weiyun.com/4ycr5XAn)

pxvdi官网rdpgw教程：[https://docs.pxvdi.lierfang.com/zong-kong-mo-shi/gw/rdpgw.html](https://docs.pxvdi.lierfang.com/zong-kong-mo-shi/gw/rdpgw.html)

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

host可以换种写法，使用any模式

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
    - localhost:3389

  #连接时，在上诉Hosts中查询
  HostSelection: any

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
  EnableDrive: false

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
wfreerdp.exe Default.rdp /u:administrator /p:123456
```

#### 5.4 启用rfx优化参数

```
.\wfreerdp.exe /v:192.168.1.232 /u:administrator /p:123456 /f /sound:latency:200 -window-drag /rfx
```

#### 5.5 xfreerdp下载

xfreerdp下载链接：[https://ci.freerdp.com/job/freerdp-nightly-binaries/lastStableBuild/](https://ci.freerdp.com/job/freerdp-nightly-binaries/lastStableBuild/)

#### 5.6 双屏显示

```
xfreerdp3 /v:192.168.1.232 /u:administrator /p:123456 /f /rfx /cert:ignore -window-drag /multimon /dynamic-resolution +monitors:0,1
```

#### 5.7 wfreerdp 开源网关连接

rdpgw.rdp配置文件

```
screen mode id:i:2
session bpp:i:32
compression:i:1
keyboardhook:i:2
displayconnectionbar:i:1
disable wallpaper:i:1
disable full window drag:i:1
allow desktop composition:i:0
allow font smoothing:i:0
disable menu anims:i:1
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
full address:s:192.168.1.61
audiomode:i:2
audiocapturemode:i:1
redirectprinters:i:0
redirectsmartcard:i:0
redirectcomports:i:0
redirectsmartcards:i:0
redirectclipboard:i:1
redirectposdevices:i:0
autoreconnection enabled:i:1
authentication level:i:0
prompt for credentials:i:1
negotiate security layer:i:1
remoteapplicationmode:i:0
alternate shell:s:
shell working directory:s:
gatewayhostname:s:192.168.1.60:9443
gatewayusagemethod:i:1
gatewaycredentialssource:i:4
gatewayprofileusagemethod:i:1
precommand:s:
promptcredentialonce:i:1
drivestoredirect:s:
use multimon:i:0
desktopwidth:i:1920
desktopheight:i:1080
winposstr:s:0,3,0,0,800,600
videoplaybackmode:i:1
connection type:i:7
networkautodetect:i:1
bandwidthautodetect:i:1
enableworkspacereconnect:i:0
redirectwebauthn:i:1
gatewaybrokeringtype:i:0
use redirection server name:i:0
rdgiskdcproxy:i:0
kdcproxyname:s:
enablerdsaadauth:i:0
```

```
PS C:\Users\kk\Desktop> .\wfreerdp.exe .\rdpgw.rdp /u:administrator /p:123456 /f +fonts +aero +themes /window-drag /menu-anims -gfx -compression +gdi:sw /bpp:32
```

#### 5.8 xfreerdp3 开源网关连接

先安装freerdp3，再切换到按对应目录连接

```
root@debian:/opt/freerdp-nightly/bin# pwd
/opt/freerdp-nightly/bin
root@debian:/opt/freerdp-nightly/bin# ./xfreerdp3  /u:administrator /p:123456 /g:192.168.1.60:9443 /cert:ignore /v:192.168.1.61 /f
```

#### 5.9 wfreerdp3 gfx参数（推荐）

GFX图形管道（Graphics Pipeline）是微软从 Windows 8、Windows Server 2012 开始逐步引入的一种全新的远程桌面图像传输机制，之后在Windows 10和Windows Server 2016及更高版本中逐渐成为主流

rdpgw.rdp配置文件

```
screen mode id:i:2
use multimon:i:0
desktopwidth:i:1920
desktopheight:i:1080
session bpp:i:32
winposstr:s:0,1,750,249,1550,849
compression:i:0
keyboardhook:i:2
audiocapturemode:i:1
videoplaybackmode:i:0
connection type:i:6
displayconnectionbar:i:1
disable wallpaper:i:0
allow font smoothing:i:1
allow desktop composition:i:1
disable full window drag:i:1
disable menu anims:i:1
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
full address:s:192.168.1.61
server port:i:3389
audiomode:i:0
redirectprinters:i:0
redirectcomports:i:0
redirectsmartcards:i:0
redirectclipboard:i:1
redirectposdevices:i:0
redirectdirectx:i:1
autoreconnection enabled:i:1
authentication level:i:2
prompt for credentials:i:0
remoteapplicationmode:i:0
alternate shell:s:
shell working directory:s:
gatewayhostname:s:192.168.1.60:9443
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
gdi rendering:i:0
use gfx:i:0
```

```
PS C:\Users\kk\Desktop> .\wfreerdp.exe .\rdpgw.rdp /u:administrator /p:123456 /cert:ignore /sound:latency:200 /gfx /v:192.168.1.63
```

#### 5.10 windows虚拟机60帧

资料来源：[https://github.com/Upinel/BetterRDP](https://github.com/Upinel/BetterRDP)

这是UpinelBetterRDP.reg配置文件的内容，双击执行即可

```
Windows Registry Editor Version 5.00

;  +----------------------------------------------------------------------+
;  | Upinel/BetterRDP                                                     |
;  +----------------------------------------------------------------------+
;  | This source file is subject to version 2.0 of the Apache license,    |
;  | that is bundled with this package in the file LICENSE, and is        |
;  | available through the world-wide-web at the following url:           |
;  | http://www.apache.org/licenses/LICENSE-2.0.html                      |
;  | If you did not receive a copy of the Apache2.0 license and are unable|
;  | to obtain it through the world-wide-web, please send a note to       |
;  | license@swoole.com so we can mail you a copy immediately.            |
;  +----------------------------------------------------------------------+
;  | Author: Nova Upinel Chow  <dev@upinel.com>                           |
;  +----------------------------------------------------------------------+

;BetterRDP Optimization Settings
;Backup your current registry settings before applying this file.

;Allow GPU and RemoteFx during RDP sessions.
;Ensure RDP is using graphics acceleration for a better visual experience.
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services]
"SelectTransport"=dword:00000000
"fEnableVirtualizedGraphics"=dword:00000001
"fEnableRemoteFXAdvancedRemoteApp"=dword:00000001
"MaxCompressionLevel"=dword:00000002
"VisualExperiencePolicy"=dword:00000001
"GraphicsProfile"=dword:00000002
"bEnumerateHWBeforeSW"=dword:00000001
"AVC444ModePreferred"=dword:00000001
"AVCHardwareEncodePreferred"=dword:00000001

;Optimize the capture frame rate for RDP sessions to achieve 60 FPS.
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services]
"VGOptimization_CaptureFrameRate"=dword:0000003c

;Optimize the compression ratio for improved image quality over RDP.
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services]
"VGOptimization_CompressionRatio"=dword:00000002
"ImageQuality"=dword:00000003

;Sets the flow control for Display vs Channel Bandwidth.
;Tailor the bandwidth settings for RemoteFX devices, including controllers.
;Source:https://www.reddit.com/r/killerinstinct/comments/4fcdhy/an_excellent_guide_to_optimizing_your_windows_10/
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\TermDD]
"FlowControlDisable"=dword:00000001
"FlowControlDisplayBandwidth"=dword:0000010
"FlowControlChannelBandwidth"=dword:0000090
"FlowControlChargePostCompression"=dword:00000000

;Increase system responsiveness by adjusting foreground vs background tasks priority.
;Source:https://www.reddit.com/r/killerinstinct/comments/4fcdhy/an_excellent_guide_to_optimizing_your_windows_10/
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile]
"SystemResponsiveness"=dword:00000000

;Sets the interval for desktop composition (DWM) - 60 FPS.
;Source: https://support.microsoft.com/en-us/help/2885213/frame-rate-is-limited-to-30-fps-in-windows-8-and-windows-server-2012-r
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations]
"DWMFRAMEINTERVAL"=dword:0000000f

;Remove artificial latency delays in RDP.
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp]
"InteractiveDelay"=dword:00000000

;Disable bandwidth throttling to potentially improve network performance.
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters]
"DisableBandwidthThrottling"=dword:00000001

;Enabling Large MTU packets can improve network performance.
"DisableLargeMtu"=dword:00000000

; This setting is optional and affects the display driver model used in RDP sessions.
; Uncomment the following lines if you wish to use XDDM drivers on Nvidia cards.
; Note: May not be beneficial for AMD cards or certain configurations.
;[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services]
;"fEnableWddmDriver"=dword:00000001
```

#### 5.11 wfreerdp 优化rdp文件

默认禁用，使用 +window-drag 启用。拖动窗口会造成大量的图形更新（每次移动窗口一个像素，屏幕上很大一部分区域都需要更新）。为了解决这个问题，服务器可以在拖动窗口时绘制其轮廓，并在拖动完成后绘制完整的窗口。

这是优化后的rdp文件

```
screen mode id:i:2
use multimon:i:0
desktopwidth:i:1024
desktopheight:i:768
session bpp:i:32
winposstr:s:0,3,0,0,800,600
compression:i:0
keyboardhook:i:2
audiocapturemode:i:1
videoplaybackmode:i:0
connection type:i:6
displayconnectionbar:i:1
disable wallpaper:i:0
allow font smoothing:i:1
allow desktop composition:i:1
disable full window drag:i:1
disable menu anims:i:1
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
full address:s:192.168.1.63
server port:i:3389
audiomode:i:0
redirectprinters:i:0
redirectcomports:i:0
redirectsmartcards:i:0
redirectclipboard:i:1
redirectposdevices:i:0
redirectdirectx:i:1
autoreconnection enabled:i:1
authentication level:i:2
prompt for credentials:i:0
remoteapplicationmode:i:0
alternate shell:s:
shell working directory:s:
gatewayhostname:s:192.168.1.60:9443
gatewayusagemethod:i:1
gatewaycredentialssource:i:4
gatewayprofileusagemethod:i:1
promptcredentialonce:i:1
use redirection server name:i:0
rdgiskdcproxy:i:0
kdcproxyname:s:
drivestoredirect:s:*
usbdevicestoredirect:s:
use gfx:i:0
multi touch:i:0
GDI rendering:i:0
servertoclientclipboard:i:1
clienttoserverclipboard:i:1
```

#### 5.12 wfreerdp自动连接脚本

新建一个rdp文件夹，里面存放3个文件

```
PS C:\Users\kk> cd .\Desktop\rdp\
PS C:\Users\kk\Desktop\rdp> ls


    目录: C:\Users\kk\Desktop\rdp


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----         2025/4/18      0:00           2392 rdpgw.rdp
-a----         2025/4/16     22:26            425 rdp_connect.bat
-a----         2025/3/26     21:33        8781824 wfreerdp.exe
```

rdpgw.rdp是上面的优化过的配置文件

wfreerdp.exe是下载的程序

这是rdp_connect.bat连接脚本的内容

```cmd
@echo off
set CURRENT_DIR=%~dp0
cd /d "%CURRENT_DIR%"
.\wfreerdp.exe .\rdpgw.rdp /u:administrator /p:123456 /cert:ignore /sound:latency:200 /gfx +compression /v:192.168.1.63
```

#### 5.13 开源网关配置文件不启用功能性参数

开源网关配置文件和rdp文件重复，例如：同时开启磁盘重定向，虚拟机映射的磁盘会重复，建议禁用开源网关的磁盘重定向

```
root@debian:~/appdata/opt/rdpgw# cat rdpgw.yaml
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
    - "192.168.1.61:3389"
    - "192.168.1.62:3389"
    - "192.168.1.63:3389"
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
  EnableDrive: false

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
root@debian:~/appdata/opt/rdpgw#
```
#### 5.14 域用户登陆配置

ad域和samba ad域通用

rdp文件

```
screen mode id:i:1
use multimon:i:0
desktopwidth:i:1920
desktopheight:i:1080
session bpp:i:32
winposstr:s:0,3,0,0,800,600
compression:i:0
keyboardhook:i:2
audiocapturemode:i:1
videoplaybackmode:i:0
connection type:i:6
displayconnectionbar:i:1
disable wallpaper:i:0
allow font smoothing:i:1
allow desktop composition:i:1
disable full window drag:i:1
disable menu anims:i:1
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
full address:s:192.168.1.62
server port:i:3389
audiomode:i:0
redirectprinters:i:1
redirectcomports:i:0
redirectsmartcards:i:0
redirectclipboard:i:1
redirectposdevices:i:0
redirectdirectx:i:1
autoreconnection enabled:i:1
authentication level:i:2
prompt for credentials:i:0
remoteapplicationmode:i:0
alternate shell:s:
shell working directory:s:
gatewayhostname:s:192.168.1.60:9443
gatewayusagemethod:i:1
gatewaycredentialssource:i:4
gatewayprofileusagemethod:i:1
promptcredentialonce:i:1
use redirection server name:i:0
rdgiskdcproxy:i:0
kdcproxyname:s:
drivestoredirect:s:
usbdevicestoredirect:s:*;USB\VID_ffff&PID_ffff;-USB\VID_2dd6&PID_2781
username:s:vdi\user01
password:s:
gatewayusername:s:user01
gatewaypassword:s:
gatewaydomain:s:vdi
use gfx:i:0
multi touch:i:0
gdi rendering:i:0
servertoclientclipboard:i:1
clienttoserverclipboard:i:1
networkautodetect:i:1
bandwidthautodetect:i:1
enableworkspacereconnect:i:0
redirectwebauthn:i:1
negotiate security layer:i:1
gatewaybrokeringtype:i:0
enablerdsaadauth:i:0
```

wfreerdp连接命令

```
.\wfreerdp.exe .\rdpgw.rdp /u:user02 /d:vdi /p:abc@2021 /cert:ignore /sound:latency:200 /gfx +compression /v:192.168.1.65 /w:1280 /h:720
```
