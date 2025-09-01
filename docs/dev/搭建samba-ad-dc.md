## 搭建samba-ad-dc

此教程，是微软ad域的替代，在Debian12环境搭建

### 一、下载安装包

```bash
apt update
apt install samba winbind -y
```

### 二、dns配置

删除默认dns

```bash
unlink /etc/resolv.conf
```

写入127.0.0.1

```bash
echo "nameserver 127.0.0.1" | tee /etc/resolv.conf
```

### 三、配置域

移除原本的smb配置

```bash
mv /etc/samba/smb.conf /etc/samba/smb.conf.bak
```

开始配置域

```bash
#交互式配置
#samba-tool domain provision   --use-rfc2307 --interactive

#直接配置
samba-tool domain provision \
    --realm=VDI.CLOUD \
    --domain=VDI \
    --server-role=dc \
    --dns-backend=SAMBA_INTERNAL \
    --use-rfc2307 \
    --option="dns forwarder=127.0.0.1" \
    --adminpass='abc@2020'
```

### 四、配置dns解析

配置主机名

```bash
hostnamectl set-hostname ad
```

编辑/etc/hosts

```bash
nano /etc/hosts
```

第二行内容改为

```bash
192.168.1.50    ad.vdi.cloud ad
```

查看完全限定名，确保解析正常

```bash
hostname -f
```

### 五、启动服务

```bash
systemctl stop smbd nmbd winbind
systemctl disable smbd nmbd winbind
systemctl unmask samba-ad-dc
systemctl enable samba-ad-dc
systemctl start samba-ad-dc
```

### 六、创建用户和用户组

创建用户组vdiuser

```bash
samba-tool group add vdiuser
```

创建用户user01

```bash
samba-tool user add user01
```

把user01用户添加到vdiuser组

```bash
samba-tool group addmembers vdiuser user01
```

 修改管理员密码 

```bash
samba-tool user setpassword Administrator
```

 修改用户密码 

```bash
samba-tool user setpassword user01
```

 配置用户密码永不过期 

```bash
samba-tool user setexpiry user01 --noexpiry
```

### 七、区分samba ad域和微软ad域

在加域的计算内执行如下命令，ip为域的ip

```
systeminfo /s 192.168.1.50 /u:administrator
```

 如果是 Samba AD 服务器，会提示无法执行或返回错误（因为这是 Windows 专用命令）

```powershell
C:\Users\user01>systeminfo /s 192.168.1.50 /u:administrator
错误: RPC 服务器不可用。
```

 如果是 Windows 域控服务器，会返回完整的 Windows 系统信息 

```powershell
C:\Users\office01>systeminfo /s 192.168.3.2 /u:administrator

主机名:           ADSERVER
OS 名称:          Microsoft Windows Server 2019 Standard
OS 版本:          10.0.17763 暂缺 Build 17763
OS 制造商:        Microsoft Corporation
OS 配置:          主域控制器
OS 构建类型:      Multiprocessor Free
注册的所有人:     Windows 用户
注册的组织:
产品 ID:          00429-00000-00001-AA682
初始安装日期:     2025/2/27, 11:16:00
系统启动时间:     2025/5/12, 9:21:16
系统制造商:       QEMU
系统型号:         Standard PC (i440FX + PIIX, 1996)
系统类型:         x64-based PC
处理器:           安装了 1 个处理器。
                  [01]: Intel64 Family 15 Model 6 Stepping 1 GenuineIntel ~2394 Mhz
BIOS 版本:        SeaBIOS rel-1.16.3-0-ga6ed6b701f0a-prebuilt.qemu.org, 2014/4/1
Windows 目录:     C:\Windows
系统目录:         C:\Windows\system32
启动设备:         \Device\HarddiskVolume1
系统区域设置:     zh-cn;中文(中国)
输入法区域设置:   zh-cn;中文(中国)
时区:             (UTC+08:00) 北京，重庆，香港特别行政区，乌鲁木齐
物理内存总量:     4,095 MB
可用的物理内存:   2,472 MB
虚拟内存: 最大值: 4,799 MB
虚拟内存: 可用:   3,154 MB
虚拟内存: 使用中: 1,645 MB
页面文件位置:     C:\pagefile.sys
域:               dora.cloud
登录服务器:       暂缺
修补程序:         安装了 5 个修补程序。
                  [01]: KB5005540
                  [02]: KB4486153
                  [03]: KB4486155
                  [04]: KB5005625
                  [05]: KB5005701
网卡:             安装了 1 个 NIC。
                  [01]: Red Hat VirtIO Ethernet Adapter
                      连接名:      以太网
                      启用 DHCP:   否
                      IP 地址
                        [01]: 192.168.3.2
                        [02]: fe80::6cc1:4cd3:b9e0:81ea
Hyper-V 要求:     已检测到虚拟机监控程序。将不显示 Hyper-V 所需的功能。
```
