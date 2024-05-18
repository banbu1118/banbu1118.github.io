## 搭建dhcp服务

### centos7搭建dhcp服务

1.centos7配置静态ip

```bash
#使用nmtui配置静态ip
```

2. 安装dhcp

```bash
yum install dhcp
```

3. 复制实例文件到配置目录

```bash
cp /usr/share/doc/dhcp-4.2.5/dhcpd.conf.example  dhcpd.conf
```

4. 编辑dhcp.conf文件，如下所示

```bash
subnet 192.168.8.0 netmask 255.255.255.0 {
option domain-name-servers 192.168.8.1;
range 192.168.8.100 192.168.8.101;
option routers 192.168.8.1;
default-lease-time 600;
max-lease-time 7200;
}

# 参考文档：https://blog.csdn.net/IT_ZRS/article/details/129529559
```
5. 启动dhcp

```bash
service dhcpd start
```

6. 配置开机启动

```bash
chkconfig dhcpd on

#或者
systemctl enable dhcpd
```

### debian12 搭建dhcp服务

1. debian12安装isc-dhcp-server

```bash
apt install isc-dhcp-server -y
```

2. debian12配置静态ip，编辑/etc/network/interfaces

```bash
auto ens18
iface ens18 inet static
address 192.168.8.123
netmask 255.255.255.0
gateway 192.168.8.1
```

3. 编辑isc-dhcp-serverd的配置文件/etc/default/isc-dhcp-server，添加网卡

```bash
INTERFACESv4="ens18"
```

4. 复制实例文件到配置目录

```bash
cp /usr/share/doc/isc-dhcp-server/examples/dhcpd.conf.example dhcpd.conf
```

5. 编辑dhcp的配置文件/etc/dhcp/dhcp.conf

```bash
# A slightly different configuration for an internal subnet.
subnet 192.168.8.0 netmask 255.255.255.0 {
  range 192.168.8.120 192.168.8.121;
  option domain-name-servers 192.168.8.1;
  option domain-name "internal.example.org";
  option routers 192.168.8.1;
  default-lease-time 600;
  max-lease-time 7200;
}

# 参考文档：https://zhuanlan.zhihu.com/p/602492654
```

6. 启动dhcp服务

```bash
systemctl start isc-dhcp-server
```

7. 配置开机启动

```bash
systemctl enable isc-dhcp-server
```

## 释放被占用的dhcp
###  centos7

1. 删除dhcp文件记录

```bash
rm /var/lib/dhcpd/dhcpd.leases
```

2. 重启dhcp服务

```bash
service dhcpd restart

# 参考资料：https://xkzzz.com/post/289213.html
```

### debian12

1. 删除dhcp文件记录

```bash
rm /var/lib/dhcpd/dhcpd.leases
```

2. 重启dhcp服务

```bash
systemctl restart isc-dhcp-server
```

## 客户机windows系统释放ip

1.cmd执行

```bash
ipconfig /release
```



