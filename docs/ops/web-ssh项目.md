### web-ssh项目

通过浏览器共享您的终端 

项目GitHub官网：[https://github.com/tsl0922/ttyd](https://github.com/tsl0922/ttyd)

#### 一、直接使用

- 下载文件

Releases下载对应架构的文件

- 增加执行权限

```bash
chmod +x ttyd.x86_64
```

- 运行

web直接登陆bash

```bash
./ttyd.x86_64 --writable bash
```

浏览器访问：http://ip:7681

- 登陆模式

需要账户密码登陆

```bash
./ttyd.x86_64 --writable login
```

- 指定端口登陆

```bash
./ttyd.x86_64 --writable -p 8888 login
```

- ssl登陆

创建ssl证书

```bash
mkdir /etc/ttyd

openssl req -x509 -nodes -days 365 -newkey rsa:2048   -keyout /etc/ttyd/key.pem   -out /etc/ttyd/server.pem   -subj "/C=US/ST=VA/L=SomeCity/O=MyCompany/CN=ttyd"   > /dev/null 2>&1
```

登陆

```bash
./ttyd.x86_64 --ssl --ssl-cert /etc/ttyd/server.pem --ssl-key /etc/ttyd/key.pem --writable -p 8888 login
```

浏览器访问：https://ip:8888

#### 二、配置systemd系统服务

- 配置ssl证书

```bash
mkdir -p /etc/ttyd

# 生成 SSL 证书
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ttyd/key.pem \
  -out /etc/ttyd/server.pem \
  -subj "/C=US/ST=VA/L=SomeCity/O=MyCompany/CN=ttyd"
```

- 拷贝文件

```bash
mv ttyd.x86_64 /usr/local/bin/ttyd
chmod +x /usr/local/bin/ttyd
```

- 创建systemd服务

创建配置文件

```bash
nano /etc/systemd/system/ttyd.service
```

内容如下，注意这里使用的是root

```bash
[Unit]
Description=ttyd - Web-based terminal over SSL
After=network.target

[Service]
ExecStart=/usr/local/bin/ttyd \
  --ssl \
  --ssl-cert /etc/ttyd/server.pem \
  --ssl-key /etc/ttyd/key.pem \
  --writable \
  -p 8888 \
  login

Restart=always
User=root
Group=root

[Install]
WantedBy=multi-user.target
```

- 配置服务

```bash
systemctl enable ttyd

systemctl start ttyd

#systemctl status ttyd
```

浏览器访问：https://ip:8888