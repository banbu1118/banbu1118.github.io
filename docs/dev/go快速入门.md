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

| 类型     | 字节   | 最小值 | 最大值                               |
| -------- | ------ | ------ | ------------------------------------ |
| `uint8`  | 1      | 0      | 255                                  |
| `uint16` | 2      | 0      | 65,535                               |
| `uint32` | 4      | 0      | 4,294,967,295                        |
| `uint64` | 8      | 0      | 18,446,744,073,709,551,615           |
| `uint`   | 4 或 8 | 0      | 取决于系统（32位=2³²-1，64位=2⁶⁴-1） |

| 类型    | 字节   | 最小值                     | 最大值                                             |
| ------- | ------ | -------------------------- | -------------------------------------------------- |
| `int8`  | 1      | -128                       | 127                                                |
| `int16` | 2      | -32,768                    | 32,767                                             |
| `int32` | 4      | -2,147,483,648             | 2,147,483,647                                      |
| `int64` | 8      | -9,223,372,036,854,775,808 | 9,223,372,036,854,775,807                          |
| `int`   | 4 或 8 | 取决于系统                 | 32位：2,147,483,64764位：9,223,372,036,854,775,807 |

### 浮点型

Go语言支持两种浮点型数：float32 和 float64

1. float32 的浮点数的最大范围约为3.4e38，可以使用常量定义：`math.MaxFloat32`
2. float64 的浮点数的最大范围约为 1.8e308，可以使用一个常量定义：`math.MaxFloat64`

如果没有显式声明，则默认是float64

| 类型      | 字节 | 最小正正规格值  | 最大有限值      | 最小（最负）值   |
| --------- | ---- | --------------- | --------------- | ---------------- |
| `float32` | 4    | ≈ 1.175494e-38  | ≈ 3.402823e+38  | ≈ -3.402823e+38  |
| `float64` | 8    | ≈ 2.225074e-308 | ≈ 1.797693e+308 | ≈ -1.797693e+308 |

### 字符型

注意哦，是字符，不是字符串

比较重要的两个类型是byte（单字节字符）和rune（多字节字符）

```go
package main

import "fmt"

func main() {
  var c1 = 'a'
  var c2 = 97
  fmt.Println(c1) // 直接打印都是数字
  fmt.Println(c2)

  fmt.Printf("%c %c\n", c1, c2) // 以字符的格式打印

  var r1 rune = '中'
  fmt.Printf("%c\n", r1)
}
```

1. 在 Go 中，字符的本质是一个整数，直接输出时，是该字符对应的 UTF-8 编码的码值
2. 可以直接给某个变量赋一个数字，然后按格式化输出时 %c ，会输出该数字对应的 unicode 字符
3. 字符类型是可以进行运算的，相当于一个整数，因为它都对应有 Unicode 码。

### 字符串类型

和字符不一样的是，字符的赋值是单引号，字符串的赋值是双引号

```go
var s string = "枫枫知道"
fmt.Println(s)
```

#### 转义字符

一些常用的转义字符

```go
fmt.Println("枫枫\t知道")              // 制表符
fmt.Println("枫枫\n知道")              // 回车
fmt.Println("\"枫枫\"知道")            // 双引号
fmt.Println("枫枫\r知道")              // 回到行首
fmt.Println("C:\\pprof\\main.exe") // 反斜杠
```

#### 多行字符串

```go
package main

import "fmt"

func main() {
  var s = `今天
天气
真好
`
  fmt.Println(s)
}
```

在``这个里面，再出现转义字符就会原样输出了

### 布尔类型

布尔型数据只有 true（真）和 false（假）两个值

1. 布尔类型变量的默认值为false
2. Go 语言中不允许将整型强制转换为布尔型
3. 布尔型无法参与数值运算，也无法与其他类型进行转换

### 零值问题

如果我们给一个基本数据类型只声明不赋值

那么这个变量的值就是对应类型的零值，例如int就是0，bool就是false，字符串就是""

```go
package main

import "fmt"

func main() {
  var a1 int
  var a2 float32
  var a3 string
  var a4 bool

  fmt.Printf("%#v\n", a1)
  fmt.Printf("%#v\n", a2)
  fmt.Printf("%#v\n", a3)
  fmt.Printf("%#v\n", a4)
}
```

## 五、数组、切片、map

### 数组

数组（Array）是一种非常常见的数据类型，几乎所有的计算机编程语言中都会用到它

1. 数组里的元素必须全部为同一类型，要嘛全部是字符串，要嘛全部是整数
2. 声明数组时，必须指定其长度或者大小

```go
package main

import "fmt"

func main() {
  var array [3]int = [3]int{1, 2, 3}
  fmt.Println(array)
  var array1 = [3]int{1, 2, 3}
  fmt.Println(array1)
  var array2 = [...]int{1, 2, 3}
  fmt.Println(array2)
}
```

如果要修改某个值，只能根据索引去找然后替换

```go
var array1 = [3]int{1, 2, 3}
array1[0] = 10 // 根据索引找到对应的元素位置，然后替换
fmt.Println(array1)
```

#### 索引

```go
package main

import "fmt"

func main() {
  // 以定义一个字符串数组 a b c d 为例
  var sList = []string{"a", "b", "c", "d"}
  // 正向索引就从0开始，从左往右
  /*
    a     b     c     d
    0     1     2     3
  */
  // 取值就通过索引去取
  fmt.Println(sList[0]) // 拿到a这个元素
  // 当然，有的语言支持负向索引，go不支持
  /*
      a      b     c     d
      -4    -3    -2    -1
  */
  // 如果在go语言里面，我想拿到倒数第二个元素，怎么办？
  fmt.Println(sList[len(sList)-2]) // 拿到a这个元素
}
```

### 切片

很明显啊，go里面的数组，长度被限制死了，所以不经常用

所以go出了一个数组plus，叫做slice（切片）

切片（Slice）相较于数组更灵活，因为在声明切片后其长度是可变的

```go
package main

import "fmt"

func main() {
  // 定义一个字符串切片
  var list []string

  list = append(list, "枫枫")
  list = append(list, "知道")
  fmt.Println(list)
  fmt.Println(len(list)) // 切片长度
  // 修改第二个元素
  list[1] = "不知道"
  fmt.Println(list)
}
```

#### make函数

除了基本数据类型，其他数据类型如果只定义不赋值，那么实际的值就是nil

```go
// 定义一个字符串切片
var list []string
fmt.Println(list == nil) // true
```

那么我们可以通过make函数创建指定长度，指定容量的切片了

```go
make([]type, length, capacity)
```

```go
package main

import "fmt"

func main() {
  // 定义一个字符串切片
  var list = make([]string, 0)
  fmt.Println(list, len(list), cap(list))
  fmt.Println(list == nil) // false

  list1 := make([]int, 2, 2)
  fmt.Println(list1, len(list1), cap(list1))
}
```

#### 为什么叫切片

因为切片是数组切出来的

```go
package main

import "fmt"

func main() {
  var list = [...]string{"a", "b", "c"}
  slices := list[:] // 左一刀，右一刀  变成了切片
  fmt.Println(slices)
  fmt.Println(list[1:2]) // b
}
```

#### 切片排序

```go
var list = []int{4, 5, 3, 2, 7}
fmt.Println("排序前:", list)
sort.Ints(list)
fmt.Println("升序:", list)
sort.Sort(sort.Reverse(sort.IntSlice(list)))
fmt.Println("降序:", list)
```

### map

Go语言中的map(映射、字典)是一种内置的数据结构，它是一个`无序`的key-value对的集合

map的key必须是基本数据类型，value可以是任意类型

注意，map使用之前一定要初始化

```go
package main

import "fmt"

func main() {
  // 声明
  var m1 map[string]string
  // 初始化1
  m1 = make(map[string]string)
  // 初始化2
  m1 = map[string]string{}
  // 设置值
  m1["name"] = "枫枫"
  fmt.Println(m1)
  // 取值
  fmt.Println(m1["name"])
  // 删除值
  delete(m1, "name")
  fmt.Println(m1)
}
```

也可以声明并赋值

```go
// 声明并赋值
var m1 = map[string]string{}
var m2 = make(map[string]string)
```

#### map取值

如果只有一个参数接，那这个参数就是值，如果没有，这个值就是类型的零值

如果两个参数接，那第二个参数就是布尔值，表示是否有这个元素

```go
package main

import "fmt"

func main() {
  // 声明并赋值
  var m1 = map[string]int{
    "age": 21,
  }
  age1 := m1["age1"] // 取一个不存在的
  fmt.Println(age1)
  age2, ok := m1["age1"]
  fmt.Println(age2, ok)
}
```

