## Docker测试cups共享打印机

使用docker来部署cups，可以部署在瘦客户端上

镜像来源：[https://hub.docker.com/r/anujdatar/cups](https://hub.docker.com/r/anujdatar/cups)

- 创建配置文件

```shell
nano kk.yaml
```

写入以下内容

```yaml
version: "3"
services:
    cups:
        image: anujdatar/cups
        container_name: cups
        restart: unless-stopped
        ports:
            - "631:631"
        devices:
            - /dev/bus/usb:/dev/bus/usb
        environment:
            - CUPSADMIN=batman
            - CUPSPASSWORD=batcave_password
            - TZ="America/Gotham"
        volumes:
            - ./cups:/etc/cups
```

- 禁用系统默认的cups服务

```shell
systemctl stop cups
systemctl disable cups
```

- 运行

```shell
docker compose -f kk.yaml up -d
```

- 浏览器打开 [http://printer.local:631⁠](http://printer.local:631) 使用账号密码登陆并添加打印机测试
