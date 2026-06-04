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

- JSONP

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

有时候我们在使用模板语法的时候会不可避免的引入一下空格或者换行符，这样模板最终渲染出来的内容可能就和我们想的不一样，这个时候可以使用`{{-`语法去除模板内容左侧的所有空白符号， 使用`-}}`去除模板内容右侧的所有空白符号

```html
{{- .Name -}}
```

注意：-要紧挨`{{`和`}}`，同时与模板值之间需要使用空格分隔。

- 比较函数

布尔函数会将任何类型的零值视为假，其余视为真。

下面是定义为函数的二元比较运算的集合：

| 运算 | 描述                       |
| :--- | :------------------------- |
| eq   | 如果 arg1 == arg2 则返回真 |
| ne   | 如果 arg1 != arg2 则返回真 |
| lt   | 如果 arg1 &lt;  arg2 则返回真  |
| le   | 如果 arg1 &lt;= arg2 则返回真 |
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
| printfln | 即 `fmt.Sprintln`                                            |
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
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func loginEndpoint(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"action": "login"})
}

func submitEndpoint(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"action": "submit"})
}

func readEndpoint(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"action": "read"})
}

func main() {
	router := gin.Default()

	// Simple group: v1
	{
		v1 := router.Group("/v1")
		v1.POST("/login", loginEndpoint)
		v1.POST("/submit", submitEndpoint)
		v1.POST("/read", readEndpoint)
	}

	// Simple group: v2
	{
		v2 := router.Group("/v2")
		v2.POST("/login", loginEndpoint)
		v2.POST("/submit", submitEndpoint)
		v2.POST("/read", readEndpoint)
	}

	router.Run(":8080")
}
```

### Gin 路由文件 分组

demo04\main.go

```go
package main

import (
	"demo04/routes"

	"github.com/gin-gonic/gin"
)

type Userinfo struct {
	Username string `form:"username" json:"user"`
	Password string `form:"password" json:"password"`
}

func main() {
	router := gin.Default()
	routes.AdminRoutesInit(router)
	routes.ApiRoutesInit(router)
	routes.DefaultRoutesInit(router)
	router.Run(":8080")
}
```

demo04\routes\adminRoutes.go

```go
package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AdminRoutesInit(router *gin.Engine) {
	adminRouter := router.Group("/admin")
	{
		adminRouter.GET("/user", func(c *gin.Context) {
			c.String(http.StatusOK, "用户")
		})
		adminRouter.GET("/news", func(c *gin.Context) {
			c.String(http.StatusOK, "news")
		})
	}
}
```

demo04\routes\apitRoutes.go

```go
package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func ApiRoutesInit(router *gin.Engine) {
	apiRoute := router.Group("/api")
	{
		apiRoute.GET("/user", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"username": "张三",
				"age": 20})
		})
		apiRoute.GET("/news", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"title": "这是新闻"})
		})
	}
}
```

demo04\routes\defaultRoutes.go

```go
package routes

import (
	"github.com/gin-gonic/gin"
)

func DefaultRoutesInit(router *gin.Engine) {
	defaultRoute := router.Group("/")
	{
		defaultRoute.GET("/", func(c *gin.Context) {
			c.String(200, "首页")
		})
	}
}
```

## 八、Gin 中自定义控制器

### 控制器分组

当我们的项目比较大的时候有必要对我们的控制器进行分组

新建demo04\routes\adminRoutes.go

```go
package routes

import (
	"demo04/controller/admin"

	"github.com/gin-gonic/gin"
)

func AdminRoutesInit(router *gin.Engine) {
	adminRouter := router.Group("/admin")
	{
		adminRouter.GET("/user", admin.UserController{}.Index)
		adminRouter.GET("/user/add", admin.UserController{}.Add)
		adminRouter.GET("/news", admin.NewsController{}.Index)
	}
}
```

新建demo04\controller\admin\NewsController.go

```go
package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type NewsController struct {
}

func (n NewsController) Index(ctx *gin.Context) {
	ctx.String(http.StatusOK, "新闻首页")
}
```

新建demo04\controller\admin\UserController.go

```go
package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserController struct {
}

func (u UserController) Index(ctx *gin.Context) {
	ctx.String(http.StatusOK, "这是用户首页")
}
func (u UserController) Add(ctx *gin.Context) {
	ctx.String(http.StatusOK, "增加用户")
}
```

其他的api控制台和defaults控制器也这样创建

### 控制器的继承

新建demo04\controller\admin\BaseController.go

```go
package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type BaseController struct {
}

func (c BaseController) Success(ctx *gin.Context) {
	ctx.String(http.StatusOK, "成功")
}
func (c BaseController) Error(ctx *gin.Context) {
	ctx.String(http.StatusOK, "失败")
}
```

NewsController 继承 BaseController

继承后就可以调用控制器里面的公共方法了

```go
package admin

import (
	"github.com/gin-gonic/gin"
)

type NewsController struct {
	BaseController
}

func (n NewsController) Index(ctx *gin.Context) {
	n.Success(ctx)
}
```

## 九、Gin 中间件

Gin 框架允许开发者在处理请求的过程中，加入用户自己的钩子（Hook）函数。这个钩子函数就叫中间件，中间件适合处理一些公共的业务逻辑，比如登录认证、权限校验、数据分页、记录日志、耗时统计等。

通俗的讲：中间件就是匹配路由前和匹配路由完成后执行的一系列操作

### 路由中间件

- 初识中间件

Gin 中的中间件必须是一个 gin.HandlerFunc 类型，配置路由的时候可以传递多个func 回调函数，最后一个 func 回调函数前面触发的方法都可以称为中间件。

```go
package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func initMiddleware(ctx *gin.Context) {
	fmt.Println("我是一个中间件")
}
func main() {
	r := gin.Default()
	r.GET("/", initMiddleware, func(ctx *gin.Context) {
		ctx.String(200, "首页--中间件演示")
	})
	r.GET("/news", initMiddleware, func(ctx *gin.Context) {
		ctx.String(200, "新闻页面--中间件演示")
	})
	r.Run(":8080")
}
```

- ctx.Next()调用该请求的剩余处理程序

中间件里面加上 ctx.Next()可以让我们在路由匹配完成后执行一些操作。

比如我们统计一个请求的执行时间。

```go
package main

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

func initMiddleware(ctx *gin.Context) {
	fmt.Println("1-执行中中间件")
	start := time.Now().UnixNano()
	// 调用该请求的剩余处理程序
	ctx.Next()
	fmt.Println("3-程序执行完成 计算时间")
	// 计算耗时 Go 语言中的 Since()函数保留时间值，并用于评估与实际时间的差异
	end := time.Now().UnixNano()
	fmt.Println(end - start)
}
func main() {
	r := gin.Default()
	r.GET("/", initMiddleware, func(ctx *gin.Context) {
		fmt.Println("2-执行首页返回数据")
		// time.Sleep(time.Second)
		ctx.String(200, "首页--中间件演示")
	})
	r.GET("/news", initMiddleware, func(ctx *gin.Context) {
		ctx.String(200, "新闻页面--中间件演示")
	})
	r.Run(":8080")
}
```

- 一个路由配置多个中间件的执行顺序

```go
package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func initMiddlewareOne(ctx *gin.Context) {
	fmt.Println("initMiddlewareOne--1-执行中中间件")
	// 调用该请求的剩余处理程序
	ctx.Next()
	fmt.Println("initMiddlewareOne--2-执行中中间件")
}
func initMiddlewareTwo(ctx *gin.Context) {
	fmt.Println("initMiddlewareTwo--1-执行中中间件")
	// 调用该请求的剩余处理程序
	ctx.Next()
	fmt.Println("initMiddlewareTwo--2-执行中中间件")
}
func main() {
	r := gin.Default()
	r.GET("/", initMiddlewareOne, initMiddlewareTwo, func(ctx *gin.Context) {
		fmt.Println("执行路由里面的程序")
		ctx.String(200, "首页--中间件演示")
	})
	r.Run(":8080")
}
```

控制台内容：

```cmd
initMiddlewareOne--1-执行中中间件
initMiddlewareTwo--1-执行中中间件
执行路由里面的程序
initMiddlewareTwo--2-执行中中间件
initMiddlewareOne--2-执行中中间件
```

- c.Abort()--（了解）

Abort 是终止的意思， c.Abort() 表示终止调用该请求的剩余处理程序

```go
package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func initMiddlewareOne(ctx *gin.Context) {
	fmt.Println("initMiddlewareOne--1-执行中中间件")
	// 调用该请求的剩余处理程序
	ctx.Next()
	fmt.Println("initMiddlewareOne--2-执行中中间件")
}
func initMiddlewareTwo(ctx *gin.Context) {
	fmt.Println("initMiddlewareTwo--1-执行中中间件")
	// 终止调用该请求的剩余处理程序
	ctx.Abort()
	fmt.Println("initMiddlewareTwo--2-执行中中间件")
}
func main() {
	r := gin.Default()
	r.GET("/", initMiddlewareOne, initMiddlewareTwo, func(ctx *gin.Context) {
		fmt.Println("执行路由里面的程序")
		ctx.String(200, "首页--中间件演示")
	})
	r.Run(":8080")
}
```

控制台内容：

```cmd
initMiddlewareOne--1-执行中中间件
initMiddlewareTwo--1-执行中中间件
initMiddlewareTwo--2-执行中中间件
initMiddlewareOne--2-执行中中间件
```

### 全局中间件

```go
package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func initMiddleware(ctx *gin.Context) {
	fmt.Println("全局中间件 通过 r.Use 配置")
	// 调用该请求的剩余处理程序
	ctx.Next()
}
func main() {
	r := gin.Default()
	r.Use(initMiddleware)
	r.GET("/", func(ctx *gin.Context) {
		ctx.String(200, "首页--中间件演示")
	})
	r.GET("/news", func(ctx *gin.Context) {
		ctx.String(200, "新闻页面--中间件演示")
	})
	r.Run(":8080")
}
```

### 在路由分组中配置中间件

- 为路由组注册中间件有以下两种写法

写法 1：

```go
shopGroup := r.Group("/shop", StatCost())
{
shopGroup.GET("/index", func(c *gin.Context) {...})
... 
}
```

写法 2：

```go
shopGroup := r.Group("/shop")
shopGroup.Use(StatCost())
{
shopGroup.GET("/index", func(c *gin.Context) {...})
... 
}
```

- 分组路由 AdminRoutes.go 中配置中间件

```go
package routes

import (
	"demo04/controller/admin"
	"fmt"

	"github.com/gin-gonic/gin"
)

func initMiddleware(ctx *gin.Context) {
	fmt.Println("路由分组中间件")
	// 调用该请求的剩余处理程序
	ctx.Next()
}

func AdminRoutesInit(router *gin.Engine) {
	adminRouter := router.Group("/admin", initMiddleware)
	{
		adminRouter.GET("/user", admin.UserController{}.Index)
		adminRouter.GET("/user/add", admin.UserController{}.Add)
		adminRouter.GET("/news", admin.NewsController{}.Index)
	}
}
```

### 中间件和对应控制器之间共享数据

设置值

```go
ctx.Set("username", "张三")
```

获取值

```go
username, _ := ctx.Get("username")
```

中间件设置值

demo04\routes\adminRoutes.go

```go
package routes

import (
	"demo04/controller/admin"
	"fmt"

	"github.com/gin-gonic/gin"
)

func initMiddleware(ctx *gin.Context) {
	fmt.Println("路由分组中间件")
	ctx.Set("username", "张三")

	// 调用该请求的剩余处理程序
	ctx.Next()
}

func AdminRoutesInit(router *gin.Engine) {
	adminRouter := router.Group("/admin", initMiddleware)
	{
		adminRouter.GET("/user", admin.UserController{}.Index)
		adminRouter.GET("/user/add", admin.UserController{}.Add)
		adminRouter.GET("/news", admin.NewsController{}.Index)
	}
}
```

控制器获取值

demo04\controller\admin\UserController.go

```go
package admin

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserController struct {
}

func (u UserController) Index(ctx *gin.Context) {
	username, _ := ctx.Get("username")
	fmt.Println(username)
	ctx.String(http.StatusOK, "这是用户首页")
}
func (u UserController) Add(ctx *gin.Context) {
	ctx.String(http.StatusOK, "增加用户")
}
```

### 中间件注意事项

- gin 默认中间件

gin.Default()默认使用了 Logger 和 Recovery 中间件，其中：

1. Logger 中间件将日志写入 gin.DefaultWriter，即使配置了 GIN_MODE=release。
2. Recovery 中间件会 recover 任何 panic。如果有 panic 的话，会写入500 响应码。

如果不想使用上面两个默认的中间件，可以使用 gin.New()新建一个没有任何默认中间件的路由。

- gin 中间件中使用 goroutine

当在中间件或 handler 中启动新的 goroutine 时，不能使用原始的上下文（c *gin.Context），必须使用其只读副本（c.Copy()）

```go
package main

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

func initMiddleware(ctx *gin.Context) {
	fmt.Println("全局中间件 通过 r.Use 配置")
	// 调用该请求的剩余处理程序
	ctx.Next()
}
func main() {
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		cCp := c.Copy()
		go func() {
			// simulate a long task with time.Sleep(). 5 seconds
			time.Sleep(5 * time.Second)
			// 这里使用你创建的副本
			fmt.Println("Done! in path " + cCp.Request.URL.Path)
		}()
		c.String(200, "首页")
	})
	r.Run(":8080")
}
```

## 十、Gin 中自定义Model

如果我们的应用非常简单的话，我们可以在 Controller 里面处理常见的业务逻辑。但是如果我们有一个功能想在多个控制器、或者多个模板里面复用的话，那么我们就可以把公共的功能单独抽取出来作为一个模块（Model）。 Model 是逐步抽象的过程，一般我们会在Model 里面封装一些公共的方法让不同 Controller 使用，也可以在 Model 中实现和数据库打交道

### Model 里面封装公共的方法

新建 models/ tools.go

```go
package models

import (
	"crypto/md5"
	"fmt"
	"time"
)

// 时间戳间戳转换成日期
func UnixToDate(timestamp int64) string {
	t := time.Unix(int64(timestamp), 0)
	return t.Format("2006-01-02 15:04:05")
}

// 日期转换成时间戳 2020-05-02 15:04:05
func DateToUnix(str string) int64 {
	template := "2006-01-02 15:04:05"
	t, err := time.ParseInLocation(template, str, time.Local)
	if err != nil {
		return 0
	}
	return t.Unix()
}
func GetUnix() int64 {
	return time.Now().Unix()
}
func GetDate() string {
	template := "2006-01-02 15:04:05"
	return time.Now().Format(template)
}
func GetDay() string {
	template := "20060102"
	return time.Now().Format(template)
}
func Md5(str string) string {
	data := []byte(str)
	return fmt.Sprintf("%x\n", md5.Sum(data))
}
```

### 控制器中调用 Model

```go
package admin

import (
	"demo06/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserController struct {
}

func (u UserController) Index(ctx *gin.Context) {
	username, _ := ctx.Get("username")
	fmt.Println(username)
	ctx.String(http.StatusOK, "这是用户首页")
}
func (u UserController) Add(ctx *gin.Context) {
	day := models.GetDay()
	fmt.Println("day是：" + day)
	ctx.String(200, "首页")
}

```

### 调用 Model 注册全局模板函数

main.go

注册全局模板函数 注意顺序，注册模板函数需要在加载模板上面

```go
package main

import (
	"demo06/models"
	"demo06/routes"
	"text/template"

	"github.com/gin-gonic/gin"
)

type Userinfo struct {
	Username string `form:"username" json:"user"`
	Password string `form:"password" json:"password"`
}

func main() {
	router := gin.Default()
	router.SetFuncMap(template.FuncMap{
		"unixToDate": models.UnixToDate,
	})
	router.LoadHTMLGlob("templates/*")
	routes.AdminRoutesInit(router)
	routes.ApiRoutesInit(router)
	routes.DefaultRoutesInit(router)
	router.Run(":8080")
}
```

控制器

demo06\controller\admin\UserController.go

```go
package admin

import (
	"demo06/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserController struct {
}

func (u UserController) Index(ctx *gin.Context) {
	username, _ := ctx.Get("username")
	fmt.Println(username)
	ctx.String(http.StatusOK, "这是用户首页")
}
func (u UserController) Add(ctx *gin.Context) {
	day := models.GetDay()
	fmt.Println("day是：" + day)
	ctx.HTML(http.StatusOK, "templates/add.html", gin.H{
		"now": models.GetUnix(),
	})
	// ctx.String(200, "首页")
}
```

demo06\templates\add.html

```html
{{ define "templates/add.html" }}
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <h2>{{.now | unixToDate}}</h2>
    </body>
</html>
{{ end }}
```

### Golang Md5 加密

- 方法一

```go
package main

import (
	"crypto/md5"
	"fmt"
)

func main() {
	data := []byte("123456")
	has := md5.Sum(data)
	md5str := fmt.Sprintf("%x", has)
	fmt.Println(md5str)
}
```

- 方法二

```go
package main

import (
	"crypto/md5"
	"fmt"
	"io"
)

func main() {
	h := md5.New()
	io.WriteString(h, "123456")
	fmt.Printf("%x\n", h.Sum(nil))
}
```

## 十一、文件上传

注意：需要在上传文件的 form 表单上面需要加入 enctype="multipart/form-data"

### 单文件上传

[https://gin-gonic.com/zh-cn/docs/routing/upload-file/](https://gin-gonic.com/zh-cn/docs/routing/upload-file/)

官方示例：

```go
package main

import (
	"fmt"
	"log"
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	// Set a lower memory limit for multipart forms (default is 32 MiB)
	router.MaxMultipartMemory = 8 << 20 // 8 MiB

	router.POST("/upload", func(c *gin.Context) {
		// single file
		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		log.Println(file.Filename)

		// Upload the file to specific dst.
		dst := filepath.Join("./files/", filepath.Base(file.Filename))
		c.SaveUploadedFile(file, dst)

		c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	})

	router.Run(":8080")
}
```

项目中实现文件上传：

定义模板 需要在上传文件的 form 表单上面需要加入 enctype="multipart/form-data"

demo06\templates\admin.html

```html
<!-- 相当于给模板定义一个名字 define end 成对出现-->
{{ define "templates/admin.html" }}
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <form
            action="/admin/user/doAdd"
            method="post"
            enctype="multipart/form-data"
        >
            用户名： <input type="text" name="username" placeholder="用户名" />
            <br />
            <br />头 像：<input type="file" name="face" /><br />
            <br />
            <input type="submit" value="提交" />
        </form>
    </body>
</html>
{{ end }}
```

定义业务逻辑

demo06\controller\admin\UserController.go

```go
package admin

import (
	"fmt"
	"net/http"
	"path"

	"github.com/gin-gonic/gin"
)

type UserController struct {
}

func (u UserController) Index(ctx *gin.Context) {
	username, _ := ctx.Get("username")
	fmt.Println(username)
	ctx.String(http.StatusOK, "这是用户首页")
}
func (u UserController) Add(ctx *gin.Context) {
	ctx.HTML(http.StatusOK, "templates/admin.html", gin.H{})
	// ctx.String(200, "首页")
}

func (u UserController) DoAdd(ctx *gin.Context) {
	username := ctx.PostForm("username")
	file, err := ctx.FormFile("face")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	// 上传文件到指定的目录
	dst := path.Join("./static/upload", file.Filename)
	fmt.Println(dst)
	ctx.SaveUploadedFile(file, dst)
	ctx.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("'%s' uploaded!", file.Filename), "username": username})
}
```

添加路由方法

demo06\routes\adminRoutes.go

```go
package routes

import (
	"demo06/controller/admin"
	"fmt"

	"github.com/gin-gonic/gin"
)

func initMiddleware(ctx *gin.Context) {
	fmt.Println("路由分组中间件")
	ctx.Set("username", "张三")

	// 调用该请求的剩余处理程序
	ctx.Next()
}

func AdminRoutesInit(router *gin.Engine) {
	adminRouter := router.Group("/admin", initMiddleware)
	{
		adminRouter.GET("/user", admin.UserController{}.Index)
		adminRouter.GET("/user/add", admin.UserController{}.Add)
		adminRouter.POST("/user/doAdd", admin.UserController{}.DoAdd)
		adminRouter.GET("/news", admin.NewsController{}.Index)
	}
}
```

### 多文件上传--不同名字的多个文件

定义模板 需要在上传文件的 form 表单上面需要加入 enctype="multipart/form-data"

demo06\templates\admin.html

```html
<!-- 相当于给模板定义一个名字 define end 成对出现-->
{{ define "templates/admin.html" }}
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <form
            action="/admin/user/doAdd"
            method="post"
            enctype="multipart/form-data"
        >
            用户名： <input type="text" name="username" placeholder="用户名" />
            <br />
            <br />头 像 1：<input type="file" name="face1" /><br />
            <br />
            头 像 2：<input type="file" name="face2" /><br />
            <br />
            <input type="submit" value="提交" />
        </form>
    </body>
</html>
{{ end }}
```

定义业务逻辑

demo06\controller\admin\UserController.go

```go
package admin

import (
	"fmt"
	"net/http"
	"path"

	"github.com/gin-gonic/gin"
)

type UserController struct {
}

func (u UserController) Index(ctx *gin.Context) {
	username, _ := ctx.Get("username")
	fmt.Println(username)
	ctx.String(http.StatusOK, "这是用户首页")
}
func (u UserController) Add(ctx *gin.Context) {
	ctx.HTML(http.StatusOK, "templates/admin.html", gin.H{})
	// ctx.String(200, "首页")
}

func (c UserController) DoAdd(ctx *gin.Context) {
	username := ctx.PostForm("username")
	face1, err1 := ctx.FormFile("face1")
	face2, err2 := ctx.FormFile("face2")
	// 上传文件到指定的目录
	if err1 == nil {
		dst1 := path.Join("./static/upload", face1.Filename)
		ctx.SaveUploadedFile(face1, dst1)
	}
	if err2 == nil {
		dst2 := path.Join("./static/upload", face2.Filename)
		ctx.SaveUploadedFile(face2, dst2)
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "文件上传成功", "username": username})
	// ctx.String(200, username)
}
```

### 多文件上传--相同名字的多个文件

定义模板 需要在上传文件的 form 表单上面需要加入 enctype="multipart/form-data"

demo06\templates\admin.html

```html
<!-- 相当于给模板定义一个名字 define end 成对出现-->
{{ define "templates/admin.html" }}
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <form
            action="/admin/user/doAdd"
            method="post"
            enctype="multipart/form-data"
        >
            用户名： <input type="text" name="username" placeholder="用户名" />
            <br />
            <br />头 像 1：<input type="file" name="face[]" /><br />
            <br />
            头 像 2：<input type="file" name="face[]" /><br />
            <br />
            <input type="submit" value="提交" />
        </form>
    </body>
</html>
{{ end }}
```

定义业务逻辑

demo06\controller\admin\UserController.go

```go
package admin

import (
	"fmt"
	"net/http"
	"path"

	"github.com/gin-gonic/gin"
)

type UserController struct {
}

func (u UserController) Index(ctx *gin.Context) {
	username, _ := ctx.Get("username")
	fmt.Println(username)
	ctx.String(http.StatusOK, "这是用户首页")
}
func (u UserController) Add(ctx *gin.Context) {
	ctx.HTML(http.StatusOK, "templates/admin.html", gin.H{})
	// ctx.String(200, "首页")
}

func (c UserController) DoAdd(ctx *gin.Context) {
	username := ctx.PostForm("username")
	// Multipart form
	form, _ := ctx.MultipartForm()
	files := form.File["face[]"]
	// var dst;
	for _, file := range files {
		// 上传文件至指定目录
		dst := path.Join("./static/upload", file.Filename)
		ctx.SaveUploadedFile(file, dst)
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "文件上传成功", "username": username})
}
```

### 文件上传 按照日期存储

定义模板

demo06\templates\admin.html

```html
<!-- 相当于给模板定义一个名字 define end 成对出现-->
{{ define "templates/admin.html" }}
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <form
            action="/admin/user/doAdd"
            method="post"
            enctype="multipart/form-data"
        >
            用户名： <input type="text" name="username" placeholder="用户名" />
            <br />
            <br />头 像： <input type="file" name="face" /><br />
            <br />
            <input type="submit" value="提交" />
        </form>
    </body>
</html>
{{end}}
```

定义业务逻辑

demo06\controller\admin\UserController.go

```go
package admin

import (
	"demo06/models"
	"fmt"
	"net/http"
	"os"
	"path"
	"strconv"

	"github.com/gin-gonic/gin"
)

type UserController struct {
}

func (u UserController) Index(ctx *gin.Context) {
	username, _ := ctx.Get("username")
	fmt.Println(username)
	ctx.String(http.StatusOK, "这是用户首页")
}
func (u UserController) Add(ctx *gin.Context) {
	ctx.HTML(http.StatusOK, "templates/admin.html", gin.H{})
	// ctx.String(200, "首页")
}

func (c UserController) DoAdd(ctx *gin.Context) {
	username := ctx.PostForm("username")
	// 1、获取上传的文件
	file, err1 := ctx.FormFile("face")
	if err1 == nil {
		// 2、获取后缀名 判断类型是否正确 .jpg .png .gif .jpeg
		extName := path.Ext(file.Filename)
		allowExtMap := map[string]bool{".jpg": true, ".png": true, ".gif": true, ".jpeg": true}
		if _, ok := allowExtMap[extName]; !ok {
			ctx.String(200, "文件类型不合法")
			return
		}
		// 3、创建图片保存目录 static/upload/20200623
		day := models.GetDay()
		dir := "./static/upload/" + day
		if err := os.MkdirAll(dir, 0666); err != nil {
			fmt.Println(err)
		}
		// 4、生成文件名称 144325235235.png
		fileUnixName := strconv.FormatInt(models.GetUnix(), 10)
		// static/upload/20200623/144325235235.png
		saveDir := path.Join(dir, fileUnixName+extName)
		ctx.SaveUploadedFile(file, saveDir)
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "文件上传成功", "username": username})
	// ctx.String(200, username)
}
```

## 十二、Gin 中的JWT

### JWT介绍

JWT（JSON Web Token）是一种身份认证令牌。

登录成功后，服务器不会保存用户登录状态，而是生成一个 Token 返回给客户端。

### demo

main.go

```go
package main

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var Secret = []byte("hello-gin-jwt")

// 自定义 Claims
type MyClaims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// 生成 Access Token
func GenerateAccessToken(userID uint, username string) (string, error) {
	claims := MyClaims{
		UserID:   userID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(
				time.Now().Add(30 * time.Minute),
			),
			IssuedAt: jwt.NewNumericDate(time.Now()),
			Issuer:   "gin-demo",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(Secret)
}

// 登录接口
func Login(c *gin.Context) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	// 模拟数据库验证
	if username != "admin" || password != "123456" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"msg": "账号密码错误",
		})
		return
	}

	accessToken, err := GenerateAccessToken(1, username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"msg": "生成AccessToken失败",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token": accessToken,
	})
}

// JWT 中间件
func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {

		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"msg": "未登录",
			})
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)

		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"msg": "Authorization格式错误",
			})
			c.Abort()
			return
		}

		tokenString := parts[1]

		claims := &MyClaims{}

		token, err := jwt.ParseWithClaims(
			tokenString,
			claims,
			func(token *jwt.Token) (interface{}, error) {
				return Secret, nil
			},
		)

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"msg": "token无效或已过期",
			})
			c.Abort()
			return
		}

		// 保存用户信息到上下文
		c.Set("userID", claims.UserID)
		c.Set("username", claims.Username)

		c.Next()
	}
}

// 当前用户信息
func UserInfo(c *gin.Context) {
	userID, _ := c.Get("userID")
	username, _ := c.Get("username")

	c.JSON(http.StatusOK, gin.H{
		"user_id":  userID,
		"username": username,
	})
}

func main() {
	r := gin.Default()

	// 登录
	r.POST("/login", Login)

	// 受保护路由
	user := r.Group("/user")
	user.Use(JWTAuth())
	{
		user.GET("/info", UserInfo)
	}

	r.Run(":8080")
}
```

### 整体执行流程

```
客户端
    │
    │ POST /login
    ▼
登录接口 Login
    │
    │ 验证账号密码
    ▼
生成 JWT Token
    │
    ▼
返回 AccessToken

────────────────────

客户端
    │
    │ GET /user/info
    │ Authorization: Token
    ▼
JWTAuth中间件
    │
    │ 验证 Token
    ▼
UserInfo
    │
    ▼
返回数据
```

## 十三、redis

redis（Remote Dictionary Server）是一个开源的、基于内存的高性能键值存储系统，常被用作数据库、缓存和消息中间件。

### 初始化redis连接

```go
package main

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()

func main() {
	rdb := redis.NewClient(&redis.Options{
		Addr: "192.168.1.10:6379",
	})

	// 测试连接
	err := rdb.Set(ctx, "name", "tom", 0).Err()
	if err != nil {
		panic(err)
	}

	val, err := rdb.Get(ctx, "name").Result()
	if err != nil {
		panic(err)
	}

	fmt.Println("name =", val)
}
```

### 单点登录

jwt负责身份认证，redis负责登录状态控制，实现单点登录

```go
package main

import (
	"context"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

var (
	Secret = []byte("gin-jwt-secret")
	ctx    = context.Background()

	rdb = redis.NewClient(&redis.Options{
		Addr: "192.168.1.10:6379",
	})
)

// ================= JWT Claims =================

type MyClaims struct {
	UserID uint   `json:"user_id"`
	JTI    string `json:"jti"`
	jwt.RegisteredClaims
}

// ================= Redis Key =================

func getKey(userID uint) string {
	return "login:user:" + strconv.FormatUint(uint64(userID), 10)
}

// ================= 生成 Token =================

func GenerateToken(userID uint) (string, string, error) {
	jti := uuid.NewString()

	claims := MyClaims{
		UserID: userID,
		JTI:    jti,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(30 * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "gin-demo",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenStr, err := token.SignedString(Secret)
	return tokenStr, jti, err
}

// ================= 登录（单点登录核心） =================

func Login(c *gin.Context) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	if username != "admin" || password != "123456" {
		c.JSON(401, gin.H{"msg": "账号或密码错误"})
		return
	}

	userID := uint(1)

	token, jti, err := GenerateToken(userID)
	if err != nil {
		c.JSON(500, gin.H{"msg": "生成token失败"})
		return
	}

	// ⭐ 写 Redis（覆盖旧登录，实现单点登录）
	err = rdb.Set(ctx, getKey(userID), jti, 30*time.Minute).Err()
	if err != nil {
		c.JSON(500, gin.H{"msg": "Redis写入失败"})
		return
	}

	c.JSON(200, gin.H{
		"token": token,
	})
}

// ================= JWT 中间件 =================

func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {

		auth := c.GetHeader("Authorization")
		if auth == "" {
			c.JSON(401, gin.H{"msg": "未登录"})
			c.Abort()
			return
		}

		parts := strings.SplitN(auth, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(401, gin.H{"msg": "Authorization格式错误"})
			c.Abort()
			return
		}

		tokenStr := parts[1]

		claims := &MyClaims{}

		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
			return Secret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(401, gin.H{"msg": "token无效"})
			c.Abort()
			return
		}

		// ⭐ Redis 校验是否是最新登录
		storedJTI, err := rdb.Get(ctx, getKey(claims.UserID)).Result()

		if err != nil || storedJTI != claims.JTI {
			c.JSON(401, gin.H{
				"msg": "账号已在其他地方登录",
			})
			c.Abort()
			return
		}

		c.Set("userID", claims.UserID)
		c.Next()
	}
}

// ================= 踢人下线 =================

func Kick(c *gin.Context) {
	userID := uint(1)

	rdb.Del(ctx, getKey(userID))

	c.JSON(200, gin.H{
		"msg": "已踢下线",
	})
}

// ================= 用户信息 =================

func UserInfo(c *gin.Context) {
	userID, _ := c.Get("userID")

	c.JSON(200, gin.H{
		"user_id": userID,
	})
}

// ================= main =================

func main() {
	r := gin.Default()

	r.POST("/login", Login)
	r.POST("/kick", Kick)

	user := r.Group("/user")
	user.Use(JWTAuth())
	{
		user.GET("/info", UserInfo)
	}

	r.Run(":8080")
}
```

## 十四、GORM

### GORM 简单介绍

GORM 是 Golang 的一个 orm 框架。简单说，ORM 就是通过实例对象的语法，完成关系型数据库的操作的技术，是"对象-关系映射"（Object/Relational Mapping）的缩写。使用ORM框架可以让我们更方便的操作数据库。

官方支持的数据库有：MySQL, PostgreSQL, GaussDB, SQLite, SQL Server TiDB, and Oracle Database

| 数据库             | GORM/Go             |
| ------------------ | ------------------- |
| 数据库(Database)   | `*gorm.DB` 连接对象 |
| 数据表(Table)      | 结构体(Type)        |
| 数据行(Row/Record) | 结构体实例(Value)   |
| 字段(Column)       | 结构体字段(Field)   |

### 传统 API

```go
package main

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Code  string
	Price uint
}

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("连接数据库失败")
	}

	// 自动建表
	db.AutoMigrate(&Product{})

	// 创建
	db.Create(&Product{Code: "D42", Price: 100})

	// 查询
	var product Product
	db.First(&product, 1)                 // 查找对应主键的产品
	db.First(&product, "code = ?", "D42") // 查找 code 为 D42 的所有产品

	// 更新 - 将产品价格更新为 200
	db.Model(&product).Update("Price", 200)
	// 更新 - 更新多个字段
	db.Model(&product).Updates(Product{Price: 200, Code: "F42"}) // 仅更新非零字段
	db.Model(&product).Updates(map[string]interface{}{"Price": 200, "Code": "F42"})

	// 删除 - 删除产品
	db.Delete(&product, 1)
}
```

### 泛型 API

泛型 API更安全，等学会了传统api再学

```go
package main

import (
  "context"
  "gorm.io/driver/sqlite"
  "gorm.io/gorm"
)

type Product struct {
  gorm.Model
  Code  string
  Price uint
}

func main() {
  db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
  if err != nil {
    panic("连接数据库失败")
  }

  ctx := context.Background()

  // 自动建表
  db.AutoMigrate(&Product{})

  // 创建
  err = gorm.G[Product](db).Create(ctx, &Product{Code: "D42", Price: 100})

  // 查询
  product, err := gorm.G[Product](db).Where("id = ?", 1).First(ctx) // 查找对应主键的产品
  products, err := gorm.G[Product](db).Where("code = ?", "D42").Find(ctx) // 查找 code 为 D42 的所有产品

  // 更新 - 将产品价格更新为 200
  err = gorm.G[Product](db).Where("id = ?", product.ID).Update(ctx, "Price", 200)
  // 更新 - 更新多个字段
  err = gorm.G[Product](db).Where("id = ?", product.ID).Updates(ctx, Product{Code: "D42", Price: 100})

  // 删除 - 删除产品
  err = gorm.G[Product](db).Where("id = ?", product.ID).Delete(ctx)
}
```

### 创建

```go
package main

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// Product 对应数据库中的 products 表
type Product struct {
	// gorm.Model 是 GORM 内置的模型结构体，包含：
	// ID、CreatedAt、UpdatedAt、DeletedAt
	// 如果不需要这些字段，也可以自己定义主键和其他字段
	gorm.Model

	Code string

	// 可以通过 tag 设置数据库字段约束
	// default: 默认值
	// unique: 唯一约束
	Price uint `gorm:"default:88"`
}

func main() {
	// 连接当前目录下的 test.db SQLite 数据库
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	// 根据 Product 结构体自动创建或更新表结构
	// 如果表不存在则创建
	// 如果缺少字段则添加
	// 不会删除已有字段
	err = db.AutoMigrate(&Product{})
	if err != nil {
		panic(err)
	}

	// 创建一个 Product 实例
	u := Product{
		Code: "go",
		// Price 未赋值
		// 数据库会使用默认值 88
	}

	// 将结构体数据插入数据库
	result := db.Create(&u)

	if result.Error != nil {
		fmt.Println("插入失败:", result.Error)
		return
	}

	fmt.Println("插入成功")

	// Create 执行后，数据库生成的数据会自动回填到结构体中
	// 例如：
	// ID
	// CreatedAt
	// UpdatedAt
	// Price（默认值）
	fmt.Printf("%+v\n", u)

	// RowsAffected 表示受影响的行数
	fmt.Println("受影响行数:", result.RowsAffected)
}
```

### 查询

- 查询表中第一条记录（按主键升序）

```go
package main

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model

	Code  string
	Price uint `gorm:"default:88"`
}

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	err = db.AutoMigrate(&Product{})
	if err != nil {
		panic(err)
	}

	// 创建一个 Product 指针，用于接收查询结果
	u := new(Product)

	// 查询表中的第一条记录（按主键升序）
	// 等价于：
	// SELECT * FROM products ORDER BY id LIMIT 1;
	result := db.First(u)

	// 判断查询是否出错
	if result.Error != nil {
		fmt.Println("查询失败:", result.Error)
		return
	}

	fmt.Println("查询成功")

	// 打印查询到的数据
	fmt.Printf("%+v\n", *u)

	// RowsAffected 表示查询到的记录数
	fmt.Println("记录数量:", result.RowsAffected)
}
```

- 单个条件查询

仅返回第一个记录

```go
package main

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model

	Code  string
	Price uint `gorm:"default:88"`
}

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	err = db.AutoMigrate(&Product{})
	if err != nil {
		panic(err)
	}

	// 用于接收查询结果
	var product Product

	// 查询 code = "golang" 的第一条记录
	result := db.Where("code = ?", "golang").First(&product)

	// 判断是否查询成功
	if result.Error != nil {
		fmt.Println("查询失败:", result.Error)
		return
	}

	fmt.Println("查询成功")

	// 打印查询结果
	fmt.Printf("%+v\n", product)

	// 查询到的记录数
	fmt.Println("记录数量:", result.RowsAffected)
}
```

- 单个条件查询

返回所有记录

```go
package main

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model

	Code  string
	Price uint `gorm:"default:88"`
}

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	err = db.AutoMigrate(&Product{})
	if err != nil {
		panic(err)
	}

	// 用于接收查询结果
	var products []Product

	// 查询所有 code = "golang" 的记录
	result := db.Where("code = ?", "golang").Find(&products)

	// 检查错误
	if result.Error != nil {
		fmt.Println("查询失败:", result.Error)
		return
	}

	fmt.Println("查询成功")

	// 打印记录数量
	fmt.Println("查询到记录数:", result.RowsAffected)

	// 遍历打印结果
	for i, p := range products {
		fmt.Printf("第%d条记录: %+v\n", i+1, p)
	}
}
```

- 多条件查询

```go
package main

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model

	Code  string
	Price uint `gorm:"default:88"`
}

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	err = db.AutoMigrate(&Product{})
	if err != nil {
		panic(err)
	}

	// 用切片接收多条记录
	var products []Product

	// 查询 code=golang 且 price=88 的所有记录
	result := db.Where(
		"code = ? AND price = ?",
		"golang",
		88,
	).Find(&products)

	// 检查查询错误
	if result.Error != nil {
		fmt.Println("查询失败:", result.Error)
		return
	}

	fmt.Println("查询成功")
	fmt.Println("记录数量:", result.RowsAffected)

	// 遍历输出查询结果
	for i, p := range products {
		fmt.Printf("第%d条记录: %+v\n", i+1, p)
	}
}
```

### 更新

- 更新表中第一条记录

```go
package main

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model

	Code  string
	Price uint `gorm:"default:88"`
}

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	err = db.AutoMigrate(&Product{})
	if err != nil {
		panic(err)
	}

	// ===== 更新操作 =====

	// 获取 id=1 的记录
	u := new(Product)
	db.First(u) //

	// 修改字段
	u.Code = "java"
	u.Price = 23

	// 保存到数据库（全量更新）
	result := db.Save(u)

	// 错误判断
	if result.Error != nil {
		fmt.Println("更新失败:", result.Error)
		return
	}

	fmt.Println("更新成功")

	// 打印更新后的对象
	fmt.Printf("%+v\n", *u)

	// 影响行数
	fmt.Println("数据库中更新的行数:", result.RowsAffected)
}
```

- 仅更新单个字段

```go
package main

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model

	Code  string
	Price uint `gorm:"default:88"`
}

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	err = db.AutoMigrate(&Product{})
	if err != nil {
		panic(err)
	}

	// ===== 更新 id=2 的记录 =====
	result := db.Model(&Product{}).
		Where("id = ?", 2).
		Updates(map[string]interface{}{
			"code": "golang2",
		})

	if result.Error != nil {
		fmt.Println("更新失败:", result.Error)
		return
	}

	fmt.Println("更新成功")
	fmt.Println("受影响行数:", result.RowsAffected)
}
```

- 批量更新

```go
package main

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Code  string
	Price int `gorm:"default:88"`
}

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	err = db.AutoMigrate(&Product{})
	if err != nil {
		panic(err)
	}

	// ===== 更新所有记录的 price =====
	result := db.Model(&Product{}).
		Where("1 = 1").
		Update("price", 99)

	if result.Error != nil {
		fmt.Println("更新失败:", result.Error)
		return
	}

	fmt.Println("更新成功")
	fmt.Println("影响行数:", result.RowsAffected)
}
```

### 删除

- 软删除

软删除并不删除数据。

只是给数据打一个"已删除"标记。

```go
package main

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Code  string
	Price int `gorm:"default:88"`
}

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	err = db.AutoMigrate(&Product{})
	if err != nil {
		panic(err)
	}

	// 删除所有 Code 为 golang 的记录
	result := db.Where("code = ?", "golang").Delete(&Product{})

	if result.Error != nil {
		fmt.Println("删除失败:", result.Error)
		return
	}

	fmt.Println("删除成功")
	fmt.Println("影响行数:", result.RowsAffected)
}
```

- 硬删除

真正从数据库中删除

```go
package main

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Code  string
	Price int `gorm:"default:88"`
}

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	err = db.AutoMigrate(&Product{})
	if err != nil {
		panic(err)
	}

	// 物理删除所有 Code=golang 的记录
	result := db.Unscoped().
		Where("code = ?", "golang").
		Delete(&Product{})

	if result.Error != nil {
		fmt.Println("删除失败:", result.Error)
		return
	}

	fmt.Println("删除成功")
	fmt.Println("删除行数:", result.RowsAffected)
}
```

## 十五、viper

### viper库

Viper 是 Go 语言中用于处理配置文件的库，支持多种格式（如 JSON、YAML、环境变量等）的读取、监听和默认值设置。

### 项目结构

```cmd
PS C:\Users\kk\Desktop\gin-code\demo09> tree /F
文件夹 PATH 列表
卷序列号为 AA59-C1A0
C:.
│  config.yaml
│  go.mod
│  go.sum
│  main.go
│
└─config
```

### 项目代码

demo09\main.go

```go
package main

import (
	"demo09/config"
	"fmt"

	"github.com/spf13/viper"
)

func main() {
	config.InitConfig()

	fmt.Println("应用名:", config.Cfg.App.Name)
	fmt.Println("端口:", config.Cfg.App.Port)

	fmt.Println("数据库:", config.Cfg.DB.Host)

	//真实项目常常用直接获取
	fmt.Println(viper.GetInt("app.port"))
}
```

demo09\config.yaml

```yaml
app:
  name: my-go-app
  port: 8080

db:
  host: 127.0.0.1
  user: root
  password: 123456
```

demo09\config\config.go

```go
package config

import (
	"fmt"

	"github.com/spf13/viper"
)

type Config struct {
	App AppConfig
	DB  DBConfig
}

type AppConfig struct {
	Name string
	Port int
}

type DBConfig struct {
	Host     string
	User     string
	Password string
}

var Cfg Config

func InitConfig() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")

	// 读取配置文件
	if err := viper.ReadInConfig(); err != nil {
		panic(fmt.Errorf("读取配置失败: %v", err))
	}

	// 绑定到结构体
	err := viper.Unmarshal(&Cfg)
	if err != nil {
		panic(fmt.Errorf("解析配置失败: %v", err))
	}
}
```

运行结果：

```cmd
PS C:\Users\kk\Desktop\gin-code\demo09> go run main.go
应用名: my-go-app
端口: 8080
数据库: 127.0.0.1
8080
```

## 十六、Gin项目结构

### 项目结构

```cmd
PS C:\Users\kk\Desktop\gin-code\demo10> tree /F
文件夹 PATH 列表
卷序列号为 AA59-C1A0
C:.
│  go.mod
│  go.sum
│  main.go
│  test.db
│
├─config
│      config.go
│      config.yaml
│
├─controller
│      user_controller.go
│
├─dao
│      user_dao.go
│
├─global
│      global.go
│
├─initialize
│      gorm.go
│      viper.go
│
├─model
│      user.go
│
├─router
│      router.go
│
└─service
        user_service.go
```

### 启动入口

demo10\main.go

```go
package main

import (
	"fmt"

	"demo10/global"
	"demo10/initialize"
	"demo10/router"
)

func main() {
	// 1. 初始化配置
	initialize.InitViper()

	// 2. 初始化数据库
	initialize.InitGorm()

	// 3. 初始化路由
	r := router.InitRouter()

	port := global.Config.Server.Port
	fmt.Printf("Server running at :%d\n", port)

	r.Run(fmt.Sprintf(":%d", port))
}
```

### 路由

demo10\router\router.go

```go
package router

import (
	"demo10/controller"

	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
	r := gin.Default()

	api := r.Group("/api")
	{
		api.GET("/users", controller.GetUsers)
		api.POST("/user", controller.CreateUser)
	}

	return r
}
```

### Controller 层

demo10\controller\user_controller.go

```go
package controller

import (
	"net/http"
	"strconv"

	"demo10/service"

	"github.com/gin-gonic/gin"
)

func CreateUser(c *gin.Context) {
	name := c.Query("name")
	age, _ := strconv.Atoi(c.Query("age"))

	err := service.CreateUser(name, age)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"msg": "ok"})
}

func GetUsers(c *gin.Context) {
	users, _ := service.GetUsers()
	c.JSON(http.StatusOK, users)
}
```

### Service 层

demo10\service\user_service.go

```go
package service

import (
	"demo10/dao"
	"demo10/model"
)

func CreateUser(name string, age int) error {
	return dao.CreateUser(model.User{
		Name: name,
		Age:  age,
	})
}

func GetUsers() ([]model.User, error) {
	return dao.GetUsers()
}
```

### DAO 层

demo10\dao\user_dao.go

```go
package dao

import (
	"demo10/global"
	"demo10/model"
)

func CreateUser(user model.User) error {
	return global.DB.Create(&user).Error
}

func GetUsers() ([]model.User, error) {
	var users []model.User
	err := global.DB.Find(&users).Error
	return users, err
}
```

### 全局变量

demo10\global\global.go

```go
package global

import (
	"demo10/config"

	"gorm.io/gorm"
)

var (
	Config config.Config
	DB     *gorm.DB
)
```

### 模型层

demo10\model\user.go

```go
package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name string
	Age  int
}
```

### config 结构体

demo10\config\config.go

```go
package config

type Config struct {
	Server ServerConfig
	DB     DBConfig
}

type ServerConfig struct {
	Port int
}

type DBConfig struct {
	Driver string
	Source string
}
```

### 配置文件

demo10\config\config.yaml

```yaml
server:
  port: 8080

db:
  driver: sqlite
  source: test.db
```

### GORM 初始化

demo10\initialize\gorm.go

```go
package initialize

import (
	"fmt"

	"demo10/global"
	"demo10/model"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func InitGorm() {
	var db *gorm.DB
	var err error

	switch global.Config.DB.Driver {
	case "sqlite":
		db, err = gorm.Open(sqlite.Open(global.Config.DB.Source), &gorm.Config{})
	default:
		panic("不支持的数据库类型")
	}

	if err != nil {
		panic(fmt.Errorf("数据库连接失败: %v", err))
	}

	// 自动建表
	db.AutoMigrate(&model.User{})

	global.DB = db
}
```

### Viper 初始化

demo10\initialize\viper.go

```go
package initialize

import (
	"fmt"

	"demo10/global"

	"github.com/spf13/viper"
)

func InitViper() {
	v := viper.New()
	v.SetConfigFile("config/config.yaml")

	if err := v.ReadInConfig(); err != nil {
		panic(fmt.Errorf("读取配置失败: %v", err))
	}

	if err := v.Unmarshal(&global.Config); err != nil {
		panic(fmt.Errorf("解析配置失败: %v", err))
	}
}
```

