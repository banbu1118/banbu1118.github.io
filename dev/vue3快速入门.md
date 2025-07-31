# vue3快速入门

## 一、vue3快速入门

配套学习视频资料：[邓瑞编程-3小时学会vue3](https://www.bilibili.com/video/BV1nV411Q7RX)

邓瑞编程官方教程：[https://www.dengruicode.com/study?uuid=58893cef7e824a02b16039129d59713c](https://www.dengruicode.com/study?uuid=58893cef7e824a02b16039129d59713c)

vue中文官网：[https://cn.vuejs.org/](https://cn.vuejs.org/)

本教程未获取邓瑞编程授权，仅作用学习使用，无商业目的

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


