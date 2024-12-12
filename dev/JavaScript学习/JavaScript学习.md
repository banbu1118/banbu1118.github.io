# JavaScript学习

## 一、代码

### 1、入门

#### 1.1 helloworld

js例子

```js
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
    <script>
        // alert("Hello World!")

        // console.log("你猜我在哪里？")

        document.write("Hello World!")
    </script>
</head>
<body>
    
</body>
</html>
```

#### 1.2 编写位置

js可以编写到多个位置

```javascript
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>js的编写位置</title>
    <!--
        1.可以将js编写到网页内部的<script>标签中
    -->

    <!-- <script type="text/javascript">
        //type="text/javascript" 可以省略
        alert("Hello, World!");
    </script> -->

    <!--
        2.可以将js编写到外部的js文件中，然后在网页中通过<script>标签引入
    -->
    <!-- <script src="scripts.js"></script> -->
</head>

<body>
    <!-- 3.可以将js代码编写到指定属性中 -->
    <button onclick="alert('你点我干嘛')">点击我一下</button>
    <hr>
    <a href="javascript:alert('你点我干嘛')">超链接</a>
</body>

</html>
```

#### 1.3 基本语法

注释，大小写，分号，空格和换行

```javascript
    <script>
        /*
        1.多行注释
            - 注释中的内容会被忽略执行
            - 可以通过注释来对代码进行解释说明
            - 也可以通过注释来屏蔽掉不需要执行的代码
        */

        // 2.单行注释
        // alert("Hello, World!"); // 弹出Hello, World!

        /*
            3.js严格区分大小写
        */
        //    Alert("Hello, World!"); //大写无法识别，会报错

        /*
            4.js中多个换行和空格会被忽略，但是建议不要过度使用空格
                - 可以利用这个特点来对代码进行格式化
        */
        //    alert(  231

        //     )

        /*
            5.js中每条语句以分号结尾，大部分情况可以省略
                - js会自动添加分号，但是有一些情况需要手动添加分号
        */
        alert("Hello, World!");
        console.log("Hello, World!");
    </script>
```

#### 1.4 自变量和变量

变量的声明和赋值

```javascript
    <script>
        /*
            字面量
                - 字面量其实就是一个值，它所代表的含义就是它的字面意思。
                - 比如：1 2 3 4 100 "hello" true false null undefined 等都是字面量。
                - js中所有字面量都可以直接使用，但是直接使用字面量不方便

            变量
                - 变量可以用来“存储”字面量
                - 并且变量存储的字面量可以随意修改
                - 通过变量可以对字面量进行描述，并且变量比较方便修改
        */

        let x
        x = 80
        x = "哈哈"
        console.log(x);

        let age
        age = 80
        age = 81
        console.log(age); // 80

        /*
            多行数值：shift + alt + a
            变量的使用
                - 声明变量 -> let 变量名
                - 赋值 -> 变量名 = 值
                - 声明和赋值同时进行 -> let 变量名 = 值
        */
        let a
        let b, c, d

        a = 10
        a = "hello"
        a = true

        console.log(a);

        //var是旧的变量声明方式，let是新的变量声明方式，推荐使用let
        var f
        f = 10
        console.log(f); // 10

        let i = 100
        console.log(i);
    </script>
```

#### 1.5 变量的内存结构

变量在被赋值时，会在内存检查这个值是否存在，如果存在，则直接引用

![](./images/1.png)

```javascript
    <script>

        /* 
            变量中不存储任何值，而是存储值的内存地址
        */
        let a = "哈哈"
        let b = "哈哈"

    </script>
```

#### 1.6 常量

```javascript
    <script>
        /* 
            在js中，使用const来声明常量，常量的值不能被修改。
                在js中，除了常规的常量外，还有一些对象类型的数据也会声明为常量
        */
        const PI = 3.1415926;
        // PI = 3; // 报错，常量的值不能被修改
        console.log(PI);
    </script>
```

#### 1.7 标识符

```javascript
    <script>
        /* 
            在js中，所有可以由我们自由命名的内容，都可以认为是一个标识符
                像变量名、函数名、类名、属性名等等

            使用标识符需要遵循如下规范：
                1.标识符只能含有字母、数字、 下划线、$，且不能以数字开头
                2.标识符不能是js中的关键字和保留字，也不建议使用内置的函数或类名作为变量名
                3.命名规范
                    - 通常会使用驼峰命名法
                        - 首字母小写，每个单词开头大写
                        - maxlength -> maxLength
                        - username -> userName

                    - 类名会使用大驼峰命名法
                        - 首字母大写，每个单词开头大写
                        - MyClass -> MyClass
                        - UserLogin -> UserLogin
                    
                    - 常量名全部大写，单词间用下划线连接
                        - MAX_LENGTH -> MAX_LENGTH
                        - USER_NAME -> USER_NAME
        */

        let a = 10  //a变量就是标识符
        let abc = 22
        let abc123 = 22
        let abc123_ = 22

        let _abc123_ = 22
        let $abc123_ = 22

        // 以下是错误的标识符
        // let 1abc = 22 // 不能以数字开头
        // let abc-123 = 22 // 不能包含特殊符号
        // let abc 123 = 22 // 不能包含空格

        // let let = 10 // 不能使用js中的关键字let
        // let function = 10 // 不能使用js中的关键字function

        // let alert = 55 // 不能使用js中的保留字alert
    </script>
```

### 2、数据类型

#### 2.1 数据类型_数值

```javascript
    <script>
        /*
            数值（Number）
                - 在js中，所有的整数和浮点数都属于数值类型
                - js中的数字不是无限大的，超过一定范围会用科学计数法显示近似值
                - 在js中进行一些高精度的运算要十分注意，避免出现精度丢失
                - NaN（Not a Number）是一个特殊的数值，表示非法的数字
        */

        let a = 10
        a = 10.5
        a = 99999999999999999   //100000000000000000
        a = 999999999999999999999 // 科学计数法显示1e+21
        a = 0.00000000001   //1e-11
        console.log(a);

        // 数值运算
        //0.1+0.2=0.30000000000000004

        // a = 1 - 'a' // 报错NaN，不能将字符串和数值进行运算

        /* 
            大整数（BigInt）
                - 大整数用来表示一些比较大的整数
                - 大整数使用n结尾，它可以表示的范围无限大，但是会受到内存的限制
        */

        a = 999999999999999999999999999999999999999n
        console.log(a);

        /* 
            其他进制的数字
                - 二进制：0b
                - 八进制：0o
                - 十六进制：0x

        */
       let b = 55
       b = 0b1010 // 二进制

       console.log(b);  // 打印的结果是十进制的10
    </script>
```

#### 2.2 类型检查

```javascript
    <script>
        let a = 10
        let b = 10n

        console.log(a);
        console.log(b);

        // a + b // 运行报错，类型不匹配

        /* 
            typeof 运算符可以用来检查变量的类型。
            typeof 运算符返回一个字符串，该字符串表示变量的类型。
        */

        console.log(typeof a); // "number"
        console.log(typeof b); // "bigint"
    </script>
```

#### 2.3 字符串

```javascript
    <script>
        /* 
            字符串
                - js中，使用单引号或双引号括起来的字符串，都属于字符串类型
                - 转义字符 \
                    \" -> "
                    \' -> '
                    \\ -> \
                    \n -> 换行符
                    \t -> 制表符
                - 模板字符串
                    - 使用反单引号`来表示模板字符串
                    - 模板字符串可以嵌入变量
                - 使用typeof检查一个字符串时，会返回"string"
        */

        let a = 'hello';
        a = "你好"
        a = "这是一个'字符串'"
        a = '这是一个"字符串"'
        a = "这是一个\"字符串\""    //\转义字符
        a = '这是一个\'字\\符串\''   //\转义字符
        a = "这是一个\n换行符"      //\n换行符
        a = "这是一个\t制表符"      //\t制表符

        a = "今天天气真不错"
        a = `今天天气
        挺好的` //模板字符串可以跨行使用

        console.log(a);

        let name = "孙悟空"
        let str = `你好, ${name}`
        console.log(str);

        let b = 10
        console.log(`b = ${b}`);

        let c = 5   //数字5
        c = "5"   //字符串"5"
        console.log(typeof c);
    </script>
```

#### 2.4 其他数据类型

```javascript
    <script>
        /*
            整数（Number）
                - js中，整数和浮点数统称为数字
                - 整数可以使用十进制、八进制、十六进制表示
                - 整数可以使用前缀0x或0o表示
                - 使用typeof检查一个数字时，会返回"number"

            字符串（String）
                - js中，使用单引号或双引号括起来的字符串，都属于字符串类型
                - 转义字符 \
                    \" -> "
                    \' -> '
                    \\ -> \
                    \n -> 换行符
                    \t -> 制表符
                - 模板字符串
                    - 使用反单引号`来表示模板字符串
                    - 模板字符串可以嵌入变量
                - 使用typeof检查一个字符串时，会返回"string"

            布尔值（Boolean）
                - 布尔值主要用来进行逻辑判断
                - 只有两个值：true 和 false
                - 使用typeof检查一个布尔值会返回"boolean"

            空值（null）
                - 空值表示一个空对象，它是一个特殊的值，表示“没有值”
                - 空值只有一个值：null
                - 使用typeof检查一个空值会返回"object"
                - 使用typeof无法检查空值

            未定义值（undefined）
                - 当声明一个变量而没有赋值时，它的值就是undefined
                - 未定义值只有一个值：undefined
                - 使用typeof检查一个未定义值会返回"undefined"

            符号（Symbol）
                - 用来创建一个唯一的标识
                - 使用typeof检查一个符号会返回"symbol"

            js中原始值一共有7种
                1. 数字（Number）
                2.大整数（BigInt）
                3.字符串（String）
                4.布尔值（Boolean）
                5.空值（null）
                6.未定义值（undefined）
                7.符号（Symbol）
            
            这7种原始值是构成各种数据的基石
                原始值在js中是不可变类型，一旦创建就无法改变（原始值在内存中被创建，并在使用完毕后被销毁）
        */

        let bool = true //真
        bool = false    //假
        console.log(bool);
        console.log(typeof bool);   //"boolean"

        let a = null;
        console.log(a);
        console.log(typeof a);   //"object"

        let b
        console.log(b);
        console.log(typeof b);   //"undefined"

        let c = Symbol()    //调用Symbol函数创建一个唯一的标识符
        console.log(c);        //Symbol()
        console.log(typeof c);   //"symbol"
    </script>
```

* 注意原始值是不可变类型，一旦创建就无法改变

![](./images/2.png)

#### 2.5 类型转换_字符串

```javascript
    <script>
        /* 
            类型转换：将一种数据类型转换为其他数据类型
                主要将其他类型转换为（字符串、数字和布尔值）

            转换字符串
                1.调用toString()方法将其他类型转换为字符串
                    - 调用方法：
                        xxx的yyy方法 -> xxx.yyy()
                    - 由于null和undefined没有toString()方法，所以不能转换为字符串
                2.调用String()函数将其他类型转换为字符串
                    - 调用函数：
                        调用xxx的函数 -> 函数名(xxx)
                    - 原理：
                        对于拥有toString()方法的值调用String()函数时，
                            实际上就是在调用toString()方法。
                        对于null和undefined调用String()函数时，
                            实际上返回字符串"null"和"undefined"。
         */

        let a = 10
        a = true
        a = 11n
        // a = null //报错，null不能转换为字符串
        // a = undefined //报错，undefined也不能转换为字符串
        a = a.toString();   //将a转换为字符串
        console.log(typeof a, a);   //typeof a,a 输出变量a的类型和值

        let b = 33
        b = null    //"null"
        b = undefined    //"undefined"
        b = String(b);   //将b转换为字符串
        console.log(typeof b, b)
    </script>
```

#### 2.6 类型转换_数值

```javascript
    <script>
        /* 
            将其他的数据类型转换为数值
                1. Number()函数：将其他数据类型转换为数值
                    转换的情况：
                        - 字符串：
                            - 如果字符串是一个合法的数字，则会自动转换为相应的数值
                            - 如果字符串不是一个合法的数字，则会返回NaN
                            - 如果字符串是空串或纯空格的字符串，则会返回0
                        - 布尔值：
                            - true转换为1，false转换为0
                        - null
                            - null转换为0
                        - undefined
                            - undefined转换为NaN

                2. parseInt()函数：将字符串转换为整数
                    - 解析时，会自左向右读取一个字符串，直到读到所有字符串中的有效整数
                    - 也可以用parseInt()来对一个数字取整
                3. parseFloat()函数：将字符串转换为浮点数
                    - 解析时，会自左向右读取一个字符串，直到读到所有字符串中的有效浮点数
        */

        let a = "123"
        a = "abc" // "abc"不是一个合法的数字，返回NaN
        a = "" // 0
        a = " " // 0
        a = true // 1
        a = false // 0
        a = null // 0
        a = undefined // NaN
        a = Number(a) // 123

        console.log(typeof a, a);

        let b = '123px'
        b = '123.45'
        // b = 'a123'  // 'a123'不是一个合法的数字，返回NaN
        // b = Number(b) // NaN
        b = parseInt(b) // 123
        
        console.log(typeof b, b);
    </script>
```

#### 2.7 类型转换_布尔值

```javascript
    <script>
        /* 
            1.使用Boolean()函数将其他类型的值转换为布尔值
                - 转换情况：
                    - 数字：
                        - 除了0和NaN转换为false，其他数字都为true
                    - 字符串：
                        - 空串是false，非空串是true
                    - null和undefined：
                        - 都转换为false
                    - 其他对象：
                        - 除了null和undefined，其他对象都转换为true

                - 所有表示空性的，错误的，没有的都会转换为false
                    0, NaN, "", null, undefined,false
        */

        let a = 1
        a = 0 // false
        a = -1 // true
        a = NaN // false
        a = Infinity // true

        a = "abc"    // true
        a = "true"   // true
        a = "false"  // true
        a = ""       // false
        a = " "    // true

        a = null     // false
        a = undefined // false

        a = Boolean(a) // true

        console.log(typeof a,a);
    </script>
```

### 3、运算符

#### 3.1 算术运算符

```javascript
    <script>
        /* 
            运算符（操作符）
                - 运算符可以用来对一个或多个值（操作数）进行运算
                - 算术运算符：
                    + 加法运算符
                    - 减法运算符
                    * 乘法运算符
                    / 除法运算符
                    % 取模运算符
                    ** 幂运算符
                
                - 注意：
                    - 算术运算时，除了字符串的加法，
                        其他运算的操作数是非数值时，都会自动转换为数值再运算
        */
        let a = 1 + 1
        a = 10 - 5
        a = 2 * 4
        a = 10 / 5
        a = 10 / 3
        a = 10 / 0   // 除数不能为0，返回值为Infinity
        a = 10 % 3   // 取模运算符，返回余数
        a = 2 ** 3   // 2的3次方
        a = 9 ** 0.5    // 9的平方根
        a = 9 ** .5     // 省略0的写法

        /* 
            js是一门弱类型语言，当进行运算时会通过自动的类型转换来完成运算
        */
        a = 10 - '5'    //10-5
        a = 10 + true   //10+1
        a = 5 + null    //5+0
        // a = 6 - undefined   //6-NaN，结果为NaN，不能这么操作

        /* 
            当任意一个值和字符串做运算时，会先将其他值转换为字符串
                然后再进行字符串的拼接
            可以利用这个特点来进行类型转换
                可以为任意类型 + 一个空串的形式来完成转换字符串
                    其原理和String()函数一样，但使用起来更方便
        */
        a = 1 + "2"    // "12"

        a = true
        a = a + ""      // "true"
        console.log(typeof a, a);
    </script>
```

#### 3.2 赋值运算符

```javascript
    <script>
        /* 
            赋值运算符用来将一个值赋给一个变量。
                =   赋值运算符
                    - 将右侧的值赋给左侧的变量
                +=  加等于运算符
                    - 相当于 a = a + b
                -=  减等于运算符
                    - 相当于 a = a - b
                *=  乘等于运算符
                    - 相当于 a = a * b
                /=  除等于运算符
                    - 相当于 a = a / b
                %=  取模等于运算符
                    - 相当于 a = a % b
                **= 幂等于运算符
                    - 相当于 a = a ** b
                ??= 三元赋值运算符
                    - 相当于 a = a ?? b
                    - 只有变量的值为null或undefined时才会赋值，否则不会赋值。
        */
        let a = 10
        a = 20   //将右边的值赋值给左边的变量
        let b = a   //将变量a的值赋值给变量b

        a = 66
        a = a + 11   //大部分运算符都不会改变变量的值，只有赋值运算符会改变变量的值。

        a = 5
        a += 5   //相当于 a = a + 5

        a = undefined
        a??=20

        console.log(a)
    </script>
```

#### 3.3 一元±

```javascript
    <script>
        /* 
            一元±运算符
                + 正好
                    - 不会改变数值的符号

                - 负号
                    - 可以对符号位取反，将正数变成负数，将负数变成正数。

                当我们对非数值类型进行正负运算时，会先将其转换为数值然后再运算。
        */

        let a = 10
        a = +a
        a = -a
        console.log(a);

        let b = '123'
        b = +b // 123，隐式类型转换

        console.log(b);
    </script>
```

#### 3.4 自增和自减

```javascript
    <script>
        /* 
            ++ 自增运算符
                - ++ 使用会使得原来的变量立刻增加1
                - 自增分为前置和后置两种形式，前置形式 ++a，后置形式 a++
                - 无论是a++还是++a，都表示变量a的值增加1
                - 不同的是++a和a++所返回的值不同
                    a++返回的是a的旧值
                    ++a返回的是a的新值
        */
        let a = 10

        // let b = a++ //a++返回的是a的旧值，即10，而a自增后的值为11
        let b = ++a // ++a返回的是a的新值，即11，而a自增后的值为11

        console.log(a);
        console.log(b);

        let n = 5
        let result = n++ + ++n + n // 5+7+7=19
        console.log(result); // 19

        /* 
            -- 自减运算符
                - -- 使用会使得原来的变量立刻减少1
                - 自减分为前置和后置两种形式，前置形式 --a，后置形式 a--
                - 无论是a--还是--a，都表示变量a的值减少1
                - 不同的是--a和a--所返回的值不同
                    a--返回的是a的旧值
                    --a返回的是a的新值
        */
    </script>
```

#### 3.5 逻辑运算符-非

```javascript
    <script>
        /* 
            ! 非运算符
                - 可以用来对一个值进行非运算，即取反。
                - 它可以对一个布尔值进行非运算，将其取反。
                    true -> false
                    false -> true
                - 如果对一个非布尔值取反，则会先将其转换为布尔值，然后再取反。
                    可以利用这个特点将其他值转换为布尔值。
                
                - 类型转换
                    转换为字符串
                        显式转换
                            String()
                        隐式转换
                            + ""

                    转换为数值
                        显式转换
                            Number()
                        隐式转换
                            + 0

                    转换为布尔值
                        显式转换
                            Boolean()
                        隐式转换
                            !!
                

            && 与运算符

            || 或运算符
        */
        let a = 1
        a = !a
        console.log(a)

        a = 123
        // a = Boolean(a)
        a = !!a // 取两次反可以转换为布尔值

        console.log(typeof a, a);
    </script>
```

#### 3.6 逻辑运算符-与-或

```javascript
    <script>
        /* 
            && 逻辑与
                - 可以对两个值进行与运算
                - && 左右两边的表达式都为真，结果才为真
                - 否则，结果为假
                - 与运算是找flase的，如果找到false则直接返回，没有false才会执行第二个
                - 对应非布尔值进行运算，它会先转换为布尔值再进行运算
                    但是最后回返回的是原值，而不是布尔值
                    - 如果第一个值为false，则直接返回第一个值
                    - 如果第一个值为true，则返回第二个值

            || 逻辑或
                - 可以对两个值进行或运算
                - 当||左右两边的表达式有一个为真，结果为真
                - 否则，结果为假
                - 或运算时找true的，如果第一个值为true，则不看第二个
                - 对应非布尔值进行运算，它会先转换为布尔值再进行运算
                    但是最后回返回的是原值，而不是布尔值
                    - 如果第一个值为true，则直接返回第一个值
                    - 如果第一个值为false，则返回第二个值
        */
        let result = true && true; // true
        result = true && false; // false
        result = false && true; // false

        //    true && alert("hello"); // 第一个为true，alert会执行
        // false && alert("hello"); // 第一个为false，alert不会执行

        result = 1 && 2; // 2
        result = 1 && 0; // 0
        result = 0 && NaN; // 0，第一个为false，直接返回第一个

        result = true || false; // true
        result = false || true; // true
        result = false || false; // false

        // false || alert("hello"); // 第一个为false，alert会执行
        true || alert("hello"); // 第一个为true，alert不会执行
        console.log(result);
    </script>
```

#### 3.7 关系运算符

```javascript
    <script>
        /* 
            关系运算符：
                - 关系运算符用来检查两个值之间的关系是否成立
                    成立：返回true
                    不成立：返回false
                >   大于
                    - 用来检查左值是否大于右值
                <   小于
                    - 用来检查左值是否小于右值
                >=  大于等于
                     - 用来检查左值是否大于等于右值
                <=  小于等于
                     - 用来检查左值是否小于等于右值

            注意：
                当对非数值运算时，它会先将其转换为数值再进行比较。
                当关系运算符的两端是两个字符串时，它会先将字符串转换为unicode编码的比较，再进行比较。
                    - 字符串的比较是按照unicode编码的顺序逐位进行的。
                      利用这个特点可以对字符串安装字母排序
                    - 注意比较字符串和数字时一定要进行类型转换
                
                ==  等于
                    - 用来检查两个值是否相等
                === 全等（值和类型都相等）
                     - 用来检查两个值是否全等（值和类型都相等）
               !=  不等于
                  - 用来检查两个值是否不相等
               !== 不全等（值或类型不相等）
                    - 用来检查两个值是否不全等（值或类型不相等）
        */
        let result = 10 > 5; // true
        result = 5 > 5; // false
        result = 5 >= 5; // true

        result = 5 < "10"   // true
        result = 1 > false; // true
        result = "a" < "b"  // true
        result = "abc" < "b"     // false

        result = "12" < "2" //ture，字符串比较，从左往右比较，"1" < "2"
        result = +"12" < "2" //false，转换为数字，12 < 2

        //检查number是否在5和10之间
        let num = 6
        result = 5 < num && num < 10; // true
        console.log(result);
    </script>
```

#### 3.8 相等运算符

```javascript
    <script>
        /* 
            == 
                - 相等运算符，用来比较两个值是否相等，如果相等返回true，否则返回false。
                - 使用相等运算符比较两个不同类型的值时
                    它会转换为相同类型后再比较，通常转换为数字比较
                    类型转换后值相同，也会返回true
                - 对于null和undefined，相等运算符会返回true
                - NaN与任何值都不相等，包括它自己

            ===
                - 全等运算符，用来比较两个值是否全等，如果全等返回true，否则返回false。
                - 它不会进行类型转换，如果两个值类型不同，则返回false
                - 对于null和undefined，全等运算符会返回false

            !=
                - 不等于运算符，用来比较两个值是否不相等，如果不相等返回true，否则返回false。
                - 它也会进行类型转换，如果两个值类型不同，则返回true

            !==
                - 不全等运算符，用来比较两个值是否不全等，如果不全等返回true，否则返回false。
                - 它不会进行类型转换，如果两个值类型不同，则返回true
        */
        let result = 1 == 1   //true
        result = 1 == "2"    //false
        result = 1 == "1"   //true
        result = true == "1"    //true

        result = null == undefined   //true
        result = NaN == NaN   //false

        result = 1 === 1   //true
        result = 1 === "1"    //false
        result = null === undefined   //false

        result = 1 != 1   //false
        result = 1 != "1"    //false

        result = 1 !== "1"   //false

        console.log(result);
    </script>
```

#### 3.9 条件运算符

```javascript
    <script>
        /* 
            条件运算符：
                语法：条件? 表达式1 : 表达式2
                - 执行顺序：
                    条件运算符在执行时，会先对条件进行求值判断
                        如果结果为true，则执行表达式1
                        如果结果为false，则执行表达式2
        */
        // true ? alert(1) : alert(2); // 1
        // false? alert(1) : alert(2); // 2

        let a = 10
        let b = 20
        // a > b ? alert("a>b") : alert("a<=b") // a<=b

        let max = a > b ? a : b;    //获取两个值当中的最大值
        alert(max); // 20
    </script>
```

#### 3.10 运算符的优先级

```javascript
    <script>
        /* 
            和数学一样，js中的运算符也有优先级，比如先乘除，再加减。

            可以通过优先级的表格来查询运算符的优先级
                - 运算符的优先级表格：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
                - 在表格中，运算符的优先级由高到低排列，优先级相同的运算符，则从左到右进行运算。
                    优先级的表格不需要记忆，甚至表格都不用看
                    因为()拥有最高优先级，使用运算符时，如果遇到拿不准的，可以直接通过()来改变优先级即可
        */
        let a = 1 + 2 * 3; // 先乘除，再加减

        a = 1 && (2 || 3);
        console.log(a); // 7
    </script>
```

### 4、流程控制

#### 4.1 代码块

```javascript
    <script>
        /* 
            使用{}来创建代码块，代码块可以用来对代码进行分组，提高代码的可读性和可维护性。
                同一个代码块中的代码，就是同一组代码，一个代码块的中的代码，要么都执行，要么都不执行。

            let和var
                - 在js中，使用let声明的变量具有块级作用域
                    在代码块中声明的变量无法在代码块外访问，只能在代码块内访问。
                - 使用var声明的变量，不具有块级作用域
                    在代码块中声明的变量可以在代码块外访问。
        */
        {
            // let a = 10
            var a = 10
            // console.log(a);

        }
        console.log(a);
    </script>
```

#### 4.2 if语句

```javascript
    <script>
        /* 
            流程控制语句
                1.条件判断语句
                2.条件分支语句
                3.循环语句

            if语句
                - 语法：
                    if (条件表达式) {
                        语句...
                    }

                - 执行顺序
                    if语句在执行时，会先对if后的条件表达式进行求值判断，
                        如果结果为true，则执行if语句块内的代码，
                        如果结果为false，则跳过
                    
                    if语句只会控制紧随其后的那一行代码，如果希望控制多行代码，可以使用{}将语句括起来
                        最佳实践：即使只有一行代码，也要使用{}将代码括起来，以提高可读性

                    if后面的表达式不是布尔值，会转换为布尔值，然后再执行
        */

        // if (false)
        //     alert("哈哈")

        let a = 10
        // if (a > 10) {
        //     alert("a大于10")
        //     alert(11111)
        // }

        // if(100){
        //     alert("你猜我执行吗")
        // }

        if (a === 10) {
            alert("a等于10")
        }
    </script>
```

#### 4.3 if-else语句

```javascript
    <script>
        /* 
            if-else语句
                - 语法：
                    if(条件表达式){
                        语句...
                    }else{
                        语句...
                    }
                
                - 执行流程
                    if-else执行时，先对条件表达式求值判断
                        如果结果为true，则执行if语句块
                        如果结果为false，则执行else语句块

                if-else if-else语句
                    - 语法：
                        if(条件表达式1){
                            语句...
                        }else if(条件表达式2){
                            语句...
                        }else if(条件表达式3){
                            语句...
                        }else{
                            语句...
                        }
                - 执行流程
                    if-else if-else执行时，会自上向下依次对if条件表达式求值判断
                        如果结果为true，则执行if语句块
                        如果结果为false，则对条件表达式2求值判断
                            如果结果为true，则执行else if语句块
                            如果结果为false，则对条件表达式3求值判断
                                如果结果为true，则执行else if语句块
                                如果结果为false，则执行else语句块

                注意：
                    if-else if-else语句只会有一个代码块被执行，
                        一旦有执行的代码块，下边的条件都不会再继续判断了
                        所以一定要注意条件的编写顺序，确保正确的执行代码块
        */

        let age = 10
        // if (age >= 60) {
        //     alert("你已经退休了！")
        // } else {
        //     alert("你还没退休！")
        // }

        age = 200

        // if (age >= 100) {
        //     alert("你真是一个长寿的人！")
        // } else if (age >= 80) {
        //     alert("你比楼上那位还年轻不少")
        // } else if (age >= 60) {
        //     alert("你已经退休了！")
        // } else if (age >= 30) {
        //     alert("你已经步入中年了")
        // } else if (age >= 18) {
        //     alert("你已经成年了")
        // } else {
        //     alert("你还未成年！")
        // }

        /*
            - 练习1：
            编写一个程序，获取一个用户输入的整数。然后通过程序显示这个数是奇数还是偶数。


            - 练习2：
            从键盘输入小明的期末成绩:
                    当成绩为100时，'奖励一辆BMW'
                    当成绩为[80-99]时，'奖励一台iphone'
                    当成绩为[60-79]时，'奖励一本参考书'
                    其他时，什么奖励也没有

            - 练习3：
            大家都知道，男大当婚，女大当嫁。那么女方家长要嫁女儿，当然要提出一定的条件：
                高：180cm以上; 富:1000万以上; 帅:500以上;
                如果这三个条件同时满足，则:'我一定要嫁给他'
                如果三个条件有为真的情况，则:'嫁吧，比上不足，比下有余。'
                如果三个条件都不满足，则:'不嫁！'
        */

        // prompt()可以用来获取用户输入的内容
        // 它会返回一个字符串，可以通过变量来接收
        let num = +prompt("请输入一个整数：");  // 加号将字符串转换为数字
        alert(typeof num, num)
    </script>
```

#### 4.4 练习1

```javascript
    <script>
        /* 
            编写一个程序，获取一个用户输入的整数。然后通过程序显示这个数是奇数还是偶数。
        */

        //声明一个变量，接收用户输入的整数
        // let num = +prompt("请输入一个整数：");
        let num = parseInt(prompt("请输入一个整数：")); //parseInt()函数可以将用户输入的字符串转换为整数，比如输入10.5，则会自动转换为整数10

        //验证一下用户的输入是否合法，只有是有效数字时，我们才判断是否为偶数
        //我们不能使用==或===来判断NaN，因为NaN是唯一一个不等于自身的值
        //可以使用isNaN()函数来判断是否为NaN
        if (isNaN(num)) {
            alert("你的输入有问题，请输入一个有效数字！")
        } else if (num % 2 == 0) {
            alert(`${num}是偶数`); //如果输入的整数是偶数，则显示"num是偶数"
        } else {
            alert(`${num}是奇数`); //如果输入的整数是奇数，则显示"num是奇数"
        }
    </script>
```

#### 4.5 练习2

```javascript
    <script>
        /*
            从键盘输入小明的期末成绩:
                当成绩为100时，'奖励一辆BMW'
                当成绩为[80-99]时，'奖励一台iphone'
                当成绩为[60-79]时，'奖励一本参考书'
                其他时，什么奖励也没有
        */

        //声明一个变量，用来存储用户输入的成绩
        let score = +prompt("请输入小明的期末成绩：");

        //判断用户输入的成绩是否有效
        if (isNaN(score) || score < 0 || score > 100) {
            alert("输入的成绩有误，请重新输入！");
        } else if (score == 100) {
            alert("恭喜小明，奖励一辆BMW！");
        } else if (score >= 80) {
            alert("恭喜小明，奖励一台iphone！");
        } else if (score >= 60) {
            alert("恭喜小明，奖励一本参考书！");
        } else {
            alert("什么奖励也没有！");
        }
    </script>
```

#### 4.6 练习3

```javascript
    <script>
        /* 
            大家都知道，男大当婚，女大当嫁。那么女方家长要嫁女儿，当然要提出一定的条件：
                高：180cm以上; 富:1000万以上; 帅:500以上;
                如果这三个条件同时满足，则:'我一定要嫁给他'
                如果三个条件有为真的情况，则:'嫁吧，比上不足，比下有余。'
                如果三个条件都不满足，则:'不嫁！'
        */
        //获取用户的输入（身高、财富、颜值）
        let height = +prompt("请输入您的身高(cm)：");
        let money = +prompt("请输入您的财富(万)：");
        let face = +prompt("请输入您的颜值(像素)：");

        if (height > 180 && money > 1000 && face > 500) {
            alert("我一定要嫁给他");
        } else if (height > 180 || money > 1000 || face > 500) {
            alert("嫁吧，比上不足，比下有余。");
        } else {
            alert("不嫁！");
        }
    </script>
```

#### 4.7 switch语句

```javascript
    <script>
        /* 
            根据用户输入的数字，显示对应的中文
                1 壹
                2 贰
                3 叁                
                4 肆
                5 伍
        */
        let num = +prompt("请输入1-5之间的数字:");

        // if (num === 1) {
        //     alert("壹");
        // } else if (num === 2) {
        //     alert("贰");
        // } else if (num === 3) {
        //     alert("叁");
        // } else if (num === 4) {
        //     alert("肆");
        // } else if (num === 5) {
        //     alert("伍");
        // } else {
        //     alert("输入错误");
        // }

        /* 
        - 执行的流程
            switch语句在执行时，会依次将switch后的表达式和case后的表达式进行全等比较
                如果比较结果为true，则自当前case处开始执行代码
                如果比较结果为false，则继续比较其他case后的表达式，直到找到true为止
                如果所有的比较都是false，则执行default后的语句

        - 注意：
            当比较结果为true时，会从当前case处开始执行代码
                也就是说case是代码执行的起始位置
            这就意味着只要是当前case后的代码，都会执行
            可以使用break来避免执行其他的case

        - 总结
            switch语句和if语句的功能是重复，switch能做的事if也能做，反之亦然。
                它们最大的不同在于，switch在多个全等判断时，结构比较清晰
        */

        //注意switch是全等判断
        switch (num) {
            case 1:
                alert("壹");
                break;
            case 2:
                alert("贰");
                break;
            case 3:
                alert("叁");
                break;
            case 4:
                alert("肆");
                break;
            case 5:
                alert("伍");
                break;
            default:
                alert("输入错误");
        }
    </script>
```

#### 4.8 循环语句

```javascript
    <script>
        /* 
            循环语句
                - 通过循环语句可以使指定的代码反复执行
                - js中一共有3种循环语句：for、while、do-while

                - while语句
                    - 语法：
                        while(条件表达式){
                            语句...
                        }
                    - 执行流程
                        while在执行时，会先对条件表达式就行判断
                            如果结果为true，则执行循环体，然后再次判断条件表达式，继续执行循环体...
                            如果结果为false，则退出循环
        */
        //当一个循环的条件表达式恒为true时，这个循环将是一个死循环，会一直执行下去，导致浏览器崩溃或浏览器卡死。
        // while(true){
        //     alert("哈哈")
        //     }

        /* 
            通常写一个循环需要3个条件
                1. 初始化条件表达式
                    - 用来初始化变量
                2. 循环条件表达式
                    - 用来判断循环是否继续
                3. 更新条件表达式
                    - 用来修改变量的值
        */

        // //初始化条件表达式
        // let a = 0

        // //循环条件表达式
        // while (a < 5){
        //     console.log(a);

        //     //更新条件表达式
        //         a++
        // }

        let i = 0
        while (true) {
            console.log(i)
            i++
            if (i === 5) {
                break
            }
        }

        /*
            练习：
                假设银行存款的年利率为5%，求存1000多少年可以变成5000
        */
    </script>
```

#### 4.9 while练习

```javascript
    <script>
        /* 
            假设银行存款的年利率为5%，求存1000多少年可以变成5000
        */

        //创建一个计数器，记录存款1000年后变成5000需要多少年
        let year = 0;

        //初始化余额为1000
        let balance = 1000;

        //判断表达式，当余额小于5000时，执行循环
        while (balance < 5000) {
            balance = balance * (1 + 0.05);
            year++;
        }
        console.log(`存款1000后变成5000需要${year}年`);
    </script>
```

#### 4.10 while循环

```javascript
    <script>
        /* 
            do-while循环
                - 语法：
                    do {
                        语句...
                    }while(条件表达式);

                - 执行顺序：
                    do-while在执行时，会先执行do后面的循环体，
                        执行完毕后，会对while后的条件表达式进行判断，
                        如果条件表达式为true，则继续执行循环体，
                        如果条件表达式为false，则退出循环。

                - do-while和while的区别：
                    while是先判断，再执行
                    do-while是先执行，再判断

                - 实质区别：
                    do-while可以确保循环至少执行一次
        */
       let i = 0

       //while循环
    //    while(i < 5){
    //        console.log(i);
    //        i++;
    //    }

       //do-while循环
       do {
           console.log(i);
           i++;
       }while(i < 5);
    </script>
```

#### 4.11 for循环

```javascript
    <script>
        /* 
            for循环
                - for循环和while没有本质区别，只是语法上有区别。
                - 不同点就是语法结构，for循环的语法结构更加简洁，更加易读。
                - 语法：
                    for(初始化表达式;条件表达式;更新表达式){
                        循环体语句
                        }

                - 执行流程：
                    1.执行初始化表达式，来初始化变量
                    2.执行条件表达式，判断是否执行(true执行，false终止)
                    3.条件更新表达式，更新变量

                -  初始化表达式，在循环的整个周期中只执行一次，一般用来初始化变量。
                - for循环中的3个表达式都可以省略
                - 使用let声明的变量，是局部变量，只能在for循环中使用，不能在外部访问。
                    使用var声明的变量，是全局变量，可以在for循环外访问。
                - 创建死循环的方式：
                    for(;;) {
                        // 循环体语句
                    }
                - 死循环会一直执行，直到浏览器崩溃或手动关闭页面。

                练习1：
                    求100内所有3的倍数(求他们的个数和总和)
        */
        // let i = 0
        // while (i < 5) {
        //     console.log(i)
        //     i++
        // }

        for (let i = 0; i < 5; i++) {
            console.log(i)
        }

        // console.log(i);


        //省略3个表达式
        // for(;;){
        //     console.log(1);
        // }

        // let i = 0
        // for(;i<5;){
        //     console.log(i);
        //     i++;
        // }

        //死循环
        for (; ;) {
            console.log(1);
        }
    </script>
```

#### 4.11 练习1-求100内所有3的倍数

```javascript
    <script>
        /* 
            求100内所有3的倍数(求他们的个数和总和)

            思路；
                先求100以内所有的数
        */

        // //计数器
        let count = 0

        //累加器
        let sum = 0

        // for (let i = 1; i < 100; i++) {
        //     // 判断是否是3的倍数
        //     if (i % 3 == 0) {
        //         count++
        //         sum = sum + i;
        //     }
        // }

        // 优化版，使用for循环的步长为3，从3开始，直到100结束

        for (let i = 3; i < 100; i += 3) {
            if (i % 3 == 0) {
                count++;
                sum = sum + i;
            }
        }
        // 输出结果
        console.log(`3的倍数一共有${count}个，总和为${sum}`);

        /* 
            求1000以内的水仙花数
                - 一个n位数的水仙花数，是指一个n位数（n>=3），它的每个位上的数字的n次方之和等于它本身。例如，153是一个3位数的水仙花数，因为1^3 + 5^3 + 3^3 = 153。
        */
    </script>
```

#### 4.12 练习2-求1000以内的水仙花数

```javascript
    <script>
        /*
            求1000以内的水仙花数
                - 一个n位数的水仙花数，是指一个n位数（n>=3），它的每个位上的数字的n次方之和等于它本身。例如，153是一个3位数的水仙花数，因为1^3 + 5^3 + 3^3 = 153。
        */

        //获取1000以内的所有的3位数

        // for (let i = 100; i < 1000; i++) {
        //     //判断是否为水仙花数
        //     //如果i的百位数的平方加上十位数的平方加上个位数的和等于i本身，i则为水仙花数
        //     //parseInt()用来取整
        //     //获取百位数
        //     let bai = parseInt(i / 100);

        //     //获取十位数
        //     let shi = parseInt((i - bai * 100) / 10);

        //     //获取个位数
        //     // let ge = i - bai * 100 - shi * 10;
        //     let ge = i % 10;

        //     //判断是否为水仙花数
        //     if (bai ** 3 + shi ** 3 + ge ** 3 == i) {
        //         console.log(i);
        //     }
        // }

        //优化代码
        for (let i = 100; i < 1000; i++) {
            //获取i的字符串形式
            // let stri = String(i);
            let stri = i + '';

            //判断是否为水仙花数
            if (stri[0] ** 3 + stri[1] ** 3 + stri[2] ** 3 == i) {
                console.log(i);
            }
        }

        /*
            获取用户输入大于1的整数（暂时不考虑输入错误的情况）
                编写代码，判断这个数是否为质数，并打印结果
            质数
                - 一个数如果只能被1和它本身整除，则称为质数。例如，2、3、5、7、11、13、17、19等都是质数。
 
        */
    </script>
```

#### 4.13 练习3-判断是否为质数

```javascript
    <script>
        /*
            获取用户输入大于1的整数（暂时不考虑输入错误的情况）
                编写代码，判断这个数是否为质数，并打印结果

            质数
                - 一个数如果只能被1和它本身整除，则称为质数。例如，2、3、5、7、11、13、17、19等都是质数。
        */

        // 获取用户输入
        let num = +prompt("请输入大于1的整数:");

        // 判断是否为质数

        /*
            编写代码，判断9是否为质数
                - 检查9有没有1和9以外的因数
                    如果有，则9不是质数
                    如果没有，则9是质数
                -获取所有的可能的因数
                    2,3,4,5,6,7,8
                - 判断这些数是否都能整除9
                    如果有，则9不是质数
                    如果没有，则9是质数
        */
        //记录num的状态，默认为质数
        let flag = true;

        for (let i = 2; i < num; i++) {
            if (num % i === 0) {
                //如果9能被i整除，则9不是质数
                //如果循环体没有执行，则说明9是质数
                flag = false;
            }
        }

        if (flag == true) {
            alert(`${num}是质数`)
        } else {
            alert(`${num}不是质数`)
        }
    </script>
```

#### 4.14 循环嵌套

```javascript
    <script>
        /* 
            在循环中，也可以嵌套其他的循环

            希望在网页中打印如下图像
            *****
            *****
            *****
            *****
            *****

            *
            **
            ***
            ****
            *****

            *****
            ****
            ***
            **
            *

            当循环发生嵌套时，外层循环执行1次，内层循环就执行一个完整的周期

            练习：
                打印99乘法表
                1*1=1
                1*2=2 2*2=4
                1*3=3 2*3=6 3*3=9
                ...
        */

        //for循环控制图像的高度
        // for (let i = 0; i < 5; i++) {
        //     //<br>标签用于换行
        //     document.write('*****<br>');
        // }

        //创建一个外层循环，来控制图像的高度
        // for (let i = 0; i < 5; i++) {
        //     //创建一个内层循环，来控制图片的宽度
        //     for (let j = 0; j < 5; j++) {
        //         //使用&nbsp标签来控制图形的间距
        //         document.write('*&nbsp;&nbsp;');
        //     }
        //     document.write('<br>');
        // }

        // for (let i = 0; i < 5; i++) {
        //     //创建一个内层循环，来控制图片的宽度
        //     for (let j = 0; j < i + 1; j++) {
        //         //使用&nbsp标签来控制图形的间距
        //         document.write('*&nbsp;&nbsp;');
        //     }
        //     document.write('<br>');
        // }

        for (let i = 0; i < 5; i++) {
            //创建一个内层循环，来控制图片的宽度
            for (let j = 0; j < 5 - i; j++) {
                //使用&nbsp标签来控制图形的间距
                document.write('*&nbsp;&nbsp;');
            }
            document.write('<br>');
        }
    </script>
```

#### 4.15 练习1-99乘法表

```javascript
    <style>
        span{
            display: inline-block;
            width: 100px;
        }
    </style>
    <script>
        /* 
            打印99乘法表
                1*1=1
                1*2=2 2*2=4
                1*3=3 2*3=6 3*3=9
                ...

            练习：
                编写代码，求100以内所有的质数
        */

        //创建一个外层循环，控制高度
        for (let i = 1; i <= 9; i++) {
            //创建一个内层循环，控制宽度
            for (let j = 1; j <= i; j++) {
                document.write(`<span>${i} × ${j} = ${i * j}</span>`);
            }
            document.write("<br>");
        }
    </script>
```

#### 4.16 练习2-求100以内所有的质数

```javascript
    <script>
        /* 
            编写代码，求100以内所有的质数
        */
        //求100以内所有的数
        for (let i = 2; i < 100; i++) {
            //判断i是否为质数
            //记录i的状态，默认i是质数
            let flag = true;

            //获取1-i直接的数
            for (let j = 2; j < i; j++) {
                //判断i能不能被i整除
                if (i % j == 0) {
                    //进入判断，i不是质数
                    flag = false;
                }
            }
            //判断结果
            if (flag) {
                console.log(`${i}是质数`);
            }

        }
    </script>
```

#### 4.17 break和contine

```javascript
    <script>
        /* 
            break和contine
                - break
                    - break用来终止swich或循环语句
                    - break执行后，switch或循环语句会立即停止
                    - break会终止离它最近的循环

                - contine
                    - contine跳过本次循环


        */

        // for (let i = 0; i < 5; i++) {
        //     if (i === 3) {
        //         break; // 遇到i=3时，终止循环
        //     }
        //     console.log(i);
        // }

        // for (let i = 0; i < 5; i++) {
        //     console.log(i);

        //     for (let j = 0; j < 5; j++) {
        //         if (j === 1) break
        //             console.log('内层循环--->', j);
        //     }
        // }

        // for (let i = 0; i < 5; i++) {
        //     if (i === 3) {
        //         continue; // 遇到i=3时，跳过本次循环
        //     }
        //     console.log(i);
        // }

        for (let i = 0; i < 5; i++) {
            console.log(i);

            for (let j = 0; j < 5; j++) {
                if (j === 1) continue
                console.log('内层循环--->', j);
            }
        }
    </script>
```

#### 4.18 练习-性能优化1

```javascript
    <script>
        /* 
            优化前
                1.10000以内：191ms
                2.100000以内：18043ms

            优化后
                1.10000以内：27ms
                2.100000以内：1948ms

            问题：如何修改代码，使得优化后运行速度更快？
         */

        //开始一个计时器
        //计时器名称，可以随便起，但要保证唯一性，即开始计时器和结束计时器的名称要一致
        console.time('质数练习');

        for (let i = 2; i < 10000; i++) {
            //判断i是否为质数
            //记录i的状态，默认i是质数
            let flag = true;

            //获取1-i直接的数
            for (let j = 2; j < i; j++) {
                //判断i能不能被i整除
                if (i % j == 0) {
                    //进入判断，i不是质数
                    flag = false;

                    //进入判断，说明i不是质数，退出循环
                    break;
                }
            }
            //判断结果
            if (flag) {
                // console.log(`${i}是质数`);
            }
        }

        //结束计时器
        console.timeEnd('质数练习');
    </script>
```

#### 4.19 练习-性能优化2

```javascript
    <script>
        /* 
            优化前
                1.10000以内：191ms
                2.100000以内：18043ms

            优化后
                1.10000以内：27ms
                2.100000以内：1948ms

            问题：如何修改代码，使得优化后运行速度更快？

                36
                1 26
                2 18
                3 12
                4 9

            36的平方根6，6以后就没有必要判断了

            第二次优化：
                1.10000以内：0.68ms
                2.100000以内：4.5ms

            偶数不可能是质数，所以只需要判断奇数即可，优化后运行速度更快

            第三次优化：
                1.10000以内：0.41ms
                2.100000以内：2.6ms
         */

        //开始一个计时器
        //计时器名称，可以随便起，但要保证唯一性，即开始计时器和结束计时器的名称要一致
        console.time('质数练习');

        for (let i = 2; i < 100000; i+=2) {
            //判断i是否为质数
            //记录i的状态，默认i是质数
            let flag = true;

            //获取1-i直接的数
            //优化时，这里改为.5 ** i，因为i的平方根大于i，所以不需要判断i的平方根以后的数，可能会出现.5 ** i === i的情况,所有要加上=
            for (let j = 2; j <= .5 ** i; j++) {
                //判断i能不能被i整除
                if (i % j == 0) {
                    //进入判断，i不是质数
                    flag = false;

                    //进入判断，说明i不是质数，退出循环
                    break;
                }
            }
            //判断结果
            if (flag) {
                // console.log(`${i}是质数`);
            }
        }

        //结束计时器
        console.timeEnd('质数练习');
    </script>
```

### 5、对象

#### 5.1 对象

```javascript
    <script>
        /* 
            数据类型：
                原始值：
                    1.数值 Number
                    2.大整数 BigInt
                    3.字符串 String
                    4.布尔值 Boolean
                    5.空值 null
                    6.未定义 undefined
                    7.符号 Symbol
                
                对象：
                    - 对象是js中一种复合数据类型
                        它相当于一个容器，在对象中可以存储各种不同类型的数据


                原始值只能用来表示一些简单的数据，不能表示复杂数据

                比如：现在需要在程序中表示一个人的信息

        */
        //创建对象
        // let obj = new Object();

        //省略new关键字
        let obj = Object();

        /* 
            对象中可以存储多个各种类型的数据
                对象中存储的数据，我们称为属性

            向对象中添加属性：
                对象.属性名 = 属性值

            读取对象中属性：
                对象.属性名
                - 如果读取的是对象中没有的属性
                    不会报错，而是返回undefined
        */

        obj.name = "孙悟空"
        obj.age = 18
        obj.gender = "男"

        //修改属性
        obj.name = "Tom sun"

        //删除属性
        delete obj.name

        console.log(obj);
    </script>
```

#### 5.2 对象的属性

```javascript
    <script>
        /* 
            属性名
                - 通常属性名就是一个字符串，所以属性名可以是任何值，没有什么特殊要求
                    但是属性名很特殊，不能直接使用，需要使用[]来设置
                    虽然如此，我们还是强烈建议属性名来按照标识符的规范来命名
                
                - 也可以使用符号Symbol作为属性名，来添加属性
                    获取这种属性，也必须使用symbol来获取
                使用symbol添加的属性，通常是不希望被外界访问的属性，可以用来隐藏一些信息

                - 使用[]去操作属性时，可以使用变量

            属性值：
                - 对象的属性值可以是任意数据类型

            使用typeof检查对象，返回的是object
        */
        let obj = Object()
        obj.name = "孙悟空"

        //不要使用保留字作为属性名
        // obj.if = 18

        //不建议这么取名
        // obj["123@fsdfs#!"] = "你好"

        let mySymbol = Symbol()

        //使用Symbol作为属性名
        obj[mySymbol] = "通过Symbol添加的属性名"

        // console.log(obj["123@fsdfs#!"]);
        // console.log(obj[mySymbol]);

        obj.age = 18;
        obj["gender"] = "男";

        let str = "address"
        obj[str] = "花果山" //等价于obj.address = "花果山"

        obj.a = 123
        obj.b = 'hello'
        obj.c = true
        obj.d = null
        obj.e = undefined
        obj.f = Symbol()
        obj.g = 123n

        //添加对象属性
        obj.h = Object()

        console.log(obj);
        console.log(obj.age);
        console.log(obj.gender);
        console.log(obj.address);
        console.log(obj[str]);

        console.log(typeof obj);  //object

        //检查in运算符
        //检查obj中是否包含name属性，返回true
        console.log("name" in obj);
    </script>
```

#### 5.3 对象字面量

```javascript
    <script>
        /* 
            对象字面量
                - 可以直接使用{}来创建对象
                - 使用{}创建的对象，可以直接向对象中添加属性
                - 语法：
                    {
                        属性名：属性值,
                        [属性名]：属性值,
                    }
        */

        // let obj = Object()

        // let obj2 = {}
        // obj2.name = "孙悟空"

        let obj2 = {
            name: "孙悟空",
            age: 18,
            ["gender"]: "男",
            ["mysymbol"]: "特殊的属性",
            hello: {
                a: 1,
                b: true
            }
        }
        // console.log(obj);
        console.log(typeof obj2, obj2);
    </script>
```

#### 5.4 枚举属性

```javascript
    <script>
        /* 
            枚举属性：将对象中所有的属性全部获取

            for in语法：
                - 语法
                    for(let proName in 对象){
                        ...
                    }

                - for-in的循环多执行多次，有几个属性就会执行多少次
                    每次执行时，都会把属性名赋值给proName变量

                - 注意：并不是所有属性都可以枚举，比如使用符号添加的属性无法枚举
        */

        let obj = {
            name: "孙悟空",
            age: 18,
            gender: "男",
            address: "花果山",
            [Symbol()]: "测试的属性"   //符号属性不可枚举
        }

        for (let value in obj) {
            //获取属性名和属性值
            console.log(value, obj[value]);
        }
    </script>
```

#### 5.5 可变类型

```javascript
    <script>
        /* 
            原始值都属于不可变类型，一旦创建就不能改变。
            原始值包括：字符串、数字、布尔值、null、undefined。
            在内存中不会重复创建相同的值，因此可以直接使用。
            对于原始值来说，可以直接使用，不需要考虑引用的问题。
        */
        let a = 10
        let b = 10
        a = 12

        console.log("a =", a);
        console.log("b =", b);

        /* 
            对象属于可变类型
            对象创建完成后，可以修改其属性
            注意：
                - 当对两个对象进行相等或全等比较时，比较的是对象的内存引用地址。
                - 如果有两个变量同时指向一个对象，
                    通过一个变量修改对象时(实质上只有一个对象，对象的内存地址没变，修改的是对象内存地址中的属性)，
                    对另一个变量也会造成影响。
        */

        let obj = Object()
        obj.name = "孙悟空"
        obj.age = 18

        let obj2 = Object()
        let obj3 = Object()

        // console.log("obj =", obj);

        // console.log(obj2 === obj3);

        let obj4 = obj
        obj4.name = "猪八戒"

        console.log("obj =", obj);
        console.log("obj4 =", obj4);
        console.log(obj === obj4);
    </script>
```

#### 5.6 改变量和改对象

```javascript
    <script>
        /* 
            - 修改对象时，如果有其他对象指向该对象，则其他对象也会受到影响

            - 修改变量时，只会影响当前变量，不会影响其他变量

            在使用变量存储对象时，很容易因为改变变量指向的对象而导致其他变量也发生变化，造成程序运行错误。
                所以通常情况下，声明存储对象的变量时，最好使用 const 关键字，避免变量指向的对象被修改。

            注意：
                const只是禁止变量被重新赋值(锁定了变量的内存地址)，对对象的修改没有任何影响
        */
        // let obj = {
        //     name: "孙悟空",
        // }

        const obj = {
            name: "孙悟空",
        }

        // let obj2 = obj;
        const obj2 = obj;

        obj2.name = "猪八戒";   //修改对象
        // obj2 = null  //修改变量

        console.log(obj);
        console.log(obj2);

        const obj3 = {
            name: "猪八戒",
        }

        obj3.name = "沙和尚"

        console.log(obj3);
    </script>
```

#### 5.7 方法

```javascript
    <script>
        /* 
            补充内容

            方法(method):
                - 当一个对象的属性指向一个函数时，
                    那么我们就称这个函数是该对象的方法，
                    调用函数就称为调用对象的方法。
        */
        let obj = {}

        obj.name = "孙悟空"
        obj.age = 18

        //函数也可以成为一个对象的属性
        obj.sayHello = function () {
            alert("hello")
        }

        // console.log(obj);

        //调用方法
        obj.sayHello() // hello
    </script>
```

### 6、函数

#### 6.1 函数

```javascript
    <script>
        /*
            函数(Function)
                - 函数也是一个对象
                - 它具有其他对象的所有功能
                - 函数中可以存储代码，且可以在需要时调用执行

            语法：
                function 函数名(){
                        语句...
                    }
                
            调用函数：
                - 调用函数就是执行函数体中的代码
                语法：
                    函数对象()
            
            使用typeof检查函数，返回值是"function"

        */
        //创建函数对象
        function fn() {
            console.log("你好");
            console.log("hello");
            console.log("萨瓦迪卡");
            console.log("阿尼哈撒有");
            
        }

        // console.log(fn);

        //调用函数
        // fn();

        console.log(typeof fn); //function
    </script>
```

#### 6.2 函数的创建方式

```javascript
    <script>
        /* 
            函数的定义方式：
                1.函数声明
                    function 函数名() {
                        // 函数体
                    }

                2.函数表达式
                    const 函数名 = function() {
                        // 函数体
                    }

                3.箭头函数
                    const 函数名 = () => {
                        // 函数体
                    }
        */
        //声明函数
        function fn() {
            console.log("函数声明定义的函数");
        }

        //函数表达式定义的函数
        const fn2 = function () {
            log("函数表达式定义的函数");
        }

        //箭头函数定义的函数
        const fn3 = () => {
            console.log("箭头函数定义的函数");
        }

        //如果箭头函数只有一行，可以简写成如下形式
        const fn4 = () => console.log("箭头函数定义的函数");

        console.log(typeof fn);
        console.log(typeof fn2);
        console.log(typeof fn3);
        console.log(typeof fn4);
    </script>
```

#### 6.3 参数

```javascript
    <script>
        /* 
            定义一个可以求任意两个数的和的函数
        */

        // 方式1：使用函数声明
        function sum() {
            console.log(1 + 1);
        }

        // 方式2：使用函数表达式
        const sum2 = function () {
            console.log(1 + 1);
        }

        // 方式3：使用箭头函数
        const sum3 = () => console.log(1 + 1);

        sum(); // 输出2
        sum2(); // 输出2
        sum3(); // 输出2

        /* 
            形式参数：
                - 在定义函数时，可以指定数量不等的参数
                - 在函数中定义形参，就相当于在函数内部声明了内部变量，但是没有赋值
                - 参数：
                    1.如果实参和形参数量相同，则按顺序对应
                    2.如果实参多于形参数，则多余的实参会被忽略
                    3.如果实参少于形参数，则缺少的形参数会被赋值为undefined

                - 参数的类型：
                    - js中不会检查参数的类型，可以传递任何类型的值作为参数
            
            实际参数：
                - 调用函数时，在函数()中传入数量不等的实参
                - 实参会被传递给对应的形参

            1.函数声明
                function 函数名([参数]) {
                    // 函数体
                }

            2.函数表达式
                const 函数名 = function([参数]) {
                    // 函数体
                }

            3.箭头函数
                const 函数名 = ([参数]) => {
                    // 函数体
                }
        */
        function sum4(a, b) {
            console.log(a + b);
        }

        sum4(1, 2); // 输出3
        sum4(2, 3); // 输出5
        sum4("hello", "world"); // 输出 helloworld
        sum4(1); // 输出 NaN，因为缺少第二个参数
    </script>
```

#### 6.4 箭头函数的参数

```javascript
    <script>
        /* 
            
        */
        const fn = (a, b) => {
            console.log("a = ", a);
            console.log("b = ", b);
        }

        //只有一个参数时，可以省略括号
        const fn1 = a => {
            console.log("a = ", a);
        }

        //定义参数时，可以指定默认值
        const fn3 = (a = 10, b = 20, c = 30) => {
            console.log("a = ", a);
            console.log("b = ", b);
            console.log("c = ", c);
        }

        fn(123, 456);
        fn1(789);
        fn3(1, 2, 3);

        //当没有传入参数时，默认值就会生效
        fn3();
    </script>
```

#### 6.5 对象作为参数

```javascript
    <script>

        function fn(a) {
            // console.log("a = ", a);

            //对象属性也可以作为参数传递给函数
            // console.log(a.name);

            a = {}
            a.name = "猪八戒";
            console.log(a);
        }

        //对象可以作为参数传递给函数
        let obj = { name: "孙悟空" }

        // fn(123)

        //传递实参时，传递的不是变量本身，而是变量所指向的对象
        fn(obj)

        console.log(obj);

        //函数每次调用时，都会创建一个新的对象，因此，函数内部的修改不会影响到外部的对象
        function fn2(a = { name: "沙和尚" }) {
            console.log("a = ", a);
            a.name = "唐僧"
            console.log("a = ", a);
        }

        fn2()   //沙和尚, 唐僧
        fn2()   //沙和尚, 唐僧

        //传递实参时，传递的不是变量本身，而是变量所指向的对象
        let obj2 = { name: "沙和尚" }

        function fn3(a = obj2) {
            console.log("a = ", a);
            a.name = "唐僧"
            console.log("a = ", a);
        }

        fn3()   //沙和尚, 唐僧
        fn3()   //唐僧, 唐僧
    </script>
```

#### 6.6 函数参数

```javascript
    <script>

        function fn(a) {
            console.log("a = ", a);
        }

        /* 
            在js中，函数也是一个对象(一等对象)
                别的对象能做的事，函数也可以
        */

        let obj = { name: "孙悟空" }

        function fn2() {
            console.log("我是fn2");
        }

        //把函数作为参数传递给另一个函数
        fn(fn2)

        //把匿名函数作为参数传递给另一个函数
        fn(function () {
            console.log("我是匿名函数");
        })

        //把箭头函数作为参数传递给另一个函数
        fn(() => console.log("我是箭头函数"));
    </script>
```

#### 6.7 函数的返回值

```javascript
    <script>
        function sum(a, b) {
            // console.log(a + b);
            //计算完成后，将结果返回而不是直接打印
            return a + b;
        }

        // sum(1, 2); // 3
        // sum(123, 456); // 579

        function fn() {
            /* 
                在函数中，可以通过return关键字来指定函数的返回值。
                    返回值就是函数的执行结果，函数调用完毕，返回值便会作为结果返回

                任何值都可以作为函数的返回值（包括对象，函数，数组等）
                    如果return后没有指定返回值，则默认返回undefined
                    如果不写return，函数的返回值依然是undefined

                return一执行，函数立即结束，后续代码不会再执行
            */
            // return "hello"
            // return { name: "孙悟空" }
            // return () => alert(123)
        }

        let result = fn(); // 调用函数并将结果赋值给变量result

        result = sum(1, 2)
        console.log(result); // hello
    </script>
```

#### 6.8 箭头函数的返回值

```javascript
    <script>
        /* 
            箭头函数的返回值
                如果直接在箭头后设置对象字面量作为返回值，对象字面量必须使用()括起来，否则会报错
        */
        // const sum = (a, b) => {
        //     return a + b;
        // }

        //箭头函数的返回值可以直接写在箭头后(只有一个语句才能这么写)
        const sum = (a, b) => a + b;

        //箭头函数后的返回值是一个对象字面量，必须使用()括起来
        const fn = () => ({ name: "孙悟空" })

        // let result = sum(123, 456);
        let result = fn();

        console.log(result);
    </script>
```

#### 6.9 全局作用域和局部作用域

```javascript
    <script>
        /* 
            作用域(scope)
                - 作用域指的是一个变量的可见区域
                - 作用域分为两种
                    - 全局作用域(global scope)
                        - 全局作用域在网页运行时创建，在网页关闭时销毁
                        - 所有直接编写到script标签中的代码都属于全局作用域
                        - 全局作用域中的变量是全局变量，可以在任意位置访问
                        - 全局作用域中的函数是全局函数，可以在任意位置调用

                    - 局部作用域(local scope)
                        - 块作用域(block scope)
                            - 是一种局部作用域
                            - 在代码块执行时创建，在代码块执行完毕结束时销毁
                            - 在块作用域中声明的变量是局部变量，只能在块内部范围访问
        */
        let a = "变量a"

        {
            let b = "变量b"
            console.log(a) // 变量a
            console.log(b) // 变量b
        }

        console.log(a) // 变量a
        console.log(b) // 报错，b未定义
    </script>
```

#### 6.10 函数作用域

```javascript
    <title>函数作用域</title>
    <script>
        /* 
            函数作用域：
                - 函数作用域也是一种局部作用域
                - 函数作用域在函数调用时产生，函数执行完毕后，函数作用域也就销毁了
                - 函数每次调用都会产生一个全新的函数作用域，互不干扰
                - 在函数中定义的变量是局部变量，只能在函数内部访问，外部不能访问
        */
        function fn() {
            let a = "fn中的变量a"
            console.log(a);
        }

        fn()
        fn()
        fn()

        // console.log(a); // 报错，a是全局变量，在函数外部不能访问
    </script>
```

#### 6.11 作用域链

```javascript
    <script>
        /* 
            作用域链
                - 当我们使用一个变量时
                    js引擎会优先在当前作用域中寻找变量
                        如果找到了，则直接使用该变量
                        如果没有找到，则向上一级作用域中寻找，直到全局作用域
                        如果全局作用域中也没有找到，则报错xxx is not defined
        */
        let a = 10
        {
            let a = "第一代码块中的a"
            {
                let a = "第二代码块中的a"
                console.log(a);
            }
        }

        let b = 33
        function fn() {
            let b = 44;
            function f1() {
                let b = 55;
                console.log(b);
            }
            f1();
        }

        fn();
    </script>
```

#### 6.12 window对象

```javascript
    <script>
        /*
            window对象
                - 在浏览器中，浏览器为我们提供了一个window对象，可以直接访问
                - window对象代表的是浏览器窗口，通过该对象可以对浏览器窗口进行各种操作
                    除此之外window对象还负责存储js的内置对象和浏览器的宿主对象
                - window对象的属性可以通过windows对象访问，也可以直接访问
                - 函数可以认为是window对象的方法
        */
        // alert(123)
        // window.alert(123)
        // window.console.log("哈哈");

        //向window对象添加是属性，会自动成为全局变量
        // window.a = 10;

        // console.log(a); // 10
        // console.log(window.a); // 10

        /*
            var用来声明变量，作用和let相同，但是var不具有块作用域
                - 在全局中使用var声明的变量，都会成为window对象的属性保存
                - 使用function声明的函数，都会成为window对象的方法保存
                - 使用let声明的变量，不会存储在window对象中，而是存在一个秘密的地方
        */
        var b = 20;  //等价于window.b = 20;

        function fn() {
            alert("我是fn")
        }

        // console.log(b);

        // fn()
        // window.fn(); // 等价于fn()

        // let c = 33
        // window.c = 44

        //优先访问33，如果没有33，再访问window.c
        // console.log(c);

        function fn2() {
            // let d = 10
            //var虽然没有块作用域，但是有函数作用域
            // var d = 10

            //在局部作用域中，如果没有使用let或var声明变量，则会自动声明为windows对象的属性，即全局变量
            d = 10  //等价于window.d = 10
        }

        fn2()

        console.log(d);
    </script>
```

#### 6.13 提升

```javascript
    <script>
        /* 
            变量的提升：
                - 使用var声明的变量，它会在所有代码执行前被声明
                    所以我们可以在变量声明之前使用它

            函数的提升：
                - 使用函数声明创建的函数，会在其他代码执行前被创建
                    所以我们可以在函数声明之前调用它

            let声明的变量实际上也会提升，但是在赋值之前被禁止访问
        */

        // fn();
        // fn2();    //报错，fn2未定义
        console.log(b); //报错，Cannot access 'b' before initialization
        

        console.log(a);

        var a = 10;
        // a = 10  //等价于window.a = 10;

        // console.log(a);

        function fn(){
            alert("我是fn函数")
        }

        //这个函数声明不行，这不会被提升
        var fn2 = function(){
            alert("我是fn2函数")
        }

        // fn();

        let b = 10

        // console.log(b);
    </script>
```

#### 6.14 练习

```javascript
    <script>
        // var a = 1

        // function fn() {
        //     a = 2;
        //     console.log(a);  // 2
        // }

        // fn(); 

        // console.log(a); // 2


        //变量和函数的提升同样适用于函数作用域
        // var a = 1

        // function fn() {
        //     //var提升到函数作用域顶部，此时a的值为undefined
        //     console.log(a);  // undefined
        //     var a = 2;
        //     console.log(a);  // 2
        // }

        // fn();

        // console.log(a); // 1


        // var a = 1

        // //定义形参，就相当于在函数作用域中声明了变量a，但是没有赋值
        // function fn(a) {
        //     console.log(a);  // undefined
        //     //给形参赋值，此时形参a的值为2，而不是函数作用域中的a
        //     a = 2;
        //     console.log(a);  // 2
        // }

        // fn();

        // console.log(a); // 1


        // var a = 1

        // //定义形参，就相当于在函数作用域中声明了变量a，但是没有赋值
        // function fn(a) {
        //     console.log(a);  // 1
        //     //给形参赋值，此时形参a的值为2，而不是函数作用域中的a
        //     a = 2;
        //     console.log(a);  // 2
        // }

        // fn(a);

        // console.log(a); // 1


        //练习
        console.log(a); //2
        var a = 1
        console.log(a); //1
        
        //提升后，赋值a为函数，此时a的值为函数，而不是函数的返回值
        function a() {
            alert(2)
        }
        console.log(a);//1
        
        var a = 3
        console.log(a);//3
        
        var a = function () {
            alert(4)
        }
        console.log(a);//4
        
        var a
        console.log(a);//4
    </script>
```

#### 6.15 debug

```javascript
    <script>
        //在代码中设置断点，可以让程序暂停运行，并进入调试模式
        //或者在浏览器中打断点，可以让程序暂停运行，并进入调试模式
        // debugger

        console.log(a); //2
        var a = 1
        console.log(a); //1

        //提升后，赋值a为函数，此时a的值为函数，而不是函数的返回值
        function a() {
            alert(2)
        }
        console.log(a);//1

        var a = 3
        console.log(a);//3

        var a = function () {
            alert(4)
        }
        console.log(a);//4

        var a
        console.log(a);//4
    </script>
```

#### 6.16 立即执行函数

```javascript
    <script>
        /*
            在开发中应该减少在全局作用域中编写代码

            所以我们的代码要尽可能编写到局部作用域中

            如果使用let声明变量，可以使用{}来创建块作用域
        */
        // let a = 10
        // let a = 20  // 这行代码会导致语法错误，因为变量a已经被声明过了

        // var a = 10;
        // var a = 20; // 这行代码不会导致语法错误，但是会覆盖之前的变量a的值，导致不可预测的结果

        // {
        //     let a = 10
        // }

        // {
        //     let a = 20
        // }

        // {
        //     var a = 10;
        // }

        // {
        //     var a = 20; // 这行代码不会导致语法错误，但是会覆盖之前的变量a的值，导致不可预测的结果
        // }

        // function fn() {
        //     var a = 10;
        // }

        // fn()

        // function fn2() {
        //     var a = 20;
        // }

        // fn2()

        //希望只创建一个只执行一次的匿名函数

        /* 
            立即执行函数(Immediately-Invoked Function Expression, IIFE)
                - 语法：
                    (function () {
                        // 这里是函数体
                    })()
                - 立即执行函数是一个匿名函数，并且它只会调用一次
                - 可以利用IIFE来创建一个一次性的函数作用域，避免污染全局作用域
        */
        (function () {
            let a = 10;
            console.log(a);
        })();

        //两个立即执行函数直接要用;隔开，否则会报错
        (function () {
            let a = 20;
            console.log(a);
        })()
    </script>
```

#### 6.17 函数中this

```javascript
    <script>
        /*
            this
                - 函数在执行时，js引擎每次都会传递进一个隐含的参数
                - 这个参数就是this
                - this会执行一个对象
                    - this所指向的对象根据调用方式的不同而不同
                        - 1.以函数形式调用时，this指向的是window
                        - 2.以方法形式调用时，this指向的是调用该方法的对象
                        ...
                - 通过this可以在方法中调用方法的对象
        */
        // function fn() {
        //     //this指向window
        //     console.log(this);
        // }

        // fn() //本质上还是调用window.fn()

        function fn2() {
            console.log("fn打印", this);
        }

        const obj = { name: "孙悟空" }

        obj.test = fn2;

        const obj2 = { name: "猪八戒", test: fn2 }

        // obj2.test() // 输出：fn打印 Object { name: "猪八戒", test: ƒ }

        // obj.test()    // 输出：fn打印 Object { name: "孙悟空", test: ƒ }


        //为两个对象添加一个方法，可以打印自己的名字
        const obj3 = {
            name: "沙和尚",
            sayHello: function () {
                console.log(this.name);
            }
        }
        const obj4 = {
            name: "唐僧",
            sayHello: function () {
                console.log(this.name);
            }
        }

        obj3.sayHello() // 输出：沙和尚
        obj4.sayHello() // 输出：唐僧
    </script>
```

#### 6.18 箭头函数的this

```javascript
    <title>箭头函数的this</title>
    <script>
        /* 
            箭头函数：
                ([arguments]) => 返回值

            例子：
                无参箭头函数：() => 返回值
                一个参数的箭头函数：a => 返回值
                多个参数的箭头函数：(a, b) => 返回值

                只有一个语句的箭头函数：() => 返回值
                只返回一个对象的箭头函数：() => ({...})
                有多行语句的函数：() => {
                    语句1;
                    语句2;
                    return 返回值;
                }

            箭头函数没有自己的this，它的this取决于外层作用域的this。
                箭头函数的this和它的调用方式无关
            
        */
        function fn() {
            console.log("fn->", this);
        }

        const fn2 = () => {
            console.log("fn2->", this); // 箭头函数没有自己的this，它的this取决于外层作用域的this。总是指向window
        }

        // fn()       // window
        // fn2()      // window

        const obj = {
            name: "孙悟空",
            // fn: fn,
            // fn2: fn2
            //简写为fn
            fn,
            fn2,
            sayHello() {
                console.log("hello, " + this.name);
                // function t(){
                //     console.log("t->", this);
                // }
                // t(); // window

                const t2 = () => {
                    console.log("t2->", this);
                }
                t2();    // 箭头函数没有自己的this，它的this取决于外层作用域的this。
            }
        }

        // obj.fn()    // obj
        // obj.fn2()   // window

        obj.sayHello() // hello, 孙悟空
    </script>
```

#### 6.19 严格模式

```javascript
    <script>
        /* 
            js中运行代码的模式有两种：正常模式和严格模式。
                - 正常模式：
                    - 默认情况下代码都运行在正常模式，
                        在正常模式下，语法检查不严格
                        它的原则是：只要代码能运行，就不要报错。
                    - 这种处理方式会导致代码运行效率较差
                
                - 严格模式：
                    - 在严格模式下，代码运行时，会进行语法检查，
                        1.它会禁止一些语法
                        2.更容易报错
                        3.提升了性能

                - 在开发中，尽量使用严格模式
                    这样可以将一些隐蔽的问题消灭在萌芽阶段
                        同时也能提升代码的运行性能
        */

        "use strict";

        // let a = 10;
        // a = 10;       // 正常模式下，可以直接赋值给变量，不报错。
        a = 10;       // 严格模式下，会报错，因为变量没有声明。

        // console.log(a);

        //函数的严格模式
        function fn() {
            "use strict";
        }
    </script>
```

### 7、面向对象

#### 7.1 面向对象

```javascript
    <script>
        /* 
            面向对象编程（Object-Oriented Programming，OOP）
                - 1.程序是干嘛的？
                    - 程序就是对现实世界的抽象(照片就是对人的抽象)
                - 2.对象是干嘛的？
                    - 一个事物抽象到程序中后就变成了对象
                    - 在程序的世界中，一切皆对象
                - 3.面向对象的编程
                    - 程序中的所有操作都是通过对象来完成的
                    - 做任何操作之前都要先找到对象，通过对象来完成各种操作
        */

        /* 
            心仪的女人：王老五
                - 一个事物通常由两部分组成：数据和功能
                - 一个对象有两部分组成：属性和方法
                - 事物的数据到了对象中，体现为属性
                - 事物的功能到了对象中，体现为方法

                - 数据：
                    姓名
                    年龄
                    身高
                    体重
                
                - 功能：
                    睡
                    吃
        */

        const five = {
            //添加属性
            name: '王老五',
            age: 48,
            height: 170,
            weight: 60,

            //添加方法
            sleep() {
                console.log(this.name + "睡觉了~");
            },

            eat() {
                console.log(this.name + "吃了东西~");
            }
        }

        console.log(five.name);
        five.sleep()
    </script>
```

#### 7.2 类

```javascript
    <script>
        /*
            使用object创建对象的问题
                1.无法区分出类型不同的对象
                2.不方便批量创建对象

            在js中可以通过类(class)来解决这个问题
                1.类是创建对象的模板，可以将对象中属性和方法定义在类中
                    定义后，就是直接通过类来创建对象
                2.通过同一个类创建的对象，我们成为同类对象
                    可以通过instaceof操作符来判断对象是否属于某个类
                    如果某个对象是由某个类创建的，那么该对象称为该类的实例

            语法：
                class 类名 {}   //类名要使用大驼峰命名法
                const 类名 = class {}

            通过类来创建对象
                new 类名()   //创建对象
         */

        // const five = {
        //     //添加属性
        //     name: '王老五',
        //     age: 48,
        //     height: 170,
        //     weight: 60,

        //     //添加方法
        //     sleep() {
        //         console.log(this.name + "睡觉了~");
        //     },

        //     eat() {
        //         console.log(this.name + "吃了东西~");
        //     }
        // }

        // const yellow = {
        //     name: "大黄",
        //     age: 3,
        //     sleep() {
        //         console.log(this.name + "睡觉了~");
        //     },
        //     eat() {
        //         console.log(this.name + "吃了东西~");
        //     }
        // }

        // console.log(yellow.name);
        // yellow.eat();

        // console.log(five);
        // console.log(yellow);


        //用const定义类
        // const Person = class {}

        //用class定义类
        //用Person类专门用来创建人的对象
        class Person {

        }

        //调用构造函数创建对象
        const p1 = new Person();
        const p2 = new Person();

        //测试对象是否创建成功
        //p1和p2都是同类对象，他们由Person类创建
        console.log(p1);
        console.log(p2);

        //检查p1是否属于Person类的实例
        console.log(p1 instanceof Person);  //true

        //用Dog类专门用来创建狗的对象
        class Dog {
        }

        const d1 = new Dog();
        const d2 = new Dog();

        console.log(d1);
        console.log(d2);
    </script>
```

#### 7.3 属性

```javascript
    <script>
        /* 
            类是创建对象的模板，要创建第一件事就是创建类。

            类自带严格模式，所以不需要使用"use strict"语句。
        */

        class Person {
            /* 
                类的代码块，默认就是严格模式            
                    类的代码块是用来设置对象属性的，不是什么代码可以都可以写
            */
            name = "孙悟空"   //Person的实例属性name p1.name
            age = 18  //实例属性，只能通过实例访问age p1.age

            static test = "test"  //静态属性，只能通过类名访问 Person.test
        }

        const p1 = new Person();
        const p2 = new Person();

        console.log(p1);
        console.log(p2);
    </script>
```

#### 7.4 方法

```javascript
    <script>
        class Person {
            name = "孙悟空"

            // sayHello= function() {}

            //实例方法，实例方法中this指向实例对象
            sayHello() {
                console.log('大家好，我是' + this.name);
            }

            //静态方法(类方法)，通过类来调用
            //静态方法中this指向类对象
            static test() {
                console.log('我是静态方法,' + this);
            }
        }

        const p1 = new Person()

        // console.log(p1);

        //实例方法调用
        p1.sayHello()

        //通过类调用
        Person.test()
    </script>
```

#### 7.5 构造函数

```javascript
    <script>
        /* 
            
        */
        // class Person {
        //     //当我们直接在类中指定实例属性的值时，
        //     //意味着我们创建的所有对象的属性都是相同的。
        //     name = "孙悟空"
        //     age = 18
        //     gendar = "男"

        //     sayHello() {
        //         console.log(this.name);
        //     }
        // }

        // const p1 = new Person();
        // const p2 = new Person();
        // const p3 = new Person();

        // console.log(p1);
        // console.log(p2);
        // console.log(p3);

        class Person {
            //类中可以添加一个特殊的方法constructor
            //该方法我们称为构造函数(构造方法)
            //构造函数在调用类创建对象时自动执行
            constructor(a, b, c) {
                //在构造函数中，为实例属性赋值
                //this关键字代表当前实例对象
                this.name = a;
                this.age = b;
                this.gendar = c;
            }

            sayHello() {
                console.log(this.name);
            }
        }

        const p1 = new Person("孙悟空", 18, "男");
        const p2 = new Person("猪八戒", 20, "男");
        const p3 = new Person("沙和尚", 16, "男");

        console.log(p1);
        console.log(p2);
        console.log(p3);

        p1.sayHello();
        p2.sayHello();
        p3.sayHello();
    </script>
```

#### 7.6 封装

```javascript
    <script>
        /* 
            面向对象的特点：
                封装、继承、多态

            1.封装
                - 对象就是存储不同数据的容器
                - 对象不仅负责存储属性，还有负责数据的安全
                - 直接添加到对象中的属性，并不安全，因为它们可以被外部代码随意修改
                - 如何确保数据的安全性？
                    1.私有化数据
                        - 将需要保护的属性设置为私有，只能在内部使用
                    2.提供setters和getters方法来开放属性的访问权限
                        - 属性设置私有，通过getter和setter方法操作属性带来的好处
                            1.可以控制属性的读取权限
                            2.可以在方法中对属性的值进行验证
                        
                - 封装主要用来保证数据的安全
                - 实现封装的方式
                    1.属性私有化
                    2.通过getters和setters方法来控制属性的访问权限
                        get 属性名() {
                            return this._属性名;
                        }

                        set 属性名(value) {
                            //对属性值进行验证
                            if (value < 0) {
                                console.log('属性值不能为负数');
                                return;
                            }
                            this._属性名 = value;
                        }
        */

        class Person {
            //使用#开头定义私有属性
            //私有属性只能在类的内部访问，外部代码无法访问
            #address = '花果山'

            //私有化属性，必须先声明属性，再定义构造函数
            #name
            #age
            #gender

            constructor(name, age, gender) {
                this.#name = name;
                this.#age = age;
                this.#gender = gender;
            }

            sayHello() {
                console.log(this.#name, this.#address);
            };


            //getter方法用来读取私有属性
            getName() {
                return this.#name;
            }

            //setter方法用来修改私有属性
            setName(name) {
                this.#name = name;
            }

            getAge() {
                return this.#age;
            }

            setAge(age) {
                if (age < 0) {
                    console.log('年龄不能为负数');
                    return;
                }
                this.#age = age;
            }

            //上面的getter和setter方法是旧的写法
            //ES6提供了更简洁的写法，直接在属性前加上get和set关键字
            get gender() {
                return this.#gender;
            }

            set gender(gender) {
                this.#gender = gender;
            }
        }

        const p1 = new Person('孙悟空', 18, '男');

        // p1.age = 'hello'  // 直接修改属性，不安全

        p1.setName('猪八戒');

        //错误的赋值，年龄不能为负数
        p1.setAge(-19);

        p1.gender = '女'; //这个时候调用的是set gender方法

        console.log(p1);
    </script>
```

#### 7.7 多态

```javascript
    <script>
        class Person {
            constructor(name) {
                this.name = name;
            }
        };

        class Dog {
            constructor(name) {
                this.name = name;
            }
        }

        class Test {
        }

        const dog = new Dog("旺财");
        const person = new Person("小李");
        const test = new Test();

        // console.log(dog);
        // console.log(person);

        /* 
            定义一个函数，这个函数将接受一个对象作为参数，它可以输出hello并打印name属性。

            多态
                - 在js中不会检查参数的类型，所以这就意味着任何数据都可以作为参数传递给函数。
                - 要调用某个函数，无需指定的类型，只要对象满足某些条件即可
                - 如果一个东西走路像鸭子，叫起来像鸭子，那么它就是鸭子。
                - 多态为我们提供了灵活性
        */
        function sayHello(obj) {
            //判断obj是否是Person的实例
            // if (obj instanceof Person) {
            console.log("hello," + obj.name);
            // }
        }

        sayHello(dog); // 输出 "hello,旺财"
        sayHello(person); // 输出 "hello,小李"

        sayHello(test) // 输出 "hello,undefined", 因为test没有name属性
    </script>
```

#### 7.8 继承

```javascript
    <script>
        /* 
            继承
                - 可以通过extends关键字来实现继承
                - 当一个类可以继承另一个类时，就相当于另一个类中的代码复制到当前类中
                - 继承发生时，被继承的类称为父类(超类)，继承它的类称为子类
                - 通过继承可以减少重复的代码，并且在不修改父类代码的情况下，可以扩展子类的功能

                封装 - 安全性
                继承 - 扩展性
                多态 - 灵活性
        */

        class Animal {
            constructor(name) {
                this.name = name;
            }

            sayHello() {
                console.log("动物在叫~");
            }
        }

        class Dog extends Animal {
        }

        class Cat extends Animal {
        }


        // class Dog {
        //     constructor(name) {
        //         this.name = name;
        //     }

        //     sayHello() {
        //         console.log("汪汪汪");
        //     }
        // }

        // class Cat {
        //     constructor(name) {
        //         this.name = name;
        //     }

        //     sayHello() {
        //         console.log("喵喵喵");
        //     }
        // }

        const dog = new Dog("旺财");
        const cat = new Cat("汤姆");

        dog.sayHello(); // 输出 "汪汪汪"
        cat.sayHello(); // 输出 "喵喵喵"

        console.log(dog);
        console.log(cat);
    </script>
```

#### 7.8 继承

```javascript
    <script>
        /*
            继承
                - 通过继承，可以在不修改一个类的情况下对其进行扩展
                - OCP开闭原则
                    - 程序应该对修改关闭，对扩展开放
        */

        class Animal {
            constructor(name) {
                this.name = name;
            }

            sayHello() {
                console.log("动物在叫~");
            }
        }

        class Dog extends Animal {
            //在子类中，可以通过创建同名方法来重写父类的方法
            sayHello() {
                console.log("汪汪汪");
            }
        }

        class Cat extends Animal {
            //构造函数也可以重写
            constructor(name, age) {
                //重写构造函数时，构造函数的第一行代码必须是super()，用来调用父类的构造函数
                super(name);    //调用父类的构造函数
                this.age = age;  //添加属性
            }
            sayHello() {
                //调用父类的sayHello方法
                super.sayHello();   //在方法中可以使用super关键字来调用父类的方法
                console.log("喵喵喵");
            }
        }

        const dog = new Dog("旺财");
        const cat = new Cat("汤姆", 5);

        dog.sayHello(); // 输出 "汪汪汪"
        cat.sayHello(); // 输出 "喵喵喵"

        console.log(dog);
        console.log(cat);
    </script>
```

#### 7.9 对象的结构

```javascript
    <script>
        /* 
            对象中储存的区域实际上由两个：
                1.对象自身
                    - 直接通过对象添加的属性
                    - 在类中通过x = y的形式添加的属性

                2.神秘的位置
                    - 对象中还有一些内容，会储存到其他的对象里(原型对象)
                    - 在对象中会有一个属性用来储存原型对象，这个属性叫做__proto__
                    - 原型对象也负责为对象储存属性
                        当我们访问对象中的属性时，会优先访问对象自身中的属性，
                        如果没有，则会访问原型对象中的属性
                    - 会添加到原型对象中的情况：
                        1.在类中通过xxx(){}方式添加的方法，位于原型对象中
                        2.主动向原型对象中添加的属性或方法
        */
        class Person {
            //在类中通过x = y的形式添加的属性
            name = '孙悟空'
            age = 18

            //直接通过对象添加的属性
            // constructor() {
            //     this.gender = '男';
            // }

            sayHello() {
                console.log(`hello，我是${this.name}`);
            }
        }

        const p = new Person();

        // p.address = '北京市朝阳区'; //直接通过对象添加的属性

        //优先访问对象自身中的属性
        p.sayHello = "hello"

        console.log(p.sayHello);
    </script>
```

#### 7.10 原型对象

```javascript
    <script>
        class Person {
            name = "孙悟空"
            age = 18

            sayHello() {
                console.log("Hello,我是", this.name);
            }
        }

        const p = new Person();

        // console.log(p.__proto__);    //打印p的原型对象

        /* 
            访问一个对象的原型对象
                对象.__proto__
            
            原型对象中的数据
                1.对象中的数据(属性和方法)
                2.constructor属性，指向构造函数

            注意：
                原型对象也有自己的原型对象，这样就构造了一个链条，称为原型链
                根据对象的复杂程度，原型链的长度也不同
                p的原型链：p对象->原型->原型->null
                obj的原型链：obj对象->原型->null

            原型链：
                - 对象读取属性时，有优先读取自身的属性
                    如果对象自身中没有，则读取原型对象中的属性
                    如果原型对象中也没有，则继续读取原型对象的原型对象中的属性，直到找到Object对象的原型null为止
                    如果依然没有找到，则返回undefined

                - 作用域链，是找变量的链，找不到会报错
                - 原型链，是找属性的链，找不到会返回undefined
        */

        //检查某个对象的原型
        console.log(Object.getPrototypeOf(p));

        //两个方法获取原型对象，Object.getPrototypeOf()和__proto__属性
        // console.log(Object.getPrototypeOf(p) === Person.prototype);   //true

        // console.log(p.constructor);
        // console.log(p.__proto__);
        // console.log(p.__proto__.__proto__);
        // console.log(p.__proto__.__proto__.__proto__); //null

        const obj = {}

        console.log(obj);
        console.log(obj.__proto__);
        console.log(obj.__proto__.__proto__);
    </script>
```

#### 7.11 原型对象

```javascript
    <script>
        class Person {
            name = "孙悟空"
            age = 18

            sayHello() {
                console.log("hello, my name is " + this.name);
            }
        }

        class Dog {

        }

        const p = new Person();
        const p2 = new Person();

        const d = new Dog();
        const d2 = new Dog();

        /* 
            所有的同类对象它们的原型对象都是同一个
                也就意味着同类对象它们的原型对象是相同的

            原型的作用：
                原型就相当于一个公共的区域，它可以被所有该类实例访问
                    可以将一个该类实例中，所有的公共属性和方法，都放在原型上，
                    这样就可以让所有该类实例都可以访问到这些属性和方法。

                js中继承就是通过原型来实现的
                    当我们继承时，子类的原型就是父类的实例
                
            在对象中有些值是对象独有的，像属性(name,age,gender)，每个对象都有自己的属性，
                但是有些值对于每个对象都是一样的，比如一些方法，这些方法对于每个对象都是一样的，
                所以可以将这些方法放在原型上，这样就可以让所有该类实例都可以访问到这些方法。

            尝试：
                函数的原型链是什么样？
                Object的原型链是什么样？
        */

        console.log(p);
        console.log(p2);
        console.log(p === p2);  // false

        //同类对象它们的原型对象都是同一个
        console.log(p.__proto__ === p2.__proto__);  // true

        //不同类对象它们的原型对象不同
        console.log(d.__proto__ === p2.__proto__);  //false

        class Animal { }

        class Cat extends Animal { }

        const cat = new Cat();

        console.log(cat);
        console.log(cat.__proto__);
        console.log(cat.__proto__.__proto__);
        console.log(cat.__proto__.__proto__.__proto__);
        console.log(cat.__proto__.__proto__.__proto__.__proto__);
    </script>
```

#### 7.12 如何修改原型

```javascript
    <script>
        /* 
            大部分情况下，我们不建议修改原型，因为这样会影响到所有实例的行为。
                注意：
                    千万不要通过类的实例修改原型
                        1.通过一个对象，影响所有同类对象，这么做不合适
                        2.修改原型得先创建实例，麻烦
                        3.危险！！！

            除了__proto__属性，还有其他方式修改原型
                还可以用类的prototype属性改变原型，但不建议使用。
                修改原型时，最好通过类去修改
                好处：
                    1.已经修改就会修改所有实例的原型
                    2.无需创建实例，直接修改原型，更加方便

            原则：
                1.原型尽量不要手动改
                2.要改也不要通过实例对象改
                3.要通过.prototype属性改原型，不要直接修改__proto__属性
                4.最好不要给prototype去赋值，因为会影响所有实例的原型
        */

        class Person {
            name = "孙悟空"
            age = 18

            sayHello() {
                console.log(`hello,my name is ${this.name}`);
            }
        }

        class Dog {

        }

        const p = new Person();
        const p2 = new Person();

        //通过对象修改原型，向原型中添加方法，修改后所有实例都可以调用该方法
        // p.__proto__.run = () => {
        //     console.log(`I am running!`);
        // }

        // p.__proto__ = new Dog() //直接为对象赋值了一个新的原型

        // console.log(p);
        // console.log(p2);

        // p.run() // 输出：I am running!
        // p2.run() // 输出：I am running!

        // console.log(Person.prototype);  //访问Person实例的原型

        Person.prototype.fly = () => {
            console.log(`I am flying!`);
        }

        p.fly()
        p2.fly()
    </script>
```

#### 7.13 instanceof和hasown

```javascript
    <script>
        class Animal { }
        class Dog extends Animal { }
        const dog = new Dog();

        /* 
            instanceof用来检查一个对象是否是某个类的实例，返回true或false。
                - instanceof检查的是该对象的原型链是否有该类实例
                    只要原型链上有该类实例，就返回true，否则返回false。

                - 
                    dog -> animal -> Object -> null
                    dog -> Dog -> Animal -> Object -> null

                - object是所有对象的原型，所以任何和对象object进行instanceof的操作，都会返回true。
        */
        // console.log(dog instanceof Dog);     // true
        // console.log(dog instanceof Animal);  // true
        // console.log(dog instanceof Object);  // true

        const obj = new Object();
        // console.log(obj.__proto__);
        // console.log(Object.prototype);
        // console.log(Object.prototype ===obj.__proto__); // true

        class Person {
            name = "孙悟空"
            age = 18

            sayHello() {
                console.log("hello,我是" + this.name);
            }
        }
        const p = new Person()
        /* 
            in
                - in用来判断对象是否有某个属性，返回true或false
                - 无论属性是在对象本身还是原型链上，都可以用in判断。

            hasOwnProperty(不推荐使用了)
                - 用法
                    对象.hasOwnProperty(属性名)
                    判断对象本身是否有该属性，返回true或false。
                    注意：hasOwnProperty只判断对象本身的属性，不包括原型链上的属性。

            Object.hasOwn(推荐使用)
                - 用法
                    Object.hasOwn(对象,属性名)
                    判断对象本身是否有该属性，返回true或false。
                    注意：Object.hasOwn只判断对象本身的属性，不包括原型链上的属性。

        */
        console.log("name" in p)      //true
        console.log("sayHello" in p)    //true

        console.log(p.hasOwnProperty("name"))    //true
        console.log(p.hasOwnProperty("sayHello"))    //false

        //hasprototype也在原型当中
        console.log(p.__proto__.__proto__.hasOwnProperty("hasOwnProperty"));    //true

        //Object.hasOwn
        //用来判断对象是否有某个属性，返回true或false。
        //注意：Object.hasOwn只判断对象本身的属性，不包括原型链上的属性。
        console.log(Object.hasOwn(p, "name"));    //true
    </script>
```

#### 7.14 旧类

```javascript
    <script>
        /* 
            早期的js中，直接通过函数来定义类
                - 一个函数直接调用xxx()，那么这个就是普通函数
                - 一个函数如果通过new调用 new xxx()，那么这个就是构造函数


        */
        /* 
            等价于 class Person {
            
            }
        */

        //用立即函数包裹，避免全局变量污染
        var Person = (function () {
            function Person(name, age) {
                //在构造函数中，this指向实例对象
                this.name = name;
                this.age = age

                //不推荐这么写
                // this.sayHello = function () {
                //     console.log("Hello, my name is " + this.name);
                // }

            }

            //向原型中添加属性(方法)
            Person.prototype.sayHello = function () {
                console.log("Hello, my name is " + this.name);
            }

            //添加静态属性
            Person.stateProperty = "xxx"

            //添加静态方法
            Person.staticMethod = function () {
                console.log("静态方法");
            }
            return Person;
        })();


        const p = new Person("孙悟空", 18)

        console.log(p);

        var Animal = (function () {
            function Animal() {

            }

            return Animal;
        })();

        var Cat = (function () {
            function Cat() { 

            }

            //继承Animal
            Cat.prototype = new Animal();

            return Cat;
        })();

        var cat = new Cat();

        console.log(cat);
    </script>
```

#### 7.15 new运算符

```javascript
    <script>
        /* 
            new运算符是创建对象时要使用的操作符。
                - 使用new时，到底发生了什么？
                - https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new
                - 当使用 new 关键字调用函数时，该函数将被用作构造函数。
                    使用new调用函数时，将会发生这些事
                    1.创建一个空的简单 JavaScript 对象。为方便起见，我们称之为 newInstance。
                    2.如果构造函数的 prototype 属性是一个对象，则将 newInstance 的 [[Prototype]] 指向构造函数的 prototype 属性，
                        否则 newInstance 将保持为一个普通对象，其 [[Prototype]] 为 Object.prototype。
                    3.使用给定参数执行构造函数，并将 newInstance 绑定为 this 的上下文（换句话说，在构造函数中的所有 this 引用都指向 newInstance）。
                    4.如果构造函数返回非原始值，则该返回值成为整个 new 表达式的结果。
                        否则，如果构造函数未返回任何值或返回了一个原始值，则返回 newInstance。（通常构造函数不返回值，但可以选择返回值，以覆盖正常的对象创建过程。）
        */

        function Myclass() {
            // var newInstance = {}
            // obj.__proto__ = Myclass.prototype;

            // return { name: "孙悟空" }
            return 1
        }

        var mc = new Myclass();

        // console.log(mc);

        class Person {
            constructor() {

            }

        }

        new Person();

    </script>
```

#### 7.16 总结

```javascript
    <script>
        /* 
            面向对象本质：编写代码时，所有的操作都是通过对象来进行的。
                面向对象的编程的步骤：
                    1.找对象
                    2.搞对象

                学习对象：
                    1.明确对象代表什么，有什么用
                    2.如果获取到这个对象
                    3.如何使用这个对象（对象中的属性和方法）

                对象的分类：
                    1.内建对象
                        - 有ES标准定义的对象
                        - 比如，Object String Number...

                    2.宿主对象
                        - 由浏览器提供的对象
                        - BOM DOM

                    3.自定义对象
                        - 由开发人员创建的对象
        */
    </script>
```

### 8、数组

#### 8.1 数组

```javascript
    <script>
        /* 
            数组(Array)
                - 数组也是一种复合类型的数据类型，在数组可以储存多个不同类型的数据
                - 数组中存储的是有序的数据，数组中的每个数据都有一个唯一的索引
                    可以通过索引来操作获取数据
                - 数组中存储的数据叫做元素

                - 创建数组
                    通过Array()来创建数组，也可以通过[]创建数组

                - 索引(index)
                    是一组大于0的整数

                - 向数组中添加元素
                    语法：
                        数组[索引] = 元素

                - 读取数组中的元素
                    语法：
                        数组[索引]
                        - 如果索引了一个不存在的元素，不会报错，而是返回undefined
                - length属性
                    - 获取数组元素的长度
                    - 获取的实际值就是数组的索引最大值+1
                    - 向数组的最后添加元素
                        数组[数组.length] = 元素
                

        */
        const obj = { name: "孙悟空", age: 18 }

        // 创建数组
        const arr = new Array()
        const arr2 = [] //数组字面量，和上面的等价

        arr[0] = 10
        arr[1] = "hello"
        arr[2] = true
        arr[3] = obj
        arr[0] = 30

        //使用数组时，应该避免非连续数组，它的性能不好
        // arr[100] = "world" // 索引可以大于数组长度，会自动填充空位

        console.log(arr);
        console.log(arr2);

        console.log(arr[1]);

        console.log(typeof arr); // object

        console.log(arr.length); // 4

        arr[arr.length] = 33; // 向数组末尾添加元素

        arr.length = 10; // 改变数组长度，会自动填充空位
        arr.length = 2; // 改变数组长度，会自动删除数组末尾元素

        console.log(arr);
    </script>
```

#### 8.2 遍历数组

```javascript
    <script>
        //任何数据类型的值都可以成为数组中的元素
        let arr = [1, "hello", true, null, { name: "孙悟空" }, () => { }]

        //创建数组时，尽量确保数组中存储的数据类型是相同的
        arr = ["孙悟空", "猪八戒", "沙和尚", "唐僧", "白骨精"]
        // console.log(arr);

        /* 
            遍历数组
                - 遍历数组简单理解，就是获取数组中的每一个元素
        */

        // console.log(arr[0]);
        // console.log(arr[1]);
        // console.log(arr[2]);

        //正常遍历数组
        // for (let i = 0; i < arr.length; i++) {
        //     console.log(arr[i]);
        // }

        //倒着遍历数组
        // for (let i = arr.length - 1; i >= 0; i--) {
        //     console.log(arr[i]);
        // }

        /* 
            定义一个Person类，类中有两个属性name和age，分别代表人的姓名和年龄
                然后创建几个Person对象，将其添加到一个数组中

            遍历数组，并打印未成年人的信息
        */

        class Person {
            constructor(name, age) {
                this.name = name;
                this.age = age;
            }
        }

        const personArr = [
            new Person("孙悟空", 18),
            new Person("沙和尚", 38),
            new Person("猪八戒", 8),
        ]

        for(let i = 0; i < personArr.length; i++) {
            if(personArr[i].age < 18) {
                console.log(personArr[i].name + "只有" + personArr[i].age + "岁，是未成年");
            }
        }
    </script>
```

#### 8.3 for-of语句

```javascript
    <script>
        /* 
            for-of语句可以用来遍历数组或者其他可迭代对象

            语法：
                for(变量 of 可迭代对象){
                    语句...
                }

            执行流程：
                for-of的循环体会执行多次，数组中有几个元素，循环体就会执行几次。
                    每次执行时都会将一个元素赋值给元素

        */

        const arr = ["孙悟空", "猪八戒", "沙和尚", "唐僧"]

        for(value of arr){
            console.log(value);
        }

        //遍历字符串
        for(value of "hello world"){
            console.log(value);
        }
    </script>
```

#### 8.4 数组方法

```javascript
    <script>
        /* 
            https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array

            Array.isArray()
                - 检查一个值是否是数组
                - 返回一个布尔值
            
            at()
                - 可以根据索引获取数组中的元素
                - at可以接收负数索引
                - 如果索引超出范围，则返回undefined

            concat()
                - 用来连接两个或多个数组，并返回一个新数组
                - 非破坏性方法,不会修改原数组，而是返回一个新数组
        */

        // console.log(Array.isArray([1, 2, 3])); // true
        // console.log(Array.isArray({})); // false

        const arr = ["孙悟空", "猪八戒", "沙和尚", "唐僧"]

        // console.log(arr.at(1)); // "猪八戒"

        // //at可以接收负数索引
        // console.log(arr.at(-1)); // "唐僧"

        // console.log(arr.at(10)); // undefined

        const arr2 = ["白骨精", "蜘蛛精", "玉兔精"]

        // arr3 = arr.concat(arr2);
        arr3 = arr.concat(arr2,["牛魔王","蝙蝠精"]);    //连接多个数组

        console.log(arr3);
    </script>
```

#### 8.5 数组里的方法

```javascript
    <script>
        const arr = ["孙悟空", "猪八戒", "沙和尚", "唐僧", "沙和尚"]

        /* 
            indexof()
                - 获取元素在数组中第一次出现的索引，如果不存在则返回-1。
                - 参数：
                    1.要查询的元素
                    2.查询的起始位置（可选，默认为0）
                
            lastIndexOf()
                - 获取元素在数组中最后一次出现的索引，如果不存在则返回-1。
                - 参数：
                    1.要查询的元素
                    2.查询的起始位置

            join()
                - 将一个数组中元素连接成一个字符串。
                - 参数：
                    1.分隔符（可选，默认为逗号）

            slice()
                - 截取数组的一部分，返回一个新数组。(非破坏性操作)
                - 参数：
                    1.起始索引（可选，默认为0）
                    2.结束索引，不包括该位置（可选，默认为数组长度）
                        - 第二个参数可以省略，表示截取到数组末尾
                        - 索引可以是负值，表示从数组末尾向前数的位置
                    3.如果两个参数都省略，则返回整个数组的浅拷贝。

        */

        // let result = arr.indexOf("沙和尚",3)    // 从索引3开始查询

        // let result = arr.lastIndexOf("沙和尚")    // 从数组末尾开始查询
        // let result = arr.lastIndexOf("沙和尚", 3)

        // result = arr.lastIndexOf("白骨精")    // 没有查询到，返回-1

        // result = arr.join()    // 将数组元素连接成一个字符串，默认使用逗号分隔
        // result = arr.join("-")    // 将数组元素连接成一个字符串，使用"-"分隔

        // result = arr.slice(0,2)    // 截取数组的前两个元素，返回一个新数组

        // result = arr.slice(2)    // 截取数组的从索引2开始到末尾的所有元素，返回一个新数组

        // result = arr.slice(-2)    // 截取数组的最后两个元素，返回一个新数组

        result = arr.slice()     // 截取整个数组，返回一个新数组

        console.log(result)
    </script>
```

#### 8.6 对象的复制

```javascript
    <script>
        const arr = ["孙悟空", "猪八戒", "沙和尚"]

        // const arr2 = arr

        //这不是复制，只是创建了两个变量，指向同一个数组对象
        // arr[0] = "唐僧" // 修改arr的第一个元素，会影响arr2的第一个元素

        //复制必须产生一个新对象
        //当调用slice()方法时，会产生一个新的数组对象，从而完成数组的复制
        const arr3 = arr.slice()

        arr[0] = "唐僧"

        console.log(arr);
        console.log(arr3);
    </script>
```

#### 8.7 浅拷贝和深拷贝

```javascript
    <script>
        /* 
            浅拷贝(shallow copy)
                - 通常对对象的拷贝都市浅拷贝
                - 浅拷贝顾名思义，只对对象的浅层进行复制（只复制一层对象的引用，而不复制其内部的对象）
                - 对象中存储的数据是原始值，那么拷贝的深浅不重要
                - 浅拷贝只会对对象本身进行复制，不会复制其内部的对象

            深拷贝(deep copy)
                - 深拷贝不仅要复制对象本身，还要复制对象中的属性和元素
                - 深拷贝会递归地复制对象中的所有子对象，直到所有子对象都被复制完毕
                - 深拷贝会创建新的对象，并复制所有属性和元素，因此，深拷贝比浅拷贝更加耗费资源
                - 因为性能差，通常不用深拷贝，只用浅拷贝即可
        */

        const arr = [{ name: "孙悟空" }, { name: "猪八戒" }]
        const arr2 = arr.slice() // 浅拷贝

        // 修改arr中的值
        //浅拷贝只会复制对象引用，不会复制对象内部的属性
        //所以arr2中的值也会随之改变
        arr[0].name = "唐僧";

        console.log(arr);
        console.log(arr2);

        //专门用来深拷贝的方法 structuredClone()
        const arr3 = structuredClone(arr)

        console.log(arr3);
    </script>
```

#### 8.8 对象的复制

```javascript
    <script>
        const arr = ["孙悟空", "猪八戒", "沙和尚"]

        // 数组的浅拷贝
        const arr2 = arr.slice()

        // console.log(arr2 === arr);     // false

        /* 
            ...(展开运算符)
                - 可以将一个数组中的元素展开到另一个数组中或作为函数的参数传递
        */
        //手动实现数组的浅拷贝
        // const arr3 = [arr[0], arr[1], arr[2]]

        //利用展开运算符实现浅拷贝，和上面手动拷贝的结果一样
        const arr3 = [...arr]

        //复制的同时修改原数组的值
        // const arr3 = ["唐僧", ...arr, "白骨精"] //

        // console.log(arr);
        // console.log(arr3);

        function sum(a, b, c) {
            return a + b + c;
        }

        const arr4 = [10, 20, 30]

        // let result = sum(arr4[0], arr4[1], arr4[2])

        //简写为
        const result = sum(...arr4)

        // console.log(result);

        /* 
        
            对象的复制
                - Object.assign(目标对象,被复制对象)
                - 被复制对象中的属性元素复制到目标对象，并返回目标对象

            - 也可以使用展开运算符对对象进行复制
        */

        const obj = { name: "孙悟空", age: 18 }


        // const obj2 = ({}, obj)

        //把后面这个对象属性和元素复制到前面这个对象中
        //会增加新属性，会覆盖已有属性
        const obj2 = { address: "北京市海淀区西二旗", age: 20 }

        Object.assign(obj2, obj)

        // console.log(obj2);

        // console.log(obj2 === obj); // false

        //利用展开运算符实现对象浅拷贝
        //会增加新属性，会覆盖已有属性,18会覆盖5,后面的25会覆盖前面的18
        const obj3 = { address: "高老庄", age: 5, ...obj, age: 25 }

        console.log(obj3);
    </script
```

#### 8.9 数组的方法

```javascript
    <script>
        const arr = ["孙悟空", "猪八戒", "沙和尚"]

        /* 
            push()
                - 在数组末尾添加一个或多个元素,返回数组长度
            pop()
                - 删除数组末尾的元素,返回删除的元素
            unshift()
                - 在数组开头添加一个或多个元素,返回数组长度
            shift()
                - 删除数组开头的元素,返回删除的元素
            splice()
                - 可以删除、添加、替换数组中的元素
                - 参数：
                    1.删除的起始位置
                    2.删除的元素个数（可选）
                    3.要添加的元素（可选）
                - 返回被删除的元素
            reverse()
                - 反转数组元素的顺序
        */

        let result = arr.push("唐僧") // 在数组末尾添加一个或多个元素,返回数组长度

        console.log(arr);
        // console.log(result); // 4

        result = arr.pop() // 删除数组末尾的元素,返回删除的元素

        console.log(arr);

        result = arr.unshift("白骨精") // 在数组开头添加一个或多个元素,返回数组长度

        console.log(result);    //4

        console.log(arr);

        result = arr.shift() // 删除数组开头的元素,返回删除的元素

        console.log(result);

        console.log(arr);

        //删除数组中指定位置的元素，并返回被删除的元素
        result = arr.splice(1, 1)

        console.log(result); // ["猪八戒"]

        console.log(arr);

        //替换数组中指定位置的元素，并返回被替换的元素
        result = arr.splice(1, 1, "牛魔王")

        console.log(result); // ["沙和尚"]

        console.log(arr); //增加了一个牛魔王

        //增加多个元素
        result = arr.splice(1, 0, "白龙", "玉女")

        console.log(result); // []

        console.log(arr); //增加了白龙和玉女

        arr2 = ["a", "b", "c", "d"]

        //反转数组元素的顺序
        arr2.reverse()

        console.log(arr2);

        /*
            有如下一个数组
                arr = [1,2,1,3,2,4,5,5,6,7]

            编写代码，去除数组中重复的元素，并返回一个新的数组。
        */
    </script>
```

#### 8.10 数组去重

```javascript
    <script>

        /*
            有如下一个数组
                arr = [1,2,1,3,2,4,5,5,6,7]

            编写代码，去除数组中重复的元素，并返回一个新的数组。
        */

        arr = [1, 2, 1, 3, 2, 2, 4, 5, 5, 6, 7]

        // console.log(arr.length); // 10

        //分别获取数组中元素
        for (i = 0; i < arr.length; i++) {
            //获取当前值后面的所有值
            for (j = i + 1; j < arr.length; j++) {
                //判断两个值是否相等
                if (arr[i] == arr[j]) {
                    //出现了重复的元素，删除后面的元素
                    arr.splice(j, 1);

                    /* 
                        当arr[i]和arr[j]相等时，删除arr[j]，j+1位置的元素会自动前移一位，成为j，
                        就不会比较这个元素和其他元素了，就漏掉了

                        解决办法，当删除一个元素后，j--，让j指向下一个元素，继续比较
                    */
                    j--;
                }

            }
        }

        console.log(arr);
    </script>
```

#### 8.11 数组去重

```javascript
    <script>
        /*
            有如下一个数组
                arr = [1,2,1,3,2,4,5,5,6,7]

            编写代码，去除数组中重复的元素，并返回一个新的数组。
        */

        arr = [1, 2, 1, 3, 2, 2, 4, 5, 5, 6, 7]

        // //获取数组中元素
        // for (let i = 0; i < arr.length; i++) {
        //     const index = arr.indexOf(arr[i], i + 1)
        //     if (index !== -1) {
        //         //出现重复元素
        //         arr.splice(index, 1)
        //         i--
        //     }
        // }

        // console.log(arr)

        const newArr = []
        for (let ele of arr) {
            if (newArr.indexOf(ele) === -1) {
                newArr.push(ele)
            }
        }
        console.log(newArr)

        /*
            有一个数组
            [9,1,3,2,8,0,5,7,6,4]

            编写代码，排序（升序）
        */
    </script>
```

#### 8.12 冒泡排序

```javascript
    <script>
        /*
            有一个数组
            [9,1,3,2,8,0,5,7,6,4]

            编写代码，排序（升序）

            思路一：
                9,1,3,2,8,0,5,7,6,4
                - 比较相邻的两个元素，然后根据大小来交换位置
                - 例子：
                    第一次比较：1,3,2,8,0,5,7,6,4,9
                    第二次比较：1,2,3,0,5,7,6,4,8,9

                - 这种排序方式，被称为冒泡排序，时间复杂度为O(n^2)，是最慢的排序算法
                    数量少还行，数量多就很慢了

            思路二：
                9,1,3,2,8,0,5,7,6,4
                - 取出一个元素，然后将其他元素与它比较，如果比它小，则交换位置
                - 例子：
                    第一次比较：0,9,3,2,8,1,5,7,6,4
                    第二次比较：0,1,9,3,8,2,5,7,6,4
                - 这种排序方式，被称为选择排序，时间复杂度为O(n^2)，是不稳定的排序算法
        */
        const arr = [9, 1, 3, 2, 8, 0, 5, 7, 6, 4]
        for (let j = 0; j < arr.length - 1; j++) {
            for (let i = 0; i < arr.length - 1; i++) {
                //arr[i] 前面的元素  arr[i+1] 后面的元素
                //大数在前面，小数在后面，需要交换位置
                //改变>和<的位置，可以实现降序排序
                if (arr[i] < arr[i + 1]) {
                    //临时变量，用于交换位置
                    let temp = arr[i]
                    arr[i] = arr[i + 1]
                    arr[i + 1] = temp
                }
            }
        }

        console.log(arr);
    </script>
```

#### 8.13 选择排序

```javascript
    <script>

        /* 
            9, 1, 3, 2, 8, 0, 5, 7, 6, 4
            第一次排序： 1, 3, 2, 8, 0, 5, 7, 6, 4, 9
            第二次排序： 1, 2, 3, 0, 5 ,7, 6, 4, 8, 9
            第三次排序： 1,2,0,3,5,6,4,7,8,9
        */

        const arr = [9, 1, 3, 2, 8, 0, 5, 7, 6, 4]

        //冒泡排序
        // for (let j = 0; j < arr.length - 1; j++) {
        //     for (let i = 0; i < arr.length - j - 1; i++) {
        //         if (arr[i] > arr[i + 1]) {
        //             let temp = arr[i]
        //             arr[i] = arr[i + 1]
        //             arr[i + 1] = temp
        //         }
        //     }
        //     console.log(arr);
        // }

        // console.log(arr);

        /* 
            选择排序
                - 取出一个元素，然后将它和其他元素进行比较，如果它比其他元素小，则交换位置
        */
        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] > arr[j]) {
                    let temp = arr[i]
                    arr[i] = arr[j]
                    arr[j] = temp
                }
            }
            // console.log(arr);
        }
        console.log(arr);
    </script>
```

#### 8.14 封装函数

```javascript
    <script>

        // const arr = [9, 1, 3, 2, 8, 0, 5, 7, 6, 4]
        // const arr2 = [9, 8, 7, 6, 5, 4, 3, 2, 1]

        // function sort(array) {

        //     //做个浅复制
        //     // const arr = array.slice()
        //     const arr = [...array]

        //     for (let i = 0; i < arr.length; i++) {
        //         for (let j = i + 1; j < arr.length; j++) {
        //             if (arr[i] > arr[j]) {
        //                 let temp = arr[i]
        //                 arr[i] = arr[j]
        //                 arr[j] = temp
        //             }
        //         }
        //     }
        //     //返回这个新的数组
        //     return arr
        // }

        // // sort(arr)

        // console.log(sort(arr));
        // console.log(sort(arr2));

        class Person {
            constructor(name, age) {
                this.name = name;
                this.age = age;
            }
        }

        const personArr = [
            new Person("孙悟空", 18),
            new Person("沙和尚", 38),
            new Person("猪八戒", 8),
            new Person("白骨精", 16),
        ]

        //filter函数用来过滤数组中的元素
        function filter(arr) {

            const newArr = []

            for (let i = 0; i < arr.length; i++) {
                if (arr[i].age < 18) {
                    newArr.push(arr[i])
                }
            }
            return newArr
        }

        let result = filter(personArr)
        console.log(result);
        
    </script>
```

#### 8.15 问题(回调函数)

```javascript
    <script>
        class Person {
            constructor(name, age) {
                this.name = name;
                this.age = age;
            }
        }

        const personArr = [
            new Person("孙悟空", 18),
            new Person("沙和尚", 38),
            new Person("猪八戒", 8),
            new Person("白骨精", 16),
        ]

        //filter函数用来过滤数组中的元素
        /* 
            目前我们的函数只能过滤age小于18的对象
                希望过滤更加灵活
                    比如：过滤数组中大于18的对象
                            age大于60的对象
                            age大于n的对象
                        过滤数组中的偶数
                        过滤数组中的奇数
                        ...

            一个函数的参数也可以是函数
                如果将函数作为参数，我们就称这个函数为回调函数(callback function)
        */
        function filter(arr, cd) {

            const newArr = []

            // console.log("-->", cd);

            for (let i = 0; i < arr.length; i++) {
                // if (arr[i].age < 18) 
                // if (arr[i].age < 18) 
                // if (arr[i].age < 60)
                if (cd(arr[i])) {
                    newArr.push(arr[i])
                }
            }
            return newArr
        }

        function fn(a){
            // return a.age < 18
            return a.name === "孙悟空"
        }

        let result = filter(personArr, fn)
        console.log(result);
    </script>
```

#### 8.16 高阶函数

```javascript
    <script>
        /* 
            高阶函数：
                - 如果一个函数的参数或者返回值是一个函数，那么这个函数就称为高阶函数
                - 为什么要将函数作为参数传递(回调函数的作用)？
                    - 将函数作为参数，意味着可以对另一个函数可以动态的传递代码，从而实现代码的可复用
        */
        class Person {
            constructor(name, age) {
                this.name = name;
                this.age = age;
            }
        }

        const personArr = [
            new Person("孙悟空", 18),
            new Person("沙和尚", 38),
            new Person("猪八戒", 8),
            new Person("白骨精", 16),
        ]

        //filter函数用来过滤数组中的元素
        /* 
            目前我们的函数只能过滤age小于18的对象
                希望过滤更加灵活
                    比如：过滤数组中大于18的对象
                            age大于60的对象
                            age大于n的对象
                        过滤数组中的偶数
                        过滤数组中的奇数
                        ...

            一个函数的参数也可以是函数
                如果将函数作为参数，我们就称这个函数为回调函数(callback function)
        */
        function filter(arr, cd) {

            const newArr = []

            // console.log("-->", cd);

            for (let i = 0; i < arr.length; i++) {
                // if (arr[i].age < 18) 
                // if (arr[i].age < 18) 
                // if (arr[i].age < 60)
                if (cd(arr[i])) {
                    newArr.push(arr[i])
                }
            }
            return newArr
        }

        //我们这样定义回调函数的形式比较少见，通常回调函数都是匿名函数

        // function fn(a) {
        //     // return a.age < 18
        //     return a.name === "孙悟空"
        // }

        // let result = filter(personArr, a => a.name === "孙悟空")
        let result = filter(personArr, a => a.name === "孙悟空")

        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

        result = filter(arr, a => a % 2 === 0)

        console.log(result);
    </script>
```

#### 8.17 高阶函数2

```javascript
    <script>
        /* 
            希望在someFn()函数执行时，可以记录一条日志

            在不修改原函数的基础上，为其增加记录日志的功能，可以用高阶函数来实现。

            可以通过高阶函数来动态的生成一个新函数
        */
        function someFn() {
            return "hello"
        }

        function outer(cb) {
            return () => {
                console.log("记录日志~~");

                const result = cb()

                return result

            }
        }

        let result = outer(someFn)

        // console.log(result);

        function test(){
            console.log("test~~");
            return "test";
        }

        let newtest = outer(test);

        newtest();
    </script>
```

