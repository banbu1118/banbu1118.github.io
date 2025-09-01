*   前言

```bash
#此教程可以让pve进行小版本的升级，例如，从pve7.4-3升级到pve7.4-17
#最好确保离线环境和联网环境一致，防止出现依赖关系问题
```

*   联网升级完成的pve环境

```bash
#进去apt下载包的缓存目录
cd /var/cache/apt/
```

*   拷贝文件到离线设备

```bash
#拷贝archives文件夹到离线设备的/var/cache/apt目录
```

*   离线环境执行安装操作

```bash
#进去archive文件夹，执行安装操作
apt install /var/cache/apt/archives/*deb
```

*   重启

```bash
#重启设备，完成安装
```
