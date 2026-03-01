## Linux换源和Docker安装换源脚本

### 一、项目简介

GNU/Linux 更换系统软件源脚本及 Docker 安装与换源脚本

项目GitHub地址：[https://github.com/SuperManito/LinuxMirrors](https://github.com/SuperManito/LinuxMirrors)

### 二、优势

- 只需要一行命令就能直接运行，零技术门槛，无需安装任何依赖

- 已适配高达 `26+` 操作系统

- 专为中国用户打造

- 项目已设立 MIT 开源许可协议，脚本代码完全开源且免费使用

### 三、使用方式

请提前安装好curl工具

### GNU/Linux 更换系统软件源

```shell
bash <(curl -sSL https://linuxmirrors.cn/main.sh)
```

### Docker 安装与换源

```shell
bash <(curl -sSL https://linuxmirrors.cn/docker.sh)
```

### Docker 更换镜像加速器

```shell
bash <(curl -sSL https://linuxmirrors.cn/docker.sh) --only-registry
```

