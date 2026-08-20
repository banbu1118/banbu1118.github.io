# Debian 使用 systemd-networkd 管理网络

现代 Linux 从 `ifupdown` 逐渐转向 `systemd-networkd`，主要是因为网络环境越来越复杂，传统网络管理方式已经不适合云计算和虚拟化场景。

## 一、为什么使用 systemd-networkd？

### 1. 更适合复杂网络环境

`ifupdown` 主要适用于简单网络：

```
物理网卡
|
固定IP
|
应用服务
```

现代服务器通常需要：

```
物理网卡
|
Bridge / VLAN / Bond
|
虚拟机 / 容器
```

`systemd-networkd` 原生支持：

- Bridge
- VLAN
- Bonding
- 多网卡
- DHCP
- IPv6

---

### 2. 与 systemd 深度集成

统一管理：

```
systemd-networkd   网络
systemd-resolved   DNS
journald           日志
````

优势：

- 状态统一
- 日志集中
- 更适合自动化部署

---

### 3. 更适合云计算和虚拟化

适用于：

- Debian Server
- KVM/PVE
- VDI 节点
- 云服务器
- 容器环境

配置采用声明式方式：

```ini
[Match]
Name=ens18

[Network]
DHCP=yes
````

描述网络目标状态，而不是执行一系列脚本。

---

### 总结

`ifupdown`：

> 适合传统固定网络服务器。

`systemd-networkd`：

> 适合现代云计算、虚拟化和自动化环境。

简单服务器继续使用 `ifupdown` 没问题；
如果是 VDI、KVM、PVE 等环境，推荐使用：

```
systemd-networkd
+
systemd-resolved
+
networkctl
```

## 二、Debian 配置 systemd-networkd

| 服务               | 作用                                                |
| ------------------ | --------------------------------------------------- |
| `systemd-networkd` | 管理网卡、IP 地址、路由、DHCP、静态网络配置         |
| `systemd-resolved` | 管理 DNS 查询、缓存、DNS Server、`/etc/resolv.conf` |

### 安装

```shell
#Debian的systemd基础软件包里内置了system-networkd，直接安装systemd-resolved
apt install systemd-resolved
```

### 创建配置文件

网卡推荐采用数字+的组合，systemd-networkd 会按数字顺序加载配置文件，数字越小优先级越高，方便管理

```shell
mkdir -p /etc/systemd/network

nano /etc/systemd/network/10-ens18.network
```

### DHCP 模式

```shell
[Match]
Name=ens18

[Network]
DHCP=yes
```

### 静态 ip 模式

```shell
[Match]
Name=ens18

[Network]
Address=192.168.1.50/24
Gateway=192.168.1.1
DNS=116.116.116.116
DNS=221.5.88.88
```

### 修改 interfaces

```shell
cp /etc/network/interfaces /etc/network/interfaces.bak
```

### 配置服务

```shell
systemctl enable systemd-networkd
systemctl start systemd-networkd
systemctl enable systemd-resolved
systemctl start systemd-resolved
```

### 验证

```shell
systemctl status systemd-networkd
systemctl status systemd-resolved
```

### 停止 ifupdown

```shell
systemctl disable networking && reboot
```

重启确认网络正常，移除 ifupdown（可选）

```shell
apt purge ifupdown
```

### systemd-networkd模式查看ip和dns

```shell
#查看ip和dns，使用ip address只能查看ip信息
networkctl status ens18

#只查看dns
resolvectl status ens18
```

### 重启服务

修改网卡配置后重启服务生效

```shell
systemctl restart systemd-networkd
```

