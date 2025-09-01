## Dockcer搭建samba-ad-dc

* samba搭建ad简介

```
通过容器的方式部署开源samba-ad-dc，可以作为微软AD域的代替方案

项目地址：https://github.com/diegogslomp/samba-ad-dc
```

* 配置虚拟机cpu类型

```
一定将虚拟机的cpu类型配置为host模式，防止容器运行出错
```

* 配置静态ip

```bash
root@ad:~# cat /etc/network/interfaces
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback

# The primary network interface
allow-hotplug ens18
iface ens18 inet static
address 192.168.8.30
netmask 255.255.255.0
gateway 192.168.8.1
```

* 设置主机名为ad

```bash
hostnamectl  set-hostname ad
```

* 编辑/etc/resolv.conf的dns为固定ip

```bash
root@ad:~# cat /etc/resolv.conf
nameserver 192.168.8.30
```

* 编辑/etc/hosts，添加域名解析信息

```bash
root@ad:~# cat /etc/hosts
127.0.0.1       localhost
192.168.8.30    ad.vdi.cloud.com ad

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
```

* 配置管理员账号，域名等信息后，创建运行容器

```bash
#国内环境可能无法拉取镜像，请自行处理
docker run -d --privileged \
  --restart=unless-stopped --network=host \
  -e REALM='vdi.cloud.com' \
  -e DOMAIN='vdi' \
  -e ADMIN_PASS='abc@2020' \
  -e DNS_FORWARDER='114.114.114.114' \
  -v dc1_etc:/usr/local/samba/etc \
  -v dc1_private:/usr/local/samba/private \
  -v dc1_var:/usr/local/samba/var \
  --name samba-ad --hostname ad diegogslomp/samba-ad-dc:latest
```

* 使用samba-tool创建用户和用户组

```bash
#进入创建的容器内
docker exec  -it samba-ad /bin/bash

#创建用户组vdiuser
samba-tool group add vdiuser

#创建用户user01
samba-tool user add user01

#把user01用户添加到vdiuser组
samba-tool group addmembers vdiuser user01

#修改管理员密码
samba-tool user setpassword Administrator

#修改用户密码
samba-tool user setpassword user01

#配置用户密码永不过期
samba-tool user setexpiry user01 --noexpiry
```