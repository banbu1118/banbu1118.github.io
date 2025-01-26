## Proxmox api调试

### 一、准备环境

服务器：1台pve服务器

api工具： Hoppscotch 

Hoppscotch下载链接：[https://hoppscotch.com/download](https://hoppscotch.com/download)

远程调试主机：win10环境

proxmox api官网教程：[https://pve.proxmox.com/pve-docs/api-viewer/index.html](https://pve.proxmox.com/pve-docs/api-viewer/index.html)

proxmox api官方说明：[https://pve.proxmox.com/wiki/Proxmox_VE_API](https://pve.proxmox.com/wiki/Proxmox_VE_API)

### 二、获取Ticket Cookie

#### 2.1 取消ssl认证

设置调整为中文，并取消ssl认证

![](./images/k1.png)

#### 2.2 使用curl获取Ticket Cookie

```
curl -k -X POST "https://192.168.1.15:8006/api2/json/access/ticket" -d "username=root@pam&password=123456"
```

#### 2.3 使用hoppscotch获取Ticket Cookie

Ticket Cookie两小时后失效

![](./images/1.png)


#### 2.4 使用永久api令牌认证(不推荐)

创建api令牌，hh是用户名称，0表示特权用户

```
pveum user token add root@pam hh --privsep 0
```

使用api令牌登录

![](./images/6.png)

#### 2.5 转化为其他代码

显示代码

![](./images/k2.png)


选择时候的语言环境

![](./images/k3.png)

### 三、使用api获取信息

利用获取的cookie和token进行get和post

注意cookic的值前面要添加“PVEAuthCookie=”

#### 3.1 获取节点信息

```
https://192.168.1.15:8006/api2/json/nodes
```
![](./images/2.png)

#### 3.2 获取存储信息

```
https://192.168.1.15:8006/api2/json/storage
```

![](./images/3.png)

#### 3.3 获取虚拟机信息

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu
```

![](./images/4.png)

#### 3.4 获取虚拟机配置

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/203/config
```
![](./images/5.png)





### 四、使用post提交信息

#### 4.1 克隆新的虚拟机

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/107/clone
```

![](./images/7.png)

#### 4.2 虚拟机转换为模板

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/805/template
```

![](./images/8.png)

#### 4.3 删除虚拟机

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/888
```

### 五、常见操作

![](./images/9.png)

#### 5.1 开启虚拟机

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/status/start
```

![](./images/10.png)

#### 5.2 关闭虚拟机

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/status/shutdown
```

![](./images/11.png)

#### 5.3 停止虚拟机

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/status/stop
```

![](./images/12.png)

#### 5.4 重启虚拟机

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/status/reboot
```

![](./images/13.png)

#### 5.5 重置虚拟机

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/status/reset
```

![](./images/14.png)

#### 5.6 暂停虚拟机

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/status/suspend
```

![](./images/15.png)

#### 5.7 恢复虚拟机

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/status/resume
```

![](./images/16.png)

#### 5.8 当前虚拟机状态

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/status/current
```

![](./images/17.png)

### 六、agent api

#### 6.1 exec执行命令

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/exec
```

![](./images/18.png)

#### 6.2 file-write文件写入内容

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/file-write
```

![](./images/19.png)

#### 6.3 file-read 读取文件内容

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/file-read
```

![](./images/20.png)

#### 6.4 冻结文件系统状态

文件系统冻结后，虚拟机内的文件系统会变得静止，数据不会发生变化，直到文件系统解冻。

这个操作常常用于创建一致的快照或备份，确保文件系统数据一致性。

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/fsfreeze-freeze
```

![](./images/21.png)

#### 6.5 取消冻结状态

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/fsfreeze-thaw
```

![](./images/22.png)

#### 6.6 查看冻结状态

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/fsfreeze-status
```

![](./images/23.png)

#### 6.8  fstrim SSD优化

效果待定

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/fstrim
```

![](./images/24.png)

#### 6.9 获取文件系统信息

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/get-osinfo
```

![](./images/25.png)

#### 6.10 获取主机名

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/123/agent/get-host-name
```

![](./images/26.png)

#### 6.11 获取虚拟机内存块信息

测试发现windows无效

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/get-memory-block-info
```

![](./images/27.png)

#### 6.12 获取虚拟机内存信息

测试发现windows无效

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/get-memory-blocks
```

![](./images/28.png)

#### 6.13 获取系统信息

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/get-osinfo
```

![](./images/29.png)

#### 6.14 获取虚拟机时间戳

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/get-time
```

![](./images/30.png)

#### 6.15 获取虚拟机时区

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/get-timezone
```

![](./images/31.png)

#### 6.16 获取虚拟机用户

用户在web界面登录才能获取到信息

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/123/agent/get-users
```

![](./images/32.png)

#### 6.17 获取vcpu

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/get-vcpus
```

![](./images/33.png)

#### 6.18 获取虚拟机信息

不知道这个干啥的。。。

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/info
```

![](./images/34.png)

#### 6.19 获取网络信息

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/network-get-interfaces
```

![](./images/35.png)

#### 6.20 ping

不知道怎么使用

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/ping
```

![](./images/36.png)

#### 6.21 修改虚拟机用户密码

windows和Linux够都支持

测试只能修改本地用户，不能修改域用户

```
https://192.168.1.15:8006/api2/json/nodes/t3680/qemu/124/agent/set-user-password
```

![](./images/37.png)

#### 6.22 关闭虚拟机

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/135/agent/shutdown
```

![](./images/38.png)

#### 6.23 冻结磁盘

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/135/agent/suspend-disk
```

![](./images/39.png)

#### 6.24 挂起虚拟机

混合挂起模式用于将虚拟机的内存、CPU 和磁盘状态都保存到磁盘上，同时冻结磁盘 I/O 操作。

这样，当虚拟机稍后恢复时，能够从挂起的状态恢复，并且数据不会丢失，系统能够继续运行 

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/136/agent/suspend-hybrid
```

需要用resume恢复

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/135/status/resume
```

![](./images/40.png)

#### 6.25 挂起虚拟机

这个 API 会通过 QEMU Guest Agent 向虚拟机发送暂停内存的命令，即将虚拟机的内存状态保存在磁盘上，并冻结虚拟机的操作。

暂停的虚拟机不会进行任何计算或磁盘操作，直到恢复。

虚拟机的内存、CPU 状态会被保存，而磁盘 I/O 操作将被冻结。 

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/135/agent/suspend-ram
```

需要用resume恢复

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/135/status/resume
```

![](./images/41.png)

#### 6.26 创建虚拟机

使用api创建虚拟机，配置参数参考/etc/pve/qemu-server/142.conf

```shell
root@pve3:~# cat /etc/pve/qemu-server/142.conf 
agent: 1
audio0: device=ich9-intel-hda,driver=none
balloon: 0
bios: ovmf
boot: order=scsi0;ide0;ide2;net0
cores: 4
cpu: host
efidisk0: local-lvm:vm-142-disk-0,efitype=4m,pre-enrolled-keys=1,size=4M
ide0: none,media=cdrom
ide2: none,media=cdrom
machine: pc-q35-7.2
memory: 2048
meta: creation-qemu=9.0.2,ctime=1736912319
name: vm-test
net0: virtio=BC:24:11:C5:D3:D8,bridge=vmbr0,firewall=1
numa: 0
ostype: win10
scsi0: local-lvm:vm-142-disk-1,iothread=1,size=100G
scsihw: virtio-scsi-single
smbios1: uuid=e6ec9f32-f842-43f9-9c6d-18e4d3a0ff00
sockets: 1
usb0: spice,usb3=1
usb1: spice,usb3=1
usb2: spice,usb3=1
usb3: spice,usb3=1
vga: virtio
vmgenid: 7e7763d4-0e06-4eb0-9c61-2147d6eacfd8
```

api创建参数

```shell
agent: 1
balloon: 0
bios: ovmf
boot: order=scsi0;ide0;ide2;net0
cores: 4
cpu: host
ide0: none,media=cdrom
ide2: none,media=cdrom
machine: pc-q35-7.2
memory: 2048
name: vm-test-cli
numa: 0
ostype: win10
efidisk0: "local-lvm:vm-142-disk-0,efitype=4m,pre-enrolled-keys=1,size=4M"
scsi0: "local-lvm:vm-142-disk-1,iothread=1,size=100G"
scsihw: virtio-scsi-single
sockets: 1
vga: virtio
usb0: spice,usb3=1
usb1: spice,usb3=1
usb2: spice,usb3=1
usb3: spice,usb3=1
audio0: device=ich9-intel-hda,driver=none
net0: "virtio=BC:24:11:5B:88:DE,bridge=vmbr0,firewall=1"
vmid: 160
```

api 创建测试

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu
```

![](./images/k8.png)

![](./images/k9.png)

#### 6.27 销毁虚拟机

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/158
```

![](./images/k10.png)

### 七、cloudinit

#### 7.1 cloudinitial dump

导出cloudinit信息，支持导出 meta     network  user 这3个参数信息

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/137/cloudinit/dump
```

![](./images/42.png)


#### 7.2 重新生成cloutinit镜像

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/137/cloudinit
```

![](./images/k6.png)

### 八、snapshot快照

#### 8.1 获取快照信息

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/1017/snapshot
```

![](./images/43.png)

#### 8.2 获取快照点配置

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/1017/snapshot/Milestone/config
```

![](./images/44.png)

#### 8.3 回滚快照点

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/1017/snapshot/Milestone/rollback
```

![](./images/45.png)

### 九、vmid

#### 9.1 获取虚拟机配置

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/135/config
```

![](./images/46.png)

#### 9.2 获取虚拟机迁移信息

```javascript
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/137/migrate
```

![](./images/47.png)

#### 9.3 monitor

不确认这个命令的用途，这里测试了stop命令

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/137/monitor
```

![](./images/48.png)

#### 9.4 迁移磁盘

Move volume to different storage or to a different VM.

```
HTTP:   	POST /api2/json/nodes/{node}/qemu/{vmid}/move_disk
```

#### 9.5 公网迁移虚拟机

Migration tunnel endpoint - only for internal use by VM migration.

```
HTTP:   	POST /api2/json/nodes/{node}/qemu/{vmid}/mtunnel
```

#### 9.6 迁移

Path: /nodes/{node}/qemu/{vmid}/mtunnelwebsocket
Migration tunnel endpoint for websocket upgrade - only for internal use by VM migration.

```
HTTP:   	GET /api2/json/nodes/{node}/qemu/{vmid}/mtunnelwebsocket
```

#### 9.7 获取虚拟机配置和任务查询

获取虚拟机配置和查询指定虚拟机在指定节点上的待处理任务或操作 

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/137/pending
```

![](./images/49.png)

#### 9.8 迁移虚拟机到其他集群

Migrate virtual machine to a remote cluster. Creates a new migration task. EXPERIMENTAL feature!

```
HTTP:   	POST /api2/json/nodes/{node}/qemu/{vmid}/remote_migrate
```

#### 9.9 扩展磁盘大小

注意，这种方法仅适用于扩展磁盘，不能缩小磁盘。 

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/135/resize
```

![](./images/50.png)

#### 9.10 获取虚拟机性能数据 

返回图片，但不知道怎么转化为图片

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/135/rrd
```

![](./images/51.png)

#### 9.11 获取虚拟机性能数据 

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/135/rrddata
```

![](./images/52.png)

#### 9.12 模拟键盘输入

这个 API 允许你模拟按键事件，通常用于远程控制虚拟机 

这里演示发送ctrl-alt-delete重启命令

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/135/sendkey
```

![](./images/53.png)

发送tab键

![](./images/54.png)

#### 9.13 返回spice配置

可以增加一个spice代理服务配置，实现网关的效果，不确定，没有测试过

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/136/spiceproxy
```

![](./images/55.png)

#### 9.14 转化为模板

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/136/template
```

![](./images/56.png)

#### 9.15 移除镜像挂载

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/136/unlink
```

![](./images/57.png)

在开机状态不会生效，等虚拟机关机才会生效

![](./images/58.png)

#### 9.16 vnc代理

Creates a TCP VNC proxy connections. 

```
HTTP:   	POST /api2/json/nodes/{node}/qemu/{vmid}/vncproxy
```

#### 9.17  vncwebsocket 

Opens a weksocket for VNC traffic.

```
HTTP:   	GET /api2/json/nodes/{node}/qemu/{vmid}/vncwebsocket
```

#### 9.18 销毁虚拟机

```
https://192.168.1.16:8006/api2/json/nodes/pve3/qemu/142
```

![](./images/k7.png)

### 10、access访问授权

#### 10.1 查看领域认证

领域为pve

```
https://192.168.1.16:8006/api2/json/access/domains/pve
```

![](./images/59.png)

领域为pam

```
https://192.168.1.16:8006/api2/json/access/domains/pam
```

![](./images/60.png)

领域为ad

![](./images/61.png)

领域为ldap、openid待测试

#### 10.2 添加领域认证

这里添加ad域认证

```
https://192.168.1.16:8006/api2/json/access/domains
```

![](./images/64.png)

#### 10.3 删除领域信息

```
https://192.168.1.16:8006/api2/json/access/domains/ad
```

![](./images/65.png)

#### 10.4 同步ad用户和组

使用api同步用户和组信息

```
https://192.168.1.16:8006/api2/json/access/domains/ad/sync
```

![](./images/62.png)

#### 10.5 查看群组信息

```
https://192.168.1.16:8006/api2/json/access/groups
```

![](./images/63.png)

#### 10.6 创建组

```
https://192.168.1.16:8006/api2/json/access/groups
```

![](./images/66.png)

#### 10.7 获取组信息

```
https://192.168.1.16:8006/api2/json/access/groups/kk
```

![](./images/67.png)

#### 10.8 更新组信息

```
https://192.168.1.16:8006/api2/json/access/groups/kk
```

![](./images/68.png)

#### 10.9 删除组

```
https://192.168.1.16:8006/api2/json/access/groups/kk
```

![](./images/69.png)

#### 10.10 获取openid信息

Directory index.

```
HTTP:   	GET /api2/json/access/openid
```

#### 10.11 获取openid认证网址

Get the OpenId Authorization Url for the specified realm. 

```
HTTP:   	POST /api2/json/access/openid/auth-url
```

#### 10.12 校验openid认证

Verify OpenID authorization code and create a ticket. 

```
HTTP:   	POST /api2/json/access/openid/login
```

#### 10.13 获取角色信息

```
https://192.168.1.16:8006/api2/json/access/roles
```

![](./images/70.png)

#### 10.14 创建新角色

```
https://192.168.1.16:8006/api2/json/access/roles
```

![](./images/71.png)

#### 10.15 查看角色具体信息

```
https://192.168.1.16:8006/api2/json/access/roles/kkk
```

![](./images/72.png)

#### 10.16 增加角色权限

```
https://192.168.1.16:8006/api2/json/access/roles/kkk
```

![](./images/73.png)

#### 10.17 删除角色

```
https://192.168.1.16:8006/api2/json/access/roles/kkk
```

![](./images/74.png)

#### 10.18 获取二次验证信息

 List TFA configurations of users. 

```
HTTP:   	GET /api2/json/access/tfa
```

#### 10.19 查看二次验证用户信息

 List TFA configurations of users. 

```
HTTP:   	GET /api2/json/access/tfa/{userid}
```

#### 10.20 增加TFA

Add a TFA entry for a user.

```
HTTP:   	POST /api2/json/access/tfa/{userid}
```

#### 10.21 获取TFA条目

Fetch a requested TFA entry if present.

```
HTTP:   	GET /api2/json/access/tfa/{userid}/{id}
```

#### 10.22 增加TFA

 Add a TFA entry for a user. 

```
HTTP:   	PUT /api2/json/access/tfa/{userid}/{id}
```

#### 10.23 删除TFA

Delete a TFA entry by ID. 

```
HTTP:   	DELETE /api2/json/access/tfa/{userid}/{id}
```

#### 10.24 获取用户信息

```
https://192.168.1.16:8006/api2/json/access/users
```

![](./images/75.png)

#### 10.25 创建新用户

```
https://192.168.1.16:8006/api2/json/access/users
```

![](./images/76.png)

#### 10.26 获取用户信息

```
https://192.168.1.16:8006/api2/json/access/users/kk@pam
```

![](./images/77.png)

#### 10.27 更新用户信息

```
https://192.168.1.16:8006/api2/json/access/users/kk@pam
```

![](./images/78.png)

#### 10.28 删除用户

```
https://192.168.1.16:8006/api2/json/access/users/kk@pam
```

![](./images/79.png)

#### 10.29 获取apitoken

```
https://192.168.1.16:8006/api2/json/access/users/user01@ad/token
```

![](./images/80.png)

#### 10.30 获取特殊的api token信息

Get specific API token information. 

```
HTTP:   	GET /api2/json/access/users/{userid}/token/{tokenid}
```

#### 10.31 生成新api token

Generate a new API token for a specific user. NOTE: returns API token  value, which needs to be stored as it cannot be retrieved afterwards! 

```
HTTP:   	POST /api2/json/access/users/{userid}/token/{tokenid}
```

#### 10.32 更新用户api

Update API token for a specific user. 

```
HTTP:   	PUT /api2/json/access/users/{userid}/token/{tokenid}
```

#### 10.32 删除用户token

Remove API token for a specific user. 

```
HTTP:   	DELETE /api2/json/access/users/{userid}/token/{tokenid}
```

#### 10.33 获取用户TFA类型

Get user TFA types (Personal and Realm). 

```
HTTP:   	GET /api2/json/access/users/{userid}/tfa
```

#### 10.34 解锁用户TFA认证

Unlock a user's TFA authentication. 

```
HTTP:   	PUT /api2/json/access/users/{userid}/unlock-tfa
```

#### 10.35 ACl

Get Access Control List (ACLs). 

```
HTTP:   	GET /api2/json/access/acl
```

#### 10.36 变更ACL列表

Update Access Control List (add or remove permissions). 

```
HTTP:   	PUT /api2/json/access/acl
```

#### 10.37 改变用户密码

```
https://192.168.1.16:8006/api2/json/access/password
```

![](./images/k11.png)

#### 10.38  获取给定用户或令牌的访问权限

```
https://192.168.1.16:8006/api2/json/access/permissions
```

![](./images/81.png)

#### 10.39 获取票据信息

Dummy. Useful for formatters which want to provide a login page. 

```
HTTP:   	GET /api2/json/access/ticket
```

#### 10.30 创建或修改票据

```
https://192.168.1.16:8006/api2/json/access/ticket
```

![](./images/82.png)

### 十一、 Cluster  

#### 11.1 获取cluster信息

```
https://192.168.1.16:8006/api2/json/cluster
```

![](./images/83.png)

#### 11.2 创建cluster集群

必须使用票据才能操作

```
https://192.168.1.94:8006/api2/json/cluster/config
```

![](./images/84.png)

#### 11.3 获取cluster集群配置

```
https://192.168.1.94:8006/api2/json/cluster/config
```

![](./images/85.png)

#### 11.4 获取集群加入信息

```
https://192.168.1.94:8006/api2/json/cluster/config/join
```

![](./images/86.png)

#### 11.5 加入集群

必须使用票据认证才能加入

```
https://192.168.1.95:8006/api2/json/cluster/config/join
```

![](./images/87.png)

#### 11.6 获取pve集群节点信息

```
https://192.168.1.94:8006/api2/json/cluster/config/nodes
```

![](./images/88.png)

11.7 
