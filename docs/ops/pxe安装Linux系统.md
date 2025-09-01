## pxe安装Linux系统

### 目标

```bash
#通过pxe批量部署Linux系统

#本次部署使用pxe的分支，ipxe做部署
```

### 部署环境

```bash
#服务端：网络中有一台 DHCP 服务器以便为客户机自动分配地址、指定引导文件位置。 

#客户端：客户机的网卡要支持PXE协议（集成BOOTROM芯片），且主板支持网络引导。一般大多数服务器主机都支持，只需在BIOS设置中允许从 Network 或 LAN 启动即可。

#服务器要通过 TFTP服务（简单文件传输协议）来提供系统内核和引导镜像文件的下载
```

### 搭建pxe服务器

```bash
#本次以Deebian12搭建为例
```
#### 配置静态ip

* 编辑/etc/network/interfaces文件，配置静态ip，重启服务器生效

```bash
source /etc/network/interfaces.d/*
auto lo
iface lo inet loopback
allow-hotplug ens18
iface ens18 inet static
address 192.168.8.150
netmask 255.255.255.0
gateway 192.168.8.1
```

#### 禁用防火墙

```bash
#停止防火墙
systemctl stop firewalld

#禁止防火墙开机自启
systemctl disable firewalld
```

#### 创建ipxe工作目录

```bash
#创建ipxe工作目录
mkdir /ipxe

#提升权限
chmod 777 /ipxe

#创建ipxe固件目录
mkdir /ipxe/firmware

#创建启动菜单目录
mkdir /ipxe/menu
```

#### 部署tftp服务

* 安装dnsmasq

```bash
#使用dnsmasq工具提供tftp服务
apt install dnsmasq -y
```

* 编辑/etc/dnsmasq.conf配置文件

```bash
enable-tftp
tftp-no-fail
tftp-root=/ipxe/firmware
```

* 启用dnsmasq服务

```bash
#配置开机自启
systemctl enable dnsmasq

#启动服务
systemctl start dnsmasq
```

####  获取ipxe固件

* 获取传统bios固件

```bash
wget -O /ipxe/firmware/undionly.kpxe https://boot.ipxe.org/undionly.kpxe
```

* 获取uefi固件

```bash
wget -O /ipxe/firmware/ipxe.efi https://boot.ipxe.org/ipxe.efi
```

#### 配置DHCP服务

* 安装isc-dhcp-server

```bash
#dnsmasq也能部署DHCP，这里使用ipxe官网推荐的isc-dhcp-server工具
apt install isc-dhcp-server -y

#安装时后报错，正常现象，配置好接口就没问题了
```

* 编辑isc-dhcp-server使用的网卡配置文件/etc/default/isc-dhcp-server

```bash
INTERFACESv4="ens18"
```

* 编辑isc-dhcp-server配置文件/etc/dhcp/dhcpd.conf

```bash
default-lease-time 3600;
max-lease-time 7200;
option client-architecture code 93 = unsigned integer 16;

subnet 192.168.8.0 netmask 255.255.255.0 {
    range 192.168.8.80 192.168.8.90;
    option routers 192.168.8.1;
    option broadcast-address 192.168.8.255;
    option domain-name-servers 192.168.8.1;
    authoritative;
    next-server 192.168.8.150;
    if exists user-class and option user-class = "iPXE" {
        filename "http://192.168.8.150/menu/boot.ipxe";
    } elsif option client-architecture = 00:07 or option client-architecture = 00:09 {
        filename "ipxe.efi";
    } elsif option client-architecture = 00:00 {
        filename "undionly.kpxe";
    }
}
```

* 启动isc-dhcp-server服务

```bash
#开机自启
systemctl enable isc-dhcp-server

#启动服务
systemctl start isc-dhcp-server
```

#### 配置http服务

```bash
#因为dhcp服务采用的http服务，所以这里需要部署一个http服务，使用nginx提供http服务
```

* 安装nginx

```bash
apt install nginx -y
```

* 编辑nginx配置文件/etc/nginx/nginx.conf

```bash
#user http;
worker_processes  auto;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;
    
    server {
        listen       80;
        server_name  localhost;
    
    charset utf-8;
    autoindex on;
    autoindex_exact_size off;
    autoindex_localtime on;
    
        location / {
            root   /ipxe;
            index  index.html index.htm;
        }
    
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
}
```

* 配置nginx服务

```bash
#开机自启
systemctl enable nginx

#启动服务
systemctl start nginx
```

#### 配置nfs服务

* nfs服务

```bash
#nfs服务提供挂载服务
```

* 安装nfs-server

```bash
apt install nfs-server -y
```

* 编辑nfs配置文件/etc/exports

```bash
#末尾添加一行
#rw/io该目录共享的权限是可读写或只读，但最终能不能读写 ，还是与文件系统的rwx及身份有关
#sync代表数据会同步写入到内存与硬盘中，async则代表数据会暂存于内存当中，而非直接写入硬盘
#no_root_squash / root_squash	客户端使用NFS文件系统的帐号若为root时，系统该如何判断这个帐号的身份？默认情况下，客户端root的身份会由root_squash的设置压缩成nfsnobody，如此对服务器的系统会较有保障，但如果想要开放客户端使用root身份来操作服务器的文件系统，那么这里就需要开放no_root_squash才行
#*表示任何ip都可以访问，也可以具体配置为192.168.1.0网段

/ipxe *(rw,sync,insecure,no_subtree_check,no_root_squash)
```

* 配置nfs服务

```bash
#开机自启
systemctl enable nfs-server

#启动服务
systemctl start  nfs-server
```

#### 配置ipxe菜单

* 创建/ipxe/menu/boot.ipxe文件，并编辑内容

```bash
#!ipxe
    set menu-timeout 16000
    set menu-default reboot

:start
  menu iPXE Boot Menu
  item --gap --             -------------------------- IPXE by Lu Xu ---------------------------
  item --key 1 wepe		[1] WePE (offline)
  item --key 2 winpe-online	[2] WinPE (online)
  item --key 3 centos7		[3] Centos7
  item --key 4 centos9		[4] Centos9
  item --key 5 ubuntu20		[5] ubuntu20
  item --key 6 ubuntukylin20	[6] ubuntukylin20
  item --key 7 deepin20		[7] deepin20
  item --key 8 uos22		[8] uos22
  item --key 5 ubuntu20smb	[9] ubuntu20smb
  item --key 6 ubuntukylin20smb	[0] ubuntukylin20smb
  item --key r reboot		[R] Reboot
  choose --timeout ${menu-timeout} --default ${menu-default} selected
  goto ${selected}

:wepe
  sanboot http://192.168.8.150/WePE_64_V2.3.iso

:winpe-online
  sanboot http://192.168.8.150/fb4.iso

:centos7
  set base http://192.168.8.150/centos7/
  kernel ${base}images/pxeboot/vmlinuz initrd=initrd.img inst.repo=${base}
  initrd ${base}images/pxeboot/initrd.img
  boot

:centos9
  set base http://192.168.8.150/centos9/
  kernel ${base}images/pxeboot/vmlinuz initrd=initrd.img inst.repo=${base}
  initrd ${base}images/pxeboot/initrd.img
  boot

:ubuntu
  set address 192.168.8.150
  set base http://${address}/ubuntu/
  set gfxpayload=keep
  kernel ${base}casper/vmlinuz url=${base}preseed/ubuntu.seed boot=casper maybe-ubiquity quiet initrd=initrd netboot=nfs nfsroot=${address}:/ipxe/ubuntu20/ ip=dhcp root=/dev/nfs fsck.mode=skip ---
  initrd ${base}casper/initrd
  boot

:ubuntukylin20
  set address 192.168.8.150
  set base http://${address}/ubuntukylin20/
  set gfxpayload=keep
  kernel ${base}casper/vmlinuz boot=casper maybe-ubiquity quiet initrd=initrd netboot=nfs nfsroot=${address}:/ipxe/ubuntukylin20/ ip=dhcp root=/dev/nfs fsck.mode=skip ---
  initrd ${base}casper/initrd
  boot

:deepin20
  set gfxpayload=keep
  set address 192.168.8.150
  set base http://${address}/deepin20/
  kernel ${base}live/vmlinuz initrd=initrd.lz console=tty boot=live netboot=nfs nfsroot=${address}:/ipxe/deepin20/ components union=overlay locales=zh_CN.UTF-8 livecd-installer ---
  initrd ${base}live/initrd.lz
  boot

:uos22
  set gfxpayload=keep
  set address 192.168.8.150
  set base http://${address}/uos22/
  kernel ${base}live/vmlinuz initrd=initrd.lz console=tty boot=live netboot=nfs nfsroot=${address}:/ipxe/uos22 components union=overlay locales=zh_CN.UTF-8 livecd-installer ---
  initrd ${base}live/initrd.lz
  boot

:ubuntu20smb
  set address 192.168.8.150
  set base http://${address}/ubuntu20/
  set gfxpayload=keep
  kernel ${base}casper/vmlinuz url=${base}preseed/ubuntu.seed boot=casper maybe-ubiquity quiet initrd=initrd netboot=cifs nfsroot=//${address}/ipxe/ubuntu20 NFSOPTS=-ouser=anonymous,pass=anonymous,ro,vers=2.0 ip=dhcp root=/dev/cifs fsck.mode=skip ---
  initrd ${base}casper/initrd
  boot

:ubuntukylin20smb
  set address 192.168.8.150
  set base http://${address}/ubuntukylin20/
  set gfxpayload=keep
  kernel ${base}casper/vmlinuz boot=casper maybe-ubiquity quiet initrd=initrd netboot=cifs nfsroot=//${address}/ipxe/ubuntukylin20 NFSOPTS=-ouser=anonymous,pass=anonymous,ro,vers=2.0 ip=dhcp root=/dev/cifs fsck.mode=skip ---
  initrd ${base}casper/initrd
  boot

:reboot
  reboot
```

### 测试

#### wepe

```bash
#把WePE_64_V2.3.iso上传到/ipxe目录

#重启nginx服务
systemctl restart nginx

#测试机pxe可以正常加载wepe
```

#### centos7

* 挂载镜像

```bash
mount CentOS-7-x86_64-Minimal-2009.iso  /mnt/
```

* 准备镜像文件

```bash
#创建centos7目录
mkdir -p /ipxe/centos7

#复制到工作目录
cp -R /mnt/* /ipxe/centos7
```

* 提升权限

```bash
chmod 777 /ipxe/centos7
```

* 测试结果

```bash
#重启nginx服务
systemctl restart nginx

#测试机pxe可以正常加载，并完成安装
```

#### ubuntu

* 挂载镜像

```bash
mount ubuntu-22.04.3-live-server-amd64.iso /mnt
```

* 准备镜像文件

```bash
#创建ubunut目录
mkdir -p /ipxe/ubuntu

#复制到工作目录
cp -r /mnt/* /ipxe/ubuntu
```

* 提示权限

```bash
chmod 777 /ipxe/ubuntu
```

* 测试结果

```bash
#重启nginx服务
systemctl restart nginx

#测试机pxe可以正常加载，并完成安装
```

#### deepin

```bash
#测试版本 deepin-desktop-community-20.9-amd64.iso，通过安装测试
```

#### centos9

```bash
#测试时，联网安装可以，但是没法本地安装
```

#### debian12

```bash
#无法本地网络安装，过于复杂，缺少参考教程，测试没有成功
```

