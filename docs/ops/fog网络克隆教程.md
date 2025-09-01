## fog网络克隆教程

### 一、简介

免费的开源网络计算机克隆和管理解决方案

[官网](https://fogproject.org/)

[fog-github](https://github.com/FOGProject/fogproject)

[fog-community-scripts](https://github.com/FOGProject/fog-community-scripts)

### 二、安装

#### 1、配置socks5代理

推荐使用socks代理，兼容性比http代理好，安装不易出错

-  安装proxychains 

```shell
apt install proxychains -y
```

-  编辑配置文件/etc/proxychains.conf，末尾增加一行 

```shell
socks5 192.168.1.8 1080
```

-  测试代理，在执行的命令前面添加proxychains 

```shell
root@debian:~# proxychains curl https://google.com
ProxyChains-3.1 (http://proxychains.sf.net)
|DNS-request| google.com
|S-chain|-<>-192.168.1.8:1080-<><>-4.2.2.2:53-<><>-OK
|DNS-response| google.com is 142.251.214.142
|S-chain|-<>-192.168.1.8:1080-<><>-142.251.214.142:443-<><>-OK
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="https://www.google.com/">here</A>.
</BODY></HTML>
```

#### 2、安装git和unzip

```shell
apt install git unzip
```

#### 3、获取fog

```shell
#获取
proxychains wget https://github.com/FOGProject/fogproject/archive/stable.zip

#获取fog配置修改脚本
proxychains git clone https://github.com/FOGProject/fog-community-scripts.git

unzip stable.zip
```

#### 4、开始安装

当前安装环境为Debian12，fog支持Linux主流发行版

```shell
cd fogproject-stable/bin/

proxychains ./installfog.sh
```

安装时参考如下选项

```shell
  What version of Linux would you like to run the installation for?

          1) Redhat Based Linux (Redhat, Alma, Rocky, CentOS, Mageia)
          2) Debian Based Linux (Debian, Ubuntu, Kubuntu, Edubuntu)
          3) Arch Linux

  Choice: [2] 2
#选择对应系统版本


  Starting Debian based Installation


  FOG Server installation modes:
      * Normal Server: (Choice N)
          This is the typical installation type and
          will install all FOG components for you on this
          machine.  Pick this option if you are unsure what to pick.

      * Storage Node: (Choice S)
          This install mode will only install the software required
          to make this server act as a node in a storage group

  More information:
     http://www.fogproject.org/wiki/index.php?title=InstallationModes

  What type of installation would you like to do? [N/s (Normal/Storage)] N
#选择安装节点

  We found the following interfaces on your system:
      * ens18 - 192.168.1.200/24

  Would you like to change the default network interface from ens18?
  If you are not sure, select No. [y/N] N
#选择默认网卡

  Would you like to setup a router address for the DHCP server? [Y/n] n
#不配置默认网关，如果dhcp服务器和fog不在一个子网下才需要配置网关

  Would you like DHCP to handle DNS? [Y/n] n
#不配置dns

  Would you like to use the FOG server for DHCP service? [y/N]
#不配置dhcp服务

  This version of FOG has internationalization support, would
  you like to install the additional language packs? [y/N] y
#安装额外语言包，会自动安装中文语言包

  Using encrypted connections is state of the art on the web and we
  encourage you to enable this for your FOG server. But using HTTPS
  has some implications within FOG, PXE and fog-client and you want
  to read https://wiki.fogproject.org/HTTPS before you decide!
  Would you like to enable secure HTTPS on your FOG server? [y/N]
#不启用https
|DNS-response|: debian does not exist
hostname: Unknown error

  Which hostname would you like to use? Currently is:
  Note: This hostname will be in the certificate we generate for your
  FOG webserver. The hostname will only be used for this but won't be
  set as a local hostname on your server!
  Would you like to change it? If you are not sure, select No. [y/N] y
#配置主机名为debian
  Which hostname would you like to use? debian
  FOG would like to collect some data:
      We would like to collect the following information:
        1. OS Name (CentOS, RedHat, Debian, etc....)
        2. OS Version (8.0.2004, 7.2.1409, 9, etc....)
        3. FOG Version (1.5.9, 1.6, etc....)

  What is this information used for?
      We would like to simply track the common types of OS
      being used, along with the OS Version, and the various
      versions of FOG being used.

  Are you ok with sending this information? [Y/n] n
#不发送

   ######################################################################
   #     FOG now has everything it needs for this setup, but please     #
   #   understand that this script will overwrite any setting you may   #
   #   have setup for services like DHCP, apache, pxe, tftp, and NFS.   #
   ######################################################################
   # It is not recommended that you install this on a production system #
   #        as this script modifies many of your system settings.       #
   ######################################################################
   #             This script should be run by the root user.            #
   #      It will prepend the running with sudo if root is not set      #
   ######################################################################
   #            Please see our wiki for more information at:            #
   ######################################################################
   #             https://wiki.fogproject.org/wiki/index.php             #
   ######################################################################

 * Here are the settings FOG will use:
 * Base Linux: Debian
 * Detected Linux Distribution: Debian GNU/Linux
 * Interface: ens18
 * Server IP Address: 192.168.1.200
 * Server Subnet Mask: 255.255.255.0
 * Hostname: debian
 * Installation Type: Normal Server
 * Internationalization: Yes
 * Image Storage Location: /images
 * Using FOG DHCP: No
 * DHCP will NOT be setup but you must setup your
 | current DHCP server to use FOG for PXE services.

 * On a Linux DHCP server you must set: next-server and filename

 * On a Windows DHCP server you must set options 066 and 067

 * Option 066/next-server is the IP of the FOG Server: (e.g. 192.168.1.200)
 * Option 067/filename is the bootfile: (e.g. undionly.kkpxe or snponly.efi)
 * Send OS Name, OS Version, and FOG Version: No


 * Are you sure you wish to continue (Y/N) Y
#开始安装
```

#### 5、安装更新数据库

等安装快结束时，安装提示在网页更新数据库，再返回enter确认

### 三、配置fog

#### 1、配置中文环境（可选）

安装语言配置工具（Debian默认提供这个工具）

```shell
apt install locales
```

#### 2、选择 `zh_CN.UTF-8` 作为默认的 locale 

```shell
dpkg-reconfigure locales
```

#### 3、fog设置中文

fog setting -> General Settings -> DEFAULT LOCALE选择中国

#### 4、安装dhcp代理

```shell
apt install dnsmasq -y
```

#### 5、修改dnsmasq配置

编辑/etc/dnsmasq.conf为如下内容，注意ip的设置

```shell
#networkType=2
# Don't function as a DNS server:
port=0
# Log lots of extra information about DHCP transactions.
log-dhcp
# Set the root directory for files available via FTP.
dhcp-range=192.168.1.200,proxy
tftp-root=/tftpboot

#The boot filename, Server name, Server Ip Address
dhcp-boot=undionly.kpxe,,192.168.1.200


# Disable re-use of the DHCP servername and filename fields as extra
# option space. That's to avoid confusing some old or broken DHCP clients.
dhcp-no-override
# inspect the vendor class string and match the text to set the tag
dhcp-vendorclass=BIOS,PXEClient:Arch:00000
dhcp-vendorclass=UEFI32,PXEClient:Arch:00006
dhcp-vendorclass=UEFI,PXEClient:Arch:00007
dhcp-vendorclass=UEFI64,PXEClient:Arch:00009
# Set the boot file name based on the matching tag from the vendor class (above)
dhcp-boot=net:UEFI32,i386-efi/ipxe.efi
dhcp-boot=net:UEFI,ipxe.efi,,
dhcp-boot=net:UEFI64,ipxe.efi
# PXE menu.  The first part is the text displayed to the user.  The second is the timeout, in seconds.
pxe-prompt='Booting IDV Client', 1
# The known types are x86PC, PC98, IA64_EFI, Alpha, Arc_x86,
# Intel_Lean_Client, IA32_EFI, BC_EFI, Xscale_EFI and X86-64_EFI
# This option is first and will be the default if there is no input from the user.
pxe-service=X86PC, 'Boot to IDV', undionly.kpxe
pxe-service=X86-64_EFI, 'Boot to IDV UEFI', ipxe.efi
pxe-service=BC_EFI, 'Boot to IDV UEFI PXE-BC', ipxe.efi
```

#### 6、配置dnsmasq服务

```shell
systemctl enable dnsmasq

systemctl restart dnsmasq
```

### 四、迁移

#### 1、修改ip

##### 1.1修改系统ip

编辑/etc/network/interfaces

```shell
/etc/network/interfaces
```

##### 1.2修改dnsmasq配置

编辑/etc/dnsmasq.conf，修改ip信息

##### 1.3执行fog修改ip脚本

```shell
./fog-community-scripts/updateIP/updateIP.sh
```

### 五、使用

#### 1.登录

默认账号：fog

默认密码：password

#### 2、开启自动注册

fog setting -> FOG Quick Registration ->  QUICKREG AUTOPOP勾选

iPxe Menu Item Settings -> fog.reg ->  Default Item勾选

#### 3、跨fog环境部署系统

在就旧fog环境导出image的csv信息，在新fog导入。

把旧环境/images路径下的image系统目录拷贝到新环境。

### 六、问题

#### 1、注册或上传出错

可能是fog内核不匹配，在web界面内核更新选择合适内核安装

### 七、探索

#### 1、fog部署iso

参考教程：[https://forums.fogproject.org/topic/10944/using-fog-to-pxe-boot-into-your-favorite-installer-images](https://forums.fogproject.org/topic/10944/using-fog-to-pxe-boot-into-your-favorite-installer-images)

具体步骤：[https://forums.fogproject.org/topic/10944/using-fog-to-pxe-boot-into-your-favorite-installer-images/10](https://forums.fogproject.org/topic/10944/using-fog-to-pxe-boot-into-your-favorite-installer-images/10)
