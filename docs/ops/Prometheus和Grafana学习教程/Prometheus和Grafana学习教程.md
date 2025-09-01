# Prometheus和Grafana学习教程

## 一、Prometheus概述

### 1、什么是Prometheus？

Prometheus（普罗米修斯）是一套开源的`<span style="color:red">`监控&报警&时间序列数据库`</span>`的组合，由go语言开发。适合监控容器平台或服务器监控，因为Kubernetes(俗称k8s)的流行带动了Prometheus的发展。

Prometheus应用场景：

1、解决大数据环境中服务的监控操作

2、监控Linux/windows系统

### 2、时间序列数据库？

#### 2.1 数据库分类

- 关系型

mysql,oracle,sql server,sybase,db2,access等

- 非关系型(nosal)

| 数据库类型 | 常见数据库            |
| ---------- | --------------------- |
| key-value  | memcahe redis etcd    |
| 文档型     | mongodb elasticsearch |
| 列式       | hbase                 |
| 时序       | prometheus            |
| 图形       | no4j                  |

* 时间序列数据(TimeSeriesData)：`<span style="color:red">`按照时间顺序记录系统、设备状态变化的数据被称为时序数据`</span>`

#### 2.2 时序数据库特点

- 数据带有时间属性，且数据量随着时间递增

- 大都为插入操作较多且无更新需求，插入数据多，每秒钟插入数据可到达于万其至上亿条

- 分析过去时序数据可以做成多纬度报表，揭示其趋势性、规律性、异常性

- 分析时序数据趋势可以做大数据分析，机器学习，实现预测和预警

- 能够按照条件筛选数据，也可以按照时间范围统计，聚合，展示数据

#### 2.3 常见应用场景

- 无人驾驶车辆运行中要记录的经度，纬度，速度，方向，旁边物体的距离等等。每时每刻都要将数据记录下来做分析。

- 某一个地区的落车辅的行驶轨迹数据

- `<span style="color:red">`传统证券行业实时交易数据`</span>`

- `<span style="color:red">`实时运维监控数据等`</span>`

### 3、Prometheus主要特性

- 多维度数据模型

- 灵活的查询语言

- 不依赖分布式存储，单个服务器节点是自主的

- 以HTTP方式，通过pull模型拉去时间序列数据

- 也可以通过中间网关支持push模型

- 通过服务发现或者静态配置，来发现自标服务对象

- 支持多种多样的图表和界面展示

### 4、Prometheus架构图

![](./images/1.png)

## 二、Prometheus环境搭建

### 1、实验环境准备

这里的演示环境是3台centos7

![](./images/2.png)

#### 1.1设置固定ip

```
#配置固定ip
nmtui
```

#### 1.2配置主机名

```
#配置主机名
hostnamectl  set-hostname server
```

#### 1.3安装npt时间同步服务

```
yum stall ntp -y

systemctl restart ntpd

systemctl enable ntpd
```

#### 1.4关闭防火墙

```
systemctl stop firewalld

systemctl disable firewalld

iptables -F

#vim /etc/selinux/config\
SELINUX=disabled
```

配置后重启3台服务器

### 2、安装Prometheus

#### 2.1下载prometheus

[https://prometheus.io/download/#prometheus/](https://prometheus.io/download/#prometheus)

| Prometheus版本    | 版本       | 注释 |
| ----------------- | ---------- | ---- |
| Pre-release(beta) | 测试版     |      |
| release           | 最新版     | 学习 |
| LTS               | 长期稳定版 | 生产 |

这里下载release版本学习

![](./images/8.png)

#### 2.2安装

```
#解压
tar -xf prometheus-2.54.1.linux-amd64.tar.gz  -C /usr/local/

#更改目录名
mv /usr/local/prometheus-2.54.1.linux-amd64/ /usr/local/prometheus

#加载配置文件运行
/usr/local/prometheus/prometheus --config.file="/usr/local/prometheus/prometheus.yml" &

#添加使用nohub命令来监控运行状态,nohub会在当前目录下生成一个nohup.out日志文件，便于排查问题
nohub /usr/local/prometheus/prometheus --config.file="/usr/local/prometheus/prometheus.yml" &
```

#### 2.3访问

检查Prometheus是否在运行

```
[root@server prometheus]# netstat -tunlp|grep prometheus
tcp6       0      0 :::9090                 :::*                    LISTEN      7095/prometheus
```

浏览器访问ip:9090

![](./images/3.png)

#### 2.4查看配置信息

选择status的targets，查看Prometheus的运行状态

![](./images/4.png)

#### 2.5测试

添加一个监控cpu参数：process_cpu_seconds_total

![](./images/5.png)

点击graph查看运行状态图

![](./images/7.png)

### 3、监控远程Linux主机

#### 3.1下载node_exporter

[https://prometheus.io/download/#node_exporter](https://prometheus.io/download/#node_exporter)

![](./images/9.png)

#### 3.2安装

```
#解压
tar -xf node_exporter-1.8.2.linux-amd64.tar.gz  -C /usr/local/

#更改目录名
mv /usr/local/node_exporter-1.8.2.linux-amd64/ /usr/local/node_exporter

#运行
/usr/local/node_exporter/node_exporter &
```

#### 3.3访问

检查node_exporter是否在运行

```
[root@agent node_exporter]# netstat -tunlp|grep node_exporter
tcp6       0      0 :::9100                 :::*                    LISTEN      15196/node_exporter
```

浏览器访问ip:9100

![](./images/10.png)

#### 3.4查看运行状态

点击上图中的metrics，获取node_exporter运行状态

![](./images/11.png)

### 4、监控远程windows主机

#### 4.1下载windows_exporter

[https://github.com/prometheus-community/windows_exporter](https://github.com/prometheus-community/windows_exporter)

msi版本安装程序会将windows_exporter设置为 Windows 服务

![](./images/48.png)

#### 4.2安装并配置防火墙规则

管理员权限安装

配置防护墙规则

```
netsh advfirewall firewall add rule name="windows_expoter" dir=in action=allow protocol=TCP localport=9182
```

#### 4.3访问

cmd查看是否有监听端口

```
netstat -ano| findstr "9182"
```

#### 4.4重新配置Prometheus

- /usr/local/prometheus/prometheus.yml末尾添加如下内容

```
  - job_name: "win10"
    static_configs:
      - targets: ["192.168.8.109:9182"]
```

- 重启Prometheus生效

```
jobs

kill %1

/usr/local/prometheus/prometheus --config.file="/usr/local/prometheus/prometheus.yml" &
```

#### 4.5grafana添加windows主机

[https://grafana.com/grafana/dashboards/](https://grafana.com/grafana/dashboards/)

下载合适的windows监控模板，导入后即可查看

![](./images/49.png)

#### 4.6 Prometheus后台占用

内存占用20M作用

![](./images/50.png)

### 5、重新配置Prometheus

#### 5.1结束Prometheus后台任务

```
[root@server prometheus]# jobs
[1]+  Running                 nohup /usr/local/prometheus/prometheus --config.file="/usr/local/prometheus/prometheus.yml" &

[root@server prometheus]# kill %1
```

#### 5.2修改Prometheus配置文件

修改prometheus.yml末尾，改为如下内容

```
# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "prometheus"

    static_configs:
      - targets: ["192.168.8.61:9090"]

  - job_name: "agent"
    static_configs:
      - targets: ["192.168.8.62:9100"]
```

#### 5.3重新启动Prometheus

```
/usr/local/prometheus/prometheus --config.file="/usr/local/prometheus/prometheus.yml" &
```

#### 5.4访问配置监控信息

浏览器登陆ip:9090，查看targets，出现两个监控目标，状态为up

![](./images/12.png)

添加一个内存监控参数，查看出现agent和Prometheus两个目标

![](./images/13.png)

选择不同的目标，出现不一样的监控信息

![](./images/14.png)

![](./images/15.png)

### 6、远程监控Mysql服务器

mariadb和mysql操作基本相同，这里用mariadb演示

#### 6.1安装mariadb

```
#检查是否安装mariadb
rpm -aq|grep mariadb

#删除已经安装的mariadb
rpm -e mariadb-libs-5.5.68-1.el7.x86_64  --nodeps

#安装mariadb
yum install mariadb-server -y

#配置开机自启
systemctl enable mariadb

#启动
systemctl start mariadb

#进入mariadb，默认没有密码，回车直接进入
mysql -uroot -p

#查看数据库
show databases;
```

#### 6.2数据库授权

- 创建数据访问授权账户

```sql
grant all ON *.* to 'mysql_monitor'@'%' identified by '123';

#如果后面Prometheus无法获取数据，可以修改账户
grant all ON *.* to 'mysql_monitor'@'localhost' identified by '123';
```

* 刷新权限

```sql
flush privileges;
```

* 退出

```sql
exit
```

#### 6.3安装mysqld_exporter

- 下载mysqld_exporter

[https://prometheus.io/download/#mysqld_exporter](https://prometheus.io/download/#mysqld_exporter)

![](./images/16.png)

* 安装

```
tar -xf mysqld_exporter-0.15.1.linux-amd64.tar.gz -C /usr/local/

mv /usr/local/mysqld_exporter-0.15.1.linux-amd64/ /usr/local/mysqld_exporter
```

#### 6.4创建连接mariadb配置文件

新建一个.my.cnf配置文件，输入数据库访问的账号和密码

```
[root@agent mysqld_exporter]# cat /usr/local/mysqld_exporter/.my.cnf
[client]
user=mysql_monitor
password=123
```

#### 6.5启动mysqld_exporter

```
#启动
nohup/usr/local/mysqld_exporter/mysqld_exporter --config.my-cnf="/usr/local/mysqld_exporter/.my.cnf" &

#查看服务的状态信息和端口
cat nohub.out

#查看服务
[root@agent mysqld_exporter]# netstat -ntlup |grep 9104
tcp6       0      0 :::9104                 :::*                    LISTEN      2848/mysqld_exporte
```

#### 6.6查看运行状态

浏览器登陆ip:9104

![](./images/17.png)

![](./images/18.png)

#### 6.7重新配置Prometheus

- 结束Prometheus进程

```
[root@server ~]# jobs
[1]+  Running                 /usr/local/prometheus/prometheus --config.file="/usr/local/prometheus/prometheus.yml" &
[root@server ~]# kill %1
```

* 修改Prometheus配置文件

/usr/local/prometheus/prometheus.yml 配置文件末尾增加mariadb项

```
# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "prometheus"

    static_configs:
      - targets: ["192.168.8.61:9090"]

  - job_name: "agent"
    static_configs:
      - targets: ["192.168.8.62:9100"]

  - job_name: "mariadb"
    static_configs:
      - targets: ["192.168.8.62:9104"]
```

* 重新启动Prometheus

```
nohup /usr/local/prometheus/prometheus --config.file="/usr/local/prometheus/prometheus.yml" &
```

#### 6.8查看Prometheus运行状态

如图示，已经出现mariadb的监控目标

![](./images/19.png)

## 三、Grafana数据可视化

### 1、Grafana介绍

Grafana是一个开源的度量分析和可视化工具，可以通过将采集的数据分析，查询，然后进行可视化的展示，并能实现报警

![](./images/20.png)

### 2、Grafana安装与登陆

#### 2.1下载

选择self-managed版本的download

![](./images/21.png)

选择oss社区版的centos版本，这个链接可以离线下载，也可在线安装

![](./images/22.png)

#### 2.2安装grafana

```
yum install ./grafana-11.2.1-1.x86_64.rpm -y
```

#### 2.3启动

```
#开机启动
systemctl enable grafana-server

#启动
systemctl start grafana-server

#端口验证
[root@grafana ~]# netstat -ntlup |grep 3000
tcp6       0      0 :::3000                 :::*                    LISTEN      26533/grafana

#软件名称过滤
[root@grafana ~]# netstat -ntlup |grep grafana
tcp6       0      0 :::3000                 :::*                    LISTEN      26533/grafana
```

2.4登陆

浏览器ip:3000，默认账号密码均为admin

![](./images/23.png)

首次登陆需要改密码，为方便测试，这里改为123456

![](./images/24.png)

登陆成功

![](./images/25.png)

### 3、设置Prometheus为Grafana数据源

3.1在Grafana中添加Prometheus

![](./images/26.png)

![](./images/27.png)

添加Prometheus的ip和端口，获取数据的方式为get

![](./images/28.png)

![](./images/29.png)

点击设置和测试后，添加完成

![](./images/30.png)

### 4、Grafana实现自定义监控CPU负载

#### 4.1新建一个面板

![](./images/31.png)

![](./images/32.png)

选择数据源

![](./images/33.png)

#### 4.2配置面板参数

修改面板名称为CPU Load

添加一个node_load1，监控cpu1分钟的平均负载

任务类型为job

监控目标为agent

最后点击 run queries 运行，生成有数据的面板

![](./images/34.png)

![](./images/35.png)

点击右上角的apply生效

点击edit返回来继续编辑

![](./images/36.png)

添加add query增加查询内容，这里再添加cpu平均5分钟和15分钟的数据，可自由选择数据的时间区间，最后save保存

![](./images/37.png)

![](./images/38.png)

![](./images/39.png)

![](./images/40.png)

#### 4.3使用grafana模板

选择import

![](./images/41.png)

打开grafana官网提供模板链接，添加一个模板id

[https://grafana.com/grafana/dashboards/](https://grafana.com/grafana/dashboards/)

![](./images/42.png)

![](./images/43.png)

点击粘贴板，获取模板id

![](./images/44.png)

粘贴后，选择laod载入![](./images/45.png)

添加Prometheus数据源后导入

![](./images/46.png)

导入模板完成，可以在这个模板的基础上修改为自己想要的展示面板

![](./images/47.png)