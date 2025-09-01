### Linux配置nvm

nvm 全称 Node Version Manager 顾名思义它是用来管理 node 版本的工具，方便切换不同版本的Node.js 

[nvm Github链接](https://github.com/nvm-sh/nvm)

- 获取nvm安装脚本

```bash
wget https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh
```

- 安装nvm，重启生效

```bash
bash install.sh

#网络异常可以配置proxychains socks代理安装
#chmod +x install.sh
#proxychains ./install.sh
```

- 配置nvm淘宝源

```bash
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
```

- 查看版本

```bash
nvm ls-remote
```

- 安装node lts版本，同时会自动安装npm

```bash
nvm install v22.17.1
```

- 查看安装的node版本

```bash
node -v
```

- 查看安装的npm版本

```bash
npm -v
```

- 切换npm为淘宝源

```bash
npm config set registry https://registry.npmmirror.com/
```
