## Debian全局socks5代理

- 安装proxychains

```shell
apt install proxychains
```

- 编辑配置文件/etc/proxychains.conf，末尾增加一行

```shell
socks5 192.168.1.8 1080
```

- 使用方法，在执行的命令前面添加proxychains

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

