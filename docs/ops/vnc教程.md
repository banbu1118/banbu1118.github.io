# vnc教程

VNC（Virtual Network Computing）是一种远程桌面协议和工具，允许用户通过网络连接到远程计算机的桌面并进行交互。

## 一、tigervnc

### 1. 项目链接

[GitHub官网](https://github.com/TigerVNC/tigervnc)

[tigervnc官网](https://tigervnc.org/)

[稳定版本下载](https://sourceforge.net/projects/tigervnc/files/stable/)

[实验版本下载](http://tigervnc.bphinz.com/nightly/)

### 2. 简介

tigervnc是一个跨平台的vnc工具，支持Linux、Windows和macOS。

tigervnc支持物理显示器和虚拟显示器连接，经测试，无硬件加速的情况下，虚拟显示器效果更好。

分为服务端和客户端：

服务端：提供vnc服务

客户端：进行vnc连接

### 3. 测试环境

vnc server：Debian12 xfce

vnc client ：win10

novnc：Debian 12

web： chrome edge测试novnc

### 4. 使用(虚拟显示器)

#### 4.1Debian12 安装tigervnc

```bash
apt install tigervnc-standalone-server
```

#### 4.2 配置vnc密码

```bash
debian@lgb:~$ vncpasswd
Password:
Verify:
Would you like to enter a view-only password (y/n)? n
```

#### 4.3 启动vnc服务

```bash
# 注意，因为系统安装的是xfce4桌面，所以用了 /usr/bin/xfce4-session 
tigervncserver -xstartup /usr/bin/xfce4-session -geometry 1280x800 -localhost no :1

#geometry 指定 VNC 会话的屏幕分辨率
#localhost 控制是否只允许本地连接 no：允许来自远程主机的连接 yes：只允许从本地主机连接
#:1 VNC服务器的显示编号 VNC 服务器会监听在5901端口(因为 5900 + 1 = 5901)

#也可直接启动
tigervncserver -geometry 1920x1080 -localhost no :1

#查看vnc会话
tigervncserver -list

# 关闭服务的命令
tigervncserver -kill :1
```

#### 4.4 直连vnc

在win10使用任意vnc客户端连接即可

#### 4.5 使用novnc代理

```bash
#安装vnc
apt install novnc python3-websockify

#为noVNC服务生成一个私有证书(选做)
openssl req -x509 -nodes -newkey rsa:3072 -keyout novnc.pem -out novnc.pem -days 3650

#启用novnc
websockify -D --web=/usr/share/novnc/ --cert=/root/novnc.pem 41181 localhost:5901

#关闭novnc代理的tcp转发
ps aux | grep websockify

#kill websockify进程的pid
kill -9 pid
```

####  4.6 novnc代理访问

浏览器使用`https://ip:41181访问`

### 5. 使用(物理显示器)

#### 5.1 Debian12安装tigervnc-scraping-server

这是一个用来抓取屏幕共享的tigervnc组件，这个组件的效果比虚拟机显示器差

```bash
apt install tigervnc-scraping-server/stable
```

#### 5.2 配置vnc密码

```bash
debian@lgb:~$ vncpasswd
Password:
Verify:
Would you like to enter a view-only password (y/n)? n
```

#### 5.3 启动vnc服务

```bash
#:0使用第一个块屏幕，默认是物理显示器
x0vncserver :0

#查看连接
x0vncserver -list

#关闭服务的命令
x0vncserver -kill :0
```

#### 5.4 直连vnc

使用win10的vnc客户端直连失败，不知道原因

#### 5.5 使用novnc代理

```bash
#安装vnc
apt install novnc python3-websockify

#为noVNC服务生成一个私有证书(选做)
openssl req -x509 -nodes -newkey rsa:3072 -keyout novnc.pem -out novnc.pem -days 3650

#启用novnc
websockify -D --web=/usr/share/novnc/ --cert=/root/novnc.pem 41181 localhost:5900

#关闭novnc代理的tcp转发
ps aux | grep websockify

#kill websockify进程的pid
kill -9 pid
```

#### 5.6 novnc代理访问

浏览器使用`https://ip:41181访问`

## 二、novnc

### 1. 项目官网

[GitHub官网](https://github.com/novnc/noVNC)

[官网](https://novnc.com)

### 2. 简介

noVNC 是一个基于 HTML5 的 VNC（Virtual Network Computing）客户端，它允许用户通过浏览器访问远程计算机的桌面。

## 三、KasmVNC 

### 1. 项目官网

[GitHub官网](https://github.com/kasmtech/KasmVNC)

[官网](https://kasmweb.com)

[官网文档](https://kasmweb.com/kasmvnc/docs/master/serverside.html#quick-start)

[安装包下载](https://github.com/kasmtech/KasmVNC/releases)

[参考教程](https://ivonblog.com/posts/kasmvnc-setup/)

### 2. 简介

KasmVNC 提供对桌面或应用程序的基于 Web 的远程访问。

虽然名称中包含 VNC，但 KasmVNC 不同于 TigerVNC、RealVNC 和  TurboVNC 等其他 VNC 变体。

KasmVNC 打破了定义 VNC 的 RFB 规范，以支持现代技术并提高安全性。

KasmVNC  可由用户从任何现代浏览器访问，并且不支持传统的 VNC 查看器应用程序。 

### 3. 测试环境

vnc server：Debian12 xfce

vnc client ：win10

### 4. 使用(虚拟机显示器)

#### 4.1Debian12安装kasmvnc

```bash
apt install ./kasmvncserver_bookworm_1.3.3_amd64.deb
```

#### 4.2 配置vnc密码

```bash
vncpasswd -u root -w -r
```

#### 4.3 启动vnc服务

```bash
root@debian:~# vncserver
Creating default config /root/.vnc/kasmvnc.yaml
Please choose Desktop Environment to run:
[1] XFCE
[2] Manually edit xstartup
1

New 'debian:1 (root)' desktop is debian:1

Users configured:
root (can use keyboard and mouse)

Log file is /root/.vnc/debian:1.log

Starting applications specified in /root/.vnc/xstartup

Paste this url in your browser:
https://127.0.1.1:8444

#查看会话
vncserver -list

#结束会话
vncserver -list :1
```

#### 4.5 访问

浏览器直接访问：https://127.0.1.1:8444

### 5.使用(物理显示器)

#### 5.1 启动服务

创建空白监视器

```bash
vncserver -noxstartup :1
```

将diskplay:0转发给vncserver:1

```bash
kasmxproxy -a :0 -v :1 &
```

#### 5.2 访问

浏览器直接访问：https://127.0.1.1:8444
