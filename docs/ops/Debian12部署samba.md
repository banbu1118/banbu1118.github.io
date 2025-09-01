## Debian12部署samba

### 1、简介

SMB是一种在局域网上共享文件和打印机的一种通信协议，它为局域网内的不同计算机之间提供文件及打印机等资源的共享服务 

### 2、安装samba

安装samba包

```shell
apt install samba -y
```

查看安装版本

```shell
samba -V
```

### 3、编辑配置

创建存储路径

```shell
mkdir /share
```

打开配置文件

```shell
nano /etc/samba/smb.conf
```

末尾添加如下内容

```shell
[smbshare]
comment = share
path = /share
writable = yes
browsable = yes
```

为root添加smb连接配置密码

```shell
smbpasswd -a root
```

### 4、登陆

访问：\\\ip\smbshare

用户名：root

密码：上面配置的smb连接密码

### 5、多用户配置

创建存储路径

```shell
mkdir -p /share/k1
mkdir -p /share/k2
```

创建新用户

```shell
useradd k1

useradd k2
```

配置用户密码

```shell
smbpasswd  -a k1

smbpasswd  -a k2
```

存储权限

```shell
chmod -R 777 /share/
```

添加配置文件

```shell
nano /etc/samba/smb.conf
```

添加内容，smbshare的k1目录可读写，smbshare2的k2目录只读，smbshare3的k2可读写

```shell
[smbshare]
comment = share
path = /share/k1
writable = yes
browsable = yes

[smbshare2]
comment = share
path = /share/k2
#writable = yes
browsable = yes

[smbshare3]
comment = share
path = /share/k2
writable = yes
browsable = yes
```

重启samba服务

```shell
systemctl restart samba
```

访问

|                   | k1用户 | k3用户 | k3用户 |
| :---------------- | :----- | ------ | ------ |
| smbshare的k1目录  | 可读写 | 可读写 | 可读写 |
| smbshare2的k2目录 | 只读   | 只读   | 只读   |
| smbshare3的k2目录 | 可读写 | 可读写 | 可读写 |

### 6、空间限额

此教程适合ext4的文件系统，使用quota进行磁盘配额

安装quota限制用户使用空间额度

```shell
apt install quota samba -y
```

编辑配置文件

```shell
nano /etc/fstab
```

对于需要限制的分区添加 "usrquota,grpquota"后下所示

```shell
UUID=ab8ca0d0-e5a0-4b19-8e88-a09950b175c8 /               ext4    usrquota,grpquota,errors=remount-ro 0       1
```

重启

```shell
reboot
```

检查内核的quota模块是否启用，如果 CONFIG_QUOTA=y 则表示启用

```shell
cat /boot/config-$(uname -r) | grep CONFIG_QUOTA
```

创建两个用户

```shell
useradd k1

useradd k2
```

配置密码

```shell
smbpasswd  -a k1

smbpasswd  -a k2
```

创建存储路径

```shell
mkdir -p /share/k1
mkdir -p /share/k2
```

存储权限

```shell
chmod -R 777 /share/
```

配置samba的smb存储

```shell
nano /etc/samba/smb.conf
```

末尾添加如下内容

```shell
[smbshare]
comment = share
path = /share/k1
writable = yes
browsable = yes

[smbshare2]
comment = share
path = /share/k2
writable = yes
browsable = yes
```

生成quota数据

```shell
quotacheck -cum /
quotacheck -ugm /
quotaon -v /
```

配置用户空间额度

```shell
edquota -u k1
```

配置为下所示，soft和hard表示软硬配置，建议配置为相同，这里k1用户配置为5G

```shell
Disk quotas for user k1 (uid 1000):
  Filesystem                   blocks       soft       hard     inodes     soft     hard
  /dev/sda1                    0    10485760    10485760          1        0        0
```

k2用户配置为10G

```shell
Disk quotas for user k2 (uid 1001):
  Filesystem                   blocks       soft       hard     inodes     soft     hard
  /dev/sda1                         0   52428800   52428800          0        0        0
```

访问：k1访问的smbshare的可用空间为5G，k2访问的smbshare2为10G

|                   | k1用户 | k2用户 |
| ----------------- | ------ | ------ |
| smbshare的k1目录  | 10G    | 50G    |
| smbshare2的k2目录 | 10G    | 50G    |

