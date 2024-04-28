* local-lvm改目录存储，提升运行速度

```bash
#实测pve7和8都行
pvesh delete /storage/local-lvm

umount /dev/pve/data

lvremove /dev/pve/data -y

vgdisplay pve | grep Free | awk '{print "lvcreate -l " $5 " -n data pve -y"}' |bash

mkfs.ext4 /dev/pve/data
mkdir /mnt/data
mount /dev/pve/data /mnt/data

echo "/dev/pve/data /mnt/data ext4 defaults 0 0" >> /etc/fstab

pvesm add dir data --path=/mnt/data
```

* 详情参考链接

[Proxmox的local-lvm改文件存储，提升运行速度](https://www.cnblogs.com/doracloud/p/16874171.html)
