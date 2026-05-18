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
| `<<`   | 左移n位就是乘以2的n次方。“a<<b”是把a的各二进位全部左移b位，高位丢弃，低位补0。 |
| `>>`     | 右移n位就是除以2的n次方。“a>>b”是把a的各二进位全部右移b位。  |

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

注意：Go 语言规定与 if 匹配的左括号 { 必须与 if 和表达式放在同一行，{ 放在其他位置会触发编译错误。 同理，与 else 匹配的{也必须与 else 写在同一行，else 也必须与上一个if 或else if 右边的大括号在同一行。

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
