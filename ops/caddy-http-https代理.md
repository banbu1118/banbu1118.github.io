### caddy-http-https代理

Caddy是一个现代的、开源的、基于Go语言的Web服务器,它具有自动HTTPS开箱即用的特性,配置简洁,易于使用

#### 1、安装caddy

- 安装caddy

```shell
apt install caddy
```

-  -  配置服务

```shell
#开机启动
systemctl enable caddy

#启动服务
systemctl start caddy
```

#### 2、配置代理

修改`/etc/caddy/Caddyfile`配置文件

此处把http使用caddy内置的证书代理为https

http://192.168.1.190:200 -> https://192.168.1.190:8443

http://192.168.1.190:100 -> https://192.168.1.190:443

```shell
https://192.168.1.190:8443 {
    reverse_proxy http://192.168.1.190:200
    tls internal
}
https://192.168.1.190:443 {
    reverse_proxy http://192.168.1.190:100
    tls internal
}
```

#### 3、检查配置

- 核实

```shell
caddy validate --config /etc/caddy/Caddyfile
```

- 重载配置

```shell
systemctl reload caddy
```
