# go快速入门

资料来源：[https://yuanqinguo.github.io/flyfei/](https://yuanqinguo.github.io/flyfei/)

视频资料：[https://www.bilibili.com/video/BV13kHWztEJE/](https://www.bilibili.com/video/BV13kHWztEJE/)

go语言教程总结：[https://go.mosong.cc/](https://go.mosong.cc/)

枫枫知道：[https://www.fengfengzhidao.com/special/1/1](https://www.fengfengzhidao.com/special/1/1)

枫枫知道其他资料：[https://www.fengfengzhidao.com/special](https://www.fengfengzhidao.com/special)

## 一、安装go

官网下载：[https://go.dev/dl/](https://go.dev/dl/)

windows 环境直接下载 msi包 安装即可，使用如下命令检查版本。

```cmd
go version
```

## 二、helloworld

Go是**编译型语言**——你写的  .go 代码，需要通过  go 命令（比如  go build /  go run ）编译成计算机能懂的可执行文件才能运行。

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

```
C:\Users\kk\Desktop\go-code>demo.exe
hello world 10
```

## 三、变量的定义与输入输出

### 变量定义

```go
package main

import "fmt"

func main() {
	// 先定义，再赋值
	var name string
	name = "枫枫1"
	fmt.Println(name)

	// var 变量名 类型 = "变量值"
	var userName string = "枫枫2"
	fmt.Println(userName)

	// 省略类型，Go会根据值自动推断变量类型
	var userName2 = "枫枫3"
	fmt.Println(userName2)

	// 省略 var，使用 := 来声明和初始化变量，短声明
	userName3 := "枫枫4"
	fmt.Println(userName3)
}
```

注意：如果一个变量定义了，但是没有赋值，那么这个变量的值就是这个类型的 `"零值"`

#### 全局变量与局部变量

1. 定义在函数体（包括main函数）内的变量都是局部变量，定义了就必须使用

2. 定义在外部的变量就是全局变量，可以只定义不使用

```go
package main

import "fmt"

var userName = "枫枫知道" // 可以不使用

func main() {
  // var 变量名 类型 = "变量值"
  var name = "枫枫"
  // 在函数体内定义的变量，必须要使用
  fmt.Println(name)
}
```

#### 定义多个变量

```go
package main

func main() {
  var name1, name2, name3 string // 定义多个变量

  var a1, a2 = "枫枫", "知道" // 定义多个变量并赋值
  
  a3, a4 := "枫枫", "知道" // 简短定义多个变量并赋值
}
```

```go
package main

import "fmt"

var (
  name     string = "枫枫"
  userName        = "枫枫知道"
)

func main() {
  fmt.Println(name, userName)
}
```

#### 常量定义

1. 定义的时候就要赋值

2. 赋值之后就不能再修改了

```go
const name string = "枫枫" // 定义就要赋值
//name = "知道" // 不能再修改了
fmt.Println(name)
```

#### 命名规范

核心思想：首字母大写的变量、函数。方法，属性可在包外进行访问

### 输出

常用的输出函数

```go
package main

import "fmt"

func main() {
  fmt.Println("枫枫知道")
  fmt.Println(1)
  fmt.Println(true)
  fmt.Println("什么", "都", "可以", "输出")
}
```

#### 格式化输出

```go
package main

import "fmt"

func main() {
	fmt.Printf("%v\n", "你好")          // 可以作为任何值的占位符输出
	fmt.Printf("%v %T\n", "枫枫", "枫枫") // 打印类型
	fmt.Printf("%d\n", 3)             // 整数
	fmt.Printf("%.2f\n", 1.25)        // 小数
	fmt.Printf("%s\n", "哈哈哈")         // 字符串
	fmt.Printf("%v\n", "")            // 空字符串
	fmt.Printf("%#v\n", "")           // 用go的语法格式输出，很适合打印空字符串
}
```

还有一个用的比较多的就是将格式化之后的内容赋值给一个变量

```go
name := fmt.Sprintf("%v", "你好")
fmt.Println(name)
```

| 函数            | 是否换行    | 参数间是否自动加空格 | 是否支持格式化占位符 | 典型用途   | 示例代码                             | 输出结果          |
| ------------- | ------- | ---------- | ---------- | ------ | -------------------------------- | ------------- |
| `fmt.Print`   | ❌ 不换行   | ❌ 不加空格     | ❌ 不支持      | 连续输出内容 | `fmt.Print("hello", "world")`    | `helloworld`  |
| `fmt.Println` | ✅ 自动换行  | ✅ 自动加空格    | ❌ 不支持      | 日常调试输出 | `fmt.Println("hello", "world")`  | `hello world` |
| `fmt.Printf`  | ❌ 默认不换行 | ❌ 不自动加空格   | ✅ 支持       | 格式化输出  | `fmt.Printf("%s %d", "age", 18)` | `age 18`      |


### 输入

```go
package main

import "fmt"

func main() {
  fmt.Println("输入您的名字：")
  var name string
  fmt.Scan(&name)  // 这里记住，要在变量的前面加个&, 后面讲指针会提到
  fmt.Println("你输入的名字是", name)
}
```

## 四、基本数据类型

go语言的基本数据类型有

1. 整数型
2. 浮点型
3. 复数
4. 布尔
5. 字符串

### 整数型

go语言的整数类型，具体细分有很多

```go
var n1 uint8 = 2 
var n2 uint16 = 2 
var n3 uint32 = 2 
var n4 uint64 = 2 
var n5 uint = 2 
var n6 int8 = 2 
var n7 int16 = 2 
var n8 int32 = 2 
var n9 int64 = 2 
var n10 int = 2 
```

大家只需要记住以下几点

1. 默认的数字定义类型是int类型
2. 带个u就是无符号，只能存正整数
3. 后面的数字就是2进制的位数
4. uint8还有一个别名 byte， 一个字节=8个bit位
5. int类型的大小取决于所使用的平台

例如uint8，那就是8个二进制位，都用来存储数据，那最小就是0，最大就是2的八次方-1=255

那int8，因为要拿一位存符合，使用实际只有七位可用，所以最小的就是负2的七次方=-128，最大的就是2的七次方-1=127

至于为什么要减一，其实很好理解，因为实际到最后一个数字的时候，已经向前进位了，例如一个小时是60分钟，但是分钟最大只有59

第五点的测试

我是64位操作系统，那么我会试一下int是不是就是int64的最大上限

2的63次方-1=9223372036854775807

```go
fmt.Printf("%.0f\n", math.Pow(2, 63))
var n1 int = 9223372036854775807
fmt.Println(n1)
var n2 int = 9223372036854775808 // 看它报不报错
fmt.Println(n2)
```

### 浮点型

Go语言支持两种浮点型数：float32 和 float64

1. float32 的浮点数的最大范围约为3.4e38，可以使用常量定义：`math.MaxFloat32`
2. float64 的浮点数的最大范围约为 1.8e308，可以使用一个常量定义：`math.MaxFloat64`

如果没有显式声明，则默认是float64

### 字符型

> [!NOTE]
>
> 注意哦，是字符，不是字符串

