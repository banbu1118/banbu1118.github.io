## 制作Debian12.5模板

### 安装Debian12.5（命令行模式）

#### 安装Debian

##### 1.虚拟机配置

```bash
pve选择debian-live-12.5.0-amd64-standard.iso
选择bios模式
勾选agent代理
SCSI控制器
磁盘100G
网口VirtIO
配置cloudinit设备（选做）
```

##### 2.换源

* 编辑/etc/apt/sources.list为如下内容 

```bash
# 默认注释了源码仓库，如有需要可自行取消注释
deb http://mirrors.ustc.edu.cn/debian bookworm main contrib non-free non-free-firmware
# deb-src http://mirrors.ustc.edu.cn/debian bookworm main contrib non-free non-free-firmware
deb http://mirrors.ustc.edu.cn/debian bookworm-updates main contrib non-free non-free-firmware
# deb-src http://mirrors.ustc.edu.cn/debian bookworm-updates main contrib non-free non-free-firmware

# backports 软件源，请按需启用
# deb http://mirrors.ustc.edu.cn/debian bookworm-backports main contrib non-free non-free-firmware
# deb-src http://mirrors.ustc.edu.cn/debian bookworm-backports main contrib non-free non-free-firmware
```

* 更新索引

```bash
apt update
```

##### 3. 配置ssh

* 安装ssh

```bash
apt install  openssh-server -y
```

* 运行root登录

```bash
#编辑/etc/ssh/sshd_config，修改一下内容为yes
PermitRootLogin yes
```

* 启用ssh

```bash
#开机自启
systemctl enable ssh

#启动ssh
systemctl restart ssh
```

##### 4. 配置cloud-init（选做）

```bash
#安装cloud-init服务包，用于快速配置系统user，ip和hostname信息
apt install cloud-init
```

##### 5. 测试

```bash
#关闭虚拟机

#配置cloudinit为固定ip

#启动虚拟机

#ssh连接测试
```

##### 6. 保存模板

```bash
#确保虚拟机没有问题，保存为模板
```

### 安装Debian12（桌面模式）

##### 1.虚拟机配置

```bash
pve选择debian-live-12.5.0-amd64-gnome.iso
选择bios模式
勾选agent代理
SCSI控制器
磁盘100G
网口VirtIO
配置cloudinit设备（选做）
```

##### 2.换源

* 编辑/etc/apt/sources.list为如下内容 

```bash
# 默认注释了源码仓库，如有需要可自行取消注释
deb http://mirrors.ustc.edu.cn/debian bookworm main contrib non-free non-free-firmware
# deb-src http://mirrors.ustc.edu.cn/debian bookworm main contrib non-free non-free-firmware
deb http://mirrors.ustc.edu.cn/debian bookworm-updates main contrib non-free non-free-firmware
# deb-src http://mirrors.ustc.edu.cn/debian bookworm-updates main contrib non-free non-free-firmware

# backports 软件源，请按需启用
# deb http://mirrors.ustc.edu.cn/debian bookworm-backports main contrib non-free non-free-firmware
# deb-src http://mirrors.ustc.edu.cn/debian bookworm-backports main contrib non-free non-free-firmware
```

* 更新索引

```bash
apt update
```

##### 3. 配置ssh

* 安装ssh

```bash
apt install  openssh-server -y
```

* 运行root登录

```bash
#编辑/etc/ssh/sshd_config，修改一下内容为yes
PermitRootLogin yes
```

* 启用ssh

```bash
#开机自启
systemctl enable ssh

#启动ssh
systemctl restart ssh
```
##### 4.安装xrdp

* 安装xrdp

```bash
apt install xrdp
```

* 配置用户登录权限

```bash
#注意这两个操作需要在每个登录的用户下都执行一次
echo gnome-session > ~/.xsession

chmod +x ~/.xsession
```

* 启用xrdp

```bash
#开机自启
systemctl enable xrdp

#启动xrdp
systemctl restart xrdp
```



##### 5. 配置cloud-init（选做）

```bash
#安装cloud-init服务包，用于快速配置系统user，ip和hostname信息
apt install cloud-init
```

##### 6. 测试

```bash
#关闭虚拟机

#配置cloudinit为固定ip

#启动虚拟机

#ssh连接测试
```

##### 7. 保存模板

```bash
#确保虚拟机没有问题，保存为模板
```
