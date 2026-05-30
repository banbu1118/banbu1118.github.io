# gin快速入门

视频资料：[https://www.bilibili.com/video/BV1Rm421N7Jy](https://www.bilibili.com/video/BV1Rm421N7Jy)

资料来源：[https://www.itying.com/goods-1156.html](https://www.itying.com/goods-1156.html)

## 一、Gin 介绍

Gin 是一个 Go (Golang) 编写的轻量级 http web 框架，运行速度非常快，如果你是性能和高效的追求者，我们推荐你使用 Gin 框架。

Gin 最擅长的就是 Api 接口的高并发，如果项目的规模不大，业务相对简单，这个时候我们也推荐您使用 Gin。

当某个接口的性能遭到较大挑战的时候，这个还是可以考虑使用 Gin 重写接口。

Gin 也是一个流行的 golang Web 框架，Github Strat 量已经超过了 80k。

Gin 的官网：[https://gin-gonic.com/zh-cn](https://gin-gonic.com/zh-cn)

Gin Github 地址：[https://github.com/gin-gonic/gin](https://github.com/gin-gonic/gin)

## 二、Gin 环境搭建

要安装 Gin 软件包，需要先安装 Go 并设置 Go 工作区。

- 下载并安装 gin

```cmd
go get -u github.com/gin-gonic/gin
```

- 将 gin 引入到代码中

```go
import "github.com/gin-gonic/gin"
```

- （可选）如果使用诸如 http.StatusOK 之类的常量，则需要引入 net/http 包：

```go
import "net/http"
```

新建 Main.go 配置路由

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	router.Run()
}
```

- 运行你的项目

```go
go run main.go
```

- 要改变默认启动的端口

```go
r.Run(":9000")
```

## 三、热加载

所谓热加载就是当我们对代码进行修改时，程序能够自动重新加载并执行，这在我们开发中是非常便利的，可以快速进行代码测试，省去了每次手动重新编译

gin 中并没有官方提供的热加载工具，这个时候我们要实现热加载就可以借助第三方的工具。

推荐工具：[https://github.com/air-verse/air](https://github.com/air-verse/air)

- 安装air

```cmd
go install github.com/air-verse/air@latest
```

- 初始化项目

```cmd
air init
```

这会生成一个 `.air.toml` 文件，里面是 air 的默认配置

- 运行air

```cmd
air
```

在项目根目录直接运行

## 四、Gin 框架中的路由

### 路由概述

路由（Routing）是由一个 URI（或者叫路径）和一个特定的 HTTP 方法（GET、POST 等）组成的，涉及到应用如何响应客户端对某个网站节点的访问。

RESTful API 是目前比较成熟的一套互联网应用程序的 API 设计理论，所以我们设计我们的路由的时候建议参考 RESTful API 指南。

在 RESTful 架构中，每个网址代表一种资源，不同的请求方式表示执行不同的操作：

| 方法        | 典型 REST 用途            |
| :---------- | :------------------------ |
| **GET**     | 获取资源                  |
| **POST**    | 创建新资源                |
| **PUT**     | 替换现有资源              |
| **PATCH**   | 部分更新现有资源          |
| **DELETE**  | 删除资源                  |
| **HEAD**    | 与 GET 相同但不返回响应体 |
| **OPTIONS** | 描述通信选项              |

### 简单的路由配置

- 简单的路由配置(可以通过 postman 测试)

当用 GET 请求：

```go
router.GET("/ping", func(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
	})
})
```

- 路由里面获取 Get 传值

域名/news?aid=20

```go
router.GET("/news", func(c *gin.Context) {
	aid := c.Query("aid")
	c.String(200, "aid=%s", aid)
})
```

- 动态路由

域名/user/20

```go
router.GET("/user/:uid", func(c *gin.Context) {
	uid := c.Param("uid")
	c.String(200, "userID=%s", uid)
})
```

### c.String() c.JSON() c.JSONP() c.XML() c.HTML()

- 返回一个字符串

```go
package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/news", func(c *gin.Context) {
		aid := c.Query("aid")
		c.String(200, "aid=%s", aid)
	})
	router.Run(":8888")
}
```

- 返回一个 JSON 数据

```go
package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/someJSON", func(c *gin.Context) {
		//方式一：使用gin.H
		c.JSON(200, gin.H{
			"message": "hello world!",
			"success": true,
		})
	})

	router.GET("/moreJSON", func(c *gin.Context) {
		//方式二：使用结构体
		// 这里的结构体等价于上面的gin.H
		var msg struct {
			Name string `json:user`
			Age  int
		}
		msg.Name = "张三"
		msg.Age = 20

		c.JSON(200, msg)
	})
	router.Run(":8888")
}
```

- JSOPN

早期浏览器有同源策略限制，需要JSONP实现跨域获取数据，现在浏览器支持`Access-Control-Allow-Origin`，基本不用这个了

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.GET("/JSONP", func(c *gin.Context) {
		data := map[string]interface{}{"foo": "bar"}
		// /JSONP?callback=x
		// 将输出：x({\"foo\":\"bar\"})
		c.JSONP(http.StatusOK, data)
	})
	// 监听并在 0.0.0.0:8080 上启动服务
	r.Run(":8888")
}
```

- 渲染模板

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.LoadHTMLGlob("templates/*")
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", map[string]interface{}{
			"title": "前台首页",
		})
	})
	// 监听并在 0.0.0.0:8080 上启动服务
	r.Run(":8888")
}
```

注意需要创建`templates/index.html`

## 五、Gin HTML 模板渲染（可选）

现在开发主流是前后端分离，gin只做api开发。直接使用gin写页面的情况很少，可以不用学。

### 全部模板放在一个目录里面的配置方法

我们首先在项目根目录新建 templates 文件夹，然后在文件夹中新建index.html

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <h1>这是一个 html 模板</h1>
        <h3>{{.title}}</h3>
    </body>
</html>
```

Gin 框架中使用 c.HTML 可以渲染模板，渲染模板前需要使用LoadHTMLGlob()或者LoadHTMLFiles()方法加载模板。

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.LoadHTMLGlob("templates/*")
	// router.LoadHTMLFiles("templates/template1.html", "templates/template2.html")
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{"title": "Main website"})
	})
	router.Run(":8080")
}
```

### 模板放在不同目录里面的配置方法

Gin 框架中如果不同目录下面有同名模板的话我们需要使用下面方法加载模板

注意：定义模板的时候需要通过 define 定义名称

templates/admin/index.html

<!-- 相当于给模板定义一个名字 define end 成对出现-->

```html
{{ define "admin/index.html" }}
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <h1>后台模板</h1>
        <h3>{{.title}}</h3>
    </body>
</html>
{{ end }}
```

templates/default/index.html

<!-- 相当于给模板定义一个名字 define end 成对出现-->

```html
{{ define "default/index.html" }}
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <h1>前台模板</h1>
        <h3>{{.title}}</h3>
    </body>
</html>
{{end}}
```

业务逻辑

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.LoadHTMLGlob("templates/**/*")
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "default/index.html", gin.H{"title": "前台首页"})
	})
	router.GET("/admin", func(c *gin.Context) {
		c.HTML(http.StatusOK, "admin/index.html", gin.H{"title": "后台首页"})
	})
	router.Run(":8080")
}
```

注意：如果模板在多级目录里面的话需要这样配置 r.LoadHTMLGlob("templates/**/**/*") /**表示目录

### gin 模板基本语法

- `{{.}}` 输出数据

模板语法都包含在`{{和}}`中间，其中`{{.}}`中的点表示当前对象。

当我们传入一个结构体对象时，我们可以根据.来访问结构体的对应字段。例如：

业务逻辑

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserInfo struct {
	Name   string
	Gender string
	Age    int
}

func main() {
	router := gin.Default()
	router.LoadHTMLGlob("templates/**/*")
	user := UserInfo{
		Name: "张三", Gender: "男", Age: 18}
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "default/index.html", map[string]interface{}{"title": "前台首页", "user": user})
	})
	router.Run(":8080")
}
```

模板

<!-- 相当于给模板定义一个名字 define end 成对出现-->

```html
{{ define "default/index.html" }}
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <h1>前台模板</h1>
        <h3>{{.title}}</h3>
        <h4>{{.user.Name}}</h4>
        <h4>{{.user.Age}}</h4>
    </body>
</html>
{{end}}
```

- 注释

```html
{{/* a comment */}}
```

注释，执行时会忽略。可以多行。注释不能嵌套，并且必须紧贴分界符始止。

- 变量

我们还可以在模板中声明变量，用来保存传入模板的数据或其他语句生成的结果。具体语法如下：

```html
<h4>{{$obj := .title}}</h4>
<h4>{{$obj}}</h4>
```

- 移除空格

有时候我们在使用模板语法的时候会不可避免的引入一下空格或者换行符，这样模板最终渲染出来的内容可能就和我们想的不一样，这个时候可以使用{{-语法去除模板内容左侧的所有空白符号， 使用-}}去除模板内容右侧的所有空白符号

```html
{{- .Name -}}
```

注意：-要紧挨{{和}}，同时与模板值之间需要使用空格分隔。

- 比较函数

布尔函数会将任何类型的零值视为假，其余视为真。

下面是定义为函数的二元比较运算的集合：

| 运算 | 描述                       |
| :--- | :------------------------- |
| eq   | 如果 arg1 == arg2 则返回真 |
| ne   | 如果 arg1 != arg2 则返回真 |
| lt   | 如果 arg1 < arg2 则返回真  |
| le   | 如果 arg1 <= arg2 则返回真 |
| gt   | 如果 arg1 > arg2 则返回真  |
| ge   | 如果 arg1 >= arg2 则返回真 |

- 条件判断

Go 模板语法中的条件判断有以下几种:

```html
{{if pipeline}} T1 {{end}}
{{if pipeline}} T1 {{else}} T0 {{end}}
{{if pipeline}} T1 {{else if pipeline}} T0 {{end}}
{{if gt .score 60}}
及格
{{else}}
不及格
{{end}}
{{if gt .score 90}}
优秀
{{else if gt .score 60}}
及格
{{else}}
不及格
{{end}}
```

- range

Go 的模板语法中使用 range 关键字进行遍历，有以下两种写法，其中pipeline 的值必须是数组、切片、字典或者通道。

```html
{{range $key,$value := .obj}}
{{$value}}
{{end}}
```

如果 pipeline 的值其长度为 0，不会有任何输出

```html
{{$key,$value := .obj}}
{{$value}}
{{else}}
pipeline 的值其长度为 0
{{end}}
```

如果 pipeline 的值其长度为 0，则会执行 T0。

```go
router.GET("/", func(c *gin.Context) {
c.HTML(http.StatusOK, "default/index.html", map[string]interface{}{ "hobby": []string{"吃饭", "睡觉", "写代码"}, })
})
{{range $key,$value := .hobby}}
<p>{{$value}}</p>
{{end}}
```

- With

```go
user := UserInfo{
Name: "张三", Gender: "男", Age: 18, }
router.GET("/", func(c *gin.Context) {
c.HTML(http.StatusOK, "default/index.html", map[string]interface{}{ "user": user, })
})
```

以前要输出数据：

```html
<h4>{{.user.Name}}</h4>
<h4>{{.user.Gender}}</h4>
<h4>{{.user.Age}}</h4>
```

现在要输出数据：

```html
{{with .user}}
<h4>姓名：{{.Name}}</h4>
<h4>性别：{{.user.Gender}}</h4>
<h4>年龄：{{.Age}}</h4>
{{end}}
```

简单理解：相当于 var .=.user

- 预定义函数 （了解）

执行模板时，函数从两个函数字典中查找：首先是模板函数字典，然后是全局函数字典。一般不在模板内定义函数，而是使用 Funcs 方法添加函数到模板里。

| 函数     | 描述                                                         |
| :------- | :----------------------------------------------------------- |
| and      | 返回第一个 empty 参数或者最后一个参数（即 `and x y` 等价于 `if x then y else x`），所有参数都会执行 |
| or       | 返回第一个非 empty 参数或者最后一个参数（即 `or x y` 等价于 `if x then x else y`），所有参数都会执行 |
| not      | 返回其单个参数的布尔值的否定                                 |
| len      | 返回其参数的整数类型长度                                     |
| index    | 执行结果为第一个参数以剩下的参数为索引/键指向的值（如 `index x 1 2 3` 返回 `x[1][2][3]`），每个被索引的主体必须是数组、切片或字典 |
| print    | 即 `fmt.Sprint`                                              |
| printf   | 即 `fmt.Sprintf`                                             |
| printfln | 即 `fmt.Sprintfln`                                           |
| html     | 返回与其参数的文本表示形式等效的转义 HTML（此函数在 `html/template` 中不可用） |
| urlquery | 返回以适合嵌入网址查询的形式转义后的参数文本表示（此函数在 `html/template` 中不可用） |
| js       | 返回与其参数的文本表示形式等效的转义 JavaScript              |
| call     | 执行结果是调用第一个参数的返回值（该参数必须是函数类型），其余参数作为调用该函数的参数。如 `call .X Y 1 2` 等价于 Go 里的 `dot.X Y(1, 2)`。第一个参数的执行结果必须是函数类型值，该函数需有 1 或 2 个返回值，若有 2 个则第二个必须是 `error` 接口类型；若 error 非 nil，模板执行会中断并返回该错误`{{len .title}} {{index .hobby 2}}` |

- 自定义模板函数

```go
router.SetFuncMap(template.FuncMap{ "formatDate": formatAsDate, })
```

```go
package main
import ( "fmt"
"html/template"
"net/http"
"time"
"github.com/gin-gonic/gin"
)
func formatAsDate(t time.Time) string {
year, month, day := t.Date()
return fmt.Sprintf("%d/%02d/%02d", year, month, day)
}
func main() {
router := gin.Default()
//注册全局模板函数 注意顺序，注册模板函数需要在加载模板上面router.SetFuncMap(template.FuncMap{ "formatDate": formatAsDate, })
//加载模板
router.LoadHTMLGlob("templates/**/*")
router.GET("/", func(c *gin.Context) {
c.HTML(http.StatusOK, "default/index.html", map[string]interface{}{ "title": "前台首页", "now": time.Now(), })
})
router.Run(":8080")
}
```

模板里面的用法

```html
{{.now | formatDate}}
或者
{{formatDate .now }}
```

- 嵌套 template

新建 templates/deafult/page_header.html

```html
{{ define "default/page_header.html" }}
<h1>这是一个头部</h1>
{{end}}
```

外部引入

注意：

1. 引入的名字为 page_header.html 中定义的名字
2. 引入的时候注意最后的点（.）

```html
{{template "default/page_header.html" .}}
```

```html
<!-- 相当于给模板定义一个名字 define end 成对出现-->
{{ define "default/index.html" }}
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<body>
{{template "default/page_header.html" .}}
</body>
</html>
{{end}}
```

## 六、静态文件服务

当我们渲染的 HTML 文件中引用了静态文件时,我们需要配置静态 web 服务

r.Static("/static", "./static") 前面的/static 表示路由 后面的./static 表示路径

```go
func main() {
r := gin.Default()
r.Static("/static", "./static")
r.LoadHTMLGlob("templates/**/*")
// ... r.Run(":8080")
}
<link rel="stylesheet" href="/static/css/base.css" />
```

## 七、路由详解

路由（Routing）是由一个 URI（或者叫路径）和一个特定的 HTTP 方法（GET、POST 等）组成的，涉及到应用如何响应客户端对某个网站节点的访问。

### GET POST 以及获取 Get Post 传值

- Get 请求传值

GET /user?uid=20&page=1

```go
package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/user", func(c *gin.Context) {
		uid := c.Query("uid")
		page := c.DefaultQuery("page", "0")
		c.String(200, "uid=%v page=%v", uid, page)
	})
	router.Run(":8080")
}
```

- 动态路由传值

域名/user/20

```go
package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/user/:uid", func(c *gin.Context) {
		uid := c.Param("uid")
		c.String(200, "userID=%s", uid)
	})
	router.Run(":8080")
}
```

- Post 请求传值 获取 form 表单数据

定义一个 add_user.html 的页面

```html
{{ define "default/add_user.html" }}
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <form action="/doAddUser" method="post">
            用户名：<input type="text" name="username" /> 密码:
            <input type="password" name="password" />
            <input type="submit" value="提交" />
        </form>
    </body>
</html>
{{end}}
```

通过 c.PostForm 接收表单传过来的数据

```go
package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.LoadHTMLGlob("templates/**/*")
	router.GET("/addUser", func(c *gin.Context) {
		c.HTML(200, "default/add_user.html", gin.H{})
	})
	router.POST("/doAddUser", func(c *gin.Context) {
		username := c.PostForm("username")
		password := c.PostForm("password")
		age := c.DefaultPostForm("age", "20")
		c.JSON(200, gin.H{"usernmae": username, "password": password, "age": age})
	})

	router.Run(":8080")
}
```

- 获取 GET POST 传递的数据绑定到结构体

为了能够更方便的获取请求相关参数，提高开发效率，我们可以基于请求的Content-Type识别请求数据类型并利用反射机制自动提取请求中 QueryString、form 表单、JSON、XML 等参数到结构体中。 下面的示例代码演示了.ShouldBind()强大的功能，它能够基于请求自动提取 JSON、form 表单和 QueryString 类型的数据，并把值绑定到指定的结构体对象。

```go
//注意首字母大写
type Userinfo struct {
Username string `form:"username" json:"user"` 
Password string `form:"password" json:"password"`
}
```

Get 传值绑定到结构体

/?username=zhangsan&password=123456

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// 注意首字母大写
type Userinfo struct {
	Username string `form:"username" json:"user"`
	Password string `form:"password" json:"password"`
}

func main() {
	router := gin.Default()
	router.GET("/", func(c *gin.Context) {
		var userinfo Userinfo
		if err := c.ShouldBind(&userinfo); err == nil {
			c.JSON(http.StatusOK, userinfo)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
	})

	router.Run(":8080")
}
```

返回数据

```json
{"user":"zhangsan","password":"123456"}
```

Post 传值绑定到结构体

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// 注意首字母大写
type Userinfo struct {
	Username string `form:"username" json:"user"`
	Password string `form:"password" json:"password"`
}

func main() {
	router := gin.Default()
	router.POST("/doLogin", func(c *gin.Context) {
		var userinfo Userinfo
		if err := c.ShouldBind(&userinfo); err == nil {
			c.JSON(http.StatusOK, userinfo)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
	})
	router.Run(":8080")
}
```

返回数据

```json
{
    "user": "zhangsan",
    "password": "123456"
}
```

- 获取 Post Xml 数据

在 API 的开发中，我们经常会用到 JSON 或 XML 来作为数据交互的格式，这个时候我们可以在 gin 中使用 c.GetRawData()获取数据。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<article>
<content type="string">我是张三</content>
<title type="string">张三</title>
</article>
```

```go
package main

import (
	"encoding/xml"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Article struct {
	Title   string `xml:"title"`
	Content string `xml:"content"`
}

func main() {
	router := gin.Default()
	router.POST("/xml", func(c *gin.Context) {
		b, _ := c.GetRawData() // 从 c.Request.Body 读取请求数据
		article := &Article{}
		if err := xml.Unmarshal(b, &article); err == nil {
			c.JSON(http.StatusOK, article)
		} else {
			c.JSON(http.StatusBadRequest, err.Error())
		}
	})
	router.Run(":8080")
}
```

### 简单的路由组

[https://gin-gonic.com/zh-cn/docs/routing/grouping-routes/](https://gin-gonic.com/zh-cn/docs/routing/grouping-routes/)

```go
```
