## Rocky全局socks5代理

- 添加epel仓库

```shell
yum install epel-release
```

- 安装proxychains-ng

```shell
yum install proxychains-ng
```

- 编辑配置文件/etc/proxychains.conf，末尾增加一行

```shell
socks5 192.168.1.8 1080
```

- 使用方法，在执行的命令前面添加proxychains

```shell
[root@localhost ~]# proxychains curl https://google.com
[proxychains] config file found: /etc/proxychains.conf
[proxychains] preloading /usr/lib64/proxychains-ng/libproxychains4.so
[proxychains] DLL init: proxychains-ng 4.17
[proxychains] Strict chain  ...  192.168.1.8:1080  ...  google.com:443  ...  OK
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="https://www.google.com/">here</A>.
</BODY></HTML>
```

