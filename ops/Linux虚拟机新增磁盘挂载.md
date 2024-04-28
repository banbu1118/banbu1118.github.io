* 查看磁盘是否挂载

```bash
#查看磁盘是否挂载
lsblk

#注意：新添加的磁盘需要重启虚拟机才能显示添加成功
```

* 分区

```bash
#使用cfdisk或fdisk进行分区
fdisk /dev/sdb

#开始对/sdb 分区
m    显示命令列表
p    显示磁盘分区 同 fdisk l
n    新增分区
d    删除分区
w    写入并退出
 说明： 开始分区后输入 n，新增分区，然后选择 p ，分区类型为主分区。两次回车默认剩余全部空间。最后输入 w
写入分区并退出，若不保存退出输入 q
```

* 格式化分区

```bash
#lsblk -f 查看分区相关信息，分区没格式化还不能用
root@debian:~# lsblk  -f
NAME   FSTYPE FSVER LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINTS
sda
sda1 ext4   1.0         229516e6-3292-4450-ad60-a875f6c86f63   84.5G     8% /
sda2
sda5 swap   1           f34e6bd4-4bf6-4968-9f2d-53492d01abdc                [SWAP]
sdb
sdb1                    #没有发现唯一的40位标识符，说明没有被格式化
sr0


#分配40位唯一标识符，格式化分区
mkfs -t ext4 /dev/sdb1

#lsblk -f查看是否格式化完成
root@debian:~# lsblk  -f
NAME   FSTYPE FSVER LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINTS
sda
sda1 ext4   1.0         229516e6-3292-4450-ad60-a875f6c86f63   84.5G     8% /
sda2
sda5 swap   1           f34e6bd4-4bf6-4968-9f2d-53492d01abdc                [SWAP]
sdb
sdb1 ext4   1.0         e65cfa9d-9f00-4352-a0d1-033576b545d4            #已生成有唯一标识符
sr0
```

* 挂载

```bash
#临时挂载
#新建目录命令
mkdir /kk

#提升权限（选做）
chmod 777 /kk

#挂载
mount /dev/sdb1 /kk/

##永久挂载
nano /etc/fstab

#末尾添加一行
/dev/sdb1    /kk    ext4    defaults    0    0
```

* 使用UUID自动挂载

```bash
#末尾添加一行
nano /etc/fstab
UUID=e65cfa9d-9f00-4352-a0d1-033576b545d4	/kk ext4 defaults 0 0
```


