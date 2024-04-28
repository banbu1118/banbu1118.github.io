* 注意事项

```
购买国外云服务器（香港和澳门的服务器也不推荐）
推荐使用腾讯云或阿里云的抢占式云服务器，价格便宜，注意实例释放时间！！！！
```



* ssr

```bash
参考链接：https://thetowerinfo.com/zh/setup-shadowsocks-server-china/

获取ssr安装脚本
wget --no-check-certificate -O shadowsocks-all.sh https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks-all.sh

赋予执行权限
chmod +x shadowsocks-all.sh

运行脚本
./shadowsocks-all.sh 2>&1 | tee shadowsocks-all.log

脚本选项
1.选择ShadowsocksR
2.为SSR设置密码
3.设置SSR端口，推荐443，可以多设备连接
4.加密方式，选择chacha20-ietf
5.传输协议，选择auth_sha1_v4_compatible
6.混淆模式，选择http_simple_compatible
7.任意键盘继续
8.保存相关参数，以便客户端连接使用

mac客户端：https://github.com/shadowsocksrr/electron-ssr/releases
windows客户端：https://github.com/shadowsocksrr/shadowsocksr-csharp/releases
ios客户端：Potatso Lite或Shadowrocket，国内用户需要注册一个海外账号，因为中国版的App Store里已经下架了所有VPN应用
安卓客户端：https://github.com/shadowsocksrr/shadowsocksr-android/releases
```

* v2ray

```bash
参考连接：https://thetowerinfo.com/zh/v2ray-tutorial/

更新系统并安装curl
apt-get update -y && apt-get install curl -y

v2ray一键安装脚本
bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)

配置v2ray
获取uuid
cat /proc/sys/kernel/random/uuid

创建编辑v2ray配置文件
vi /usr/local/etc/v2ray/config.json

删除config.json内容，粘贴上以下内容
{
  "inbounds": [
    {
      "port": 16832, // 服务器端口，建议设置为443，支持多设备连接
      "protocol": "vmess",   
      "settings": {
        "clients": [
          {
            "id": "b831381d-6324-4d53-ad4f-8cda68b30851",  // 用户 ID，
            "alterId": 0
          }
        ]
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",  
      "settings": {}
    }
  ]
}

启动v2ray
systemctl start v2ray

如果修改了配置文件， 需要重启生效
systemctl restart v2ray

安装Google BBR拥堵控制算法来为V2Ray服务器加速（选做）
wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh && chmod +x bbr.sh && ./bbr.sh

如果修改了配置文件， 需要重启生效
systemctl restart v2ray

windows客户端：https://github.com/2dust/v2rayN/releases	#下载v2rayN-With-Core版本
mac客户端：https://github.com/Cenmrev/V2RayX/releases/

windows客户端配置方法：
打开客户端点击右上方的加号，在出现的下拉列表中选择手动输入[Vmess]，然后找到相应区域输入别名（remark，任意名称均可）、服务器IP地址（address）和之前记下的显示在V2Ray配置文件中的几项参数（Port，ID，alterID），还有一项是Security，是选择加密方式，可以自己在下拉列表中选择，和配置文件中的设置无关，建议选择Chacha20-poly1305。输入完成后点击右上方的勾号确定，再点击右下方的连接按钮就可以连接到服务器了。

使用Windows的V2RayN时只要添加服务器（选择Vmess服务器），输入各项信息确定后就会自动连接。注意还要设置系统代理，方法是在Windows的任务栏找到V2RayN的小图标，鼠标右击，在出现的菜单中找到系统代理，然后选择自动配置系统代理。

V2Ray有两种代理模式，有全局模式，和PAC模式，如果平时多用中国以外的网站，那么可以选用全局模式，如果平时会经常用到中国网站，如优酷，QQ音乐等，这些网站的服务只针对中国内的用户开放，这时应该采用PAC模式，让这些没被限制的网站不受V2Ray影响。
```

* v2ray一键安装脚本

```bash
系统支持：Ubuntu，Debian，CentOS，推荐使用 Ubuntu 22，谨慎使用 CentOS，脚本可能无法正常运行！

参考资料：https://233boy.com/v2ray/v2ray-script/

更新系统
apt update

执行一键安装脚本
bash <(wget -qO- -o- https://git.io/v2ray.sh)

启用bbr加速
v2ray(shell)-> 9(关于)->1(启用)
```
