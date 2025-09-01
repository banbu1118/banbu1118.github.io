# windows端口常用命令

## 一、telnet

### 1、安装telnet

telnet并没有内置在windows中，需要通过powershell安装才能使用

- 普通版本

```powershell
dism /online /enable-feature /featurename:telnetclient
```

- 服务器版本

```powershell
Install-WindowsFeature Telnet-Client
```

### 2、使用

如果不指定端口，默认为23

```
telnet 192.168.8.12
```
指定端口

```
telnet 192.168.8.12 80
```
如果连接成功，则表示80端口是开放的。如果连接失败，则表示80端口是关闭的。 

### 3、其他用途

#### 3.1邮件和文件传输

发送邮件

```
telnet mail.example.com 25
```
文件传输

```
telnet ftp.example.com 21
```

#### 3.2远程管理

telnet命令还可以用于远程管理，例如远程登录到路由器或交换机进行配置 

```
telnet 192.168.1.1
```

## 二、netstat

netstat是一个用户显示网络连接、路由表和网络接口统计信息的命令行工具。

```
C:\Users\kk>netstat /？

显示协议统计信息和当前 TCP/IP 网络连接。

NETSTAT [-a] [-b] [-e] [-f] [-n] [-o] [-p proto] [-r] [-s] [-t] [-x] [-y] [interval]

  -a            显示所有连接和侦听端口。
  -b            显示在创建每个连接或侦听端口时涉及的
                可执行文件。在某些情况下，已知可执行文件托管
                多个独立的组件，此时会
                显示创建连接或侦听端口时
                涉及的组件序列。在此情况下，可执行文件的
                名称位于底部 [] 中，它调用的组件位于顶部，
                直至达到 TCP/IP。注意，此选项
                可能很耗时，并且可能因为你没有足够的
                权限而失败。
  -e            显示以太网统计信息。此选项可以与 -s 选项
                结合使用。
  -f            显示外部地址的完全限定
                域名(FQDN)。
  -n            以数字形式显示地址和端口号。
  -o            显示拥有的与每个连接关联的进程 ID。
  -p proto      显示 proto 指定的协议的连接；proto
                可以是下列任何一个: TCP、UDP、TCPv6 或 UDPv6。如果与 -s
                选项一起用来显示每个协议的统计信息，proto 可以是下列任何一个:
                IP、IPv6、ICMP、ICMPv6、TCP、TCPv6、UDP 或 UDPv6。
  -q            显示所有连接、侦听端口和绑定的
                非侦听 TCP 端口。绑定的非侦听端口
                不一定与活动连接相关联。
  -r            显示路由表。
  -s            显示每个协议的统计信息。默认情况下，
                显示 IP、IPv6、ICMP、ICMPv6、TCP、TCPv6、UDP 和 UDPv6 的统计信息；
                -p 选项可用于指定默认的子网。
  -t            显示当前连接卸载状态。
  -x            显示 NetworkDirect 连接、侦听器和共享
                终结点。
  -y            显示所有连接的 TCP 连接模板。
                无法与其他选项结合使用。
  interval      重新显示选定的统计信息，各个显示间暂停的
                间隔秒数。按 CTRL+C 停止重新显示
                统计信息。如果省略，则 netstat 将打印当前的
                配置信息一次。
```

### 1、 常见用法

查看所有的网络连接和端口占用情况，包括PID和进程名称

```
netstat -ano
```

以数字形式显示tcp连接及其对应的进程PID

```
netstat -no
```

### 2、查看特定端口的占用情况

```
netstat -ano|findstr 3389
```

### 3、使用taskkill杀死进程

```
taskkill /F /PID 1008
```

### 4、 查看所有正在监听的端口 

```
netstat -an | findstr "LISTENING"
```

### 5、查看所有已经建立的连接

```
netstat -an | findstr "ESTABLISHED"
```

### 6、显示在创建每个连接或侦听端口时涉及的可执行文件

```
netstat -b
```

### 7、 查看TCP协议的端口连接情况 

```
netstat -np TCP
```

### 8、查看UDP协议的端口连接情况

```
netstat -np UD
```

### 9、查看指定PID号的进程信息 

```
tasklist /FI "PID eq 756"
```

### 10、在PowerShell中查看TCP连接信息，包括本地和远程IP地址、端口号、状态等 

```
Get-NetTCPConnection
```

### 11、使用PowerShell进行端口检测 

```
(New-Object Net.Sockets.TcpClient).Connect("192.168.8.12", 80)
```

如果80端口开放，则会连接成功。如果80端口没有开放，则会连接失败。

### 12、显示TCP连接及其对应的进程ID，每4s显示一次 

```
netstat -o  4
```

### 13、显示路由表信息 

```
netstat -r
```

### 14、 显示网络适配器统计信息 

查看生成网络接口的统计信息，其中显示字节数、单播和非单播发送和接收的数据包等信息。查看丢弃的数据包、错误和未知协议，有助于解决网络问题。

```
netstat -e
```

