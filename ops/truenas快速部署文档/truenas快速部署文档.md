## 前言

```shell
TrueNAS 是一个开源的存储操作系统，它基于 FreeBSD 平台，专注于提供可靠的网络存储解决方案。
TrueNAS 主要用于构建和管理存储服务器，支持多种存储协议和功能，如文件共享、数据备份、虚拟化存储、容器存储等。
它提供了强大的管理界面和数据管理工具，适用于各种规模的企业和个人用户。
```

### 1.下载truenas模板

```shell
pve下载并导入truenas模板
https://share.weiyun.com/UPhaO256
```

### 2.完整克隆一个truenas虚拟机

```shell
推荐完整克隆
```

![](./images/2.png)

### 3.给虚拟机添加一个磁盘

```shell
这磁盘将用户存储服务，请提前确认好容量
```

![](./images/3.png)

### 4.浏览器输入ip登录

```shell
登录管理员账户
admin/admin
```

![](./images/4.png)

### 5.添加存储池

```shell
选择左侧的存储，创建存储池
```

![](./images/5.png)
</br>
![](./images/6.png)
</br>
![](./images/7.png)
</br>
![](./images/8.png)
</br>
![](./images/9.png)
</br>
![](./images/10.png)
</br>
![](./images/11.png)
</br>
![](./images/12.png)
</br>
![](./images/13.png)

### 6.创建数据集

```shell
创建3个数据集
先创建1个dataset数据集
选中dataset数据集，分别再创建public和share数据集
```

![](./images/14.png)
</br>
![](./images/15.png)
</br>
![](./images/20.png)

### 7.创建用户组和用户

```shell
先创建user用户组
然后创建steacher和student两个账户，从属于user用户组
```

![](./images/16.png)
</br>
![](./images/17.png)
</br>
![](./images/18.png)

### 8.数据集配置用户权限

```shell
dataset下有public和share两个目录
给teacher用户配置public和share两个目录读取写入权限
给student用户配置publib读取写入权限，share读取权限
将pubic和share目录配置权限如下图所示
```

![](./images/21.png)
</br>
![](./images/22.png)
</br>
![](./images/23.png)
</br>
![](./images/24.png)

### 9.添加SMB服务

```shell
启用SMB共享服务
```

![](./images/25.png)

### 10.win10配置SMB访问

```shell
在两台pc分配配置登录信息

```

![](./images/26.png)
</br>
![](./images/27.png)
</br>
![](./images/28.png)

### 11.验证访问权限

```shell
使用两个账号分别在public和share目录创建文件验证

```

![](./images/29.png)
</br>
![](./images/30.png)

