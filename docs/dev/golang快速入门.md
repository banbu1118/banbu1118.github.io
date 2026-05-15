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

Go是**编译型语言**——你写的 .go 代码，需要通过 go 命令（比如 go build / go run ）编译成计算机能懂的可执行文件才能运行。

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

