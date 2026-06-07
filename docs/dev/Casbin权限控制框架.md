## Casbin权限控制框架

### 简介

Casbin + JWT 是 gin 生态身份认证的最佳实践。

简单来说：这个用户，用这个方法，访问这个接口，允许吗？

```
sub（谁） + obj（访问哪个接口） + act（用什么方法）
```

### 项目结构

```cmd
PS C:\Users\kk\Desktop\CasbinDemo> tree /F
文件夹 PATH 列表
卷序列号为 AA59-C1A0
C:.
    casbin.db
    go.mod
    go.sum
    main.go
    model.conf
```

main.go

```go
package main

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"github.com/casbin/casbin/v3"
	gormadapter "github.com/casbin/gorm-adapter/v3"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// ================= JWT =================

var jwtKey = []byte("secret-key")

type Claims struct {
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateToken(username, role string) (string, error) {
	claims := Claims{
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}

func ParseToken(tokenStr string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}
	return nil, fmt.Errorf("invalid token")
}

// ================= Casbin =================

func InitCasbin() *casbin.Enforcer {
	db, err := gorm.Open(sqlite.Open("casbin.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	adapter, err := gormadapter.NewAdapterByDB(db)
	if err != nil {
		panic(err)
	}

	e, err := casbin.NewEnforcer("model.conf", adapter)
	if err != nil {
		panic(err)
	}

	// 加载数据库里的策略
	e.LoadPolicy()

	// 如果第一次运行没有数据，就初始化
	_, _ = e.AddPolicy("admin", "/data1", "GET")
	_, _ = e.AddPolicy("admin", "/data2", "GET")
	_, _ = e.AddPolicy("user", "/data2", "GET")

	_ = e.SavePolicy()

	return e
}

// ================= Middleware =================

func AuthMiddleware(e *casbin.Enforcer) gin.HandlerFunc {
	return func(c *gin.Context) {

		tokenStr := c.GetHeader("Authorization")
		if tokenStr == "" {
			c.JSON(401, gin.H{"msg": "no token"})
			c.Abort()
			return
		}

		claims, err := ParseToken(tokenStr)
		if err != nil {
			c.JSON(401, gin.H{"msg": "invalid token"})
			c.Abort()
			return
		}

		sub := claims.Role
		obj := c.Request.URL.Path
		act := c.Request.Method

		ok, err := e.Enforce(sub, obj, act)
		if err != nil {
			c.JSON(500, gin.H{"msg": err.Error()})
			c.Abort()
			return
		}

		if !ok {
			c.JSON(403, gin.H{"msg": "forbidden"})
			c.Abort()
			return
		}

		c.Set("user", claims.Username)
		c.Next()
	}
}

// ================= main =================

func main() {

	e := InitCasbin()

	r := gin.Default()

	// 登录
	r.POST("/login", func(c *gin.Context) {

		var req struct {
			User string `json:"user"`
			Role string `json:"role"`
		}

		if err := c.BindJSON(&req); err != nil {
			c.JSON(400, gin.H{"msg": "bad request"})
			return
		}

		token, _ := GenerateToken(req.User, req.Role)

		c.JSON(200, gin.H{
			"token": token,
		})
	})

	// 需要鉴权的路由
	auth := r.Group("/")
	auth.Use(AuthMiddleware(e))

	auth.GET("/data1", func(c *gin.Context) {
		c.JSON(200, gin.H{"msg": "data1 only admin"})
	})

	auth.GET("/data2", func(c *gin.Context) {
		c.JSON(200, gin.H{"msg": "data2 admin + user"})
	})

	r.Run(":8080")
}

```

model.conf

```
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && r.obj == p.obj && r.act == p.act
```

