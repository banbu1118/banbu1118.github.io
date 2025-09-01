## 前言

## 一、Docker为什么会出现

* 解决运维开发过程中部署环境的冲突

## 二、Docker历史

* 2013年发布

## 三、Docker的思想

* 集装箱
* 标准化
* 隔离性

## 四、Docker的优势

* 快速部署，节约资源

## 五、Docker基本组成

* 客户端、服务器、仓库

* 镜像（imag）：镜像文件

* 容器（container）：运行一个或多个应用，通过镜像来创造

* 仓库（repository）：公有仓库，私有仓库，阿里云（中科大）配置容器加速

## 六、安装使用

### 1、帮助文档

* [docker官方文档](https://docs.docker.com/)[https://docs.docker.com/]

### 2、系统版本

* CentOS Linux release 7.9.2009 (Core)

### 3、安装Docker

* 卸载旧版本

```bash
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

* 安装需要的依赖包

```bash
sudo yum install -y yum-utils
```

* 配置管理docker源

```bash
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

* 使用镜像仓库安装镜像

  创建文件，并输入镜像站点

```bash
sudo vim /etc/docker/daemon.json
```

```bash
{
"registry-mirrors":["https://docker.mirrors.ustc.edu.cn"]
}
```

* 安装docker引擎

```bash
sudo yum install docker-ce docker-ce-cli containerd.io
```

* 安装docker-compose

```bash
#下载阿里云的EPEL源并保存到/etc/yum.repos.d/epel.repo文件中
sudo curl -o /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-7.repo

#更新本地yum软件包缓存
sudo yum makecache fast

#安装docker-compose
sudo yum install docker-compose -y

#验证docker-compose是否安装成功
docker-compose --version
```



### 4、镜像命令

* 启动docker

```bash
sudo systemctl start docker

#设置开机自启
sudo systemctl enable docker
```

* 获得镜像

```bash
sudo docker pull hello-world
```

* 运行hello-world镜像

```bash
sudo docker run hello-world
```

* 查看镜像

```bash
sudo docker images
```

* 搜索镜像

```bash
sudo docker search packages
```

* 删除镜像

```bash
sudo docker rmi -f package				#删除镜像
sudo docker rmi -f $(docker images -aq) #删除所有镜像
```

### 5、容器命令

* 新建容器并启动

```bash
sudo docker run [可选参数] image
# 参数说明
--name="Name"	容器名字
-d				后台运行
-it				使用交互方式运行，进入容器查看内容
-p				指定容器的端口，例如：-p 8080:8080
```

* 启动容器，并进入容器

```bash
sudo docker run -it centos /bin/bash
```

* 退出容器

```bash
exit					#直接退出容器
ctrl + Q / ctrl + Q +P	#推出后台运行容器
```

* 列出正在运行的容器

```bash
sudo docker ps  	#列出正在运行的容器
sudo docker ps -a	#列出曾经运行过的容器
```

* 删除容器

```bash
sudo docker rm 容器id					# -f 强制删除容器
sudo docker rm -f $(docker ps -aq)   #删除所有容器
```

* 启动和停止容器

```bash
sudo docker start + 容器id
sudo docker restart + 容器id
sudo docker stop + 容器id
sudo docker kill +容器id
```

### 6、其他常用命令

- 后台启动容器

``` shell
#命令 docker run -d 镜像
sudo docker run -d centos
#问题docker ps -a，发现centos停止了
#常见的坑，docker 容器使用后台运行，就必须要有一个前台进程，docker 发现没有应用，就会停止
#例如，搭建nginx，容器启动后，发现自己没有提供服务，就会立刻停止，就是没有程序了
```

- 查看日志

```bash
sudo docker logs -f -t 容器，没有日志

#自己编写一段shell脚本
"while true;do echo banbu;sleep 1;done"
#[root@localhost ~]# docker ps
CONTAINER ID   IMAGE
6e71f6b26bed   centos
#显示日志
-tf                #显示日志
--tail number      #要显示日志条数
sudo docker logs -tf --tail 10 6e71f6b26bed
sudo docker logs  6e71f6b26bed

```

- 查看容器中的进程信息 ps

```bash
#命令 docker top 容器id
[root@localhost ~]# docker top 6e71f6b26bed
UID                 PID                 PPID                C                   STIME               TTY                 TIME                CMD
root                2118                2099                0                   22:38               ?                   00:00:00            /bin/sh -c while true;do echo banbu;sleep 1;done
root                2848                2118                0                   22:49               ?                   00:00:00            /usr/bin/coreutils --coreutils-prog-shebang=sleep /usr/bin/sleep 1
```

- 查看镜像元数据inspect

```bash
#命令 docker inspect 容器id
#测试
[root@localhost ~]# docker inspect 6e71f6b26bed
[
    {
        "Id": "6e71f6b26bed9a2e7367fc65fa53fd620f3f1930baae49a3053c768f47d345ad",
        "Created": "2021-10-03T14:38:43.5295059Z",
        "Path": "/bin/sh",
        "Args": [
            "-c",
            "while true;do echo banbu;sleep 1;done"
        ],
        "State": {
            "Status": "running",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 2118,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2021-10-03T14:38:43.851467321Z",
            "FinishedAt": "0001-01-01T00:00:00Z"
        },
        "Image": "sha256:5d0da3dc976460b72c77d94c8a1ad043720b0416bfc16c52c45d4847e53fadb6",
        "ResolvConfPath": "/var/lib/docker/containers/6e71f6b26bed9a2e7367fc65fa53fd620f3f1930baae49a3053c768f47d345ad/resolv.conf",
        "HostnamePath": "/var/lib/docker/containers/6e71f6b26bed9a2e7367fc65fa53fd620f3f1930baae49a3053c768f47d345ad/hostname",
        "HostsPath": "/var/lib/docker/containers/6e71f6b26bed9a2e7367fc65fa53fd620f3f1930baae49a3053c768f47d345ad/hosts",
        "LogPath": "/var/lib/docker/containers/6e71f6b26bed9a2e7367fc65fa53fd620f3f1930baae49a3053c768f47d345ad/6e71f6b26bed9a2e7367fc65fa53fd620f3f1930baae49a3053c768f47d345ad-json.log",
        "Name": "/beautiful_shtern",
        "RestartCount": 0,
        "Driver": "overlay2",
        "Platform": "linux",
        "MountLabel": "",
        "ProcessLabel": "",
        "AppArmorProfile": "",
        "ExecIDs": null,
        "HostConfig": {
            "Binds": null,
            "ContainerIDFile": "",
            "LogConfig": {
                "Type": "json-file",
                "Config": {}
            },
            "NetworkMode": "default",
            "PortBindings": {},
            "RestartPolicy": {
                "Name": "no",
                "MaximumRetryCount": 0
            },
            "AutoRemove": false,
            "VolumeDriver": "",
            "VolumesFrom": null,
            "CapAdd": null,
            "CapDrop": null,
            "CgroupnsMode": "host",
            "Dns": [],
            "DnsOptions": [],
            "DnsSearch": [],
            "ExtraHosts": null,
            "GroupAdd": null,
            "IpcMode": "private",
            "Cgroup": "",
            "Links": null,
            "OomScoreAdj": 0,
            "PidMode": "",
            "Privileged": false,
            "PublishAllPorts": false,
            "ReadonlyRootfs": false,
            "SecurityOpt": null,
            "UTSMode": "",
            "UsernsMode": "",
            "ShmSize": 67108864,
            "Runtime": "runc",
            "ConsoleSize": [
                0,
                0
            ],
            "Isolation": "",
            "CpuShares": 0,
            "Memory": 0,
            "NanoCpus": 0,
            "CgroupParent": "",
            "BlkioWeight": 0,
            "BlkioWeightDevice": [],
            "BlkioDeviceReadBps": null,
            "BlkioDeviceWriteBps": null,
            "BlkioDeviceReadIOps": null,
            "BlkioDeviceWriteIOps": null,
            "CpuPeriod": 0,
            "CpuQuota": 0,
            "CpuRealtimePeriod": 0,
            "CpuRealtimeRuntime": 0,
            "CpusetCpus": "",
            "CpusetMems": "",
            "Devices": [],
            "DeviceCgroupRules": null,
            "DeviceRequests": null,
            "KernelMemory": 0,
            "KernelMemoryTCP": 0,
            "MemoryReservation": 0,
            "MemorySwap": 0,
            "MemorySwappiness": null,
            "OomKillDisable": false,
            "PidsLimit": null,
            "Ulimits": null,
            "CpuCount": 0,
            "CpuPercent": 0,
            "IOMaximumIOps": 0,
            "IOMaximumBandwidth": 0,
            "MaskedPaths": [
                "/proc/asound",
                "/proc/acpi",
                "/proc/kcore",
                "/proc/keys",
                "/proc/latency_stats",
                "/proc/timer_list",
                "/proc/timer_stats",
                "/proc/sched_debug",
                "/proc/scsi",
                "/sys/firmware"
            ],
            "ReadonlyPaths": [
                "/proc/bus",
                "/proc/fs",
                "/proc/irq",
                "/proc/sys",
                "/proc/sysrq-trigger"
            ]
        },
        "GraphDriver": {
            "Data": {
                "LowerDir": "/var/lib/docker/overlay2/9247d198dcb238df54c255950818b1b8212e07fe6bd3a449708dee9c102bc0cc-init/diff:/var/lib/docker/overlay2/e945954312d8b798a451f74e2b9b4ea69b239122b2f98201944ea762e42821bb/diff",
                "MergedDir": "/var/lib/docker/overlay2/9247d198dcb238df54c255950818b1b8212e07fe6bd3a449708dee9c102bc0cc/merged",
                "UpperDir": "/var/lib/docker/overlay2/9247d198dcb238df54c255950818b1b8212e07fe6bd3a449708dee9c102bc0cc/diff",
                "WorkDir": "/var/lib/docker/overlay2/9247d198dcb238df54c255950818b1b8212e07fe6bd3a449708dee9c102bc0cc/work"
            },
            "Name": "overlay2"
        },
        "Mounts": [],
        "Config": {
            "Hostname": "6e71f6b26bed",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            ],
            "Cmd": [
                "/bin/sh",
                "-c",
                "while true;do echo banbu;sleep 1;done"
            ],
            "Image": "centos",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": null,
            "Labels": {
                "org.label-schema.build-date": "20210915",
                "org.label-schema.license": "GPLv2",
                "org.label-schema.name": "CentOS Base Image",
                "org.label-schema.schema-version": "1.0",
                "org.label-schema.vendor": "CentOS"
            }
        },
        "NetworkSettings": {
            "Bridge": "",
            "SandboxID": "3ae9245bd8a3d1a1e317ec04556e3dd0bb2ebb66a0a31d76cc186741742ee78b",
            "HairpinMode": false,
            "LinkLocalIPv6Address": "",
            "LinkLocalIPv6PrefixLen": 0,
            "Ports": {},
            "SandboxKey": "/var/run/docker/netns/3ae9245bd8a3",
            "SecondaryIPAddresses": null,
            "SecondaryIPv6Addresses": null,
            "EndpointID": "1b737578200de6606422fd135dd86612e0b3dcec33d87c54ca8c9692e833ba1d",
            "Gateway": "172.17.0.1",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "IPAddress": "172.17.0.2",
            "IPPrefixLen": 16,
            "IPv6Gateway": "",
            "MacAddress": "02:42:ac:11:00:02",
            "Networks": {
                "bridge": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "NetworkID": "d2b88fff40291da662ec0edd83f7641ef4bbb8de1d4c203426037f3f0f9cbedc",
                    "EndpointID": "1b737578200de6606422fd135dd86612e0b3dcec33d87c54ca8c9692e833ba1d",
                    "Gateway": "172.17.0.1",
                    "IPAddress": "172.17.0.2",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "MacAddress": "02:42:ac:11:00:02",
                    "DriverOpts": null
                }
            }
        }
    }
]
```

- 进入当前正在运行的容器ps

```bash
#我们通常容器都是使用后台方式运行的，需要进入容器，修改一些参数
#命令 进入容器 docker exec -it 容器id bashshell
#测试
[root@localhost ~]# docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS     NAMES
6e71f6b26bed   centos    "/bin/sh -c 'while t"   32 minutes ago   Up 32 minutes             beautiful_shtern
[root@localhost ~]# docker exec -it 6e71f6b26bed /bin/bash

#方式二
docker attach 容器id
#测试
[root@localhost ~]# docker attach 6e71f6b26bed
正在执行当前的代买...

#docker exec     #进入容器后开启一个新的终端，可以在里面操作（常用）
#docker attach   #进去容器正在执行的终端，不会启动新的进程！
```

- 从容器拷贝文件到主机上cp

```bash
#命令 docker cp 容器id:容器内路径  目的主机路径
#进入容器
[root@localhost home]# docker attach a6ce061204af
[root@a6ce061204af home]# pwd
/home
#在容器内新建一个123.py文件
[root@a6ce061204af home]# touch 123.py
#推出容器
[root@a6ce061204af home]# exit
exit
[root@localhost home]# docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
#推出容器后，容器不运行，依然可以复制文件！！！
[root@localhost home]# docker ps -a
CONTAINER ID   IMAGE     COMMAND       CREATED         STATUS
           PORTS     NAMES
a6ce061204af   centos    "/bin/bash"   4 minutes ago   Exited (0) 10 seconds ago             serene_leakey
#从镜像中复制文件到主机
[root@localhost home]# docker cp a6ce061204af:/home/123.py /home
[root@localhost home]# ls
123.py
```

### 7、小结

### 8、作业练习

- Docker安装Nginx

```bash
# 1、搜索镜像 search 
# 2、下载镜像 pull
# 3、运行测试
[root@localhost home]# docker images
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
python       latest    6beb0d435def   4 days ago    911MB
nginx        latest    f8f4ffc8092c   5 days ago    133MB
centos       latest    5d0da3dc9764   2 weeks ago   231MB
#-d        后台运行
#--name    给容器命名
#-p		   端口映射(宿主机端口：容器内端口)
[root@localhost home]# docker run -d  --name nginx01 -p 3344:80 nginx
8c77a13c41eadcd6b51eb1f5ee8652e1ebe49e20c19de7f6ccca545a4a40bbe4
[root@localhost home]# docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                                   NAMES
8c77a13c41ea   nginx     "/docker-entrypoint."   8 seconds ago   Up 7 seconds   0.0.0.0:3344->80/tcp, :::3344->80/tcp   nginx01
[root@localhost home]# curl localhost:3344
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

- Docker安装一个tomcat

```bash
# 官方的使用
docker run -it --rm tomcat:9.0
#我们之前的启动都是后台，停止了容器之后，容器还是可以查到  docker run -it --rm，一般用来测试，用完就删除（但是镜像会保留，docker images查询）
#下载启动
docker pull tomcat
#启动运行
docker run -d -p 3355:8080 --name tomcat01 tomcat
#测试访问没问题
#进入容器
[root@bogon ~]# docker exec -it tomcat01 /bin/bash
#发现问题：1、linux命令少了 2、没有webapps。阿里云镜像的原因，默认最小的镜像，剔除了所有不必要的
#保证最小化的运行环境
```

- Docker部署ES+Kibana

```bash
#es暴露的端口很多
#es十分的耗内存
#es数据一般需要放置在安全目录，挂在！
# --net somenetwork ?网络配置

#启动elasticsearch
docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch
#启动Linux服务器卡

# docker stats 查看cpu状态
#测试es是否成功
[root@localhost ~]# curl localhost:9200
{
  "name" : "flPFwV-",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "ayBgF3b-Qze1PEVJh-W7lA",
  "version" : {
    "number" : "5.6.12",
    "build_hash" : "cfe3d9f",
    "build_date" : "2018-09-10T20:12:43.732Z",
    "build_snapshot" : false,
    "lucene_version" : "6.6.1"
  },
  "tagline" : "You Know, for Search"
}

#赶紧关闭，增加内存的限制

```


```bash
#赶紧关闭，增加内存的限制，修改配置文件 -e 环境配置修改
docker run -d --name elasticsearch02 -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e ES_JAVA_OPTS="-Xms64m -Xmx512m" elasticsearch
#测试是否成功
[root@localhost ~]# curl localhost:9200
{
  "name" : "ZYuEIfr",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "pDxZiprzRTCPGrUIU-dC9Q",
  "version" : {
    "number" : "5.6.12",
    "build_hash" : "cfe3d9f",
    "build_date" : "2018-09-10T20:12:43.732Z",
    "build_snapshot" : false,
    "lucene_version" : "6.6.1"
  },
  "tagline" : "You Know, for Search"
}
```

```bash
#查看 docker stats
```


```bash
#学习任务:使用Kibana连接ES（通过Linux宿主机）
```

- Portainer可视化面板安装

```bash
#portainer是Docker图形化界面管理工具，提供一个后台面板供我们操作
docker run -d -p 8088:9000 portainer/portainer

#添加参数，有关卷挂载和权限
docker run -d -p 8088:9000 --restart=always -v /var/run/docker.sock:/var/docker.sock --privileged=true portainer/portainer

#portainer(先用这个)
docker run -d -p 8088:9000 --restart=always -v /var/run/docker.sock:/var/docker.sock --privileged=true portainer/portainer

#访问测试外网：外网ip:8088(服务器ip)
```

- Rancher（CV/CD再用）

## 七、Docker镜像讲解

- 镜像是什么

```bash
镜像是一种轻量级、可执行的独立软件包，用来打包运行环境和基于运行环境开发的软件，它包含运行某个软件所需的所有内容，包括代码、运行时的库、环境变量和配置文件
所有的应用，直接打包docker镜像，就可以直接跑起来
```

- 如何得到镜像
  从远程仓库下载、朋友拷贝给你、自己制作一个镜像DockerFiles

- Docker镜像加载原理

```bash
UnionFS（联合文件系统）：Union文件系统（Union）是一种分层、轻量级且高效的文件系统，它支持对文件系统的修改作为一次提交来一层层的叠加，同时可以将不同目录挂载到同一个虚拟文件系统下（unite several directories into a single virtual filesystem）。Union文件系统是Docker镜像的基础，镜像可以通过分层来继承，基于基础镜像（没有父镜像），可以制作各种具体的应用镜像。
```

- 特点
  Docker镜像都是只读，当容器启动时，一个新的可写层被加载到镜像的顶层
  这层就是我们通常说的容器层，容器之下的都叫镜像层！

## 八、容器数据卷

### 1、引言

- commit镜像

```bash
#docker commit提升容器成为一个新的副本
#命令和git原理类似
#docker commit -m="提交的描述信息" -a="作者" 容器id 目标镜像名，[TAG]
```

- 实战测试

```bash
#1、启动一个默认的tomcat

#2、发现这个默认的tomcat是没有webapps应用，镜像的原因：官方的镜像默认webapps下面是没有文件的

#3、我自己拷贝进去了基本文件

#4、我们操作过的容器通过commit提交为一个镜像
```

### 2、容器数据卷

- 什么是容器数据卷

```
Docker的理念回顾
将应用和环境打包成一个镜像

数据？如果数据都在容器中，那么我们容器删除，数据就会丢失！
需求：数据可以同步到本地

Mysql，容器删了，删库跑路！
需求：Mysql数据可以储存在本地

容器之间可以有一个数据共享的技术！Docker容器中产生的数据，同步到本地
这就是卷技术！目录的挂载，将我们容器的目录，挂载到Linux上面！

总结：容器的持久化和同步操作！容器间也是可以数据共享的！
```

- 使用数据卷

```bash
#方式一：直接用命令来挂载 -v
docker run -it -v 主机目录，容器目录
#测试
[root@localhost ~]# docker run -it -v /home/ceshi:/home/ centos /bin/bash

#启动起来时候我们可以通过docker inspect 容器id
```



### 3、实战：安装MySQl

- 思考：Mysql的数据持久化问题！

```bash
#获取镜像
[root@192 ~]# docker pull mysql

#运行容器，需要做数据挂载！
#安装启动mysql，需要配置密码，注意！
#官方测试：docer run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag

#启动我们的容器
-d   后台运行
-p   端口映射
-v   卷挂载
-e   环境配置
--name 容器名字
[root@192 ~]# docker run -d -p 3310:3306 -v /home/mysql/conf:/etc/mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name m
ysql01 mysql

#启动成功后，在本地使用sqlyog来测试一下
#sqlyog-连接到服务器的3310   ----3310和容器内的3306映射，这个时候我们就可以连接上了！

#在本地测试创建一个数据库，查看一下我们的映射的路径是否ok

#假设我们将容器删除，发现挂载在本地的数据卷依旧没有丢失，这就实现了容器数据持久化功能！

```

4、具名和匿名挂载

```bash
#匿名挂载
-v  容器内路径！
docker run -d -P --name nginx01 -v /etc/nginx nginx

#查看所有卷的情况
[root@192 ~]# docker volume ls
local     3cce1ef9612f529c10df2c7a4bab33387e363279441aec93065dc40acd04be2d
#这里发现，这种就是匿名挂载，我们在-v的时候只写了容器内的路径，没有写容器外的路径
local     juming-nignx

#通过-v  卷名：容器内路径
[root@192 ~]# docker run -d -P --name nginx02 -v juming-nignx:/etc/nginx  nginx

#查看一下这个卷
[root@192 ~]# docker volume inspect juming-nignx
[
    {
        "CreatedAt": "2021-10-16T13:33:02-04:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/juming-nignx/_data",
        "Name": "juming-nignx",
        "Options": null,
        "Scope": "local"
    }
]

#所有的docker容器内的卷，没有指定目录的情况下都在/var/lib/docker/volumes/xxxxx/_data内，我们通过具名挂载可以方便的找到我们的一个卷，大多数情况使用的具名挂载
```

```bash
#如何区别是具名挂载还是匿名挂载，关键在于指定路径！
-v 容器内路径         #匿名挂载
-v 卷名:容器内路径    #具名挂载
-v /宿主机路径:容器内路径   #指定路径挂载
```

```bash
#拓展
#通过-v 容器内路径:ro rw 改变读写权限
ro   readonly   #只读
rw   readwrite  #可读可写

#一旦这个设置了容器权限，容器对我们挂载出来的内容就有限定了
docker run -d -P --name nginx02 -v juming-nignx:/etc/nginx:ro  nginx
docker run -d -P --name nginx02 -v juming-nignx:/etc/nginx:rw  nginx

#ro 只要看到ro就说明这个路径只能通过宿主机操作，容器内无法操作！
```

### 4、初识DockerFile

- Dockerfile就是用来构建docker镜像的构建文件！命令脚本！先体验一下！
- 通过脚本可以生成镜像，镜像是一层一层，脚本一个个的命令，每个命令都是一层

```bash
#创建一个dockerfile文件，名字可以随意，建议Dockerfile
#文件中的内容，指令（大写），散数
FROM centos
VOLUME ["volume01","volume02"]

CMD echo "---end---"
CMD /bin/bash

#这里的每个命令，就是镜像的一层

#测试
[root@192 docker-test-volume]# docker build -f /home/docker-test-volume/dockerfile1 -t banbu/centos .
Sending build context to Docker daemon  2.048kB
Step 1/4 : FROM centos
 ---> 5d0da3dc9764
Step 2/4 : VOLUME ["volume01","volume02"]
 ---> Running in 6a67ddf13d2c
Removing intermediate container 6a67ddf13d2c
 ---> af91c4f991a4
Step 3/4 : CMD echo "---end---"
 ---> Running in 782e93e5f0d8
Removing intermediate container 782e93e5f0d8
 ---> 2f1d376ce492
Step 4/4 : CMD /bin/bash
 ---> Running in c11dde916b0e
Removing intermediate container c11dde916b0e
 ---> fe6b0f964a63
Successfully built fe6b0f964a63
Successfully tagged banbu/centos:latest
[root@192 docker-test-volume]# docker images
REPOSITORY            TAG       IMAGE ID       CREATED          SIZE
banbu/centos          latest    fe6b0f964a63   45 seconds ago   231MB

#启动自己写的容器
docker images
docker run -it fe6b0f964a63 /bin/bash

#在容器内创建文件，容器外自动同步
docker ps
docker inspect 容器id
#检查挂载mounts目录
```

### 5、数据容器卷

```bash
#使用卷挂载命令--volumes-from共享数据
#创建容器1，把容器1挂载到容器2，把容器2挂载到容器3，分别在不同的容器创建数据，互相同步，删除容器1创建的数据，容器2，3不受影响
[root@localhost ~]# docker run -it  --name docker01 fe6b0f964a63
[root@localhost ~]# docker run -it --name docker02 --volumes-from docker01 f
e6b0f964a63
[root@localhost ~]# docker run -it --name docker03 --volumes-from docker01 fe6b0f964a63

#容器里的数据不是永久保存，需要备份到本地需要可以使用容器数据卷方法，永久的固化到本地
```

## 九、DockerFile

### DockerFile介绍

#### 1、DockerFile作用

- dockerfile是用来构建docker镜像的文件！命令参数脚本！

#### 2、构建步骤

1、编写一个dockerfile文件

2、docker build构建成为一个镜像

3、docker run运行镜像

4、docker push发布镜像（DockerHub，阿里云镜像仓库）

### DockerFile构建过程

### 基础知识

1、每个保留关键字（指令）都必须是大写字母
2、执行从上到下顺序执行
3、






Docker网络


