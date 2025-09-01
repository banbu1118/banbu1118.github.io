* 带宽测试

```bash
#安装iperf
apt install iperf

#测试server-1和server-2之间的带宽

#server-1作为服务端
iperf -s

#server作为客户端,192.168.1.10为sever-1的ip
iperf -c 192.168.1.10
```

* 网络流量检测

```bash
#安装iptop
apt install iftop

#监控vmbr0的流量
iftop -i vmbr0
```

* 查看网卡接口的接口速度

```bash
#安装ethtool
apt install ethtool

#查看eth0的速度
ethtool eth0
```


