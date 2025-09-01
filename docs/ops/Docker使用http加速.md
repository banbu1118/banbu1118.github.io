## Docker使用http加速

国内因为政策原因，无法拉取镜像，这里配置http代理来拉取镜像

- 编辑配置文件

```bash
nano /etc/docker/daemon.json
```

内容如下

```json
{
  "proxies": {
    "http-proxy": "http://192.168.1.191:1081",
    "https-proxy": "http://192.168.1.191:1081"
  }
}
```

- 重启docker服务

```bash
systemctl restart docker
```

- 测试

```bash
docker pull hello-world
```

