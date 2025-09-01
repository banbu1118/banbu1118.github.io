## ES6 从入门到精通

邓瑞编程官方教程：[https://www.dengruicode.com/classes?uuid=04682448c47b45e980e57d476918d740](https://www.dengruicode.com/classes?uuid=04682448c47b45e980e57d476918d740)

配套学习视频资料：[https://www.bilibili.com/video/BV1Bh4y1q73A](https://www.bilibili.com/video/BV1Bh4y1q73A)

本教程未获取邓瑞编程授权，仅作用学习使用，无商业目的！！！

### 1.什么是ECMAScript？

```
什么是 ECMAScript?
ECMAScript [ek - ma - script] 在中文中, ECMAScript 可以读作 "伊克玛Script"

官方定义: ECMAScript 是定义脚本语言的规范, 而 JavaScript 是遵循 ECMAScript 规范实现的一种编程语言

通俗说法: ECMAScript 好比是一本书的目录, 而 JavaScript 是这本书的具体内容



ES6 和 JavaScript 有什么区别？
ES6(ECMAScript 2015)是ECMAScript规范的第六个版本,而JavaScript是基于ECMAScript规范实现的编程语言,

ES6可以被看作是 JavaScript 的一个重要的版本更新



ES6引入了"块级作用域",使用let和const关键字来声明变量和常量,使变量的作用域清晰可控

ES6引入了"箭头函数",箭头函数比传统的函数语法更简洁, 具有更少的冗余代码

ES6引入了"类(Class)"的概念,这是一种基于原型的面向对象编程的语法糖, 使用类可以更方便地创建和管理对象

ES6引入了"模板字符串", 使用反引号(`)创建字符串可以方便地嵌入变量和表达式

ES6引入了"解构赋值", 这是一种新的赋值语法,可以将数组或对象的属性直接赋值给变量

ES6引入了"函数参数默认值"

ES6引入了"Promise对象", 简化了异步编程, 使其更可读和可维护

ES6引入了 Set、Map 等

ES6引入了"模块化"(ES Module)

...



ES6 ~ ES13 新特性
ES6(ECMAScript 2015)

  let和const关键字用于声明块级作用域变量和常量

  箭头函数表达式

  类定义和继承

  模板字符串

  解构赋值

  函数参数默认值

  Promise 异步编程

  异步函数 async/await

  Map 和 Set 数据结构

  模块化 import 和 export

  

ES7(ECMAScript 2016)

  数组 includes() 方法

  指数运算符

  Array.prototype.includes()

  

ES8(ECMAScript 2017)

  async/await 异步编程解决方案的改进

  共享内存和原子操作的支持

  Object.values() 和 Object.entries()

  String.prototype.padStart() 和 String.prototype.padEnd()

  

ES9(ECMAScript 2018)

  异步迭代器

  Promise finally() 方法

  Rest/Spread 属性

  正则表达式具有命名捕获组

  

ES10(ECMAScript 2019)

  Array.prototype.flat() 和 Array.prototype.flatMap()

  Object.fromEntries()

  String.prototype.trimStart() 和 String.prototype.trimEnd()

  catch 块可以省略参数

  

ES11(ECMAScript 2020)

  可选链 ?. 和 Nullish 合并运算符 ??

  Promise.allSettled() 方法

  动态 import()

  全局对象globalThis

  

ES12(ECMAScript 2021)

  String.prototype.replaceAll()

  数字分隔符

  WeakRefs 弱引用

  Promise.any() 方法

  

ES13(ECMAScript 2022)

  Class fields 类字段

  SIMD(Single Instruction, Multiple Data)指令集

  更好的BigInt支持



ES6兼容性
https://compat-table.github.io/compat-table/es6
```

### 2.VSCode安装及使用

- 下载地址
 https://code.visualstudio.com

- 扩展

chinese插件

Live Server插件

### 3.变量和常量

- 什么是变量?

```
定义

    变量(Variable) 是用于存储数据的名称(标识符), 变量可以是任何类型, 如 "数值、字符串" 等

举例

    字符串

            姓名: 邓瑞

            网址: dengruicode.com

    整数 - 支付宝余额: 100元 0元 -100元

    浮点数 - 体重: 70.5公斤



    注

            整数: 没有小数部分的数字, 包括 负数、零、正数

代码

    //字符串类型 string

    let name = "邓瑞" //let 用于声明一个名为 "name" 的块级作用域变量, 并将其赋值为 "邓瑞"

    console.log("姓名:", name) //console.log() 用于打印输出信息到控制台窗口

    console.log("姓名类型:", typeof name) //typeof 数据类型



    //数值类型 number

    let balance = 100 //使用 number类型 表示整数

    console.log("余额:", balance)

    console.log("余额类型:", typeof balance)



    let weight = 70.5

    console.log("体重:", weight)

    console.log("体重类型:", typeof weight)



    //let weight = 60 //错误示范 在同一个作用域下不可以声明两个相同名称的变量



    //先声明后赋值

    let web

    web = "dengruicode.com"

    console.log("web:", web)



    注

            ES6不区分整型和浮点型, 所有数字都使用 number类型 来表示

```

- 什么是常量?

```
定义

常量(Constant) 是一个固定的值, 在程序运行中常量的值保持不变

举例

常量通常用来表示不会改变的值, 如数学中的 π(圆周率) PI≈3.14159265359

代码

const PI = 3.14 //const 用于声明一个名为 "PI" 的块级作用域常量, 并将其赋值为 3.14

console.log("PI", PI)
```

- 变量和常量有什么区别？

```
let age = 18

age = 22 //变量可以重新赋值

console.log("age:", age)

//PI = 3.1415926 //错误示范
```

### 4.数据类型

- 字符串类型 string

```
字符串类型 string
定义 字符串类型用于存储字符序列

代码

    let name = "邓瑞" //姓名为邓瑞

    let web = "dengruicode.com" //网址为 dengruicode.com



数值类型 number
定义 用于存储数字, 可以表示整数、浮点数

代码

    let balance = -100 //账户余额为-100元

    let weight = 60.5 //体重为60.5公斤



布尔类型 boolean
定义 布尔类型只能取两个值,true(真) 和 false(假)

代码

    let tv = true //电视 - true(开)



对象 object
定义 对象是一种复合的数据类型, 可以通过键值对的方式存储多个值

代码

    //定义了一个包含姓名、年龄和体重的对象

    let boy = {

            name: "David",

            age: 28,

            weight: 70.5

    }

    console.log("boy", boy)



map
定义 map 是一种特殊的数据结构,用于存储键值对的有序集合,

代码

    //定义了一个包含姓名、年龄和体重的map

    let girl = new Map([

            ["name", "Luna"],

            ["age", 20],

            ["weight", 50.5]

    ])

    console.log("girl", girl)



注

Map相对于对象提供了更灵活、有序、高效的键值对存储和操作方式,当需要在大量键值对中快速查找或删除特定键值对时, Map比对象更高效

Map提供了一些便捷的方法来操作键值对, 如: get()、set()、delete()

Map提供了一些便捷的迭代方法, 如: forEach()、keys()、values()、entries()



set
定义 Set 是一种特殊的数据结构, 用于存储无序且唯一的值的集合

代码

let number = new Set([1, 2, 3, 4, 5]) //定义了一个包含5个"不重复"的整数的集合

console.log("number", number)



//let numbers = new Set([1, 2, 3, 4, 5, 5]) //错误示范                



数组 array
定义 数组是一种有序集合, 可以包含不同类型的元素，并且数组的长度是可变的

代码

let str = ["a","b","c","b"] //定义了一个包含4个字符串的数组

console.log("str", str)



let arr = ["1","3.14","a"]

console.log("arr", arr)



函数 function
定义 函数是一段可重复执行的代码块，可以接收输入参数并返回一个值或执行某些操作

举例

function add(a, b) {

    return a + b

}

console.log("add", add(1, 2))



类 class
定义 类是一种蓝图或模板，用于创建具有相同属性和方法的对象

举例

class Person {

    constructor(name, age) {

            this.name = name

            this.age = age

    }



    info() {

            console.log("姓名", this.name, "年龄", this.age)

    }

}



const person = new Person("瑶瑶", 20)

person.info()
```

### 5.函数

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script>
        //定义函数
        function getWeb() {
            return "dengruicode.com"
        }
        console.log("网站", getWeb())

        //传参
        function add(number) {
            return number + 10
        }
        console.log("add", add(20))

        //默认值
        function getPage(page = 1) {
            return page
        }
        console.log("getPage - 默认值", getPage())
        console.log("getPage", getPage(6))

        /*
            匿名函数 [匿名函数没有显式的名称, 被视为一个函数表达式]
            匿名函数可以在不需要额外命名的情况下进行定义和使用, 通常被用作回调函数, 即将函数作为参数传递给其他函数
    
            回调函数是一种在特定事件或条件发生时被调用的函数, 回调函数通常用于异步编程中,
            比如 success 是 ajax 中的一个回调函数, 用于处理请求成功的结果
        */
        let sub = function (x, y) { //函数赋值给了一个变量 sub, 函数本身并没有一个具名标识符
            return x - y
        }
        console.log("sub", sub(30, 5))

        //箭头函数 [箭头函数是一种匿名函数]
        let plus = (a, b) => { //省略 function 添加 =>
            return a + b
        }
        console.log("plus", plus(5, 10))

        //隐式返回 [在函数体内只有一个表达式的情况下, 可以省略花括号 {} 和 return 关键字]
        let plus2 = (a, b) => a + b
        console.log("plus2", plus2(10, 20))
    </script>
</body>

</html>
```

### 6.数组

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script>
        //定义数组
        let arr = [10, 11]
        console.log("arr", arr)

        //向数组末尾添加一个或多个元素, 并返回修改后数组的长度
        let arrLength = arr.push(12, 13)
        console.log("arr", arr) //[10, 11, 12, 13]
        console.log("arrLength", arrLength)

        //向数组开头添加一个或多个元素, 并返回修改后数组的长度
        arrLength = arr.unshift(8, 9)
        console.log("arr", arr) //[8, 9, 10, 11, 12, 13]
        console.log("arrLength", arrLength)

        //删除数组中第一个元素, 并返回被删除元素
        let delElement = arr.shift()
        console.log("arr", arr) //[9, 10, 11, 12, 13]
        console.log("delElement", delElement) //8

        //删除数组最后一个元素, 并返回被删除元素
        delElement = arr.pop()
        console.log("arr", arr) //[9, 10, 11, 12]
        console.log("delElement", delElement) //13

        //删除元素, 并返回包含被删除元素的数组 splice(要删除元素的索引位置, 要删除的元素数量)
        //let delArr = arr.splice(2, 1) // 删除第3个元素 [数组的索引是从 0 开始]
        let delArr = arr.splice(2, 2) // 删除第3和第4个元素
        console.log("arr", arr) //[9, 10]
        console.log("delArr", delArr) //[11, 12]

        //颠倒数组中元素的顺序
        arr.reverse()
        console.log("arr", arr) //[10, 9]

        //数组中的元素按照首字母顺序排序
        let arr2 = ['banana', 'apple', 'orange']
        arr2.sort()
        console.log("arr2", arr2) //['apple', 'banana', 'orange']

        //数组中的元素按照数字排序
        let arr3 = [5, 20, 13, 1, 4]
        //arr3.sort() //默认情况下 sort() 方法使用字符串排序, 导致并没有按照数字大小排序
        /*
        比较函数 (a, b) => a - b 接收两个参数 a 和 b, 用于比较这两个元素的大小, 返回 a - b 的结果决定了 sort() 方法的排序顺序
        若 a < b, 则 a - b 是一个负数, 表示 a 应该在 b 前面
        若 a = b, 则 a - b 是 0, 位置保持不变
        若 a > b, 则 a - b 是一个正数, 表示 a 应该在 b 后面
        */
        arr3.sort((a, b) => a - b)
        console.log("arr3", arr3) //[1, 4, 5, 13, 20]

        //筛选符合条件的元素, 返回一个新的数组
        let arr4 = [10, 11, 12, 13, 14, 15]
        let newArr = arr4.filter((value) => {
            return value > 12
        })
        console.log("newArr", newArr) //[13, 14, 15]

        //将多个数组或值合并为一个新数组
        let arr5 = ["十六", "十七", "十八"]
        //newArr = arr3.concat(arr5) //[1, 4, 5, 13, 20, '十六', '十七', '十八']
        newArr = arr4.concat(arr5, 19, 20) //[10, 11, 12, 13, 14, 15, '十六', '十七', '十八', 19, 20]
        console.log("newArr", newArr)

        //使用for...of循环遍历数组
        let arr6 = ["邓瑞", "dengruicode.com", 100] //数组可以包含不同的数据类型
        for (let item of arr6) {
            console.log("for...of", item)
        }

        //使用forEach方法来遍历数组
        arr6.forEach((value, index) => {
            console.log("forEach", value, "index", index)
        })
    </script>
</body>

</html>
```

### 7.Set集合、扩展运算符

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script>
        //创建Set集合
        //let fruits = new Set() //创建一个空的Set集合
        let fruits = new Set(['apple', 'orange', 'banana']) //创建一个包含初始值的Set集合

        //向Set集合中添加新的元素
        fruits.add('mango')
        //fruits.add("orange") //若该元素已经存在, 则不会重复添加, 因为 Set 中的元素必须唯一
        console.log("fruits", fruits)

        //从Set集合中删除元素
        fruits.delete('banana')
        console.log("fruits", fruits)

        //检查Set集合是否包含指定元素
        console.log("fruits.has", fruits.has('banana'))

        //获取Set集合的大小
        console.log("fruits.size", fruits.size)

        //使用 Array.from() 方法将 Set集合 转换为 数组
        let arr = Array.from(fruits)
        console.log("arr", arr)

        //使用扩展运算符将 Set集合 转换为 数组
        let arr2 = [...fruits]
        console.log("arr2", arr2)

        //扩展运算符是用于展开可迭代对象(如数组、字符串等)
        //let web = 'dengruicode.com'
        let web = '邓瑞编程'
        let webArr = [...web] //使用扩展运算符将 字符串 转换为 数组
        console.log("webArr", webArr) //['邓', '瑞', '编', '程']

        //使用for...of循环遍历 Set集合
        for (let item of fruits) {
            console.log("for...of", item)
        }

        //使用forEach方法来遍历 Set集合
        fruits.forEach(value => {
            console.log("forEach", value)
        })

        //清空 Set
        fruits.clear()
        console.log("fruits.size", fruits.size)

        //将 数组 转换为 Set集合 实现数组去重
        let numberArr = [1, 2, 3, 3, 2, 1]
        let numberSet = new Set(numberArr)
        console.log(numberSet)
    </script>
</body>

</html>
```

### 8.Map 集合

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script>
        //创建Map集合
        //let person = new Map() //创建一个空的Map集合
        let person = new Map([
            ["name", "邓瑞"],
            ["gender", "男"],
            ["web", "dengruicode.com"]
        ])

        //向Map集合中添加新的元素
        person.set('height', 175)
        //在Map集合中, 每个键都是唯一的, 当使用相同的键再次调用 set() 方法时, 会替换原来键对应的值
        person.set('web', "www.dengruicode.com")
        console.log("person", person)

        //删除元素
        person.delete('gender')
        console.log("person", person)

        //检查Map集合是否包含指定元素
        console.log("person.has", person.has('gender'))

        //获取Map集合的大小
        console.log("person.size", person.size)

        //将Map集合转换为数组
        let arr = Array.from(person)
        console.log("arr", arr)

        //使用扩展运算符将 Map集合 转换为 数组
        let arr2 = [...person]
        console.log("arr2", arr2)

        //使用for...of循环遍历Map集合
        //解构可以从数组或对象中提取值并赋给变量
        //[key, value] 就是一种解构语法, 用于将 Map 集合中的键值对解构为 key 和 value 两个变量
        for (let [key, value] of person) {
            console.log("for...of", key, value)
        }

        //使用forEach方法遍历Map集合的键值对
        person.forEach((value, key) => {
            console.log("forEach", key, value)
        })

        //清空Map集合
        person.clear()
        console.log("person.size", person.size)
    </script>
</body>

</html>
```

### 9.对象

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script>
        let person = {
            name: "邓瑞",
            gender: "男",
            web: "dengruicode.com",
        }

        //向对象中添加新的属性
        person.height = 175
        //在对象中，每个键都是唯一的，当使用相同的键再次赋值时，会替换原来键对应的值
        person.web = "www.dengruicode.com"
        console.log("person", person)

        //删除属性
        delete person.gender
        console.log("person", person)

        //检查对象是否包含指定属性
        let has = "gender" in person
        console.log("has", has)

        //获取对象的属性数量
        console.log("keysArr", Object.keys(person)) //Object.keys() 用于获取对象属性名的数组
        console.log("length", Object.keys(person).length)

        //将对象转换为数组
        let arr = Object.entries(person) //Object.entries() 用于获取对象的键值对数组
        console.log("arr", arr)

        //使用for...in循环遍历对象 
        //for...of 用于遍历可迭代对象[如数组、Set、Map、字符串等]
        //for...in 用于遍历对象的可枚举属性
        for (let key in person) {
            console.log("for...in", key, person[key])
        }

        //使用forEach方法遍历对象的属性和值
        Object.entries(person).forEach(([key, value]) => {
            console.log("forEach", key, value)
        })

        //清空对象
        person = {}
        console.log("length", Object.keys(person).length)
    </script>
</body>

</html>
```

### 10.类class、模板字符串

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script>
        class Person {
            //若在类中没有显式声明属性, 但在构造函数或方法中引用了未声明的属性, 会自动将其视为实例属性
            name //姓名
            web //个人网站

            //构造函数 用于初始化属性
            constructor(name, web) {
                this.name = name
                this.web = web
            }

            //方法 返回个人信息
            info() {
                //return "姓名:" + this.name + " 个人网站:" + this.web
                return `姓名:${this.name} 个人网站:${this.web}` //模板字符串
            }
        }

        //在面向对象编程中, 实例(instance) 是根据 类(class) 创建的具体对象, 使用 关键字new 可以创建一个类的实例
        //创建 Person类 实例 传入 "姓名"、"个人网站" 参数
        let person = new Person("邓瑞", "dengruicode.com")

        console.log("person", person)
        console.log("web", person.web)
        console.log("info", person.info())
    </script>
</body>

</html>
```

### 11.私有属性、存取器

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script>
        class Person {
            name
            #web //私有属性是指仅在类内部可访问和操作的属性, 外部无法直接访问和修改

            constructor(name, web) {
                this.name = name
                this.#web = web
            }

            //使用存取器 getter 获取私有属性
            get web() {
                return this.#web
            }

            //使用存取器 setter 设置私有属性
            set web(value) {
                this.#web = value
            }

            info() {
                return `姓名:${this.name} 个人网站:${this.web}`
            }
        }

        let person = new Person("邓瑞", "dengruicode.com")

        console.log("person", person)
        console.log("web", person.web) //使用存取器 getter 获取私有属性
        console.log("info", person.info())

        person.web = "www.dengruicode.com" //使用存取器 setter 设置私有属性
        console.log("web", person.web)
    </script>
</body>

</html>
```

### 12.继承 extends

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script>
        //父类
        class Person {
            name
            gender

            constructor(name, gender) {
                this.name = name
                this.gender = gender
            }

            sleep() {
                return `${this.name} 休息中...`
            }
        }

        //子类
        class David extends Person {
            web

            constructor(name, gender, web) {
                super(name, gender) //调用父类构造函数

                this.web = web
            }

            eat() {
                return `${this.name} 正在吃饭...`
            }
        }

        let david = new David("邓瑞", "男", "dengruicode.com")

        console.log("david", david)
        console.log("web", david.web)
        console.log("eat", david.eat())

        console.log("gender", david.gender)
        console.log("sleep", david.sleep())

    </script>
</body>

</html>
```

### 13.解构

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script>
        //解构 可以从数组或对象中提取值并赋给变量
        //--- 数组解构
        let [x, y] = [1, 2]
        console.log("x:", x, "y:", y)

        let [, , c] = [10, 20, 30]
        console.log("c:", c)

        //扩展运算符
        let [A, ...B] = [1, 2, 3, 4, 5, 6]
        console.log("A:", A, "B:", B)

        let [x2, y2 = 200] = [100] //默认值
        console.log("x2:", x2, "y2:", y2)

        //两数交换
        let x3 = 10
        let y3 = 20; //不加分号会报错
        [x3, y3] = [y3, x3]
        console.log("x3:", x3, "y3:", y3)

        //--- 对象解构
        let person = {
            name: '邓瑞',
            gender: '男',
            web: 'dengruicode.com'
        }

        let { name } = person
        console.log("name:", name)

        //重命名
        let { name: userName, gender, web } = person
        console.log("userName:", userName, "gender:", gender, "web:", web)

        //默认值
        let { address = "安徽" } = person
        console.log("address:", address)
    </script>
</body>

</html>
```

### 14.字符串

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script>
        let web = "dengruicode.com"

        // 字符串长度
        let len = web.length
        console.log("字符串长度:", len)

        // 转小写
        let str1 = "DAVID".toLowerCase()
        console.log("转小写:", str1)

        // 转大写
        let str2 = "luna".toUpperCase()
        console.log("转大写:", str2)

        // 返回字符串在索引处的字符
        let str3 = web[2]
        console.log("返回字符串在索引处的字符:", str3)

        // 字符串转为字符数组
        let str4 = [...web]
        console.log("字符串转为字符数组:", str4)

        // 字符串转 int
        let number = parseInt("168")
        console.log("字符串转int:", number)

        // 字符串替换
        let str6 = web.replaceAll("co", "y")
        console.log("替换全部字符串:", str6)

        let str7 = web.replace("co", "y")
        console.log("替换1个字符串:", str7)

        // 去除字符串两侧指定的字符
        let str8 = "   dengruicode.com   ".trim()
        console.log("去除字符串两侧指定的字符:", str8)

        // 判断是否包含某个字符串
        let result = web.includes("dengrui") // true
        console.log("是否包含某个字符串:", result)

        // 返回字符串中第一次出现某个字符串的位置,若不存在则返回-1
        let result2 = web.indexOf("dengrui")
        console.log("返回字符串中第一次出现某个字符串的位置:", result2)

        let result3 = "www.dengruicode.com".indexOf("dengrui")
        console.log("返回字符串中第一次出现某个字符串的位置:", result3)

        // 判断一个字符串是否以指定的前缀开头
        let result4 = "www.dengruicode.com".startsWith("www")
        console.log("判断一个字符串是否以指定的前缀开头:", result4)

        // 判断一个字符串是否以指定的后缀结尾
        let result5 = "www.dengruicode.com".endsWith("net")
        console.log("判断一个字符串是否以指定的后缀结尾:", result5)

        // 将字符串按照指定字符分割成数组
        let arr = "a,b,c,d".split(",")
        console.log("将字符串按照指定字符分割成数组:", arr)

        // 字符串截取 substr(开始位置,截取长度)
        let subStr = web.substr(0, 7) //dengrui
        console.log("截取字符串的前7个字符:", subStr)

        let subStr2 = web.substr(-3) //com
        console.log("截取字符串的最后3个字符:", subStr2)

        let subStr3 = web.substr(4) //ruicode.com [字符串下标是从 0 开始]
        console.log("从字符串的第5个位置开始截取直至字符串末尾:", subStr3)

        //重复字符串
        let repeatstr = "David".repeat(3)
        console.log("重复3次字符串", repeatstr)

        //在字符串前添加指定数量的填充字符, 直到该字符串达到指定的长度
        let padStart = "David".padStart(15, "-") //由于 David 占 5 个字符, 因此只需要再添加 10 个横线, 即可达到总长度 15
        //let padStart = "David".padStart(15) //默认空格
        console.log("padStart:", padStart)

        //在字符串后添加指定数量的填充字符, 直到该字符串达到指定的长度
        let padEnd = "David".padEnd(10, "-")
        console.log("padEnd:", padEnd)
    </script>
</body>

</html>
```

### 15.Promise

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script>
        /*
                    Promise 表示承诺在未来的某个时刻可能会完成并返回结果
        
                    对于某些需要时间来处理结果的操作, 如用户登录、读取文件等, 可以使用 Promise 对象来执行异步操作
                    Promise 对象有三种状态 pending(待处理)、fulfilled(已履行)、rejected(被驳回)
        
                    当创建一个 Promise 对象时, 它的初始状态为 pending, 表示异步执行还未完成
                    当异步执行成功时, 会调用 resolve 函数把 Promise 对象的状态改变为 fulfilled, 可通过 then 方法来获取异步操作的结果
                    当异步执行异常时, 会调用 reject 函数把 Promise 对象的状态更改为 rejected, 可通过 catch 方法来处理错误
        
                    注
                        异步操作是指在程序执行过程中, 某个操作不会立即返回结果, 而是需要一段时间的等待
                */

        /*
            let promise = new Promise((resolve, reject) => {
                
            })

            //当创建一个 Promise 对象时, 它的初始状态为 pending, 表示异步执行还未完成
            console.log("promise:", promise) //pending
        */

        /*
            let promise = new Promise((resolve, reject) => {
                resolve("邮件发送成功") //异步执行成功
            })
            //当异步执行成功时, 会调用 resolve 函数把 Promise 对象的状态改变为 fulfilled, 可通过 then 方法来获取异步操作的结果
            console.log("promise:", promise) //fulfilled

            promise.then(result => {
                console.log("result:", result)
            })
        */

        /*
            let promise = new Promise((resolve, reject) => {
                reject("邮件发送失败") //异步执行失败
            })
            //当异步执行失败时, 会调用 reject 函数把 Promise 对象的状态更改为 rejected, 可通过 catch 方法来处理错误
            console.log("promise:", promise) //rejected

            promise.catch(error => {
                console.log("error:", error)
            })
        */

        let promise = new Promise((resolve, reject) => {
            //resolve("邮件发送成功")
            reject("邮件发送失败")
        }).then(result => {
            console.log("result:", result)
        }).catch(error => {
            console.log("error:", error)
        }).finally(() => {
            console.log("异步执行结束")
        })
    </script>
</body>

</html>
```

### 16.Fetch

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script>
        /*
               fetch 是基于 Promise 的 api, 它可以发送http请求并接收服务器返回的响应数据
               fetch 返回的是一个 Promise 对象
           */

        //get请求
        fetch('http://127.0.0.1/get').then(response => {
            //返回的解析后的json数据会传递给下一个 then() 方法中的回调函数作为参数,这个参数就是 data
            return response.json() //response.json() 用于将响应数据解析为json格式的数据
        }).then(data => { //data 解析后的json数据
            console.log("get.data:", data)
        }).catch(error => {
            console.log("get.error:", error.message)
        }).finally(() => {
            console.log("get.finally")
        })

        //post请求 post
        fetch('http://127.0.0.1/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({//URLSearchParams 用于处理键值对类型的数据,并将其编码为url查询字符串
                name: '邓瑞',
                web: 'dengruicode.com',
            }),
        }).then(response => {
            return response.json()
        }).then(data => {
            console.log("post.data:", data)
        }).catch(error => {
            console.log("post.error:", error.message)
        }).finally(() => {
            console.log("post.finally")
        })

        //post请求 postJson
        fetch('http://127.0.0.1/postJson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({//JSON.stringify 用于将对象转换为json字符串
                name: '邓瑞编程',
                web: 'www.dengruicode.com',
            }),
        }).then(response => {
            return response.json()
        }).then(data => {
            console.log("postJson.data:", data)
        }).catch(error => {
            console.log("postJson.error:", error.message)
        }).finally(() => {
            console.log("postJson.finally")
        })
    </script>
</body>

</html>
```

### 17.安装和配置Node.js

- 下载地址

[https://nodejs.org/zh-cn](https://nodejs.org/zh-cn)

- 查看安装的版本

```shell
node -v
npm -v
```

- 查看当前镜像源

```shell
npm get registry
```

- 设置淘宝镜像源

```shell
npm config set registry https://registry.npmmirror.com/
```

> Node.js是一个开源的JavaScript运行时环境, 用于在服务器端运行JavaScript代码
>    
> npm(Node Package Manager)是Node.js包管理器, 用来安装各种库、框架和工具
>    
>   比如: npm install axios
>
>    axios 使用 unpkg CDN
>    
>    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

### 18.Axios

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="./axios.min.js"></script>
</head>

<body>
    <script>
        /*
    Axios 是基于 Promise 的网络请求库, 它可以发送http请求并接收服务器返回的响应数据
    Axios 返回的是一个 Promise 对象

    Axios 不仅可以用于浏览器, 也可以用于 Node.js, 而 Fetch 主要用于浏览器
    */

        //get请求
        axios.get('http://127.0.0.1/get').then(response => {
            console.log("get.data:", response.data)
        }).catch(error => {
            console.log("get.error:", error)
        }).finally(() => {
            console.log("get.finally")
        })

        //post请求 post
        let data = { //参数
            name: '邓瑞',
            web: 'dengruicode.com',
        }

        axios.post('http://127.0.0.1/post', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
            console.log("post.data:", response.data)
        }).catch(error => {
            console.log("post.error:", error)
        }).finally(() => {
            console.log("post.finally")
        })

        //post请求 postJson [axios 的默认请求头是 application/json]
        axios.post('http://127.0.0.1/postJson', data).then(response => {
            console.log("postJson.data:", response.data)
        }).catch(error => {
            console.log("postJson.error:", error)
        }).finally(() => {
            console.log("postJson.finally")
        })
    </script>
</body>

</html>
```

### 19.模块化开发

模块化开发是指将复杂的代码拆分为独立的模块,每个模块负责完成特定的功能,

不同的模块之间可以通过使用export关键字将代码导出为模块,其他模块可以使用import关键字导入该模块

```
//index.js
let title = "邓瑞编程"
let web = "dengruicode.com"

/*
let getWeb = () => {
    return "www.dengruicode.com"
}
*/
let getWeb = () => "www.dengruicode.com"

export { title, web, getWeb } //将多个变量或函数分别导出

<script type="module">
    //从 index.js 文件中导入 title、web、getWeb 变量/函数
    import { title as webTitle, web, getWeb } from './index.js'

    console.log(webTitle)
    console.log(web)
    console.log(getWeb())
</script>

------ default
//index.js
let title = "邓瑞编程"
let web = "dengruicode.com"

let getWeb = () => "www.dengruicode.com"

//将一个对象作为整体导出, 导出的对象包含 title、web、getWeb 三个属性
export default { title, web, getWeb }

<script type="module">
    import obj from "./index.js"

    console.log(obj.title)
    console.log(obj.web)
    console.log(obj.getWeb())
</script>

------ as
//index.js
let title = "邓瑞编程"
let web = "dengruicode.com"
let getWeb = () => "www.dengruicode.com"
export { title, web, getWeb } //将多个变量或函数分别导出

<script type="module">
    import * as obj from "./index.js"

    console.log(obj.title)
    console.log(obj.web)
    console.log(obj.getWeb())
</script>
注

   import * as obj 用于避免命名冲突
```

### 20.async、await 使用同步的方式编写异步代码

- 同步

代码按照编写顺序逐行执行,后续的代码必须等待当前正在执行的代码完成之后才能执行

当遇到耗时的操作(如网络请求等)时,主线程会被阻塞,直到该操作完成

举例：在单车道路段上发生交通事故导致交通堵塞, 只有拖走事故车辆后, 后续车辆才能继续行驶

- 异步

当遇到耗时的操作发生时, 主线程不会被阻塞, 主线程会继续执行后续的代码, 而非等待耗时操作完成

举例：在具有多车道的高速公路上, 发生交通事故后, 可以走其他车道继续行驶

- async

当一个函数被标记为 async 后, 该函数会返回一个 Promise 对象

- await

只能在 async 函数内部使用, 加上 await 关键字后, 会在执行到这一行时暂停函数的剩余部分，

等待网络请求完成,然后继续执行并获取到请求返回的数据

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="./axios.min.js"></script>
</head>

<body>
    <script>

        //回调地狱是指过度使用嵌套的回调函数,导致代码难以阅读和维护
        //get请求
        axios.get('http://127.0.0.1/get').then(response => {
            console.log("get.data:", response.data)
            if (response.data.data.web == "dengruicode.com") {

                //get请求2
                return axios.get('http://127.0.0.1/article/get/id/1').then(response2 => {
                    console.log("get2.data:", response2.data)
                    if (response2.data.data.name == "邓瑞") {

                        //get请求3
                        return axios.get('http://127.0.0.1/article/get/search/title/入门').then(response3 => {
                            console.log("get3.data:", response3.data)
                        })
                    }
                })
            }
        }).catch(error => {
            console.log("get.error:", error)
        }).finally(() => {
            console.log("get.finally")
        })

        //async/await 使用同步的方式编写异步代码, 避免回调地狱
        //优势 在处理多个异步操作的情况下, 可以使代码更简洁易读
        const getData = async () => {
            try {
                //get请求
                const response = await axios.get('http://127.0.0.1/get')
                console.log("async.get.data:", response.data)
                if (response.data.data.web === "dengruicode.com") {

                    //get请求2
                    const response2 = await axios.get('http://127.0.0.1/article/get/id/1')
                    console.log("async.get2.data:", response2.data)
                    if (response2.data.data.name === "邓瑞") {

                        //get请求3
                        const response3 = await axios.get('http://127.0.0.1/article/get/search/title/入门')
                        console.log("async.get3.data:", response3.data)
                    }
                }

            } catch (error) {
                console.log("async.get.error:", error)
            } finally {
                console.log("async.get.finally")
            }
        }

        getData()

    </script>
</body>

</html>
```

