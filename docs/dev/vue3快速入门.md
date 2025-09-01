# vue3快速入门

## 一、vue3快速入门

配套学习视频资料：[邓瑞编程-3小时学会vue3](https://www.bilibili.com/video/BV1nV411Q7RX)

邓瑞编程官方教程：[https://www.dengruicode.com/study?uuid=58893cef7e824a02b16039129d59713c](https://www.dengruicode.com/study?uuid=58893cef7e824a02b16039129d59713c)

vue中文官网：[https://cn.vuejs.org/](https://cn.vuejs.org/)

本教程未获取邓瑞编程授权，仅作用学习使用，无商业目的！！！

### 1.创建一个 Vue 应用

Vue.js是渐进式JavaScript 框架

"渐进式"是指可以按需引入Vue.js的部分功能, 而不必全量引入整个框架 

js文件请提前下载好，这是下载链接

[ vue.global.js ]( https://unpkg.com/vue@3/dist/vue.global.js )

[ vue.esm-browser.js ]( https://unpkg.com/vue@3/dist/vue.esm-browser.js )

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="./vue.global.js"></script>
</head>

<body>
    <div id="app">
        {{ msg }}

        <h2>{{ web.title }}</h2>
        <h3>{{ web.url }}</h3>
    </div>

    <script>
        // Vue.createApp({
        //     //Composition API(组合式 API) 的 setup选项 用于设置响应式数据和方法等
        //     setup() {
        //         //Composition API 的 reactive()函数 用于创建响应式数据
        //         const web = Vue.reactive({ //Vue.reactive 创建一个响应式数据对象 web, 其中包含 title 和 url 属性
        //             title: "邓瑞编程",
        //             url: "dengruicode.com"
        //         })

        //         //返回数据
        //         return {
        //             msg: "success",
        //             web
        //         }
        //     }
        // }).mount("#app")  //将 Vue 应用程序挂载(mount) 到 app 元素上

        //将 Vue 对象中的 createApp、reactive 属性赋值给 createApp、reactive 变量
        const { createApp, reactive } = Vue //解构赋值语法

        createApp({
            setup() {
                const web = reactive({
                    title: "邓瑞编程",
                    url: "dengruicode.com"
                })

                return {
                    msg: "success",
                    web
                }
            }
        }).mount("#app")
    </script>
</body>

</html>
```

### 2.模块化开发

注意：模块化开发引入的是vue.esm-browser.js

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app">
        {{ msg }}

        <h2>{{ web.title }}</h2>
        <h3>{{ web.url }}</h3>
    </div>

    <script type="module">
        import { createApp, ref, reactive } from './vue.esm-browser.js'

        createApp({
            setup() {
                const web = reactive({
                    title: "邓瑞编程",
                    url: "dengruicode.com"
                })

                return {
                    msg: "success",
                    web
                }
            }
        }).mount("#app")
    </script>
</body>

</html>
```

### 3.ref和reactive

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app">
        msg:{{ number }}

        <h3>web.title:{{ web.title }}</h3>
        <h3>web.url:{{ web.url }}</h3>
        <h3>web.number:{{ number }}</h3>
    </div>

    <script type="module">
        import { createApp, ref, reactive } from './vue.esm-browser.js'

        createApp({
            setup() {
                const number = ref(10) //ref用于存储单个基本类型的数据, 如:数字、字符串等
                number.value = 20 //使用ref创建的响应式对象, 需要通过.value属性来访问和修改其值

                const web = reactive({ //用于存储复杂数据类型, 如:对象或数组等
                    title: "邓瑞编程",
                    url: "dengruicode.com"
                })
                web.url = "www.dengruicode.com" //使用reactive创建的响应式对象, 可以直接通过属性名来访问和修改值

                return {
                    msg: "success",
                    number,
                    web
                }
            }
        }).mount("#app")
    </script>
</body>

</html>
```

### 4.绑定事件 v-on 简写@

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <h3>{{ msg }}</h3>
        <h3>{{ web.url }}</h3>
        <h3>{{ web.user }}</h3>
        <h3>{{ sub(100, 20) }}</h3>

        <!-- v-on:click 表示在 button 元素上监听 click 事件 -->
        <button v-on:click="edit">修改</button> <br>

        <!-- @click 简写形式 -->
        <button @click="add(20, 30)">加法</button> <br>

        <!-- 
        enter space tab 按键修饰符
        keyup是在用户松开按键时才触发
        keydown是在用户按下按键时立即触发
    -->
        回车 <input type="text" @keyup.enter="add(40, 60)"> <br>
        空格 <input type="text" @keyup.space="add(20, 30)"> <br>
        Tab <input type="text" @keydown.tab="add(10, 20)"> <br>
        w <input type="text" @keyup.w="add(5, 10)"> <br>

        <!-- 组合快捷键 -->
        Ctrl + Enter <input type="text" @keyup.ctrl.enter="add(40, 60)"> <br>
        Ctrl + A <input type="text" @keyup.ctrl.a="add(20, 30)">
    </div>

    <script type="module">
        import { createApp, reactive } from './vue.esm-browser.js'

        createApp({
            setup() {
                const web = reactive({
                    title: "邓瑞编程",
                    url: "dengruicode.com",
                    user: 0
                })

                const edit = () => {
                    web.url = "www.dengruicode.com"
                    //msg = "邓瑞编程" //错误示例 不能直接改变msg的值,因为msg是一个普通变量, 不是响应式数据
                }

                const add = (a, b) => {
                    web.user += a + b
                }

                const sub = (a, b) => {
                    return a - b
                }

                return {
                    msg: "success", //普通变量, 非响应式数据, 在模板中普通变量不会自动更新
                    web, //响应式数据
                    edit, //方法
                    add,
                    sub,
                }
            }
        }).mount("#app")

    </script>

</body>

</html>
```

### 5.显示和隐藏 v-show

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <h3>{{ web.show }}</h3>
        <p v-show="web.show">邓瑞编程 dengruicode.com</p>

        <button @click="toggle">点击切换显示状态</button>
    </div>

    <script type="module">
        import { createApp, reactive } from './vue.esm-browser.js'

        createApp({
            setup() {
                const web = reactive({
                    show: true
                })

                const toggle = () => {
                    web.show = !web.show
                }

                return {
                    web,
                    toggle
                }
            }
        }).mount("#app")

    </script>
</body>

</html>
```

### 6.条件渲染 v-if

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <h3>{{ web.show }}</h3>
        <p v-show="web.show">邓瑞编程</p>
        <p v-if="web.show">dengruicode.com</p>

        <button @click="toggle">点击切换显示状态</button>

        <p v-if="web.user < 1000">新网站</p>
        <p v-else-if="web.user >= 1000 && web.user < 10000">优秀网站</p>
        <p v-else-if="web.user >= 10000 && web.user < 100000">资深网站</p>
        <p v-else>超级网站</p>
    </div>

    <script type="module">
        /*
            v-show 通过 css display属性 来控制元素的显示或隐藏
            v-if 用于对元素进行条件渲染. 当条件为 true 时, 渲染该元素, 为 false 时, 则不渲染
    
            v-show 适用于频繁切换元素的显示状态, 因为只改变 display 属性, 不需要重新渲染整个组件
            v-if 适用于较少改变的场景, 因为频繁从 dom 中删除或添加元素, 会导致性能下降
        */
        import { createApp, reactive } from './vue.esm-browser.js'

        createApp({
            setup() {
                const web = reactive({
                    show: true,
                    user: 500
                })

                const toggle = () => {
                    web.show = !web.show
                }

                return {
                    web,
                    toggle
                }
            }
        }).mount("#app")
    </script>
</body>

</html>
```

### 7.动态属性绑定 v-bind 简写：

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<style>
    .textColor {
        color: blue;
    }
</style>

<body>
    <div id="app">
        <!-- :value -->
        <h3>value="dengruicode.com"</h3>
        <input type="text" value="dengruicode.com">

        <h3>v-bind:value="web.url"</h3>
        <input type="text" v-bind:value="web.url">

        <h3>简写 :value="web.url"</h3>
        <input type="text" :value="web.url">

        <!-- :src -->
        <h3>src="windows.jpg"</h3>
        <img src="windows.jpg">

        <h3>:src="web.img"</h3>
        <img :src="web.img">

        <!-- :class -->
        <h3>class="textColor"</h3>
        <b class="textColor">邓瑞编程</b>

        <h3>:class="{textColor:web.fontStatus}"</h3>
        <b :class="{textColor:web.fontStatus}">dengruicode.com</b>
    </div>

    <script type="module">
        import { createApp, reactive } from './vue.esm-browser.js'

        createApp({
            setup() {
                const web = reactive({
                    url: "www.dengruicode.com",
                    img: "windows.jpg",
                    fontStatus: true
                })

                return {
                    web
                }
            }
        }).mount("#app")
    </script>
</body>

</html>
```

### 8.遍历数组或对象 v-for

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <ul>
            <li v-for="(value, index) in data.number">
                index=> {{ index }} : value=> {{ value }}
            </li>
        </ul>

        <ul>
            <li v-for="value in data.user">
                value=> {{ value }}
            </li>
        </ul>

        <ul>
            <li v-for="(value, key) in data.user">
                key=> {{ key }} : value=> {{ value }}
            </li>
        </ul>

        <ul>
            <li v-for="(value, key, index) in data.user">
                index=> {{ index }} : key=> {{ key }} : value=> {{ value }}
            </li>
        </ul>

        <ul>
            <!-- <template> 标签可以用来包装多个元素或者多行代码, 不会在页面中渲染  -->
            <template v-for="(value, key, index) in data.user">
                <li v-if="index == 1">
                    index=> {{ index }} : key=> {{ key }} : value=> {{ value }}
                </li>
            </template>
        </ul>

        <ul>
            <!-- :key="value.id" 为 每个 li 元素设置一个唯一的 key 值 -->
            <li v-for="(value, index) in data.teacher" :title="value.name" :key="value.id">
                index=> {{ index }} : value.id=>{{ value.id }} value.name=>{{ value.name }} value.web=>{{ value.web }}
            </li>
        </ul>
    </div>

    <script type="module">
        import { createApp, reactive } from './vue.esm-browser.js'

        createApp({
            setup() {
                const data = reactive({
                    number: ["十", "十一", "十二"], //数组
                    user: { //对象
                        name: "Luna",
                        gender: "女"
                    },
                    teacher: [ //包含两个对象的数组
                        { id: 100, name: "邓瑞", web: "dengruicode.com" },
                        { id: 101, name: "David", web: "www.dengruicode.com" }
                    ]
                })

                return {
                    data
                }
            }
        }).mount("#app")
    </script>
</body>

</html>
```

### 9.双向数据绑定 v-model

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <h3>文本框 {{ data.text }}</h3>
        <h3>单选框 {{ data.radio }}</h3>
        <h3>复选框 {{ data.checkbox }}</h3>
        <h3>记住密码 {{ data.remember }}</h3>
        <h3>下拉框 {{ data.select }}</h3>

        <!-- 单向数据绑定 当数据发生改变时, 视图会自动更新. 但用户手动更改 input 的值, 数据不会自动更新 -->
        单向数据绑定 <input type="text" :value="data.text">

        <hr>
        <!-- 
        双向数据绑定 当数据发生改变时, 视图会自动更新. 当用户手动更改 input 的值, 数据也会自动更新
        对于 <input type="text">, v-model 绑定的是 input 元素的 value 属性
     -->
        双向数据绑定 <input type="text" v-model="data.text">

        <hr>
        <!-- 
        单选框
        对于 <input type="radio">, v-model 绑定的是 input 元素的选中状态
     -->
        <input type="radio" v-model="data.radio" value="1">写作
        <input type="radio" v-model="data.radio" value="2">画画

        <hr>
        <!-- 
        复选框
        对于 <input type="checkbox">, v-model 绑定的是 input 元素的选中状态
     -->
        <input type="checkbox" v-model="data.checkbox" value="a">写作
        <input type="checkbox" v-model="data.checkbox" value="b">画画
        <input type="checkbox" v-model="data.checkbox" value="c">运动

        <hr>
        <!-- 记住密码 -->
        <input type="checkbox" v-model="data.remember">记住密码

        <hr>
        <!-- 
        下拉框
        对于 <select>, v-model 绑定的是 select 元素的选中状态
     -->
        <select v-model="data.select">
            <option value="">请选择</option>
            <option value="A">写作</option>
            <option value="B">画画</option>
            <option value="C">运动</option>
        </select>
    </div>

    <script type="module">
        import { createApp, reactive } from './vue.esm-browser.js'

        createApp({
            setup() {
                const data = reactive({
                    text: "dengruicode.com", //文本框
                    radio: "", //单选框
                    checkbox: [], //复选框
                    remember: false, //单个复选框-记住密码
                    select: "" //下拉框
                })

                return {
                    data
                }
            }
        }).mount("#app")
    </script>
</body>

</html>
```

### 10.v-model修饰符

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <h3>url: {{ web.url }}</h3>
        <h3>user: {{ web.user }}</h3>

        实时渲染 <input type="text" v-model="web.url"> <br>

        在失去焦点或按下回车键之后渲染 <input type="text" v-model.lazy="web.url"> <br>

        <!-- 输入 100人, web.user 的值仍为 100 -->
        输入框的值转换为数字类型 <input type="text" v-model.number="web.user"> <br>

        去除首尾空格 <input type="text" v-model.trim="web.url">
    </div>

    <script type="module">
        import { createApp, reactive } from './vue.esm-browser.js'

        createApp({
            setup() {
                const web = reactive({
                    url: "dengruicode.com",
                    user: 10
                })

                return {
                    web
                }
            }
        }).mount("#app")
    </script>
</body>

</html>
```

### 11.渲染数据 v-text 和 v-html

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <h3>{{ web.title }}</h3>

        <!-- v-text 将数据解析为纯文本格式 -->
        <h3 v-text="web.title"></h3>

        <!-- v-html 将数据解析为 html 格式 -->
        <h3 v-html="web.url"></h3>
    </div>

    <script type="module">
        import { createApp, reactive } from './vue.esm-browser.js'

        createApp({
            setup() {
                const web = reactive({
                    title: "邓瑞编程",
                    url: "<i style='color:blue;'>www.dengruicode.com</i>"
                })

                return {
                    web
                }
            }
        }).mount("#app")
    </script>

</body>

</html>
```

### 12.计算属性 computed

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <h3>add: {{ add() }}</h3>
        <h3>add: {{ add() }}</h3>

        <h3>sum: {{ sum }}</h3>
        <h3>sum: {{ sum }}</h3>

        x <input type="text" v-model.number="data.x"> <br>
        y <input type="text" v-model.number="data.y">
    </div>

    <script type="module">
        import { createApp, reactive, computed } from './vue.esm-browser.js'

        createApp({
            setup() {
                const data = reactive({
                    x: 10,
                    y: 20
                })

                //方法-无缓存
                let add = () => {
                    console.log("add") //打印两次
                    return data.x + data.y
                }

                //计算属性-有缓存 [计算属性根据其依赖的响应式数据变化而重新计算]
                const sum = computed(() => {
                    console.log("sum") //打印一次
                    return data.x + data.y
                })

                return {
                    data,
                    sum,
                    add
                }
            }
        }).mount("#app")
    </script>
</body>

</html>
```

### 13.侦听器 watch

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>

    <div id="app">
        爱好
        <select v-model="hobby">
            <option value="">请选择</option>
            <option value="1">写作</option>
            <option value="2">画画</option>
            <option value="3">运动</option>
        </select>

        <hr>

        年
        <select v-model="date.year">
            <option value="">请选择</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
        </select>

        月
        <select v-model="date.month">
            <option value="">请选择</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
        </select>
    </div>

    <script type="module">
        import { createApp, ref, reactive, watch } from './vue.esm-browser.js'

        createApp({
            setup() {
                const hobby = ref("") //爱好
                const date = reactive({ //日期
                    year: "2023",
                    month: "10"
                })

                //监听 hobby
                watch(hobby, (newValue, oldValue) => {
                    console.log("oldValue", oldValue, "newValue", newValue)

                    if (newValue == "2") {
                        console.log("画画")
                    }
                })

                //监听 date
                watch(date, (newValue, oldValue) => {
                    /*
                        JS中对象和数组是通过引用传递的, 而不是通过值传递
                        当修改对象或数组的值时, 实际上修改的是对象或数组的引用, 而不是创建一个新的对象或数组
                        所以，如果修改了对象或数组的值，那么打印出来的结果则是修改后的值
                    */
                    console.log("oldValue", oldValue, "newValue", newValue)

                    if (newValue.year == "2025") {
                        console.log("2025")
                    }

                    if (newValue.month == "11") {
                        console.log("11")
                    }
                })

                //监听 date 中的某个属性 year
                watch(() => date.year, (newValue, oldValue) => {
                    console.log("oldValue", oldValue, "newValue", newValue)

                    if (date.year == "2024") {
                        console.log("2024")
                    }
                })

                return {
                    hobby,
                    date
                }
            }
        }).mount("#app")
    </script>
</body>

</html>
```

### 14.自动侦听器 watchEffect

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue Watch 示例</title>
</head>

<body>
    <div id="app">
        爱好
        <select v-model="hobby">
            <option value="">请选择</option>
            <option value="1">写作</option>
            <option value="2">画画</option>
            <option value="3">运动</option>
        </select>

        <hr>

        年
        <select v-model="date.year">
            <option value="">请选择</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
        </select>

        月
        <select v-model="date.month">
            <option value="">请选择</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
        </select>
    </div>

    <script type="module">
        /*
            watch需要显式指定要监听的属性, 并且只有当监听的属性发生变化时才会执行
            若需要更精细地控制或需要获取到原值, 需要使用watch
        */
        import { createApp, ref, reactive, watchEffect } from './vue.esm-browser.js'

        createApp({
            setup() {
                const hobby = ref("") //爱好
                const date = reactive({ //日期
                    year: "2023",
                    month: "10"
                })

                //自动监听
                watchEffect(() => {
                    console.log("------ 监听开始")

                    if (hobby.value == "2") {
                        console.log("画画")
                    }

                    if (date.year == "2025") {
                        console.log("2025")
                    }

                    if (date.month == "11") {
                        console.log("11")
                    }

                    console.log("------ 监听结束")
                })

                return {
                    hobby,
                    date
                }
            }
        }).mount("#app")
    </script>
</body>

</html>
```

## 二、vue3快速入门2

### 1.图片轮播案例

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>

<body>
    <div id="app">
        <h3>{{ number }}</h3>

        <!-- <img src="/images/1.jpg" style="width: 300px;"> -->
        <img :src=`./images/${number}.jpg` style="width: 300px;">
        <hr>

        <button @click="prev">上一张</button>
        <button @click="next">下一张</button>

        <ul>
            <li v-for="value in 4">
                <a href="#" @click="jump(value)">{{ value }}</a>
            </li>
        </ul>
    </div>

    <script type="module">
        import { createApp, ref } from './vue.esm-browser.js'

        createApp({
            setup() {
                const number = ref(1)

                //上一张
                const prev = () => {
                    number.value--

                    if (number.value == 0) {
                        number.value = 4
                    }
                }

                //下一张
                const next = () => {
                    number.value++

                    if (number.value == 5) {
                        number.value = 1
                    }
                }

                //跳转
                const jump = (value) => {
                    number.value = value
                }

                return {
                    number,
                    prev,
                    next,
                    jump
                }
            }
        }).mount("#app")
    </script>
</body>

</html>
```

### 2.记事本案例

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>

<body>
    <div id="app">
        <input type="text" v-model="data.content">

        <button @click="add">添加</button>
        <hr>

        <ul>
            <li v-for="(value, index) in data.list">
                {{ value }} <button @click="del(index)">删除</button>
            </li>
        </ul>

        记录数 {{ data.list.length }} <br>

        <button @click="clear">清空</button>
    </div>

    <script type="module">
        import { createApp, reactive } from './vue.esm-browser.js'

        createApp({
            setup() {
                const data = reactive({
                    content: "",
                    list: ["邓瑞编程", "dengruicode.com"],
                })

                //添加
                const add = () => {
                    if (data.content == "") {
                        alert("请填写内容")
                        return
                    }

                    data.list.push(data.content) //push 向数组末尾添加一个或多个元素
                    data.content = "" //清空文本框
                }

                //删除
                const del = (index) => {
                    data.list.splice(index, 1) //splice(要删除元素的索引位置, 要删除的元素数量)
                }

                //清空
                const clear = () => {
                    data.list = []
                }

                return {
                    data,
                    add,
                    del,
                    clear
                }
            }
        }).mount("#app")
    </script>
</body>

</html>
```

### 3.购物车案例

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        table {
            width: 600px;
            color: #8f8e8e;
            text-align: center;
            border-collapse: collapse;
        }

        table thead {
            background: #F5F5F5;
        }

        table tr {
            height: 30px;
            line-height: 30px;
            border: 1px solid #ececec;
        }
    </style>
</head>

<body>
    <div id="app">
        <table>
            <thead>
                <tr>
                    <td><input type="checkbox" v-model="data.selected" @change="selectAll" /></td>
                    <td>商品</td>
                    <td>单价</td>
                    <td>库存</td>
                    <td colspan="2">操作</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(value, index) in data.list">
                    <td>
                        <input type="checkbox" v-model="data.checkboxList" :value="value" @change="checkSelect" />
                    </td>
                    <td>{{ value.name }}</td>
                    <td>{{ value.price }}</td>
                    <td>{{ value.stock }}</td>
                    <td>
                        <button @click="sub(value)">-</button>
                        {{ value.number }}
                        <button @click="add(value)">+</button>
                    </td>
                    <td><button @click="del(index,value.id)">删除</button></td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td>总价 {{ totalPrice() }}</td>
                </tr>
            </tfoot>
        </table>
    </div>

    <script type="module">
        import { createApp, reactive } from './vue.esm-browser.js'

        createApp({
            setup() {
                const data = reactive({
                    selected: false,
                    checkboxList: [],
                    list: [{
                        id: 1,
                        name: "铅笔",
                        price: 10,
                        number: 1,
                        stock: 3
                    },
                    {
                        id: 2,
                        name: "鼠标",
                        price: 20,
                        number: 2,
                        stock: 5
                    },
                    {
                        id: 3,
                        name: "键盘",
                        price: 30,
                        number: 1,
                        stock: 6
                    }],
                })

                //减
                const sub = (value) => {
                    value.number--

                    if (value.number <= 1) {
                        value.number = 1
                    }
                }

                //加
                const add = (value) => {
                    value.number++

                    if (value.number >= value.stock) {
                        value.number = value.stock
                    }
                }

                //删除
                const del = (index, id) => {
                    data.list.splice(index, 1) //splice(要删除元素的索引位置, 要删除的元素数量)

                    //filter 筛选符合条件的元素, 返回一个新的数组
                    let newArr = data.checkboxList.filter((value, index) => {
                        return value.id != id
                    })
                    data.checkboxList = newArr

                    checkSelect() //检查勾选状态
                }

                //总价
                const totalPrice = () => {
                    let total = 0
                    for (let i = 0; i < data.checkboxList.length; i++) {
                        total += data.checkboxList[i].price * data.checkboxList[i].number
                    }

                    return total
                }

                //全选/反选
                const selectAll = () => {
                    if (data.selected) { //true
                        data.checkboxList = data.list
                    } else { //false
                        data.checkboxList = []
                    }
                }

                //检查勾选状态
                const checkSelect = () => {
                    if (data.checkboxList.length != data.list.length || data.list.length == 0) {
                        data.selected = false
                    } else {
                        data.selected = true
                    }
                }

                return {
                    data,
                    sub,
                    add,
                    del,
                    totalPrice,
                    selectAll,
                    checkSelect
                }
            }
        }).mount("#app")
    </script>
</body>

</html>
```

### 4.购物车优化案例

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        table {
            width: 600px;
            color: #8f8e8e;
            text-align: center;
            border-collapse: collapse;
        }

        table thead {
            background: #F5F5F5;
        }

        table tr {
            height: 30px;
            line-height: 30px;
            border: 1px solid #ececec;
        }
    </style>
</head>

<body>
    <div id="app">
        <table>
            <thead>
                <tr>
                    <!-- <td><input type="checkbox" v-model="data.selected" @change="selectAll" /></td> -->
                    <td><input type="checkbox" v-model="data.selected" /></td>
                    <td>商品</td>
                    <td>单价</td>
                    <td>库存</td>
                    <td colspan="2">操作</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(value, index) in data.list">
                    <!-- 
                    <td><input type="checkbox" v-model="data.checkboxList" :value="value" @change="checkSelect" /></td> 
                    -->
                    <td><input type="checkbox" v-model="data.checkboxList" :value="value" /></td>
                    <td>{{ value.name }}</td>
                    <td>{{ value.price }}</td>
                    <td>{{ value.stock }}</td>
                    <td>
                        <button @click="sub(value)">-</button>
                        {{ value.number }}
                        <button @click="add(value)">+</button>
                    </td>
                    <td><button @click="del(index,value.id)">删除</button></td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <!-- <td>总价 {{ totalPrice() }}</td> -->
                    <td>总价 {{ totalPrice }}</td>
                </tr>
            </tfoot>
        </table>
    </div>

    <script type="module">
        import { createApp, reactive, watch, computed } from './vue.esm-browser.js'

        createApp({
            setup() {
                const data = reactive({
                    selected: false,
                    checkboxList: [],
                    list: [{
                        id: 1,
                        name: "铅笔",
                        price: 10,
                        number: 1,
                        stock: 3
                    },
                    {
                        id: 2,
                        name: "鼠标",
                        price: 20,
                        number: 2,
                        stock: 5
                    },
                    {
                        id: 3,
                        name: "键盘",
                        price: 30,
                        number: 1,
                        stock: 6
                    }],
                })

                //减
                const sub = (value) => {
                    value.number--

                    if (value.number <= 1) {
                        value.number = 1
                    }
                }

                //加
                const add = (value) => {
                    value.number++

                    if (value.number >= value.stock) {
                        value.number = value.stock
                    }
                }

                //删除
                const del = (index, id) => {
                    data.list.splice(index, 1) //splice(要删除元素的索引位置, 要删除的元素数量)

                    //filter 筛选符合条件的元素, 返回一个新的数组
                    let newArr = data.checkboxList.filter((value, index) => {
                        return value.id != id
                    })
                    data.checkboxList = newArr

                    //checkSelect() //检查勾选状态
                }

                /*
                //总价
                const totalPrice = () => {
                    let total = 0
                    for (let i = 0; i < data.checkboxList.length; i++) {
                        total += data.checkboxList[i].price * data.checkboxList[i].number
                    }

                    return total
                }
                */
                //计算属性-有缓存 [计算属性根据其依赖的响应式数据变化而重新计算]
                const totalPrice = computed(() => {
                    /*
                        reduce定义: 用于对数组中的所有元素进行迭代操作, 并将每次操作的结果累加到一个初始值上
                        reduce接收两个参数: 一个是累加器函数, 另一个是初始值
                        reduce: 将 data.checkboxList 数组中的每个 checkbox 对象的 price 和 number 属性进行相乘, 
                        并将结果累加到初始值 0 上, 最后返回累加的结果

                        total(累加器) 用于存储每次计算的结果, 初始值为 0
                        item(当前元素) 在每次迭代过程中, 当前元素的值会被传递给回调函数
                    */

                    return data.checkboxList.reduce((total, item) => total + item.price * item.number, 0)
                })

                /*
                //全选/反选
                const selectAll = () => {
                    if (data.selected) { //true
                        data.checkboxList = data.list
                    } else { //false
                        data.checkboxList = []
                    }
                }
                */
                //监听 data.selected
                let flag = true
                watch(() => data.selected, (newValue, oldValue) => {
                    //console.log("newValue:",newValue,"oldValue:",oldValue)

                    if (newValue) {
                        data.checkboxList = data.list
                    } else {
                        if (flag) {
                            data.checkboxList = []
                        }
                    }
                    //console.log(data.checkboxList)
                })

                /*
                //检查勾选状态
                const checkSelect = () => {
                    if (data.checkboxList.length == data.list.length && data.list.length != 0) {
                        data.selected = true
                    } else {
                        data.selected = false
                    }
                }
                */
                //监听 data.checkboxList
                watch(() => data.checkboxList, (newValue, oldValue) => {
                    console.log("newValue:", newValue, "oldValue:", oldValue)
                    console.log(newValue.length)

                    if (newValue.length == data.list.length && data.list.length != 0) {
                        data.selected = true
                        flag = true
                    } else {
                        data.selected = false
                        flag = false
                    }
                })

                return {
                    data,
                    sub,
                    add,
                    del,
                    totalPrice,
                    //selectAll,
                    //checkSelect
                }
            }
        }).mount("#app")
    </script>
</body>

</html>
```

### 5.使用Axios实现文章搜索案例

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="./axios.min.js"></script>
</head>

<body>
    <div id="app">
        <select v-model="data.type">
            <option value="0">请选择</option>
            <option value="1">ID</option>
            <option value="2">标题</option>
        </select>

        <input type="text" v-model="data.content">
        <button @click="search">搜索</button>

        <ul>
            <li v-for="(value, index) in data.list">
                {{ value }}
            </li>
        </ul>
    </div>

    <script type="module">
        import { createApp, reactive } from './vue.esm-browser.js'

        createApp({
            setup() {
                const data = reactive({
                    type: "0", //搜索类型
                    content: "", //搜索内容
                    list: [],
                })

                //搜索
                const search = () => {
                    //console.log(data.content)
                    data.list = [] //清空

                    if (data.type == "1") {
                        let id = data.content //参数

                        //get请求
                        axios.get(`http://127.0.0.1/article/get/id/${id}`).then(response => {
                            console.log("get.data:", response.data)

                            if (response.data.status == "success") {
                                if (response.data.data) {
                                    data.list.push(response.data.data) //push 向数组末尾添加一个或多个元素
                                }
                            }
                        }).catch(error => {
                            console.log("get.error:", error)
                        })
                    } else if (data.type == "2") {
                        //参数
                        let param = {
                            title: data.content
                        }

                        //post请求 [axios post的默认请求头是 application/json]
                        axios.post('http://127.0.0.1/article/postJson/search', param).then(response => {
                            console.log("postJson.data:", response.data)

                            if (response.data.status == "success") {
                                for (let i = 0; i < response.data.data.length; i++) {
                                    data.list.push(response.data.data[i]) //push 向数组末尾添加一个或多个元素
                                }
                            }
                        }).catch(error => {
                            console.log("postJson.error:", error)
                        })
                    }
                }

                return {
                    data,
                    search
                }
            }
        }).mount("#app")
    </script>
</body>

</html>
```

## 三、vue3快速入门3

### 1. **基于Vite创建Vue3项目** 

vite中文官网：[https://cn.vitejs.dev](https://cn.vitejs.dev/) )

- 基于Vite创建Vue3项目

```
npm create vite@latest

Ok to proceed? (y) » y

Project name: » demo

Select a framework: » Vue

Select a variant: » JavaScript

Done. Now run:

        cd demo

        npm install

        npm run dev

Local: http://localhost:5173
```

- 删除文件

```
src\style.css

src\components\HelloWorld.vue
```

- 删除代码

```
#main.js

import './style.css'
```

- 修改代码

```html
#src\App.vue

<script setup>

</script>

<template>

        dengruicode.com

</template>

<style scoped>

</style>
```

### 2.vue3好用的VsCode插件

```
Vue - Official 【原名Volar】

Vue VSCode Snippets

别名路径跳转

TypeScript Vue Plugin (Volar) 【已弃用】

注

Vue VSCode Snippets自定义模板

C:\Users\David\.vscode\extensions\sdras.vue-vscode-snippets-3.1.1\snippets

模板

        vbase-3-setup

        vbase-3-ts-setup

重启vscode
```

### 3.导入组件

```vue
<script setup>
  //导入子组件
  //App.vue是父组件,因为它包含了header.vue和footer.vue两个子组件
  import Header from "./components/header.vue"
  import Footer from "./components/footer.vue"
</script>

<template>
  <Header/>

  dengruicode.com
  
  <Footer/>
</template>

<style scoped>

</style>
```

### 4.父传子 defineProps|

App.vue

```vue
<script setup>
  import { reactive } from 'vue'

  //导入子组件
  //App.vue是父组件,因为它包含了header.vue和footer.vue两个子组件
  import Header from "./components/header.vue"
  import Footer from "./components/footer.vue"

  /*
  const propsWeb = {
    user: 10,
    ip: '127.0.0.1'
  }
  */
  //响应式数据
  const propsWeb = reactive({
    user: 10,
    ip: '127.0.0.1'
  })

  //添加用户
  const userAdd = () => {
    propsWeb.user++
    console.log(propsWeb.user)
  }
</script>

<template>
  <!-- 父传子 - 方式1 -->
  <Header propsName="邓瑞编程" propsUrl="dengruicode.com" />

  dengruicode.com

  <button @click="userAdd">添加用户</button>

  <!-- 父传子 - 方式2 -->
  <!-- <Footer v-bind="propsWeb" /> -->
  <Footer :="propsWeb" />
</template>

<style scoped></style>
```

header.vue

```vue
<script setup>
    //子组件

    //接收方式1 - 数组
    /*
        defineProps是Vue3的编译时宏函数,
        用于接收父组件向子组件传递的属性(props)

        注
        当使用Vue编译器编译包含defineProps的组件时,
        编译器会将这些宏替换为相应的运行时代码
    */
    const props = defineProps(["propsName","propsUrl"])
    console.log(props)
</script>

<template>
    <h3>Header</h3>
</template>

<style scoped>

</style>
```

footer.vue

```vue
<script setup>
    //子组件

    //接收方式2 - 对象
    /*
    const props = defineProps({
        user: Number,
        ip: String
    })
    */
    const props = defineProps({
        user: Number,
        ip: {
            type: String,
            required: true, //true表示必传属性,若未传则会提示警告信息
            default: 'localhost' //未传默认值
        }
    })

    console.log(props)
</script>

<template>
    <h3>Footer</h3>
    user: {{ props.user }}
</template>

<style scoped>

</style>
```

### 5.子传父 defineEmits

App.vue

```vue
<script setup>
  import { reactive,ref } from 'vue'

  //导入子组件
  import Header from "./components/header.vue"

  //响应式数据
  const web = reactive({
    name: "邓瑞编程",
    url: 'dengruicode.com'
  })

  const user = ref(0)

  //子传父
  const emitsWeb = (data) => {
    console.log("emitsWeb:",data)
    web.url = data.url
  }

  const emitsUser = (data) => {
    console.log("emitsUser:",data)
    user.value += data
  }
</script>

<template>
  <!-- 子传父 -->
  <Header @web="emitsWeb" @user="emitsUser" />

  {{ web.url }} - {{ user }}
</template>

<style scoped></style>
```

header.vue

```vue
<script setup>
    //子组件

    /*
        defineEmits是Vue3的编译时宏函数,
        用于子组件向父组件发送自定义事件
    */
    //子传父
    //定义一个名为 emits 的对象, 用于存储自定义事件
    const emits = defineEmits(["web","user"])
    //发送名为 web 和 user 的自定义事件
    emits("web", {name:"邓瑞",url:"www.dengruicode.com"})
    
    //添加用户
    const userAdd = () => {
        //发送名为 user 的自定义事件
        emits("user", 10)
    }
</script>

<template>
    <h3>Header</h3>

    <button @click="userAdd">添加用户</button>
</template>

<style scoped>

</style>
```

### 6.跨组件通信-依赖注入

App.vue

```vue
<script setup>
  import { provide, ref } from 'vue'

  //导入子组件
  import Header from "./components/header.vue"

  //provide用于父组件将 数据 提供给所有子组件
  /*
    若使用了provide和inject来进行数据传递,
    则一般不需要再使用defineProps
  */
  provide("provideWeb",{name:"邓瑞",url:"www.dengruicode.com"})

  //传递响应式数据
  const user = ref(0)
  provide("provideUser",user)

  //添加用户
  const userAdd = () => {
    user.value++
  }
  //用于父组件将 函数 提供给所有子组件
  provide("provideFuncUserAdd",userAdd)
</script>

<template>
  <h3>App.vue-Top组件</h3>

  {{ user }}

  <!-- 子组件 -->
  <Header/>
</template>

<style scoped></style>
```

header.vue

```vue
<script setup>
    import { provide, inject } from 'vue'

    //导入子组件
    import Nav from "./nav.vue"

    //子组件通过inject注入父组件提供的 响应式数据
    const user = inject("provideUser")
    console.log("provideUser:",user.value)

    //provide用于父组件将 数据 提供给所有子组件
    provide("provideUrl","dengruicode.com")
</script>

<template>
    <h3>header.vue-Middle组件</h3>

    <!-- 子组件 -->
    <Nav/>
</template>

<style scoped>

</style>
```

nav.vue

```vue
<script setup>
    //子组件
    import { inject } from 'vue'

    //子组件通过inject注入父组件提供的 数据
    const web = inject("provideWeb")
    console.log("provideWeb:",web)

    const url = inject("provideUrl")
    console.log("provideUrl:",url)

    //子组件通过inject注入父组件提供的 函数
    const funcUserAdd = inject("provideFuncUserAdd")
    console.log("provideFuncUserAdd:",funcUserAdd)
</script>

<template>
    <h3>nav.vue-Bottom组件</h3>

    <button @click="funcUserAdd">添加用户</button>
</template>

<style scoped>

</style>
```

### 7.匿名插槽和具名插槽

- 插槽(slot)

```
是指可以在父组件内自定义模板片段,
    
在子组件中可以将定义的模板片段插入到子组件的特定位
```

App.vue

```vue
<script setup>
  //导入子组件
  import Header from "./components/header.vue"
  import Footer from "./components/footer.vue"
</script>

<template>
  <h3>App.vue</h3>

  <!-- <Header/> -->
  <!-- 匿名插槽 -->
  <Header>
    <a href="http://dengruicode.com">邓瑞编程</a>
  </Header>

  <!-- 具名插槽 -->
  <Footer>
    <template v-slot:url>
      <a href="http://www.dengruicode.com">网址</a>
    </template>

    <!-- v-slot:user 简写 #user -->
    <template #user>
      1000
    </template>
  </Footer>

</template>

<style scoped>

</style>
```

header.vue

```vue
<script setup>
    
</script>

<template>
    <h3>header.vue - 子组件</h3>

    <!-- 匿名插槽 -->
    <slot/>
</template>

<style scoped>

</style>
```

footer.vue

```vue
<script setup>
    
</script>

<template>
    <h3>footer.vue - 子组件</h3>

    <!-- 具名插槽 -->
    <slot name="url" />
    <slot name="user" />
</template>

<style scoped>

</style>
```

### 8. 作用域插槽

- 作用域插槽 

```
子组件向父组件传递数据,并在父组件定义的模板中渲染
```

App.vue

```vue
<script setup>
  //导入子组件
  import Header from "./components/header.vue"
  import Footer from "./components/footer.vue"
</script>

<template>
  <h3>App.vue</h3>

  <!-- <Header/> -->
  <!-- 匿名插槽 -->
  <Header>
    <a href="http://dengruicode.com">邓瑞编程</a>
  </Header>

  <!-- 具名插槽 -->
  <Footer>
    <template v-slot:url>
      <a href="http://www.dengruicode.com">网址</a>
    </template>

    <!--
      v-slot:user 简写 #user

      作用域插槽
      子组件将url和title数据传递给 name="user" 的插槽,
      父组件通过 #user="data" 来接收这些数据

      <template #user="data">
        1000 {{ data.url }} {{ data.title }}
      </template>
    -->
    <!-- 解构 -->
    <template #user="{url,title}">
      1000 {{ url }} {{ title }}
    </template>
  </Footer>

</template>

<style scoped>

</style>
```

header.vue

```vue
<script setup>
    
</script>

<template>
    <h3>header.vue - 子组件</h3>

    <!-- 匿名插槽 -->
    <slot/>
</template>

<style scoped>

</style>
```

footer.vue

```vue
<script setup>
    
</script>

<template>
    <h3>footer.vue - 子组件</h3>

    <!-- 具名插槽 -->
    <slot name="url" />
    <slot name="user" url="dengruicode.com" title="邓瑞编程" />
</template>

<style scoped>

</style>
```

### 9.生命周期函数

- 生命周期函数

```
是组件实例从创建到销毁过程中不同时间点自动调用的函数
```

- 挂载阶段

```
onBeforeMount
在组件实例即将被挂载到DOM树之前调用
此时模板还未编译或渲染到DOM,通常用于执行初始化操作,
如:获取异步数据、设置初始属性值等

onMounted
在组件成功挂载到DOM并完成首次渲染后调用
此时可以访问和操作DOM元素,
并执行与页面交互相关的逻辑
```

- 更新阶段

```
onBeforeUpdate (由于响应式数据变化)
在组件更新之前即将重新渲染时调用
可以根据新的参数判断是否需要进行特殊处理,
甚至可以选择阻止此次更新过程

onUpdated
在组件完成更新并重新渲染后调用
可以基于新的渲染结果处理更新后的数据
```

- 卸载阶段 

```
onBeforeUnmount
在组件从DOM中销毁之前调用
用于释放资源,如:清理计时器、解绑事件监听器等

onUnmounted
在组件已经从DOM中移除并销毁后调用
确保组件所占用的所有资源都被正确释放
```

- 错误处理

```
onErrorCaptured
在捕获到组件中的错误时调用
用于处理错误,如:记录错误日志等
```

>注意：
>组件挂载的过程 
>模板编译：将组件的模板转换为JS代码
>渲染：在模板编译后生成的JS代码渲染到页面上,生成虚拟DOM
>挂载：在渲染完成后将虚拟DOM挂载到真实的DOM树上,使其在页面上显示出来

App.vue

```vue
<script setup>
  import { onMounted, onUpdated, ref } from 'vue'

  //在组件成功挂载到DOM并完成首次渲染后调用
  onMounted(() => {
    console.log("onMounted")
  })

  //在组件更新之后调用
  onUpdated(() => {
    console.log("onUpdated:",user.value)
  })

  const user = ref(0)
  console.log("user:",user.value)
</script>

<template>
  <h3>App.vue</h3>

  {{ user }}

  <button @click="user++">添加用户</button>
</template>

<style scoped>

</style>
```

### 10.toRef和toRefs

App.vue

```vue
<script setup>
  import { reactive, toRef, toRefs } from 'vue'

  /*
  let {name,url} = reactive({
    name:"邓瑞编程",
    url:"dengruicode.com"
  })
  */
  let web = reactive({
    name:"邓瑞编程",
    url:"dengruicode.com"
  })

  //toRefs将一个响应式对象的所有属性转换为ref对象
  //let {name,url} = toRefs(web)

  //toRef将一个响应式对象的某个属性转换为ref变量
  let url = toRef(web, "url")

  const setUrl = () => {
    console.log(url)
    url.value = "www.dengruicode.com"
  }
</script>

<template>
  {{ url }}

  <button @click="setUrl">设置网址</button>
</template>

<style scoped>

</style>
```

## 四、快速入门4

### 1.Pinia 简介

Pinia官网：[https://pinia.vuejs.org/zh](https://pinia.vuejs.org/zh)

Pinia是一个轻量级的状态管理库

状态管理库是用于管理应用程序全局状态的工具

- 以登录为例

使用Pinia创建一个userStore来集中管理用户的登录状态和过期时间

当用户登录成功时:
设置userStore中用户的登录状态为已登录,并设置过期时间

当用户退出登录时:
修改userStore中用户的登录状态为未登录,并删除过期时间


- Pinia 和 组件通信 的区别:

虽然Vue提供的父传子、子传父以及跨组件通信也可以用于状态共享,但在大型项目中,随着组件数量的增加,会导致以下问题：

1.组件之间传递大量的props,会使项目变得非常繁琐和难以维护
2.非父子组件间过度依赖provide/inject,使状态散落在各个组件之间

Pinia 可以解决以下问题:

1.全局状态管理
所有组件都可以访问和修改状态,而不用在每个组件内部进行状态管理

2.简化组件之间的通信
避免在组件之间传递大量的props

3.状态持久化
可以将应用程序的状态保存到本地存储中，在应用程序重启后会保留状态,对于登录等场景非常有用

总的来说,Pinia可以处理大型项目中复杂的状态管理需求,而父传子、子传父以及跨组件通信,可以解决一些简单的状态传递问题,更适合小型项目

- Pinia 和 localStorage 的区别

localStorage：

LocalStorage只能存储字符串类型的数据
LocalStorage有大小限制,通常为5MB左右

Pinia：

Pinia可以存储任何类型的数据,包括对象、数组等
Pinia没有大小限制,可以存储大量的数据

总的来说,对于复杂的状态管理需求,使用Pinia是更好的选择，而对于简单的状态管理需求,使用localStorage是更简单的解决方案

### 2.安装 Pinia 以及定义和使用 Store

- 安装Pinia

```shell
npm install pinia
```

main.js

```js
import { createApp } from 'vue'

//导入Pinia的createPinia方法,用于创建Pinia实例(状态管理库)
import { createPinia } from 'pinia'

import App from './App.vue'

//创建一个Pinia实例,用于在应用中集中管理状态(store)
const pinia = createPinia()

//createApp(App).mount('#app')
const app = createApp(App)
app.use(pinia) //将Pinia实例注册到Vue应用中
app.mount('#app')
```

web.js

```js
import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

/*
  定义一个基于 Pinia 的 Store
  第1个参数 web 是 useWebStore 在应用中的唯一标识符(ID)
  第2个参数是 Setup函数 或 Option对象
*/
export const useWebStore = defineStore('web', () => {
  //定义一个响应式对象，存储网站信息
  const web = reactive({
    title: "邓瑞编程",
    url: "dengruicode.com"
  })

  //定义一个响应式引用，存储用户数
  const users = ref(1000)
  
  //定义方法
  const userAdd = () => {
    users.value++
  }

  return {
    web,
    users,
    userAdd
  }
})
```

App.vue

```vue
<script setup>
    import { useWebStore } from './stores/web.js'

    const webStore = useWebStore()
    
    console.log("webStore.web:",webStore.web)
    console.log("webStore.users:",webStore.users)
</script>

<template>
    {{ webStore.web.url }}

    {{ webStore.users }}

    <button @click="webStore.userAdd" >添加用户</button>
</template>

<style scoped>

</style>
```

### 3.Pinia 持久化存储插件

Pinia官网：[https://prazdevs.github.io/pinia-plugin-persistedstate/zh](https://prazdevs.github.io/pinia-plugin-persistedstate/zh)

- 安装

```shell
npm i pinia-plugin-persistedstate
```

>注意：
>pinia持久化插件也是存储到localStorage中,为什么不直接使用localStorage?
>1.自动状态同步
>持久化插件自动将Pinia的状态存储到localStorage中，无需手动处理状态的读取和写入
>2.易用性
>无需手动处理localStorage的键值对存储、数据转换等繁琐过程
>3.与Vue组件状态紧密集成
>持久化插件与Vue组件的响应式数据完美结合
>当状态改变时,依赖这些状态的组件会自动更新视图
>与仅仅从localStorage中读取静态数据相比更加灵活和强大

main.js

```js
import { createApp } from 'vue'

//导入Pinia的createPinia方法,用于创建Pinia实例(状态管理库)
import { createPinia } from 'pinia'

//从 pinia-plugin-persistedstate 模块中导入 piniaPluginPersistedstate
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'

//创建一个Pinia实例,用于在应用中集中管理状态(store)
const pinia = createPinia()

//将插件添加到 pinia 实例上
pinia.use(piniaPluginPersistedstate)

//createApp(App).mount('#app')
const app = createApp(App)
app.use(pinia) //将Pinia实例注册到Vue应用中
app.mount('#app')
```

web.js

```js
import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

/*
  定义一个基于 Pinia 的 Store
  第1个参数 web 是 useWebStore 在应用中的唯一标识符(ID)
  第2个参数是 Setup函数 或 Option对象
*/
export const useWebStore = defineStore('web', () => {
  //定义一个响应式对象，存储网站信息
  const web = reactive({
    title: "邓瑞编程",
    url: "dengruicode.com"
  })

  //定义一个响应式引用，存储用户数
  const users = ref(1000)
  
  //定义方法
  const userAdd = () => {
    users.value++
  }

  return {
    web,
    users,
    userAdd
  }
},
{
  //持久化存储到 localStorage 中
  persist: true
})
```

## 五、Vue Router 快速掌握

### 1.安装和设置路由

Vue Router 官网：[https://router.vuejs.org/zh](https://router.vuejs.org/zh)

- 安装

```shell
npm install vue-router@4
```

demo\src\router\index.js

```js
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const routes = [
    {
        path: "/", // http://localhost:5173
        component: () => import("../views/index.vue")
    },
    {
        path: "/content", // http://localhost:5173/content
        component: () => import("../views/content.vue")
    },
]

const router = createRouter({
    //使用url的#符号之后的部分模拟url路径的变化,因为不会触发页面刷新,所以不需要服务端支持
    //history: createWebHashHistory(), 
    history: createWebHistory(),
    routes
})

export default router
```

demo\src\main.js

```js
import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

//use(router) 将Vue Router实例注册到Vue应用中
createApp(App).use(router).mount('#app')
```

demo\src\views\index.vue

```vue
<script setup>

</script>

<template>
    首页 - dengruicode.com
</template>

<style scoped></style>
```

demo\src\views\content.vue

```vue
<script setup>

</script>

<template>
    内容页 - 邓瑞编程
</template>

<style scoped></style>
```

demo\src\App.vue

```vue
<script setup>

</script>

<template>
  <router-view />
</template>

<style scoped></style>
```

### 2.配置路径别名@和VSCode路径提示

demo\vite.config.js  配置路径别名@

```js
  import { defineConfig } from 'vite'
  import vue from '@vitejs/plugin-vue'
  import path from 'path' //导入 node.js path

  // https://vitejs.dev/config/
  export default defineConfig({
    plugins: [vue()],
    resolve: {
      alias: { //配置路径别名
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
```

demo\jsconfig.json  VSCode路径提示 [js]

```js
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"] // 配置 @ 符号指向 src 目录及其子目录
      }
    }
  }
```

demo\src\router\index.js

```js
  import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"

  const routes = [
      {
          path: "/", // http://localhost:5173
          // component: () => import("../view/index.vue")
          component: () => import("@/view/index.vue")
      },
      {
          path: "/content", // http://localhost:5173/content
          component: () => import("@/view/content.vue")
      },
  ]

  const router = createRouter({
      // 使用url的#符号之后的部分模拟url路径的变化,因为不会触发页面刷新,所以不需要服务端支持
      // history: createWebHashHistory(), 
      history: createWebHistory(),
      routes
  })

  export default router
```

### 3.使用查询字符串或路径传递参数

demo\src\router\index.js

```js
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const routes = [
    {
        path: "/",
        // component: () => import("../views/index.vue")
        component: () => import("@/views/index.vue")
    },
    {
        path: "/content", // 使用查询字符串传递参数 http://localhost:5173/content?id=100&title=邓瑞编程
        component: () => import("@/views/content.vue")
    },
    {
        path: "/user/:id/name/:name", // 使用路径传递参数 http://localhost:5173/user/007/name/邓瑞
        component: () => import("@/views/user.vue")
    },
    {
        //可选参数 name? 表示该参数不是必需的
        path: "/userHistory/:id/name/:name?", // http://localhost:5173/userHistory/007/name
        component: () => import("@/views/user.vue")
    },
]

const router = createRouter({
    // 使用url的#符号之后的部分模拟url路径的变化,因为不会触发页面刷新,所以不需要服务端支持
    // history: createWebHashHistory(), 
    history: createWebHistory(),
    routes
})

export default router
```

demo\src\views\content.vue

```vue
<script setup>

</script>

<template>
    内容页 - 邓瑞编程
    <hr>

    id: {{ $route.query.id }} <br>
    title: {{ $route.query.title }}
</template>

<style scoped></style>
```

demo\src\views\user.vue

```vue
<script setup>

</script>

<template>
    个人主页 - www.dengruicode.com
    <hr>

    id: {{ $route.params.id }} <br>
    name: {{ $route.params.name }}
</template>

<style scoped></style>
```

### 4.router-link、定义别名、定义路由名称、编程式导航

demo\src\router\index.js

```js
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const routes = [
    {
        path: "/",
        //alias:"/home", //定义别名 http://localhost:5173/home
        alias: ["/home", "/index"], // http://localhost:5173/home http://localhost:5173/index
        // component: () => import("../views/index.vue")
        component: () => import("@/views/index.vue")
    },
    {
        path: "/content", // 使用查询字符串传递参数 http://localhost:5173/content?id=100&title=邓瑞编程
        component: () => import("@/views/content.vue")
    },
    {
        path: "/user/:id/name/:name", // 使用路径传递参数 http://localhost:5173/user/007/name/邓瑞
        component: () => import("@/views/user.vue")
    },
    {
        //可选参数 name? 表示该参数不是必需的
        path: "/userHistory/:id/name/:name?", // http://localhost:5173/userHistory/007/name
        name: "history", // 定义路由名称
        component: () => import("@/views/user.vue")
    },
]

const router = createRouter({
    // 使用url的#符号之后的部分模拟url路径的变化,因为不会触发页面刷新,所以不需要服务端支持
    // history: createWebHashHistory(), 
    history: createWebHistory(),
    routes
})

export default router
```

demo\src\views\index.vue

```vue
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()

let userId = 100
let userName = "邓瑞"

const goTo = () => {
    //router.push("/user/007/name/邓瑞")
    //router.push({ path: '/content', query: { id: 200, title: '邓瑞' } })
    router.push({ name: 'history', params: { id: '300', name: '邓瑞编程' } })
}
</script>

<template>
    首页 - dengruicode.com
    <hr>

    <router-link to="/content?id=100&title=邓瑞编程">查询字符串传参</router-link> <br>
    <router-link to="/user/007/name/邓瑞">路径传参</router-link> <br>

    <!-- 动态属性绑定 -->
    <router-link :to="{ path: '/content', query: { id: 200, title: '邓瑞' } }">查询字符串传参 - 动态属性绑定</router-link> <br>
    <router-link :to="{ path: `/user/${userId}/name/${userName}` }">路径传参 - 动态属性绑定</router-link> <br>

    <!-- 定义路由名称 -->
    <router-link :to="{ name: 'history', params: { id: '300', name: '邓瑞编程' } }">路径传参 - 定义路由名称</router-link> <br>

    <!-- 编程式导航 -->
    <button @click="goTo()">编程式导航</button>
</template>

<style scoped></style>
```

### 5.嵌套路由结合共享组件

demo\src\router\index.js

```js
	import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"

	const routes = [
	    {
	        path: "/",
	        //alias:"/home", //定义别名 http://localhost:5173/home
	        alias: ["/home", "/index"], // http://localhost:5173/home http://localhost:5173/index
	        // component: () => import("../views/index.vue")
	        component: () => import("@/views/index.vue")
	    },
	    {
	        path: "/content", // 使用查询字符串传递参数 http://localhost:5173/content?id=100&title=邓瑞编程
	        component: () => import("@/views/content.vue")
	    },
	    {
	        path: "/user/:id/name/:name", // 使用路径传递参数 http://localhost:5173/user/007/name/邓瑞
	        component: () => import("@/views/user.vue")
	    },
	    {
	        //可选参数 name? 表示该参数不是必需的
	        path: "/userHistory/:id/name/:name?", // http://localhost:5173/userHistory/007/name
	        name: "history", // 定义路由名称
	        component: () => import("@/views/user.vue")
	    },
	    {
	        path: "/vip", 
	        component: () => import("@/views/vip.vue"),
	        children: [ // 子路由
	            {
	                path: '', // 默认页 http://localhost:5173/vip
	                component: import("@/views/vip/default.vue")
	            },
	            {
	                path: 'order', // 会员订单 http://localhost:5173/vip/order
	                component: import("@/views/vip/order.vue")
	            },
	            {
	                path: 'info', // 会员资料 http://localhost:5173/vip/info
	                component: import("@/views/vip/info.vue")
	            }
	        ]
	    },
	]

	const router = createRouter({
	    // 使用url的#符号之后的部分模拟url路径的变化,因为不会触发页面刷新,所以不需要服务端支持
	    // history: createWebHashHistory(), 
	    history: createWebHistory(),
	    routes
	})

	export default router
```

demo\src\views\vip.vue

```vue
	<script setup>
	  //导入子组件
	  import Header from "@/components/header.vue"
	  import Footer from "@/components/footer.vue"
	</script>

	<template>
	    <!-- 共享的Header组件 -->
	    <Header/>

	    <!-- 根据不同的子路由加载不同子页面 -->
	    <router-view />

	    <!-- 共享的Footer组件 -->
	    <Footer/>
	</template>

	<style scoped>

	</style>
```

demo\src\views\vip\default.vue

```vue
	<script setup>

	</script>

	<template>
	    会员默认页
	</template>

	<style scoped>

	</style>
```

demo\src\views\vip\order.vue

```vue
	<script setup>

	</script>

	<template>
	    会员订单
	</template>

	<style scoped>

	</style>
```

demo\src\views\vip\info.vue

```vue
	<script setup>

	</script>

	<template>
	    会员资料
	</template>

	<style scoped>

	</style>
```

demo\src\components\header.vue

```vue
	<script setup>

	</script>

	<template>
	    <h3>header</h3>
	</template>

	<style scoped>

	</style>
```

demo\src\components\footer.vue

```vue
	<script setup>

	</script>

	<template>
	    <h3>footer</h3>
	</template>

	<style scoped>

	</style>
```

### 6.重定向

demo\src\router\index.js

```js
    import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"

    const routes = [
        {
            //可选参数 name? 表示该参数不是必需的
            path: "/userHistory/:id/name/:name?", // http://localhost:5173/userHistory/007/name
            name: "history", // 定义路由名称
            component: () => import("@/views/user.vue")
        },
        {
            path: "/vip", 
            component: () => import("@/views/vip.vue"),
            children: [ // 子路由
                {
                    path: '', // 默认页 http://localhost:5173/vip
                    component: import("@/views/vip/default.vue")
                },
                {
                    path: 'order', // 会员订单 http://localhost:5173/vip/order
                    component: import("@/views/vip/order.vue")
                },
                {
                    path: 'info', // 会员资料 http://localhost:5173/vip/info
                    component: import("@/views/vip/info.vue")
                }
            ]
        },
        {
            path: "/svip", // http://localhost:5173/svip
            //redirect: "/vip" // 重定向
            redirect: { name: 'history', params: { id: '100', name: 'David' } }
        },
    ]

    const router = createRouter({
        // 使用url的#符号之后的部分模拟url路径的变化,因为不会触发页面刷新,所以不需要服务端支持
        // history: createWebHashHistory(), 
        history: createWebHistory(),
        routes
    })

    export default router
```

### 7.全局前置守卫

demo\src\main.js

```js
import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

//createApp(App).mount('#app')
const app = createApp(App)
app.use(router)

//全局前置守卫
router.beforeEach((to, from, next) => {
    console.log("to:", to) //即将进入的路由的信息
    console.log("from:", from) //当前即将离开的路由信息

    next()

    /*
        if(to.name == "history"){
            next(false) //拦截
        }else{
            next() //继续
        }
    */
})

app.mount('#app')
```

## 六、ElementPlus 快速掌握

### 1.按钮

ElementPlus 官网：[https://element-plus.org/zh-CN](https://element-plus.org/zh-CN)

- 安装

```shell
npm install element-plus --save
```

demo\src\main.js

```js
import { createApp } from 'vue'

//整体导入 ElementPlus 组件库
import ElementPlus from 'element-plus' //导入 ElementPlus 组件库的所有模块和功能 
import 'element-plus/dist/index.css' //导入 ElementPlus 组件库所需的全局 CSS 样式

import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus) //将 ElementPlus 插件注册到 Vue 应用中
app.mount('#app')
```

demo\src\App.vue

```vue
<script setup>

</script>

<template>
  <h3>按钮</h3>
  <el-button>默认按钮</el-button>
  <el-button type="primary">主要按钮</el-button>
  <el-button type="success">成功按钮</el-button>
  <el-button type="info">信息按钮</el-button>
  <el-button type="warning">警告按钮</el-button>
  <el-button type="danger">危险按钮</el-button>

  <hr>
  <h3>按钮属性</h3>
  <el-button plain>朴素按钮</el-button>
  <el-button round>圆角按钮</el-button>
  <el-button circle>圆</el-button>
  <el-button disabled>禁用按钮</el-button>
  <el-button loading>加载中</el-button>

  <hr>
  <h3>尺寸</h3>
  <el-button size="large">大型按钮</el-button>
  <el-button>默认按钮</el-button>
  <el-button size="small">小型按钮</el-button>
</template>

<style scoped></style>
```

### 2.图标

ElementPlus 图标 ：[https://element-plus.org/zh-CN/component/icon.html#icon-collection](https://element-plus.org/zh-CN/component/icon.html#icon-collection)

demo\src\main.js

```js
import { createApp } from 'vue'

//整体导入 ElementPlus 组件库
import ElementPlus from 'element-plus' //导入 ElementPlus 组件库的所有模块和功能 
import 'element-plus/dist/index.css' //导入 ElementPlus 组件库所需的全局 CSS 样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //导入 ElementPlus 组件库中的所有图标

import App from './App.vue'

const app = createApp(App)

//注册 ElementPlus 组件库中的所有图标到全局 Vue 应用中
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus) //将 ElementPlus 插件注册到 Vue 应用中
app.mount('#app')
```

demo\src\App.vue

```vue
<script setup>

</script>

<template>

  <h3>图标</h3>
  <el-icon>
    <Plus />
  </el-icon>
  <el-icon>
    <Edit />
  </el-icon>
  <el-icon>
    <Delete />
  </el-icon>
  <el-icon class="is-loading">
    <Loading />
  </el-icon>

  <hr>
  <h3>属性</h3>
  <el-icon size="30" color="red">
    <Search />
  </el-icon>

  <hr>
  <h3>按钮</h3>
  <el-button type="primary">
    <el-icon>
      <Search />
    </el-icon>
    <span> 搜索 </span>
  </el-button>

  <el-button type="primary">
    <el-icon>
      <Search />
    </el-icon>
  </el-button>

  <el-button type="primary" circle>
    <el-icon>
      <Search />
    </el-icon>
  </el-button>

  <hr>
  <h3>按钮组</h3>
  <el-button-group>
    <el-button type="primary">
      <el-icon>
        <Plus />
      </el-icon>
    </el-button>

    <el-button type="primary">
      <el-icon>
        <Edit />
      </el-icon>
    </el-button>

    <el-button type="primary">
      <el-icon>
        <Delete />
      </el-icon>
    </el-button>
  </el-button-group>

</template>

<style scoped></style>
```

### 3.提示框

demo\src\App.vue

```vue
<script setup>
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

// 消息
const openMsg = () => {
  ElMessage({
    type: 'success', // success | warning | info | error
    message: 'dengruicode.com',
    showClose: true
  })
}

// 确认框
const openConfirm = () => {
  ElMessageBox.confirm('确认删除?', '标题', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    console.log('确认')
  }).catch(() => {
    console.log('取消')
  })
}

// 通知
const openNotify = () => {
  ElNotification({
    title: '标题',
    message: '邓瑞编程',
    duration: 1500 // 展示时间 [单位:毫秒]
  })
}

// 通知2
const openNotify2 = () => {
  ElNotification({
    type: 'success', // success | warning | info | error
    title: '标题',
    message: 'dengruicode.com',
    duration: 1500,
    position: 'bottom-right'
  })
}
</script>

<template>
  <el-button @click="openMsg">消息</el-button>
  <el-button @click="openConfirm">确认框</el-button>
  <el-button @click="openNotify">通知</el-button>
  <el-button @click="openNotify2">通知2</el-button>
</template>

<style scoped></style>
```

### 4.导航

demo\src\App.vue

```vue
<script setup>
import { reactive, ref } from 'vue'

//默认选中的菜单索引
//const selectedIndex = ref("2-2")
const selectedIndex = ref("3")

//选中菜单触发的回调
const selected = (index, indexPath) => {
  console.log("index", index, "indexPath", indexPath)
}

//默认展开的菜单索引
const defaultOpeneds = ref(["1", "3"])

//用户执行的命令
const userCommand = (command) => { //点击菜单触发的回调
  console.log("command:", command)
}
</script>

<template>

  <h3>水平导航</h3>
  <el-menu mode="horizontal" :default-active="selectedIndex" @select="selected">
    <el-menu-item index="1">邓瑞编程</el-menu-item>
    <el-sub-menu index="2">
      <template #title>我的工作台</template>
      <el-menu-item index="2-1">选项1</el-menu-item>
      <el-menu-item index="2-2">选项2</el-menu-item>
      <el-menu-item index="2-3">选项3</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="3">消息中心</el-menu-item>
    <el-menu-item index="4">订单管理</el-menu-item>
  </el-menu>


  <h3>水平导航-自定义样式</h3>
  <el-menu mode="horizontal" :default-active="selectedIndex" @select="selected" background-color="#545c64"
    text-color="#fff" active-text-color="#ffd04b" style="height: 40px; width: 600px;">
    <el-menu-item index="1">邓瑞编程</el-menu-item>
    <el-sub-menu index="2">
      <template #title>我的工作台</template>
      <el-menu-item index="2-1">选项1</el-menu-item>
      <el-menu-item index="2-2">选项2</el-menu-item>
      <el-menu-item index="2-3">选项3</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="3">消息中心</el-menu-item>
    <el-menu-item index="4">订单管理</el-menu-item>
  </el-menu>

  <h3>垂直导航</h3><br>
  <el-menu :default-active="selectedIndex" @select="selected" style="width: 200px;">
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <Search />
        </el-icon>
        <span>导航一</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="1-1">选项1</el-menu-item>
        <el-menu-item index="1-2">选项2</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon>
        <Edit />
      </el-icon>
      <template #title>导航二</template>
    </el-menu-item>
    <el-menu-item index="3">
      <el-icon>
        <Delete />
      </el-icon>
      <template #title>导航三</template>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon>
        <Setting />
      </el-icon>
      <template #title>导航四</template>
    </el-menu-item>
  </el-menu>

  <h3>垂直导航-默认展开和自定义样式</h3>
  <el-menu :default-active="selectedIndex" @select="selected" :default-openeds="defaultOpeneds"
    background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" style="width: 200px;">
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <Search />
        </el-icon>
        <span>导航一</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="1-1">选项1</el-menu-item>
        <el-menu-item index="1-2">选项2</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon>
        <Edit />
      </el-icon>
      <template #title>导航二</template>
    </el-menu-item>
    <el-sub-menu index="3">
      <template #title>
        <el-icon>
          <Search />
        </el-icon>
        <span>导航三</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="3-1">选项1</el-menu-item>
        <el-menu-item index="3-2">选项2</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-menu-item index="4">
      <el-icon>
        <Setting />
      </el-icon>
      <template #title>导航四</template>
    </el-menu-item>
  </el-menu>

  <h3>面包屑</h3>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item><a href="#">首页</a></el-breadcrumb-item>
    <el-breadcrumb-item>邓瑞编程</el-breadcrumb-item>
    <el-breadcrumb-item>dengruicode.com</el-breadcrumb-item>
  </el-breadcrumb>

  <h3>下拉菜单</h3><br>
  <el-dropdown @command="userCommand">
    <span>
      个人中心<el-icon>
        <User />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="order">订单</el-dropdown-item>
        <el-dropdown-item command="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

</template>

<style scoped></style>
```

### 5.标签页

demo\src\App.vue

```vue
<script setup>

import { ref, reactive } from 'vue'

//默认选中的标签名称
const selectedName = ref("2")

//选中标签触发的回调
const tabClick = (tab, event) => {
  console.log("tab", tab.props, "event", event)
}

const tab = reactive({
  arr: [
    { name: "1", title: '邓瑞', content: '内容1' },
    { name: "2", title: '邓瑞编程', content: '内容2' },
    { name: "3", title: 'dengruicode.com', content: '内容3' },
  ]
})

//添加
const tabAdd = () => {
  let index = tab.arr.length
  index++

  tab.arr.push({
    name: index,
    title: '新选项卡' + index,
    content: '内容' + index
  })
}

//移除
const tabRemove = (name) => {
  console.log("name:", name)

  const index = tab.arr.findIndex((value) => {
    return value.name === name
  })

  tab.arr.splice(index, 1) //移除元素
}

</script>

<template>

  <h3>标签页</h3>
  <el-tabs v-model="selectedName" @tab-click="tabClick">
    <el-tab-pane label="邓瑞" name="1">内容1</el-tab-pane>
    <el-tab-pane label="邓瑞编程" name="2">内容2</el-tab-pane>
    <el-tab-pane label="dengruicode.com" name="3">内容3</el-tab-pane>
  </el-tabs>

  <h3>卡片风格</h3>
  <el-tabs v-model="selectedName" @tab-click="tabClick" type="card">
    <el-tab-pane label="邓瑞" name="a">内容1</el-tab-pane>
    <el-tab-pane label="邓瑞编程" name="b">内容2</el-tab-pane>
    <el-tab-pane label="dengruicode.com" name="b">内容3</el-tab-pane>
  </el-tabs>

  <h3>带有边框的卡片风格</h3>
  <el-tabs v-model="selectedName" @tab-click="tabClick" type="border-card">
    <el-tab-pane label="邓瑞" name="A">内容1</el-tab-pane>
    <el-tab-pane label="邓瑞编程" name="B">内容2</el-tab-pane>
    <el-tab-pane label="dengruicode.com" name="C">内容3</el-tab-pane>
  </el-tabs>

  <h3>动态添加</h3>
  <el-button @click="tabAdd">添加</el-button>

  <el-tabs v-model="selectedName" @tab-remove="tabRemove" closable type="card">
    <el-tab-pane v-for="(value, key) in tab.arr" :key="value.name" :label="value.title" :name="value.name">
      {{ value.content }}
    </el-tab-pane>
  </el-tabs>

</template>

<style scoped></style>
```

### 6.输入框

demo\src\App.vue

```vue
<script setup>
import { ref } from 'vue'

const name = ref('')
const password = ref('')
const content = ref('邓瑞编程')
const url = ref('dengruicode.com')
const url2 = ref('dengruicode')
const email = ref('123456')

//const selected = ref('')
const selected = ref('2') //选中的下拉框
</script>

<template>
  <div style="width: 300px;">
    <!-- clearable 可一键清空 -->
    <h3>输入框</h3>
    <el-input v-model="name" clearable placeholder="请输入用户名" />

    <!-- show-password 可切换显示隐藏密码 -->
    <h3>密码框</h3>
    <el-input v-model="password" show-password placeholder="请输入密码" />

    <h3>文本域</h3>
    <el-input type="textarea" v-model="content" rows="2" />

    <h3>输入内容长度限制 - 输入框</h3>
    <el-input v-model="name" maxlength="10" show-word-limit />

    <h3>输入内容长度限制 - 文本域</h3>
    <el-input type="textarea" v-model="content" maxlength="20" rows="3" show-word-limit />

    <h3>尺寸</h3>
    大 <el-input size="large" />
    默认 <el-input />
    小 <el-input size="small" />

    <h3>前置</h3>
    <el-input v-model="url">
      <template #prepend>https://</template>
    </el-input>

    <h3>后置</h3>
    <el-input v-model="email">
      <template #append>@qq.com</template>
    </el-input>

    <h3>前置后置</h3>
    <el-input v-model="url2">
      <template #prepend>https://</template>
      <template #append>.com</template>
    </el-input>

    <h3>前置后置扩展 - 搜索</h3>
    <el-input placeholder="请输入课程名称">
      <template #prepend>
        <el-select v-model="selected" placeholder="请选择" style="width: 100px;">
          <el-option label="前端" value="1" />
          <el-option label="后端" value="2" />
          <el-option label="服务端" value="3" />
        </el-select>
      </template>
      <template #append>
        <el-button>
          <el-icon>
            <Search />
          </el-icon>
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<style scoped></style>
```

### 7.单选框、复选框

demo\src\App.vue

```vue
<script setup>
import { ref } from 'vue'

//单选框
const radio = ref("3")
const radio2 = ref("b")
const radio3 = ref("C")

const radioChange = (val) => {
  console.log("radioChange:", val)
}

const radioGroupChange = (val) => {
  console.log("radioGroupChange:", val)
}

//复选框
const checked = ref(["1", "2"])
const checked2 = ref([])

const checkboxGroupChange = (val) => {
  console.log("checkboxGroupChange", val)
}
</script>

<template>
  <h3>单选框</h3>
  <el-radio v-model="radio" value="1">前端</el-radio>
  <el-radio v-model="radio" value="2">后端</el-radio>
  <el-radio v-model="radio" value="3">服务端</el-radio>

  <h3>单选框 - 事件绑定</h3>
  <el-radio v-model="radio2" value="a" @change="radioChange">前端</el-radio>
  <el-radio v-model="radio2" value="b" @change="radioChange">后端</el-radio>
  <el-radio v-model="radio2" value="c" @change="radioChange">服务端</el-radio>

  <h3>单选框组</h3>
  <el-radio-group v-model="radio3" @change="radioGroupChange">
    <el-radio value="A">前端</el-radio>
    <el-radio value="B">后端</el-radio>
    <el-radio value="C">服务端</el-radio>
  </el-radio-group>

  <h3>复选框</h3>
  <el-checkbox-group v-model="checked">
    <el-checkbox value="1">前端</el-checkbox>
    <el-checkbox value="2">后端</el-checkbox>
    <el-checkbox value="3">服务端</el-checkbox>
  </el-checkbox-group>

  <h3>事件绑定</h3>
  <el-checkbox-group v-model="checked2" @change="checkboxGroupChange">
    <el-checkbox value="1">前端</el-checkbox>
    <el-checkbox value="2">后端</el-checkbox>
    <el-checkbox value="3">服务端</el-checkbox>
  </el-checkbox-group>
</template>

<style scoped></style>
```

### 8.下拉框

demo\src\App.vue

```vue
    <script setup>
        import { ref,reactive } from 'vue'
        
        const selected = ref('2')
        const selected2 = ref('')
        const selected3 = ref('C')
        const selected4 = ref(['1','3'])

        const data = reactive({
            options: [
                { value: 'A', label: '前端', },
                { value: 'B', label: '后端', },
                { value: 'C', label: '服务端', }
            ]
        })

        //回调
        const selectChange = (val) => {
            console.log("selectChange:", val)
        }
    </script>

    <template>
        <div style="width: 300px;">
            <h3>下拉框</h3>
            <el-select v-model="selected" placeholder="请选择">
                <el-option value="1" label="前端" />
                <el-option value="2" label="后端" />
                <el-option value="3" label="服务端" />
            </el-select>

            <h3>下拉框 - 事件绑定</h3>
            <el-select v-model="selected2" @change="selectChange" placeholder="请选择">
                <el-option value="a" label="前端" />
                <el-option value="b" label="后端" />
                <el-option value="c" label="服务端" />
            </el-select>

            <h3>动态下拉框</h3>
            <el-select v-model="selected3" placeholder="请选择">
                <el-option v-for="item in data.options" 
                :value="item.value" 
                :label="item.label"
                :key="item.value" />
            </el-select>

            <h3>多选 - multiple</h3>
            <el-select v-model="selected4" multiple @change="selectChange" placeholder="请选择">
                <el-option value="1" label="前端" />
                <el-option value="2" label="后端" />
                <el-option value="3" label="服务端" />
            </el-select>
        </div>
    </template>

    <style scoped>

    </style>
```

### 9.日期选择器

demo\src\main.js

```js
import { createApp } from 'vue'

//整体导入 ElementPlus 组件库
import ElementPlus from 'element-plus' //导入 ElementPlus 组件库的所有模块和功能 
import 'element-plus/dist/index.css' //导入 ElementPlus 组件库所需的全局 CSS 样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //导入 ElementPlus 组件库中的所有图标
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' //导入 ElementPlus 组件库的中文语言包

import App from './App.vue'

const app = createApp(App)

//注册 ElementPlus 组件库中的所有图标到全局 Vue 应用中
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

//app.use(ElementPlus) //将 ElementPlus 插件注册到 Vue 应用中s
app.use(ElementPlus, {
    locale: zhCn // 设置 ElementPlus 组件库的区域语言为中文简体
})
app.mount('#app')
```

demo\src\App.vue

```vue
<script setup>
import { ref } from 'vue'

const date = ref('')

const dateChange = (val) => {
  console.log("dateChange:", val)
}
</script>

<template>
  <h3>日期</h3>
  <el-date-picker v-model="date" type="date" placeholder="请选择" />

  <h3>日期时间</h3>
  <el-date-picker v-model="date" type="datetime" placeholder="请选择" />

  <h3>事件绑定</h3>
  <el-date-picker v-model="date" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" @change="dateChange" />
</template>

<style scoped></style>
```

### 10.表单

demo\src\App.vue

```vue
   <script setup>
  import { ref } from 'vue'

  const data = ref({
    name: '',
    radio: '',
    checkbox: [],
    date: '',
    select: '',
    multipleSelect: [],
    textarea: ''
  })

  const add = () => {
    console.log(data.value)
  }

  const reset = () => {
    data.value = {
      name: '',
      radio: '',
      checkbox: [],
      date: '',
      select: '',
      multipleSelect: [],
      textarea: ''
    }
  }
</script>

<template>
  <el-form label-width="80" style="width: 400px;">
    <el-form-item label="文本框">
      <el-input v-model="data.name" placeholder="请填写名称" />
    </el-form-item>

    <el-form-item label="单选框">
      <el-radio-group v-model="data.radio">
        <el-radio value="1">前端</el-radio>
        <el-radio value="2">后端</el-radio>
        <el-radio value="3">服务端</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="复选框">
      <el-checkbox-group v-model="data.checkbox">
        <el-checkbox value="a">前端</el-checkbox>
        <el-checkbox value="b">后端</el-checkbox>
        <el-checkbox value="c">服务端</el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item label="日期时间">
      <el-date-picker v-model="data.date" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
    </el-form-item>

    <el-form-item label="下拉框">
      <el-select v-model="data.select" placeholder="请选择">
        <el-option value="A" label="前端" />
        <el-option value="B" label="后端" />
        <el-option value="C" label="服务端" />
      </el-select>
    </el-form-item>

    <el-form-item label="多选框">
      <el-select v-model="data.multipleSelect" multiple placeholder="请选择">
        <el-option value="AA" label="前端" />
        <el-option value="BB" label="后端" />
        <el-option value="CC" label="服务端" />
      </el-select>
    </el-form-item>

    <el-form-item label="文本域">
      <el-input type="textarea" v-model="data.textarea" :rows="2" placeholder="请填写内容" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="add">添加</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
```

### 11.对话框

demo\src\App.vue

```vue
<script setup>
import { ref } from 'vue'

const data = ref({
  name: '',
  radio: '',
  checkbox: [],
  date: '',
  select: '',
  multipleSelect: [],
  textarea: ''
})

const add = () => {
  console.log(data.value)
}

const reset = () => {
  data.value = {
    name: '',
    radio: '',
    checkbox: [],
    date: '',
    select: '',
    multipleSelect: [],
    textarea: ''
  }
}

//对话框
const dialog = ref(false)

const dialogClose = () => {
  console.log("关闭")
}
</script>

<template>
  <el-button @click="dialog = true">打开</el-button>

  <!-- draggable 允许拖拽 -->
  <el-dialog v-model="dialog" width="500" title="标题" draggable @close="dialogClose">
    <el-form label-width="80">
      <el-form-item label="文本框">
        <el-input v-model="data.name" placeholder="请填写名称" />
      </el-form-item>

      <el-form-item label="单选框">
        <el-radio-group v-model="data.radio">
          <el-radio value="1">前端</el-radio>
          <el-radio value="2">后端</el-radio>
          <el-radio value="3">服务端</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="复选框">
        <el-checkbox-group v-model="data.checkbox">
          <el-checkbox value="a">前端</el-checkbox>
          <el-checkbox value="b">后端</el-checkbox>
          <el-checkbox value="c">服务端</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="日期时间">
        <el-date-picker v-model="data.date" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>

      <el-form-item label="下拉框">
        <el-select v-model="data.select" placeholder="请选择">
          <el-option value="A" label="前端" />
          <el-option value="B" label="后端" />
          <el-option value="C" label="服务端" />
        </el-select>
      </el-form-item>

      <el-form-item label="多选框">
        <el-select v-model="data.multipleSelect" multiple placeholder="请选择">
          <el-option value="AA" label="前端" />
          <el-option value="BB" label="后端" />
          <el-option value="CC" label="服务端" />
        </el-select>
      </el-form-item>

      <el-form-item label="文本域">
        <el-input type="textarea" v-model="data.textarea" rows="2" placeholder="请填写内容" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="add">添加</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped></style>
```

### 12.分页

demo\src\App.vue

```vue
<script setup>
const currentPage = (val) => {
  console.log("currentPage:", val)
}
</script>

<template>
  <h3>page-size:每页显示记录数 total:总记录数</h3>
  <el-pagination layout="prev, pager, next" :page-size="10" :total="50" />

  <h3>background:显示背景</h3>
  <el-pagination layout="prev, pager, next" :page-size="5" :total="50" background />

  <h3>layout="total" 显示总数</h3>
  <el-pagination layout="prev, pager, next, total" :page-size="5" :total="50" />

  <h3>layout="jumper" 跳转</h3>
  <el-pagination layout="prev, pager, next, jumper, total" :page-size="5" :total="50" />

  <h3>事件绑定</h3>
  <el-pagination layout="prev, pager, next" :page-size="5" :total="50" @current-change="currentPage" />
</template>

<style scoped></style>
```

### 13.表格

demo\src\App.vue

```vue
<script setup>
import { ref } from 'vue'

const data = ref({
  arr: [
    { id: '1', name: '邓瑞', web: 'dengruicode.com', date: '2023-06-20' },
    { id: '2', name: 'David', web: 'www.dengruicode.com', date: '2023-06-21' },
    { id: '3', name: 'Luna', web: 'dengruicode.com', date: '2023-06-22' },
    { id: '4', name: 'Lisa', web: 'www.dengruicode.com', date: '2023-06-22' }
  ]
})

//选中的复选框
let idArr = []
const selected = (data) => {
  //console.log("selected", data)

  idArr = [] //重置

  data.forEach((value) => {
    idArr.push(value.id)
  })

  console.log("idArr:", idArr)
}

//删除
const del = () => {
  console.log("del:", idArr)
}

//编辑
const edit = (index, row) => {
  console.log("index:", index, "row:", row)
}    
</script>

<template>
  <h3>表格</h3>
  <el-table :data="data.arr" style="width: 800px;">
    <el-table-column prop="id" label="编号" width="80" />
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="web" label="网站" width="300" />
    <el-table-column prop="date" label="日期" />
  </el-table>

  <h3>带边框表格</h3>
  <el-table :data="data.arr" border style="width: 800px;">
    <el-table-column prop="id" label="编号" width="80" />
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="web" label="网站" width="300" />
    <el-table-column prop="date" label="日期" />
  </el-table>

  <h3>设置高度固定表头</h3>
  <el-table :data="data.arr" border height="120" style="width: 800px;">
    <el-table-column prop="id" label="编号" width="80" />
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="web" label="网站" width="300" />
    <el-table-column prop="date" label="日期" />
  </el-table>

  <h3>type="selection" 多选</h3>
  <el-table :data="data.arr" border style="width: 800px;">
    <el-table-column type="selection" width="55" />

    <el-table-column prop="id" label="编号" width="80" />
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="web" label="网站" width="300" />
    <el-table-column prop="date" label="日期" />
  </el-table>

  <h3>按钮</h3>
  <el-button type="primary" @click="del">删除</el-button>

  <el-table :data="data.arr" @selection-change="selected" border style="width: 900px;margin: 3px 0;">
    <el-table-column type="selection" width="55"></el-table-column>

    <el-table-column prop="id" label="编号" width="80" />
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="web" label="网站" width="300" />
    <el-table-column prop="date" label="日期" />

    <el-table-column label="操作" width="150">
      <template #default="scope">
        <el-button size="small" type="primary" @click="edit(scope.$index, scope.row)">
          编辑
        </el-button>
        <el-button size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination layout="prev, pager, next, jumper, total" :page-size="5" :total="50" />
</template>

<style scoped></style>
```

### 14.按需导入

- 自动导入

```shell
#安装 unplugin-vue-components 和 unplugin-auto-import 插件
npm install -D unplugin-vue-components unplugin-auto-import
```

- 自动导入 图标

```shell
#安装 unplugin-icons 插件
npm install -D unplugin-icons
```

demo\vite.config.js

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

//unplugin
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite' //图标
import IconsResolver from 'unplugin-icons/resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue'],

      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver(),
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
      ],
    }),

    Icons({
      autoInstall: true,
    }),

  ],
})
```

demo\src\main.js

```js
import { createApp } from 'vue'

/*
//整体导入 ElementPlus 组件库
import ElementPlus from 'element-plus' //导入 ElementPlus 组件库的所有模块和功能 
import 'element-plus/dist/index.css' //导入 ElementPlus 组件库所需的全局 CSS 样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //导入 ElementPlus 组件库中的所有图标
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' //导入 ElementPlus 组件库的中文语言包
*/

import App from './App.vue'

const app = createApp(App)

/*
//注册 ElementPlus 组件库中的所有图标到全局 Vue 应用中
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
//app.use(ElementPlus) //将 ElementPlus 插件注册到 Vue 应用中s
app.use(ElementPlus, {
    locale: zhCn // 设置 ElementPlus 组件库的区域语言为中文简体
})
*/

app.mount('#app')
```

demo\src\App.vue

```vue
<script setup>
// 消息
const openMsg = () => {
  ElMessage({
    type: 'success', // success | warning | info | error
    message: 'dengruicode.com',
    showClose: true
  })
}

// 确认框
const openConfirm = () => {
  ElMessageBox.confirm('确认删除?', '标题', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    console.log('确认')
  }).catch(() => {
    console.log('取消')
  })
}

// 通知
const openNotifiy = () => {
  ElNotification({
    title: '标题',
    message: '邓瑞编程',
    duration: 1500 // 展示时间 [单位:毫秒]
  })
}

// 通知2
const openNotifiy2 = () => {
  ElNotification({
    type: 'success', // success | warning | info | error
    title: '标题',
    message: 'dengruicode.com',
    duration: 1500,
    position: 'bottom-right'
  })
}

const url = ref('dengruicode.com')
</script>

<template>
  <h3>按钮</h3>
  <el-button>默认按钮</el-button>
  <el-button type="primary">主要按钮</el-button>
  <el-button type="success">成功按钮</el-button>
  <el-button type="info">信息按钮</el-button>
  <el-button type="warning">警告按钮</el-button>
  <el-button type="danger">危险按钮</el-button>

  <h3>图标</h3>
  <!-- <el-icon><Plus /></el-icon> -->
  <el-icon><i-ep-Plus /></el-icon> <!-- i-ep- -->
  <el-icon>
    <IEpEdit />
  </el-icon> <!-- IEp- -->
  <el-icon>
    <IEpDelete />
  </el-icon>
  <el-icon class="is-loading">
    <IEpLoading />
  </el-icon>

  <h3>提示框</h3>
  <el-button @click="openMsg">消息</el-button>
  <el-button @click="openConfirm">确认框</el-button>
  <el-button @click="openNotifiy">通知</el-button>
  <el-button @click="openNotifiy2">通知2</el-button>

  <h3>输入框</h3>
  <el-input v-model="url" placeholder="请输入网址" />
</template>

<style scoped></style>
```



