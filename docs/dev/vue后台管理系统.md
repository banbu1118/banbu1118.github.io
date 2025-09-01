## vue后台管理系统

本套前端课程是ES6版(JavaScript), 非TypeScript版(个人不建议初学者直接上手TS), 不包含后端相关知识

本套课程剔除了(RBAC权限管理), 目的是为了降低前期学习难度, 快速的搭建一套后台管理系统

邓瑞编程官方教程：https://www.dengruicode.com/course?uuid=8839b1747ef74f80a7abf9a87b0d1ba8

配套学习视频资料：https://www.bilibili.com/cheese/play/ep684197

本教程未获取邓瑞编程授权，仅作用学习使用，无商业目的！！！

### 1.基于Vite创建Vue3项目

基于Vite创建Vue3项目

```powershell
D:\coder\vitepress>npm create vite@latest

> npx
> create-vite

│
◇  Project name:
│  cms
│
◇  Select a framework:
│  Vue
│
◇  Select a variant:
│  JavaScript
│
◇  Scaffolding project in D:\coder\vitepress\cms...
│
└  Done. Now run:

  cd cms
  npm install    
  npm run dev 
```

删除文件

```powershell
src\assets\vue.svg
src\components\HelloWorld.vue
src\style.css
```

main.js

```js
删除 import './style.css'

修改
createApp(App).mount('#app') 
为
const app = createApp(App)
app.mount('#app')
```

src\App.vue

```vue
<script setup>

</script>

<template>

</template>

<style scoped>

</style>
```

index.html

```html
<title>邓瑞编程</title>
```

### 2.规划目录结构 - 可扩展

src

```
api (存放 api 接口相关代码)
assets (存放静态资源)
  admin (后台相关的目录)
    css
    js
components (存放全局可复用的组件)
  admin
router (存放路由的定义和配置)
stores (存放状态管理相关代码)
  admin
utils (常用工具类)
views (存放页面级别的组件)
  admin
```

### 3.配置环境变量

.env

```
VITE_API_URL=http://127.0.0.1:8008
```

src\main.js

```js
import { createApp } from 'vue'
import App from './App.vue'

console.log(import.meta.env.VITE_API_URL) //环境变量

//createApp(App).mount('#app')
const app = createApp(App)
app.mount('#app')
```

### 4.安装和配置路由 Vue Router

Vue Router 官网：https://router.vuejs.org/zh

安装

```powershell
npm install vue-router@4
```

src\router\index.js

```js
import { createRouter, createWebHistory } from "vue-router"

const routes = [
    {
        path: "/login", // http://localhost:5173/login
        component: () => import("../views/admin/login.vue")
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
```

src\main.js

```js
import { createApp } from 'vue'
import App from './App.vue'

//路由
import router from './router' //导入路由模块

const app = createApp(App)
app.use(router) //将 Vue Router 插件注册到 Vue 应用中
app.mount('#app')
```

src\views\admin\login.vue

```vue
<script setup>

</script>

<template>
    <h3>登录页</h3>
</template>

<style scoped></style>
```

src\App.vue

```vue
<script setup>

</script>

<template>
  <router-view />
</template>

<style scoped></style>
```

### 5.配置路径别名@和VSCode路径提示

vite.config.js  配置路径别名@

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' //导入 node.js path

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { //配置路径别名
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

jsconfig.json  VSCode路径提示 [js]

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": [
                "src/*"
            ] // 配置 @ 符号指向 src 目录及其子目录
        }
    }
}
```

src\router\index.js

```js
import { createRouter, createWebHistory } from "vue-router"

const routes = [
    {
        path: "/login", // http://localhost:5173/login
        component: () => import("@/views/admin/login.vue")
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
```

### 6.安装和配置ElementPlus

element-plus 官网： https://element-plus.org/zh-CN 

安装

```powershell
npm install element-plus --save
```

src\main.js

```js
import { createApp } from 'vue'
import App from './App.vue'

//路由
import router from './router' //导入路由模块

//整体导入 ElementPlus 组件库
import ElementPlus from 'element-plus' //导入 ElementPlus 组件库的所有模块和功能 
import 'element-plus/dist/index.css' //导入 ElementPlus 组件库所需的全局 css 样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //导入 ElementPlus 组件库中的所有图标
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' //导入 ElementPlus 组件库的中文语言包


const app = createApp(App)

app.use(router) //将 Vue Router 插件注册到 Vue 应用中

//注册 ElementPlus 组件库中的所有图标到全局 Vue 应用中
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus, { //将 ElementPlus 插件注册到 Vue 应用中
    locale: zhCn // 设置 ElementPlus 组件库的区域语言为中文简体
})

app.mount('#app')
```

src\views\admin\login.vue

```vue
<script setup>

</script>

<template>
    <h3>登录页</h3>

    <el-icon>
        <User />
    </el-icon>

    <hr>

    <el-button type="primary">登录</el-button>
</template>

<style scoped></style>
```

### 7.安装 Pinia 和 持久化存储插件

Pinia官网：https://pinia.vuejs.org/zh 

pinia-plugin-persistedstate官网：https://prazdevs.github.io/pinia-plugin-persistedstate/zh

安装Pinia

```powershell
npm install pinia
```

安装Pinia持久化存储插件

```powershell
npm i pinia-plugin-persistedstate
```

src\main.js

```js
import { createApp } from 'vue'
import App from './App.vue'

//路由
import router from './router' //导入路由模块

//整体导入 ElementPlus 组件库
import ElementPlus from 'element-plus' //导入 ElementPlus 组件库的所有模块和功能 
import 'element-plus/dist/index.css' //导入 ElementPlus 组件库所需的全局 css 样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //导入 ElementPlus 组件库中的所有图标
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' //导入 ElementPlus 组件库的中文语言包

//Pinia
import { createPinia } from 'pinia' //导入Pinia的createPinia方法,用于创建Pinia实例(状态管理库)
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia() //创建一个Pinia实例, 用于在应用中集中管理状态(store)
pinia.use(piniaPluginPersistedstate) //将持久化存储插件添加到 pinia 实例上


const app = createApp(App)

app.use(pinia) //将 Pinia 实例注册到 Vue 应用中

app.use(router) //将 Vue Router 插件注册到 Vue 应用中

//注册 ElementPlus 组件库中的所有图标到全局 Vue 应用中
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus, { //将 ElementPlus 插件注册到 Vue 应用中
    locale: zhCn // 设置 ElementPlus 组件库的区域语言为中文简体
})

app.mount('#app')
```

src\stores\admin\admin.js

```js
import { reactive } from 'vue'
import { defineStore } from 'pinia'

const useAdminStore = defineStore('admin', () => {
    const data = reactive({
        name: "",
        token: "",
        expireDate: "" //过期日期
    })

    const save = (name, token, expireDate) => {
        data.name = name
        data.token = token
        data.expireDate = expireDate
    }

    return {
        data,
        save
    }
},
    {
        persist: true //持久化存储到 localStorage 中
    })

export { useAdminStore }
```

src\views\admin\login.vue

```vue
<script setup>
import { useAdminStore } from '@/stores/admin/admin';

const adminStore = useAdminStore()

adminStore.save("邓瑞", "dengruicode.com", "2025-08-16")

console.log(adminStore.data);

</script>

<template>
    <h3>登录页</h3>

    <el-icon>
        <User />
    </el-icon>

    <hr>

    <el-button type="primary">登录</el-button>
</template>

<style scoped></style>
```

### 8登录页面 - 布局 

src\views\admin\login.vue

```vue
<script setup>
import '@/assets/admin/css/login.css' //导入样式
import { reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue' //图标

const data = reactive({
    name: '',
    password: '',
})

//登录
const login = () => {
    console.log(data)
}
</script>

<template>
    <div class="dr-login">
        <el-form :model="data">
            <div class="title">
                DR_CMS
            </div>

            <el-form-item>
                <el-input :prefix-icon="User" v-model="data.name" />
            </el-form-item>

            <el-form-item>
                <el-input :prefix-icon="Lock" show-password v-model="data.password" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="login">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped></style>
```

src\assets\admin\css\login.css

```css
* {
    margin: 0;
    padding: 0;
}

.dr-login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.dr-login .el-form {
    width: 360px;
    height: 230px;
    background: #fff;
    box-shadow: 0 0 15px #88c7f8;
}

.dr-login .el-form .title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    font-size: 25px;
    font-weight: bold;
    color: #1e9eff;
}

.dr-login .el-form .el-form-item {
    margin-left: 30px;
    width: 300px;
}

.dr-login .el-form .el-button {
    width: 300px;
}
```

### 9.登陆校验

src\views\admin\login.vue

```vue
<script setup>
import '@/assets/admin/css/login.css' //导入样式
import { reactive, ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue' //图标

const data = reactive({
    name: '',
    password: '',
})

//校验规则
const rules = {
    name: [
        { required: true, message: '请填写用户名', trigger: 'blur' },
        { min: 2, max: 10, message: '用户名长度限制[ 2 - 10 ]个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请填写密码', trigger: 'blur' }
    ]
}

const elFormRef = ref() //存储 <el-form> 组件实例的引用


//登录
const login = () => {
    console.log(data)

    elFormRef.value.validate((valid, fields) => { //校验
        //console.log("valid:",valid,"fields:",fields)
        if (!valid) {
            return
        }
    })
}
</script>

<template>
    <div class="dr-login">
        <el-form :model="data" :rules="rules" ref="elFormRef">
            <div class="title">
                DR_CMS
            </div>

            <el-form-item prop="name">
                <el-input :prefix-icon="User" v-model="data.name" />
            </el-form-item>

            <el-form-item prop="password">
                <el-input :prefix-icon="Lock" show-password v-model="data.password" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="login">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped></style>
```

### 10.安装axios、调用登陆接口

安装axios

```powershell
npm install axios
```

Apipost：https://www.apipost.cn

时间戳转换网站：https://tool.lu/timestamp

Base64 解码网站：https://base64.us

Jwt 解码网站：https://jwt.io

jwt(JSON Web Token) 是一种基于令牌(Token)的认证和授权机制
JWT由三部分组成 Header(头部)、 Payload(负载)、 Signature(签名)

```
Header(头部)
{
    "alg": "HS256", //algorithm 算法
    "typ": "JWT" //type 类型
}

Payload(负载)
    {
        "name": "邓瑞", //自定义属性
        "expireDate": "2024-04-21 15:51:10", //自定义属性
        "sub": "1", //Subject 主题 (用户唯一id)
        "iss": "www.dengruicode.com", //Issuer 发行者
        "exp": 1713681755, //Expiration Time 过期时间
        "nbf": 1713595355, //Not Before 生效时间
        "iat": 1713595355, //Issued At 发行时间
        "jti": "ae189a72-ebcc-44fe-b44c-d48e65c419a3" //jwt ID 标识符
        "aud": [ //Audience 受众
        ""
        ],
    }

Signature(签名[用于验证 jwt 的完整性和防篡改])
    HMACSHA256(
        base64UrlEncode(Header) + "." +
        base64UrlEncode(Payload),
        密钥
    )
```

src\views\admin\login.vue

```vue
<script setup>
import '@/assets/admin/css/login.css' //导入样式
import { reactive, ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue' //图标
import { ElMessage } from 'element-plus'
import axios from 'axios'

const data = reactive({
    name: '',
    password: '',
})

//校验规则
const rules = {
    name: [
        { required: true, message: '请填写用户名', trigger: 'blur' },
        { min: 2, max: 10, message: '用户名长度限制[ 2 - 10 ]个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请填写密码', trigger: 'blur' }
    ]
}

const elFormRef = ref() //存储 <el-form> 组件实例的引用


//登录
const login = () => {
    console.log(data)

    elFormRef.value.validate((valid, fields) => { //校验
        //console.log("valid:",valid,"fields:",fields)
        if (!valid) {
            return
        }

        //axios
        axios.post('http://127.0.0.1:8008/api/adm/login', data).then(response => {
            console.log("data:", response.data)

            if (!response.data.status) {
                ElMessage.error(response.data.msg)
                return
            }

            //token 解码
            let token = response.data.data.token
            console.log("token:", token)
        }).catch(err => {
            console.log("err:", err)
        })
    })
}
</script>

<template>
    <div class="dr-login">
        <el-form :model="data" :rules="rules" ref="elFormRef">
            <div class="title">
                DR_CMS
            </div>

            <el-form-item prop="name">
                <el-input :prefix-icon="User" v-model="data.name" />
            </el-form-item>

            <el-form-item prop="password">
                <el-input :prefix-icon="Lock" show-password v-model="data.password" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="login">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped></style>
```

> 注
>测试管理员账号
>用户名 DR
>密码 123456

### 11.解码jwt生成的token

src\views\admin\login.vue

```vue
<script setup>
import '@/assets/admin/css/login.css' //导入样式
import { reactive, ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue' //图标
import { ElMessage } from 'element-plus'
import axios from 'axios'

const data = reactive({
    name: '',
    password: '',
})

//校验规则
const rules = {
    name: [
        { required: true, message: '请填写用户名', trigger: 'blur' },
        { min: 2, max: 10, message: '用户名长度限制[ 2 - 10 ]个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请填写密码', trigger: 'blur' }
    ]
}

const elFormRef = ref() //存储 <el-form> 组件实例的引用


//登录
const login = () => {
    console.log(data)

    elFormRef.value.validate((valid, fields) => { //校验
        //console.log("valid:",valid,"fields:",fields)
        if (!valid) {
            return
        }

        //axios
        axios.post('http://127.0.0.1:8008/api/adm/login', data).then(response => {
            console.log("data:", response.data)

            if (!response.data.status) {
                ElMessage.error(response.data.msg)
                return
            }

            //token 解码
            let token = response.data.data.token
            let [headerBase64, payloadBase64, signBase64] = token.split('.')
            let payload = atob(payloadBase64)
            let payloadObj = JSON.parse(payload) //将 json 字符串转换位对象
            console.log("payloadObj:", payloadObj)
        }).catch(err => {
            console.log("err:", err)
        })
    })
}
</script>

<template>
    <div class="dr-login">
        <el-form :model="data" :rules="rules" ref="elFormRef">
            <div class="title">
                DR_CMS
            </div>

            <el-form-item prop="name">
                <el-input :prefix-icon="User" v-model="data.name" />
            </el-form-item>

            <el-form-item prop="password">
                <el-input :prefix-icon="Lock" show-password v-model="data.password" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="login">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped></style>
```

### 12.使用 pinia 存储数据 和 跳转至后台

src\router\index.js

```js
import { createRouter, createWebHistory } from "vue-router"

const routes = [
    {
        path: "/login", // http://localhost:5173/login
        //component: () => import("../views/admin/login.vue")
        component: () => import("@/views/admin/login.vue")
    },
    {
        path: "/admin", // http://localhost:5173/admin
        component: () => import("@/views/admin/home.vue")
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
```

src\views\admin\login.vue

```vue
<script setup>
import '@/assets/admin/css/login.css' //导入样式
import axios from 'axios'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue' //图标
import { useAdminStore } from '@/stores/admin/admin.js'
import { useRouter } from 'vue-router'

//初始化
const adminStore = useAdminStore()
const router = useRouter() //路由器

//数据
const data = reactive({
    name: '',
    password: '',
})

//校验规则
const rules = {
    name: [
        { required: true, message: '请填写用户名', trigger: 'blur' },
        { min: 2, max: 10, message: '用户名长度限制[ 2 - 10 ]个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请填写密码', trigger: 'blur' }
    ]
}

const elFormRef = ref() //存储 <el-form> 组件实例的引用


//登录
const login = () => {
    console.log(data)

    elFormRef.value.validate((valid, fields) => { //校验
        //console.log("valid:",valid,"fields:",fields)
        if (!valid) {
            return
        }

        //axios
        axios.post('http://127.0.0.1:8008/api/adm/login', data).then(response => {
            console.log("data:", response.data)

            if (!response.data.status) {
                ElMessage.error(response.data.msg)
                return
            }

            //token 解码
            let token = response.data.data.token
            let [headerBase64, payloadBase64, signBase64] = token.split('.')
            let payload = atob(payloadBase64) //base64 解码
            let payloadObj = JSON.parse(payload) //将 json 字符串转换为对象
            //console.log("payloadObj:",payloadObj)

            //管理员状态存储至 pinia (持久化存储到 localStorage 中)
            adminStore.save(payloadObj.name, token, payloadObj.expireDate)
            //console.log(adminStore.data)

            router.push("/admin") //跳转至后台首页
        }).catch(err => {
            console.log("err:", err)
        })
    })
}
</script>

<template>
    <div class="dr-login">
        <el-form :model="data" :rules="rules" ref="elFormRef">
            <div class="title">
                DR_CMS
            </div>

            <el-form-item prop="name">
                <el-input :prefix-icon="User" v-model="data.name" />
            </el-form-item>

            <el-form-item prop="password">
                <el-input :prefix-icon="Lock" show-password v-model="data.password" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="login">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped></style>
```

src\views\admin\home.vue

```vue
<script setup>

</script>

<template>
<h3>后台</h3>
</template>

<style scoped>

</style>
```

### 13.Vue Router 身份验证 - 页面拦截

src\router\index.js

```js
import { createRouter, createWebHistory } from "vue-router"
import { useAdminStore } from '@/stores/admin/admin.js'


const routes = [
    {
        path: "/login", // http://localhost:5173/login
        //component: () => import("../views/admin/login.vue")
        component: () => import("@/views/admin/login.vue")
    },
    {
        path: "/admin", // http://localhost:5173/admin
        component: () => import("@/views/admin/home.vue"),
        meta: { requiresAuth: true }, //身份验证
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

//全局前置守卫
router.beforeEach((to, from, next) => {
    //console.log("to:",to) //即将进入的路由的信息 (到哪里去)
    //console.log("from:",from) //当前即将离开的路由信息 (从哪里来)

    if (to.meta.requiresAuth) { //判断是否需要身份验证
        console.log("需要身份验证")

        const adminStore = useAdminStore()
        //console.log(adminStore.data)
        if (adminStore.data.token === "") {
            console.log("未登录")

            router.push("/login") //跳转至登录页
        }

        next()
    } else {
        console.log("无需要身份验证")
        next()
    }
})

export default router
```

### 14.后台页面布局和重定向至后台首页

element-plus布局容器：https://element-plus.org/zh-CN/component/container.html

src\router\index.js

```js
import { createRouter, createWebHistory } from "vue-router"
import { useAdminStore } from '@/stores/admin/admin.js'


const routes = [
    {
        path: "/", // http://localhost:5173/
        redirect: "/admin" // 重定向
    },
    {
        path: "/login", // http://localhost:5173/login
        //component: () => import("../views/admin/login.vue")
        component: () => import("@/views/admin/login.vue")
    },
    {
        path: "/admin", // http://localhost:5173/admin
        component: () => import("@/views/admin/home.vue"),
        meta: { requiresAuth: true }, //身份验证
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

//全局前置守卫
router.beforeEach((to, from, next) => {
    //console.log("to:",to) //即将进入的路由的信息 (到哪里去)
    //console.log("from:",from) //当前即将离开的路由信息 (从哪里来)

    if (to.meta.requiresAuth) { //判断是否需要身份验证
        console.log("需要身份验证")

        const adminStore = useAdminStore()
        //console.log(adminStore.data)
        if (adminStore.data.token === "") {
            console.log("未登录")

            router.push("/login") //跳转至登录页
        }

        next()
    } else {
        console.log("无需要身份验证")
        next()
    }
})

export default router
```

src\assets\admin\css\home.css

```css
* {
    margin: 0;
    padding: 0;
}

body {
    font-size: 14px;
}

a {
    outline: none;
    text-decoration: none;
    cursor: pointer;
}

ul,
li {
    list-style-type: none;
}

/* .dr-home */
.dr-home {
    display: flex;
    flex-direction: column;
    /* 容器内的元素从上至下排列 */
    height: 100vh;
}

/* .dr-home .header */
.dr-home .header {
    display: flex;
    height: 55px;
    background: #393d49;
}

/* .dr-home .main */
.dr-home .main {
    display: flex;
    height: calc(100vh - 55px);
    /* 减去 header 高度 */
}

.dr-home .main .side {
    width: 200px;
    background: #545c64;
}

.dr-home .main .content {
    padding: 5px;
    flex: 1;
    overflow-y: auto;
}
```

src\views\admin\home.vue

```vue
<script setup>
import '@/assets/admin/css/home.css' //导入样式

</script>

<template>
    <div class="dr-home">
        <div class="header">

        </div>

        <div class="main">
            <div class="side">

            </div>

            <div class="content">

            </div>
        </div>
    </div>
</template>

<style scoped></style>
```

### 15.侧边栏和封装侧边栏组件

src\router\index.js

```js
import { createRouter, createWebHistory } from "vue-router"
import { useAdminStore } from '@/stores/admin/admin.js'


const routes = [
    {
        path: "/", // http://localhost:5173/
        redirect: "/admin" // 重定向
    },
    {
        path: "/login", // http://localhost:5173/login
        //component: () => import("../views/admin/login.vue")
        component: () => import("@/views/admin/login.vue")
    },
    {
        path: "/admin", // http://localhost:5173/admin
        component: () => import("@/views/admin/home.vue"),
        meta: { requiresAuth: true }, //身份验证
        children: [
            //管理员
            {
                path: "administrator/add", // http://localhost:5173/admin/administrator/add
                component: () => import("@/views/admin/administrator/add.vue")
            },
            {
                path: "administrator/list", // http://localhost:5173/admin/administrator/list
                component: () => import("@/views/admin/administrator/list.vue")
            },
            //类别管理
            {
                path: "category/list", // http://localhost:5173/admin/category/list
                component: () => import("@/views/admin/category/list.vue")
            },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

//全局前置守卫
router.beforeEach((to, from, next) => {
    //console.log("to:",to) //即将进入的路由的信息 (到哪里去)
    //console.log("from:",from) //当前即将离开的路由信息 (从哪里来)

    if (to.meta.requiresAuth) { //判断是否需要身份验证
        console.log("需要身份验证")

        const adminStore = useAdminStore()
        //console.log(adminStore.data)
        if (adminStore.data.token === "") {
            console.log("未登录")

            router.push("/login") //跳转至登录页
        }

        next()
    } else {
        console.log("无需要身份验证")
        next()
    }
})

export default router
```

src\components\admin\home\HomeSide.vue

```vue
<script setup>

</script>

<template>
    <div class="side">
        <el-menu router background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-sub-menu index="admin">
                <template #title>
                    <el-icon>
                        <UserFilled />
                    </el-icon> 管理员
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/admin/administrator/add">添加管理员</el-menu-item>
                    <el-menu-item index="/admin/administrator/list">管理员列表</el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>

            <el-menu-item index="/admin/category/list?parent_id=0">
                <el-icon>
                    <Files />
                </el-icon> 类别管理
            </el-menu-item>
        </el-menu>
    </div>
</template>

<style scoped></style>
```

src\views\admin\home.vue

```vue
<script setup>
import '@/assets/admin/css/home.css' //导入样式
import HomeSide from '@/components/admin/home/HomeSide.vue' //导入侧边栏组件

</script>

<template>
    <div class="dr-home">
        <div class="header">

        </div>

        <div class="main">
            <div class="side">
                <HomeSide />
            </div>

            <div class="content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
```

### 16.Header 组件 - 封装

src\components\admin\home\HomeHeader.vue

```vue
<script setup>

</script>

<template>
    <div class="header">
        <div class="title">
            <div class="logo">
                <el-icon>
                    <MostlyCloudy />
                </el-icon>
            </div>
            <div class="text">
                <a href="/admin">邓瑞编程</a>
            </div>
        </div>

        <div class="info">
            <div class="admin">
                <div class="name">
                    <span>DR</span> <el-icon>
                        <Bell />
                    </el-icon>
                </div>

                <div class="exit">
                    退出
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
```

src\assets\admin\css\home.css

```css
* {
    margin: 0;
    padding: 0;
}

body {
    font-size: 14px;
}

a {
    outline: none;
    text-decoration: none;
    cursor: pointer;
}

ul,
li {
    list-style-type: none;
}

/* .dr-home */
.dr-home {
    display: flex;
    flex-direction: column;
    /* 容器内的元素从上至下排列 */
    height: 100vh;
}

/* .dr-home .header */
.dr-home .header {
    display: flex;
    height: 55px;
    background: #393d49;
}

.dr-home .header .title {
    display: flex;
    width: 200px;
    background: #0c0c0c;
}

.dr-home .header .title .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
}

.dr-home .header .title .logo i {
    color: lightslategray;
    font-size: 30px;
}

.dr-home .header .title .text {
    display: flex;
    align-items: center;
    flex: 1;
}

.dr-home .header .title .text a {
    color: lightslategray;
    font-size: 18px;
    font-weight: bold;
}

.dr-home .header .info {
    display: flex;
    justify-content: flex-end;
    flex: 1;
}

.dr-home .header .info .admin {
    display: flex;
    color: #fff;
    font-size: 15px;
}

.dr-home .header .info .admin .name {
    padding-right: 10px;
    height: 55px;
    line-height: 55px;
    text-align: center;
}

.dr-home .header .info .admin .name i {
    color: #FF5722;
    font-size: 13px;
}

.dr-home .header .info .admin .exit {
    width: 90px;
    height: 55px;
    line-height: 55px;
    text-align: center;
    background: #555c64;
    cursor: pointer;
}

/* .dr-home .main */
.dr-home .main {
    display: flex;
    height: calc(100vh - 55px);
    /* 减去 header 高度 */
}

.dr-home .main .side {
    width: 200px;
    background: #545c64;
}

.dr-home .main .content {
    padding: 5px;
    flex: 1;
    overflow-y: auto;
}
```

src\views\admin\home.vue

```vue
<script setup>
import '@/assets/admin/css/home.css' //导入样式
import HomeHeader from '@/components/admin/home/HomeHeader.vue' //导入 Header 组件
import HomeSide from '@/components/admin/home/HomeSide.vue' //导入侧边栏组件
</script>
<template>
    <div class="dr-home">
        <HomeHeader />

        <div class="main">
            <HomeSide />

            <div class="content">
                <router-view />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
```

### 17.显示登录用户和退出登录

src\utils\LocalDR.js

```js
const get = (key) => {
    return localStorage.getItem(key)
}

const set = (key, value) => {
    return localStorage.setItem(key, value)
}

const remove = (key) => {
    localStorage.removeItem(key)
}

//export { get, set, remove }
export default { get, set, remove }

```

src\components\admin\home\HomeHeader.vue

```vue
<script setup>
import { useAdminStore } from '@/stores/admin/admin';
import { useRouter } from 'vue-router';
//import { get, remove } from '@/utils/LocalDR.js' //export { get, set, remove } //console.log(get("admin"))
import LocalDR from '@/utils/LocalDR.js' //export default LocalDR //console.log(LocalDR.get("admin"))

const adminStore = useAdminStore();
const router = useRouter();
const logout = () => {
    LocalDR.remove("admin") //删除 localStorage 中的 key

    router.push("/login") //跳转至登录页
}

</script>

<template>
    <div class="header">
        <div class="title">
            <div class="logo">
                <el-icon>
                    <MostlyCloudy />
                </el-icon>
            </div>
            <div class="text">
                <a href="/admin">邓瑞编程</a>
            </div>
        </div>

        <div class="info">
            <div class="admin">
                <div class="name">
                    <span>{{ adminStore.data.name }}</span> <el-icon>
                        <Bell />
                    </el-icon>
                </div>

                <div class="logout" @click="logout">
                    退出
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
```

### 18.校验登录状态是否过期

src\utils\TimeDR.js

```js
const TimeDR = {
    now() {
        let date = new Date()

        let yyyy = date.getFullYear()
        let MM = String(date.getMonth() + 1).padStart(2, '0')
        let dd = String(date.getDate()).padStart(2, '0')
        let HH = String(date.getHours()).padStart(2, '0')
        let mm = String(date.getMinutes()).padStart(2, '0')
        let ss = String(date.getSeconds()).padStart(2, '0')

        return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
    },

    // 时间相减
    // let startTime = "2024-04-20 11:30:00"
    // let endTime = "2024-04-22 12:00:00"
    // let timeSubResult = TimeDR.timeSub(startTime,endTime)
    timeSub(startTime, endTime) {
        let startDate = new Date(startTime)
        let endDate = new Date(endTime)

        let expire = false
        let expireText = '距离过期还差'
        let duration = endDate - startDate
        if (duration < 0) {
            expire = true
            expireText = '已过期'
            duration = -duration // 取负数时间差的绝对值
        }

        // 天数、小时数、分钟数、秒数
        let day = Math.floor(duration / (24 * 60 * 60 * 1000))
        let hour = Math.floor((duration / (60 * 60 * 1000)) % 24)
        let minute = Math.floor((duration / (60 * 1000)) % 60)
        let second = Math.floor(duration / 1000) % 60

        return {
            expire,
            startDate,
            endDate,
            day,
            hour,
            minute,
            second,
            remark: `${expireText} ${day} 天 ${hour} 小时 ${minute} 分钟 ${second} 秒`,
        }
    }
}

export default TimeDR
```

src\router\index.js

```js
import { createRouter, createWebHistory } from "vue-router"
import { useAdminStore } from '@/stores/admin/admin.js'
import { ElMessage } from 'element-plus'
import TimeDR from '@/utils/TimeDR.js'
import LocalDR from '@/utils/LocalDR.js'

const routes = [
    {
        path: "/", // http://localhost:5173/
        redirect: "/admin" // 重定向
    },
    {
        path: "/login", // http://localhost:5173/login
        //component: () => import("../views/admin/login.vue")
        component: () => import("@/views/admin/login.vue")
    },
    {
        path: "/admin", // http://localhost:5173/admin
        component: () => import("@/views/admin/home.vue"),
        meta: { requiresAuth: true }, //身份验证
        children: [
            //管理员
            {
                path: "administrator/add", // http://localhost:5173/admin/administrator/add
                component: () => import("@/views/admin/administrator/add.vue")
            },
            {
                path: "administrator/list", // http://localhost:5173/admin/administrator/list
                component: () => import("@/views/admin/administrator/list.vue")
            },
            //类别管理
            {
                path: "category/list", // http://localhost:5173/admin/category/list
                component: () => import("@/views/admin/category/list.vue")
            },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

//全局前置守卫
router.beforeEach((to, from, next) => {
    //console.log("to:",to) //即将进入的路由的信息 (到哪里去)
    //console.log("from:",from) //当前即将离开的路由信息 (从哪里来)

    if (to.meta.requiresAuth) { //判断是否需要身份验证
        console.log("需要身份验证")

        const adminStore = useAdminStore()
        //console.log(adminStore.data)
        if (adminStore.data.token === "") {
            console.log("未登录")

            router.push("/login") //跳转至登录页
        }

        //校验登录状态是否过期
        //let startTime = "2024-05-01 00:00:00"
        let startTime = TimeDR.now()
        let endTime = adminStore.data.expireDate
        let timeSubResult = TimeDR.timeSub(startTime, endTime)
        console.log(timeSubResult)
        if (timeSubResult.expire) { //已过期
            ElMessage.error("登录已过期, 请重新登录")

            LocalDR.remove("admin") //删除 localStorage 中的 key
            router.push("/login") //跳转至登录页
        }

        next()
    } else {
        console.log("无需要身份验证")
        next()
    }
})

export default router
```

### 19.管理员列表页面布局和重写ElementPlus默认样式

src\views\admin\administrator\list.vue

```vue
<script setup>
import { reactive } from 'vue'

const data = reactive({
    list: [
        { id: '1', name: '邓瑞', email: '', remark: 'dengruicode.com', create_time: '2024-04-08' },
        { id: '2', name: 'luna', email: '', remark: 'www.dengruicode.com', create_time: '2023-04-08' },
    ]
})
</script>

<template>
    <el-table :data="data.list" border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="remark" label="备注" />

        <el-table-column label="操作" width="150">
            <template #default="scope">
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>
```

src\assets\admin\css\home.css

```css
* {
    margin: 0;
    padding: 0;
}

body {
    font-size: 14px;
}

a {
    outline: none;
    text-decoration: none;
    cursor: pointer;
}

ul,
li {
    list-style-type: none;
}

/* .dr-home */
.dr-home {
    display: flex;
    flex-direction: column;
    /* 容器内的元素从上至下排列 */
    height: 100vh;
}

/* .dr-home .header */
.dr-home .header {
    display: flex;
    height: 55px;
    background: #393d49;
}

.dr-home .header .title {
    display: flex;
    width: 200px;
    background: #0c0c0c;
}

.dr-home .header .title .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
}

.dr-home .header .title .logo i {
    color: lightslategray;
    font-size: 30px;
}

.dr-home .header .title .text {
    display: flex;
    align-items: center;
    flex: 1;
}

.dr-home .header .title .text a {
    color: lightslategray;
    font-size: 18px;
    font-weight: bold;
}

.dr-home .header .info {
    display: flex;
    justify-content: flex-end;
    flex: 1;
}

.dr-home .header .info .admin {
    display: flex;
    color: #fff;
    font-size: 15px;
}

.dr-home .header .info .admin .name {
    padding-right: 10px;
    height: 55px;
    line-height: 55px;
    text-align: center;
}

.dr-home .header .info .admin .name i {
    color: #FF5722;
    font-size: 13px;
}

.dr-home .header .info .admin .exit {
    width: 90px;
    height: 55px;
    line-height: 55px;
    text-align: center;
    background: #555c64;
    cursor: pointer;
}

/* .dr-home .main */
.dr-home .main {
    display: flex;
    height: calc(100vh - 55px);
    /* 减去 header 高度 */
}

.dr-home .main .side {
    width: 200px;
    background: #545c64;
}

.dr-home .main .content {
    padding: 5px;
    flex: 1;
    overflow-y: auto;
}


/* 重写 ElementPlus 默认样式 */
/* 表格 */
.el-table {
    margin-top: 7px;
    width: 1000px;
}

/* 面包屑 */
.el-breadcrumb {
    margin-bottom: 7px;
}
```

### 20.封装axios和调用管理员列表接口

src\DRUtils\AxiosDR.js

```js
import axios from 'axios'

const axiosInstance = axios.create({  // axios 实例  
    //baseURL: "http://127.0.0.1:8008",
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000
})

const get = (url, data = {}) => {
    return axiosInstance.get(url, { params: data }).then(response => response.data)
}

const post = (url, data = null) => {
    return axiosInstance.post(url, data).then(response => response.data)
}

const postForm = (url, data = null) => {
    return axiosInstance.post(url, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(response => response.data)
}

const postFile = (url, data = null) => {
    return axiosInstance.post(url, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(response => response.data)
}

const postToken = (url, token, data = null) => {
    return axiosInstance.post(url, data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.data)
}

export default { get, post, postForm, postFile, postToken }
```

src\views\admin\administrator\list.vue

```vue
<script setup>
import { reactive } from 'vue'
import AxiosDR from '@/utils/AxiosDR';
import { ElMessage } from 'element-plus'

const data = reactive({
    list: []
})

AxiosDR.get('/api/adm/list').then(result => {
    console.log(result);

    if (!result.status) {
        ElMessage.error(result.msg)
        return
    }

    data.list = result.data.list;

}).catch(err => {
    console.log("err:", err)
})

</script>

<template>
    <el-table :data="data.list" border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="remark" label="备注" />

        <el-table-column label="操作" width="150">
            <template #default="scope">
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>
```

### 21.添加管理员页面 - 布局

src\views\admin\administrator\add.vue

```vue
<script setup>
import { reactive } from 'vue'

const data = reactive({
    name: '',
    password: '',
    email: '',
    gender: '0',
    remark: 'dengruicode.com',
})

//添加
const add = () => {
    console.log(data)
}

//重置
const reset = () => {
    data.name = ''
    data.password = ''
    data.email = ''
    data.gender = '0'
    data.remark = 'dengruicode.com'
}
</script>

<template>
    <el-form label-width="80" style="width: 400px;">
        <el-form-item label="名称">
            <el-input v-model="data.name" placeholder="请填写名称" />
        </el-form-item>

        <el-form-item label="密码">
            <el-input v-model="data.password" show-password placeholder="请填写密码" />
        </el-form-item>

        <el-form-item label="邮箱">
            <el-input v-model="data.email" />
        </el-form-item>

        <el-form-item label="备注">
            <el-input type="textarea" v-model="data.remark" :rows="4" />
        </el-form-item>

        <el-form-item label="性别">
            <el-radio-group v-model="data.gender">
                <el-radio value="0">未知</el-radio>
                <el-radio value="1">男</el-radio>
                <el-radio value="2">女</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="add">添加</el-button>
            <el-button @click="reset">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<style scoped></style>
```

### 22.添加管理员 - 接口

src\views\admin\administrator\add.vue

```vue
<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import AxiosDR from '@/utils/AxiosDR.js'
import TimeDR from '@/utils/TimeDR.js'

const data = reactive({
    name: '',
    password: '',
    email: '',
    gender: '0',
    remark: 'dengruicode.com',
})

//添加
const add = () => {
    //console.log(data)

    if (data.name == '') {
        ElMessage.error("请填写名称")
        return
    }

    if (data.password == '') {
        ElMessage.error("请填写密码")
        return
    }

    data.create_time = TimeDR.now() //添加属性

    AxiosDR.post('/api/adm/add', data).then(result => {
        console.log(result)

        if (!result.status) {
            ElMessage.error(result.msg)
            return
        }

        ElMessage.success("添加成功")
    }).catch(err => {
        console.log("err:", err)
    })
}

//重置
const reset = () => {
    data.name = ''
    data.password = ''
    data.email = ''
    data.gender = '0'
    data.remark = 'dengruicode.com'
}
</script>

<template>
    <el-form label-width="80" style="width: 400px;">
        <el-form-item label="名称">
            <el-input v-model="data.name" placeholder="请填写名称" />
        </el-form-item>

        <el-form-item label="密码">
            <el-input v-model="data.password" show-password placeholder="请填写密码" />
        </el-form-item>

        <el-form-item label="邮箱">
            <el-input v-model="data.email" />
        </el-form-item>

        <el-form-item label="备注">
            <el-input type="textarea" v-model="data.remark" :rows="4" />
        </el-form-item>

        <el-form-item label="性别">
            <el-radio-group v-model="data.gender">
                <el-radio value="0">未知</el-radio>
                <el-radio value="1">男</el-radio>
                <el-radio value="2">女</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="add">添加</el-button>
            <el-button @click="reset">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<style scoped></style>
```

### 23.删除管理员 - async、await 实践

src\views\admin\administrator\list.vue

```vue
<script setup>
import { reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AxiosDR from '@/utils/AxiosDR.js'

const data = reactive({
    list: []
})

//在组件成功挂载到DOM并完成首次渲染后调用
onMounted(() => {
    AxiosDR.get('/api/adm/list').then(result => {
        //console.log(result)

        if (!result.status) {
            ElMessage.error(result.msg)
            return
        }

        data.list = result.data.list
    }).catch(err => {
        console.log("err:", err)
    })
})

const del = async (row) => {
    try {
        await ElMessageBox.confirm('确认删除?', '标题', {
            type: 'warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        })

        //删除
        //let delResult = await AxiosDR.post('/api/adm/del',{id: row.id})
        let delResult = await AxiosDR.post('/api/adm/del', { id: String(row.id) })
        if (!delResult.status) {
            ElMessage.error(delResult.msg)
            return
        }

        //重新获取列表
        let getListResult = await AxiosDR.get('/api/adm/list')
        if (!getListResult.status) {
            ElMessage.error(getListResult.msg)
            return
        }

        data.list = getListResult.data.list //重置
    } catch (err) {
        console.log("err:", err)
    }
}
</script>

<template>
    <el-table :data="data.list" border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="remark" label="备注" />

        <el-table-column label="操作" width="150">
            <template #default="scope">
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" @click="del(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>
```

### 24.编辑管理员 - 路由传参

src\views\admin\administrator\edit.vue

```vue
<script setup>
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import AxiosDR from '@/utils/AxiosDR.js'

//数据
const data = reactive({
    name: '',
    password: '',
    email: '',
    gender: '0',
    remark: 'dengruicode.com',
})

//初始化
const route = useRoute() //路由
const router = useRouter() //路由器

//参数
let id = route.query.id
//console.log(id)

onMounted(() => {
    //获取当前记录
    AxiosDR.get(`/api/adm/getById?id=${id}`).then(result => {
        console.log(result)

        if (!result.status) {
            ElMessage.error(result.msg)
            return
        }

        data.name = result.data.name
        data.email = result.data.email
        data.gender = String(result.data.gender)
        data.remark = result.data.remark
    }).catch(err => {
        console.log("err:", err)
    })
})

//编辑
const edit = () => {
    //console.log(data)

    if (data.name == '') {
        ElMessage.error("请填写名称")
        return
    }

    data.id = id //添加属性
    if (data.password == '') {
        delete data.password //删除属性
    }

    AxiosDR.post('/api/adm/edit', data).then(result => {
        console.log(result)

        if (!result.status) {
            ElMessage.error(result.msg)
            return
        }

        ElMessage.success("编辑成功")
    }).catch(err => {
        console.log("err:", err)
    })
}

//返回
const back = () => {
    router.go(-1)
}
</script>

<template>
    <el-form label-width="80" style="width: 400px;">
        <el-form-item label="名称">
            <el-input v-model="data.name" placeholder="请填写名称" />
        </el-form-item>

        <el-form-item label="密码">
            <el-input v-model="data.password" show-password placeholder="请填写密码" />
        </el-form-item>

        <el-form-item label="邮箱">
            <el-input v-model="data.email" />
        </el-form-item>

        <el-form-item label="备注">
            <el-input type="textarea" v-model="data.remark" :rows="4" />
        </el-form-item>

        <el-form-item label="性别">
            <el-radio-group v-model="data.gender">
                <el-radio value="0">未知</el-radio>
                <el-radio value="1">男</el-radio>
                <el-radio value="2">女</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="edit">编辑</el-button>
            <el-button @click="back">返回</el-button>
        </el-form-item>
    </el-form>
</template>

<style scoped></style>
```

src\views\admin\administrator\list.vue

```vue
<script setup>
import { reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AxiosDR from '@/utils/AxiosDR.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const data = reactive({
    list: []
})

//在组件成功挂载到DOM并完成首次渲染后调用
onMounted(() => {
    AxiosDR.get('/api/adm/list').then(result => {
        //console.log(result)

        if (!result.status) {
            ElMessage.error(result.msg)
            return
        }

        data.list = result.data.list
    }).catch(err => {
        console.log("err:", err)
    })
})

const del = async (row) => {
    try {
        await ElMessageBox.confirm('确认删除?', '标题', {
            type: 'warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        })

        //删除
        //let delResult = await AxiosDR.post('/api/adm/del',{id: row.id})
        let delResult = await AxiosDR.post('/api/adm/del', { id: String(row.id) })
        if (!delResult.status) {
            ElMessage.error(delResult.msg)
            return
        }

        //重新获取列表
        let getListResult = await AxiosDR.get('/api/adm/list')
        if (!getListResult.status) {
            ElMessage.error(getListResult.msg)
            return
        }

        data.list = getListResult.data.list //重置
    } catch (err) {
        console.log("err:", err)
    }
}

//编辑
const edit = (row) => {
    router.push({ path: '/admin/administrator/edit', query: { id: row.id } })
}
</script>

<template>
    <el-table :data="data.list" border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="remark" label="备注" />

        <el-table-column label="操作" width="150">
            <template #default="scope">
                <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
                <el-button size="small" @click="del(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>
```

src\router\index.js

```js
import { createRouter, createWebHistory } from "vue-router"
import { useAdminStore } from '@/stores/admin/admin.js'
import { ElMessage } from 'element-plus'
import TimeDR from '@/utils/TimeDR.js'
import LocalDR from '@/utils/LocalDR.js'

const routes = [
    {
        path: "/", // http://localhost:5173/
        redirect: "/admin" // 重定向
    },
    {
        path: "/login", // http://localhost:5173/login
        //component: () => import("../views/admin/login.vue")
        component: () => import("@/views/admin/login.vue")
    },
    {
        path: "/admin", // http://localhost:5173/admin
        component: () => import("@/views/admin/home.vue"),
        meta: { requiresAuth: true }, //身份验证
        children: [
            //管理员
            {
                path: "administrator/add", // http://localhost:5173/admin/administrator/add
                component: () => import("@/views/admin/administrator/add.vue")
            },
            {
                path: "administrator/edit", // http://localhost:5173/admin/administrator/edit
                component: () => import("@/views/admin/administrator/edit.vue")
            },
            {
                path: "administrator/list", // http://localhost:5173/admin/administrator/list
                component: () => import("@/views/admin/administrator/list.vue")
            },
            //类别管理
            {
                path: "category/list", // http://localhost:5173/admin/category/list
                component: () => import("@/views/admin/category/list.vue")
            },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

//全局前置守卫
router.beforeEach((to, from, next) => {
    //console.log("to:",to) //即将进入的路由的信息 (到哪里去)
    //console.log("from:",from) //当前即将离开的路由信息 (从哪里来)

    if (to.meta.requiresAuth) { //判断是否需要身份验证
        // console.log("需要身份验证")

        const adminStore = useAdminStore()
        //console.log(adminStore.data)
        if (adminStore.data.token === "") {
            console.log("未登录")

            router.push("/login") //跳转至登录页
        }

        //校验登录状态是否过期
        // let startTime = "2025-08-01 00:00:00"
        let startTime = TimeDR.now()
        let endTime = adminStore.data.expireDate
        let timeSubResult = TimeDR.timeSub(startTime, endTime)
        // console.log(timeSubResult)
        if (timeSubResult.expire) { //已过期
            ElMessage.error("登录已过期, 请重新登录")

            LocalDR.remove("admin") //删除 localStorage 中的 key
            router.push("/login") //跳转至登录页
        }

        next()
    } else {
        console.log("无需要身份验证")
        next()
    }
})

export default router
```

### 25.类别列表页面 - 布局

src\views\admin\category\list.vue

```vue
<script setup>
import { reactive } from 'vue'

//数据
const data = reactive({
    path: [
        { id: '1', name: '类别', parent_id: '0', create_time: '2024-03-22' },
        { id: '2', name: '前端', parent_id: '1', create_time: '2024-03-23' }
    ],
    list: [
        { id: '3', name: 'Vue', parent_id: '2', status: '1', create_time: '2024-03-23' },
        { id: '4', name: 'ES', parent_id: '2', status: '1', create_time: '2024-03-24' },
        { id: '5', name: 'JS', parent_id: '2', status: '0', create_time: '2024-03-25' }
    ]
})
</script>

<template>
    <!-- 面包屑
<el-breadcrumb separator="/">
<el-breadcrumb-item><a href="#"><el-icon><House /></el-icon></a></el-breadcrumb-item>
<el-breadcrumb-item><a href="#">类别</a></el-breadcrumb-item>
<el-breadcrumb-item><a href="#">前端</a></el-breadcrumb-item>
</el-breadcrumb>
-->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>
            <a href="/admin/category/list?parent_id=0"><el-icon>
                    <House />
                </el-icon></a>
        </el-breadcrumb-item>

        <el-breadcrumb-item v-for="value in data.path" :key="value.id">
            <a :href="`/admin/category/list?parent_id=${value.id}`">{{ value.name }}</a>
        </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 按钮 -->
    <el-button type="primary">添加类别</el-button>

    <!-- 表格 -->
    <el-table :data="data.list" border>
        <el-table-column prop="id" label="ID" width="80" />
        <!-- <el-table-column prop="name" label="名称"/> -->
        <el-table-column prop="name" label="名称">
            <template #default="scope">
                <a :href="`/admin/category/list?parent_id=${scope.row.id}`" class="blue">{{ scope.row.name }}</a>
            </template>
        </el-table-column>
        <!-- <el-table-column prop="status" label="状态" width="80" /> -->
        <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
                <span v-if="scope.row.status === '1'" class="green">显示</span>
                <span v-else class="orange">隐藏</span>
            </template>
        </el-table-column>
        <el-table-column prop="create_time" label="日期" width="200" />

        <el-table-column label="操作" width="150">
            <template #default="scope">
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>
```

src\assets\admin\css\home.css

```css
* {
    margin: 0;
    padding: 0;
}

body {
    font-size: 14px;
}

a {
    outline: none;
    text-decoration: none;
    cursor: pointer;
}

ul,
li {
    list-style-type: none;
}

/* .dr-home */
.dr-home {
    display: flex;
    flex-direction: column;
    /* 容器内的元素从上至下排列 */
    height: 100vh;
}

/* .dr-home .header */
.dr-home .header {
    display: flex;
    height: 55px;
    background: #393d49;
}

.dr-home .header .title {
    display: flex;
    width: 200px;
    background: #0c0c0c;
}

.dr-home .header .title .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
}

.dr-home .header .title .logo i {
    color: lightslategray;
    font-size: 30px;
}

.dr-home .header .title .text {
    display: flex;
    align-items: center;
    flex: 1;
}

.dr-home .header .title .text a {
    color: lightslategray;
    font-size: 18px;
    font-weight: bold;
}

.dr-home .header .info {
    display: flex;
    justify-content: flex-end;
    flex: 1;
}

.dr-home .header .info .admin {
    display: flex;
    color: #fff;
    font-size: 15px;
}

.dr-home .header .info .admin .name {
    padding-right: 10px;
    height: 55px;
    line-height: 55px;
    text-align: center;
}

.dr-home .header .info .admin .name i {
    color: #FF5722;
    font-size: 13px;
}

.dr-home .header .info .admin .logout {
    width: 90px;
    height: 55px;
    line-height: 55px;
    text-align: center;
    background: #555c64;
    cursor: pointer;
}

/* .dr-home .main */
.dr-home .main {
    display: flex;
    height: calc(100vh - 55px);
    /* 减去 header 高度 */
}

.dr-home .main .side {
    width: 200px;
    background: #545c64;
}

.dr-home .main .content {
    padding: 5px;
    flex: 1;
    overflow-y: auto;
}

/* color */
.blue {
    color: #1e9eff;
}

.green {
    color: #15baaa;
}

.orange {
    color: #feb801;
}

.red {
    color: #f75a23;
}

/* 重写 ElementPlus 默认样式 */
/* 表格 */
.el-table {
    margin-top: 7px;
    width: 1000px;
}

/* 面包屑 */
.el-breadcrumb {
    margin-bottom: 7px;
}
```

### 26.基于 axios 封装 api

src\api\CategoryAPI.js

```js
import AxiosDR from '@/utils/AxiosDR.js'

//获取单条记录
const getById = (id) => {
    return AxiosDR.get(`/api/category/getById?id=${id}`)
}

//获取列表
const getListByParentId = (parent_id) => {
    return AxiosDR.get(`/api/category/getListByParentId?parent_id=${parent_id}`)
}

//添加
const add = (data) => {
    return AxiosDR.post('/api/category/add', data)
}

//编辑
const edit = (data) => {
    return AxiosDR.post('/api/category/edit', data)
}

//删除
const del = (id) => {
    return AxiosDR.post("/api/category/del", { id: id })
}

export default { getById, getListByParentId, add, edit, del }
```

### 27.类别列表 - api

src\views\admin\category\list.vue

```vue
src\views\admin\category\list.vue
<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import CategoryAPI from '@/api/CategoryAPI'

//数据
const data = reactive({
    path: [],
    list: []
})

//初始化
const route = useRoute()

//参数
let parentId = route.query.parent_id
//console.log(parentId)

//在组件成功挂载到DOM并完成首次渲染后调用
onMounted(() => {
    //获取类别列表
    CategoryAPI.getListByParentId(parentId).then(result => {
        //console.log(result)

        if (!result.status) {
            ElMessage.error(result.msg)
            return
        }

        data.path = result.data.path
        data.list = result.data.list
    }).catch(err => {
        console.log("err:", err)
    })
})
</script>

<template>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>
            <a href="/admin/category/list?parent_id=0"><el-icon>
                    <House />
                </el-icon></a>
        </el-breadcrumb-item>

        <el-breadcrumb-item v-for="value in data.path" :key="value.id">
            <a :href="`/admin/category/list?parent_id=${value.id}`">{{ value.name }}</a>
        </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 按钮 -->
    <el-button type="primary">添加类别</el-button>

    <!-- 表格 -->
    <el-table :data="data.list" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称">
            <template #default="scope">
                <a :href="`/admin/category/list?parent_id=${scope.row.id}`" class="blue">{{ scope.row.name }}</a>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
                <span v-if="scope.row.status === '1'" class="green">显示</span>
                <span v-else class="orange">隐藏</span>
            </template>
        </el-table-column>
        <el-table-column prop="create_time" label="日期" width="200" />

        <el-table-column label="操作" width="150">
            <template #default="scope">
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>
```

### 28.删除类别 - api

src\views\admin\category\list.vue

```vue
<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import CategoryAPI from '@/api/CategoryAPI'

//数据
const data = reactive({
    path: [],
    list: []
})

//初始化
const route = useRoute()

//参数
let parentId = route.query.parent_id
//console.log(parentId)

//在组件成功挂载到DOM并完成首次渲染后调用
onMounted(() => {
    //获取类别列表
    CategoryAPI.getListByParentId(parentId).then(result => {
        //console.log(result)

        if (!result.status) {
            ElMessage.error(result.msg)
            return
        }

        data.path = result.data.path
        data.list = result.data.list
    }).catch(err => {
        console.log("err:", err)
    })
})

//删除
const del = async (row) => {
    try {
        await ElMessageBox.confirm('确认删除?', '标题', {
            type: 'warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        })

        //删除
        //let delResult = await AxiosDR.post("/api/category/del",{id: String(row.id)})
        let delResult = await CategoryAPI.del(String(row.id))
        if (!delResult.status) {
            ElMessage.error(delResult.msg)
            return
        }

        //重新获取列表
        //let getListResult = await AxiosDR.get(`/api/category/getListByParentId?parent_id=${parentId}`)
        let getListResult = await CategoryAPI.getListByParentId(parentId)
        if (!getListResult.status) {
            ElMessage.error(getListResult.msg)
            return
        }

        data.list = getListResult.data.list //重置
    } catch (err) {
        console.log("err:", err)
    }
}    
</script>

<template>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>
            <a href="/admin/category/list?parent_id=0"><el-icon>
                    <House />
                </el-icon></a>
        </el-breadcrumb-item>

        <el-breadcrumb-item v-for="value in data.path" :key="value.id">
            <a :href="`/admin/category/list?parent_id=${value.id}`">{{ value.name }}</a>
        </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 按钮 -->
    <el-button type="primary">添加类别</el-button>

    <!-- 表格 -->
    <el-table :data="data.list" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称">
            <template #default="scope">
                <a :href="`/admin/category/list?parent_id=${scope.row.id}`" class="blue">{{ scope.row.name }}</a>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
                <span v-if="scope.row.status === '1'" class="green">显示</span>
                <span v-else class="orange">隐藏</span>
            </template>
        </el-table-column>
        <el-table-column prop="create_time" label="日期" width="200" />

        <el-table-column label="操作" width="150">
            <template #default="scope">
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" @click="del(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>
```

### 29.a标签 替换为 router-link

src\views\admin\category\list.vue

```vue
<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import CategoryAPI from '@/api/CategoryAPI'

//数据
const data = reactive({
    path: [],
    list: []
})

//初始化
const route = useRoute()

//参数
let parentId = route.query.parent_id
//console.log(parentId)

//在组件成功挂载到DOM并完成首次渲染后调用
onMounted(() => {
    //获取类别列表
    CategoryAPI.getListByParentId(parentId).then(result => {
        //console.log(result)

        if (!result.status) {
            ElMessage.error(result.msg)
            return
        }

        data.path = result.data.path
        data.list = result.data.list
    }).catch(err => {
        console.log("err:", err)
    })
})

//删除
const del = async (row) => {
    try {
        await ElMessageBox.confirm('确认删除?', '标题', {
            type: 'warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        })

        //删除
        //let delResult = await AxiosDR.post("/api/category/del",{id: String(row.id)})
        let delResult = await CategoryAPI.del(String(row.id))
        if (!delResult.status) {
            ElMessage.error(delResult.msg)
            return
        }

        //重新获取列表
        //let getListResult = await AxiosDR.get(`/api/category/getListByParentId?parent_id=${parentId}`)
        let getListResult = await CategoryAPI.getListByParentId(parentId)
        if (!getListResult.status) {
            ElMessage.error(getListResult.msg)
            return
        }

        data.list = getListResult.data.list //重置
    } catch (err) {
        console.log("err:", err)
    }
}    
</script>

<template>
    <!-- 面包屑
<el-breadcrumb separator="/">
<el-breadcrumb-item>
<a href="/admin/category/list?parent_id=0"><el-icon><House /></el-icon></a>
</el-breadcrumb-item>

<el-breadcrumb-item v-for="value in data.path" :key="value.id">
<a :href="`/admin/category/list?parent_id=${value.id}`">{{ value.name }}</a>
</el-breadcrumb-item>
</el-breadcrumb>
-->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin/category/list', query: { parent_id: 0 } }">
            <el-icon>
                <House />
            </el-icon>
        </el-breadcrumb-item>

        <el-breadcrumb-item v-for="value in data.path" :to="{ path: '/admin/category/list', query: { parent_id: value.id } }"
            :key="value.id">
            {{ value.name }}
        </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 按钮 -->
    <el-button type="primary">添加类别</el-button>

    <!-- 表格 -->
    <el-table :data="data.list" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称">
            <template #default="scope">
                <!-- <a :href="`/admin/category/list?parent_id=${scope.row.id}`" class="blue">{{ scope.row.name }}</a> -->
                <router-link :to="{ path: '/admin/category/list', query: { parent_id: scope.row.id } }" class="blue">{{
                    scope.row.name }}</router-link>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
                <span v-if="scope.row.status === '1'" class="green">显示</span>
                <span v-else class="orange">隐藏</span>
            </template>
        </el-table-column>
        <el-table-column prop="create_time" label="日期" width="200" />

        <el-table-column label="操作" width="150">
            <template #default="scope">
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" @click="del(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>
```

### 30.生命周期函数 onUpdated 实践

src\views\admin\category\list.vue

```vue
<script setup>
import { reactive, onMounted, onUpdated } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import CategoryAPI from '@/api/CategoryAPI'

//数据
const data = reactive({
    path: [],
    list: []
})

//初始化
const route = useRoute()

//参数
let parentId = route.query.parent_id
//console.log(parentId)

//在组件成功挂载到DOM并完成首次渲染后调用
onMounted(() => {
    //获取类别列表
    CategoryAPI.getListByParentId(parentId).then(result => {
        //console.log(result)

        if (!result.status) {
            ElMessage.error(result.msg)
            return
        }

        data.path = result.data.path
        data.list = result.data.list
    }).catch(err => {
        console.log("err:", err)
    })
})

//在组件更新之后调用
onUpdated(() => {
    if (parentId !== route.query.parent_id) { // 当路由参数 parent_id 发生变化时, 
        parentId = route.query.parent_id //重置
        //console.log("parentId:",parentId)

        //重新获取列表
        CategoryAPI.getListByParentId(parentId).then(result => {
            //console.log(result)

            if (!result.status) {
                ElMessage.error(result.msg)
                return
            }

            data.path = result.data.path //重置
            data.list = result.data.list
        }).catch(err => {
            console.log("err:", err)
        })
    }
})

//删除
const del = async (row) => {
    try {
        await ElMessageBox.confirm('确认删除?', '标题', {
            type: 'warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        })

        //删除
        //let delResult = await AxiosDR.post("/api/category/del",{id: String(row.id)})
        let delResult = await CategoryAPI.del(String(row.id))
        if (!delResult.status) {
            ElMessage.error(delResult.msg)
            return
        }

        //重新获取列表
        //let getListResult = await AxiosDR.get(`/api/category/getListByParentId?parent_id=${parentId}`)
        let getListResult = await CategoryAPI.getListByParentId(parentId)
        if (!getListResult.status) {
            ElMessage.error(getListResult.msg)
            return
        }

        data.list = getListResult.data.list //重置
    } catch (err) {
        console.log("err:", err)
    }
}    
</script>

<template>
    <!-- 面包屑
<el-breadcrumb separator="/">
<el-breadcrumb-item>
<a href="/admin/category/list?parent_id=0"><el-icon><House /></el-icon></a>
</el-breadcrumb-item>

<el-breadcrumb-item v-for="value in data.path" :key="value.id">
<a :href="`/admin/category/list?parent_id=${value.id}`">{{ value.name }}</a>
</el-breadcrumb-item>
</el-breadcrumb>
-->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin/category/list', query: { parent_id: 0 } }">
            <el-icon>
                <House />
            </el-icon>
        </el-breadcrumb-item>

        <el-breadcrumb-item v-for="value in data.path" :to="{ path: '/admin/category/list', query: { parent_id: value.id } }"
            :key="value.id">
            {{ value.name }}
        </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 按钮 -->
    <el-button type="primary">添加类别</el-button>

    <!-- 表格 -->
    <el-table :data="data.list" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称">
            <template #default="scope">
                <!-- <a :href="`/admin/category/list?parent_id=${scope.row.id}`" class="blue">{{ scope.row.name }}</a> -->
                <router-link :to="{ path: '/admin/category/list', query: { parent_id: scope.row.id } }" class="blue">{{
                    scope.row.name }}</router-link>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
                <span v-if="scope.row.status === '1'" class="green">显示</span>
                <span v-else class="orange">隐藏</span>
            </template>
        </el-table-column>
        <el-table-column prop="create_time" label="日期" width="200" />

        <el-table-column label="操作" width="150">
            <template #default="scope">
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" @click="del(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>
```

### 31.自动侦听器 watchEffect 替换生命周期函数

src\views\admin\category\list.vue

```vue
<script setup>
import { reactive, onMounted, onUpdated, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import CategoryAPI from '@/api/CategoryAPI'

//数据
const data = reactive({
    path: [],
    list: []
})

//初始化
const route = useRoute()

//参数
let parentId = route.query.parent_id
//console.log(parentId)

/*
//在组件成功挂载到DOM并完成首次渲染后调用
onMounted(() => {
//获取类别列表
CategoryAPI.getListByParentId(parentId).then(result => {
//console.log(result)

if(!result.status){
ElMessage.error(result.msg)
return
}

data.path = result.data.path
data.list = result.data.list
}).catch(err => {
console.log("err:", err)
})
})

//在组件更新之后调用
onUpdated(() => {
if (parentId !== route.query.parent_id) { // 当路由参数 parent_id 发生变化时, 
parentId = route.query.parent_id //重置
//console.log("parentId:",parentId)

//重新获取列表
CategoryAPI.getListByParentId(parentId).then(result => {
//console.log(result)

if(!result.status){
ElMessage.error(result.msg)
return
}

data.path = result.data.path //重置
data.list = result.data.list
}).catch(err => {
console.log("err:", err)
})
}
})
*/

//自动侦听器 watchEffect
watchEffect(() => {
    //在 watchEffect 内部赋值 parentId = route.query.parent_id, Vue会自动追踪 route.query.parent_id 这个响应式依赖
    //当 route.query.parent_id 的值发生变化时, watchEffect 会立即重新执行
    parentId = route.query.parent_id
    //console.log("parentId:",parentId)

    //重新获取列表
    CategoryAPI.getListByParentId(parentId).then(result => {
        //console.log(result)

        if (!result.status) {
            ElMessage.error(result.msg)
            return
        }

        data.path = result.data.path //重置
        data.list = result.data.list
    }).catch(err => {
        console.log("err:", err)
    })
})

//删除
const del = async (row) => {
    try {
        await ElMessageBox.confirm('确认删除?', '标题', {
            type: 'warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        })

        //删除
        //let delResult = await AxiosDR.post("/api/category/del",{id: String(row.id)})
        let delResult = await CategoryAPI.del(String(row.id))
        if (!delResult.status) {
            ElMessage.error(delResult.msg)
            return
        }

        //重新获取列表
        //let getListResult = await AxiosDR.get(`/api/category/getListByParentId?parent_id=${parentId}`)
        let getListResult = await CategoryAPI.getListByParentId(parentId)
        if (!getListResult.status) {
            ElMessage.error(getListResult.msg)
            return
        }

        data.list = getListResult.data.list //重置
    } catch (err) {
        console.log("err:", err)
    }
}    
</script>

<template>
    <!-- 面包屑
<el-breadcrumb separator="/">
<el-breadcrumb-item>
<a href="/admin/category/list?parent_id=0"><el-icon><House /></el-icon></a>
</el-breadcrumb-item>

<el-breadcrumb-item v-for="value in data.path" :key="value.id">
<a :href="`/admin/category/list?parent_id=${value.id}`">{{ value.name }}</a>
</el-breadcrumb-item>
</el-breadcrumb>
-->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin/category/list', query: { parent_id: 0 } }">
            <el-icon>
                <House />
            </el-icon>
        </el-breadcrumb-item>

        <el-breadcrumb-item v-for="value in data.path" :to="{ path: '/admin/category/list', query: { parent_id: value.id } }"
            :key="value.id">
            {{ value.name }}
        </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 按钮 -->
    <el-button type="primary">添加类别</el-button>

    <!-- 表格 -->
    <el-table :data="data.list" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称">
            <template #default="scope">
                <!-- <a :href="`/admin/category/list?parent_id=${scope.row.id}`" class="blue">{{ scope.row.name }}</a> -->
                <router-link :to="{ path: '/admin/category/list', query: { parent_id: scope.row.id } }" class="blue">{{
                    scope.row.name }}</router-link>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
                <span v-if="scope.row.status === '1'" class="green">显示</span>
                <span v-else class="orange">隐藏</span>
            </template>
        </el-table-column>
        <el-table-column prop="create_time" label="日期" width="200" />

        <el-table-column label="操作" width="150">
            <template #default="scope">
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" @click="del(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>
```

### 32.封装添加类别组件 - 弹出层

src\components\admin\category\CategoryAdd.vue

```vue
<script setup>
import { ref, reactive } from 'vue'

const data = reactive({ //数据
    name: '',
    sort: '0',
    status: '1'
})

const show = ref(true) //默认显示

const add = () => { //添加
    console.log(data)
}

const close = () => { //关闭对话框
    data.name = ''
    data.sort = '0'
    data.status = '1'
}
</script>

<template>
    <el-dialog v-model="show" draggable @close="close" width="600" title="添加类别">
        <el-form label-width="80">
            <el-form-item label="名称">
                <el-input v-model="data.name" placeholder="请填写名称" />
            </el-form-item>

            <el-form-item label="排序">
                <el-input v-model="data.sort" />
            </el-form-item>

            <el-form-item label="状态">
                <el-radio-group v-model="data.status">
                    <el-radio value="1">显示</el-radio>
                    <el-radio value="0">隐藏</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="add">添加</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<style scoped></style>
```

src\views\admin\category\list.vue

```vue
<script setup>
import { reactive, onMounted, onUpdated, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import CategoryAPI from '@/api/CategoryAPI'
  import CategoryAdd from '@/components/admin/category/CategoryAdd.vue' //导入添加类别组件F

//数据
const data = reactive({
    path: [],
    list: []
})

//初始化
const route = useRoute()

//参数
let parentId = route.query.parent_id
//console.log(parentId)

/*
//在组件成功挂载到DOM并完成首次渲染后调用
onMounted(() => {
//获取类别列表
CategoryAPI.getListByParentId(parentId).then(result => {
//console.log(result)

if(!result.status){
ElMessage.error(result.msg)
return
}

data.path = result.data.path
data.list = result.data.list
}).catch(err => {
console.log("err:", err)
})
})

//在组件更新之后调用
onUpdated(() => {
if (parentId !== route.query.parent_id) { // 当路由参数 parent_id 发生变化时, 
parentId = route.query.parent_id //重置
//console.log("parentId:",parentId)

//重新获取列表
CategoryAPI.getListByParentId(parentId).then(result => {
//console.log(result)

if(!result.status){
ElMessage.error(result.msg)
return
}

data.path = result.data.path //重置
data.list = result.data.list
}).catch(err => {
console.log("err:", err)
})
}
})
*/

//自动侦听器 watchEffect
watchEffect(() => {
    //在 watchEffect 内部赋值 parentId = route.query.parent_id, Vue会自动追踪 route.query.parent_id 这个响应式依赖
    //当 route.query.parent_id 的值发生变化时, watchEffect 会立即重新执行
    parentId = route.query.parent_id
    //console.log("parentId:",parentId)

    //重新获取列表
    CategoryAPI.getListByParentId(parentId).then(result => {
        //console.log(result)

        if (!result.status) {
            ElMessage.error(result.msg)
            return
        }

        data.path = result.data.path //重置
        data.list = result.data.list
    }).catch(err => {
        console.log("err:", err)
    })
})

//删除
const del = async (row) => {
    try {
        await ElMessageBox.confirm('确认删除?', '标题', {
            type: 'warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        })

        //删除
        //let delResult = await AxiosDR.post("/api/category/del",{id: String(row.id)})
        let delResult = await CategoryAPI.del(String(row.id))
        if (!delResult.status) {
            ElMessage.error(delResult.msg)
            return
        }

        //重新获取列表
        //let getListResult = await AxiosDR.get(`/api/category/getListByParentId?parent_id=${parentId}`)
        let getListResult = await CategoryAPI.getListByParentId(parentId)
        if (!getListResult.status) {
            ElMessage.error(getListResult.msg)
            return
        }

        data.list = getListResult.data.list //重置
    } catch (err) {
        console.log("err:", err)
    }
}    
</script>

<template>

    <CategoryAdd />

    <!-- 面包屑
<el-breadcrumb separator="/">
<el-breadcrumb-item>
<a href="/admin/category/list?parent_id=0"><el-icon><House /></el-icon></a>
</el-breadcrumb-item>

<el-breadcrumb-item v-for="value in data.path" :key="value.id">
<a :href="`/admin/category/list?parent_id=${value.id}`">{{ value.name }}</a>
</el-breadcrumb-item>
</el-breadcrumb>
-->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin/category/list', query: { parent_id: 0 } }">
            <el-icon>
                <House />
            </el-icon>
        </el-breadcrumb-item>

        <el-breadcrumb-item v-for="value in data.path" :to="{ path: '/admin/category/list', query: { parent_id: value.id } }"
            :key="value.id">
            {{ value.name }}
        </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 按钮 -->
    <el-button type="primary">添加类别</el-button>

    <!-- 表格 -->
    <el-table :data="data.list" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称">
            <template #default="scope">
                <!-- <a :href="`/admin/category/list?parent_id=${scope.row.id}`" class="blue">{{ scope.row.name }}</a> -->
                <router-link :to="{ path: '/admin/category/list', query: { parent_id: scope.row.id } }" class="blue">{{
                    scope.row.name }}</router-link>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
                <span v-if="scope.row.status === '1'" class="green">显示</span>
                <span v-else class="orange">隐藏</span>
            </template>
        </el-table-column>
        <el-table-column prop="create_time" label="日期" width="200" />

        <el-table-column label="操作" width="150">
            <template #default="scope">
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" @click="del(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>
```

### 33.添加类别 - 跨组件通信(依赖注入)

src\components\admin\category\CategoryAdd.vue

```vue
<script setup>
import { ref, reactive, inject } from 'vue'
import { ElMessage } from 'element-plus'
import TimeDR from '@/utils/TimeDR.js'
import CategoryAPI from '@/api/CategoryAPI'

const injectData = inject("provideData") //注入祖先组件提供的数据
const injectFuncGetList = inject("provideFuncGetList") //注入祖先组件提供的方法

const data = reactive({ //数据
    name: '',
    sort: '0',
    status: '1'
})

const add = () => { //添加
    if (data.name == '') {
        ElMessage.error("请填写名称")
        return
    }

    let values = {
        parent_id: injectData.parentId,
        level: injectData.level,
        name: data.name,
        sort: data.sort,
        status: data.status,
        create_time: TimeDR.now()
    }
    //console.log(values)

    CategoryAPI.add(values).then(result => {
        //console.log(result)

        if (!result.status) {
            ElMessage.error(result.msg)
            return
        }

        ElMessage.success("添加成功")

        injectData.pageAdd = false //关闭对话框
        injectFuncGetList() //重新获取列表
    }).catch(err => {
        console.log("err:", err)
    })
}

const close = () => { //关闭对话框
    data.name = ''
    data.sort = '0'
    data.status = '1'
}
</script>

<template>
    <el-dialog v-model="injectData.pageAdd" draggable @close="close" width="600" title="添加类别">
        <el-form label-width="80">
            <el-form-item label="名称">
                <el-input v-model="data.name" placeholder="请填写名称" />
            </el-form-item>

            <el-form-item label="排序">
                <el-input v-model="data.sort" />
            </el-form-item>

            <el-form-item label="状态">
                <el-radio-group v-model="data.status">
                    <el-radio value="1">显示</el-radio>
                    <el-radio value="0">隐藏</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="add">添加</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<style scoped></style>
```

src\views\admin\category\list.vue

```vue
<script setup>
import { reactive, onMounted, onUpdated, watchEffect, provide } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import CategoryAPI from '@/api/CategoryAPI'
import CategoryAdd from '@/components/admin/category/CategoryAdd.vue' //导入添加类别组件

//初始化
const route = useRoute()

//参数
let parentId = route.query.parent_id
//console.log(parentId)

//数据
const data = reactive({
    path: [],
    list: []
})

//跨组件通信 - 依赖注入
const provideData = reactive({
    id: 0, //默认值
    level: 1, //默认层级
    parentId,
    pageAdd: false, //默认不显示 - 添加页
    pageEdit: false
})

const provideFuncGetList = () => {
    CategoryAPI.getListByParentId(parentId).then(result => {
        //console.log(result)

        if (!result.status) {
            ElMessage.error(result.msg)
            return
        }

        data.path = result.data.path //重置
        data.list = result.data.list
    }).catch(err => {
        console.log("err:", err)
    })
}

provide("provideData", provideData) //向子孙组件提供数据
provide("provideFuncGetList", provideFuncGetList) //向子孙组件提供方法

//自动侦听器 watchEffect
watchEffect(() => {
    //在 watchEffect 内部赋值 parentId = route.query.parent_id, Vue会自动追踪 route.query.parent_id 这个响应式依赖
    //当 route.query.parent_id 的值发生变化时, watchEffect 会立即重新执行
    parentId = route.query.parent_id
    //console.log("parentId:",parentId)

    /*
    //错误示例 在此更新 provideData 会造成死循环
    //最初 watchEffect 只监听 route.query.parent_id 的变化,添加了下面的代码后,会同时监听 data.path 的变化
    if(data.path === null){
    provideData.level = 1
    }else{
    provideData.level = data.path.length + 1
    }
    console.log("provideData:",provideData)
    */

    //重新获取列表
    CategoryAPI.getListByParentId(parentId).then(result => {
        //console.log(result)

        if (!result.status) {
            ElMessage.error(result.msg)
            return
        }

        data.path = result.data.path //重置
        data.list = result.data.list

        //更新 provideData
        if (data.path === null) {
            provideData.level = 1 //level
        } else {
            provideData.level = data.path.length + 1
        }
        provideData.parentId = parentId //parentId
        //console.log("provideData:",provideData)
    }).catch(err => {
        console.log("err:", err)
    })
})

//删除
const del = async (row) => {
    try {
        await ElMessageBox.confirm('确认删除?', '标题', {
            type: 'warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        })

        //删除
        //let delResult = await AxiosDR.post("/api/category/del",{id: String(row.id)})
        let delResult = await CategoryAPI.del(String(row.id))
        if (!delResult.status) {
            ElMessage.error(delResult.msg)
            return
        }

        //重新获取列表
        //let getListResult = await AxiosDR.get(`/api/category/getListByParentId?parent_id=${parentId}`)
        let getListResult = await CategoryAPI.getListByParentId(parentId)
        if (!getListResult.status) {
            ElMessage.error(getListResult.msg)
            return
        }

        data.list = getListResult.data.list //重置
    } catch (err) {
        console.log("err:", err)
    }
}

//添加页
const pageAdd = () => {
    provideData.pageAdd = true
}
</script>

<template>
    <CategoryAdd />

    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin/category/list', query: { parent_id: 0 } }">
            <el-icon>
                <House />
            </el-icon>
        </el-breadcrumb-item>

        <el-breadcrumb-item v-for="value in data.path" :to="{ path: '/admin/category/list', query: { parent_id: value.id } }"
            :key="value.id">
            {{ value.name }}
        </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 按钮 -->
    <el-button type="primary" @click="pageAdd">添加类别</el-button>

    <!-- 表格 -->
    <el-table :data="data.list" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称">
            <template #default="scope">
                <router-link :to="{ path: '/admin/category/list', query: { parent_id: scope.row.id } }" class="blue">{{
                    scope.row.name }}</router-link>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
                <span v-if="scope.row.status === '1'" class="green">显示</span>
                <span v-else class="orange">隐藏</span>
            </template>
        </el-table-column>
        <el-table-column prop="create_time" label="日期" width="200" />

        <el-table-column label="操作" width="150">
            <template #default="scope">
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" @click="del(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>
```

### 34.编辑类别 - 跨组件通信(依赖注入)

src\components\admin\category\CategoryEdit.vue

```vue
	<script setup>
	    import { ref,reactive,inject,onUpdated } from 'vue'
	    import { ElMessage } from 'element-plus'
	    import CategoryAPI from '@/api/CategoryAPI'

	    const injectData = inject("provideData") //注入祖先组件提供的数据
	    const injectFuncGetList = inject("provideFuncGetList") //注入祖先组件提供的方法

	    const data = reactive({ //数据
	        name: '',
	        sort: '0',
	        status: '1'
	    })

	    //在组件更新之后调用
	    onUpdated(() => {
	        if(injectData.pageEdit){ //若 pageEdit = true, 则打开了编辑页对话框
	            CategoryAPI.getById(injectData.id).then(result => {
	                //console.log(result)

	                if(!result.status){
	                    ElMessage.error(result.msg)
	                    return
	                }

	                data.name = result.data.name
	                data.sort = result.data.sort
	                data.status = result.data.status
	            }).catch(err => {
	                console.log("err:", err)
	            }) 
	        }
	    })    

	    //编辑
	    const edit = () => { //编辑
	        if (data.name == '') {
	            ElMessage.error("请填写名称")
	            return
	        }

	        let values = {
	            id: String(injectData.id),
	            name: data.name,
	            sort: data.sort,
	            status: data.status
	        }        
	        //console.log(values)

	        CategoryAPI.edit(values).then(result => {
	            //console.log(result)

	            if(!result.status){
	                ElMessage.error(result.msg)
	                return
	            }

	            ElMessage.success("编辑成功")
	            
	            injectData.pageEdit = false //关闭对话框
	            injectFuncGetList() //重新获取列表
	        }).catch(err => {
	            console.log("err:", err)
	        })
	    }

	    const close = () => { //关闭对话框
	        data.name = ''
	        data.sort = '0'
	        data.status = '1'
	    }
	</script>

	<template>
	    <el-dialog v-model="injectData.pageEdit" draggable @close="close" width="600" title="编辑类别">
	        <el-form label-width="80">
	            <el-form-item label="名称">
	                <el-input v-model="data.name" placeholder="请填写名称" />
	            </el-form-item>

	            <el-form-item label="排序">
	                <el-input v-model="data.sort" />
	            </el-form-item>

	            <el-form-item label="状态">
	                <el-radio-group v-model="data.status">
	                    <el-radio value="1">显示</el-radio>
	                    <el-radio value="0">隐藏</el-radio>
	                </el-radio-group>
	            </el-form-item>

	            <el-form-item>
	                <el-button type="primary" @click="edit">编辑</el-button>
	            </el-form-item>
	        </el-form>
	    </el-dialog>
	</template>

	<style scoped>

	</style>
```

src\views\admin\category\list.vue

```vue
<script setup>
import { reactive, onMounted, onUpdated, watchEffect, provide } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import CategoryAPI from '@/api/CategoryAPI'
import CategoryAdd from '@/components/admin/category/CategoryAdd.vue' //导入添加类别组件
import CategoryEdit from '@/components/admin/category/CategoryEdit.vue' //导入编辑类别组件

//初始化
const route = useRoute()

//参数
let parentId = route.query.parent_id
//console.log(parentId)

//数据
const data = reactive({
    path: [],
    list: []
})

//跨组件通信 - 依赖注入
const provideData = reactive({
    id: 0, //默认值
    level: 1, //默认层级
    parentId,
    pageAdd: false, //默认不显示 - 添加页
    pageEdit: false
})

const provideFuncGetList = () => {
    CategoryAPI.getListByParentId(parentId).then(result => {
        //console.log(result)

        if (!result.status) {
            ElMessage.error(result.msg)
            return
        }

        data.path = result.data.path //重置
        data.list = result.data.list
    }).catch(err => {
        console.log("err:", err)
    })
}

provide("provideData", provideData) //向子孙组件提供数据
provide("provideFuncGetList", provideFuncGetList) //向子孙组件提供方法

//自动侦听器 watchEffect
watchEffect(() => {
    //在 watchEffect 内部赋值 parentId = route.query.parent_id, Vue会自动追踪 route.query.parent_id 这个响应式依赖
    //当 route.query.parent_id 的值发生变化时, watchEffect 会立即重新执行
    parentId = route.query.parent_id
    //console.log("parentId:",parentId)

    /*
    //错误示例 在此更新 provideData 会造成死循环
    //最初 watchEffect 只监听 route.query.parent_id 的变化,添加了下面的代码后,会同时监听 data.path 的变化
    if(data.path === null){
    provideData.level = 1
    }else{
    provideData.level = data.path.length + 1
    }
    console.log("provideData:",provideData)
    */

    //重新获取列表
    CategoryAPI.getListByParentId(parentId).then(result => {
        //console.log(result)

        if (!result.status) {
            ElMessage.error(result.msg)
            return
        }

        data.path = result.data.path //重置
        data.list = result.data.list

        //更新 provideData
        if (data.path === null) {
            provideData.level = 1 //level
        } else {
            provideData.level = data.path.length + 1
        }
        provideData.parentId = parentId //parentId
        //console.log("provideData:",provideData)
    }).catch(err => {
        console.log("err:", err)
    })
})

//删除
const del = async (row) => {
    try {
        await ElMessageBox.confirm('确认删除?', '标题', {
            type: 'warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        })

        //删除
        //let delResult = await AxiosDR.post("/api/category/del",{id: String(row.id)})
        let delResult = await CategoryAPI.del(String(row.id))
        if (!delResult.status) {
            ElMessage.error(delResult.msg)
            return
        }

        //重新获取列表
        //let getListResult = await AxiosDR.get(`/api/category/getListByParentId?parent_id=${parentId}`)
        let getListResult = await CategoryAPI.getListByParentId(parentId)
        if (!getListResult.status) {
            ElMessage.error(getListResult.msg)
            return
        }

        data.list = getListResult.data.list //重置
    } catch (err) {
        console.log("err:", err)
    }
}

//添加页
const pageAdd = () => {
    provideData.pageAdd = true
}

//编辑页
const pageEdit = (row) => {
    provideData.id = row.id
    provideData.pageEdit = true
}

</script>

<template>
    <CategoryAdd />
    <CategoryEdit />

    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin/category/list', query: { parent_id: 0 } }">
            <el-icon>
                <House />
            </el-icon>
        </el-breadcrumb-item>

        <el-breadcrumb-item v-for="value in data.path" :to="{ path: '/admin/category/list', query: { parent_id: value.id } }"
            :key="value.id">
            {{ value.name }}
        </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 按钮 -->
    <el-button type="primary" @click="pageAdd">添加类别</el-button>

    <!-- 表格 -->
    <el-table :data="data.list" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称">
            <template #default="scope">
                <router-link :to="{ path: '/admin/category/list', query: { parent_id: scope.row.id } }" class="blue">{{
                    scope.row.name }}</router-link>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
                <span v-if="scope.row.status === '1'" class="green">显示</span>
                <span v-else class="orange">隐藏</span>
            </template>
        </el-table-column>
        <el-table-column prop="create_time" label="日期" width="200" />

        <el-table-column label="操作" width="150">
            <template #default="scope">
                <el-button size="small" type="primary" @click="pageEdit(scope.row)">编辑</el-button>
                <el-button size="small" @click="del(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>
```

### 35.文章列表页面 - 布局

src\views\admin\article\list.vue

```vue

```

