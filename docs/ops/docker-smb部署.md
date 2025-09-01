## docker-smb部署

### 1、简介

samba是smb协议的实现，利用docker可以快速部署

### 2、部署

dockurr.yaml配置文件内容

```yaml
services:
  samba:
    image: dockurr/samba
    container_name: samba
    environment:
      NAME: "Data"
      USER: "samba"
      PASS: "secret"
    ports:
      - 445:445
    volumes:
      - ./samba:/storage
    restart: always
```

运行

```shell
docker compose -f dockurr.yaml up -d
```

### 3、访问

访问：\\\ip\Data

用户名：samba

密码：secret

