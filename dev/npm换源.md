## 一、直接配置源(不推荐)

*   查看当前源

```shell
 npm config get registry
```

*   更换npm源为国内淘宝镜像

```shell
npm config set registry <https://registry.npmmirror.com/>
```

*   还原成官方源

```shell
npm config set registry <https://registry.npmjs.org/>
```

## 二、间接配置源(推荐)

*   全局安装nrm

```shell
npm install nrm -g --save
```

*   nrm有默认配置，使用 `nrm ls` 查看，带 \* 即为当前源地址

```shell
nrm ls
```

*   nrm切换淘宝镜像

```shell
nrm use taobao
```

*   测试镜像速度

```shell
nrm test taobao
```

*   使用nrm添加镜像地址

```shell
# r_name 为镜像名字，r_url 为镜像地址
nrm add r_name r_url 
```

*   删除nrm镜像

```shell
nrm del r_name
```
