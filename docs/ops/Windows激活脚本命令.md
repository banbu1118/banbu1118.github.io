## Windows激活脚本命令

分享一个开源的 Windows 和 Office 激活脚本，使用很简单，目前已知的最简单方法。不会触发病毒警报。

2025年12月6日，该激活脚本目前已在 GitHub 上拥有 158K 点赞，安全可靠，无需下载软件，无需去找序列号，直接在控制台输入一条命令即可激活 Windows 10/11，Office。

### 项目来源

[https://github.com/massgravel/Microsoft-Activation-Scripts](https://github.com/massgravel/Microsoft-Activation-Scripts)

### 在线激活

联网情况下，以管理员模式启动PowerShell

#### Windows 8、10、11

一般来说用这个命令就够了

按1（数字许可证激活，HWID方式，永久激活Windows）

```powershell
irm https://get.activated.win | iex
```

##### 针对 Windows 8、10、11

如果上述设置被ISP/DNS阻挡，可以试试这个（需要更新Windows 10或11）

```powershell
iex (curl.exe -s --doh-url https://1.1.1.1/dns-query https://get.activated.win | Out-String)
```

##### 适用于Windows 7及更高版本

```powershell
iex ((New-Object Net.WebClient).DownloadString('https://get.activated.win'))
```

### 离线激活

1. 下载这个开源项目的zip压缩文件，在解压的文件夹中，找到名为 All-In-One-Version 的文件夹

2. 运行MAS_AIO.cmd

3. 你会看到激活选项。按照屏幕上的指示作

4. 就这样。

### 命令详解

```
     Activation Methods: 激活方法

 [1] HWID        |  Windows             |   Permanent 永久
 [2] Ohook       |  Office              |   Permanent 永久
 [3] TSforge     |  Windows/Office/ESU  |   Permanent 永久, 2025年2月19日新增，最新的3.0版才有
 [4] KMS38       |  Windows             |   Year 2038 到2038年
 [5] Online KMS  |  Windows / Office    |   180 Days 180天
 __________________________________________________

 [6] Check Activation Status 检查激活状态
 [7] Change Windows Edition 改Windows版本
 [8] Change Office Edition 改Office版本
 __________________________________________________

 [9] Troubleshoot 疑难排解
 [E] Extras 附加选项
 [H] Help 帮助
 [0] Exit 退出
 ______________________________________________________

      用键盘输入选择项，方括号中为可选项 [1,2,3,4,5,6,7,8,9,E,H,0] :
```
