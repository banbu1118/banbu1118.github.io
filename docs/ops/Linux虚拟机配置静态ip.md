### Linux虚拟机配置静态ip

此脚本适用于Linux虚拟机，当没有dhcp环境时，使用这个脚本搭配api来实现Linux虚拟机ip自动配置

#### 1. 把脚本传到/opt目录

当前脚本为esxi环境，如果要改为pve虚拟化，需要再修改

当前脚本仅在kylin测试通过，其他Linux需要测试修改

desk-network.sh脚本内容如下

```shell
#!/bin/bash

# 获取 vmtoolsd 命令的输出
output=$(vmtoolsd --cmd "info-get guestinfo.deskpool.jieyunip")

# 提取每个字段
ip=$(echo "$output" | grep -oP "'ip':'\K[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+")
subnetmask=$(echo "$output" | grep -oP "'subnetmask':'\K[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+")
gateway=$(echo "$output" | grep -oP "'gateway':'\K[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+")
dns=$(echo "$output" | grep -oP "'dns':'\K[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+")

# 检查 IP 地址是否有效
if [[ -z "$ip" ]]; then
    echo "IP 地址提取失败"
    exit 1
fi

# 检查子网掩码是否有效
if [[ -z "$subnetmask" ]]; then
    echo "子网掩码提取失败"
    exit 1
fi

# 检查网关是否有效
if [[ -z "$gateway" ]]; then
    echo "网关提取失败"
    exit 1
fi

# 检查 DNS 是否有效
if [[ -z "$dns" ]]; then
    echo "DNS 提取失败"
    exit 1
fi

# 将子网掩码拆分成四个部分
IFS='.' read -r -a octets <<< "$subnetmask"

# 初始化 CIDR 长度
cidr=0

# 遍历每个字节（octet），检查其二进制位数
for octet in "${octets[@]}"; do
    # 将每个字节转化为二进制，并计算 1 的个数
    for ((i=7; i>=0; i--)); do
        if (( (octet >> i) & 1 )); then
            ((cidr++))
        fi
    done
done

# 输出提取的内容
echo "IP: $ip"
echo "Subnet Mask: $subnetmask"
echo "Gateway: $gateway"
echo "DNS: $dns"
echo "CIDR: /$cidr"

# 获取当前网络连接名称
netname=$(nmcli connection show | awk 'NR>1 {print $1, $2}' | sed 's/[[:space:]]*$//')

# 确保网络连接名称有效
if [[ -z "$netname" ]]; then
    echo "无法获取网络连接名称"
    exit 1
fi

# 配置静态 IP 地址
echo "正在配置静态 IP 地址..."
nmcli connection modify "$netname" ipv4.addresses "$ip/$cidr"
nmcli connection modify "$netname" ipv4.gateway "$gateway"
nmcli connection modify "$netname" ipv4.dns "$dns"
nmcli connection modify "$netname" ipv4.method manual

# 重启网络服务使设置生效
echo "重启网络连接..."
nmcli connection up "$netname"

echo "网络配置已更新！"
```

#### 2. 创建desk-network服务

创建服务

```shell
vi /etc/systemd/system/desk-network.service
```

写入如下内容

```shell
[Unit]
Description=Desk Network Script Before Network
After=network.target

[Service]
Type=oneshot
ExecStart=/bin/bash /opt/desk-network.sh
RemainAfterExit=true
User=root

[Install]
WantedBy=multi-user.target
```

#### 3. 配置desk-network服务

```shell
systemctl enable desk-network
```

