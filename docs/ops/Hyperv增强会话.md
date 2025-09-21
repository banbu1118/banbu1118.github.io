## Hyperv增强会话

### 一、简介

Hyper-V 的 增强会话模式 (Enhanced Session Mode, ESM) 是 Hyper-V 提供的一种虚拟机连接功能，它在传统 RDP 或基本虚拟机控制台的基础上增加了更丰富的体验和集成功能。

windows虚拟机无需网络和开启远程桌面就能使用增强会话。

简单理解：增强会话=rdp+vmbus

rdp：远程桌面协议 (RDP) 来传输图形界面、音频、剪贴板、磁盘重定向等高层用户体验内容

vmbus：Hyper-V 的内部虚拟总线，用于宿主机和虚拟机之间高速通信

### 二、安装第二代虚拟机

第二代虚拟机默认支持增强会话

### 三、获取虚拟机参数

在 Hyper-V 里，虚拟机 GUID 是指虚拟机的 全局唯一标识符 (Globally Unique Identifier)，它是一个固定的 128 位（16 字节）标识符，用来唯一区分 Hyper-V 上的每一台虚拟机

```powershell
PS C:\Users\Administrator> Get-VM -Name "w11-1" | Select-Object VMId

VMId
----
59f47af0-ee7f-4518-9121-b766aa40a06a
```

### 四、通过mstsc连接虚拟机

创建rdp文件，内容如下，双击连接

> 注意:
>
> ip：服务器ip
>
> pcb：上一步获取的guid
>
> 端口：增强会话默认端口2179

```rdp
session bpp:i:32
compression:i:1
keyboardhook:i:2
audiocapturemode:i:1
videoplaybackmode:i:1
connection type:i:7
networkautodetect:i:1
bandwidthautodetect:i:1
enableworkspacereconnect:i:0
disable wallpaper:i:0
allow font smoothing:i:0
allow desktop composition:i:0
disable full window drag:i:1
disable menu anims:i:1
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
audiomode:i:0
redirectlocation:i:1
redirectcomports:i:1
redirectsmartcards:i:1
redirectwebauthn:i:1
autoreconnection enabled:i:1
prompt for credentials:i:0
negotiate security layer:i:0
remoteapplicationmode:i:0
shell working directory:s:
promptcredentialonce:i:0
use redirection server name:i:0
rdgiskdcproxy:i:0
kdcproxyname:s:
enablerdsaadauth:i:0
full address:s:192.168.1.50
pcb:s:8b6f143f-5c12-4ba5-ab0c-c09868a767d2;EnhancedMode=1
server port:i:2179
use multimon:i:1
screen mode id:i:2
displayconnectionbar:i:1
redirectclipboard:i:1
camerastoredirect:s:*
devicestoredirect:s:*
redirectposdevices:i:0
redirectprinters:i:1
drivestoredirect:s:*
authentication level:i:2
alternate shell:s:
desktopwidth:i:800
desktopheight:i:600
winposstr:s:0,3,0,0,800,600
gatewayhostname:s:
gatewayusagemethod:i:4
gatewaycredentialssource:i:4
gatewayprofileusagemethod:i:0
gatewaybrokeringtype:i:0
```

### 五、ESM与RDP

|              | ESM增强会话                             | 标准RDP                                 |
| ------------ | --------------------------------------- | --------------------------------------- |
| 支持平台     | 仅Hyper-V虚拟机                         | 任意主机                                |
| 协议         | RDP + VMBus                             | 纯 RDP                                  |
| 便捷性       | 无需知道IP                              | 需知道IP                                |
| 效果         | 视频播放30帧                            | 视频播放25帧左右                        |
| 跨平台       | 仅支持mstsc                             | mstsc/freerdp                           |
| 资源访问     | 支持共享剪贴板、磁盘、打印机、USB、音频 | 支持共享剪贴板、磁盘、打印机、USB、音频 |
| 文件传输效率 | 10MB/s                                  | 50MB/s                                  |

