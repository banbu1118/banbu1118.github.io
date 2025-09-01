##  vgpu授权服务器搭建方案

* 法律声明

```
此方案仅供测试使用，如有侵权行为，请联系我删除，本人不承担任何法律责任
```

* 方案来源

```
#本文章采用docker方案部署，其他部署请查看以下链接，
https://github.com/GreenDamTan/fastapi-dls
```

* 生成ssl证书

```bash
WORKING_DIR=/opt/docker/fastapi-dls/cert
mkdir -p $WORKING_DIR
cd $WORKING_DIR

# create instance private and public key for singing JWT's
openssl genrsa -out $WORKING_DIR/instance.private.pem 2048 
openssl rsa -in $WORKING_DIR/instance.private.pem -outform PEM -pubout -out $WORKING_DIR/instance.public.pem

# create ssl certificate for integrated webserver (uvicorn) - because clients rely on ssl
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout  $WORKING_DIR/webserver.key -out $WORKING_DIR/webserver.crt
```

* 创建licserver.yml配置文件，注意localhost需要改为本地ip

```bash
version: '3.9'

x-dls-variables: &dls-variables
  TZ: Asia/Shanghai # REQUIRED, set your timezone correctly on fastapi-dls AND YOUR CLIENTS !!!
  DLS_URL: localhost # REQUIRED, change to your ip or hostname
  DLS_PORT: 443
  LEASE_EXPIRE_DAYS: 90  # 90 days is maximum
  DATABASE: sqlite:////app/database/db.sqlite
  DEBUG: false

services:
  dls:
    image: collinwebdesigns/fastapi-dls:latest
    restart: always
    environment:
      <<: *dls-variables
    ports:
      - "443:443"
    volumes:
      - /opt/docker/fastapi-dls/cert:/app/cert
      - dls-db:/app/database
    logging:  # optional, for those who do not need logs
      driver: "json-file"
      options:
        max-file: 5
        max-size: 10m
            
volumes:
  dls-db:
```

* 部署容器

```bash
docker compose -f licserver.yml up -d

#有些系统是docker-compose
docker-compose -f licserver.yml up -d
```

* windows虚拟机获取授权

```powershell
#虚拟机浏览器访问 https://vgpu-licserver-ip/-/client-token
#下载证书到C:\Program Files\NVIDIA Corporation\vGPU Licensing\ClientConfigToken目录
#重启生效

#或者管理员执行Power-Shell命令
#下载到C:\Program Files\NVIDIA Corporation\vGPU Licensing\ClientConfigToken目录
curl.exe --insecure -L -X GET https://<dls-hostname-or-ip>/-/client-token -o "C:\Program Files\NVIDIA Corporation\vGPU Licensing\ClientConfigToken\client_configuration_token_$($(Get-Date).tostring('dd-MM-yy-hh-mm-ss')).tok"

#检测授权信息
#管理员执行powershell命令，获取授权状态
cd "C:\Program Files\NVIDIA Corporation\NVSMI"

.\nvidia-smi.exe -q | Select-String "License"
```

* linux虚拟机获取授权

```bash
#获取授权
curl --insecure -L -X GET https://<dls-hostname-or-ip>/-/client-token -o /etc/nvidia/ClientConfigToken/client_configuration_token_$(date '+%d-%m-%Y-%H-%M-%S').tok

#或者 
wget --no-check-certificate -O /etc/nvidia/ClientConfigToken/client_configuration_token_$(date '+%d-%m-%Y-%H-%M-%S').tok https://<dls-hostname-or-ip>/-/client-token

#重启生效

#检测授权信息，获取授权状态
nvidia-smi -q | grep "License"
```
