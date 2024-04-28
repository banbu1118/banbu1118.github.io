```bash
#!/bin/bash

# Backup original sources.list
if [ -e /etc/apt/sources.list ];
then cp /etc/apt/sources.list /etc/apt/sources.list.bak
fi

# Backup pve-no-subscription.list
if [ -e /etc/apt/sources.list.d/pve-no-subscription.list ];
then cp /etc/apt/sources.list.d/pve-no-subscription.list /etc/apt/sources.list.d/pve-no-subscription.list.bak
fi

# Backup pve-enterprise.list
if [ -e /etc/apt/sources.list.d/pve-enterprise.list ];
then cp /etc/apt/sources.list.d/pve-enterprise.list /etc/apt/sources.list.d/pve-enterprise.list.bak
fi

# Backup ceph.list
if [ -e /etc/apt/sources.list.d/ceph.list ];
then cp /etc/apt/sources.list.d/ceph.list /etc/apt/sources.list.d/ceph.list.bak
fi

# Backup pveceph.pm
if [ -e /usr/share/perl5/PVE/CLI/pveceph.pm ];
then cp /usr/share/perl5/PVE/CLI/pveceph.pm /usr/share/perl5/PVE/CLI/pveceph.pm.bak
fi


# Determine Proxmox VE version
pve_version=$(pveversion|awk -F '/' '{print $2}'|cut -c1)


#prohibit pve-enterprise
sed -i '1s/^/# /'  /etc/apt/sources.list.d/pve-enterprise.list

# Update sources.list with ustc mirror based on the detected Proxmox VE version
if [[ $pve_version == "7" ]]; then
echo "
deb https://mirrors.ustc.edu.cn/debian bullseye main contrib
deb https://mirrors.ustc.edu.cn/debian bullseye-updates main contrib
# security updates
deb https://mirrors.ustc.edu.cn/debian-security bullseye-security main contrib
" > /etc/apt/sources.list

echo "
deb https://mirrors.ustc.edu.cn/proxmox/debian/pve bullseye pve-no-subscription
" >  /etc/apt/sources.list.d/pve-no-subscription.list

echo "
deb http://mirrors.ustc.edu.cn/proxmox/debian/ceph-quincy bullseye main
" > /etc/apt/sources.list.d/ceph.list

# 换中科大源，一定要修改这里，不然每次面板安装ceph时他会根据这里的配置生成 ceph.list 源文件
sed -i  "s#http://download.proxmox.com/debian#https://mirrors.ustc.edu.cn/proxmox/debian#g" /usr/share/perl5/PVE/CLI/pveceph.pm


elif [[ $pve_version == "8" ]]; then

echo "
deb https://mirrors.ustc.edu.cn/debian bookworm main contrib
deb https://mirrors.ustc.edu.cn/debian bookworm-updates main contrib
# security updates
deb https://mirrors.ustc.edu.cn/debian-security bookworm-security main contrib
" > /etc/apt/sources.list

echo "
deb https://mirrors.ustc.edu.cn/proxmox/debian/pve bookworm pve-no-subscription
" >  /etc/apt/sources.list.d/pve-no-subscription.list

echo "
deb https://mirrors.ustc.edu.cn/proxmox/debian/ceph-quincy/ bookworm no-subscription
" > /etc/apt/sources.list.d/ceph.list

# 换中科大源，一定要修改这里，不然每次面板安装ceph时他会根据这里的配置生成 ceph.list 源文件
sed -i 's|http://download.proxmox.com|https://mirrors.ustc.edu.cn/proxmox|g' /usr/share/perl5/PVE/CLI/pveceph.pm

else
    echo "Unsupported Proxmox VE version."
    exit 1
fi

# Update package index
apt update

echo "APT sources have been updated with ustc mirror for Proxmox VE $pve_version."
```
