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

## 六、判断语句

### if语句

以年龄为例，输入的年龄在某一个区间，就输出对应的提示信息

```go
<=0     未出生
1-18    未成年
18-35   青年
>=35    中年
```

很明显，这是一个多选一的情况

我们有很多中方式来实现

#### 中断式

```go
package main

import "fmt"

func main() {
  fmt.Println("请输入你的年龄：")
  var age int
  fmt.Scan(&age)

  if age <= 0 {
    fmt.Println("未出生")
    return
  }
  if age <= 18 {
    fmt.Println("未成年")
    return
  }
  if age <= 35 {
    fmt.Println("青年")
    return
  }
  fmt.Println("中年")

}
```

它也有个好听的名字，叫卫语句

#### 嵌套式

```go
package main

import "fmt"

func main() {
  fmt.Println("请输入你的年龄：")
  var age int
  fmt.Scan(&age)

  if age <= 18 {
    if age <= 0 {
      fmt.Println("未出生")
    } else {
      fmt.Println("未成年")
    }
  } else {
    if age <= 35 {
      fmt.Println("青年")
    } else {
      fmt.Println("中年")
    }
  }
}
```

#### 多条件式

```go
package main

import "fmt"

func main() {
  fmt.Println("请输入你的年龄：")
  var age int
  fmt.Scan(&age)

  if age <= 0 {
    fmt.Println("未出生")
  }
  if age > 0 && age <= 18 {
    fmt.Println("未成年")
  }
  if age > 18 && age <= 35 {
    fmt.Println("青年")
  }
  if age > 35 {
    fmt.Println("中年")
  }
}
```

### switch语句

```go
package main

import "fmt"

func main() {
  fmt.Println("请输入你的年龄：")
  var age int
  fmt.Scan(&age)

  switch {
  case age <= 0:
    fmt.Println("未出生")
  case age <= 18:
    fmt.Println("未成年")
  case age <= 35:
    fmt.Println("青年")
  default:
    fmt.Println("中年")
  }
}
```

除了这样的写法，还有枚举所有的可能值

```go
package main

import "fmt"

func main() {
  fmt.Println("请输入星期数字：")
  var week int
  fmt.Scan(&week)

  switch week {
  case 1:
    fmt.Println("周一")
  case 2:
    fmt.Println("周二")
  case 3:
    fmt.Println("周三")
  case 4:
    fmt.Println("周四")
  case 5:
    fmt.Println("周五")
  case 6, 7:
    fmt.Println("周末")
  default:
    fmt.Println("错误")
  }
}
```

使用 fallthrough 继续下个判断

```go
package main

import "fmt"

func main() {
  fmt.Println("请输入你的年龄：")
  var age int
  fmt.Scan(&age)

  switch {
  case age <= 0:
    fmt.Println("未出生")
    fallthrough
  case age <= 18:
    fmt.Println("未成年")
    fallthrough
  case age <= 35:
    fmt.Println("青年")
  default:
    fmt.Println("中年")
  }
}
```

## 七、for循环

任何编程语言，都会有for循环，它的一般写法是

```go
for 初始化;条件;操作{
}
```

例如求1+2+...+100的和

```go
package main

import "fmt"

func main() {

  var sum = 0
  for i := 0; i <= 100; i++ {
    sum += i
  }
  fmt.Println(sum)
}
```

### for循环的五种变体

#### 传统for循环

如上

#### 死循环

每隔1秒打印当前的时间

```go
package main

import (
  "fmt"
  "time"
)

func main() {

  for {
    time.Sleep(1 * time.Second)
    fmt.Println(time.Now().Format("2006-01-02 15:04:05")) // 年月日时分秒的固定格式
  }
}
```

#### while模式

由于golang没有while循环，如果需要，则是由for循环稍微变化得来

```go
package main

import "fmt"

func main() {

  i := 0
  sum := 0
  for i <= 100 {
    sum += i
    i++
  }
  fmt.Println(sum)
}
```

#### do-while模式

do-while模式就是先执行一次循环体，再判断

```go
package main

import "fmt"

func main() {

  i := 0
  sum := 0
  for {
    sum += i
    i++
    if i == 101 {
      break
    }
  }
  fmt.Println(sum)
}
```

#### 遍历切片

第一个参数是索引，第二个参数是值

```go
package main

import "fmt"

func main() {

  s := []string{"枫枫", "知道"}
  for index, s2 := range s {
    fmt.Println(index, s2)
  }
}
```

#### 遍历map

第一个参数就是key，第二个就是value

```go
package main

import "fmt"

func main() {

  s := map[string]int{
    "age":   24,
    "price": 1000,
  }
  for key, val := range s {
    fmt.Println(key, val)
  }
}
```

### break，continue

break用于跳出当前循环

continue用于跳过本轮循环

例如打印九九乘法表

```go
package main

import "fmt"

func main() {

  for i := 1; i <= 9; i++ {
    for j := 1; j <= i; j++ {
      fmt.Printf("%d * %d = %d\t", i, j, i*j)
    }
    fmt.Println()
  }
}
```

除了这样写，还能这样写

```go
package main

import "fmt"

func main() {

  for i := 1; i <= 9; i++ {
    for j := 1; j <= 9; j++ {
      if j > i {
        // 去掉 列比行大的数据
        continue
      }
      fmt.Printf("%d * %d = %d\t", i, j, i*j)
    }
    fmt.Println()
  }
}
```

## 八、函数

函数是一段封装了特定功能的可重用代码块，用于执行特定的任务或计算

函数接受输入（参数）并产生输出（返回值）

### 函数定义

```go
package main

import "fmt"

// 使用func关键字定义一个函数
func sayHello() {
  fmt.Println("hello")
}

func main() {
  // 函数()调用函数
  sayHello()
}
```

### 函数参数

```go
package main

import "fmt"

func add(n1 int, n2 int) {
  fmt.Println(n1, n2)
}

// 参数类型一样，可以合并在一起
func add1(n1, n2 int) {
  fmt.Println(n1, n2)
}

// 多个参数
func add2(numList ...int) {
  fmt.Println(numList)
}

func main() {
  add(1, 2)
  add1(1, 2)
  add2(1, 2)
  add2(1, 2, 3, 4)
}
```

### 函数返回值

```go
package main

import "errors"

// 无返回值
func fun1() {
  return // 也可以不写
}

// 单返回值
func fun2() int {
  return 1
}

// 多返回值
func fun3() (int, error) {
  return 0, errors.New("错误")
}

// 命名返回值
func fun4() (res string) {
  return // 相当于先定义再赋值
  //return "abc"
}

func main() {

}
```

### 匿名函数

```go
package main

import "fmt"

func main() {
  var add = func(a, b int) int {
    return a + b
  }
  fmt.Println(add(1, 2))
}
```

### 高阶函数

根据用户输入的不同，执行不同的操作

```go
package main

import "fmt"

func main() {
  fmt.Println("请输入要执行的操作：")
  fmt.Println(`1：登录
2：个人中心
3：注销`)
  var num int
  fmt.Scan(&num)
  var funcMap = map[int]func(){
    1: func() {
      fmt.Println("登录")
    },
    2: func() {
      fmt.Println("个人中心")
    },
    3: func() {
      fmt.Println("注销")
    },
  }
  funcMap[num]()
}
```

提取出来

```go
package main

import "fmt"

func login() {
  fmt.Println("登录")
}

func userCenter() {
  fmt.Println("个人中心")
}

func logout() {
  fmt.Println("注销")
}

func main() {
  fmt.Println("请输入要执行的操作：")
  fmt.Println(`1：登录
2：个人中心
3：注销`)
  var num int
  fmt.Scan(&num)
  var funcMap = map[int]func(){
    1: login,
    2: userCenter,
    3: logout,
  }
  funcMap[num]()
}
```

### 闭包

设计一个函数，先传一个参数表示延时，后面再次传参数就是将参数求和

```go
fun(2)(1,2,3) // 延时2秒求1+2+3
```

```go
package main

import (
  "fmt"
  "time"
)

func awaitAdd(t int) func(...int) int {
  time.Sleep(time.Duration(t) * time.Second)
  return func(numList ...int) int {
    var sum int
    for _, i2 := range numList {
      sum += i2
    }
    return sum
  }
}

func main() {
  fmt.Println(awaitAdd(2)(1, 2, 3))
}
```

### 值传递和引用传递

稍微了解过编程的都应该知道，计算机上显示的所有的数据都是在内存里面的

也就是说，我们定义的一个变量，它也在内存里面有一块地

正常情况下来说，函数的参数是将之前那块地复制了一份出来

如何证明呢

```go
package main

import "fmt"

func add(num int) {
  fmt.Println(&num) // 可以看到，这个n的内存地址和外面num的内存地址是明显不一样的
  num = 2           // 这里的修改不会影响外面的num
}

func main() {
  num := 20
  fmt.Println(&num)
  add(num)
  fmt.Println(num) // 20
}
```

也就是说，在函数里面不管怎么修改这个参数，都不会影响原来的那个值

但是，如果我需要在函数体内修改变量的值呢？

这就需要用到引用传递了

我们直接将变量的内存地址传递进去

```go
package main

import "fmt"

func add(num *int) {
  fmt.Println(num) // 内存值是一样的
  *num = 2         // 这里的修改会影响外面的num
}

func main() {
  num := 20
  fmt.Println(&num)
  add(&num)
  fmt.Println(num) // 成功修改 2
}
```

### 指针

上面那个案例搞清楚之后，指针也就不难了

我们只需要知道

&是取地址，*是解引用，去这个地址指向的值

### init函数

`init()`函数是一个特殊的函数，存在以下特性：

1. 不能被其他函数调用，而是在main函数执行之前，自动被调用
2. init函数不能作为参数传入
3. 不能有传入参数和返回值

一个go文件可以有多个init函数，谁在前面谁就先执行

```go
package main

import "fmt"

func init() {
  fmt.Println("init1")
}
func init() {
  fmt.Println("init2")
}
func init() {
  fmt.Println("init3")
}

func main() {
  fmt.Println("main")
}
```

执行顺序

```go
init1
init2
init3
main
```

### defer函数

1. 关键字 defer 用于注册延迟调用
2. 这些调用直到 return 前才被执。因此，可以用来做资源清理
3. 多个defer语句，按先进后出的方式执行，谁离return近谁先执行
4. defer语句中的变量，在defer声明时就决定了

```go
package main

import "fmt"

func Func() {
  defer fmt.Println("defer2")
  fmt.Println("func")
  defer fmt.Println("defer1")
}

func main() {
  defer fmt.Println("defer4")
  Func()
  defer fmt.Println("defer3")
}
```

执行顺序

```go
func
defer1
defer2
defer3
defer4
```

## 九、结构体

### 结构体定义

```go
type 结构体名称 struct{
    名称 类型//成员或属性
}
```

```go
package main

import "fmt"

// Student 定义结构体
type Student struct {
  Name string
  Age  int
}

// PrintInfo 给机构体绑定一个方法
func (s Student) PrintInfo() {
  fmt.Printf("name:%s age:%d\n", s.Name, s.Age)
}

func main() {
  s := Student{
    Name: "枫枫",
    Age:  21,
  }
  s.Name = "枫枫知道" // 修改值
  s.PrintInfo()
}
```

### 继承

```go
package main

import "fmt"

type People struct {
  Time string
}

func (p People) Info() {
  fmt.Println("people ", p.Time)
}

// Student 定义结构体
type Student struct {
  People
  Name string
  Age  int
}

// PrintInfo 给机构体绑定一个方法
func (s Student) PrintInfo() {
  fmt.Printf("name:%s age:%d\n", s.Name, s.Age)
}

func main() {
  p := People{
    Time: "2023-11-15 14:51",
  }
  s := Student{
    People: p,
    Name:   "枫枫",
    Age:    21,
  }
  s.Name = "枫枫知道" // 修改值
  s.PrintInfo()
  s.Info()                   // 可以调用父结构体的方法
  fmt.Println(s.People.Time) // 调用父结构体的属性
  fmt.Println(s.Time)        // 也可以这样
}
```

### 结构体指针

之前我们了解了值传递和引用传递，如果我想在函数里面或者方法里面修改结构体里面的属性

只能使用结构体指针或者指针方法

```go
package main

import "fmt"

type Student struct {
  Name string
  Age  int
}

func SetAge(info Student, age int) {
  info.Age = age
}

func SetAge1(info *Student, age int) {
  info.Age = age
}

func main() {
  s := Student{
    Name: "枫枫",
    Age:  21,
  }
  fmt.Println(s.Age)
  SetAge(s, 18)
  fmt.Println(s.Age)
  SetAge1(&s, 17)
  fmt.Println(s.Age)
}
```

```go
package main

import "fmt"

type Student struct {
  Name string
  Age  int
}

func (s Student) SetAge(age int) {
  s.Age = age
}
func (s *Student) SetAge1(age int) {
  s.Age = age
}

func main() {
  s := Student{
    Name: "枫枫",
    Age:  21,
  }
  s.SetAge(18)
  fmt.Println(s.Age)
  s.SetAge1(18)
  fmt.Println(s.Age)
}
```

### 结构体tag

```go
package main

import (
  "encoding/json"
  "fmt"
)

type Student struct {
  Name string `json:"name"`
  Age  int    `json:"age"`
}

func main() {
  s := Student{
    Name: "枫枫",
    Age:  21,
  }
  byteData, _ := json.Marshal(s)
  fmt.Println(string(byteData))
}
```

#### json tag

1. 这个不写json标签转换为json的话，字段名就是属性的名字
2. 小写的属性也不会转换

空

如果再转json的时候，我不希望某个字段被转出来，我可以写一个 -

```go
package main

import (
  "encoding/json"
  "fmt"
)

type Student struct {
  Name     string `json:"name"`
  Age      int    `json:"age"`
  Password string `json:"-"`
}

func main() {
  s := Student{
    Name:     "枫枫",
    Age:      21,
    Password: "123456",
  }
  byteData, _ := json.Marshal(s)
  fmt.Println(string(byteData)) // {"name":"枫枫","age":21}
}
```

omitempty

空值省略

```go
package main

import (
  "encoding/json"
  "fmt"
)

type Student struct {
  Name string `json:"name"`
  Age  int    `json:"age,omitempty"`
}

func main() {
  s := Student{
    Name: "枫枫",
    Age:  0, // 空值会被省略
  }
  byteData, _ := json.Marshal(s)
  fmt.Println(string(byteData)) // {"name":"枫枫"}
}
```

## 十、自定义数据类型与类型别名

在 Go 语言中，自定义类型指的是使用 type 关键字定义的新类型，它可以是基本类型的别名，也可以是结构体、函数等组合而成的新类型。自定义类型可以帮助我们更好地抽象和封装数据，让代码更加易读、易懂、易维护

### 自定义类型

结构体就是自定义类型中的一种

除此之外我们使用自定义类型，还可以让代码组合更加规范

例如，响应给客户端的想要码，我给他一个自定义类型

```go
package main

import "fmt"

type Code int

const (
  SuccessCode    Code = 0
  ValidCode      Code = 7 // 校验失败的错误
  ServiceErrCode Code = 8 // 服务错误
)

func (c Code) GetMsg() string {
  // 可能会有更加响应码返回不同消息内容的要求，我们在这个函数里面去实现即可
  // 可能还会有国际化操作
  return "成功"
}

func main() {
  fmt.Println(SuccessCode.GetMsg())
  var i int
  fmt.Println(int(SuccessCode) == i) // 必须要转成原始类型才能判断
}
```

