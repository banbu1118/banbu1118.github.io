## Docker部署Guacamole

参考资料：[https://www.witaxe.com/blog/post-docker-compose](https://www.witaxe.com/blog/post-docker-compose)

Apache Guacamole是一款基于HTML5的无客户端远程桌面网关，支持VNC/RDP/SSH协议，用户通过浏览器即可访问远程计算机。

### 1.docker-compose.yaml配置

新建配置文件

```shell
nano docker-compose.yaml
```

内容如下

```yaml
services:
  guacamole:
    image: guacamole/guacamole:latest
    container_name: guacamole-web
    restart: unless-stopped
    environment:
      GUACD_HOSTNAME: guacd
      MYSQL_HOSTNAME: mysql
      MYSQL_DATABASE: guacamole_db
      MYSQL_USER: guacamole_user
      MYSQL_PASSWORD: your_secure_password_here
    ports:
      - "8080:8080"
    volumes:
      - guacamole_extensions:/opt/guacamole/extensions
    depends_on:
      - guacd
      - mysql
    networks:
      - guacamole-network

  guacd:
    image: guacamole/guacd:latest
    container_name: guacamole-guacd
    restart: unless-stopped
    networks:
      - guacamole-network

  mysql:
    image: mysql:8.0
    container_name: guacamole-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: your_root_password_here
      MYSQL_DATABASE: guacamole_db
      MYSQL_USER: guacamole_user
      MYSQL_PASSWORD: your_secure_password_here
    volumes:
      - mysql_data:/var/lib/mysql
      - ./initdb.sql:/docker-entrypoint-initdb.d/initdb.sql:ro
    networks:
      - guacamole-network

volumes:
  mysql_data:
  guacamole_extensions:
  guacamole_lib:

networks:
  guacamole-network:
    driver: bridge
```

### 2.生成数据库初始化脚本

在保存 docker-compose.yml 的目录中，执行以下命令生成数据库初始化脚本：

```shell
docker run --rm guacamole/guacamole /opt/guacamole/bin/initdb.sh --mysql > initdb.sql
```

### 3.修改默认密码（可选）

使用文本编辑器打开 docker-compose.yml 文件，将其中所有的 your_secure_password_here 和 your_root_password_here 替换为强密码。

### 4.启动服务

在保存 docker-compose.yaml 的目录中，执行以下命令。

```shell
docker compose up -d
```

### 5.web访问

服务启动后，通过浏览器访问 `http://你的服务器IP:8080/guacamole`，使用默认账号 `guacadmin` 和密码 `guacadmin` 登录。请务必在首次登录后立即修改默认密码。
