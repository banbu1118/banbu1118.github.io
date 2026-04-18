## 编译guacamole服务端

环境Debian12.12

### 一、安装编译环境

```bash
apt update
apt install build-essential libcairo2-dev libjpeg62-turbo-dev libpng-dev libtool libossp-uuid-dev freerdp2-dev -y
```

注意：guacamole暂时不支持freerdp3，这里才使用freerdp2

### 二、下载 guacamole-server 源码

去官网下载服务端源码

[[Apache Guacamole®](https://guacamole.apache.org/)]([Apache Guacamole®](https://guacamole.apache.org/))

### 三、生成 configure

解压服务端源码

```bash
tar -xzf guacamole-server-1.6.0.tar.gz
cd guacamole-server-1.6.0
```

生成 configure

```bash
./configure --with-systemd-dir=/etc/systemd/system --disable-ssh --disable-vnc --disable-telnet --disable-recording
```

会看到类似输出

```bash
RDP support: yes
SSH support: no
VNC support: no
```

只要 RDP 是 yes 就成功了

### 四、编译 guacd

```bash
make -j$(nproc)
```

编译完成后

```bash
make install
ldconfig
```

### 五、启动  guacd

配置systemd 启动

```bash
systemctl enable guacd
systemctl start guacd
```

检查

```bash
systemctl status guacd
```

### 六、修改启动文件

默认只监听 IPv6 本地回环，外部机器连不上，修改允许访问，我这里改为只允许本机访问

同时增加运行权限

编辑启动服务

```bash
nano /etc/systemd/system/guacd.service
```

注释所有内容，替换为如下内容

```bash
[Unit]
Description=Guacamole Server
Documentation=man:guacd(8)
After=network.target

[Service]
User=root

Environment="HOME=/root"
Environment="XDG_CONFIG_HOME=/root/.config"
Environment="XDG_CACHE_HOME=/root/.cache"

ExecStart=/usr/local/sbin/guacd -b 127.0.0.1 -f

Restart=on-abnormal

[Install]
WantedBy=multi-user.target
```

重新加载systemd

```bash
systemctl daemon-reload
```

重启guacd

```bash
systemctl restart guacd
```

看日志

```bash
journalctl -u guacd -b --no-pager | tail -100
```

### 七、验证版本

```bash
guacd -v
```

### 八、打包

在一个干净的环境操作，不要使用上面的编译环境

打包环境

```bash
apt update
apt install -y build-essential devscripts debhelper dh-make fakeroot lintian pkg-config libcairo2-dev libjpeg62-turbo-dev libpng-dev libtool libossp-uuid-dev freerdp2-dev
```

官网获取源码

```bash
tar -xzf guacamole-server-1.6.0.tar.gz
cd guacamole-server-1.6.0
```

先验证能否正常编译（非常重要）

```bash
./configure --prefix=/usr --sysconfdir=/etc --libdir=/usr/lib --with-systemd-dir=/lib/systemd/system --disable-ssh --disable-vnc --disable-telnet --disable-recording

make -j$(nproc)
```

确认

```bash
RDP support: yes
```

初始化 Debian 打包结构

```bash
dh_make --createorig
```

选择

```bash
s  (single binary)
```

选择

```bash
y
```



清理模板文件

```bash
cd debian
rm *.ex *.EX README.Debian
```

编辑control

```bash
cd ..
nano debian/control
```

内容如下

```bash
Source: guacamole-server
Section: net
Priority: optional
Maintainer: Your Name <you@example.com>
Build-Depends: debhelper-compat (= 13), libcairo2-dev, libjpeg62-turbo-dev, libpng-dev, libtool, libossp-uuid-dev, freerdp2-dev, pkg-config
Standards-Version: 4.6.2
Rules-Requires-Root: no

Package: guacamole-server
Architecture: amd64
Depends: ${shlibs:Depends}, ${misc:Depends}
Description: Apache Guacamole server (guacd)
 Guacamole is a clientless remote desktop gateway.
 This package provides guacd daemon with RDP support only.
```

编辑rules文件

```bash
nano debian/rules
```

内容如下

```bash
#!/usr/bin/make -f

%:
	dh $@

override_dh_auto_test:
	true
```

赋权

```bash
chmod +x debian/rules
```

必须删除 compat

```bash
rm -f debian/compat
```

systemd 服务文件

```bash
nano debian/guacd.service
```

内容如下

```bash
[Unit]
Description=Guacamole Server
Documentation=man:guacd(8)
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/sbin/guacd -b 127.0.0.1 -f
Restart=always

[Install]
WantedBy=multi-user.target
```

创建

```bash
nano debian/guacamole-server.install
```

内容如下

```bash
debian/guacd.service lib/systemd/system/
```

新建

```bash
nano debian/changelog 
```

内容如下

```bash
guacamole-server (1.6.0-1) UNRELEASED; urgency=medium

  * Initial Debian package build for guacamole-server

 -- Your Name <you@example.com>  Sat, 18 Apr 2026 10:00:00 +0000
```

打包

```bash
dpkg-buildpackage -us -uc -b
```

成功打包，在上级目录查看

```bash
cd ..
guacamole-server_1.6.0-1_amd64.deb
```

安装

```bash
apt instlal ./guacamole-server_1.6.0-1_amd64.deb
```



验证安装

```bash
dpkg -i guacamole-server_1.6.0-1_amd64.deb
systemctl status guacd
```

### 九、下载

构建好的deb包，国内可下载：[https://share.weiyun.com/jPEs6oHv](https://share.weiyun.com/jPEs6oHv)
