# Linux端口常用命令

## 一、telnet

在早期计算机网络发展的阶段，Telnet是一种用于远程登录的协议。然而，由于其传输数据是明文的，存在安全性问题，因此逐渐被更安全的协议（如SSH）所取代。尽管如此，Telnet指令仍然有其特殊的应用场景，并被广泛使用于网络设备配置和问题排查等领域。

### 1、使用

如果不指定端口，默认为23

```
telnet 192.168.8.105
```

指定端口

```
telnet 192.168.8.105 3389
```

如果连接成功，则表示3389端口是开放的。如果连接失败，则表示3389端口是关闭的。

### 2、其他用户

#### 2.1邮件和文件传输

发送邮件

```
telnet mail.example.com 25
```

文件

```
telnet 192.168.1.1
```

#### 2.2远程管理

telnet命令还可以用于远程管理，例如远程登录到路由器或交换机进行配置 

```
telnet 192.168.1.1
```

## 二、netstat

netstat是一个用于查看网络连接和端口状态的命令行工具。您可以使用netstat命令来查看当前系统上的端口状态

```
root@debian:~# netstat -h
usage: netstat [-vWeenNcCF] [<Af>] -r         netstat {-V|--version|-h|--help}
       netstat [-vWnNcaeol] [<Socket> ...]
       netstat { [-vWeenNac] -i | [-cnNe] -M | -s [-6tuw] }

        -r, --route              display routing table
        -i, --interfaces         display interface table
        -g, --groups             display multicast group memberships
        -s, --statistics         display networking statistics (like SNMP)
        -M, --masquerade         display masqueraded connections

        -v, --verbose            be verbose
        -W, --wide               don't truncate IP addresses
        -n, --numeric            don't resolve names
        --numeric-hosts          don't resolve host names
        --numeric-ports          don't resolve port names
        --numeric-users          don't resolve user names
        -N, --symbolic           resolve hardware names
        -e, --extend             display other/more information
        -p, --programs           display PID/Program name for sockets
        -o, --timers             display timers
        -c, --continuous         continuous listing

        -l, --listening          display listening server sockets
        -a, --all                display all sockets (default: connected)
        -F, --fib                display Forwarding Information Base (default)
        -C, --cache              display routing cache instead of FIB
        -Z, --context            display SELinux security context for sockets

  <Socket>={-t|--tcp} {-u|--udp} {-U|--udplite} {-S|--sctp} {-w|--raw}
           {-x|--unix} --ax25 --ipx --netrom
  <AF>=Use '-6|-4' or '-A <af>' or '--<af>'; default: inet
  List of possible address families (which support routing):
    inet (DARPA Internet) inet6 (IPv6) ax25 (AMPR AX.25)
    netrom (AMPR NET/ROM) rose (AMPR ROSE) ipx (Novell IPX)
    ddp (Appletalk DDP) x25 (CCITT X.25)
```

### 1、安装

```
apt install net-tools
```

### 2、常见命令

#### 2.1显示详细的网络状况 

```
netstat -a
```

#### 2.2显示当前TCP连接状况

```
netstat -nt
```

#### 2.3显示当前UDP连接状况

```
netstat -nu
```

#### 2.4显示TCP端口号的使用情况

```
netstat -apt
```

#### 2.5显示UDP端口号的使用情况

```
netstat -apu
```

#### 2.6查看当前所有tcp端口 

```
netstat -ntlp
```

#### 2.7查看所有80端口使用情况

```
netstat -ntulp|grep 80
```

#### 2.8查看所有22端口的使用情况

```
netstat -an|grep 22
```

#### 2.9显示监听的套接口

```
netstat -l
```

### 3、其他用途

#### 3.1显示网卡列表

```
netstat -i
```

#### 3.2显示组播组的关系 

```
netstat -g
```

#### 3.3显示网络统计信息 

```
netstat -s
```

#### 3.4持续输出 netstat 信息

实时监控网络活动和连接变化，默认每秒更新一次

```
netstat -c
```

#### 3.5显示路由信息

```
netstat -r
```

## 三、ss

ss ( Socket Statistics ) 用于在 Linux 系统中显示网络套接字统计信息的命令，是netstat命令的现代替代品，提供了更快、更详细的输出

`<span style="color:red">`源IP地址和目的IP地址以及源端口号和目的端口号的组合称为网络套接字`</span>`

```
root@debian:~# ss -h
Usage: ss [ OPTIONS ]
       ss [ OPTIONS ] [ FILTER ]
   -h, --help          this message
   -V, --version       output version information
   -n, --numeric       don't resolve service names
   -r, --resolve       resolve host names
   -a, --all           display all sockets
   -l, --listening     display listening sockets
   -o, --options       show timer information
   -e, --extended      show detailed socket information
   -m, --memory        show socket memory usage
   -p, --processes     show process using socket
   -T, --threads       show thread using socket
   -i, --info          show internal TCP information
       --tipcinfo      show internal tipc socket information
   -s, --summary       show socket usage summary
       --tos           show tos and priority information
       --cgroup        show cgroup information
   -b, --bpf           show bpf filter socket information
   -E, --events        continually display sockets as they are destroyed
   -Z, --context       display task SELinux security contexts
   -z, --contexts      display task and socket SELinux security contexts
   -N, --net           switch to the specified network namespace name

   -4, --ipv4          display only IP version 4 sockets
   -6, --ipv6          display only IP version 6 sockets
   -0, --packet        display PACKET sockets
   -t, --tcp           display only TCP sockets
   -M, --mptcp         display only MPTCP sockets
   -S, --sctp          display only SCTP sockets
   -u, --udp           display only UDP sockets
   -d, --dccp          display only DCCP sockets
   -w, --raw           display only RAW sockets
   -x, --unix          display only Unix domain sockets
       --tipc          display only TIPC sockets
       --vsock         display only vsock sockets
       --xdp           display only XDP sockets
   -f, --family=FAMILY display sockets of type FAMILY
       FAMILY := {inet|inet6|link|unix|netlink|vsock|tipc|xdp|help}

   -K, --kill          forcibly close sockets, display what was closed
   -H, --no-header     Suppress header line
   -O, --oneline       socket's data printed on a single line
       --inet-sockopt  show various inet socket options

   -A, --query=QUERY, --socket=QUERY
       QUERY := {all|inet|tcp|mptcp|udp|raw|unix|unix_dgram|unix_stream|unix_seqpacket|packet|packet_raw|packet_dgram|netlink|dccp|sctp|vsock_stream|vsock_dgram|tipc|xdp}[,QUERY]

   -D, --diag=FILE     Dump raw information about TCP sockets to FILE
   -F, --filter=FILE   read filter information from FILE
       FILTER := [ state STATE-FILTER ] [ EXPRESSION ]
       STATE-FILTER := {all|connected|synchronized|bucket|big|TCP-STATES}
         TCP-STATES := {established|syn-sent|syn-recv|fin-wait-{1,2}|time-wait|closed|close-wait|last-ack|listening|closing}
          connected := {established|syn-sent|syn-recv|fin-wait-{1,2}|time-wait|close-wait|last-ack|closing}
       synchronized := {established|syn-recv|fin-wait-{1,2}|time-wait|close-wait|last-ack|closing}
             bucket := {syn-recv|time-wait}
                big := {established|syn-sent|fin-wait-{1,2}|closed|close-wait|last-ack|listening|closing}
```

### 1、常见命令

#### 1.1显示所有套接字

```
ss -a
```

#### 1.2显示TCP套接字

```
ss -t
```

#### 1.3显示UDP套接字

```
ss -u
```

#### 1.4显示监听的套接字

```
ss -l
```

#### 1.5显示每个套接字的详细信息

```
ss -ap
```

#### 1.6显示特定状态的套接字

```
ss -t -a state established
```

#### 1.7查看连接队列的信息

```
ss -t -l
```

#### 1.8过滤显示特定的地址和端口

过滤tcp源为192.168.8.106的套接字

```
ss -t -a src 192.168.8.106
```

过滤tcp目的为22端口的套接字

```
ss -t -a dst :22
```

显示所有目的地为192.168.1.1的套接字

```
ss dst 192.168.1.1
```

显示所有源地址为192.168.8.8，端口为8006的套接字

```
ss src 192.168.8.8:8006
```

显示所有源端口为 22 的网络套接字 ，可以不加:

```
ss sport = :22
```

显示所有源端口为8006的套接字

```
ss sport = :8006
```

显示所有源端口大于 8000 的网络套接字 

```
ss sport \> :8000
```

显示所有源端口小于 32000 的网络套接字 

```
ss sport \< :32000
```

显示所有源端口等于 22 的网络套接字 

```
ss  sport eq :22 
```

 显示所有源端口不等于 22 的网络套接字 

```
ss sport != :22
```

显示所有端口为8443状态为已连接的网络套接字

```
ss  state connected sport = :8443
```


### 2、查套接字

#### 2.1查看所有套接字

```
ss
```

#### 2.2 系统中所有 TCP 和 UDP 套接字的详细信息 

```
ss -tua
```

#### 2.3过滤更详细的套接字

只显示目的端口（dport）为 22 或源端口（sport）为 22 的连接 

```
ss -o state established '( dport = :22 or sport = :22 )'
```

### 3、查端口

#### 3.1查看所有

```
ss -l
```

#### 3.2查看特定端口

查看端口号为 5000的套接字

```
ss -lnp | grep :5000
```

列出所有连接到 80 端口的连接和对80端口的监听

```
ss -r state all dport = :80
```

## 四、lsof

lsof是一个用于查看系统打开文件和进程的命令行工具 

```
root@debian:~# lsof -h
lsof 4.95.0
 latest revision: https://github.com/lsof-org/lsof
 latest FAQ: https://github.com/lsof-org/lsof/blob/master/00FAQ
 latest (non-formatted) man page: https://github.com/lsof-org/lsof/blob/master/Lsof.8
 usage: [-?abhKlnNoOPRtUvVX] [+|-c c] [+|-d s] [+D D] [+|-E] [+|-e s] [+|-f[gG]]
 [-F [f]] [-g [s]] [-i [i]] [+|-L [l]] [+m [m]] [+|-M] [-o [o]] [-p s]
 [+|-r [t]] [-s [p:s]] [-S [t]] [-T [t]] [-u s] [+|-w] [-x [fl]] [--] [names]
Defaults in parentheses; comma-separated set (s) items; dash-separated ranges.
  -?|-h list help          -a AND selections (OR)     -b avoid kernel blocks
  -c c  cmd c ^c /c/[bix]  +c w  COMMAND width (9)    +d s  dir s files
  -d s  select by FD set   +D D  dir D tree *SLOW?*   +|-e s  exempt s *RISKY*
  -i select IPv[46] files  -K [i] list|(i)gn tasKs    -l list UID numbers
  -n no host names         -N select NFS files        -o list file offset
  -O no overhead *RISKY*   -P no port names           -Q allow failed search
  -R list paRent PID       -s list file size          -t terse listing
  -T disable TCP/TPI info  -U select Unix socket      -v list version info
  -V verbose search        +|-w  Warnings (+)         -X skip TCP&UDP* files
  -Z Z  context [Z]        -- end option scan
  -E display endpoint info              +E display endpoint info and files
  +f|-f  +filesystem or -file names     +|-f[gG] flaGs
  -F [f] select fields; -F? for help
  +|-L [l] list (+) suppress (-) link counts < l (0 = all; default = 0)
                                        +m [m] use|create mount supplement
  +|-M   portMap registration (-)       -o o   o 0t offset digits (8)
  -p s   exclude(^)|select PIDs         -S [t] t second stat timeout (15)
  -T fqs TCP/TPI Fl,Q,St (s) info
  -g [s] exclude(^)|select and print process group IDs
  -i i   select by IPv[46] address: [46][proto][@host|addr][:svc_list|port_list]
  +|-r [t[m<fmt>]] repeat every t seconds (15);  + until no files, - forever.
       An optional suffix to t is m<fmt>; m must separate t from <fmt> and
      <fmt> is an strftime(3) format for the marker line.
  -s p:s  exclude(^)|select protocol (p = TCP|UDP) states by name(s).
  -u s   exclude(^)|select login|UID set s
  -x [fl] cross over +d|+D File systems or symbolic Links
  names  select named files or files on named file systems
Anyone can list all files; /dev warnings disabled; kernel ID check disabled.
```

### 1、常见命令

#### 1.1列出所有打开的文件 

```
lsof
```

#### 1.2列出指定端口号的进程 

```
lsof -i :22
```

#### 1.3列出指定进程打开的文件

```
lsof  -p 506

lsof -c ssh
```

#### 1.4列出指定用户打开的文件

```
lsof -u root
```

#### 1.5查看特定目录下被打开的文件

```
lsof +D /root/
```

#### 1.6查看所属root用户进程所打开的文件类型为txt的文件

```
lsof -a -u root -d txt
```

#### 1.7列出某个ip的连接信息

```
lsof -i @192.168.8.2
```

#### 1.8根据IP分类显示当前环境的连接信息

```
lsof -i 4 

lsof -i 6
```

#### 1.9列出tcp/udp的连接信息

```
lsof -i tcp      
lsof -i udp
lsof -i tcp:22
```

#### 1.10列出某个用户的所有活跃的网络端口

```
lsof -a -u root -i
```

#### 1.11通过某个进程号显示该进程打开的文件

```
lsof -p 506
```

#### 1.12列出包含字符为“sshd”，且文件描述符为mem，用户为root的文件信息

```
lsof -c sshd -a -d mem -u root
```

#### 1.13列出IP为192.168.8.2，且端口为49219和49243相关的所有文件信息，每隔3秒刷新一次

```
lsof -i @192.168.8.2:49219,49243 -r 3
```

#### 1.14找出正等候连接的端口

```
lsof -i -sTCP:LISTEN
lsof -i | grep -i LISTEN
lsof -i -sTCP:ESTABLISHED
lsof -i | grep -i ESTABLISHED
```

### 2、清楚已删除未被释放的文件

#### 2.1查找已删除但未被释放的文件

```
lsof | grep deleted
```

#### 2.2找到对应PID，结束该进程

```
kill -9 PID
```

## 五、fuser

用于查看文件或目录正在被哪些进程使用。它可以显示出哪些进程正在使用特定文件或目录，以及它们所在的进程ID 

```
root@debian:~# fuser -h
Usage: fuser [-fIMuvw] [-a|-s] [-4|-6] [-c|-m|-n SPACE]
             [-k [-i] [-SIGNAL]] NAME...
       fuser -l
       fuser -V
Show which processes use the named files, sockets, or filesystems.

  -a,--all              display unused files too
  -i,--interactive      ask before killing (ignored without -k)
  -I,--inode            use always inodes to compare files
  -k,--kill             kill processes accessing the named file
  -l,--list-signals     list available signal names
  -m,--mount            show all processes using the named filesystems or
                        block device
  -M,--ismountpoint     fulfill request only if NAME is a mount point
  -n,--namespace SPACE  search in this name space (file, udp, or tcp)
  -s,--silent           silent operation
  -SIGNAL               send this signal instead of SIGKILL
  -u,--user             display user IDs
  -v,--verbose          verbose output
  -w,--writeonly        kill only processes with write access
  -V,--version          display version information
  -4,--ipv4             search IPv4 sockets only
  -6,--ipv6             search IPv6 sockets only
  udp/tcp names: [local_port][,[rmt_host][,[rmt_port]]]
```

### 1、查看端口

```
fuser -n tcp 80
fuser -v -n tcp 80
fuser -v 80/tcp
```

### 2、查看挂载信息

如果卸载硬盘提示busy，可以试试这个命令

```
#-v是查看详细信息
fuser  -m  -v /mnt/data/

# -k参数可以直接杀掉
fuser -k -m /mnt/data
```

### 3、查询文件进程

```
fuser /path/to/file

#结束占用指定文件的进程
fuser -k /path/to/file

#显示占用文件进程的用户名
fuser -u  /path/to/file
```

## 六、nmap

网络端口扫描工具

```
root@debian:~# nmap -h
Nmap 7.93 ( https://nmap.org )
Usage: nmap [Scan Type(s)] [Options] {target specification}
TARGET SPECIFICATION:
  Can pass hostnames, IP addresses, networks, etc.
  Ex: scanme.nmap.org, microsoft.com/24, 192.168.0.1; 10.0.0-255.1-254
  -iL <inputfilename>: Input from list of hosts/networks
  -iR <num hosts>: Choose random targets
  --exclude <host1[,host2][,host3],...>: Exclude hosts/networks
  --excludefile <exclude_file>: Exclude list from file
HOST DISCOVERY:
  -sL: List Scan - simply list targets to scan
  -sn: Ping Scan - disable port scan
  -Pn: Treat all hosts as online -- skip host discovery
  -PS/PA/PU/PY[portlist]: TCP SYN/ACK, UDP or SCTP discovery to given ports
  -PE/PP/PM: ICMP echo, timestamp, and netmask request discovery probes
  -PO[protocol list]: IP Protocol Ping
  -n/-R: Never do DNS resolution/Always resolve [default: sometimes]
  --dns-servers <serv1[,serv2],...>: Specify custom DNS servers
  --system-dns: Use OS's DNS resolver
  --traceroute: Trace hop path to each host
SCAN TECHNIQUES:
  -sS/sT/sA/sW/sM: TCP SYN/Connect()/ACK/Window/Maimon scans
  -sU: UDP Scan
  -sN/sF/sX: TCP Null, FIN, and Xmas scans
  --scanflags <flags>: Customize TCP scan flags
  -sI <zombie host[:probeport]>: Idle scan
  -sY/sZ: SCTP INIT/COOKIE-ECHO scans
  -sO: IP protocol scan
  -b <FTP relay host>: FTP bounce scan
PORT SPECIFICATION AND SCAN ORDER:
  -p <port ranges>: Only scan specified ports
    Ex: -p22; -p1-65535; -p U:53,111,137,T:21-25,80,139,8080,S:9
  --exclude-ports <port ranges>: Exclude the specified ports from scanning
  -F: Fast mode - Scan fewer ports than the default scan
  -r: Scan ports sequentially - don't randomize
  --top-ports <number>: Scan <number> most common ports
  --port-ratio <ratio>: Scan ports more common than <ratio>
SERVICE/VERSION DETECTION:
  -sV: Probe open ports to determine service/version info
  --version-intensity <level>: Set from 0 (light) to 9 (try all probes)
  --version-light: Limit to most likely probes (intensity 2)
  --version-all: Try every single probe (intensity 9)
  --version-trace: Show detailed version scan activity (for debugging)
SCRIPT SCAN:
  -sC: equivalent to --script=default
  --script=<Lua scripts>: <Lua scripts> is a comma separated list of
           directories, script-files or script-categories
  --script-args=<n1=v1,[n2=v2,...]>: provide arguments to scripts
  --script-args-file=filename: provide NSE script args in a file
  --script-trace: Show all data sent and received
  --script-updatedb: Update the script database.
  --script-help=<Lua scripts>: Show help about scripts.
           <Lua scripts> is a comma-separated list of script-files or
           script-categories.
OS DETECTION:
  -O: Enable OS detection
  --osscan-limit: Limit OS detection to promising targets
  --osscan-guess: Guess OS more aggressively
TIMING AND PERFORMANCE:
  Options which take <time> are in seconds, or append 'ms' (milliseconds),
  's' (seconds), 'm' (minutes), or 'h' (hours) to the value (e.g. 30m).
  -T<0-5>: Set timing template (higher is faster)
  --min-hostgroup/max-hostgroup <size>: Parallel host scan group sizes
  --min-parallelism/max-parallelism <numprobes>: Probe parallelization
  --min-rtt-timeout/max-rtt-timeout/initial-rtt-timeout <time>: Specifies
      probe round trip time.
  --max-retries <tries>: Caps number of port scan probe retransmissions.
  --host-timeout <time>: Give up on target after this long
  --scan-delay/--max-scan-delay <time>: Adjust delay between probes
  --min-rate <number>: Send packets no slower than <number> per second
  --max-rate <number>: Send packets no faster than <number> per second
FIREWALL/IDS EVASION AND SPOOFING:
  -f; --mtu <val>: fragment packets (optionally w/given MTU)
  -D <decoy1,decoy2[,ME],...>: Cloak a scan with decoys
  -S <IP_Address>: Spoof source address
  -e <iface>: Use specified interface
  -g/--source-port <portnum>: Use given port number
  --proxies <url1,[url2],...>: Relay connections through HTTP/SOCKS4 proxies
  --data <hex string>: Append a custom payload to sent packets
  --data-string <string>: Append a custom ASCII string to sent packets
  --data-length <num>: Append random data to sent packets
  --ip-options <options>: Send packets with specified ip options
  --ttl <val>: Set IP time-to-live field
  --spoof-mac <mac address/prefix/vendor name>: Spoof your MAC address
  --badsum: Send packets with a bogus TCP/UDP/SCTP checksum
OUTPUT:
  -oN/-oX/-oS/-oG <file>: Output scan in normal, XML, s|<rIpt kIddi3,
     and Grepable format, respectively, to the given filename.
  -oA <basename>: Output in the three major formats at once
  -v: Increase verbosity level (use -vv or more for greater effect)
  -d: Increase debugging level (use -dd or more for greater effect)
  --reason: Display the reason a port is in a particular state
  --open: Only show open (or possibly open) ports
  --packet-trace: Show all packets sent and received
  --iflist: Print host interfaces and routes (for debugging)
  --append-output: Append to rather than clobber specified output files
  --resume <filename>: Resume an aborted scan
  --noninteractive: Disable runtime interactions via keyboard
  --stylesheet <path/URL>: XSL stylesheet to transform XML output to HTML
  --webxml: Reference stylesheet from Nmap.Org for more portable XML
  --no-stylesheet: Prevent associating of XSL stylesheet w/XML output
MISC:
  -6: Enable IPv6 scanning
  -A: Enable OS detection, version detection, script scanning, and traceroute
  --datadir <dirname>: Specify custom Nmap data file location
  --send-eth/--send-ip: Send using raw ethernet frames or IP packets
  --privileged: Assume that the user is fully privileged
  --unprivileged: Assume the user lacks raw socket privileges
  -V: Print version number
  -h: Print this help summary page.
EXAMPLES:
  nmap -v -A scanme.nmap.org
  nmap -v -sn 192.168.0.0/16 10.0.0.0/8
  nmap -v -iR 10000 -Pn -p 80
SEE THE MAN PAGE (https://nmap.org/book/man.html) FOR MORE OPTIONS AND EXAMPLES
```

### 1、安装nmap

```
apt install nmap
```

### 2、使用

#### 2.1基本扫描

扫描指定ip

```
nmap 192.168.8.8
```

TCP端口扫描

```
nmap  -p 8006 192.168.8.8
```

UDP端口扫描

```
nmap -sU 192.168.8.105
```

扫描的全部TCP端口

```
nmap  -p- 192.168.8.12
```

快速扫描

```
nmap  -F 192.168.8.12
```

### 3、其他用途

#### 3.1服务版本检查

用于探测目标主机上运行的服务的版本信息

```
nmap -sV 192.168.8.12
```

#### 3.2操作系统检查

```
nmap -O 192.168.8.105
```

