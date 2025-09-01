### 一次性使用

```bash
#启用python的http模块
#指定访问端口为80
#指定路径/share
python3 -m http.server 80 -d /share

#当前路径，默认端口8000
python3 -m http.server

#python2模块为SimpleHTTPServer
python2 -m SimpleHTTPServer 80 -d /share

python2 -m SimpleHTTPServer
```

### 永久使用

* 配置systemd服务单元

在/etc/systemd/system/目录下创建systemd服务文件，例如python_http_server.service，并添加以下内容：

```bash
[Unit]
Description=HTTP Server
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 -m http.server 80 -d /share

[Install]
WantedBy=multi-user.target
```

* 重新加载 systemd，使新创建的服务生效 

```bash
systemctl daemon-reload
```

* 配置开机自启，启动服务

```bash
#开机自启
systemctl enable python_http_server.service

#启动服务
systemctl start python_http_server.service
```

### 下载文件

* 下载

```bash
#web直接下载

#curl命令行下载（win10可用）
curl -O http://192.168.8.105/UU-4.69.0.exe

#wget命令行下载
wget http://192.168.8.105/UU-4.69.0.exe
```
