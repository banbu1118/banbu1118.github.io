## nginx代理rdp网关和https服务

### 一、nginx安装

nginx包和nginx-full包如何选择？

nginx包：

nginx的标准安装包，包含了常用的核心功能，适用于大多数基本的web服务器需求。

该包的功能相对较少，适用于简单的nginx使用场景，不包含某些高级或可选的模块。 

nginx-full包：

nginx-full是一个更完整的nginx安装包，它包含了比nginx更多的功能和模块。 

相比nginx，nginx-full 包含了一些额外的模块和扩展，支持更高级的功能，例如：Gzip压缩模块，SSL/TLS模块，Rewrite模块，Proxy模块，FastCGI模块，以及其他可选nginx模块。

本教程需要使用stream模块和ssl模块，所以需要安装nginx-full

* 安装nginx-full

```
apt install -y nginx-full
```

### 二、ssl证书配置

* 安装openssl

```
apt install -y openssl
```

* 在nginx配置目录创建ssl目录

```
cd /etc/nginx/

mkdir ssl
```

* 为nginx配置ssl证书

```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt
```



### 三、nginx代理rdp网关

编辑/etc/nginx/nginx.conf配置文件，在events后，http前添加stream模块，内容如下

```
events {
        worker_connections 768;
        # multi_accept on;
}

stream {
    upstream backend {
        server 192.168.1.125:443;	#需要代理的rdp网关或rdp主机
    }

    server {
        listen 8443;	#监听本机端口
        proxy_pass backend;
    }
}
```

### 四、nginx代理https服务

编辑/etc/nginx/nginx.conf配置文件，配置https代理

```
http {
    # 定义 SSL 证书和密钥路径
    server {
        listen 443 ssl;
        server_name localhost;

        # SSL 证书文件路径（更换为你自己的证书和私钥文件路径）
        ssl_certificate /etc/nginx/ssl/nginx.crt;
        ssl_certificate_key /etc/nginx/ssl/nginx.key;

        # SSL 配置
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # 定义反向代理规则，将请求转发到 HTTPS 后端
        location / {
            proxy_pass https://192.168.1.102:443;

            # 忽略后端服务器的自签名证书
            proxy_ssl_verify off;

            # 设置头部信息
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # 代理超时设置
            proxy_connect_timeout 10s;
            proxy_send_timeout 10s;
            proxy_read_timeout 10s;
        }
    }
}
```

### 五、启动nginx服务

* 检查配置信息是否正确

```
nginx  -t
```

* 重启nginx服务

```
systemctl restart nginx
```

* 加载nginx配置

```
systemctl reload nginx
```

