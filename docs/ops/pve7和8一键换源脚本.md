```bash
#!/bin/bash

# Backup original sources.list
cp /etc/apt/sources.list /etc/apt/sources.list.bak

# Backup ceph.list
if [ -e /etc/apt/sources.list.d/ceph.list ];
then cp /etc/apt/sources.list.d/ceph.list /etc/apt/sources.list.d/ceph.list.bak
fi

# Backup pve-no-subscription.list
if [ -e /etc/apt/sources.list.d/pve-no-subscription.list ];
then cp /etc/apt/sources.list.d/pve-no-subscription.list /etc/apt//sources.list.d/pve-no-subscription.list.bak
fi

# Backup pve-enterprise.list
cp /etc/apt/sources.list.d/pve-enterprise.list /etc/apt/sources.list.d/pve-enterprise.list.bak

# Determine Proxmox VE version
pve_version=$(pveversion|awk -F '/' '{print $2}'|cut -c1)

# prohibit ceph
if [ -e /etc/apt/sources.list.d/ceph.list ];
then sed -i '1s/^/# /' /etc/apt/sources.list.d/ceph.list
fi

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

else
    echo "Unsupported Proxmox VE version."
    exit 1
fi

# Update package index
apt update

echo "APT sources have been updated with ustc mirror for Proxmox VE $pve_version."
```
