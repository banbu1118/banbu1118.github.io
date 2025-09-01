* 磁盘扩容时需要删除恢复分区才能操作

```powershell
#管理员权限执行cmd
#启用diskpart工具
diskpart

#查看磁盘
list disk

#选择需要操作的磁盘
select disk 0

#查看分区
list partition

#选择需要操作的分区
select partition 3

#删除分区
delete partition override

#退出
exit
```

