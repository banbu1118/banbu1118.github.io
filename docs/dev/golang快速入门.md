# golang快速入门

视频资料：[https://www.bilibili.com/video/BV1Rm421N7Jy](https://www.bilibili.com/video/BV1Rm421N7Jy)

资料来源：[https://www.itying.com/goods-1156.html](https://www.itying.com/goods-1156.html)

## 一、安装

官网下载：[https://go.dev/dl/](https://go.dev/dl/)

windows 环境直接下载 msi包 安装即可，使用如下命令检查版本。

```cmd
go version
```

查看 go 环境

```cmd
go env
```

## 二、HelloWorld

Go 是**编译型语言**——你写的 .go 代码，需要通过 go 命令（比如 go build / go run ）编译成计算机能懂的可执行文件才能运行。

vscode 安装好 go 扩展，新建一个 demo.go 文件，内容如下

```go
package main

import (
	"fmt"
)

func main() {
	fmt.Println("hello world")
}
```

- 直接运行

```cmd
go run demo.go
```

- 编译后运行

```cmd
go build demo.go

#指定编译程序的名字
#go build -o kk.exe demo.g
```

会生成一个exe程序，命令行直接运行exe

```cmd
C:\Users\kk\Desktop\go-code>demo.exe
hello world 10
```

## 三、定义变量、fmt 包、Print、Println、Printf、Go 语言注释

### 定义变量

- var定义变量

```go
var 变量名 类型 = 表达式
```

```go
var name string = "zhangsan"
```

- 类型推导方式定义变量

a 在函数内部，可以使用更简略的 := 方式声明并初始化变量。

注意：短变量只能用于声明局部变量，不能用于全局变量的声明

```go
变量名 := 表达式
```

```go
n := 10
```

### fmt 包、Print、Println、Printf

Go 中要打印一个值需要引入 fmt 包

```go
import "fmt"
```

fmt 包里面给我们提供了一些常见的打印数据的方法，比如：Print 、Println、Printf，在我们实际开发中 Println、Printf 用的非常多。

- Print 和 Println 区别

一次输入多个值的时候 Println 中间有空格 Print 没有

```go
package main

import "fmt"

func main() {
	fmt.Println("go", "python", "php", "javascript")
	// go python php javascript
	fmt.Print("go", "python", "php", "javascript")
	// gopythonphpjavascript
}
```

Println 会自动换行，Print 不会

```go
package main

import "fmt"

func main() {
	fmt.Println("hello")
	fmt.Println("world")
	// hello
	// world
	fmt.Print("hello")
	fmt.Print("world")
	// helloworld
}
```

- Println 和 Printf 区别

Printf 是格式化输出

```go
package main

import "fmt"

func main() {
	a := 10
	b := 20
	c := 30
	fmt.Println("a=", a, ",b=", b, ",c=", c)
	//a= 10 ,b= 20 ,c= 30
	fmt.Printf("a=%d,b=%d,c=%d", a, b, c)
	//a=10,b=20,c=30
}
```

%d 是占位符，表示数字的十进制表示。Printf 中的占位符与后面的数字变量一一对应。

### 注释

win 下面 ctrl+/ 可以快速的注释一样，mac 下面 command+/ 也可以快速的注释一样

```go
/* 
多行注释
这是一个注释
*/

//这是一个注释
```

## 四、变量、常量、变量命名规则、代码风格

### 变量

Go 语言变量名由字母、数字、下划线组成，其中首个字符不能为数字。

Go 语言中关键字和保留字都不能用作变量名。

Go 语言中的变量需要声明后才能使用，同一作用域内不支持重复声明。

并且Go 语言的变量声明后必须使用。

- var 声明变量

```go
var 变量名称 type
```

```go
var name string
var age int
var isOk bool
```

```go
package main

import "fmt"

func main() {
	var username = "张三"
	var age int = 20
	fmt.Println(username, age)
}
```

- 一次定义多个变量

```go
var identifier1, identifier2 type
```

```go
package main

import "fmt"

func main() {
	var username, sex string
	username = "张三"
	sex = "男"
	fmt.Println(username, sex)

	// 申明变量的时候赋值
	var a, b, c, d = 1, 2, 3, false
	fmt.Println(a, b, c, d)
}
```

- 批量声明变量的时候指定类型

```go
var (
	a string
	b int
	c bool
)
a = "张三"
b = 10
c = true
fmt.Println(a, b, c)
```

批量声明变量并赋值

```go
var (
	a string = "张三"
	b int    = 20
	c bool   = true
)
fmt.Println(a, b, c)
```

- 变量的初始化

Go 语言在声明变量的时候，会自动对变量对应的内存区域进行初始化操作。

每个变量会被初始化成其类型的默认值，例如： 整型和浮点型变量的默认值为 0。

字符串变量的默认值为空字符串。 

布尔型变量默认为 false。 

切片、函数、指针变量的默认为nil。

当然我们也可在声明变量的时候为其指定初始值。变量初始化的标准格式如下：

```go
var 变量名 类型 = 表达式
```

举个例子：

```go
var name string = "zhangsan" 
var age int = 18
```

或者一次初始化多个变量并赋值

```go
var name, age = "zhangsan", 20
```

- 类型推导

有时候我们会将变量的类型省略，这个时候编译器会根据等号右边的值来推导变量的类型完成初始化。

```go
var name = "Q1mi" var age = 18
```

- 短变量声明法

在函数内部，可以使用更简略的 := 方式声明并初始化变量。

注意：短变量只能用于声明局部变量，不能用于全局变量的声明

```go
变量名 := 表达式
```

```go
package main

import (
	"fmt"
)

// 全局变量 m
var m = 100

func main() {
	n := 10
	m := 200 // 此处声明局部变量 m
	fmt.Println(m, n)
}
```

使用变量一次声明多个变量，并初始化变量

```go
m1, m2, m3 := 10, 20, 30
fmt.Println(m1, m2, m3)
```

- 匿名变量

在使用多重赋值时，如果想要忽略某个值，可以使用匿名变量（anonymous variable）。匿名变量用一个下划线_表示，例如：

```go
package main

import (
	"fmt"
)

func getInfo() (int, string) {
	return 10, "张三"
}

func main() {
	_, username := getInfo()
	fmt.Println(username)
}
```

匿名变量不占用命名空间，不会分配内存，所以匿名变量之间不存在重复声明。

注意事项：

1. 函数外的每个语句都必须以关键字开始（var、const、func 等）
2. :=不能使用在函数外。
3. _多用于占位，表示忽略值。

### 常量

相对于变量，常量是恒定不变的值，多用于定义程序运行期间不会改变的那些值。常量的声明和变量声明非常类似，只是把 var 换成了 const，常量在定义的时候必须赋值。

- 使用 const 定义常量

```go
const pi = 3.1415
const e = 2.7182
```

声明了 pi 和 e 这两个常量之后，在整个程序运行期间它们的值都不能再发生变化了。

多个常量也可以一起声明：

```go
const (
pi = 3.1415
e = 2.7182
)
```

const 同时声明多个常量时，如果省略了值则表示和上面一行的值相同。例如：

```go
const (
n1 = 100
n2
n3
)
```

上面示例中，常量 n1、n2、n3 的值都是 100。

打印 Pi 的值

```go
package main

import (
	"fmt"
	"math"
)

func main() {
	const pi = math.Pi
	fmt.Println(pi)
}

```

- const 常量结合 iota 的使用（了解）

iota 是 golang 语言的常量计数器,只能在常量的表达式中使用。 

iota 在 const 关键字出现时将被重置为 0(const 内部的第一行之前)，const 中每新增一行常量声明将使 iota 计数一次(iota 可理解为 const 语句块中的行索引)。

iota 只能在常量的表达式中使用。

```go
fmt.Println(iota)
编译错误： undefined: iota
```

每次 const 出现时，都会让 iota 初始化为 0.【自增长】

```go
const a = iota // a=0
const (
b = iota //b=0
c //c=1
)
```

const iota 使用_跳过某些值

```go
const (
n1 = iota //0
n2 //1
_
n4 //3
)
```

iota 声明中间插队

```go
const (
n1 = iota //0
n2 = 100 //100
n3 = iota //2
n4 //3
)
const n5 = iota //0
```

多个 iota 定义在一行

```go
const (
a, b = iota + 1, iota + 2 //1,2
c, d //2,3
e, f //3,4
)
```

### Go 语言变量、常量命名规则

1. 变量名称必须由数字、字母、下划线组成。
2. 标识符开头不能是数字。
3. 标识符不能是保留字和关键字。
4. 变量的名字是区分大小写的如: age 和 Age 是不同的变量。在实际的运用中,也建议,不要用一个单词大小写区分两个变量。
5. 标识符(变量名称)一定要见名思意 ：变量名称建议用名词，方法名称建议用动词。
6. 变量命名一般采用驼峰式，当遇到特有名词（缩写或简称，如 DNS）的时候，特有名词根据是否私有全部大写或小写。

### Go 语言代码风格

1. 代码每一行结束后不用写分号 ;
2. 运算符左右建议各加一个空格。

```go
var username string = "itying"
```

3. Go 语言程序员推荐使用驼峰式命名
   当名字有几个单词组成的时优先使用大小写分隔。

4. 强制的代码风格。

   左括号必须紧接着语句不换行，这个特性刚开始会使开发者不习惯，但随着对Go 语言的不断熟悉，就会发现风格统一让大家在阅读代码时把注意力集中到了解决问题上，而不是代码风格上。

5. go fmt 主要用于格式化文档，让所有人的代码风格保持一致

```cmd
D:\golang\src\demo01>go fmt main.go
main.go
```

## 五、基本数据类型

Go 语言中数据类型分为：基本数据类型和复合数据类型

基本数据类型有：整型、浮点型、布尔型、字符串

复合数据类型有：数组、切片、结构体、函数、map、通道（channel）、接口等。

### 整型

整型分为以下两个大类： 
有符号整形按长度分为：int8、int16、int32、int64 
对应的无符号整型：uint8、uint16、uint32、uint64

| 类型   | 范围 (十进制 / 2^n)                                          | 占用空间 | 有无符号 |
| ------ | ------------------------------------------------------------ | -------- | -------- |
| int8   | -128 到 127 / -2^7 到 2^7-1                                  | 1 个字节 | 有       |
| int16  | -32768 到 32767 / -2^15 到 2^15-1                            | 2 个字节 | 有       |
| int32  | -2147483648 到 2147483647 / -2^31 到 2^31-1                  | 4 个字节 | 有       |
| int64  | -9223372036854775808 到 9223372036854775807 / -2^63 到 2^63-1 | 8 个字节 | 有       |
| uint8  | 0 到 255 / 0 到 2^8-1                                        | 1 个字节 | 无       |
| uint16 | 0 到 65535 / 0 到 2^16-1                                     | 2 个字节 | 无       |
| uint32 | 0 到 4294967295 / 0 到 2^32-1                                | 4 个字节 | 无       |
| uint64 | 0 到 18446744073709551615 / 0 到 2^64-1                      | 8 个字节 | 无       |

关于字节： 

字节也叫 Byte，是计算机数据的基本存储单位。8bit(位)=1Byte(字节) 1024Byte(字节)=1KB1024KB=1MB 1024MB=1GB 1024GB=1TB 。在电脑里一个中文字是占两个字节的。

#### 特殊整型

| 类型    | 描述                                                   |
| ------- | ------------------------------------------------------ |
| uint    | 32 位操作系统上就是 uint32，64 位操作系统上就是 uint64 |
| int     | 32 位操作系统上就是 int32，64 位操作系统上就是 int64   |
| uintptr | 无符号整型，用于存放一个指针                           |

注意： 在使用 int 和 uint 类型时，不能假定它是 32 位或 64 位的整型，而是考虑int 和uint 可能在不同平台上的差异。

注意事项：实际项目中整数类型、切片、 map 的元素数量等都可以用int 来表示。在涉及到二进制传输、为了保持文件的结构不会受到不同编译目标平台字节长度的影响，不要使用 int 和 uint。

```go
package main

import "fmt"

func main() {
	var num int64
	num = 123
	fmt.Printf("值:%v 类型%T", num, num)
}
```

#### unsafe.Sizeof

unsafe.Sizeof(n1) 是 unsafe 包的一个函数，可以返回 n1 变量占用的字节数

```go
package main

import (
	"fmt"
	"unsafe"
)

func main() {
	var a int8 = 120
	fmt.Printf("%T\n", a)
	fmt.Println(unsafe.Sizeof(a))
}
```

#### int 不同长度直接的转换

```go
package main

import (
	"fmt"
)

func main() {
	var num1 int8
	num1 = 127
	num2 := int32(num1)
	fmt.Printf("值:%v 类型%T", num2, num2) //值:127 类型 int32
}
```

#### 数字字面量语法（Number literals syntax）（了解）

Go1.13 版本之后引入了数字字面量语法，这样便于开发者以二进制、八进制或十六进制浮点数的格式定义数字，例如：

 v := 0b00101101， 代表二进制的 101101，相当于十进制的 45。 v := 0o377，代表八进制的377，相当于十进制的 255。 v := 0x1p-2，代表十六进制的 1 除以2²，也就是0.25。

而且还允许我们用 _ 来分隔数字，比如说：

v := 123_456 等于 123456。

我们可以借助 fmt 函数来将一个整数以不同进制形式展示。

```go
package main

import "fmt"

func main() {
	// 十进制
	var a int
	a = 10
	fmt.Printf("%d \n", a) // 10
	fmt.Printf("%b \n", a) // 1010 占位符%b 表示二进制
	// 八进制 以 0 开头
	var b int
	b = 077
	fmt.Printf("%o \n", b) // 77
	// 十六进制 以 0x 开头
	var c int
	c = 0xff
	fmt.Printf("%x \n", c) // ff
	fmt.Printf("%X \n", c) // FF
	fmt.Printf("%d \n", c) // 255
}
```

### 浮点型

Go 语言支持两种浮点型数：float32 和 float64。

这两种浮点型数据格式遵循IEEE 754 标准：

float32 的浮点数的最大范围约为 3.4e38，可以使用常量定义：math.MaxFloat32。

float64 的浮点数的最大范围约为 1.8e308，可以使用一个常量定义：math.MaxFloat64。

打印浮点数时，可以使用 fmt 包配合动词%f，代码如下：

```go
package main

import (
	"fmt"
	"math"
)

func main() {
	fmt.Printf("%f\n", math.Pi)   //默认保留 6 位小数
	fmt.Printf("%.2f\n", math.Pi) //保留 2 位小数
}
```

- Go 语言中浮点数默认是 float64

```go
package main

import (
	"fmt"
)

func main() {
	num := 1.1
	fmt.Printf("值：%v--类型:%T", num, num)
	//值：1.1--类型:float64
}
```

- Golang 中 float 精度丢失问题

几乎所有的编程语言都有精度丢失这个问题，这是典型的二进制浮点数精度损失问题，在定长条件下，二进制小数和十进制小数互转可能有精度丢失。

```go
d := 1129.6
fmt.Println((d * 100)) 
//输出：112959.99999999999
```

```go
var d float64 = 1129.6
fmt.Println((d * 100)) 
//输出：112959.99999999999
```

```go
m1 := 8.2
m2 := 3.8
fmt.Println(m1 - m2) 
// 期望是 4.4，结果打印出了 4.399999999999999
```

- Golang 科学计数法表示浮点类型

```go
num8 := 5.1234e2 // ? 5.1234 * 10 的 2 次方
num9 := 5.1234E2 // ? 5.1234 * 10 的 2 次方 shift+alt+向下的箭头num10 := 5.1234E-2 // ? 5.1234 / 10 的 2 次方 0.051234
fmt.Println("num8=", num8, "num9=", num9, "num10=", num10)
```

### 布尔值

Go 语言中以 bool 类型进行声明布尔型数据，布尔型数据只有 true（真）和false（假）两个值。

注意：

1. 布尔类型变量的默认值为 false。
2. Go 语言中不允许将整型强制转换为布尔型.
3. 布尔型无法参与数值运算，也无法与其他类型进行转换。

```go
package main

import (
	"fmt"
	"unsafe"
)

func main() {
	var b = true
	fmt.Println(b, "占用字节：", unsafe.Sizeof(b))
}

```

### 字符串

Go 语言中的字符串以原生数据类型出现，使用字符串就像使用其他原生数据类型（int、bool、float32、float64 等）一样。 Go 语言里的字符串的内部实现使用 UTF-8 编码。字符串的值为双引号(")中的内容，可以在 Go 语言的源码中直接添加非 ASCII 码字符，例如：

```go
s1 := "hello"
s2 := "你好"
```

- 字符串转义符

Go 语言的字符串常见转义符包含回车、换行、单双引号、制表符等，如下表所示。

| 转义符 | 含义                               |
| ------ | ---------------------------------- |
| \r     | 回车符（返回行首）                 |
| \n     | 换行符（直接跳到下一行的同列位置） |
| \t     | 制表符                             |
| \\'    | 单引号                             |
| \\"    | 双引号                             |
| \\\    | 反斜杠                             |

举个例子，我们要打印一个 Windows 平台下的一个文件路径：

```go
package main
import ( "fmt"
)
func main() {
fmt.Println("str := \"c:\\Code\\demo\\go.exe\"")
}
```

- 多行字符串

```go
Go 语言中要定义一个多行字符串时，就必须使用反引号字符：
s1 := `第一行
第二行
第三行
`fmt.Println(s1)
反引号间换行将被作为字符串中的换行，但是所有的转义字符均无效，文本将会原样输出
```

- 字符串的常用操作

| 方法                                 | 介绍           |
| ------------------------------------ | -------------- |
| len(str)                             | 求长度         |
| + 或 fmt.Sprintf                     | 拼接字符串     |
| strings.Split                        | 分割           |
| strings.contains                     | 判断是否包含   |
| strings.HasPrefix, strings.HasSuffix | 前缀/后缀判断  |
| strings.Index(), strings.LastIndex() | 子串出现的位置 |
| strings.Join(a[]string, sep string)  | join 操作      |

len(str)求字符串的长度

```go
var str = "this is str"
fmt.Println(len(str))
```

拼接字符串

```go
var str1 = "你好" 
var str2 = "golang"
fmt.Println(str1 + str2)
var str3 = fmt.Sprintf("%v %v", str1, str2)
fmt.Println(str3)
```

strings.Split 分割字符串

```go
var str = "123-456-789"
var arr = strings.Split(str, "-")
fmt.Println(arr)
```

判断是包含字符串

```go
var str = "this is golang"
var flag = strings.Contains(str, "golang")
fmt.Println(flag)
```

判断首字符尾字母是否包含指定字符

```go
var str = "this is golang" 
var flag = strings.HasPrefix(str, "this")
fmt.Println(flag)

var str = "this is golang" 
var flag = strings.HasSuffix(str, "go")
fmt.Println(flag)
```

判断字符串出现的位置

判断位置参考的是字符所占的字节位置，中文是每个字符3个字节

```go
var str = "this is golang" 
var index = strings.Index(str, "is") //从前往后
fmt.Println(index)

var str = "this is golang" 
var index = strings.LastIndex(str, "is") //从后网前
fmt.Println(index)
```

Join 拼接字符串

```go
var str = "123-456-789" 
var arr = strings.Split(str, "-")
var str2 = strings.Join(arr, "*")
fmt.Println(str2)
```

### byte 和 rune 类型

组成每个字符串的元素叫做“字符”，可以通过遍历字符串元素获得字符。字符用单引号（’）包裹起来，如：

```go
package main

import "fmt"

func main() {
	a := 'a'
	b := '0'
	//当我们直接输出 byte（字符）的时候输出的是这个字符对应的码值
	fmt.Println(a)
	fmt.Println(b)

	//如果我们要输出这个字符，需要格式化输出
	fmt.Printf("%c--%c", a, b) //%c 相应 Unicode 码点所表示的字符
}
```

字节（byte）：是计算机中 数据处理 的基本单位，习惯上用大写 B 来表示,1B（byte,字节）= 8bit（位） 

字符：是指计算机中使用的字母、数字、字和符号

一个汉子占用 3 个字节 一个字母占用一个字节

```go
package main

import "fmt"

func main() {
	a := "m"
	fmt.Println(len(a)) //1
	b := "张"
	fmt.Println(len(b)) //3
}
```

- Go 语言的字符有以下两种

1. uint8 类型，或者叫 byte 型，代表了 ASCII 码的一个字符。
2. rune 类型，代表一个 UTF-8 字符。

当需要处理中文、日文或者其他复合字符时，则需要用到 rune 类型。rune 类型实际是一个int32。

Go 使用了特殊的 rune 类型来处理 Unicode，让基于 Unicode 的文本处理更为方便，也可以使用 byte 型进行默认字符串处理，性能和扩展性都有照顾。

```go
// 遍历字符串
package main

import "fmt"

func main() {
	s := "hello 张三"
	for i := 0; i < len(s); i++ { //byte
		fmt.Printf("%v(%c) ", s[i], s[i])
	}
	fmt.Println()
	for _, r := range s { //rune
		fmt.Printf("%v(%c) ", r, r)
	}
	fmt.Println()
}
```

输出： 

```cmd
104(h) 101(e) 108(l) 108(l) 111(o) 32( ) 229(å) 188(¼) 160( ) 228(ä) 184(¸) 137() 
104(h) 101(e) 108(l) 108(l) 111(o) 32( ) 24352(张) 19977(三) 
```

因为 UTF8 编码下一个中文汉字由 3 个字节组成，所以我们不能简单的按照字节去遍历一个包含中文的字符串，否则就会出现上面输出中第一行的结果。

字符串底层是一个 byte 数组，所以可以和[]byte 类型相互转换。字符串是不能修改的字符串是由 byte 字节组成，所以字符串的长度是 byte 字节的长度。 rune 类型用来表示utf8 字符，一个 rune 字符由一个或多个 byte 组成。

rune 类型实际是一个 int32

```go
// 遍历字符串
package main

import "fmt"

func main() {
	c3 := "营"
	c4 := '营'
	fmt.Printf("C3 的类型%T--C4 的类型%T", c3, c4) //C3 的类型 string--C4 的类型int32
}
```

- 修改字符串

要修改字符串，需要先将其转换成[]rune 或[]byte，完成后再转换为string。无论哪种转换，都会重新分配内存，并复制字节数组。

```go
// 遍历字符串
package main

import "fmt"

func main() {
	changeString()
}

func changeString() {
	s1 := "big"
	// 强制类型转换
	byteS1 := []byte(s1)
	byteS1[0] = 'p'
	fmt.Println(string(byteS1))
	s2 := "白萝卜"
	runeS2 := []rune(s2)
	runeS2[0] = '红'
	fmt.Println(string(runeS2))
}
```

## 六、基本数据类型之间的转换

Go 语言中只有强制类型转换，没有隐式类型转换。

### 数值类型之间的相互转换

数值类型包括：整形和浮点型

```go
package main

import "fmt"

func main() {
	var a int8 = 20
	var b int16 = 40
	var c = int16(a) + b           //要转换成相同类型才能运行
	fmt.Printf("值：%v--类型%T", c, c) //值：60--类型 int16
}
```

```go
package main

import "fmt"

func main() {
	var a float32 = 3.2
	var b int16 = 6
	var c = a + float32(b)
	fmt.Printf("值：%v--类型%T", c, c) //值：9.2--类型 float32
}
```

转换的时候建议从低位转换成高位，高位转换成低位的时候如果转换不成功就会溢出，和我们想的结果不一样。

```go
package main

func main() {
	var a int16 = 129
	var b = int8(a)  // 范围 -128 到 127
	println("b=", b) //b= -127 //错误
}
```

比如计算直角三角形的斜边长时使用 math 包的 Sqrt()函数，该函数接收的是float64 类型的参数，而变量 a 和 b 都是 int 类型的，这个时候就需要将 a 和 b 强制类型转换为float64 类型。

```go
package main

import (
	"fmt"
	"math"
)

func main() {
	var a, b = 3, 4
	var c int
	// math.Sqrt()接收的参数是 float64 类型，需要强制转换
	c = int(math.Sqrt(float64(a*a + b*b)))
	fmt.Println(c)
}
```

### 其他类型转换成 String 类型

- sprintf 把其他类型转换成 string 类型

注意：sprintf 使用中需要注意转换的格式 int 为%d float 为%f bool 为%t byte 为%c

```go
package main

import "fmt"

func main() {
	var i int = 20
	var f float64 = 12.456
	var t bool = true
	var b byte = 'a'
	var strs string
	strs = fmt.Sprintf("%d", i)
	fmt.Printf("str type %T ,strs=%v \n", strs, strs)
	strs = fmt.Sprintf("%f", f)
	fmt.Printf("str type %T ,strs=%v \n", strs, strs)
	strs = fmt.Sprintf("%t", t)
	fmt.Printf("str type %T ,strs=%v \n", strs, strs)
	strs = fmt.Sprintf("%c", b)
	fmt.Printf("str type %T ,strs=%v \n", strs, strs)
}
```

输出

```cmd
str type string ,strs=20 
str type string ,strs=12.456000 
str type string ,strs=true 
str type string ,strs=a
```

- 使用 strconv 包里面的几种转换方法进行转换

```go
package main

import (
	"fmt"
	"strconv"
)

func main() {
	//1、int 转换成 string
	var num1 int = 20
	s1 := strconv.Itoa(num1)
	fmt.Printf("str type %T ,strs=%v \n", s1, s1)
	// 2、float 转 string
	var num2 float64 = 20.113123
	/* 参数 1：要转换的值
	   参数 2：格式化类型
	   'f'（-ddd.dddd）、
	   'b'（-ddddp±ddd，指数为二进制）、
	   'e'（-d.dddde±dd，十进制指数）、
	   'E'（-d.ddddE±dd，十进制指数）、
	   'g'（指数很大时用'e'格式，否则'f'格式）、
	   'G'（指数很大时用'E'格式，否则'f'格式）。
	   参数 3: 保留的小数点 -1（不对小数点格式化）
	   参数 4：格式化的类型
	*/
	s2 := strconv.FormatFloat(num2, 'f', 2, 64)
	fmt.Printf("str type %T ,strs=%v \n", s2, s2)
	// 3、bool 转 string
	s3 := strconv.FormatBool(true)
	fmt.Printf("str type %T ,strs=%v \n", s3, s3)
	//4、int64 转 string
	var num3 int64 = 20
	/*第二个参数为 进制
	 */
	s4 := strconv.FormatInt(num3, 10)
	fmt.Printf("类型 %T ,strs=%v \n", s4, s4)
}
```

### String 类型转换成数值类型

- string 类型转换成 int 类型

```go
package main

import (
	"fmt"
	"strconv"
)

func main() {
	var s = "1234"
	i64, _ := strconv.ParseInt(s, 10, 64)
	fmt.Printf("值：%v 类型：%T", i64, i64)
}
```

- string 类型转换成 float 类型

```go
package main

import (
	"fmt"
	"strconv"
)

func main() {
	str := "3.1415926535"
	v1, _ := strconv.ParseFloat(str, 32)
	v2, _ := strconv.ParseFloat(str, 64)
	fmt.Printf("值：%v 类型：%T\n", v1, v1)
	fmt.Printf("值：%v 类型：%T", v2, v2)
}
```

- string 类型转换成 bool 类型（意义不大）

```go
package main

import (
	"fmt"
	"strconv"
)

func main() {
	b, _ := strconv.ParseBool("true") // string 转 bool
	fmt.Printf("值：%v 类型：%T", b, b)
}
```

- string 转字符

```go
package main

import (
	"fmt"
)

func main() {
	s := "hello 张三"
	for _, r := range s { //rune
		fmt.Printf("%v(%c) ", r, r)
	}
	fmt.Println()
}
```

### 数值类型没法和 bool 类型进行转换

注意：在 go 语言中数值类型没法直接转换成 bool 类型 bool 类型也没法直接转换成数值类型

## 七、运算符

### Golang 内置的运算符

1. 算术运算符 
2. 关系运算符 
3. 逻辑运算符 
4. 位运算符 
5. 赋值运算 

### 算数运算符

| 运算符 | 描述                                   |
| ------ | -------------------------------------- |
| +      | 相加                                   |
| -      | 相减                                   |
| *      | 相乘                                   |
| /      | 相除                                   |
| %      | 求余 = 被除数 - (被除数 / 除数) * 除数 |

注意： ++（自增）和--（自减）在 Go 语言中是单独的语句，并不是运算符。

```go
package main

import (
	"fmt"
)

func main() {
	fmt.Println("10+3=", 10+3) // =13
	fmt.Println("10-3=", 10-3) // =7
	fmt.Println("10*3=", 10*3) // =30
	//除法注意：如果运算的数都是整数，那么除后，去掉小数部分，保留整数部分fmt.Println("10/3=", 10/3) //3
	fmt.Println("10.0/3=", 10.0/3) //3.3333333333333335
	// 取余注意 余数=被除数-（被除数/除数）*除数
	fmt.Println("10%3=", 10%3)     // =1
	fmt.Println("-10%3=", -10%3)   // -1
	fmt.Println("10%-3=", 10%-3)   // =1
	fmt.Println("-10%-3=", -10%-3) // =-1
}
```

注意：在 golang 中，++ 和 -- 只能独立使用 错误写法如下：

```go
var i int = 8
var a int
a = i++ //错误，i++只能独立使用
a = i-- //错误, i--只能独立使用
```

注意：在 golang 中没有前++ 错误写法如下：

```go
var i int = 1
++i // 错误，在 golang 没有 前++
--i // 错误，在 golang 没有 前--
fmt.Println("i=", i)
```

++ --正确写法：

```go
var i int = 1
i++
fmt.Println("i=", i)
```

### 关系运算符

| 运算符 | 描述                                                         |
| :----- | :----------------------------------------------------------- |
| ==     | 检查两个值是否相等，如果相等返回 True 否则返回 False。       |
| !=     | 检查两个值是否不相等，如果不相等返回 True 否则返回 False。   |
| >      | 检查左边值是否大于右边值，如果是返回 True 否则返回 False。   |
| >=     | 检查左边值是否大于等于右边值，如果是返回 True 否则返回 False。 |
| &lt;   | 检查左边值是否小于右边值，如果是返回 True 否则返回 False。   |
| &lt;=  | 检查左边值是否小于等于右边值，如果是返回 True 否则返回 False。 |

```go
package main

import (
	"fmt"
)

func main() {
	//演示关系运算符的使用
	var n1 int = 9
	var n2 int = 8
	fmt.Println(n1 == n2) //false
	fmt.Println(n1 != n2) //true
	fmt.Println(n1 > n2)  //true
	fmt.Println(n1 >= n2) //true
	fmt.Println(n1 < n2)  //flase
	fmt.Println(n1 <= n2) //flase
	flag := n1 > n2
	fmt.Println("flag=", flag)
}
```

### 逻辑运算符

| 运算符 | 描述                                                         |
| ------ | ------------------------------------------------------------ |
| &&     | 逻辑 AND 运算符。如果两边的操作数都是 True，则为 True，否则为 False。 |
| \|\|   | 逻辑 OR 运算符。如果两边的操作数有一个 True，则为 True，否则为 False。 |
| !      | 逻辑 NOT 运算符。如果条件为 True，则为 False，否则为 True。  |

```go
package main

import (
	"fmt"
)

func main() {
	//演示逻辑运算符的使用 &&
	var age int = 40
	if age > 30 && age < 50 {
		fmt.Println("ok1")
	}
	if age > 30 && age < 40 {
		fmt.Println("ok2")
	}
	//演示逻辑运算符的使用 ||
	if age > 30 || age < 50 {
		fmt.Println("ok3")
	}
	if age > 30 || age < 40 {
		fmt.Println("ok4")
	}
	//演示逻辑运算符的使用 !
	if age > 30 {
		fmt.Println("ok5")
	}
	if !(age > 30) {
		fmt.Println("ok6")
	}
}
```

逻辑运算符短路演示

```go
package main

import (
	"fmt"
)

func test() bool {
	fmt.Println("test...")
	return true
}
func main() {
	var i int = 10
	if i < 9 && test() {
		fmt.Println("ok...")
	}
	if i > 9 || test() {
		fmt.Println("hello...")
	}
}
```

### 赋值运算符

| 运算符 | 描述                                           |
| ------ | ---------------------------------------------- |
| =      | 简单的赋值运算符，将一个表达式的值赋给一个左值 |
| +=     | 相加后再赋值                                   |
| -=     | 相减后再赋值                                   |
| *=     | 相乘后再赋值                                   |
| /=     | 相除后再赋值                                   |
| %=     | 求余后再赋值                                   |

```go
package main

import "fmt"

func main() {
	d := 8 + 2*8 // 赋值运算从右向左
	fmt.Println(d)
	x := 10
	x += 5 //x=x+5
	fmt.Println("x += 5 的值:", x)
}
```

```go
x := 10
x -= 5 //x=x-5
fmt.Println("x -= 5 的值:", x)
x := 10
x *= 5 //x=x*5
fmt.Println("x *= 5 的值:", x)
x := 10.0
x /= 5
fmt.Println("x /= 5 的值:", x)
x := 10
x %= 3
fmt.Println("x %= 3 的值:", x)
```

### 运算符练习

练习 1：有两个变量，a 和 b，要求将其进行交换，最终打印结果

```go
package main

import "fmt"

func main() {
	a := 9
	b := 2
	t := a
	a = b //
	b = t //
	fmt.Printf("交换后的情况是 a = %v , b=%v \n", a, b)
}
```

练习 2：假如还有 100 天放假，问：xx 个星期零 xx 天

```go
package main

import "fmt"

func main() {
	var days int = 100
	var week int = days / 7
	var day int = days % 7
	fmt.Printf("%d 个星期零%d 天\n", week, day)
}
```

练习 3：定义一个变量保存华氏温度，华氏温度转换摄氏温度的公式为：5/9*(华氏温度-100), 请求出华氏温度对应的摄氏温度

```go
package main

import "fmt"

func main() {
	var huashi float32 = 134.2
	var sheshi float32 = 5.0 / 9 * (huashi - 100)
	fmt.Printf("%v 对应的摄氏温度=%v \n", huashi, sheshi)
}
```

### 位运算符(了解)

位运算符对整数在内存中的二进制位进行操作。

| 运算符 | 描述                                                         |
| ------ | ------------------------------------------------------------ |
| &      | 参与运算的两数各对应的二进位相与。（两位均为1才为1）         |
| \|     | 参与运算的两数各对应的二进位相或。（两位有一个为1就为1）     |
| ^      | 参与运算的两数各对应的二进位相异或，当两对应的二进位相异时，结果为1。（两位不一样则为1） |
| &lt;&lt; | 左移n位就是乘以2的n次方。`a<<b`是把a的各二进位全部左移b位，高位丢弃，低位补0。 |
| &gt;&gt; | 右移n位就是除以2的n次方。`a>>b`是把a的各二进位全部右移b位。  |

```go
package main

import "fmt"

func main() {
	/* & 两位均为 1 才为 1
	   | 两位有一个为 1 就为 1
	   ^ 相异或 两位不一样则为 1
	   << 左移 n 位就是乘以 2 的 n 次方。 “a<<b”是把 a 的各二进位全部左移b 位，高位丢弃，低位补 0。
	   >> 右移 n 位就是除以 2 的 n 次方。
	*/
	var a int = 5              // 101
	var b int = 2              // 010
	fmt.Println("a&b=", a&b)   // 000 值 0
	fmt.Println("a|b=", a|b)   // 111 值 7
	fmt.Println("a^b=", a^b)   // 111 值 7
	fmt.Println("5>>2=", a>>b) // 5 右移 2 位 1
	fmt.Println("5<<2=", a<<b) // 5 左移 2 位 10100
	fmt.Println("5<<1=", 5<<1) // 1010
	fmt.Println("5>>1=", 5>>1) // 10
	fmt.Println("7>>2=", 7>>2) // 1
}
```

## 八、流程控制

流程控制是每种编程语言控制逻辑走向和执行次序的重要部分，流程控制可以说是一门语言的“经脉”。

Go 语言中最常用的流程控制有 if 和 for，而 switch 和 goto 主要是为了简化代码、降低重复代码而生的结构，属于扩展类的流程控制。

### if 判断

- if 条件判断基本写法

Go 语言中 if 条件判断的格式如下：

```go
if 表达式 1 {
分支 1
} else if 表达式 2 {
分支 2
} else{
分支 3
}
```

当表达式 1 的结果为 true 时，执行分支 1，否则判断表达式 2，如果满足则执行分支2，都不满足时，则执行分支 3。 if 判断中的 else if 和 else 都是可选的，可以根据实际需要进行选择。

注意：Go 语言规定与 if 匹配的左括号 &#123; 必须与 if 和表达式放在同一行，&#123; 放在其他位置会触发编译错误。 同理，与 else 匹配的 &#123; 也必须与 else 写在同一行，else 也必须与上一个if 或else if 右边的大括号在同一行。

举个例子：

```go
func ifDemo1() {
	score := 65
	if score >= 90 {
		fmt.Println("A")
	} else if score > 75 {
		fmt.Println("B")
	} else {
		fmt.Println("C")
	}
}
```

- if 条件判断特殊写法

if 条件判断还有一种特殊的写法，可以在 if 表达式之前添加一个执行语句，再根据变量值进行判断，举个例子：

```go
package main

import "fmt"

func main() {
	if score := 56; score >= 90 {
		fmt.Println("A")
	} else if score > 75 {
		fmt.Println("B")
	} else {
		fmt.Println("C")
	}
}
```

思考题： 上下两种写法的区别在哪里？

```go
package main

import "fmt"

func main() {
	//这里的 score 是局部作用域
	if score := 56; score >= 90 {
		fmt.Println("A")
	} else if score > 75 {
		fmt.Println("B")
	} else {
		fmt.Println("C")
	}
	// fmt.Println(score) //undefined: score
}
```

练习：求两个数的最大值 (注意 go 语言中没有三目运算)

```go
package main

import "fmt"

func main() {
	var n1 int = 20
	var n2 int = 55
	var max int
	if n1 > n2 {
		max = n1
	} else {
		max = n2
	}
	fmt.Println("max=", max)
}
```

### for 循环

Go 语言中的所有循环类型均可以使用 for 关键字来完成。

for 循环的基本格式如下： 

```go
for 初始语句;条件表达式;结束语句{ 

循环体语句 

} 
```

条件表达式返回 true 时循环体不停地进行循环，直到条件表达式返回false 时自动退出循环。

```go
for i := 0; i < 10; i++ {
fmt.Println(i)
}
```

for 循环的初始语句可以被忽略，但是初始语句后的分号必须要写，例如：

```go
i := 0
for ; i < 10; i++ {
fmt.Println(i)
}
```

for 循环的初始语句和结束语句都可以省略，例如：

```go
i := 0
for i < 10 {
fmt.Println(i)
i++
}
```

这种写法类似于其他编程语言中的 while，在 while 后添加一个条件表达式，满足条件表达式时持续循环，否则结束循环。 

注意：Go 语言中是没有 while 语句的，我们可以通过 for 代替

- for 死循环

```go
for {
循环体语句
}
```

for 循环可以通过 break、goto、return、panic 语句强制退出循环。

```go
package main

import "fmt"

func main() {
	k := 1
	for { // 这里也等价 for ; ; {
		if k <= 10 {
			fmt.Println("ok~~", k)
		} else {
			break //break 就是跳出这个 for 循环
		}
		k++
	}
}
```

练习：打印 0-50 所有的偶数

```go
package main

import "fmt"

func main() {
	for i := 0; i < 50; i++ {
		if i%2 == 0 {
			fmt.Println(i)
		}
	}
}
```

练习：打印 1~100 之间所有是 9 的倍数的整数的个数及总和

```go
package main

import "fmt"

func main() {
	count := 0
	sum := 0
	for i := 1; i < 100; i++ {
		if i%9 == 0 {
			sum += i
			count++
		}
	}
	fmt.Println("count=", count)
	fmt.Println("sum=", sum)
}
```

练习：求 1+2+3+4 +...100 的和

```go
package main

import "fmt"

func main() {
	sum := 0
	for i := 0; i <= 100; i++ {
		sum += i
	}
	fmt.Println("sum=", sum)
}
```

练习：计算 5 的阶乘 (12345 n 的阶乘 12……n)

```go
package main

import "fmt"

func main() {
	var n = 5
	sum := 1
	for i := 1; i <= n; i++ {
		sum *= i
	}
	fmt.Println("sum=", sum)
}
```

练习： 打印一个矩形

```go
package main

import "fmt"

func main() {
	for i := 1; i <= 12; i++ {
		fmt.Print("*")
		if i%4 == 0 {
			fmt.Println()
		}
	}
}
```

嵌套循环解决这个问题

```go
package main

import "fmt"

func main() {
	line := 4
	num := 8
	for i := 1; i <= line; i++ {
		for j := 0; j < num; j++ {
			fmt.Print("*")
		}
		fmt.Println()
	}
}
```

练习： 打印一个三角形

```go
package main

import "fmt"

func main() {
	line := 5
	for i := 1; i <= line; i++ {
		for j := 0; j < i; j++ {
			fmt.Print("*")
		}
		fmt.Println()
	}
}
```

练习：打印出九九乘法表

```go
package main

import "fmt"

func main() {
	for i := 1; i <= 9; i++ {
		for j := 1; j <= i; j++ {
			fmt.Printf("%vx%v=%v \t", i, j, i*j)
		}
		fmt.Println()
	}
}
```

### for range（键值循环）

Go 语言中可以使用 for range 遍历数组、切片、字符串、map 及通道（channel）。通过for range 遍历的返回值有以下规律：

1. 数组、切片、字符串返回索引和值。
2. map 返回键和值。
3. 通道（channel）只返回通道内的值。

```go
package main

import "fmt"

func main() {
	// str := "abc 上海"
	// for index, val := range str {
	// 	fmt.Printf("index=%d, val=%c \n", index, val)
	// }
	str := "abc 上海"
	for _, val := range str {
		fmt.Printf("val=%c \n", val)
	}
}
```

### switch case

使用 switch 语句可方便地对大量的值进行条件判断。

练习：判断文件类型,如果后缀名是.html 输入 text/html, 如果后缀名.css 输出text/css ,如果后缀名是.js 输出 text/javascript

Go 语言规定每个 switch 只能有一个 default 分支。

```go
package main

import "fmt"

func main() {
	extname := ".a"
	switch extname {
	case ".html":
		fmt.Println("text/html")
		break
	case ".css":
		fmt.Println("text/css")
		break
	case ".js":
		fmt.Println("text/javascript")
		break
	default:
		fmt.Println("格式错误")
		break
	}
}
```

Go 语言中每个 case 语句中可以不写 break，不加 break 也不会出现穿透的现象如下例子：

```go
package main

import "fmt"

func main() {
	extname := ".a"
	switch extname {
	case ".html":
		fmt.Println("text/html")
	case ".css":
		fmt.Println("text/css")
	case ".js":
		fmt.Println("text/javascript")
	default:
		fmt.Println("格式错误")
	}
}
```

一个分支可以有多个值，多个 case 值中间使用英文逗号分隔。

```go
package main

import "fmt"

func main() {
	n := 2
	switch n {
	case 1, 3, 5, 7, 9:
		fmt.Println("奇数")
	case 2, 4, 6, 8:
		fmt.Println("偶数")
	default:
		fmt.Println(n)
	}
}
```

另一种写法：

```go
package main

import "fmt"

func main() {
	switch n := 7; n {
	case 1, 3, 5, 7, 9:
		fmt.Println("奇数")
	case 2, 4, 6, 8:
		fmt.Println("偶数")
	default:
		fmt.Println(n)
	}
}
```

注意： 上面两种写法的作用域

分支还可以使用表达式，这时候 switch 语句后面不需要再跟判断变量。例如：

```go
package main

import "fmt"

func main() {
	age := 56
	switch {
	case age < 25:
		fmt.Println("好好学习吧！")
	case age > 25 && age <= 60:
		fmt.Println("好好工作吧！")
	case age > 60:
		fmt.Println("好好享受吧！")
	default:
		fmt.Println("活着真好！")
	}
}
```

switch 的穿透 fallthrought

fallthrough`语法可以执行满足条件的 case 的下一个 case，是为了兼容C 语言中的case 设计的。

```go
package main

import "fmt"

func switchDemo5() {
	s := "a"
	switch {
	case s == "a":
		fmt.Println("a")
		fallthrough
	case s == "b":
		fmt.Println("b")
	case s == "c":
		fmt.Println("c")
	default:
		fmt.Println("...")
	}
}

func main() {
	switchDemo5()
}
```

输出：

```cmd
a
b
```

```go
package main

import "fmt"

func main() {
	var num int = 10
	switch num {
	case 10:
		fmt.Println("ok1")
		fallthrough //默认只能穿透一层
	case 20:
		fmt.Println("ok2")
		fallthrough
	case 30:
		fmt.Println("ok3")
	default:
		fmt.Println("没有匹配到..")
	}
}
```

输出：

```go
ok1
ok2
ok3
```

### break（跳出循环）

Go 语言中 break 语句用于以下几个方面：

1. 用于循环语句中跳出循环，并开始执行循环之后的语句。
2. break 在 switch（开关语句）中在执行一条 case 后跳出语句的作用。
3. 在多重循环中，可以用标号 label 标出想 break 的循环。

switch（开关语句）中在执行一条 case 后跳出语句的作用

```go
package main

import "fmt"

func main() {
	extname := ".a"
	switch extname {
	case ".html":
		fmt.Println("text/html")
		break
	case ".css":
		fmt.Println("text/css")
		break
	case ".js":
		fmt.Println("text/javascript")
		break
	default:
		fmt.Println("格式错误")
		break
	}
}
```

for 循环中默认 break 只能跳出一层循环

```go
package main

import "fmt"

func main() {
	for i := 0; i < 2; i++ {

		for j := 0; j < 10; j++ {
			if j == 2 {
				break
			}
			fmt.Println("i j 的值", i, "-", j)
		}
	}
}
```

```go
package main

import "fmt"

func main() {
	k := 1
	for { // 这里也等价 for ; ; {
		if k <= 10 {
			fmt.Println("ok~~", k)
		} else {
			break //break 就是跳出这个 for 循环
		}
		k++
	}
}
```

在多重循环中，可以用标号 label 标出想 break 的循环。

```go
package main

import "fmt"

func main() {
lable2:
	for i := 0; i < 2; i++ {
		for j := 0; j < 10; j++ {
			if j == 2 {
				break lable2
			}
			fmt.Println("i j 的值", i, "-", j)
		}
	}
}
```

### continue（继续下次循环）

continue 语句可以结束当前循环，开始下一次的循环迭代过程，仅限在for 循环内使用。

```go
package main

import "fmt"

func main() {
	for i := 0; i < 2; i++ {
		for j := 0; j < 4; j++ {
			if j == 2 {
				continue
			}
			fmt.Println("i j 的值", i, "-", j)
		}
	}
}
```

输出：

```cmd
i j 的值 0 - 0
i j 的值 0 - 1
i j 的值 0 - 3
i j 的值 1 - 0
i j 的值 1 - 1
i j 的值 1 - 3
```

在 continue 语句后添加标签时，表示开始标签对应的循环。例如：

```go
package main

import "fmt"

func main() {
here:
	for i := 0; i < 2; i++ {
		for j := 0; j < 4; j++ {
			if j == 2 {
				continue here
			}
			fmt.Println("i j 的值", i, "-", j)
		}
	}
}
```

输出：

```cmd
i j 的值 0 - 0
i j 的值 0 - 1
i j 的值 1 - 0
i j 的值 1 - 1
```

### goto（跳转到指定标签）

goto 语句通过标签进行代码间的无条件跳转。goto 语句可以在快速跳出循环、避免重复退出上有一定的帮助。Go 语言中使用 goto 语句能简化一些代码的实现过程。

```go
package main

import "fmt"

func main() {
	var n int = 30
	fmt.Println("ok1")
	if n > 20 {
		goto label1
	}
	fmt.Println("ok2")
	fmt.Println("ok3")
	fmt.Println("ok4")
label1:
	fmt.Println("ok5")
	fmt.Println("ok6")
	fmt.Println("ok7")
}
```

输出：

```cmd
ok1
ok5
ok6
ok7
```

使用 goto 语句能简化代码：

```go
package main

import "fmt"

func main() {
	for i := 0; i < 10; i++ {
		for j := 0; j < 10; j++ {
			if j == 2 {
				// 设置退出标签
				goto breakTag
			}
			fmt.Printf("%v-%v\n", i, j)
		}
	}
	return
	// 标签
breakTag:
	fmt.Println("结束 for 循环")
}
```

输出：

```cmd
0-0
0-1
结束 for 循环
```

## 九、数组

数组（Array）是指一系列同一类型数据的集合。数组中包含的每个数据被称为数组元素（element），这种类型可以是任意的原始类型，比如 int、string 等，也可以是用户自定义的类型。一个数组包含的元素个数被称为数组的长度。在 Golang 中数组是一个长度固定的数据类型，数组的长度是类型的一部分，也就是说 [5]int 和 [10]int 是两个不同的类型。Golang 中数组的另一个特点是占用内存的连续性，也就是说数组中的元素是被分配到连续的内存地址中的，因而索引数组元素的速度非常快。

和数组对应的类型是 Slice（切片），Slice 是可以增长和收缩的动态序列，功能也更灵活，但是想要理解 slice 工作原理的话需要先理解数组，所以本节主要为大家讲解数组的使用。

数组基本语法：

```go
// 定义一个长度为 3 元素类型为 int 的数组 a
var a [3]int
// 定义一个长度为 3 元素类型为 int 的数组 b 并赋值
var b [3]int
b[0] = 80
b[1] = 100
b[2] = 96
```

### 数组定义

```go
var 数组变量名 [元素数量]T
```

比如：var a [5]int， 数组的长度必须是常量，并且长度是数组类型的一部分。一旦定义，长度不能变。 [5]int 和[4]int 是不同的类型。

```go
var a [3]int
var b [4]int
a = b //不可以这样做，因为此时 a 和 b 是不同的类型
```

数组可以通过下标进行访问，下标是从 0 开始，最后一个元素下标是：len-1，访问越界（下标在合法范围之外），则触发访问越界，会 panic。

### 数组的初始化

- 方法一

初始化数组时可以使用初始化列表来设置数组元素的值。

```go
package main

import "fmt"

func main() {
	var testArray [3]int                        //数组会初始化为int 类型的零值
	var numArray = [3]int{1, 2}                 //使用指定的初始值完成初始化
	var cityArray = [3]string{"北京", "上海", "深圳"} //使用指定的初始值完成初始化
	fmt.Println(testArray)                      //[0 0 0]
	fmt.Println(numArray)                       //[1 2 0]
	fmt.Println(cityArray)                      //[北京 上海 深圳]
}
```

- 方法二

按照上面的方法每次都要确保提供的初始值和数组长度一致，一般情况下我们可以让编译器根据初始值的个数自行推断数组的长度，例如：

```go
package main

import "fmt"

func main() {
	var testArray [3]int
	var numArray = [...]int{1, 2}
	var cityArray = [...]string{"北京", "上海", "深圳"}
	fmt.Println(testArray)                          //[0 0 0]
	fmt.Println(numArray)                           //[1 2]
	fmt.Printf("type of numArray:%T\n", numArray)   //type of numArray:[2]int
	fmt.Println(cityArray)                          //[北京 上海 深圳]
	fmt.Printf("type of cityArray:%T\n", cityArray) //type of cityArray:[3]string
}
```

- 方法三

我们还可以使用指定索引值的方式来初始化数组，例如:

```go
package main

import "fmt"

func main() {
	a := [...]int{1: 1, 3: 5}
	fmt.Println(a)                  // [0 1 0 5]
	fmt.Printf("type of a:%T\n", a) //type of a:[4]int
}
```

### 数组的遍历

遍历数组 a 有以下两种方法：

```go
package main

import "fmt"

func main() {
	var a = [...]string{"北京", "上海", "深圳"}
	// 方法 1：for 循环遍历
	for i := 0; i < len(a); i++ {
		fmt.Println(a[i])
	}
	// 方法 2：for range 遍历
	for index, value := range a {
		fmt.Println(index, value)
	}
}
```

### 数组是值类型

数组是值类型，赋值和传参会复制整个数组。因此改变副本的值，不会改变本身的值。

```go
package main

import "fmt"

func modifyArray(x [3]int) {
	x[0] = 100
}
func modifyArray2(x [3][2]int) {
	x[2][0] = 100
}
func main() {
	a := [3]int{10, 20, 30}
	modifyArray(a) //在 modify 中修改的是 a 的副本 x
	fmt.Println(a) //[10 20 30]
	b := [3][2]int{
		{1, 1}, {1, 1}, {1, 1}}
	modifyArray2(b) //在 modify 中修改的是 b 的副本 x
	fmt.Println(b)  //[[1 1] [1 1] [1 1]]
}
```

注意：

1. 数组支持 “==“、”!=” 操作符，因为内存总是被初始化过的。
2. [n]*T 表示指针数组，*[n]T 表示数组指针

### 多维数组

Go 语言是支持多维数组的，我们这里以二维数组为例（数组中又嵌套数组）。

```go
var 数组变量名 [元素数量][元素数量]T
```

```go
var variable_name [SIZE1][SIZE2]...[SIZEN] variable_type
```

二维数组的定义

```go
package main

import "fmt"

func main() {
	a := [3][2]string{
		{"北京", "上海"}, {"广州", "深圳"}, {"成都", "重庆"}}
	fmt.Println(a)       //[[北京 上海] [广州 深圳] [成都 重庆]]
	fmt.Println(a[2][1]) //支持索引取值:重庆
}
```

二维数组的遍历

```go
package main

import "fmt"

func main() {
	a := [3][2]string{
		{"北京", "上海"}, {"广州", "深圳"}, {"成都", "重庆"}}
	for _, v1 := range a {
		for _, v2 := range v1 {
			fmt.Printf("%s\t", v2)
		}
		fmt.Println()
	}
}
```

输出：

```cmd
北京    上海
广州    深圳
成都    重庆
```

注意： 多维数组只有第一层可以使用...来让编译器推导数组长度。例如：

```go
//支持的写法
a := [...][2]string{
{"北京", "上海"}, {"广州", "深圳"}, {"成都", "重庆"}, }

//不支持多维数组的内层使用... 
b := [3][...]string{
{"北京", "上海"}, {"广州", "深圳"}, {"成都", "重庆"}, }
```

### 数组练习题

- 请求出一个数组的和以及平均值。for-range

```go
package main

import "fmt"

func main() {
	var intArr2 [5]int = [...]int{1, -1, 9, 90, 12}
	sum := 0
	for _, val := range intArr2 {
		//累计求和
		sum += val
	}
	//如何让平均值保留到小数.
	fmt.Printf("sum=%v 平均值=%v \n\n", sum, float64(sum)/float64(len(intArr2)))
}
```

- 请求出一个数组的最大值，并得到对应的下标

1. 声明一个数组 var intArr[5] = [...]int {1, -1, 12, 65, 11}
2. 假定第一个元素就是最大值，下标就 0
3. 然后从第二个元素开始循环比较，如果发现有更大，则交换

```go
package main

import "fmt"

func main() {
	var intArr = [...]int{1, -1, 112, 65, 11}
	maxValue := intArr[0]
	maxIndex := 0
	for i := 0; i < len(intArr); i++ {
		if maxValue < intArr[i] {
			maxValue = intArr[i]
			maxIndex = i
		}
	}
	fmt.Println("最大值", maxValue, "最大值索引值", maxIndex)
}
```

- 从数组[1, 3, 5, 7, 8]中找出和为 8 的两个元素的下标分别为(0,3)和(1,2)

```go
package main

import "fmt"

func main() {
	arr := [...]int{1, 3, 5, 7, 8}
	for i := 0; i < len(arr); i++ {
		for j := i + 1; j < len(arr); j++ {
			if arr[i]+arr[j] == 8 {
				fmt.Printf("(%v,%v)\n", arr[i], arr[j])
			}
		}
	}
}
```

## 十、切片

### 为什么要使用切片 

因为数组的长度是固定的并且数组长度属于类型的一部分，所以数组有很多的局限性。例如：

```go
package main

func arraySum(x [4]int) int {
	sum := 0
	for _, v := range x {
		sum = sum + v
	}
	return sum
}
func main() {
	a := [4]int{1, 2, 3, 4}
	println(arraySum(a))
	// b := [5]int{1, 2, 3, 4, 5}
	// println(arraySum(b)) //错误
}
```

这个求和函数只能接受[4]int 类型，其他的都不支持。所以传入长度为5 的数组的时候就会报错。

### 切片的定义

切片（Slice）是一个拥有相同类型元素的可变长度的序列。它是基于数组类型做的一层封装。它非常灵活，支持自动扩容。

切片是一个引用类型，它的内部结构包含地址、长度和容量。

声明切片类型的基本语法如下：

```go
var name []T
```

其中：

1. name:表示变量名
2. T:表示切片中的元素类型

举个例子：

```go
package main

import "fmt"

func main() {
	// 声明切片类型
	var a []string              //声明一个字符串切片
	var b = []int{}             //声明一个整型切片并初始化
	var c = []bool{false, true} //声明一个布尔切片并初始化
	// var d = []bool{false, true} //声明一个布尔切片并初始化
	fmt.Println(a)        //[]
	fmt.Println(b)        //[]
	fmt.Println(c)        //[false true]
	fmt.Println(a == nil) //true
	fmt.Println(b == nil) //false
	fmt.Println(c == nil) //false
	// fmt.Println(c == d)         //切片是引用类型，不支持直接比较，只能和nil 比较
}
```

### 关于 nil 的认识

当你声明了一个变量 , 但却还并没有赋值时 , golang 中会自动给你的变量赋值一个默认零值。这是每种类型对应的零值。

```go
bool -> false
numbers -> 0
string-> "" pointers -> nil
slices -> nil
maps -> nil
channels -> nil
functions -> nil
interfaces -> nil
```

### 切片的循环遍历

切片的循环遍历和数组的循环遍历是一样的。

```go
package main

import "fmt"

func main() {
	var a = []string{"北京", "上海", "深圳"}
	// 方法 1：for 循环遍历
	for i := 0; i < len(a); i++ {
		fmt.Println(a[i])
	}
	// 方法 2：for range 遍历
	for index, value := range a {
		fmt.Println(index, value)
	}
}
```

### 基于数组定义切片

由于切片的底层就是一个数组，所以我们可以基于数组定义切片。

```go
func main() {
// 基于数组定义切片
a := [5]int{55, 56, 57, 58, 59}
b := a[1:4] //基于数组 a 创建切片，包括元素a[1],a[2],a[3]
fmt.Println(b) //[56 57 58]
fmt.Printf("type of b:%T\n", b) //type of b:[]int
}
还支持如下方式：
c := a[1:] //[56 57 58 59]
d := a[:4] //[55 56 57 58]
e := a[:] //[55 56 57 58 59]
```

### 切片再切片

除了基于数组得到切片，我们还可以通过切片来得到切片。

```go
package main

import "fmt"

func main() {
	//切片再切片
	a := [...]string{"北京", "上海", "广州", "深圳", "成都", "重庆"}
	fmt.Printf("a:%v type:%T len:%d cap:%d\n", a, a, len(a), cap(a))
	b := a[1:3]
	fmt.Printf("b:%v type:%T len:%d cap:%d\n", b, b, len(b), cap(b))
	c := b[1:5]
	fmt.Printf("c:%v type:%T len:%d cap:%d\n", c, c, len(c), cap(c))
}
```

输出：

```cmd
a:[北京 上海 广州 深圳 成都 重庆] type:[6]string len:6 cap:6
b:[上海 广州] type:[]string len:2 cap:5
c:[广州 深圳 成都 重庆] type:[]string len:4 cap:4
```

注意： 对切片进行再切片时，索引不能超过原数组的长度，否则会出现索引越界的错误。

### 关于切片的长度和容量

切片拥有自己的长度和容量，我们可以通过使用内置的 len()函数求长度，使用内置的cap() 函数求切片的容量。

切片的长度就是它所包含的元素个数。

切片的容量是从它的第一个元素开始数，到其底层数组元素末尾的个数。

切片 s 的长度和容量可通过表达式 len(s) 和 cap(s) 来获取。

```go
package main

import "fmt"

func main() {
	s := []int{2, 3, 5, 7, 11, 13}
	fmt.Println(s)
	fmt.Printf("长度:%v 容量 %v\n", len(s), cap(s))
	c := s[:2]
	fmt.Println(c)
	fmt.Printf("长度:%v 容量 %v\n", len(c), cap(c))
	d := s[1:3]
	fmt.Println(d)
	fmt.Printf("长度:%v 容量 %v", len(d), cap(d))
}
```

输出：

```cmd
[2 3 5 7 11 13]
长度:6 容量 6
[2 3]
长度:2 容量 6
[3 5]
长度:2 容量 5
```

### 切片的本质

切片的本质就是对底层数组的封装，它包含了三个信息：底层数组的指针、切片的长度（len）和切片的容量（cap）。

### 使用 make()函数构造切片

我们上面都是基于数组来创建的切片，如果需要动态的创建一个切片，我们就需要使用内置的 make()函数，格式如下：

```go
make([]T, size, cap)
```

其中：

1. T:切片的元素类型
2. ize:切片中元素的数量
3. cap:切片的容量

举个例子：

```go
package main

import "fmt"

func main() {
	a := make([]int, 2, 10)
	fmt.Println(a)      //[0 0]
	fmt.Println(len(a)) //2
	fmt.Println(cap(a)) //10
}
```

上面代码中 a 的内部存储空间已经分配了 10 个，但实际上只用了 2 个。容量并不会影响当前元素的个数，所以 len(a)返回 2，cap(a)则返回该切片的容量。

### 切片不能直接比较

切片之间是不能比较的，我们不能使用==操作符来判断两个切片是否含有全部相等元素。切片唯一合法的比较操作是和 nil 比较。 一个 nil 值的切片并没有底层数组，一个nil 值的切片 的长度和容量都是 0。但是我们不能说一个长度和容量都是 0 的切片一定是nil，例如下面的示例：

```go
var s1 []int //len(s1)=0;cap(s1)=0;s1==nil
s2 := []int{} //len(s2)=0;cap(s2)=0;s2!=nil
s3 := make([]int, 0) //len(s3)=0;cap(s3)=0;s3!=nil
```

### 切片是引用数据类型--注意切片的赋值拷贝

下面的代码中演示了拷贝前后两个变量共享底层数组，对一个切片的修改会影响另一个切片的内容，这点需要特别注意。

```go
package main

import "fmt"

func main() {
	s1 := make([]int, 3) //[0 0 0]
	s2 := s1             //将 s1 直接赋值给 s2，s1 和 s2 共用一个底层数组
	s2[0] = 100
	fmt.Println(s1) //[100 0 0]
	fmt.Println(s2) //[100 0 0]
}
```

### append()方法为切片添加元素

Go 语言的内建函数 append()可以为切片动态添加元素，每个切片会指向一个底层数组，这个数组的容量够用就添加新增元素。当底层数组不能容纳新增的元素时，切片就会自动按照一定的策略进行“扩容”，此时该切片指向的底层数组就会更换。“扩容”操作往往发生在append()函数调用时，所以我们通常都需要用原变量接收 append 函数的返回值。

给切片追加元素的错误写法：

```go
s3 := []int{1, 2, 3, 5, 6, 7}
s3[6] = 8
fmt.Println(s3) //index out of range [6] with length 6
```

append()方法为切片追加元素：

```go
package main

import "fmt"

func main() {
	//append()添加元素和切片扩容
	var numSlice []int
	for i := 0; i < 10; i++ {
		numSlice = append(numSlice, i)
         // ptr是内存地址
		fmt.Printf("%v len:%d cap:%d ptr:%p\n", numSlice, len(numSlice), cap(numSlice), numSlice)
	}
}
```

输出：

```cmd
[0] len:1 cap:1 ptr:0x6a5a338e060
[0 1] len:2 cap:2 ptr:0x6a5a338e0a0
[0 1 2] len:3 cap:4 ptr:0x6a5a3398060
[0 1 2 3] len:4 cap:4 ptr:0x6a5a3398060
[0 1 2 3 4] len:5 cap:8 ptr:0x6a5a33a2080
[0 1 2 3 4 5] len:6 cap:8 ptr:0x6a5a33a2080
[0 1 2 3 4 5 6] len:7 cap:8 ptr:0x6a5a33a2080
[0 1 2 3 4 5 6 7] len:8 cap:8 ptr:0x6a5a33a2080
[0 1 2 3 4 5 6 7 8] len:9 cap:16 ptr:0x6a5a33a4080
[0 1 2 3 4 5 6 7 8 9] len:10 cap:16 ptr:0x6a5a33a4080
```

从上面的结果可以看出：

1. append()函数将元素追加到切片的最后并返回该切片。
2. 切片 numSlice 的容量按照 1，2，4，8，16 这样的规则自动进行扩容，每次扩容后都是扩容前的 2 倍。

append()函数还支持一次性追加多个元素。 例如：

```go
package main

import "fmt"

func main() {
	var citySlice []string
	// 追加一个元素
	citySlice = append(citySlice, "北京")
	// 追加多个元素
	citySlice = append(citySlice, "上海", "广州", "深圳")
	// 追加切片
	a := []string{"成都", "重庆"}
	citySlice = append(citySlice, a...)
	fmt.Println(citySlice) //[北京 上海 广州 深圳 成都 重庆]
}
```

切片的追加切片

```go
s1 := []int{100, 200, 300}
s2 := []int{400, 500, 600}
s3 := append(s1, s2...)
fmt.Println(s3)
```

### 切片的扩容策略（了解）


### 使用 copy()函数复制切片

首先我们来看一个问题：

```go
package main

import "fmt"

func main() {
	a := []int{1, 2, 3, 4, 5}
	b := a
	fmt.Println(a) //[1 2 3 4 5]
	fmt.Println(b) //[1 2 3 4 5]
	b[0] = 1000
	fmt.Println(a) //[1000 2 3 4 5]
	fmt.Println(b) //[1000 2 3 4 5]
}
```

由于切片是引用类型，所以 a 和 b 其实都指向了同一块内存地址。修改b 的同时a 的值也会发生变化。

Go 语言内建的 copy()函数可以迅速地将一个切片的数据复制到另外一个切片空间中，copy() 函数的使用格式如下：

```go
copy(destSlice, srcSlice []T)
```

其中：

1. srcSlice: 数据来源切片
2. destSlice: 目标切片

举个例子：

```go
package main

import "fmt"

func main() {
	// copy()复制切片
	a := []int{1, 2, 3, 4, 5}
	c := make([]int, 5, 5)
	copy(c, a)     //使用 copy()函数将切片 a 中的元素复制到切片c
	fmt.Println(a) //[1 2 3 4 5]
	fmt.Println(c) //[1 2 3 4 5]
	c[0] = 1000
	fmt.Println(a) //[1 2 3 4 5]
	fmt.Println(c) //[1000 2 3 4 5]
}
```

### 从切片中删除元素

Go 语言中并没有删除切片元素的专用方法，我们可以使用切片本身的特性来删除元素。代码如下：

```go
package main

import "fmt"

func main() {
	// 从切片中删除元素
	a := []int{30, 31, 32, 33, 34, 35, 36, 37}
	// 要删除索引为 2 的元素
	a = append(a[:2], a[3:]...)
	fmt.Println(a) //[30 31 33 34 35 36 37]
}
```

总结一下就是：要从切片 a 中删除索引为 index 的元素，操作方法是a = append(a[:index], a[index+1:]...)

### 练习题

请写出下面代码的输出结果

```go
package main

import "fmt"

func main() {
	var a = make([]string, 5, 10)
	for i := 0; i < 12; i++ {
		a = append(a, fmt.Sprintf("%v", i))
	}
	fmt.Println(a)
	fmt.Println(len(a), cap(a))
}
```

输出：

```cmd
[     0 1 2 3 4 5 6 7 8 9 10 11]
17 20
```

初始化时len长度为5，有5个‘5’，又增加了12个数字，为17

初始化cap容量为10，不够用后自动增加到20

请使用内置的 sort 包对数组 var a = [...]int{3, 7, 8, 9, 1}进行排序（）。

```go
package main

import (
	"fmt"
	"sort"
)

func main() {
	// 请使用内置的 sort 包对数组 var a = [...]int{3, 7, 8, 9, 1}进行排序（）。
	var a = [...]int{3, 7, 8, 9, 1}

	sort.Ints(a[:])
	fmt.Println(a)
}
```

## 十一、选择排序，冒泡排序，sort排序

### 选择排序

选择排序：进行从小到大排序 

概念: 通过比较，首先选出最小的数放在第一个位置上，然后在其余的数中选出次小数放在第二个位置上,依此类推,直到所有的数成为有序序列 。

```go
package main

import (
	"fmt"
)

func main() {
	var numSlice = []int{9, 8, 7, 6, 5, 4}
	for i := 0; i < len(numSlice); i++ {
		for j := i + 1; j < len(numSlice); j++ {
			if numSlice[i] > numSlice[j] {
				temp := numSlice[i]
				numSlice[i] = numSlice[j]
				numSlice[j] = temp
			}
		}
	}
	fmt.Println(numSlice)
}
```

### 冒泡排序

概念:从头到尾,比较相邻的两个元素的大小,如果符合交换条件,交换两个元素的位置。

特点:每一轮比较中,都会选出一个最大的数，放在正确的位置。

```go
package main

import (
	"fmt"
)

func main() {
	var numSlice = []int{9, 8, 7, 6, 5, 4}
	for i := 0; i < len(numSlice); i++ {
		for j := i + 1; j < len(numSlice); j++ {
			if numSlice[i] > numSlice[j] {
				temp := numSlice[i]
				numSlice[i] = numSlice[j]
				numSlice[j] = temp
			}
		}
	}
	fmt.Println(numSlice)
}
```

### Golang 内置 Sort 包对切片进行排序

- sort 升序排序

对于 int 、 float64 和 string 数组或是切片的排序， go 分别提供了sort.Ints() 、sort.Float64s() 和 sort.Strings() 函数， 默认都是从小到大排序。

```go
package main

import (
	"fmt"
	"sort"
)

func main() {
	intList := []int{2, 4, 3, 5, 7, 6, 9, 8, 1, 0}
	float64List := []float64{4.2, 5.9, 12.4, 10.2, 50.7, 99.9, 31.4, 27.81828, 3.14}
	stringList := []string{"a", "c", "b", "z", "x", "w", "y", "d", "f", "i"}

	sort.Ints(intList)
	sort.Float64s(float64List)
	sort.Strings(stringList)

	fmt.Println(intList)
	fmt.Println(float64List)
	fmt.Println(stringList)
}
```

输出：

```cmd
[0 1 2 3 4 5 6 7 8 9]
[3.14 4.2 5.9 10.2 12.4 27.81828 31.4 50.7 99.9]
[a b c d f i w x y z]
```

- sort 降序排序

Golang 的 sort 包 可 以 使 用 sort.Reverse(slice) 来调换slice.Interface.Less ，也就是比较函数，所以， int 、float64 和string的逆序排序函数可以这么写。

```go
package main

import (
	"fmt"
	"sort"
)

func main() {
	intList := []int{2, 4, 3, 5, 7, 6, 9, 8, 1, 0}
	float8List := []float64{4.2, 5.9, 12.4, 10.2, 50.7, 99.9, 31.4, 27.81828, 3.14}
	stringList := []string{"a", "c", "b", "z", "x", "w", "y", "d", "f", "i"}

	sort.Sort(sort.Reverse(sort.IntSlice(intList)))
	sort.Sort(sort.Reverse(sort.Float64Slice(float8List)))
	sort.Sort(sort.Reverse(sort.StringSlice(stringList)))

	fmt.Printf("%v\n%v\n%v\n", intList, float8List, stringList)
}
```

输出：

```cmd
[9 8 7 6 5 4 3 2 1 0]
[99.9 50.7 31.4 27.81828 12.4 10.2 5.9 4.2 3.14]
[z y x w i f d c b a]
```

## 十二、map

map 是一种无序的基于 key-value 的数据结构，Go 语言中的 map 是引用类型，必须初始化才能使用。

###  map 的定义

```go
map[KeyType]ValueType
```

其中：

1. KeyType:表示键的类型。
2. ValueType:表示键对应的值的类型。

map 类型的变量默认初始值为 nil，需要使用 make()函数来分配内存。语法为：

make: 用于 slice，map，和 channel 的初始化。

```go
make(map[KeyType]ValueType, [cap])
```

其中 cap 表示 map 的容量，该参数虽然不是必须的。

注意：获取 map 的容量不能使用 cap, cap 返回的是数组切片分配的空间大小, 根本不能用于map。要获取 map 的容量，可以用 len 函数。

### map 基本使用

map 中的数据都是成对出现的，map 的基本使用示例代码如下：

```go
package main

import "fmt"

func main() {
	scoreMap := make(map[string]int, 8)
	scoreMap["张三"] = 90
	scoreMap["小明"] = 100
	fmt.Println(scoreMap)
	fmt.Println(scoreMap["小明"])
	fmt.Printf("type of a:%T\n", scoreMap)
}
```

输出：

```cmd
map[小明:100 张三:90]
100
type of a:map[string]int
```

map 也支持在声明的时候填充元素，例如：

```go
package main

import "fmt"

func main() {
	userInfo := map[string]string{
		"username": "IT 营小王子",
		"password": "123456",
	}
	fmt.Println(userInfo)
}
```

### 判断某个键是否存在

Go 语言中有个判断 map 中键是否存在的特殊写法，格式如下：

```go
value, ok := map 对象[key]
```

举个例子：

```go
package main

import "fmt"

func main() {
	scoreMap := make(map[string]int)
	scoreMap["张三"] = 90
	scoreMap["小明"] = 100
	// 如果 key 存在 ok 为 true,v 为对应的值；不存在 ok 为 false,v 为值类型的零值
	v, ok := scoreMap["张三"]
	if ok {
		fmt.Println(v)
	} else {
		fmt.Println("查无此人")
	}
```

### map 的遍历

Go 语言中使用 for range 遍历 map。

```go
package main

import "fmt"

func main() {
	scoreMap := make(map[string]int)
	scoreMap["张三"] = 90
	scoreMap["小明"] = 100
	scoreMap["娜扎"] = 60
	for k, v := range scoreMap {
		fmt.Println(k, v)
	}
}
```

但我们只想遍历 key 的时候，可以按下面的写法：

```go
package main

import "fmt"

func main() {
	scoreMap := make(map[string]int)
	scoreMap["张三"] = 90
	scoreMap["小明"] = 100
	scoreMap["娜扎"] = 60
	for k := range scoreMap {
		fmt.Println(k)
	}
}
```

注意： 遍历 map 时的元素顺序与添加键值对的顺序无关。

### 使用 delete()函数删除键值对

使用 delete()内建函数从 map 中删除一组键值对，delete()函数的格式如下：

```go
delete(map 对象, key)
```

其中：

1. map 对象:表示要删除键值对的 map 对象
2. key:表示要删除的键值对的键

示例代码如下：

```go
package main

import "fmt"

func main() {
	scoreMap := make(map[string]int)
	scoreMap["张三"] = 90
	scoreMap["小明"] = 100
	scoreMap["娜扎"] = 60
	delete(scoreMap, "小明") //将小明:100 从 map 中删除
	for k, v := range scoreMap {
		fmt.Println(k, v)
	}
}
```

### 按照指定顺序遍历map

```go
package main

import (
	"fmt"
	"math/rand"
	"sort"
	"time"
)

func main() {
	rand.Seed(time.Now().UnixNano()) //初始化随机数种子
	var scoreMap = make(map[string]int, 200)
	for i := 0; i < 100; i++ {
		key := fmt.Sprintf("stu%02d", i) //生成 stu 开头的字符串
		value := rand.Intn(100)          //生成 0~99 的随机整数
		scoreMap[key] = value
	}
	// 取出 map 中的所有 key 存入切片 keys
	var keys = make([]string, 0, 200)
	for key := range scoreMap {
		keys = append(keys, key)
	}
	// 对切片进行排序
	sort.Strings(keys)
	// 按照排序后的 key 遍历 map
	for _, key := range keys {
		fmt.Println(key, scoreMap[key])
	}
}

```

### 元素为 map 类型的切片

下面的代码演示了切片中的元素为 map 类型时的操作：

```go
package main

import "fmt"

func main() {
	var mapSlice = make([]map[string]string, 3)
	for index, value := range mapSlice {
		fmt.Printf("index:%d value:%v\n", index, value)
	}
	fmt.Println("after init")
	// 对切片中的 map 元素进行初始化
	mapSlice[0] = make(map[string]string, 10)
	mapSlice[0]["name"] = "小王子"
	mapSlice[0]["password"] = "123456"
	mapSlice[0]["address"] = "海淀区"
	for index, value := range mapSlice {
		fmt.Printf("index:%d value:%v\n", index, value)
	}
}
```

### 值为切片类型的 map

下面的代码演示了 map 中值为切片类型的操作：

```go
package main

import "fmt"

func main() {
	var sliceMap = make(map[string][]string, 3)
	fmt.Println(sliceMap)
	fmt.Println("after init")
	key := "中国"
	value, ok := sliceMap[key]
	if !ok {
		value = make([]string, 0, 2)
	}
	value = append(value, "北京", "上海")
	sliceMap[key] = value
	fmt.Println(sliceMap)
}
```

### 练习题

写一个程序，统计一个字符串中每个单词出现的次数。比如：”how do you do”中how=1 do=2you=1。

```go
package main

import (
	"fmt"
	"strings"
)

func main() {
	var wordMap = make(map[string]int)
	var str = "how do you do"
	var arrSlice = strings.Split(str, " ")
	for _, word := range arrSlice {
		wordMap[word]++
	}
	fmt.Println(wordMap)
}
```

## 十三、函数

### 函数定义

函数是组织好的、可重复使用的、用于执行指定任务的代码块。

Go 语言中支持：函数、匿名函数和闭包。

Go 语言中定义函数使用 func 关键字，具体格式如下：

```go
func 函数名(参数)(返回值){
函数体
}
```

其中：

1. 函数名：由字母、数字、下划线组成。但函数名的第一个字母不能是数字。在同一个包内，函数名也称不能重名（包的概念详见后文）。
2. 参数：参数由参数变量和参数变量的类型组成，多个参数之间使用,分隔。
3. 返回值：返回值由返回值变量和其变量类型组成，也可以只写返回值的类型，多个返回值必须用()包裹，并用,分隔。
4. 函数体：实现指定功能的代码块。

我们先来定义一个求两个数之和的函数：

```go
func intSum(x int, y int) int {
return x + y
}
```

函数的参数和返回值都是可选的，例如我们可以实现一个既不需要参数也没有返回值的函数：

```go
func sayHello() {
fmt.Println("Hello it 营")
}
```

### 函数的调用

定义了函数之后，我们可以通过函数名()的方式调用函数。 例如我们调用上面定义的两个函数，代码如下：

```go
func main() {
sayHello()
ret := intSum(10, 20)
fmt.Println(ret)
}
```

注意，调用有返回值的函数时，可以不接收其返回值。

### 函数参数

- 类型简写

函数的参数中如果相邻变量的类型相同，则可以省略类型，例如：

```go
func intSum(x, y int) int {
return x + y
}
```

上面的代码中，intSum 函数有两个参数，这两个参数的类型均为 int，因此可以省略x 的类型，因为 y 后面有类型说明，x 参数也是该类型。

- 可变参数

可变参数是指函数的参数数量不固定。Go 语言中的可变参数通过在参数名后加...来标识。

注意：可变参数通常要作为函数的最后一个参数。

举个例子：

```go
package main

import "fmt"

func intSum2(x ...int) int {
	fmt.Println(x) //x 是一个切片
	sum := 0
	for _, v := range x {
		sum = sum + v
	}
	return sum
}

func main() {
	// 调用上面的函数：
	ret1 := intSum2()
	ret2 := intSum2(10)
	ret3 := intSum2(10, 20)
	ret4 := intSum2(10, 20, 30)
	fmt.Println(ret1, ret2, ret3, ret4) //0 10 30 60

}
```

固定参数搭配可变参数使用时，可变参数要放在固定参数的后面，示例代码如下：

```go
package main

import "fmt"

func intSum3(x int, y ...int) int {
	fmt.Println(x, y)
	sum := x
	for _, v := range y {
		sum = sum + v
	}
	return sum
}

func main() {
	// 调用上述函数：
	ret5 := intSum3(100)
	ret6 := intSum3(100, 10)
	ret7 := intSum3(100, 10, 20)
	ret8 := intSum3(100, 10, 20, 30)
	fmt.Println(ret5, ret6, ret7, ret8) //100 110 130 160
}
```

本质上，函数的可变参数是通过切片来实现的。

### 函数返回值

Go 语言中通过 return 关键字向外输出返回值。

- 函数多返回值

Go 语言中函数支持多返回值，函数如果有多个返回值时必须用()将所有返回值包裹起来。举个例子：

```go
func calc(x, y int) (int, int) {
	sum := x + y
	sub := x - y
	return sum, sub
}
```

- 返回值命名

函数定义时可以给返回值命名，并在函数体中直接使用这些变量，最后通过return 关键字返回。

```go
func calc(x, y int) (sum, sub int) {
	sum = x + y
	sub = x - y
	return
}
```

### 函数变量作用域

- 全局变量

全局变量是定义在函数外部的变量，它在程序整个运行周期内都有效。在函数中可以访问到全局变量。

```go
package main

import "fmt"

// 定义全局变量 num
var num int64 = 10

func testGlobalVar() {
	fmt.Printf("num=%d\n", num) //函数中可以访问全局变量 num
}

func main() {
	testGlobalVar()
}
```

- 局部变量

局部变量是函数内部定义的变量， 函数内定义的变量无法在该函数外使用。

函数内定义的变量无法在该函数外使。

例如下面的示例代码 main 函数中无法使用 testLocalVar 函数中定义的变量x：

```go
package main

import "fmt"

func testLocalVar() {
	// 定义一个函数局部变量 x,仅在该函数内生效
	var x int64 = 100
	fmt.Printf("x=%d\n", x)
}
func main() {
	testLocalVar()
	fmt.Println(x) // 此时无法使用变量 x
}
```

如果局部变量和全局变量重名，优先访问局部变量。

```go
package main

import "fmt"

// 定义全局变量 num
var num int64 = 10

func testNum() {
	num := 100
	fmt.Printf("num=%d\n", num) // 函数中优先使用局部变量
}
func main() {
	testNum() // num=100
}
```

接下来我们来看一下语句块定义的变量，通常我们会在 if 条件判断、for 循环、switch 语句上使用这种定义变量的方式。

```go
package main

import "fmt"

func testLocalVar2(x, y int) {
	fmt.Println(x, y) //函数的参数也是只在本函数中生效
	if x > 0 {
		z := 100 //变量 z 只在 if 语句块生效
		fmt.Println(z)
	}
	// fmt.Println(z)//此处无法使用变量 z
}

func main() {
	testLocalVar2(1, 2)
}
```

还有我们之前讲过的 for 循环语句中定义的变量，也是只在 for 语句块中生效：

```go
package main

import "fmt"

func testLocalVar3() {
	for i := 0; i < 10; i++ {
		fmt.Println(i) //变量 i 只在当前 for 语句块中生效
	}
	// fmt.Println(i) //此处无法使用变量 i
}

func main() {
	testLocalVar3()
}

```

### 函数类型与变量

- 定义函数类型

我们可以使用 type 关键字来定义一个函数类型，具体格式如下：

```go
type calculation func(int, int) int
```

上面语句定义了一个 calculation 类型，它是一种函数类型，这种函数接收两个int 类型的参数并且返回一个 int 类型的返回值。

- 函数类型变量

简单来说，凡是满足这个条件的函数都是 calculation 类型的函数，例如下面的add 和sub是calculation 类型。

```go
package main

import "fmt"

type calculation func(int, int) int

func add(x, y int) int {
	return x + y
}
func sub(x, y int) int {
	return x - y
}

func main() {
	var c calculation               // 声明一个 calculation 类型的变量c
	c = add                         // 把 add 赋值给 c
	fmt.Printf("type of c:%T\n", c) // type of c:main.calculation
	fmt.Println(c(1, 2))            // 像调用 add 一样调用 c
	f := add                        // 将函数 add 赋值给变量 f1
	fmt.Printf("type of f:%T\n", f) // type of f:func(int, int) int
	fmt.Println(f(10, 20))          // 像调用 add 一样调用 f
}

```

add 和 sub 都能赋值给 calculation 类型的变量。

### 高阶函数

高阶函数分为函数作为参数和函数作为返回值两部分。

- 函数作为参数

```go
package main

import "fmt"

func add(x, y int) int {
	return x + y
}
func calc(x, y int, op func(int, int) int) int {
	return op(x, y)
}
func main() {
	ret2 := calc(10, 20, add)
	fmt.Println(ret2) //30
}
```

- 函数作为返回值

```go
package main

import (
	"fmt"
)

func add(x, y int) int {
	return x + y
}
func sub(x, y int) int {
	return x - y
}
func do(s string) func(int, int) int {
	switch s {
	case "+":
		return add
	case "-":
		return sub
	default:
		return nil
	}
}
func main() {
	var a = do("+")
	fmt.Println(a(10, 20))
}
```

### 匿名函数和闭包

- 匿名函数

数当然还可以作为返回值，但是在 Go 语言中函数内部不能再像之前那样定义函数了，只能定义匿名函数。匿名函数就是没有函数名的函数，匿名函数的定义格式如下：

```go
func(参数)(返回值){
函数体
}
```

匿名函数因为没有函数名，所以没办法像普通函数那样调用，所以匿名函数需要保存到某个变量或者作为立即执行函数:

```go
package main

import (
	"fmt"
)

func main() {
	// 将匿名函数保存到变量
	add := func(x, y int) {
		fmt.Println(x + y)
	}
	add(10, 20) // 通过变量调用匿名函数
	// 自执行函数：匿名函数定义完加()直接执行
	func(x, y int) {
		fmt.Println(x + y)
	}(10, 20)
}
```

- 闭包

闭包可以理解成“定义在一个函数内部的函数“。在本质上，闭包是将函数内部和函数外部连接起来的桥梁。或者说是函数和其引用环境的组合体。 首先我们来看一个例子：

```go
package main

import (
	"fmt"
)

func adder() func(int) int {
	var x int
	return func(y int) int {
		x += y
		return x
	}
}
func main() {
	var f = adder()
	fmt.Println(f(10)) //10
	fmt.Println(f(20)) //30
	fmt.Println(f(30)) //60
	f1 := adder()
	fmt.Println(f1(40)) //40
	fmt.Println(f1(50)) //90
}
```

变量 f 是一个函数并且它引用了其外部作用域中的 x 变量，此时 f 就是一个闭包。在f 的生命周期内，变量 x 也一直有效。

闭包进阶示例 1：

```go
package main

import (
	"fmt"
)

func adder2(x int) func(int) int {
	return func(y int) int {
		x += y
		return x
	}
}
func main() {
	var f = adder2(10)
	fmt.Println(f(10)) //20
	fmt.Println(f(20)) //40
	fmt.Println(f(30)) //70
	f1 := adder2(20)
	fmt.Println(f1(40)) //60
	fmt.Println(f1(50)) //110
}
```

闭包进阶示例 2：

```go
package main

import (
	"fmt"
	"strings"
)

func makeSuffixFunc(suffix string) func(string) string {
	return func(name string) string {
		if !strings.HasSuffix(name, suffix) {
			return name + suffix
		}
		return name
	}
}
func main() {
	jpgFunc := makeSuffixFunc(".jpg")
	txtFunc := makeSuffixFunc(".txt")
	fmt.Println(jpgFunc("test")) //test.jpg
	fmt.Println(txtFunc("test")) //test.txt
}
```

闭包进阶示例 3：

```go
package main

import (
	"fmt"
)

func calc(base int) (func(int) int, func(int) int) {
	add := func(i int) int {
		base += i
		return base
	}
	sub := func(i int) int {
		base -= i
		return base
	}
	return add, sub
}
func main() {
	f1, f2 := calc(10)
	fmt.Println(f1(1), f2(2)) //11 9
	fmt.Println(f1(3), f2(4)) //12 8
	fmt.Println(f1(5), f2(6)) //13 7
}
```

### defer 语句

Go 语言中的 defer 语句会将其后面跟随的语句进行延迟处理。在 defer 归属的函数即将返回时，将延迟处理的语句按 defer 定义的逆序进行执行，也就是说，先被defer 的语句最后被执行，最后被 defer 的语句，最先被执行。

举个例子：

```go
package main

import (
	"fmt"
)

func main() {
	fmt.Println("start")
	defer fmt.Println(1)
	defer fmt.Println(2)
	defer fmt.Println(3)
	fmt.Println("end")
}
```

输出：

```cmd
start
end
3
2
1
```

由于 defer 语句延迟调用的特性，所以 defer 语句能非常方便的处理资源释放问题。比如：资源清理、文件关闭、解锁及记录时间等。

- defer 执行时机

在 Go 语言的函数中 return 语句在底层并不是原子操作，它分为给返回值赋值和RET 指令两步。而 defer 语句执行的时机就在返回值赋值操作后，RET 指令执行前。

defer 经典案例 1

```go
package main

import "fmt"

func f1() int {
	x := 5
	defer func() {
		x++
	}()
	return x
}
func f2() (x int) {
	defer func() {
		x++
	}()
	return 5
}
func f3() (y int) {
	x := 5
	defer func() {
		x++
	}()
	return x
}
func f4() (x int) {
	defer func(x int) {
		x++
	}(x)
	return 5
}
func main() {
	fmt.Println(f1())
	fmt.Println(f2())
	fmt.Println(f3())
	fmt.Println(f4())
}
```

输出：

```cmd
5
6
5
5
```

defer 经典案例 2

```go
package main

import "fmt"

func calc(index string, a, b int) int {
	ret := a + b
	fmt.Println(index, a, b, ret)
	return ret
}

func main() {
	x := 1
	y := 2
	defer calc("AA", x, calc("A", x, y))
	x = 10
	defer calc("BB", x, calc("B", x, y))
```

输出：

```cmd
A 1 2 3
B 10 2 12
BB 10 12 22
AA 1 3 4
```

### 内置函数 panic/recover

| 内置函数         | 介绍                                                         |
| ---------------- | ------------------------------------------------------------ |
| close            | 主要用来关闭 channel                                         |
| len              | 用来求长度，比如 string、array、slice、map、channel          |
| new              | 用来分配内存，主要用来分配值类型，比如 int、struct。返回的是指针 |
| make             | 用来分配内存，主要用来分配引用类型，比如 chan、map、slice    |
| append           | 用来追加元素到数组、slice 中                                 |
| panic 和 recover | 用来做错误处理                                               |

Go 语言中目前（Go1.12）是没有异常机制，但是使用 panic/recover 模式来处理错误。panic 可以在任何地方引发，但 recover 只有在 defer 调用的函数中有效。首先来看一个例子：

- panic/recover 的基本使用

```go
package main

import "fmt"

func funcA() {
	fmt.Println("func A")
}
func funcB() {
	panic("panic in B")
}
func funcC() {
	fmt.Println("func C")
}
func main() {
	funcA()
	funcB()
	funcC()
}
```

运行报错信息：

```cmd
func A
panic: panic in B

goroutine 1 [running]:
main.funcB(...)
	C:/Users/kk/Desktop/go-code/19-函数.go:9
main.main()
	C:/Users/kk/Desktop/go-code/19-函数.go:16 +0x5b
exit status 2
```

程序运行期间 funcB 中引发了 panic 导致程序崩溃，异常退出了。这个时候我们就可以通过recover 将程序恢复回来，继续往后执行。

```go
package main

import "fmt"

func funcA() {
	fmt.Println("func A")
}
func funcB() {
	defer func() {
		err := recover()
		// 如果程序出出现了 panic 错误,可以通过 recover 恢复过来
		if err != nil {
			fmt.Println("recover in B")
		}
	}()
	panic("panic in B")
}
func funcC() {
	fmt.Println("func C")
}
func main() {
	funcA()
	funcB()
	funcC()
}
```

运行报错信息：

```cmd
func A
panic: panic in B

goroutine 1 [running]:
main.funcB(...)
	C:/Users/kk/Desktop/go-code/19-函数.go:9
main.main()
	C:/Users/kk/Desktop/go-code/19-函数.go:16 +0x5b
exit status 2
PS C:\Users\kk\Desktop\go-code> go run .\19-函数.go
func A
recover in B
func C
```

注意：

1. recover()必须搭配 defer 使用。
2. defer 一定要在可能引发 panic 的语句之前定义。

- defer 、recover 实现异常处理

```go
package main

import "fmt"

func fn2() {
	defer func() {
		err := recover()
		if err != nil {
			fmt.Println("抛出异常给管理员发送邮件")
			fmt.Println(err)
		}
	}()
	num1 := 10
	num2 := 0
	res := num1 / num2
	fmt.Println("res=", res)
}

func main() {
	fn2()
}
```

运行报错信息：

```cmd
抛出异常给管理员发送邮件
runtime error: integer divide by zero
```

- defer 、panic、recover 抛出异常

```go
package main

import (
	"errors"
	"fmt"
)

func readFile(fileName string) error {
	if fileName == "main.go" {
		return nil
	}
	return errors.New("读取文件错误")
}
func fn3() {
	defer func() {
		err := recover()
		if err != nil {
			fmt.Println("抛出异常给管理员发送邮件")
		}
	}()
	var err = readFile("xxx.go")
	if err != nil {
		panic(err)
	}
	fmt.Println("继续执行")
}
func main() {
	fn3()
}
```

输出：

```cmd
抛出异常给管理员发送邮件
```

- 简单示例

panic/recover，程序崩溃与恢复

```go
package main

import "fmt"

func test() {
	defer func() {
		err := recover()

		if err != nil {
			fmt.Println("捕获异常:", err)
		}
	}()

	panic("程序崩溃了")
}

func main() {
	test()
	fmt.Println("程序继续运行")
}
```

error，日常错误处理（最常用）

```go
package main

import (
	"errors"
	"fmt"
)

func divide(a, b int) (int, error) {
	if b == 0 {
		return 0, errors.New("除数不能为0")
	}

	return a / b, nil
}

func main() {
	result, err := divide(10, 0)

	if err != nil {
		fmt.Println("错误:", err)
		return
	}

	fmt.Println(result)
}
```

## 十四、time 包以及日期函数

时间和日期是我们编程中经常会用到的，在 golang 中 time 包提供了时间的显示和测量用的函数。

### time.Now()获取当前时间

我们可以通过 time.Now()函数获取当前的时间对象，然后获取时间对象的年月日时分秒等信息。示例代码如下：

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	now := time.Now() //获取当前时间
	fmt.Printf("current time:%v\n", now)
	year := now.Year()     //年
	month := now.Month()   //月
	day := now.Day()       //日
	hour := now.Hour()     //小时
	minute := now.Minute() //分钟
	second := now.Second() //秒
	fmt.Printf("%d-%02d-%02d %02d:%02d:%02d\n", year, month, day, hour, minute, second)
}
```

注意：%02d 中的 2 表示宽度，如果整数不够 2 列就补上 0。

### Format 方法格式化输出日期字符串

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	now := time.Now()
	// 格式化的模板为 Go 的出生时间 2006 年 1 月 2 号 15 点 04 分Mon Jan
	// 24 小时制
	fmt.Println(now.Format("2006-01-02 15:04:05"))
	// 12 小时制
	fmt.Println(now.Format("2006-01-02 03:04:05"))
	fmt.Println(now.Format("2006/01/02 15:04"))
	fmt.Println(now.Format("15:04 2006/01/02"))
	fmt.Println(now.Format("2006/01/02"))
}
```

### 获取当前的时间戳

时间戳是自 1970 年 1 月 1 日（08:00:00GMT）至当前时间的总毫秒数。它也被称为Unix 时间戳（UnixTimestamp）。

基于时间对象获取时间戳的示例代码如下：

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	now := time.Now()            //获取当前时间
	timestamp1 := now.Unix()     //时间戳
	timestamp2 := now.UnixNano() //纳秒时间戳
	fmt.Printf("current timestamp1:%v\n", timestamp1)
	fmt.Printf("current timestamp2:%v\n", timestamp2)
}
```

### 时间戳转换为日期字符串（年-月-日时:分:秒）

使用 time.Unix()函数可以将时间戳转为时间格式。

```go
package main

import (
	"fmt"
	"time"
)

func unixToTime(timestamp int64) {
	timeObj := time.Unix(timestamp, 0) //将时间戳转为时间格式
	year := timeObj.Year()             //年
	month := timeObj.Month()           //月
	day := timeObj.Day()               //日
	hour := timeObj.Hour()             //小时
	minute := timeObj.Minute()         //分钟
	second := timeObj.Second()         //秒
	fmt.Printf("%d-%02d-%02d %02d:%02d:%02d\n", year, month, day, hour, minute, second)
}
func main() {
	unixToTime(1587880013)
}
```

### now.Format 把时间戳格式化成日期

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	var timestamp int64 = 1587880013             //时间戳
	t := time.Unix(timestamp, 0)                 //日期对象
	fmt.Println(t.Format("2006-01-02 03:04:05")) //日期格式化输出
}
```

### 日期字符串转换成时间戳

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	t1 := "2019-01-08 13:50:30"           //间字符串
	timeTemplate := "2006-01-02 15:04:05" //常规类型
	stamp, _ := time.ParseInLocation(timeTemplate, t1, time.Local)
	fmt.Println(stamp.Unix())
}
```

### 时间间隔

time.Duration 是 time 包定义的一个类型，它代表两个时间点之间经过的时间，以纳秒为单位。time.Duration 表示一段时间间隔，可表示的最长时间段大约 290 年。

time 包中定义的时间间隔类型的常量如下：

```
const (
	Nanosecond  Duration = 1
	Microsecond          = 1000 * Nanosecond
	Millisecond          = 1000 * Microsecond
	Second               = 1000 * Millisecond
	Minute               = 60 * Second
	Hour                 = 60 * Minute
)
```

例如：time.Duration 表示 1 纳秒，time.Second 表示 1 秒。

### 时间操作函数

- Add

我们在日常的编码过程中可能会遇到要求时间+时间间隔的需求，Go 语言的时间对象有提供Add 方法如下：

```go
func (t Time) Add(d Duration) Time
```

举个例子，求一个小时之后的时间：

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	now := time.Now()
	later := now.Add(time.Hour) // 当前时间加 1 小时后的时间
	fmt.Println(now)
	fmt.Println(later)
}
```

- Sub

求两个时间之间的差值：

```go
func (t Time) Sub(u Time) Duration
```

返回一个时间段 t-u。如果结果超出了 Duration 可以表示的最大值/最小值，将返回最大值/ 最小值。要获取时间点 t-d（d 为 Duration），可以使用 t.Add(-d)。

- Equal

```go
func (t Time) Equal(u Time) bool
```

判断两个时间是否相同，会考虑时区的影响，因此不同时区标准的时间也可以正确比较。本方法和用 t==u 不同，这种方法还会比较地点和时区信息。

- Before

```go
func (t Time) Before(u Time) bool
```

如果 t 代表的时间点在 u 之前，返回真；否则返回假。

- After

```go
func (t Time) After(u Time) bool
```

如果 t 代表的时间点在 u 之后，返回真；否则返回假。

### 定时器

使用 time.NewTicker(时间间隔)来设置定时器

```fo
package main

import (
	"fmt"
	"time"
)

func main() {
	ticker := time.NewTicker(time.Second) //定义一个 1 秒间隔的定时器
	n := 0
	for i := range ticker.C {
		fmt.Println(i) //每秒都会执行的任务
		n++
		if n > 5 {
			ticker.Stop()
			return
		}
	}
}
```

time.Sleep(time.Second) 来实现定时器

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	for {
		time.Sleep(time.Second)
		fmt.Println("我在定时执行任务")
	}
}
```

## 十五、指针

通过前面的教程我们知道变量是用来存储数据的，变量的本质是给存储数据的内存地址起了一个好记的别名。比如我们定义了一个变量 a := 10 ,这个时候可以直接通过a 这个变量来读取内存中保存的 10 这个值。在计算机底层 a 这个变量其实对应了一个内存地址。

指针也是一个变量，但它是一种特殊的变量，它存储的数据不是一个普通的值，而是另一个变量的内存地址。

要搞明白 Go 语言中的指针需要先知道 3 个概念：指针地址、指针类型和指针取值。

Go 语言中的指针操作非常简单，我们只需要记住两个符号：&（取地址）和*（根据地址取值）

### 指针地址和指针类型

每个变量在运行时都拥有一个地址，这个地址代表变量在内存中的位置。Go 语言中使用&字符放在变量前面对变量进行取地址操作。 Go 语言中的值类型（int、float、bool、string、array、struct）都有对应的指针类型，如：*int、*int64、*string 等。

取变量指针的语法如下：

```go
ptr := &v // 比如 v 的类型为 T
```

其中：

1. v : 代表被取地址的变量，类型为 T
2. ptr : 用于接收地址的变量，ptr 的类型就为*T，称做 T 的指针类型。*代表指针。

举个例子：

```go
package main

import "fmt"

func main() {
	var a = 10
	var b = &a
	fmt.Printf("a:%d ptr:%p\n", a, &a) // a:10 ptr:0xc0000100a8
	fmt.Printf("b:%v type:%T\n", b, b) // b:0xc0000100a8 type:*int
	fmt.Println("取 b 的地址：", &b)        // 0xc000006028
}
```

### 指针取值

在对普通变量使用&操作符取地址后会获得这个变量的指针，然后可以对指针使用*操作，也就是指针取值，代码如下。

```go
package main

import "fmt"

func main() {
	a := 10
	b := &a // 取变量 a 的地址，将地址保存到指针 b 中
	fmt.Printf("type of b:%T\n", b)
	c := *b // 指针取值（根据指针的值去内存取值）
	fmt.Printf("type of c:%T\n", c)
	fmt.Printf("value of c:%v\n", c)
}
```

输出：

```cmd
type of b:*int
type of c:int
value of c:10
```

总结： 取地址操作符&和取值操作符*是一对互补操作符，&取出地址，*根据地址取出地址指向的值。

变量、指针地址、指针变量、取地址、取值的相互关系和特性如下：

1. 对变量进行取地址（&）操作，可以获得这个变量的指针变量。
2. 指针变量的值是指针地址。
3. 对指针变量进行取值（*）操作，可以获得指针变量指向的原变量的值。

### 指针传值示例

```go
package main

import "fmt"

func modify1(x int) {
	x = 100
}
func modify2(x *int) {
	*x = 100
}
func main() {
	a := 10
	modify1(a)
	fmt.Println(a) // 10
	modify2(&a)
	fmt.Println(a) // 100
}
```

### new 和 make

我们先来看一个例子：

```go
func main() {
var userinfo map[string]string
userinfo["username"] = "张三"
fmt.Println(userinfo)
}
```

```go
func main() {
var a *int *a = 100
fmt.Println(*a)
}
```

执行上面的代码会引发 panic，为什么呢？ 在 Go 语言中对于引用类型的变量，我们在使用的时候不仅要声明它，还要为它分配内存空间，否则我们的值就没办法存储。而对于值类型的声明不需要分配内存空间，是因为它们在声明的时候已经默认分配好了内存空间。要分配内存，就引出来今天的 new 和 make。 Go 语言中 new 和 make 是内建的两个函数，主要用来分配内存。

- new 函数分配内存

new 是一个内置的函数，它的函数签名如下：

```go
func new(Type) *Type
```

其中：

1. Type 表示类型，new 函数只接受一个参数，这个参数是一个类型
2. *Type 表示类型指针，new 函数返回一个指向该类型内存地址的指针。

实际想开发中 new 函数不太常用，使用 new 函数得到的是一个类型的指针，并且该指针对应的值为该类型的零值。举个例子：

```go
package main

import "fmt"

func main() {
	a := new(int)
	b := new(bool)
	fmt.Printf("%T\n", a) // *int
	fmt.Printf("%T\n", b) // *bool
	fmt.Println(*a)       // 0
	fmt.Println(*b)       // false
}
```

本节开始的示例代码中 var a *int 只是声明了一个指针变量 a 但是没有初始化，指针作为引用类型需要初始化后才会拥有内存空间，才可以给它赋值。应该按照如下方式使用内置的

```go
package main

import "fmt"

func main() {
	var a *int
	a = new(int)
	*a = 10
	fmt.Println(*a)
}
```

- make 函数分配内存

make 也是用于内存分配的，区别于 new，它只用于 slice、map 以及channel 的内存创建，而且它返回的类型就是这三个类型本身，而不是他们的指针类型，因为这三种类型就是引用类型，所以就没有必要返回他们的指针了。make 函数的函数签名如下：

```go
func make(t Type, size ...IntegerType) Type
```

make 函数是无可替代的，我们在使用 slice、map 以及 channel 的时候，都需要使用make 进行初始化，然后才可以对它们进行操作。这个我们在前面的教程中都有说明，关于channel 我们会在后续的章节详细说明。

本节开始的示例中 var b map[string]int 只是声明变量 b 是一个 map 类型的变量，需要像下面的示例代码一样使用 make 函数进行初始化操作之后，才能对其进行键值对赋值：

```go
package main

import "fmt"

func main() {
	var userinfo map[string]string
	userinfo = make(map[string]string)
	userinfo["username"] = "张三"
	fmt.Println(userinfo)
}
```

### new 与 make 的区别

1. 二者都是用来做内存分配的。
2. make 只用于 slice、map 以及 channel 的初始化，返回的还是这三个引用类型本身
3. 而 new 用于类型的内存分配，并且内存对应的值为类型零值，返回的是指向类型的指针。

## 十六、结构体

Golang 中没有“类”的概念，Golang 中的结构体和其他语言中的类有点相似。和其他面向对象语言中的类相比，Golang 中的结构体具有更高的扩展性和灵活性。

Golang 中的基础数据类型可以表示一些事物的基本属性，但是当我们想表达一个事物的全部或部分属性时，这时候再用单一的基本数据类型就无法满足需求了，Golang 提供了一种自定义数据类型，可以封装多个基本数据类型，这种数据类型叫结构体，英文名称struct。也就是我们可以通过 struct 来定义自己的类型了。

### Golang type 关键词自定义类型和类型别名

Golang 中通过 type 关键词定义一个结构体，在讲解结构体之前，我们首先给大家看看通过type 自定义类型以及定义类型别名。

- 自定义类型

在 Go 语言中有一些基本的数据类型，如 string、整型、浮点型、布尔等数据类型，Go语言中可以使用 type 关键字来定义自定义类型。

```go
type myInt int
```

上面代码表示：将 myInt 定义为 int 类型，通过 type 关键字的定义，myInt 就是一种新的类型，它具有 int 的特性。

- 类型别名

Golang1.9 版本以后添加的新功能。

类型别名规定：TypeAlias 只是 Type 的别名，本质上 TypeAlias 与 Type 是同一个类型。就像一个孩子小时候有大名、小名、英文名，但这些名字都指的是他本人。

```go
type TypeAlias = Type
```

我们之前见过的 rune 和 byte 就是类型别名，他们的底层定义如下：

```go
type byte = uint8
type rune = int32
```

- 自定义类型和类型别名的区别

类型别名与自定义类型表面上看只有一个等号的差异，我们通过下面的这段代码来理解它们之间的区别。

```go
package main

import "fmt"

// 类型定义
type newInt int

// 类型别名
type myInt = int

func main() {
	var a newInt
	var b myInt
	fmt.Printf("type of a:%T\n", a) //type of a:main.newInt
	fmt.Printf("type of b:%T\n", b) //type of b:int
}
```

输出：

```cmd
type of a:main.newInt
type of b:int
```

结果显示 a 的类型是 main.newInt，表示 main 包下定义的 newInt 类型。b 的类型是int 类型。

### 结构体定义

使用 type 和 struct 关键字来定义结构体，具体代码格式如下：

```go
type 类型名 struct {
字段名 字段类型
字段名 字段类型
…
}
```

其中：

1. 类型名：表示自定义结构体的名称，在同一个包内不能重复。
2. 字段名：表示结构体字段名。结构体中的字段名必须唯一。
3. 字段类型：表示结构体字段的具体类型。

举个例子，我们定义一个 person（人）结构体，代码如下：

```go
type person struct {
name string
city string
age int8
}
```

同样类型的字段也可以写在一行，

```go
type person struct {
name, city string
age int8
}
```

注意：结构体首字母可以大写也可以小写，大写表示这个结构体是公有的，在其他的包里面可以使用。小写表示这个结构体是私有的，只有这个包里面才能使用。

### 初始化的几种方法

- 结构体实例化（第一种方法）

只有当结构体实例化时，才会真正地分配内存。也就是必须实例化后才能使用结构体的字段。结构体本身也是一种类型，我们可以像声明内置类型一样使用 var 关键字声明结构体类型。

```go
var 结构体实例 结构体类型
```

```go
package main

import "fmt"

type person struct {
	name string
	city string
	age  int
}

func main() {
	var p1 person
	p1.name = "张三"
	p1.city = "北京"
	p1.age = 18
	fmt.Printf("p1=%v\n", p1)  //p1={张三 北京 18}
	fmt.Printf("p1=%#v\n", p1) //p1=main.person{name:"张三", city:"北京", age:18}
}
```

- 结构体实例化（第二种方法）

我们还可以通过使用 new 关键字对结构体进行实例化，得到的是结构体的地址。格式如下：

```go
package main

import "fmt"

type person struct {
	name string
	city string
	age  int
}

func main() {
	var p2 = new(person)
	p2.name = "张三"
	p2.age = 20
	p2.city = "北京"
	fmt.Printf("%T\n", p2)     //*main.person
	fmt.Printf("p2=%#v\n", p2) //p2=&main.person{name:"张三", city:"北京", age:20}
}
```

从打印的结果中我们可以看出 p2 是一个结构体指针。

注意：在 Golang 中支持对结构体指针直接使用.来访问结构体的成员。p2.name = "张三" 其实在底层是(*p2).name = "张三"

- 结构体实例化（第三种方法）

使用&对结构体进行取地址操作相当于对该结构体类型进行了一次 new 实例化操作。

```go
package main

import "fmt"

type person struct {
	name string
	city string
	age  int
}

func main() {
	p3 := &person{}
	fmt.Printf("%T\n", p3)     //*main.person
	fmt.Printf("p3=%#v\n", p3) //p3=&main.person{name:"", city:"", age:0}
	p3.name = "zhangsan"
	p3.age = 30
	p3.city = "深圳"
	(*p3).age = 40             //这样也是可以的
	fmt.Printf("p3=%#v\n", p3) //p3=&main.person{name:"zhangsan", city:"深圳", age:30}
}
```

- 结构体实例化（第四种方法） 键值对初始化

```go
package main

import "fmt"

type person struct {
	name string
	city string
	age  int
}

func main() {
	p4 := person{
		name: "zhangsan", city: "北京", age: 18}
	fmt.Printf("p4=%#v\n", p4) //p4=main.person{name:"zhangsan", city:"北京", age:18}
}
```

注意：最后一个属性的,要加上

- 结构体实例化（第五种方法） 结构体指针进行键值对初始化

```go
package main

import "fmt"

type person struct {
	name string
	city string
	age  int
}

func main() {
	p5 := &person{
		name: "zhangsan", city: "上海", age: 28}
	fmt.Printf("p5=%#v\n", p5) //p5=&main.person{name:"zhangsan", city:"上海", age:28}
}
```

当某些字段没有初始值的时候，这个字段可以不写。此时，没有指定初始值的字段的

```go
package main

import "fmt"

type person struct {
	name string
	city string
	age  int
}

func main() {
	p6 := &person{
		city: "北京"}
	fmt.Printf("p6=%#v\n", p6) //p6=&main.person{name:"", city:"北京", age:0}
}
```

- 结构体实例化（第六种方法） 使用值的列表初始化

```go
package main

import "fmt"

type person struct {
	name string
	city string
	age  int
}

func main() {
	// 初始化结构体的时候可以简写，也就是初始化的时候不写键，直接写值：
	p7 := &person{
		"zhangsan",
		"北京", 28,
	}
	fmt.Printf("p7=%#v\n", p7) //p7=&main.person{name:"zhangsan", city:"北京", age:28}
}
```

使用这种格式初始化时，需要注意：

1. 必须初始化结构体的所有字段。
2. 初始值的填充顺序必须与字段在结构体中的声明顺序一致。
3. 该方式不能和键值初始化方式混用。

### 结构体方法和接收者

在 go 语言中，没有类的概念但是可以给类型（结构体，自定义类型）定义方法。所谓方法就是定义了接收者的函数。接收者的概念就类似于其他语言中的 this 或者self。

方法的定义格式如下：

```go
func (接收者变量 接收者类型) 方法名(参数列表) (返回参数) {
函数体
}
```

其中：

1. 接收者变量：接收者中的参数变量名在命名时，官方建议使用接收者类型名的第一个小写字母，而不是 self、this 之类的命名。例如，Person 类型的接收者变量应该命名为p，Connector 类型的接收者变量应该命名为 c 等。
2. 接收者类型：接收者类型和参数类似，可以是指针类型和非指针类型。
3. 方法名、参数列表、返回参数：具体格式与函数定义相同。

实例 1：给结构体 Person 定义一个方法打印 Person 的信息

```go
package main

import "fmt"

type Person struct {
	name string
	age  int8
}

func (p Person) printInfo() {
	fmt.Printf("姓名:%v 年龄:%v", p.name, p.age)
}
func main() {
	p1 := Person{
		name: "小王子", age: 25}
	p1.printInfo()
}
```

- 值类型的接收者

当方法作用于值类型接收者时，Go 语言会在代码运行时将接收者的值复制一份。在值类型接收者的方法中可以获取接收者的成员值，但修改操作只是针对副本，无法修改接收者变量本身。

- 指针类型的接收者

指针类型的接收者由一个结构体的指针组成，由于指针的特性，调用方法时修改接收者指针的任意成员变量，在方法结束后，修改都是有效的。这种方式就十分接近于其他语言中面向对象中的 this 或者 self。

```go
package main

import "fmt"

type Person struct {
	name string
	age  int
}

// 值类型接受者
func (p Person) printInfo() {
	fmt.Printf("姓名:%v 年龄:%v\n", p.name, p.age)
}

// 指针类型接收者
func (p *Person) setInfo(name string, age int) {
	p.name = name
	p.age = age
}
func main() {
	p1 := Person{
		name: "小王子", age: 25}
	p1.printInfo()
	p1.setInfo("张三", 20)
	p1.printInfo()
}
```

### 给任意类型添加方法

在 Go 语言中，接收者的类型可以是任何类型，不仅仅是结构体，任何类型都可以拥有方法。举个例子，我们基于内置的 int 类型使用 type 关键字可以定义新的自定义类型，然后为我们的自定义类型添加方法。

```go
package main

import "fmt"

type myInt int

func (m myInt) SayHello() {
	fmt.Println("Hello, 我是一个 int。")
}
func main() {
	var m1 myInt
	m1.SayHello() //Hello, 我是一个 int。
	m1 = 100
	fmt.Printf("%#v %T\n", m1, m1) //100 main.MyInt
}
```

注意事项： 非本地类型不能定义方法，也就是说我们不能给别的包的类型定义方法。

### 结构体的匿名字段

结构体允许其成员字段在声明时没有字段名而只有类型，这种没有名字的字段就称为匿名字段。

```go
package main

import "fmt"

// Person 结构体 Person 类型
type Person struct {
	string
	int
}

func main() {
	p1 := Person{"小王子", 18}
	fmt.Printf("%#v\n", p1)        //main.Person{string:"北京", int:18}
	fmt.Println(p1.string, p1.int) //北京 18
}
```

匿名字段默认采用类型名作为字段名，结构体要求字段名称必须唯一，因此一个结构体中同种类型的匿名字段只能有一个。

### 嵌套结构体

一个结构体中可以嵌套包含另一个结构体或结构体指针。

```go
package main

import "fmt"

// Address 地址结构体
type Address struct {
	Province string
	City     string
}

// User 用户结构体
type User struct {
	Name    string
	Gender  string
	Address Address
}

func main() {
	user1 := User{
		Name:   "张三",
		Gender: "男", Address: Address{
			Province: "广东", City: "深圳"}}
	fmt.Printf("user1=%#v\n", user1) //user1=main.User{Name:" 张三", Gender:" 男", Address:main.Address{Province:"广东", City:"深圳"}}
}
```

### 嵌套匿名结构体

```go
package main

import "fmt"

// Address 地址结构体
type Address struct {
	Province string
	City     string
}

// User 用户结构体
type User struct {
	Name    string
	Gender  string
	Address //匿名结构体
}

func main() {
	var user2 User
	user2.Name = "张三"
	user2.Gender = "男"
	user2.Address.Province = "广东" //通过匿名结构体.字段名访问user2.City = "深圳" //直接访问匿名结构体的字段名fmt.Printf("user2=%#v\n", user2) //user2=main.User{Name:" 张三", Gender:" 男", Address:main.Address{Province:"广东", City:"深圳"}}
	fmt.Println(user2)
}
```

注意：当访问结构体成员时会先在结构体中查找该字段，找不到再去匿名结构体中查找。

### 关于嵌套结构体的字段名冲突

嵌套结构体内部可能存在相同的字段名。这个时候为了避免歧义需要指定具体的内嵌结构体的字段。

```go
package main

import "fmt"

// Address 地址结构体
type Address struct {
	Province   string
	City       string
	CreateTime string
}

// Email 邮箱结构体
type Email struct {
	Account    string
	CreateTime string
}

// User 用户结构体
type User struct {
	Name   string
	Gender string
	Address
	Email
}

func main() {
	var user3 User
	user3.Name = "张三"
	user3.Gender = "男"
	// user3.CreateTime = "2020" // ambiguous selector user3.CreateTime
	user3.Address.CreateTime = "2020" //指定 Address 结构体中的 CreateTime
	user3.Email.CreateTime = "2021"   //指定 Email 结构体中的 CreateTime
	fmt.Println(user3)
}
```

### 结构体的继承

Go 语言中使用结构体也可以实现其他编程语言中的继承。

```go
package main

import "fmt"

// Animal 动物
type Animal struct {
	name string
}

func (a *Animal) run() {
	fmt.Printf("%s 会运动！\n", a.name)
}

// Dog 狗
type Dog struct {
	Age     int8
	*Animal //通过嵌套匿名结构体实现继承
}

func (d *Dog) wang() {
	fmt.Printf("%s 会汪汪汪~\n", d.name)
}
func main() {
	d1 := &Dog{
		Age: 4, Animal: &Animal{ //注意嵌套的是结构体指针
			name: "阿奇"}}
	d1.wang() //乐乐会汪汪汪~ d1.run() //乐乐会动！
}
```

## 十七、结构体与 JSON 序列化

JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式。易于人阅读和编写。同时也易于机器解析和生成。RESTfull Api 接口中返回的数据都是 json 数据。

Json 的基本格式如下：

```json
{
"a": "Hello",
"b": "World"
}
```

稍微复杂点的 JSON

```json
{
  "result": [
    {
      "_id": "59f6ef443ce1fb0fb02c7a43",
      "title": "笔记本电脑",
      "status": "1",
      "pic": "public\\upload\\UObZahqPYzFvx_C9CQjU8KiX.png",
      "url": "12"
    },
    {
      "_id": "5a012efb93ec4d199c18d1b4",
      "title": "第二个轮播图",
      "status": "1",
      "pic": "public\\upload\\f3OtH11ZaPX5AA4Ov95Q7DEM.png"
    },
    {
      "_id": "5a012f2433574208841e0820",
      "title": "第三个轮播图",
      "status": "1",
      "pic": "public\\upload\\s5ujmYBQVRcLuvBHvWFMJHzS.jpg"
    },
    {
      "_id": "5a688a0ca6dcba0ff4861a3d",
      "title": "教程",
      "status": "1",
      "pic": "public\\upload\\Zh8EP9HOasV28ynDSp8TaGwd.png"
    }
  ]
}
```

### 结构体与 JSON 序列化

比如我们 Golang 要给 App 或者小程序提供 Api 接口数据，这个时候就需要涉及到结构体和Json 之间的相互转换

Golang JSON 序列化是指把结构体数据转化成 JSON 格式的字符串，Golang JSON 的反序列化是指把 JSON 数据转化成 Golang 中的结构体对象

Golang 中 的 序 列 化 和 反 序 列 化 主 要 通 过 "encoding/json" 包中的json.Marshal() 和 json.Unmarshal()方法实现

- 结构体对象转化成 Json 字符串

```go
package main

import (
	"encoding/json"
	"fmt"
)

type Student struct {
	ID     int
	Gender string
	name   string //私有属性不能被 json 包访问
	Sno    string
}

func main() {
	var s1 = Student{
		ID:     1,
		Gender: "男",
		Name:   "李四",
		Sno:    "s0001"}
	fmt.Printf("%#v\n", s1)
	var s, _ = json.Marshal(s1)
	jsonStr := string(s)
	fmt.Println(jsonStr)
}
```

运行报错信息：

```cmd
# command-line-arguments
.\23-结构体与json序列化.go:19:3: unknown field Name in struct literal of type Student, but does have name
```

- Json 字符串转换成结构体对象

```go
package main

import (
	"encoding/json"
	"fmt"
)

type Student struct {
	ID     int
	Gender string
	Name   string
	Sno    string
}

func main() {
	// var jsonStr = "{\"ID\":1,\"Gender\":\"男\",\"Name\":\"李四\",\"Sno\":\"s0001\"}"
	var jsonStr = `{"ID":1,"Gender":"男","Name":"李四","Sno":"s0001"}` //定义一个 Monster 实例
	var student Student
	err := json.Unmarshal([]byte(jsonStr), &student)
	if err != nil {
		fmt.Printf("unmarshal err=%v\n", err)
	}
	fmt.Printf("反序列化后 student=%#v student.Name=%v \n", student, student.Name)
}
```

### 结构体标签 Tag

Tag 是结构体的元信息，可以在运行的时候通过反射的机制读取出来。Tag 在结构体字段的后方定义，由一对反引号包裹起来，具体的格式如下：

```go
`key1:"value1" key2:"value2"`
```

结构体 tag 由一个或多个键值对组成。键与值使用冒号分隔，值用双引号括起来。同一个结构体字段可以设置多个键值对 tag，不同的键值对之间使用空格分隔。

注意事项： 为结构体编写 Tag 时，必须严格遵守键值对的规则。结构体标签的解析代码的容错能力很差，一旦格式写错，编译和运行时都不会提示任何错误，通过反射也无法正确取值。例如不要在 key 和 value 之间添加空格。

```go
package main

import (
	"encoding/json"
	"fmt"
)

type Student struct {
	ID     int    `json:"id"` //通过指定 tag 实现 json 序列化该字段时的key
	Gender string `json:"gender"`
	Name   string
	Sno    string
}

func main() {
	var s1 = Student{
		ID: 1, Gender: "男", Name: "李四", Sno: "s0001"}
	fmt.Printf("%#v\n", s1)
	var s, _ = json.Marshal(s1)
	jsonStr := string(s)
```

输出：

```cmd
main.Student{ID:1, Gender:"男", Name:"李四", Sno:"s0001"}
{"id":1,"gender":"男","Name":"李四","Sno":"s0001"}
```

```go
package main

import (
	"encoding/json"
	"fmt"
)

type Student struct {
	ID     int    `json:"id"` //通过指定 tag 实现 json 序列化该字段时的key
	Gender string `json:"gender"`
	Name   string
	Sno    string
}

func main() {
	var s2 Student
	var str = "{\"id\":1,\"gender\":\"男\",\"Name\":\"李四\",\"Sno\":\"s0001\"}"
	err := json.Unmarshal([]byte(str), &s2)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Printf("%#v", s2)
}
```

输出：

```go
main.Student{ID:1, Gender:"男", Name:"李四", Sno:"s0001"}
```

### 嵌套结构体和 JSON 序列化反序列化

```go
package main

import (
	"encoding/json"
	"fmt"
)

// Student 学生
type Student struct {
	ID     int
	Gender string
	Name   string
}

// Class 班级
type Class struct {
	Title    string
	Students []Student
}

func main() {
	c := &Class{
		Title: "001", Students: make([]Student, 0, 200)}
	for i := 0; i < 10; i++ {
		stu := Student{
			Name: fmt.Sprintf("stu%02d", i), Gender: "男", ID: i}
		c.Students = append(c.Students, stu)
	}
	// JSON 序列化：结构体-->JSON 格式的字符串
	data, err := json.Marshal(c)
	if err != nil {
		fmt.Println("json marshal failed")
		return
	}
	fmt.Printf("json:%s\n", data)
}
```

输出：

```cmd
json:{"Title":"001","Students":[{"ID":0,"Gender":"男","Name":"stu00"},{"ID":1,"Gender":"男","Name":"stu01"},{"ID":2,"Gender":"男","Name":"stu02"},{"ID":3,"Gender":"男","Name":"stu03"},{"ID":4,"Gender":"男","Name":"stu04"},{"ID":5,"Gender":"男","Name":"stu05"},{"ID":6,"Gender":"男","Name":"stu06"},{"ID":7,"Gender":"男","Name":"stu07"},{"ID":8,"Gender":"男","Name":"stu08"},{"ID":9,"Gender":"男","Name":"stu09"}]}
```

```go
package main

import (
	"encoding/json"
	"fmt"
)

// Student 学生
type Student struct {
	ID     int
	Gender string
	Name   string
}

// Class 班级
type Class struct {
	Title    string
	Students []Student
}

func main() {
	str := `{"Title":"001","Students":[{"ID":0,"Gender":" 男 ","Name":"stu00"},{"ID":1,"Gender":" 男 ","Name":"stu01"},{"ID":2,"Gender":" 男 ","Name":"stu02"},{"ID":3,"Gender":" 男","Name":"stu03"},{"ID":4,"Gender":" 男 ","Name":"stu04"},{"ID":5,"Gender":" 男","Name":"stu05"},{"ID":6,"Gender":" 男 ","Name":"stu06"},{"ID":7,"Gender":" 男","Name":"stu07"},{"ID":8,"Gender":" 男 ","Name":"stu08"},{"ID":9,"Gender":" 男","Name":"stu09"}]}`
	c1 := &Class{}
	err := json.Unmarshal([]byte(str), c1)
	if err != nil {
		fmt.Println("json unmarshal failed!")
		return
	}
	fmt.Printf("%#v\n", c1)
```

输出：

```cmd
&main.Class{Title:"001", Students:[]main.Student{main.Student{ID:0, Gender:" 男 ", Name:"stu00"}, main.Student{ID:1, Gender:" 男 ", Name:"stu01"}, main.Student{ID:2, Gender:" 男 ", Name:"stu02"}, main.Student{ID:3, Gender:" 男", Name:"stu03"}, main.Student{ID:4, Gender:" 男 ", Name:"stu04"}, main.Student{ID:5, Gender:" 男", Name:"stu05"}, main.Student{ID:6, Gender:" 男 ", Name:"stu06"}, main.Student{ID:7, Gender:" 男", Name:"stu07"}, main.Student{ID:8, Gender:" 男 ", Name:"stu08"}, main.Student{ID:9, Gender:" 男", Name:"stu09"}}}
```

### 关于 Map、切片的序列化反序列化

Map 和切片也可以进行序列化和反序列化，这个我们讲完接口后再去给大家详细讲解

## 十八、Go mod 以及 Golang 包详解

### Golang 中包的介绍和定义

包（package）是多个 Go 源码的集合，是一种高级的代码复用方案，Go 语言为我们提供了很多内置包，如 fmt、strconv、strings、sort、errors、time、encoding/json、os、io 等。

Golang 中的包可以分为三种：1、系统内置包 2、自定义包 3、第三方包

系统内置包: Golang 语言给我们提供的内置包，引入后可以直接使用，如fmt、strconv、strings、sort、errors、time、encoding/json、os、io 等。

自定义包：开发者自己写的包

第三方包：属于自定义包的一种，需要下载安装到本地后才可以使用，如前面给大家介绍的"github.com/shopspring/decimal"包解决 float 精度丢失问题。

### Golang 包管理工具 go mod

在 Golang1.11 版本之前如果我们要自定义包的话必须把项目放在 GOPATH 目录。Go1.11 版本之后无需手动配置环境变量，使用 go mod 管理项目，也不需要非得把项目放到GOPATH指定目录下，你可以在你磁盘的任何位置新建一个项目 , Go1.13 以后可以彻底不要GOPATH 了。

- go mod init 初始化项目

实际项目开发中我们首先要在我们项目目录中用 go mod 命令生成一个go.mod 文件管理我们项目的依赖。

比如我们的 golang 项目文件要放在了 itying 这个文件夹，这个时候我们需要在itying 文件夹里面使用 go mod 命令生成一个 go.mod 文件

```cmd
PS C:\Users\kk\Desktop\go-code\itying> go mod init itying
go: creating new go.mod: module itying
```

- go mod 其他命令

```cmd
PS C:\Users\kk\Desktop\go-code\itying> go mod
Go mod provides access to operations on modules.

Note that support for modules is built into all the go commands,
not just 'go mod'. For example, day-to-day adding, removing, upgrading,
and downgrading of dependencies should be done using 'go get'.
See 'go help modules' for an overview of module functionality.

Usage:

	go mod <command> [arguments]

The commands are:

	download    download modules to local cache
	edit        edit go.mod from tools or scripts
	graph       print module requirement graph
	init        initialize new module in current directory
	tidy        add missing and remove unused modules
	vendor      make vendored copy of dependencies
	verify      verify dependencies have expected content
	why         explain why packages or modules are needed

Use "go help mod <command>" for more information about a command.
```

download download modules to local cache (下载依赖的 module 到本地cache))

edit edit go.mod from tools or scripts (编辑 go.mod 文件)

graph print module requirement graph (打印模块依赖图))

init initialize new module in current directory (再当前文件夹下初始化一个新的module, 创建 go.mod 文件))

tidy add missing and remove unused modules (增加丢失的module，去掉未用的module)

vendor make vendored copy of dependencies (将依赖复制到 vendor 下)

verify verify dependencies have expected content (校验依赖 检查下载的第三方库有没有本地修改，如果有修改，则会返回非 0，否则验证成功。)

why explain why packages or modules are needed (解释为什么需要依赖)

### Golang 中自定义包

包（package）是多个 Go 源码的集合，一个包可以简单理解为一个存放多个.go 文件的文件夹。该文件夹下面的所有 go 文件都要在代码的第一行添加如下代码，声明该文件归属的包。

```go
package 包名
```

注意事项：

1. 一个文件夹下面直接包含的文件只能归属一个 package，同样一个package 的文件不能在多个文件夹下。
2. 包名可以不和文件夹的名字一样，包名不能包含 - 符号。
3. 包名为 main 的包为应用程序的入口包，这种包编译后会得到一个可执行文件，而编译不包含 main 包的源代码则不会得到可执行文件。

- 定义一个包

如果想在一个包中引用另外一个包里的标识符（如变量、常量、类型、函数等）时，该标识符必须是对外可见的（public）。在 Go 语言中只需要将标识符的首字母大写就可以让标识符对外可见了。

定义一个包名为 calc 的包，代码如下：

```go
package calc

// 首字母大小表示公有，首字母小写表示私有
var a = 100  //私有变量
var Age = 20 //公有变量
func Add(x, y int) int {
	return x + y
}
func Sum(x, y int) int {
	return x - y
}
```

main.go 中引入这个包

访问一个包里面的公有属性方法的时候需要通过包名称.去访问

```go
package main

import (
	"fmt"
	"itying/calc"
)

func main() {
	c := calc.Add(10, 20)
	fmt.Println(c)
}
```

- 导入一个包

`单行导入`

单行导入的格式如下：

```go
import "包 1"
import "包 2"
```

`多行导入`

多行导入的格式如下：

```go
import ( "包 1"
"包 2"
)
```

`匿名导入包`

如果只希望导入包，而不使用包内部的数据时，可以使用匿名导入包。具体的格式如下：

```go
import _ "包的路径"
```

匿名导入的包与其他方式导入的包一样都会被编译到可执行文件中。

`自定义包名`

在导入包名的时候，我们还可以为导入的包设置别名。通常用于导入的包名太长或者导入的包名冲突的情况。具体语法格式如下：

```go
import 别名 "包的路径"
```

单行引入定义别名：

```go
import c "itying/calc"
```

多行引入定义别名：

```go
import ( "fmt" c "itying/calc"
)
```

### Golang 中 init()初始化函数

在 Go 语言程序执行时导入包语句会自动触发包内部 init()函数的调用。需要注意的是：init() 函数没有参数也没有返回值。 init()函数在程序运行时自动被调用执行，不能在代码中主动调用它。

- init()函数执行顺序

Go 语言包会从 main 包开始检查其导入的所有包，每个包中又可能导入了其他的包。Go编译器由此构建出一个树状的包引用关系，再根据引用顺序决定编译顺序，依次编译这些包的代码。 

在运行时，被最后导入的包会最先初始化并调用其 init()函数。

### Golang 中使用第三方包

我们可以在 https://pkg.go.dev/ 查找看常见的 golang 第三方包

- 初始化项目

```cmd
go mod init 项目名
```

- 下载安装这个包（非必须）

比如前面给大家演示的解决 float 精度损失的包 decimal

[https://github.com/shopspring/decimal](https://github.com/shopspring/decimal)

提示：此命令需要 cd 到项目里面执行

```cmd
go get github.com/shopspring/decimal
```

- 看文档使用这个包

包安装完毕后我们就可以看文档使用这个包了，引入包以后可以使用go mod tidy 增加丢失的 module 去掉未用的 module

- go mod tidy 下载丢失的包（推荐）

go mod tidy 增加丢失的 module 去掉未用的 module

```cmd
go mod tidy
```

## 十九、接口

Golang 中的接口是一种抽象数据类型，Golang 中接口定义了对象的行为规范，只定义规范不实现。接口中定义的规范由具体的对象来实现。

通俗的讲接口就一个标准，它是对一个对象的行为和规范进行约定，约定实现接口的对象必须得按照接口的规范。

### Golang 接口的定义

在 Golang 中接口（interface）是一种类型，一种抽象的类型。接口（interface）是一组函数 method 的集合，Golang 中的接口不能包含任何变量。

在 Golang 中接口中的所有方法都没有方法体，接口定义了一个对象的行为规范，只定义规范不实现。接口体现了程序设计的多态和高内聚低耦合的思想

Golang 中的接口也是一种数据类型，不需要显示实现。只需要一个变量含有接口类型中的所有方法，那么这个变量就实现了这个接口。

Golang 中每个接口由数个方法组成，接口的定义格式如下：

```go
type 接口名 interface{
方法名 1( 参数列表 1 ) 返回值列表 1
方法名 2( 参数列表 2 ) 返回值列表 2 …
}
```

其中：

1. 接口名：使用 type 将接口定义为自定义的类型名。Go 语言的接口在命名时，一般会在单词后面添加 er，如有写操作的接口叫 Writer，有字符串功能的接口叫Stringer 等。接口名最好要能突出该接口的类型含义。
2. 方法名：当方法名首字母是大写且这个接口类型名首字母也是大写时，这个方法可以被接口所在的包（package）之外的代码访问。
3. 参数列表、返回值列表：参数列表和返回值列表中的参数变量名可以省略。

演示：定义一个 Usber 接口让 Phone 和 Camera 结构体实现这个接口

```go
package main

import "fmt"

type Usber interface {
	Start()
	Stop()
}
type Phone struct {
	Name string
}

func (p Phone) Start() {
	fmt.Println(p.Name, "开始工作")
}
func (p Phone) Stop() {
	fmt.Println("phone 停止")
}

type Camera struct {
}

func (c Camera) Start() {
	fmt.Println("相机 开始工作")
}
func (c Camera) Stop() {
	fmt.Println("相机 停止工作")
}
func main() {
	phone := Phone{
		Name: "小米手机"}
	var p Usber = phone //phone 实现了 Usber 接口
	p.Start()
	camera := Camera{}
	var c Usber = camera //camera 实现了 Usber 接口
	c.Start()
}
```

演示：Computer 结构体中的 Work 方法必须传入一个 Usb 的接口

```go
package main

import "fmt"

type Usber interface {
	Start()
	Stop()
}
type Phone struct {
	Name string
}

func (p Phone) Start() {
	fmt.Println(p.Name, "开始工作")
}
func (p Phone) Stop() {
	fmt.Println("phone 停止")
}

type Camera struct {
}

func (c Camera) Start() {
	fmt.Println("相机 开始工作")
}
func (c Camera) Stop() {
	fmt.Println("相机 停止工作")
}

// 电脑的结构体
type Computer struct {
	Name string
}

// 电脑的 Work 方法要求必须传入 Usber 接口类型数据
func (c Computer) Work(usb Usber) {
	usb.Start()
	usb.Stop()
}
func main() {
	phone := Phone{
		Name: "小米手机"}
	camera := Camera{}
	computer := Computer{}
	// 把手机插入电脑的 Usber 接口开始工作
	computer.Work(phone)
	// 把相机插入电脑的 Usber 接口开始工作
	computer.Work(camera)
}
```

### 空接口

Golang 中的接口可以不定义任何方法，没有定义任何方法的接口就是空接口。空接口表示没有任何约束，因此任何类型变量都可以实现空接口。

空接口在实际项目中用的是非常多的，用空接口可以表示任意数据类型。

案例：

```go
package main

import "fmt"

func main() {
	// 定义一个空接口 x, x 变量可以接收任意的数据类型
	var x interface{}
	s := "你好 golang"
	x = s
	fmt.Printf("type:%T value:%v\n", x, x)
	i := 100
	x = i
	fmt.Printf("type:%T value:%v\n", x, x)
	b := true
	x = b
	fmt.Printf("type:%T value:%v\n", x, x)
}
```

- 空接口作为函数的参数

使用空接口实现可以接收任意类型的函数参数。

```go
// 空接口作为函数参数
func show(a interface{}) {
fmt.Printf("type:%T value:%v\n", a, a)
}
```

- map 的值实现空接口

使用空接口实现可以保存任意值的字典。

```go
// 空接口作为 map 值
var studentInfo = make(map[string]interface{})
studentInfo["name"] = "张三"
studentInfo["age"] = 18
studentInfo["married"] = false
fmt.Println(studentInfo)
```

- 切片实现空接口

```go
var slice = []interface{}{"张三", 20, true, 32.2}
fmt.Println(slice)
```

### 类型断言

一个接口的值（简称接口值）是由一个具体类型和具体类型的值两部分组成的。这两部分分别称为接口的动态类型和动态值。

如果我们想要判断空接口中值的类型，那么这个时候就可以使用类型断言，其语法格式：

```go
x.(T)
```

其中：

1. x : 表示类型为 interface{}的变量
2. T : 表示断言 x 可能是的类型

该语法返回两个参数，第一个参数是 x 转化为 T 类型后的变量，第二个值是一个布尔值，若 为 true 则表示断言成功，为 false 则表示断言失败。

举个例子：

```go
package main

import "fmt"

func main() {
	var x interface{}
	x = "Hello golnag"
	v, ok := x.(string)
	if ok {
		fmt.Println(v)
	} else {
		fmt.Println("类型断言失败")
	}
}
```

上面的示例中如果要断言多次就需要写多个 if 判断，这个时候我们可以使用switch 语句来实现：

注意：类型.(type)只能结合 switch 语句使用

```go
package main

import "fmt"

func justifyType(x interface{}) {
	switch v := x.(type) {
	case string:
		fmt.Printf("x is a string，value is %v\n", v)
	case int:
		fmt.Printf("x is a int is %v\n", v)
	case bool:
		fmt.Printf("x is a bool is %v\n", v)
	default:
		fmt.Println("unsupport type！")
	}
}

func main() {
	var x interface{}
	x = "Hello golnag"
	justifyType(x)
```

因为空接口可以存储任意类型值的特点，所以空接口在 Go 语言中的使用十分广泛。

关于接口需要注意的是：只有当有两个或两个以上的具体类型必须以相同的方式进行处理时才需要定义接口。不要为了接口而写接口，那样只会增加不必要的抽象，导致不必要的运行时损耗。

### 结构体值接收者和指针接收者实现接口的区别

值接收者：

如果结构体中的方法是值接收者，那么实例化后的结构体值类型和结构体指针类型都可以赋值给接口变量

```go
package main

import "fmt"

type Usb interface {
	Start()
	Stop()
}
type Phone struct {
	Name string
}

func (p Phone) Start() {
	fmt.Println(p.Name, "开始工作")
}
func (p Phone) Stop() {
	fmt.Println("phone 停止")
}
func main() {
	phone1 := Phone{
		Name: "小米手机"}
	var p1 Usb = phone1 //phone1 实现了 Usb 接口 phone1 是 Phone 类型
	p1.Start()          //小米手机 开始工作
	phone2 := &Phone{
		Name: "苹果手机"}
	var p2 Usb = phone2 //phone2 实现了 Usb 接口 phone2 是 *Phone 类型
	p2.Start()          //苹果手机 开始工作
}
```

指针接收者：

如果结构体中的方法是指针接收者，那么实例化后结构体指针类型都可以赋值给接口变量，结构体值类型没法赋值给接口变量。

```go
package main

import "fmt"

type Usb interface {
	Start()
	Stop()
}
type Phone struct {
	Name string
}

func (p *Phone) Start() {
	fmt.Println(p.Name, "开始工作")
}
func (p *Phone) Stop() {
	fmt.Println("phone 停止")
}
func main() {
	/* 错误写法
	   phone1 := Phone{
	   Name: "小米手机", }
	   var p1 Usb = phone1
	   p1.Start() */
	//正确写法
	phone2 := &Phone{
		Name: "苹果手机"}
	var p2 Usb = phone2 //phone2 实现了 Usb 接口 phone2 是 *Phone 类型
	p2.Start()          //苹果手机 开始工作
```

### 一个结构体实现多个接口

Golang 中一个结构体也可以实现多个接口

```go
package main

import "fmt"

type AInterface interface {
	GetInfo() string
}
type BInterface interface {
	SetInfo(string, int)
}
type People struct {
	Name string
	Age  int
}

func (p People) GetInfo() string {
	return fmt.Sprintf("姓名:%v 年龄:%d", p.Name, p.Age)
}
func (p *People) SetInfo(name string, age int) {
	p.Name = name
	p.Age = age
}
func main() {
	var people = &People{
		Name: "张三", Age: 20}
	// people 实现了 AInterface 和 BInterface
	var p1 AInterface = people
	var p2 BInterface = people
	fmt.Println(p1.GetInfo())
	p2.SetInfo("李四", 30)
	fmt.Println(p1.GetInfo())
}
```

### 接口嵌套

接口与接口间可以通过嵌套创造出新的接口。

```go
package main

import "fmt"

type SayInterface interface {
	say()
}
type MoveInterface interface {
	move()
}

// 接口嵌套
type Animal interface {
	SayInterface
	MoveInterface
}
type Cat struct {
	name string
}

func (c Cat) say() {
	fmt.Println("喵喵喵")
}
func (c Cat) move() {
	fmt.Println("猫会动")
}
func main() {
	var x Animal
	x = Cat{name: "花花"}
	x.move()
	x.say()
}
```

## 二十、goroutine channel 实现并发和并行

### 为什么要使用 goroutine

需求：要统计 1-10000000 的数字中那些是素数，并打印这些素数？

素数：就是除了 1 和它本身不能被其他数整除的数

实现方法：

1. 传统方法，通过一个 for 循环判断各个数是不是素数
2. 使用并发或者并行的方式，将统计素数的任务分配给多个 goroutine 去完成，这个时候就用到了 goroutine
3. goroutine 结合 channel

### 进程、线程以及并行、并发

- 关于进程和线程
