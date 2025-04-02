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

