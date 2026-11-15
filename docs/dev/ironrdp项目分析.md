## ironrdp项目分析

GitHub 仓库：https://github.com/Devolutions/IronRDP

### 一、简介

这是 Microsoft 远程桌面协议的 Rust 实现，重点关注安全性。

IronRDP 是 RDP 的模块化 Rust 实现，RDP 是 Windows 远程桌面背后的协议。 它不是一个单体客户端：其可组合箱提供 PDU 编解码器、连接和会话状态机、虚拟通道以及为原生、WebAssembly 和 .NET 客户端、服务器及代理提供图像编解码器。

### 二、ironrdp-viewer


虚拟机命令

```cmd
ironrdp-viewer.exe 192.168.1.159 -u administrator -p 123456
```

### 三、项目进展

 IronRDP 最大的价值不是它已经做出了一个多么成熟的远程桌面软件，而是它正在提供一套可以被不同远程桌面产品复用的 RDP 技术基础设施。

目前在GPU/H.264 图形性能、Windows 外设重定向的完整性有待验证。

### 四、相关项目

#### Devolutions Gateway

devolutions-gateway：https://github.com/Devolutions/devolutions-gateway

Devolutions Gateway 是一个使用 Rust 开发的开源远程访问网关，可以理解为微软 RD Gateway 的替代方案，但支持的协议更多（RDP、SSH、VNC）。

Devolutions Gateway 并不只是一个简单的 TCP 转发器，它还有自己的认证、授权和连接管理机制。

可以替代其核心远程访问功能，但不兼容微软 RD Gateway 原生协议，需要客户端适配它的 JET 连接方式。

#### wasm-rdp

wasm-rdp：https://github.com/amartyaa/wasm-rdp

wasm-rdp 是一个基于网页的 RDP 客户端，完整的协议栈在浏览器中以 WebAssembly 形式运行。服务器只是 WebSocket 到 TCP 的中继，仅此而已——它从不解析 RDP PDU。

Guacamole：在服务器上解码RDP，并将像素流（JPEG或PNG磁贴）推送到浏览器。虽然可以，但服务器需要大量CPU重新编码帧，浏览器接收到的却是截图，而不是实际的RDP输出。

 wasm-rdp：浏览器运行完整的 IronRDP 状态机——图形解码器、NLA/CredSSP 认证、扫描码编码——用 WASM 进行。后端是一个~200线的中继，负责在WebSocket和TCP套接字之间移动字节。它只做一件非简单的事情：当需要NLA时，它会与RDP主机进行TLS握手，然后将服务器证书发回，让WASM端完成CredSSP。

简单来说 Guacamole 负载在服务器后端，wasm-rdp负载在浏览器客户端。