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
| <=     | 检查左边值是否小于等于右边值，如果是返回 True 否则返回 False。 |

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
