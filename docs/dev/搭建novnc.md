# 搭建novnc

## 一、搭建vnc服务器

搭建环境：Debian12 xfce

- Debian12 安装tigervnc

```shell
apt install tigervnc-standalone-server
```

- 配置vnc密码

```shell
debian@lgb:~$ vncpasswd
Password:
Verify:
Would you like to enter a view-only password (y/n)? n
```

- 启动vnc服务

```shell
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

## 二、搭建novnc

另一台Debian12主机，这台主机无需x11桌面

- 安装相关依赖

 python3-numpy 可选

```shell
apt update
apt install git  python3-numpy unzip -y
```

- 从novnc项目官网下载release稳定版本

```shell
https://github.com/novnc/noVNC/releases
```

- 解压

```shell
unzip noVNC-1.6.0.zip
```

- 运行

这一步会自动Github下载websockify到utils目录，然后运行novnc

如果Github下载websockify失败，可以使用直接安装websockify，然后运行novnc

```shell
cd /noVNC-1.6.0

./utils/novnc_proxy --vnc 192.168.1.121:5901

#安装websockify
#apt install python3-websockify -y
```

访问方式：http://ip:8443

- https运行

```shell
# 生存ssl证书
openssl req -x509 -nodes -days 365 -newkey rsa:2048   -keyout /root/self.key   -out /root/self.crt   -subj "/CN=192.168.1.169"

./noVNC-1.6.0/utils/novnc_proxy --cert /root/self.crt --key /root/self.key --vnc 192.168.1.121:5901 --listen 8443
```

访问方式：https://ip:8443

