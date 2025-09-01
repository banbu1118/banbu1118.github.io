* 前言

```bash
#最好确保离线环境和联网环境一致，防止出现依赖关系问题
```

* 联网环境下载包

```bash
#下载包及其依赖关系，下载的包默认保存在/var/cache/apt/archives中，和以前下载的包一起，不容易分辨，不推荐这个命令
#apt install -d + 安装包名称

#下载包及其依赖关系到指定目录（推荐使用这个）
#创建一个下载目录，这里在根目录创建kk目录
mkdir /kk

#下载包到kk目录
apt install -d -o=dir::cache=/kk + 安装包名称
```

* 拷贝文件到离线设备

```bash
#拷贝kk文件夹到离线设备
```

* 离线环境执行安装操作

```bash
#进去kk/archives目录执行安装
apt install ./*deb

#或者执行
dpkg -i *deb

#apt校验依赖关系后安装（推荐）
#dpkg不会检查依赖关系，直接覆盖安装
```
