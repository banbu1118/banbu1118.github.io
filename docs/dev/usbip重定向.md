## usbip重定向

### 一、简介

usbip（usb oveer ip）是一个开源项目， 旨在允许通过网络共享 USB 设备，使得网络上的其他计算机能够访问本地 USB 设备。

### 二、Linux客户端与服务器配置

#### 配置服务端

不同发行版的 Linux 操作系统安装 USB/IP 的方式，内核模块的名称略有差异。

* 安装usbip

```bash
apt install usbip
```

* 加载内核模块

```bash
modprobe usbip-core

modprobe usbip_host

modprobe vhci-hcd
```

* 插入usb设备，查询usb设备

```bash
root@debian:~# usbip list --local
 - busid 1-5 (2bdf:0280)
   unknown vendor : unknown product (2bdf:0280)

 - busid 1-6 (8087:0a2a)
   Intel Corp. : Bluetooth wireless interface (8087:0a2a)

 - busid 1-8 (413c:2113)
   Dell Computer Corp. : KB216 Wired Keyboard (413c:2113)
```

* 启动监听服务，可以指定端口号，默认3240端口

```bash
usbipd -D

#指定端口号
usbipd -D --tcp-port 8888
```

*  按照上面记录busid的值 ，共享usb设备

```bash
usbip bind -b 1-5
```

#### 配置客户端

* 安装usbip

```bash
apt install usbip
```

* 加载内核模块

```bash
modprobe usbip-core

modprobe usbip_host

modprobe vhci-hcd
```

* 查询远程usb设备

```bash
usbip list --remote=192.168.1.130
```

* 绑定远程usb设备到本地

```bash
usbip attach --remote=192.168.1.130 --busid=1-5
```

* 查看当前usb设备列表

```bash
lsusb
```

* 如果返回了绑定的usb设备，说明共享成功

### 三、windows客户端与服务端配置

Linux与Windows环境可以组合使用，比如windows服务端，Linux客户端。

#### 配置服务端-1

* 下载安装，下载地址：[https://github.com/dorssel/usbipd-win](https://github.com/dorssel/usbipd-win)，开源服务端

```
下载后管理员权限安装即可
```

* 查看设备

```
需管理员权限打开cmd

usbipd list
```

* 绑定设备

```
usbipd bind --busid=<busid>
```

* 注意默认端口是3240，防火墙需要放行

#### 配置服务器端-2

* 下载地址：[https://www.virtualhere.com/windows_server_software](https://www.virtualhere.com/windows_server_software)，商业客户端，试用版一次只能共享一台设备

* 使用

```
下载后管理员权限运行即可
```

#### 配置客户端

* 下载地址：[https://www.virtualhere.com/usb_client_software](https://www.virtualhere.com/usb_client_software)，商业客户端

* 使用

```
下载后管理员权限运行即可
```

#### usb-over-ip

* 下载地址：[https://www.usb-over-network.com](https://www.usb-over-network.com)，商业产品，客户端支持免费版本


### 四、测试

经过测试，U盘，摄像头，打印机都可以重定向成功

### 五、pve客户端使用推荐方法

服务端 共享usb设备，pve客户端对接，然后直通usb端口给虚拟机。这样虚拟机不用安装任何客户端就可以使用usb设备

### 六、screengo共享云桌面探索

screengo可以通过浏览器分享桌面，如果把键鼠usb重定向到虚拟机，就等于获得了另一种云桌面方法，实测效果不错。

screengo项目：https://github.com/screego/server

screengo demo：https://app.screego.net
