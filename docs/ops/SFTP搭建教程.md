## SFTP搭建教程

SFTP（Secure File Transfer Protocol）是一种通过 SSH（Secure Shell）实现加密文件传输的协议，用于在网络上安全地上传、下载和管理文件。

可以简单理解为scp的批量操作

> Debian12 root用户默认启用sftp服务

### 一、Docker搭建SFTP文件服务器

- 创建docker.yaml配置文件

```shell
nano docker.yaml
```

内容如下

```yaml
version: '3'
services:
  sftp:
    image: atmoz/sftp
    volumes:
      - ./upload:/home/kk/upload
    ports:
      - "2222:22"
    command: kk:kpassword:1001
```

用户名：kk

密码：kpassword

本地目录：./upload

容器目录 ：/home/kk/upload

映射端口：2222

- 创建本地目录

```shell
mkdir upload
```

- 更改宿主机目录的属主

```shell
chown 1001:1001 ./upload
```

- 创建容器

```shell
docker compose -f docker.yaml  up -d
```

### 二、SFTP常用命令

- 登陆

```shell
sftp -P 2222 kk@192.168.1.193
```

- 文件管理

```shell
#查看远程目录和文件
ls

#查看本地目录和文件
lls

#切换目录
cd

#创建目录
mkdir 目录

#删除文件
rm文件

#重命名
rename 文件

#复制
cp 旧文件 新文件
```

- 上传

```shell
put 文件

#上传目前需要创建对应的目录
put -r 目录
```

- 下载

```shell
get 文件

get -r 目录
```

- 退出

```shell
exit
```

- 目录操作

```shell
#切换远程目录和本地目录，搭配exit回到刚才的目录
!
```

### 三、Debian搭建SFTP文件服务器

- 安装openssh-server

SFTP 是通过 OpenSSH 提供的

```shell
apt install openssh-server
```

- 配置ssh服务

```shell
systemctl enable ssh

systemctl start ssh
```

- 配置sftp子系统（可选，默认已启用）

```shell
nano /etc/ssh/sshd_config
```

 找到这一行

```shell
Subsystem sftp /usr/lib/openssh/sftp-server
```

重启ssh服务

```shell
systemctl restart ssh
```

- 创建一个只允许sftp的用户

```shell
groupadd sftpusers

useradd -m -s /usr/sbin/nologin -g sftpusers sftpuser

passwd sftpuser
```

- 设置sftp目录权限

```shell
mkdir -p /home/sftpuser/uploads

chown root:root /home/sftpuser

chmod 755 /home/sftpuser

chown sftpuser:sftpusers /home/sftpuser/uploads
```

- 用户隔离

禁用 SSH Shell，仅允许 SFTP

```shell
nano /etc/ssh/sshd_config
```

在文件末尾添加：

```shell
Match Group sftpusers
    ChrootDirectory /home/%u
    ForceCommand internal-sftp
    X11Forwarding no
    AllowTcpForwarding no
```

重启ssh服务

```shell
systemctl restart ssh
```

- 用户登陆

```shell
sftp sftpuser@192.168.1.193
```