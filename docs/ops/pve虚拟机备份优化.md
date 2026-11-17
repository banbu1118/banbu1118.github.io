## pve虚拟机备份优化

此教程的目标是尽可能降低虚拟机备份文件的大小。

### 一、虚拟机 strim

#### 基础概念

discard：允许虚拟机把这些信息传递给 PVE。

fstrim：由虚拟机操作系统告诉虚拟磁盘，哪些数据块已经不再使用。

#### Linux 虚拟机


- 磁盘开启 discard（丢弃）

- 虚拟机执行 strim 操作

```shell
#清理缓存和日志（选座）
apt clean
journalctl --rotate
journalctl --vacuum-time=1s

#执行 strim 操作
fstrim -av
sync
```

- 关闭虚拟机

- 磁盘关闭 discard

- 执行pve 控制台备份操作

#### Windows 虚拟机

- 磁盘开启 discard（丢弃）

- 虚拟机执行 strim 操作

```powershell
# 检查是否启用 TRIM，都为 0 表示启用 strim
fsutil behavior query DisableDeleteNotify

# 对C盘启用strim
Optimize-Volume -DriveLetter C -ReTrim -Verbose
```

- 关闭虚拟机

- 磁盘关闭 discard

- 执行pve 控制台备份操作

### 二、zstd 极限压缩

对上一步的 zst 备份文件进一步压缩，注意这步比较耗时，请耐心等待

```shell
zstd -d backup.vma.zst -c | zstd -22 --ultra -T0 -o backup.vma.zst.new
```

修改备份的名字会导致还原失败，需要把文件名改回去

```shell
#删除旧文件
rm backup.vma.zst

#改名
mv backup.vma.zst.new backup.vma.zst
```

### 三、实测

Linux 虚拟机备份，qcow2 为 20G，启用 strim 备份后为 700MB，zstd 极限压缩后为 500MB

Windows 虚拟机备份，qcow2 为100G，启用 strim 备份后为 6G，zstd 极限压缩后为 5G
