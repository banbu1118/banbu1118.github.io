# sing-box翻墙vpn

sing-box 是一款开源的、跨平台的代理工具核心，专注于提供灵活的代理和网络流量管理功能。

它支持多种协议，旨在为用户提供高度可定制的网络代理解决方案。

[GitHub项目](https://github.com/SagerNet/sing-box)

[sing-box官网](https://sing-box.sagernet.org)

## 一、服务端配置

- Debian/APT官方安装脚本

```bash
sudo mkdir -p /etc/apt/keyrings &&
   sudo curl -fsSL https://sing-box.app/gpg.key -o /etc/apt/keyrings/sagernet.asc &&
   sudo chmod a+r /etc/apt/keyrings/sagernet.asc &&
   echo '
Types: deb
URIs: https://deb.sagernet.org/
Suites: *
Components: *
Enabled: yes
Signed-By: /etc/apt/keyrings/sagernet.asc
' | sudo tee /etc/apt/sources.list.d/sagernet.sources &&
   sudo apt-get update &&
   sudo apt-get install sing-box # or sing-box-beta
```

- 生成随机密钥

```bash
#我这里使用的是2022-blake3-aes-128-gcm加密，日常翻墙是够用
openssl rand -base64 16

#追求更高的安全性，请使用2022-blake3-aes-256-gcm加密
openssl rand -base64 32
```

- 编辑sing-box配置文件

```bash
nano /etc/sing-box/config.json
```

按照上面的加密算法，替换相关内容

参考配置如下

```json
{
    "log": {
        "level": "info"
    },
    "inbounds": [
        {
            "type": "shadowsocks",
            "listen": "::",
            "listen_port": 8888,
            "sniff": true,
            "network": "tcp",
            "method": "2022-blake3-aes-128-gcm",
            "password": "h8Qd0gFeKAjS9uPul0imYw=="
        }
    ]
}
```

- 配置检查

```bash
sudo sing-box check -c /etc/sing-box/config.json
```

- 启动服务

```bash
sudo systemctl enable sing-box && sudo systemctl start sing-box
```

## 二、客户端配置

- Debian/APT官方安装脚本

```bash
sudo mkdir -p /etc/apt/keyrings &&
   sudo curl -fsSL https://sing-box.app/gpg.key -o /etc/apt/keyrings/sagernet.asc &&
   sudo chmod a+r /etc/apt/keyrings/sagernet.asc &&
   echo '
Types: deb
URIs: https://deb.sagernet.org/
Suites: *
Components: *
Enabled: yes
Signed-By: /etc/apt/keyrings/sagernet.asc
' | sudo tee /etc/apt/sources.list.d/sagernet.sources &&
   sudo apt-get update &&
   sudo apt-get install sing-box # or sing-box-beta
```

- 编辑sing-box配置文件

```bash
nano /etc/sing-box/config.json
```

按照上面的加密算法，替换相关内容

参考配置如下，我这里启用了http和socks代理

```json
{
    "log": {
        "level": "info"
    },
    "inbounds": [
        {
            "type": "socks",
            "listen": "::",
            "listen_port": 1080
        },
        {
            "type": "http",
            "listen": "::",
            "listen_port": 1081
        }
    ],
    "outbounds": [
        {
            "type": "shadowsocks",
            "tag": "ss-out",
            "server": "12.28.413.81",
            "server_port": 8888,
            "method": "2022-blake3-aes-128-gcm",
            "password": "h8Qd0gFeKAjS9uPul0imYw==",
            "plugin": "",
            "plugin_opts": "",
            "network": "tcp",
            "multiplex": {}
        }
    ]
}
```

- 配置检查

```bash
sudo sing-box check -c /etc/sing-box/config.json
```

- 启动服务

```bash
sudo systemctl enable sing-box && sudo systemctl start sing-box
```

## 三、服务管理

| 操作     | 命令                                        |
| -------- | ------------------------------------------- |
| 启用     | sudo systemctl enable sing-box              |
| 禁用     | sudo systemctl disable sing-box             |
| 启动     | sudo systemctl start sing-box               |
| 停止     | sudo systemctl stop sing-box                |
| 强行停止 | sudo systemctl kill sing-box                |
| 重新启动 | sudo systemctl restart sing-box             |
| 查看日志 | sudo journalctl -u sing-box --output cat -e |
| 实时日志 | sudo journalctl -u sing-box --output cat -f |

## 四、透明代理探索

### 透明代理第一版本

目前的配置只能代理windows的http，Linux不可以，待改进

```json
{
    "log": {
        "level": "info"
    },
    "dns": {
        "servers": [
            {
                "address": "tls://8.8.8.8"
            }
        ]
    },
"inbounds": [
    {
      "type": "tun",
      "auto_route": true,
      "auto_redirect": true,
      "stack": "mixed",
      "address": [
        "172.19.0.1/30",
        "fdfe:dcba:9876::1/126"
      ],
      "strict_route":true,
      "sniff": true,
      "sniff_override_destination": true
    }
  ],
    "outbounds": [
        {
            "type": "shadowsocks",
            "tag": "ss-out",
            "server": "12.28.413.81",
            "server_port": 8888,
            "method": "2022-blake3-aes-128-gcm",
            "password": "h8Qd0gFeKAjS9uPul0imYw==",
            "network": "tcp",
            "multiplex": {}
        }
    ]
}
```

### 透明代理第二版本

未配置成功，留下记录待完善

- 配置ip转发

```bash
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
sysctl -p
```

- 编辑sing-box配置文件

```bash
nano /etc/sing-box/config.json
```

内容如下

```json
{
  "log": {
    "level": "info"
  },
  "dns": {
    "servers": [
      {
        "address": "8.8.8.8",
        "detour": "proxy"
      }
    ]
  },
  "inbounds": [
    {
      "type": "tun",
      "tag": "tun-in",
      "interface_name": "tun0",
      "mtu": 1500,
      "stack": "system",
      "inet4_address": "172.19.0.1/30",
      "auto_route": true,
      "strict_route": true
    }
  ],
  "outbounds": [
    {
      "type": "your_proxy_type",
      "tag": "proxy",
      "server": "your_proxy_server",
      "server_port": 443
    },
    {
      "type": "direct",
      "tag": "direct"
    }
  ],
  "route": {
    "rules": [
      {
        "inbound": ["tun-in"],
        "outbound": "proxy"
      }
    ]
  }
}
```

- 防火墙规则配置

配置iptables规则实现NAT转发

```bash
iptables -t nat -A POSTROUTING -o tun0 -j MASQUERADE
iptables -A FORWARD -i eth0 -o tun0 -j ACCEPT
iptables -A FORWARD -i tun0 -o eth0 -m state --state RELATED,ESTABLISHED -j ACCEPT
```

- 启动sing-box服务

```bash
systemctl enable sing-box
systemctl start sing-box
```

