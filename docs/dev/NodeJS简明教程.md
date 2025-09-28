# NodeJS简明教程

B站免费教程：https://www.bilibili.com/video/BV1GCoBY7ES3

配套代码：https://github.com/13RTK/nodejs-concise-course

很感谢 HDAlex_John 的分享

## 一、读写文件

### 1.1 读文件

main.js

```js
import {readFile} from 'node:fs/promises'

const data = await readFile('data.json', 'utf8')

console.log(data);
```

data.json

```
[
    {
        "name": "Laravel",
        "tag:": "PHP"
    },
    {
        "name": "Django",
        "tag": "Python"
    },
    {
        "name": "Express",
        "tag": "Node.js"
    }
]
```

### 1.2 写文件

- 覆盖写入

main.js

```js
import {writeFile} from 'node:fs/promises'

await writeFile('data.json', 'test','utf8');
```

- 追加内容

\n 换行

main.js

```js
import {appendFile} from 'node:fs/promises'

await appendFile('data.json', '\ntest','utf8');
```

## 二、同步与异步

CJS是同步加载的，ESM是异步加载的

### 2.1 异步执行

- 传统回调风格（callback）

main.js

```js
import { readFile } from 'node:fs';

readFile('data.json', 'utf8', (err, data) => {
    if(err){
        console.log(err.message);
        
    }
    console.log(data);
    
})
```

- Promise/async 风格

main.js

```js
import { readFile } from 'node:fs/promises';

try {
    const data = await readFile('data.json', 'utf8'); // 异步+await
    console.log(data);
} catch (err) {
    console.error('捕获到错误:', err.message);
}
```

### 2.2 同步执行

main.js

```js
import { readFileSync } from 'node:fs';

try {
    const data = readFileSync('data.json', 'utf8'); // 同步读取
    console.log(data);
} catch (err) {
    console.error(err.message);
}
```

### 2.3 凯撒加密练习

凯撒加密（Caesar Cipher）是一种最古老、最简单的加密方法，它属于替换加密（Substitution Cipher）的一种。

它的核心思想是：把字母表里的字母按照固定的位移量（shift）进行移动，超出范围的从头开始循环

main.js

```js
import { readFile, writeFile } from 'node:fs/promises'

// ---------------------------
// 1. 读取文件内容
// ---------------------------

// 读取加密的数据文件 data.txt，编码为 utf-8，返回字符串
const data = await readFile('data.txt', 'utf-8')

// 读取密钥文件 keychain.txt，编码为 utf-8，返回字符串
const keychain = await readFile('keychain.txt', 'utf-8')

// 注意：keychain 读出来是字符串，如果要做位移计算，需要先转成数字
// const shift = parseInt(keychain, 10); // 建议加这一行确保正确
// 这里为了保持原代码逻辑，暂时直接用 keychain

// ---------------------------
// 2. 解密数据
// ---------------------------

// 把加密数据拆分成字符数组，逐个处理
const leftdecryptedData = data
  .split('')   // 将字符串拆成单个字符数组
  .map((currentChar) => {
    // 获取当前字符的 Unicode 编码（charCode）
    const decryptedCharCode = currentChar.charCodeAt(0) - keychain
    // 将解密后的编码转换回字符
    return String.fromCharCode(decryptedCharCode)
  })
  .join('') // 将字符数组重新拼接成完整字符串

// ---------------------------
// 3. 写入解密后的数据
// ---------------------------

// 将解密后的字符串写入新文件 decryptedData.txt，编码为 utf-8
await writeFile('decryptedData.txt', leftdecryptedData, 'utf-8')
```

data.txt

```txt
GVE^]1XLYVWHE]1Z1QI1JMJX]
```

keychain.txt

```txt
4
```

decryptedData.txt

```txt
CRAZY-THURSDAY-V-ME-FIFTY
```

### 2.4 输入输出

main.js

```js
// 从 node:readline/promises 模块中导入 createInterface，用于创建支持 Promise 的命令行交互接口
import { createInterface } from 'node:readline/promises';
// 从 node:process 模块导入标准输入 stdin 和标准输出 stdout
import { stdin, stdout } from 'node:process';

// 创建一个 readline 接口，绑定到标准输入输出
const readLine = createInterface({
    input: stdin,   // 用户在终端输入
    output: stdout  // 程序在终端输出
});

// 询问用户姓名，await 等待用户输入完成后返回字符串
const name = await readLine.question("What's your name?\n");

// 询问用户年龄
const age = await readLine.question("How old are you?\n");

// 计算用户的出生年份 = 当前年份 - 年龄
const birthYear = new Date().getFullYear() - Number(age);

// 再次询问用户确认出生年份是否正确
const answer = await readLine.question(`Welcome: ${name}, your birth year is ${birthYear} right?(y/n)\n`);

// 如果用户输入的第一个字符不是 Y/y，则认为年份不正确
if (answer[0].toUpperCase() !== 'Y') {
    // 输出一个“我猜你比这个年份还早一年出生”的消息
    console.log(`I know, you were born at ${birthYear - 1}!`);
}

// 关闭 readline 接口，结束输入
readLine.close();
```

## 三、服务器

###  3.1 搭建http服务器

main.js

```js
// ---------------------------
// 使用 ESM 模块语法创建 HTTP 服务器
// ---------------------------

import { createServer } from 'node:http';

// 创建 HTTP 服务器，每当有请求到来时执行回调函数
const server = createServer((req, res) => {

  // 设置响应头，状态码 200 表示成功，Content-Type 表示纯文本
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // 发送响应内容，并结束响应
  res.end('Hello World!\n');
});

// 启动服务器，监听本地 IP 127.0.0.1 的 3000 端口
server.listen(3000, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
```

### 3.2 初识路由

路由（Routing）指的是根据不同的请求 URL 和请求方法，把请求分发到对应的处理逻辑。

通俗点说：路由就是决定 “客户端访问了什么路径，服务器应该做什么” 的规则。

main.js

```js
// 导入 Node.js 内置 http 模块，用于创建 HTTP 服务器
import { createServer } from 'node:http';
// 导入 Node.js 内置 fs/promises 模块，用于以 Promise 方式读取文件
import { readFile } from 'node:fs/promises';

// 创建 HTTP 服务器，接收请求对象 req 和响应对象 res
// 这里回调函数用 async，是因为我们要用 await 读取文件
const server = createServer(async (req, res) => {

    // ---------------------------
    // 当访问根路径 "/" 时，返回 HTML 文件
    // ---------------------------
    if (req.url === '/') {
        // 设置响应头，200 表示请求成功，Content-Type 为 text/html
        res.writeHead(200, { 'Content-Type': 'text/html' });

        // 读取当前目录下的 index.html 文件，编码为 utf-8
        const htmlFile = await readFile('./index.html', "utf-8");

        // 把读取到的 HTML 内容返回给客户端
        res.end(htmlFile);
    }

    // ---------------------------
    // 当访问 "/data" 路径时，返回 JSON 文件
    // ---------------------------
    if (req.url === '/data') {
        // 设置响应头，Content-Type 为 application/json，表示返回 JSON 数据
        res.writeHead(200, { 'Content-Type': 'application/json' });

        // 读取当前目录下的 data.json 文件，编码为 utf-8
        const jsonData = await readFile('./data.json', "utf-8");

        // 把 JSON 数据返回给客户端
        res.end(jsonData);
    }
});

// 启动服务器，监听 127.0.0.1 的 3000 端口
// 回调函数会在服务器启动成功后执行
server.listen(3000, '127.0.0.1', () => {
    console.log('Listening on 127.0.0.1:3000'); // 控制台输出提示信息
});
```

index.html

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML File</title>
</head>
<body>
    <h1>Hello World!!!</h1>

    <input type="text">
</body>
</html></h5>
```

data.json

```json
[
    {
        "name": "Laravel",
        "tag:": "PHP"
    },
    {
        "name": "Django",
        "tag": "Python"
    },
    {
        "name": "Express",
        "tag": "Node.js"
    }
]
```

### 3.3 spa和ssr服务架构

- spa单页应用

是在用户的浏览器里“现场”组装页面

- ssr服务端渲染

服务器“预先做好”整个页面再送给用户

### 3.4 express框架

express官网：[Express - Node.js web application framework](https://expressjs.com/)

- 安装express

```shell
npm i express
```

main.js

```js
// 导入 express 框架
import express from 'express'

// 创建一个 Express 应用实例
const app = express()

// 定义服务器监听的端口号
const port = 3000

// 定义一个 GET 请求的路由
// 当用户访问根路径（'/'）时，服务器返回 "Hello World!" 文本
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// 启动服务器，监听指定端口
// 当服务器成功启动后，在控制台输出提示信息
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

package.json添加 "type": "module", 以便使用esm语法

```json
{
  "type": "module",
  "name": "express-learn",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "express": "^5.1.0"
  }
}
```

### 3.5 基础路由

使用express来实现get查询

server.js

```js
// 导入 express 框架
import express from 'express'
// 导入 Node.js 内置的 fs/promises 模块，用于异步读取文件
import { readFile } from 'fs/promises'

// 创建一个 Express 应用实例
const app = express()

// 设置服务器监听的端口
const port = 3000

// 定义一个 GET 请求路由，路由参数为 idolName
// 例如访问 http://127.0.0.1:3000/Lisa 时，idolName 就是 "Lisa"
app.get('/:idolName', async (req, res) => {
    // 从 URL 参数中获取 idolName
    const idolName = req.params.idolName

    // 读取本地 JSON 文件，utf-8 表示读取为字符串
    const idolDataText = await readFile('./data.json', 'utf-8')
    // 将读取到的 JSON 字符串解析为 JavaScript 对象
    const idolData = JSON.parse(idolDataText)

    // 在 idolData 中查找名字与 URL 参数匹配的对象（忽略大小写）
    const resultIdol = idolData.find(
        (idol) => idol.name.toLowerCase() === idolName.toLowerCase()
    )

    // 如果没找到，返回 404 状态码和提示信息
    if (!resultIdol) {
        return res.status(404).send('404 Not Found')
    }

    // 找到匹配数据，返回 200 状态码和 JSON 数据
    return res.status(200).json(resultIdol)
})

// 启动服务器，监听指定端口
// 启动成功后在控制台输出访问地址
app.listen(port, () => {
    console.log(`Example app listening on http://127.0.0.1:${port}`)
})
```

data.json

```json
[
  {
    "name": "Irene",
    "birthday": "1991-03",
    "group": "Red Velvet",
    "position": "Leader, Main Rapper, Lead Dancer, Sub Vocalist, Visual, Center"
  },
  {
    "name": "Seulgi",
    "birthday": "1994-10",
    "group": "Red Velvet",
    "position": "Main Dancer, Lead Vocalist"
  },
  {
    "name": "Wendy",
    "birthday": "1994-02",
    "group": "Red Velvet",
    "position": "Main Vocalist"
  },
  {
    "name": "Joy",
    "birthday": "1996-09",
    "group": "Red Velvet",
    "position": "Lead Rapper, Sub Vocalist"
  },
  {
    "name": "Yeri",
    "birthday": "1999-03",
    "group": "Red Velvet",
    "position": "Sub Vocalist, Sub Rapper, Maknae"
  },
  {
    "name": "Yeji",
    "birthday": "2000-05",
    "group": "ITZY",
    "position": "Leader, Main Dancer, Lead Vocalist, Sub Rapper"
  },
  {
    "name": "Lia",
    "birthday": "2000-07",
    "group": "ITZY",
    "position": "Main Vocalist, Sub Rapper"
  },
  {
    "name": "Ryujin",
    "birthday": "2001-04",
    "group": "ITZY",
    "position": "Main Rapper, Lead Dancer, Sub Vocalist, Center"
  },
  {
    "name": "Chaeryeong",
    "birthday": "2001-06",
    "group": "ITZY",
    "position": "Main Dancer, Sub Vocalist, Sub Rapper"
  },
  {
    "name": "Yuna",
    "birthday": "2003-12",
    "group": "ITZY",
    "position": "Lead Rapper, Lead Dancer, Sub Vocalist, Visual, Maknae"
  },
  {
    "name": "Miyeon",
    "birthday": "1997-01",
    "group": "(G)I-DLE",
    "position": "Main Vocalist, Visual"
  },
  {
    "name": "Minnie",
    "birthday": "1997-10",
    "group": "(G)I-DLE",
    "position": "Main Vocalist"
  },
  {
    "name": "Soyeon",
    "birthday": "1998-08",
    "group": "(G)I-DLE",
    "position": "Leader, Main Rapper, Sub Vocalist, Center"
  },
  {
    "name": "Yuqi",
    "birthday": "1999-09",
    "group": "(G)I-DLE",
    "position": "Lead Dancer, Sub Rapper, Sub Vocalist"
  },
  {
    "name": "Shuhua",
    "birthday": "2000-01",
    "group": "(G)I-DLE",
    "position": "Sub Vocalist, Visual, Maknae"
  },
  {
    "name": "Chodan",
    "birthday": "1998-11",
    "group": "QWER",
    "position": "Leader, Drummer, Sub Vocalist"
  },
  {
    "name": "Magenta",
    "birthday": "1997-06",
    "group": "QWER",
    "position": "Bassist, Sub Vocalist"
  },
  {
    "name": "Hina",
    "birthday": "2001-01",
    "group": "QWER",
    "position": "Guitarist, Keyboardist, Sub Vocalist"
  },
  {
    "name": "Siyeon",
    "birthday": "2000-05",
    "group": "QWER",
    "position": "Main Vocalist, Guitarist"
  },
  {
    "name": "Eunha",
    "birthday": "1997-05",
    "group": "VIVIZ",
    "position": "Main Vocalist"
  },
  {
    "name": "SinB",
    "birthday": "1998-06",
    "group": "VIVIZ",
    "position": "Main Dancer, Vocalist"
  },
  {
    "name": "Umji",
    "birthday": "1998-08",
    "group": "VIVIZ",
    "position": "Lead Dancer, Vocalist, Maknae"
  },
  {
    "name": "Qri",
    "birthday": "1986-12",
    "group": "T-ara",
    "position": "Leader, Vocalist, Visual"
  },
  {
    "name": "Eunjung",
    "birthday": "1988-12",
    "group": "T-ara",
    "position": "Lead Vocalist, Lead Rapper"
  },
  {
    "name": "Hyomin",
    "birthday": "1989-05",
    "group": "T-ara",
    "position": "Main Rapper, Lead Vocalist"
  },
  {
    "name": "Jiyeon",
    "birthday": "1993-06",
    "group": "T-ara",
    "position": "Main Dancer, Lead Vocalist, Visual, Maknae"
  }
]
```

### 3.6 cors跨域

跨域是浏览器的一种安全策略，全称为“跨源资源共享”（Cross-Origin Resource Sharing - CORS）。

它是由浏览器实施的，旨在防止恶意网站从一个源（Origin）的页面中读取另一个源的敏感数据。

- 安装cors

```shell
npm i cors
```

后端代码

main.js

```js
// 导入 express 框架，用于创建 Web 服务器
import express from 'express';
// 导入 fs/promises 模块，用于异步读取文件
import { readFile } from 'fs/promises';
// 导入 cors 中间件，用于解决跨域问题
import cors from 'cors';

const app = express(); // 创建一个 Express 应用实例

app.use(cors()); // 使用 CORS 中间件，允许前端跨域请求

const port = 3000; // 定义服务器端口号

// 定义一个 GET 接口，路径为 /todos
// 当客户端访问 http://localhost:3000/todos 时，会执行这个回调函数
app.get('/todos', async (_req, res) => {
  // 读取本地 JSON 文件，utf8 表示读取为字符串
  const todosData = await readFile('./data.json', 'utf8');
  // 将 JSON 字符串解析为 JavaScript 对象
  const todos = JSON.parse(todosData);

  // 返回状态码 200 和 todos 数据，响应类型自动为 application/json
  return res.status(200).json(todos);
})

// 启动服务器，监听指定端口
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

### 3.7 前后端和api

- 前端

看得见、摸得着的部分（页面、样式、交互），HTML + CSS +Javascript

- 后端

看不见但提供支持的部分（数据处理、逻辑、存储），nodejs，mysql数据库

- api

这里特指RestFul风格的api，它使用 HTTP 协议的标准方法 来对资源进行操作，强调 资源（Resource） 和 无状态（Stateless）。

简单说：RESTful API = 用 URL 表示资源 + 用 HTTP 方法表示操作

使用标准协议：基于 HTTP，返回 JSON 或 XML 格式数据（现在基本都是 JSON）

### 3.8 查询和删除api练习

server.js

```js
import express from 'express';
import cors from 'cors';
import { readFile, writeFile } from 'node:fs/promises';

const app = express();
app.use(cors()); // 允许跨域访问，方便前端在不同域名访问这个 API

const port = 3000;

// 获取所有 todos
app.get('/todos', async (_req, res) => {
  // 读取 data.json 文件里的数据
  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData); // 将 JSON 字符串转成 JS 数组

  return res.status(200).json(todos); // 返回所有 todos 数据
});

// 获取单个 todo
app.get('/todos/:todoId', async (req, res) => {
  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  const todoId = req.params.todoId; // 从 URL 获取 todoId 参数

  // 在 todos 数组中查找匹配的 todo
  const todo = todos.find((todo) => todo.id === Number(todoId));

  if (todo) {
    return res.status(200).json(todo); // 找到就返回这个 todo
  }

  // 如果找不到，返回 404
  return res.status(404).send('404 Not Found');
});

// 删除一个 todo
app.get('/todos/delete/:todoId', async (req, res) => {
  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  const todoId = req.params.todoId; // 获取要删除的 todoId

  // 过滤掉要删除的那个 todo
  const filteredTodos = todos.filter((todo) => todo.id !== Number(todoId));

  // 将新的 todos 数组写回 data.json
  await writeFile('./data.json', JSON.stringify(filteredTodos), 'utf-8');

  return res.status(200).json({
    message: 'Todo deleted successfully', // 返回删除成功的信息
  });
});

// 启动服务器，监听 3000 端口
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
```

### 3.9 创建与更新api练习

server.js

```js
// 导入所需的模块
import express from 'express';
import cors from 'cors';
import { readFile, writeFile } from 'node:fs/promises'; // 异步读写文件

// 创建 Express 应用
const app = express();

// 解决跨域问题，允许前端请求本地服务
app.use(cors());

const port = 3000; // 服务器监听端口

// -------------------- 获取所有待办事项 --------------------
app.get('/todos', async (_req, res) => {
  // 读取 data.json 文件中的数据
  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData); // 转换为 JS 对象

  // 返回所有待办事项
  return res.status(200).json(todos);
});

// -------------------- 获取指定 ID 的待办事项 --------------------
app.get('/todos/:todoId', async (req, res) => {
  // 读取数据
  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  // 获取 URL 参数中的 todoId
  const todoId = req.params.todoId;

  // 查找对应的待办事项
  const todo = todos.find((todo) => todo.id === Number(todoId));

  // 如果找到，返回待办事项；否则返回 404
  if (todo) {
    return res.status(200).json(todo);
  }

  return res.status(404).send('404 Not Found');
});

// -------------------- 删除指定 ID 的待办事项 --------------------
app.get('/todos/delete/:todoId', async (req, res) => {
  // 读取数据
  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  // 获取要删除的待办 ID
  const todoId = req.params.todoId;

  // 过滤掉要删除的待办事项
  const filteredTodos = todos.filter((todo) => todo.id !== Number(todoId));

  // 将更新后的数据写回文件
  await writeFile('./data.json', JSON.stringify(filteredTodos), 'utf-8');

  // 返回删除成功信息
  return res.status(200).json({
    message: 'Todo deleted successfully',
  });
});

// -------------------- 添加新的待办事项 --------------------
app.get('/todos/add/:addTodo', async (req, res) => {
  // 读取数据
  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  // 获取新待办事项数据并解析成对象
  const addTodo = req.params.addTodo;
  const parsedAddTodo = JSON.parse(addTodo);

  // 把新的待办添加到列表中
  const updatedTodos = [...todos, parsedAddTodo];

  // 写回文件
  await writeFile('./data.json', JSON.stringify(updatedTodos), 'utf-8');

  // 返回添加成功信息
  return res.status(200).json({
    message: 'Todo added successfully',
  });
});

// -------------------- 更新指定 ID 的待办事项 --------------------
app.get('/todos/update/:updateTodo', async (req, res) => {
  // 读取数据
  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  // 获取更新后的待办事项数据
  const updateTodo = req.params.updateTodo;
  const parsedUpdateTodo = JSON.parse(updateTodo);

  // 遍历更新列表，找到对应的待办事项并更新
  const updatedTodos = todos.map((todo) => {
    if (todo.id === parsedUpdateTodo.id) {
      return {
        ...todo,
        ...parsedUpdateTodo, // 用新的数据覆盖旧的
      };
    }
    return todo;
  });

  // 写回文件
  await writeFile('./data.json', JSON.stringify(updatedTodos), 'utf-8');

  // 返回更新成功信息
  return res.status(200).json({
    message: 'Todo updated successfully',
  });
});

// -------------------- 启动服务器 --------------------
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
```

### 3.10 post方法练习

server.js

```js
// 导入所需模块
import express from 'express';   // Express 框架，简化 HTTP 服务器开发
import cors from 'cors';         // 解决跨域请求问题
import { readFile, writeFile } from 'node:fs/promises'; // 用于异步读写文件

// 创建 Express 服务器实例
const server = express();
const port = 3000; // 服务器监听的端口

// 中间件配置
server.use(cors());              // 启用 CORS，允许跨域请求
server.use(express.json());      // 解析请求体中的 JSON 数据，方便处理 POST/PUT 请求的 JSON 内容

// -------------------- 获取所有产品 --------------------
server.get('/products', async (_req, res) => {
  // 读取 data.json 文件中的产品数据
  const productsData = await readFile('./data.json', 'utf-8');
  const products = JSON.parse(productsData); // 将 JSON 字符串解析为 JavaScript 对象

  // 返回产品列表，状态码 200 表示请求成功
  return res.status(200).json(products);
});

// -------------------- 添加新产品 --------------------
server.post('/products/add', async (req, res) => {
  // 读取当前产品数据
  const productsData = await readFile('./data.json', 'utf-8');
  const products = JSON.parse(productsData);

  // 从请求体中获取要添加的产品信息
  const addProduct = req.body;

  // 如果请求体为空，返回 400 错误（Bad Request）
  if (!addProduct) {
    return res.status(400).json({
      message: 'Bad request',
    });
  }

  // 将新产品添加到产品数组中
  const updatedProducts = [...products, addProduct];

  // 将更新后的产品数组写回 data.json 文件
  await writeFile('./data.json', JSON.stringify(updatedProducts), 'utf-8');

  // 返回成功信息
  return res.status(200).json({
    message: 'Product added successfully',
  });
});

// -------------------- 启动服务器 --------------------
server.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
```

### 3.11 接口和端点

- 接口 api

接口（API）：定义“能做什么、怎么调用”，是功能和规则的抽象

- 端点 endpoint

接口在网络上的具体地址，是你实际访问的 URL

>/user是api接口
>get /user是端点

server.js

```js
// 导入 Express 框架，用于创建服务器
import express from 'express';

// 导入 CORS 中间件，允许跨域请求
import cors from 'cors';

// 导入 Node.js 文件系统模块的 Promise 版本，用于读取和写入文件
import { readFile, writeFile } from 'node:fs/promises';

// 创建一个 Express 服务器实例
const server = express();

// 定义服务器端口号
const port = 3000;

// 使用 CORS 中间件，允许所有来源访问接口
server.use(cors());

// 解析请求体为 JSON 格式，这样可以通过 req.body 获取数据
server.use(express.json());

// -------------------- GET /products --------------------
// 获取所有产品信息
server.get('/products', async (_req, res) => {
  // 读取本地 data.json 文件中的产品数据
  const productsData = await readFile('./data.json', 'utf-8');
  // 将读取到的 JSON 字符串转换为 JavaScript 对象
  const products = JSON.parse(productsData);

  // 返回状态码 200 和产品数据
  return res.status(200).json(products);
});

// -------------------- POST /products --------------------
// 添加一个新的产品
server.post('/products', async (req, res) => {
  // 读取当前的产品数据
  const productsData = await readFile('./data.json', 'utf-8');
  const products = JSON.parse(productsData);

  // 获取客户端发送的新增产品数据
  const addProduct = req.body;

  // 如果没有传入产品数据，返回 400 错误
  if (!addProduct) {
    return res.status(400).json({
      message: 'Bad request',
    });
  }

  // 将新产品添加到已有产品数组中
  const updatedProducts = [...products, addProduct];

  // 将更新后的产品数组写回 data.json 文件
  await writeFile('./data.json', JSON.stringify(updatedProducts), 'utf-8');

  // 返回成功提示
  return res.status(200).json({
    message: 'Product added successfully',
  });
});

// 启动服务器，监听指定端口
server.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

```

### 3.12 apifox工具

一款类似postman的api测试工具

### 3.13 http增删改查api接口练习

注意添加 `app.use(express.json())`，Express 会自动把请求体里的 JSON 转成 JS 对象，并放到 req.body 里。

server.js

```js
// 引入 express 框架
import express from 'express';
// 引入 cors 中间件，解决跨域请求问题
import cors from 'cors';
// 引入 Node.js 文件系统 Promise 版本，用于读写文件
import { readFile, writeFile } from 'node:fs/promises';

// 创建 Express 应用实例
const app = express();

// 使用 CORS 中间件，允许不同源的前端访问
app.use(cors());
// 使用 JSON 中间件，自动解析请求体中的 JSON 数据
app.use(express.json());

// 定义服务端口
const port = 3000;

/**
 * 获取所有待办事项
 * 请求方式: GET
 * 路径: /todos
 */
app.get('/todos', async (_req, res) => {
  // 读取 data.json 文件内容
  const todosData = await readFile('./data.json', 'utf-8');
  // 将 JSON 字符串转换为数组对象
  const todos = JSON.parse(todosData);
  // 返回 200 状态码和 todos 数据
  return res.status(200).json(todos);
});

/**
 * 根据 ID 获取单个待办事项
 * 请求方式: GET
 * 路径: /todos/:todoId
 */
app.get('/todos/:todoId', async (req, res) => {
  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  // 从请求路径中获取 todoId
  const todoId = req.params.todoId;

  // 查找匹配 ID 的待办事项
  const todo = todos.find((todo) => todo.id === Number(todoId));

  // 如果找到，返回对应待办，否则返回 404
  if (todo) {
    return res.status(200).json(todo);
  }
  return res.status(404).send('404 Not Found');
});

/**
 * 根据 ID 删除待办事项
 * 请求方式: DELETE
 * 路径: /todos/:todoId
 */
app.delete('/todos/:todoId', async (req, res) => {
  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  // 获取待删除的 ID
  const todoId = req.params.todoId;

  // 过滤掉指定 ID 的待办
  const filteredTodos = todos.filter((todo) => todo.id !== Number(todoId));

  // 将更新后的数据写回文件
  await writeFile('./data.json', JSON.stringify(filteredTodos), 'utf-8');

  // 返回成功提示
  return res.status(200).json({
    message: 'Todo deleted successfully',
  });
});

/**
 * 添加新的待办事项
 * 请求方式: POST
 * 路径: /todos
 */
app.post('/todos', async (req, res) => {
  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  // 获取前端传来的新待办数据
  const addTodo = req.body;

  // 添加到现有数组中
  const updatedTodos = [...todos, addTodo];

  // 写回文件
  await writeFile('./data.json', JSON.stringify(updatedTodos), 'utf-8');

  return res.status(200).json({
    message: 'Todo added successfully',
  });
});

/**
 * 更新待办事项
 * 请求方式: PATCH
 * 路径: /todos
 */
app.patch('/todos', async (req, res) => {
  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  // 获取前端传来的更新数据
  const updateTodo = req.body;

  // 遍历 todos，找到 ID 匹配的待办，合并更新字段
  const updatedTodos = todos.map((todo) => {
    if (todo.id === updateTodo.id) {
      return {
        ...todo,
        ...updateTodo, // 合并更新数据
      };
    }
    return todo;
  });

  // 写回文件
  await writeFile('./data.json', JSON.stringify(updatedTodos), 'utf-8');

  return res.status(200).json({
    message: 'Todo updated successfully',
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
```

### 3.14 配置与热更新

使用dotenvx模块来实现配置环境变量到.env文件中，[dotenvx](https://dotenvx.com/)官网

nodemon实现热更新

- 安装dotenvx

```shell
npm i @dotenvx/dotenvx
```

.env

```
PORT=3000
```

package.sjon

修改运行命令为`dotenvx run -- nodemon server.js`

```json
{
  "name": "backend-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "dotenvx run -- nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "packageManager": "pnpm@10.6.5",
  "dependencies": {
    "@dotenvx/dotenvx": "^1.50.1",
    "cors": "^2.8.5",
    "express": "^5.1.0",
    "nodemon": "^3.1.10"
  }
}
```

server.js

```js
// 引入 express 框架
import express from 'express';
// 引入 cors 中间件，解决跨域请求问题
import cors from 'cors';
// 引入 Node.js 文件系统 Promise 版本，用于读写文件
import { readFile, writeFile } from 'node:fs/promises';

// 创建 Express 应用实例
const app = express();

// 使用 CORS 中间件，允许不同源的前端访问
app.use(cors());
// 使用 JSON 中间件，自动解析请求体中的 JSON 数据
app.use(express.json());

// 载入环境变量PORT
const port = process.env.PORT;

/**
 * 获取所有待办事项
 * 请求方式: GET
 * 路径: /todos
 */
app.get('/todos', async (_req, res) => {
  // 读取 data.json 文件内容
  const todosData = await readFile('./data.json', 'utf-8');
  // 将 JSON 字符串转换为数组对象
  const todos = JSON.parse(todosData);
  // 返回 200 状态码和 todos 数据
  return res.status(200).json(todos);
});

/**
 * 根据 ID 获取单个待办事项
 * 请求方式: GET
 * 路径: /todos/:todoId
 */
app.get('/todos/:todoId', async (req, res) => {
  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  // 从请求路径中获取 todoId
  const todoId = req.params.todoId;

  // 查找匹配 ID 的待办事项
  const todo = todos.find((todo) => todo.id === Number(todoId));

  // 如果找到，返回对应待办，否则返回 404
  if (todo) {
    return res.status(200).json(todo);
  }
  return res.status(404).send('404 Not Found');
});

/**
 * 根据 ID 删除待办事项
 * 请求方式: DELETE
 * 路径: /todos/:todoId
 */
app.delete('/todos/:todoId', async (req, res) => {
  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  // 获取待删除的 ID
  const todoId = req.params.todoId;

  // 过滤掉指定 ID 的待办
  const filteredTodos = todos.filter((todo) => todo.id !== Number(todoId));

  // 将更新后的数据写回文件
  await writeFile('./data.json', JSON.stringify(filteredTodos), 'utf-8');

  // 返回成功提示
  return res.status(200).json({
    message: 'Todo deleted successfully',
  });
});

/**
 * 添加新的待办事项
 * 请求方式: POST
 * 路径: /todos
 */
app.post('/todos', async (req, res) => {
  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  // 获取前端传来的新待办数据
  const addTodo = req.body;

  // 添加到现有数组中
  const updatedTodos = [...todos, addTodo];

  // 写回文件
  await writeFile('./data.json', JSON.stringify(updatedTodos), 'utf-8');

  return res.status(200).json({
    message: 'Todo added successfully',
  });
});

/**
 * 更新待办事项
 * 请求方式: PATCH
 * 路径: /todos
 */
app.patch('/todos', async (req, res) => {
  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  // 获取前端传来的更新数据
  const updateTodo = req.body;

  // 遍历 todos，找到 ID 匹配的待办，合并更新字段
  const updatedTodos = todos.map((todo) => {
    if (todo.id === updateTodo.id) {
      return {
        ...todo,
        ...updateTodo, // 合并更新数据
      };
    }
    return todo;
  });

  // 写回文件
  await writeFile('./data.json', JSON.stringify(updatedTodos), 'utf-8');

  return res.status(200).json({
    message: 'Todo updated successfully',
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
```

### 3.15 路由和重构

将上面一节中的server.js拆分为多个文件，就是把“混乱的大文件”变成“小模块”，让项目更专业、更易维护、更易扩展

- 目录结构

```
D:\coder\NodeJS简明教程\new\k18-路由和重构\final>tree . /F
卷 新加卷 的文件夹 PATH 列表
卷序列号为 00000087 0696:8A91
D:\CODER\NODEJS简明教程\NEW\K18-路由和重构\FINAL
│  .env
│  data.json
│  package-lock.json
│  package.json
│  node_modules
└─src
    │  app.js
    │  server.js
    │
    ├─controllers
    │      todoController.js
    │
    └─routes
            todoRoutes.js
```

package.json

注意启动路径的命令为`dotenvx run -- nodemon ./src/server.js`

```json
{
  "name": "backend-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "dotenvx run -- nodemon ./src/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "packageManager": "pnpm@10.6.5",
  "dependencies": {
    "@dotenvx/dotenvx": "^1.44.1",
    "cors": "^2.8.5",
    "express": "^5.1.0",
    "nodemon": "^3.1.10"
  }
}
```

src/server.js

```js
// 导入 Express 应用实例（已经在 app.js 中配置好路由、中间件等）
import app from './app.js';

// 从环境变量中获取端口号（如果没有设置，则 port 为 undefined）
const port = process.env.PORT;

// 启动 Express 服务器，监听指定端口
// 参数:
//   port: 要监听的端口号
//   回调函数: 服务器启动成功后执行，用于打印提示信息
app.listen(port, () => {
  // 在控制台输出服务器运行的地址，方便开发者访问
  console.log(`Example app listening on port http://localhost:${port}`);
});
```


src/app.js

```js
// 导入 Express 框架，用于创建服务器和处理 HTTP 请求
import express from 'express';

// 导入 CORS 中间件，用于处理跨域请求
import cors from 'cors';

// 导入自定义路由模块，这里是 todos 的路由
import router from './routes/todoRoutes.js';

// 创建 Express 应用实例
const app = express();

// 使用 CORS 中间件，允许跨域请求
app.use(cors());

// 使用内置中间件解析 JSON 请求体
// 这样客户端发送的 application/json 数据会被自动解析到 req.body
app.use(express.json());

// 挂载路由模块
// 所有 /v1 开头的请求都会交给 router 处理，例如：
// GET /v1/todos -> 由 todoRoutes.js 中的路由处理
app.use('/v1', router);

// 将配置好的 app 对象导出，在 server.js 中引入并启动服务器
export default app;

```

src/routes/todoRoutes.js

```js
// 导入 Express 框架，用于创建路由
import express from 'express';

// 导入 todos 控制器中的各个处理函数
import {
  createTodo,       // 创建新的 todo
  deleteTodoById,   // 根据 ID 删除 todo
  getTodoById,      // 根据 ID 获取单个 todo
  getTodos,         // 获取所有 todos
  updateTodo,       // 更新 todo（部分更新）
} from '../controllers/todoController.js';

// 创建一个路由实例，用于挂载具体的路由路径和处理函数
const router = express.Router();

// 使用 route 链式调用方式定义 /todos 路径的请求
// GET 请求 -> 调用 getTodos 获取所有 todos
// POST 请求 -> 调用 createTodo 创建新的 todo
// PATCH 请求 -> 调用 updateTodo 更新 todo
router.route('/todos')
  .get(getTodos)
  .post(createTodo)
  .patch(updateTodo);

// 使用 route 链式调用方式定义 /todos/:todoId 路径的请求
// GET 请求 -> 调用 getTodoById 获取指定 ID 的 todo
// DELETE 请求 -> 调用 deleteTodoById 删除指定 ID 的 todo
router.route('/todos/:todoId')
  .get(getTodoById)
  .delete(deleteTodoById);

// 将配置好的路由导出，在 app.js 中挂载使用
export default router;
```

src/controllers/todoController.js

```js
// 导入 Node.js 的异步文件读写模块
import { readFile, writeFile } from 'node:fs/promises';

/**
 * 获取所有 todo 项
 * @param _req Express 请求对象（未使用，用 _ 前缀表示忽略）
 * @param res Express 响应对象
 */
export async function getTodos(_req, res) {
  // 读取 data.json 文件中的 todos 数据（字符串）
  const todosData = await readFile('./data.json', 'utf-8');

  // 将 JSON 字符串解析成 JavaScript 对象/数组
  const todos = JSON.parse(todosData);

  // 返回 HTTP 200 状态码和 todos 数据
  return res.status(200).json(todos);
}

/**
 * 根据 ID 获取单个 todo
 * @param req Express 请求对象
 * @param res Express 响应对象
 */
export async function getTodoById(req, res) {
  const todoId = req.params.todoId;

  // 如果未提供 todoId，则返回 400 Bad Request
  if (!todoId) {
    return res.status(400).send('todoId is required');
  }

  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  // 查找匹配的 todo
  const todo = todos.find((todo) => todo.id === Number(todoId));

  // 如果找到，返回 200 和 todo 数据
  if (todo) {
    return res.status(200).json(todo);
  }

  // 未找到返回 404
  return res.status(404).send('404 Not Found');
}

/**
 * 根据 ID 删除 todo
 * @param req Express 请求对象
 * @param res Express 响应对象
 */
export async function deleteTodoById(req, res) {
  const todoId = req.params.todoId;

  if (!todoId) {
    return res.status(400).send('todoId is required');
  }

  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  // 过滤掉要删除的 todo
  const filteredTodos = todos.filter((todo) => todo.id !== Number(todoId));

  // 写回文件
  await writeFile('./data.json', JSON.stringify(filteredTodos), 'utf-8');

  // 返回删除成功消息
  return res.status(200).json({
    message: 'Todo deleted successfully',
  });
}

/**
 * 创建新的 todo
 * @param req Express 请求对象
 * @param res Express 响应对象
 */
export async function createTodo(req, res) {
  const addTodo = req.body;

  // 请求体为空则返回 400
  if (!addTodo) {
    return res.status(400).send('400 Bad Request');
  }

  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  // 将新 todo 添加到现有数组
  const updatedTodos = [...todos, addTodo];

  // 写回文件
  await writeFile('./data.json', JSON.stringify(updatedTodos), 'utf-8');

  return res.status(200).json({
    message: 'Todo added successfully',
  });
}

/**
 * 更新 todo（部分更新）
 * @param req Express 请求对象
 * @param res Express 响应对象
 */
export async function updateTodo(req, res) {
  const updateTodo = req.body;

  // 请求体为空返回 400
  if (!updateTodo) {
    return res.status(400).send('400 Bad Request');
  }

  const todosData = await readFile('./data.json', 'utf-8');
  const todos = JSON.parse(todosData);

  // 遍历 todos，将匹配 id 的 todo 更新
  const updatedTodos = todos.map((todo) => {
    if (todo.id === updateTodo.id) {
      return {
        ...todo,         // 保留原有属性
        ...updateTodo,   // 更新属性
      };
    }
    return todo;
  });

  // 写回文件
  await writeFile('./data.json', JSON.stringify(updatedTodos), 'utf-8');

  return res.status(200).json({
    message: 'Todo updated successfully',
  });
}
```

## 四、数据库

### 4.1 数据库是什么

数据库（Database）是用于存储、管理和查询数据的系统

这是使用Postgres 开发平台supabase，来快速搭建访问数据库

[supabase官网](https://supabase.com/)

### 4.2 连接数据库

使用pg模块连接pg数据库

- 安装pg

```shell
npm install pg
```

server.js

```js
import { Client } from 'pg';
const client = new Client({
  user: 'postgres.biflkkllrlqaglodysjl',
  password: '******',
  host: 'aws-1-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
});
await client.connect();

const res = await client.query('SELECT $1::text as message', ['Hello world!']);
console.log(res.rows[0].message); // Hello world!
await client.end();
```

### 4.3 初识sequelize

Sequelize 是 Node.js 的一个 ORM（对象关系映射）框架，主要用来操作关系型数据库，比如 PostgreSQL、MySQL、MariaDB、SQLite、MSSQL 等。

它的核心作用是：

用 JavaScript/TypeScript 代码来操作数据库，而不是直接写 SQL。

把数据库的表和字段映射成 JS 对象，这样你在代码里可以像操作对象一样操作数据表。

- 安装sequelize

```shell
npm install sequelize
```

- 安装sequelize pg数据库依赖

```shell
npm install pg pg-hstore
```

- 安装dotenvx

载入.env环境变量

```shell
npm i @dotenvx/dotenvx
```

package.json

设置dotenvx启动命令

```json
{
  "type": "module",
  "name": "new",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "dotenvx run -- nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@dotenvx/dotenvx": "^1.50.1",
    "pg": "^8.16.3",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.37.7"
  }
}
```

server.js

```js
import { Sequelize, DataTypes } from 'sequelize';

// 1. 从环境变量中读取数据库配置
//    这样就不会把账号密码写死在代码里，更安全
const databaseConfig = {
    username: process.env.DB_USER,       // 数据库用户名
    password: process.env.DB_PASSWORD,   // 数据库密码
    host: process.env.DB_HOST,           // 数据库主机地址
    port: Number(process.env.DB_PORT),   // 数据库端口号
    database: process.env.DB_NAME        // 数据库名称
}

// 打印出当前的数据库配置，方便调试
// console.log(databaseConfig);

// 2. 创建 Sequelize 实例，用于连接数据库
const sequelize = new Sequelize(
    databaseConfig.database,  // 数据库名称
    databaseConfig.username,  // 用户名
    databaseConfig.password,  // 密码
    {
        host: databaseConfig.host,   // 主机
        dialect: 'postgres',         // 指定数据库类型，这里用 PostgreSQL
        port: databaseConfig.port    // 端口
    }
);

// 3. 测试数据库连接是否成功
try {
    await sequelize.authenticate();  
    console.log('Connection has been established successfully.'); // 连接成功
} catch (error) {
    console.error('Unable to connect to the database:', error);    // 连接失败
}

// 4. 定义 Todo 模型，对应数据库中的 todo 表
const Todo = sequelize.define(
    'Todo',   // 模型名称（逻辑层用），Sequelize 默认会转为复数作为表名，但我们会显式指定表名
    {
        id: {
            type: DataTypes.INTEGER,   // 字段类型：整数
            primaryKey: true,          // 主键
            allowNull: false,          // 不允许为空
        },
        title: {
            type: DataTypes.STRING,    // 标题字段，字符串类型
        },
        content: {
            type: DataTypes.STRING,    // 内容字段
        },
        tag: {
            type: DataTypes.STRING,    // 标签字段
        },
    },
    {
        tableName: 'todo',      // 显式指定表名，避免 Sequelize 默认复数化
        createdAt: false,       // 不要 createdAt 自动时间戳
        updatedAt: false,       // 不要 updatedAt 自动时间戳
    }
);

// 5. 查询 todo 表的所有数据
const todos = await Todo.findAll();

// 6. 以 JSON 格式打印查询结果，方便查看
console.log(JSON.stringify(todos, null, 2));
```

.env

```
PORT=3000
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.biflkkllrlqaglodysjl
DB_PASSWORD=******
DB_NAME=postgres
```

### 4.4 数据库同步

将数据同步到数据库当中

注意sync({ force: true }) 会删除原表重建，适合开发/测试环境，生产环境慎用

seed.js

```js
import { readFile } from 'node:fs/promises'; // 引入 Node.js 文件系统模块的 Promise 版本，用于读取文件
import sequelize from '../utils/dbHelper.js'; // 导入 Sequelize 实例（数据库连接）
import Todo from '../models/todoModel.js';    // 导入 Todo 模型（对应数据库表）

try {
    // 1. 读取初始化数据 JSON 文件（initData.json）
    //    注意路径相对于当前执行文件
    const initializeTodoString = await readFile(
        "./src/scripts/data/initData.json",
        "utf-8"
    );

    // 2. 将 JSON 字符串解析成 JS 对象/数组
    const initializeTodos = JSON.parse(initializeTodoString);

    // 3. 测试数据库连接是否成功
    await sequelize.authenticate();

    // 4. 同步模型到数据库
    //    { force: true } 表示如果表存在先删除再创建，用于清空旧数据
    await Todo.sync({ force: true });

    // 5. 批量插入初始化数据
    const result = await Todo.bulkCreate(initializeTodos);

    // 6. 打印插入结果，以 JSON 格式美化输出
    console.log(JSON.stringify(result, null, 2));

} catch (error) {
    // 7. 捕获异常并打印错误信息
    console.log(error);
} finally {
    // 8. 最终关闭数据库连接
    await sequelize.close();
}
```

todoModel.js

```js
import { DataTypes } from "sequelize";  // 引入 Sequelize 的数据类型
import sequelize from "../utils/dbHelper.js"; // 引入已经配置好的 Sequelize 实例（数据库连接）

// 1. 定义 Todo 模型，对应数据库中的 todo 表
const Todo = sequelize.define(
    'Todo', // 模型名称（逻辑层使用），Sequelize 默认会把它复数化作为表名，但我们在下面显式指定表名
    {
        // 2. 定义字段及其属性
        id: {
            type: DataTypes.BIGINT,   // 字段类型为大整数，适合存储长 ID
            allowNull: false,         // 不允许为空
            primaryKey: true,         // 主键
        },
        title: {
            type: DataTypes.TEXT,     // 标题字段，文本类型
            allowNull: false,         // 必填
        },
        tag: {
            type: DataTypes.TEXT,     // 标签字段，文本类型
            allowNull: false,         // 必填
        },
        content: {
            type: DataTypes.TEXT,     // 内容字段，文本类型
            allowNull: false,         // 必填
        },
    },
    {
        // 3. 模型配置项
        tableName: 'todo',       // 显式指定数据库表名为 todo，避免 Sequelize 默认复数化
        createdAt: false,        // 禁用 Sequelize 自动生成 createdAt 字段
        updatedAt: false,        // 禁用 Sequelize 自动生成 updatedAt 字段
    },
);

// 4. 导出 Todo 模型，在其他模块中可以直接 import 使用
export default Todo;
```

dbHelper.js

```js
import { Sequelize } from 'sequelize'

// 1. 从环境变量读取数据库配置信息
//    避免在代码里硬编码账号密码，提高安全性
const databaseConfig = {
  database: process.env.DB_NAME,    // 数据库名称
  username: process.env.DB_USER,    // 数据库用户名
  password: process.env.DB_PASSWORD,// 数据库密码
  host: process.env.DB_HOST,        // 数据库主机地址（例如 localhost 或远程 IP）
  port: process.env.DB_PORT         // 数据库端口（PostgreSQL 默认 5432）
}

// 2. 创建 Sequelize 实例，用于连接数据库
//    Sequelize 是一个 ORM 框架，可以用 JS 对象操作数据库
const sequelize = new Sequelize(
  databaseConfig.database,   // 数据库名称
  databaseConfig.username,   // 用户名
  databaseConfig.password,   // 密码
  {
    host: databaseConfig.host, // 数据库主机
    dialect: 'postgres'        // 数据库类型，这里指定为 PostgreSQL
    // 如果需要端口也可以加：port: databaseConfig.port
  }
)

// 3. 导出 Sequelize 实例，在其他模块里可以直接 import 使用
export default sequelize
```

### 4.5 ORM和CRUD

综合前面的学习内容，实现通过api对数据库的增删改查

CRUD（Create、Read、Update、Delete）

CRUD 是数据库最基本的 四种操作，对应数据库中的增、查、改、删操作。

ORM（Object-Relational Mapping，对象关系映射）

ORM 是一种把 数据库表 映射成 代码中的对象 的技术。也就是说，你可以用面向对象的方式操作数据库，而不需要直接写 SQL 语句。

项目结构

```cmd
D:\coder\NodeJS简明教程\demo16\crud-with-orm\starter>tree /F
卷 新加卷 的文件夹 PATH 列表
卷序列号为 0696-8A91
D:.
│  .env
│  package-lock.json
│  package.json
│
└─src
    │  app.js
    │  server.js
    │
    ├─controllers
    │      todoController.js
    │
    ├─models
    │      todoModel.js
    │
    ├─routes
    │      todoRoute.js
    │
    ├─scripts
    │  │  seed.js
    │  │
    │  └─data
    │          initData.json
    │
    ├─services
    │      todoService.js
    │
    └─utils
            dbHelper.js
```

假设get请求过来，项目是这么运行的

```cmd
客户端 GET /todos
   ↓
server.js   (启动服务器)
   ↓
app.js      (挂载 /todos 路由)
   ↓
todoRoute.js   (匹配 GET /)
   ↓
todoController.js  (控制器处理逻辑)
   ↓
todoService.js     (调用 Sequelize Model 查询 DB)
   ↓
todoModel.js       (Sequelize ORM 映射 Postgres)
   ↓
数据库查询 → 返回结果
   ↓
todoController.js  (返回 JSON 响应)
   ↓
客户端收到数据
```

server.js

```js
// 导入已经配置好的 express 应用实例
import app from './app.js';

// 从环境变量中获取端口号
const port = process.env.PORT;

// 启动服务器，监听指定端口
app.listen(port, () => {
  // 服务器启动成功后的回调函数
  // 输出服务器访问地址到控制台
  console.log(`Server is running on http://localhost:${port}`);
});
```

app.js

```js
// 导入 express 框架，用于创建服务器应用
import express from 'express';

// 导入 cors 中间件，用于处理跨域请求
import cors from 'cors';

// 导入 todo 路由模块
import todoRouter from './routes/todoRoute.js';

// 创建 express 应用实例
const app = express();

// ----------------------
// 中间件配置
// ----------------------

// 使用 CORS 中间件，允许跨域请求
app.use(cors());

// 内置中间件，用于解析请求体中的 JSON 数据
app.use(express.json());

// ----------------------
// 路由挂载
// ----------------------

// 将 todoRouter 挂载到 /v1 路径下
// 所有 /v1/todos 的请求都会由 todoRouter 处理
app.use('/v1', todoRouter);

// ----------------------
// 导出应用实例
// ----------------------

// 在其他文件中可以导入 app 并启动服务器
export default app;
```

todoRoute.js

```js
// 导入 express 框架，用于创建路由
import express from 'express';

// 导入 todoController 中的各个处理函数
import {
  createTodo,
  deleteTodoById,
  getTodoById,
  getTodos,
  updateTodo,
} from '../controllers/todoController.js';

// 创建一个路由实例
const router = express.Router();

// ----------------------
// 定义路由
// ----------------------

// /todos 路径的请求
// GET 请求 -> 获取所有 todo
// POST 请求 -> 创建新的 todo
// PATCH 请求 -> 更新已有的 todo
router.route('/todos')
  .get(getTodos)
  .post(createTodo)
  .patch(updateTodo);

// /todos/:todoId 路径的请求，:todoId 是路径参数
// GET 请求 -> 根据 ID 获取单个 todo
// DELETE 请求 -> 根据 ID 删除 todo
router.route('/todos/:todoId')
  .get(getTodoById)
  .delete(deleteTodoById);

// 导出路由实例，在 app.js 中挂载使用
export default router;
```

todoController.js

```js
// 导入 service 层的方法，用于实际操作数据库
// 使用别名避免与 Controller 函数重名
import {
  getAllTodos,
  getTodoById as getTodoByIdApi,
  deleteTodoById as deleteTodoByIdApi,
  createTodo as createTodoApi,
  updateTodo as updateTodoApi,
} from '../services/todoService.js';

// ----------------------
// Controller 层：处理 HTTP 请求，调用 Service 层，并返回响应
// ----------------------

// 获取所有 todo
export async function getTodos(_req, res) {
  // 调用 Service 层获取所有 todo 数据
  const todos = await getAllTodos();

  // 返回 HTTP 200，并将 todo 数据以 JSON 格式返回
  return res.status(200).json(todos);
}

// 根据 ID 获取单个 todo
export async function getTodoById(req, res) {
  // 检查请求参数中是否存在 todoId
  if (!req.params.todoId) {
    return res.status(400).send('todoId is required'); // 参数缺失返回 400
  }

  // 调用 Service 层根据 ID 查询 todo
  const todo = await getTodoByIdApi(req.params.todoId);

  if (todo) {
    // 如果找到记录，返回 HTTP 200 和 todo 数据
    return res.status(200).json(todo);
  }

  // 如果未找到记录，返回 404
  return res.status(404).send('404 Not Found');
}

// 根据 ID 删除 todo
export async function deleteTodoById(req, res) {
  const todoId = req.params.todoId;

  // 检查 todoId 是否存在
  if (!todoId) {
    return res.status(400).send('todoId is required');
  }

  // 调用 Service 层删除指定 ID 的 todo
  await deleteTodoByIdApi(todoId);

  // 返回删除成功的提示
  return res.status(200).json({
    message: 'Todo deleted successfully',
  });
}

// 创建新的 todo
export async function createTodo(req, res) {
  const addTodo = req.body;

  // 检查请求体是否存在数据
  if (!addTodo) {
    return res.status(400).send('Bad request');
  }

  // 调用 Service 层创建 todo
  const addedTodo = await createTodoApi(addTodo);

  // 返回创建成功信息和新创建的 todo 数据
  return res.status(200).json({
    message: 'Todo added successfully',
    data: addedTodo,
  });
}

// 更新已有的 todo
export async function updateTodo(req, res) {
  const updateTodo = req.body;

  // 调用 Service 层更新 todo
  const updatedTodo = await updateTodoApi(updateTodo);

  // 返回更新成功信息
  return res.status(200).json({
    message: 'Todo updated successfully',
    data: updatedTodo,
  });
}
```

todoService.js

```js
// 导入 Todo 模型，用于操作数据库中的 todo 表
import Todo from '../models/todoModel.js';

// ----------------------
// Service 层：封装对数据库的具体操作逻辑
// ----------------------

// 获取所有 todo 记录
export async function getAllTodos() {
    // findAll() 会查询 todo 表中的所有记录，并返回一个数组
    const todos = await Todo.findAll();
    return todos;
}

// 根据 id 获取单条 todo 记录
export async function getTodoById(todoId) {
    // findOne({ where: { ... } }) 会查询符合条件的第一条记录
    const todo = await Todo.findOne({ where: { id: todoId } });
    return todo;
}

// 根据 id 删除 todo 记录
export async function deleteTodoById(todoId) {
    // destroy({ where: { ... } }) 会删除符合条件的记录
    // 返回值是被删除的行数
    const deletedTodo = await Todo.destroy({ where: { id: todoId } });
    return deletedTodo;
}

// 创建新的 todo 记录
export async function createTodo(addTodo) {
    // create() 会在 todo 表中插入一条新记录
    // addTodo 应该是一个对象，包含 title、tag、content 等字段
    const addedTodo = await Todo.create(addTodo);
    return addedTodo;
}

// 更新已有的 todo 记录
export async function updateTodo(updateTodo) {
    // update() 会更新符合条件的记录
    // 第一个参数是要更新的字段对象，第二个参数是查询条件
    await Todo.update(updateTodo, { where: { id: updateTodo.id } });
    // 注意：update() 返回的是受影响的行数数组 [affectedCount]
}
```

todoModel.js

```js
// 从 sequelize 模块中导入 DataTypes，用于定义字段类型
import { DataTypes } from 'sequelize';

// 导入已配置好的 Sequelize 实例，用于与数据库交互
import sequelize from '../utils/dbHelper.js';

// 定义 Todo 模型（表）
// 第一个参数 'Todo' 是模型的名称，第二个参数是字段定义，第三个参数是模型配置
const Todo = sequelize.define(
  'Todo', // 模型名称，Sequelize 会根据配置映射到数据库表
  {
    // 定义字段
    id: {
      type: DataTypes.BIGINT,  // 数据类型为 BIGINT，用于存储大整数
      primaryKey: true,        // 设置为主键
    },
    title: {
      type: DataTypes.TEXT,    // 数据类型为 TEXT，用于存储字符串
      allowNull: false,        // 不允许为空
    },
    tag: {
      type: DataTypes.TEXT,    // 数据类型为 TEXT
      allowNull: false,        // 不允许为空
    },
    content: {
      type: DataTypes.TEXT,    // 数据类型为 TEXT
      allowNull: false,        // 不允许为空
    },
  },
  {
    tableName: 'todo', // 指定数据库中实际的表名为 'todo'
    createdAt: false,  // 禁用 Sequelize 自动创建的 createdAt 字段
    updatedAt: false,  // 禁用 Sequelize 自动创建的 updatedAt 字段
  }
);

// 导出模型，以便在其他地方使用（如 CRUD 操作）
export default Todo;
```

dbHelper.js

```js
// 从 sequelize 模块中导入 Sequelize 类，用于创建数据库连接实例
import { Sequelize } from 'sequelize';

// 数据库配置，从环境变量中获取
const databaseConfig = {
  database: process.env.DB_NAME,       // 数据库名称
  username: process.env.DB_USER,       // 数据库用户名
  password: process.env.DB_PASSWORD,   // 数据库密码
  host: process.env.DB_HOST,           // 数据库主机地址
  port: Number(process.env.DB_PORT),   // 数据库端口号（转换为数字类型）
};

// 可以用来调试数据库配置是否正确
// console.log(databaseConfig);

// 创建 Sequelize 实例，建立数据库连接
const sequelize = new Sequelize(
  databaseConfig.database,  // 数据库名
  databaseConfig.username,  // 数据库用户名
  databaseConfig.password,  // 数据库密码
  {
    host: databaseConfig.host, // 数据库主机
    dialect: 'postgres',       // 数据库类型，这里使用 PostgreSQL
  }
);

// 测试数据库连接是否成功
try {
  await sequelize.authenticate(); // 尝试连接数据库
  console.log('Connection has been established successfully.'); // 成功提示
} catch (error) {
  console.error('Unable to connect to the database:', error); // 连接失败提示
}

// 导出 sequelize 实例，供其他模块使用
export default sequelize;
```

### 4.6 分页

分页就是 把大量数据分成若干页，每页只显示一部分，常用于列表展示或查询数据时提高效率

- page

意思：当前是第几页

作用：前端告诉后端，用户想看第几页的数据

常见用法：

```js
// 请求第2页，每页10条
GET /api/users?page=2&limit=10
```

- limit

意思：每页返回多少条数据

作用：前端告诉后端分页的大小

常见用法：

```js
GET /api/users?page=1&limit=20
```

- offset

意思：从第几条数据开始返回，常配合 limit 用

作用：让后端跳过前面多少条数据再返回

offset = 0 → 从第1条开始

offset = 10 → 跳过前10条，从第11条开始

常见用法：

```js
// 跳过前10条，返回接下来的10条
GET /api/users?offset=10&limit=10
```

- 分页用法

page 更直观，前端只管第几页，后端自己计算

```js
const page = req.query.page;
const limit = req.query.limit;

const offset = (page - 1) * limit;
```

./src/routes/todoRoute.js

将count接口提前，防止进去其他接口查询

```js
import express from 'express';
import {
  countTodo,        // 统计 Todo 总数
  createTodo,       // 创建新的 Todo
  deleteTodoById,   // 根据 ID 删除 Todo
  getTodoById,      // 根据 ID 获取 Todo
  getTodos,         // 获取分页的 Todo 列表
  updateTodo,       // 更新 Todo
} from '../controllers/todoController.js';

const router = express.Router(); // 创建一个路由实例

// -------------------- 路由定义 --------------------

// 获取 Todo 总数
// GET /todos/count
router.get('/todos/count', countTodo);

// 获取分页 Todo 列表 / 创建 Todo / 更新 Todo
// GET /todos     -> 获取分页 Todo 列表
// POST /todos    -> 创建新的 Todo
// PATCH /todos   -> 更新 Todo
router.route('/todos')
  .get(getTodos)
  .post(createTodo)
  .patch(updateTodo);

// 根据 ID 获取 / 删除 Todo
// GET /todos/:todoId    -> 获取指定 ID 的 Todo
// DELETE /todos/:todoId -> 删除指定 ID 的 Todo
router.route('/todos/:todoId')
  .get(getTodoById)
  .delete(deleteTodoById);

// 导出路由实例
export default router;
```

./src/controllers.js

分页的用法

```js
import {
  getAllTodos,
  getTodoById as getTodoByIdApi,
  deleteTodoById as deleteTodoByIdApi,
  createTodo as createTodoApi,
  updateTodo as updateTodoApi,
  countTodo as countTodoApi,
} from '../services/todoService.js';

/**
 * 获取分页的 Todo 列表
 * GET /todos?page=1&limit=5
 */
export async function getTodos(req, res) {
  // 从查询参数中获取 page 和 limit
  const page = req.query.page;   // 第几页
  const limit = req.query.limit; // 每页条数

  // 计算 offset：跳过多少条数据
  const offset = (page - 1) * limit;

  // 调用 service 层方法获取数据
  const todos = await getAllTodos(offset, limit);

  // 返回 JSON 响应
  return res.status(200).json(todos);
}

/**
 * 根据 ID 获取单个 Todo
 * GET /todos/:todoId
 */
export async function getTodoById(req, res) {
  // 如果没有传 todoId，返回 400
  if (!req.params.todoId) {
    return res.status(400).send('todoId is required');
  }

  // 调用 service 层方法
  const todo = await getTodoByIdApi(req.params.todoId);

  // 如果找到，返回 200，否则返回 404
  if (todo) {
    return res.status(200).json(todo);
  }

  return res.status(404).send('404 Not Found');
}

/**
 * 根据 ID 删除 Todo
 * DELETE /todos/:todoId
 */
export async function deleteTodoById(req, res) {
  const todoId = req.params.todoId;

  // 校验参数
  if (!todoId) {
    return res.status(400).send('todoId is required');
  }

  // 调用 service 层删除
  await deleteTodoByIdApi(todoId);

  // 返回成功信息
  return res.status(200).json({
    message: 'Todo deleted successfully',
  });
}

/**
 * 创建新的 Todo
 * POST /todos
 */
export async function createTodo(req, res) {
  const addTodo = req.body; // 请求体中的数据

  // 校验请求体
  if (!addTodo) {
    return res.status(400).send('Bad request');
  }

  // 调用 service 层创建
  const addedTodo = await createTodoApi(addTodo);

  // 返回成功信息和创建的对象
  return res.status(200).json({
    message: 'Todo added successfully',
    data: addedTodo,
  });
}

/**
 * 更新 Todo
 * PUT /todos
 */
export async function updateTodo(req, res) {
  const updateTodo = req.body; // 更新数据

  // 调用 service 层更新
  const updatedTodo = await updateTodoApi(updateTodo);

  // 返回更新结果
  return res.status(200).json({
    message: 'Todo updated successfully',
    data: updatedTodo,
  });
}

/**
 * 统计 Todo 总数
 * GET /todos/count
 */
export async function countTodo(_req, res) {
  // 调用 service 层统计
  const todoCount = await countTodoApi();

  // 返回总数
  return res.status(200).json({
    count: todoCount,
  });
}
```

./src/services

```js
// 导入 Todo 模型
import Todo from '../models/todoModel.js';

/**
 * 获取所有待办事项（带分页）
 * @param {number} offset - 跳过多少条数据，用于分页
 * @param {number} limit - 每页返回多少条，默认5条
 * @returns {Promise<Array>} - 返回待办事项数组
 */
export async function getAllTodos(offset, limit = 5) {
  const todos = await Todo.findAll({
    offset, // 跳过前 offset 条数据
    limit,  // 取 limit 条数据
  });

  return todos;
}

/**
 * 根据ID获取单个待办事项
 * @param {number} todoId - 待办事项ID
 * @returns {Promise<Object|null>} - 找到返回对象，找不到返回null
 */
export async function getTodoById(todoId) {
  const todo = await Todo.findOne({ where: { id: todoId } });
  return todo;
}

/**
 * 根据ID删除待办事项
 * @param {number} todoId - 待办事项ID
 * @returns {Promise<void>}
 */
export async function deleteTodoById(todoId) {
  await Todo.destroy({
    where: {
      id: todoId,
    },
  });
}

/**
 * 创建新的待办事项
 * @param {Object} addTodo - 新待办事项的数据
 * @returns {Promise<Object>} - 返回创建成功的待办事项对象
 */
export async function createTodo(addTodo) {
  const addedTodo = await Todo.create(addTodo);
  return addedTodo;
}

/**
 * 更新待办事项
 * @param {Object} updateTodo - 待更新的数据，必须包含 id
 * @returns {Promise<void>}
 */
export async function updateTodo(updateTodo) {
  await Todo.update(updateTodo, {
    where: {
      id: updateTodo.id,
    },
  });
}

/**
 * 统计所有待办事项的数量
 * @returns {Promise<number>} - 返回待办事项总数
 */
export async function countTodo() {
  return await Todo.count();
}
```

### 4.7 搜索过滤

./src/controllers/todoController.js

```js
import {
  getAllTodos,
  getTodoById as getTodoByIdApi,
  deleteTodoById as deleteTodoByIdApi,
  createTodo as createTodoApi,
  updateTodo as updateTodoApi,
  countTodo as countTodoApi,
} from '../services/todoService.js';

/**
 * 获取待办事项列表（支持分页、搜索）
 * GET /todos?page=1&limit=5&search=关键字
 */
export async function getTodos(req, res) {
  // 从请求参数获取分页和搜索条件，如果没传则设置默认值
  const page = parseInt(req.query.page) || 1;    // 第几页，默认1
  const limit = parseInt(req.query.limit) || 5;  // 每页条数，默认5
  const search = req.query.search || '';         // 搜索关键字，默认空字符串

  // 计算 offset，用于 SQL 分页
  const offset = (page - 1) * limit;

  // 调用 service 层获取数据
  const todos = await getAllTodos(offset, limit, search);

  // 返回 JSON 数据
  return res.status(200).json(todos);
}

/**
 * 根据 ID 获取单个待办事项
 * GET /todos/:todoId
 */
export async function getTodoById(req, res) {
  // 检查 URL 参数是否传了 todoId
  if (!req.params.todoId) {
    return res.status(400).send('todoId is required');
  }

  // 调用 service 层方法获取数据
  const todo = await getTodoByIdApi(req.params.todoId);

  // 如果找到，返回 200，否则返回 404
  if (todo) {
    return res.status(200).json(todo);
  }

  return res.status(404).send('404 Not Found');
}

/**
 * 根据 ID 删除待办事项
 * DELETE /todos/:todoId
 */
export async function deleteTodoById(req, res) {
  const todoId = req.params.todoId;

  // 如果没传 todoId，返回 400
  if (!todoId) {
    return res.status(400).send('todoId is required');
  }

  // 调用 service 层删除数据
  await deleteTodoByIdApi(todoId);

  // 返回成功信息
  return res.status(200).json({
    message: 'Todo deleted successfully',
  });
}

/**
 * 创建新的待办事项
 * POST /todos
 */
export async function createTodo(req, res) {
  const addTodo = req.body; // 从请求体里获取新待办数据

  // 校验请求体
  if (!addTodo) {
    return res.status(400).send('Bad request');
  }

  // 调用 service 层创建新待办
  const addedTodo = await createTodoApi(addTodo);

  // 返回成功信息和新创建的数据
  return res.status(200).json({
    message: 'Todo added successfully',
    data: addedTodo,
  });
}

/**
 * 更新待办事项
 * PATCH /todos
 */
export async function updateTodo(req, res) {
  const updateTodo = req.body; // 从请求体获取更新数据

  // 调用 service 层更新
  const updatedTodo = await updateTodoApi(updateTodo);

  // 返回更新结果
  return res.status(200).json({
    message: 'Todo updated successfully',
    data: updatedTodo,
  });
}

/**
 * 统计待办事项数量（支持搜索）
 * GET /todos/count?search=关键字
 */
export async function countTodo(req, res) {
  // 获取搜索关键字
  const search = req.query.search;

  // 调用 service 层统计
  const todoCount = await countTodoApi(search);

  // 返回统计结果
  return res.status(200).json({
    count: todoCount,
  });
}

```

./src/services/todoService.js

```js
import { Op } from 'sequelize';  // Sequelize 操作符，用于 like、in 等查询
import Todo from '../models/todoModel.js';

/**
 * 获取待办事项列表（可分页、可搜索）
 * @param {number} offset - 跳过多少条数据（用于分页）
 * @param {number} limit - 每页返回多少条，默认 5 条
 * @param {string} search - 搜索关键字（可选）
 * @returns {Promise<Array>} - 返回待办事项数组
 */
export async function getAllTodos(offset, limit = 5, search) {
  let titleFilter = {};

  // 如果传了搜索关键字，就加上 where 条件
  if (search) {
    titleFilter = {
      where: {
        title: {
          [Op.ilike]: `%${search}%`, // 模糊查询 title 字段
        },
      },
    };
  }

  // 分页 + 搜索查询
  const todos = await Todo.findAll({
    offset,   // 跳过 offset 条
    limit,    // 返回 limit 条
    ...titleFilter, // 如果有搜索条件，展开到 options 里
  });

  return todos;
}

/**
 * 根据 ID 获取单个待办事项
 * @param {number} todoId - 待办事项 ID
 * @returns {Promise<Object|null>} - 返回待办事项对象或 null
 */
export async function getTodoById(todoId) {
  const todo = await Todo.findOne({ where: { id: todoId } });
  return todo;
}

/**
 * 根据 ID 删除待办事项
 * @param {number} todoId - 待办事项 ID
 * @returns {Promise<void>}
 */
export async function deleteTodoById(todoId) {
  await Todo.destroy({
    where: {
      id: todoId,
    },
  });
}

/**
 * 创建新的待办事项
 * @param {Object} addTodo - 待办事项数据
 * @returns {Promise<Object>} - 返回新创建的待办事项
 */
export async function createTodo(addTodo) {
  const addedTodo = await Todo.create(addTodo);
  return addedTodo;
}

/**
 * 更新待办事项
 * @param {Object} updateTodo - 待办事项更新数据，必须包含 id
 * @returns {Promise<void>}
 */
export async function updateTodo(updateTodo) {
  await Todo.update(updateTodo, {
    where: {
      id: updateTodo.id,
    },
  });
}

/**
 * 统计待办事项数量（可带搜索条件）
 * @param {string} search - 搜索关键字（可选）
 * @returns {Promise<number>} - 返回待办事项总数
 */
export async function countTodo(search) {
  let titleFilter = {};

  // 如果有搜索条件，按 title 模糊匹配统计
  if (search) {
    titleFilter = {
      where: {
        title: {
          [Op.like]: `%${search}%`,
        },
      },
    };
  }

  // 统计数量
  return await Todo.count(titleFilter);
}
```

### 4.8 sequelize重写方法

./src/services/todoService.js

```js
import { Op, where } from 'sequelize';
import Todo from '../models/todoModel.js';
import sequelize from '../utils/dbHelper.js';

/**
 * 获取所有 Todo 任务，支持分页和模糊搜索
 * @param {number} offset - 数据起始位置(偏移量)，用于分页
 * @param {number} limit - 每页返回的数据数量，默认 5 条
 * @param {string} search - 搜索关键字，用于模糊匹配 title
 * @returns {Promise<Array>} 返回 Todo 列表
 */
export async function getAllTodos(offset, limit = 5, search) {
  let titleFilter = {};

  // 如果传入了搜索关键字，使用 LOWER() 实现不区分大小写的模糊搜索
  if (search) {
    titleFilter = {
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('title')), // 把 title 转成小写
        {
          [Op.like]: `%${search.toLowerCase()}%`,      // 模糊匹配关键字
        }
      ),
    };
  }

  // 查询 Todo 列表，支持分页和模糊搜索
  const todos = await Todo.findAll({
    offset,  // 跳过多少条数据
    limit,   // 限制返回多少条
    ...titleFilter, // 如果有搜索条件就加上
  });

  return todos;
}

/**
 * 根据 ID 获取单个 Todo 任务
 * @param {number} todoId - Todo 的 ID
 * @returns {Promise<Object|null>} 返回 Todo 对象或 null
 */
export async function getTodoById(todoId) {
  const todo = await Todo.findOne({ where: { id: todoId } });
  return todo;
}

/**
 * 根据 ID 删除 Todo
 * @param {number} todoId - Todo 的 ID
 */
export async function deleteTodoById(todoId) {
  await Todo.destroy({
    where: {
      id: todoId,
    },
  });
}

/**
 * 创建新的 Todo
 * @param {Object} addTodo - 要添加的 Todo 对象
 * @returns {Promise<Object>} 返回新建的 Todo 对象
 */
export async function createTodo(addTodo) {
  const addedTodo = await Todo.create(addTodo);
  return addedTodo;
}

/**
 * 更新 Todo 信息
 * @param {Object} updateTodo - 包含更新数据的对象，必须有 id 字段
 */
export async function updateTodo(updateTodo) {
  await Todo.update(updateTodo, {
    where: {
      id: updateTodo.id,
    },
  });
}

/**
 * 统计 Todo 的数量，支持模糊搜索
 * @param {string} search - 搜索关键字
 * @returns {Promise<number>} 返回符合条件的 Todo 总数
 */
export async function countTodo(search) {
  let titleFilter = {};

  // 同样支持不区分大小写的模糊搜索
  if (search) {
    titleFilter = {
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('title')),
        {
          [Op.like]: `%${search.toLowerCase()}%`,
        }
      ),
    };
  }

  // 统计符合条件的 Todo 数量
  return await Todo.count(titleFilter);
}
```

### 4.9 本地数据库

使用本地pg和mysql替换supabase云数据库

- pg

.env

```
PORT=3000
DB_HOST=192.168.1.12
DB_PORT=5432
DB_USER=user_7yDNCw
DB_PASSWORD=password_yBFdTz
DB_NAME=postgres
```

- mysql

.env

```
DB_HOST=192.168.1.12
DB_PORT=3306
DB_USER=root
DB_PASSWORD=mysql_Wy4Yst
DB_NAME=course
```

- 安装mysql2模块

```shell
npm install mysql2
```

./src/utils/dbHelper.js

```js
import { Sequelize } from 'sequelize';

const databaseConfig = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
};

// console.log(databaseConfig);

const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    // dialect: 'postgres',
    dialect: 'mysql',
  }
);

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sequelize;
```

## 五、安全

### 5.1 接口限流

接口限流主要是为了保护系统的稳定性和可用性，防止因为高并发或恶意请求导致系统瘫痪或资源耗尽

本项目使用的是express，由现成的模块可以使用

- 安装

```shell
npm i express-rate-limit
```

app.js

```js
import express from 'express';
import cors from 'cors';
import todoRouter from './routes/todoRoute.js';
import { rateLimit } from 'express-rate-limit'

// 配置限流中间件
const limiter = rateLimit({
  windowMs: 1000,          // 时间窗口：1 秒
  limit: 5,              // 每个 IP 在时间窗口内最多可发 5 个请求
  standardHeaders: 'draft-8', // 在响应头返回限流信息，遵循 draft-8 标准
  legacyHeaders: false,    // 禁用旧版 X-RateLimit-* 头
  ipv6Subnet: 56,          // 针对 IPv6 地址的子网掩码，减少每个唯一 IPv6 地址的存储量
  // store: ... ,           // 可选：自定义存储，比如用 Redis 代替内存存储，适合分布式部署
})

const app = express();

// 允许跨域请求，避免前端跨域访问 API 时出错
app.use(cors());

// 解析 JSON 请求体，req.body 才能直接获取 JSON 数据
app.use(express.json());

// 应用限流中间件，保护所有接口不被过度访问
app.use(limiter);

// 所有以 /v1 开头的请求都交给 todoRouter 处理
app.use('/v1', todoRouter);

export default app;
```

### 5.2 日志-上

日志（Logging）就是把程序运行中的关键信息记录下来，用于快速定位问题

morgan是express自带的日志工具

pino是最常用的日志工具

- 安装morgan

```shell
npm i morgan
```

app.js

```js
import express from 'express';
import cors from 'cors';
import todoRouter from './routes/todoRoute.js';

import { rateLimit } from 'express-rate-limit'
import morgan from 'morgan'

// 配置接口限流
const limiter = rateLimit({
  windowMs: 1000,          // 时间窗口：1 秒
  limit: 100,              // 每个 IP 在 1 秒内最多能发 100 个请求
  standardHeaders: 'draft-8', // 在响应头中返回标准化的限流信息（比如剩余请求数）
  legacyHeaders: false,    // 禁用旧版 X-RateLimit-* 响应头
  ipv6Subnet: 56,          // 针对 IPv6 地址，限制精度，减少存储量
  // store: ... ,           // 可选：自定义存储，比如 Redis，适合多实例或分布式部署
})

const app = express();

// 允许跨域请求，解决前后端不在同一域名下的跨域问题
app.use(cors());

// 解析 JSON 格式的请求体，让 req.body 可以直接获取 JSON 数据
app.use(express.json());

// 接口限流中间件，防止恶意请求或高并发导致服务器压力过大
app.use(limiter);

// HTTP 请求日志中间件，'tiny' 模式会简洁地记录请求方法、路径、状态码和响应时间
app.use(morgan('tiny'));

// 所有 /v1 开头的路由交给 todoRouter 处理
app.use('/v1', todoRouter);

export default app;
```

./src/utils/deHelper.js

暂时禁用sequelize日志

```js
// 从 'sequelize' 包中导入 Sequelize 类，用于连接和操作数据库
import { Sequelize } from 'sequelize';

// 数据库配置对象，从环境变量中读取配置
const databaseConfig = {
  database: process.env.DB_NAME,     // 数据库名称
  username: process.env.DB_USER,     // 数据库用户名
  password: process.env.DB_PASSWORD, // 数据库密码
  host: process.env.DB_HOST,         // 数据库主机地址
  port: Number(process.env.DB_PORT), // 数据库端口，转为数字类型
};

// 可以用来调试，查看当前数据库配置
// console.log(databaseConfig);

// 使用 Sequelize 创建数据库连接实例
const sequelize = new Sequelize(
  databaseConfig.database, // 数据库名称
  databaseConfig.username, // 用户名
  databaseConfig.password, // 密码
  {
    host: databaseConfig.host, // 数据库主机
    dialect: 'postgres',       // 数据库类型（这里是 PostgreSQL）
    // dialect: 'mysql',       // 如果使用 MySQL，可以取消注释并注释掉上面一行
    logging: false,            // 是否打印 SQL 查询日志，false 表示不打印
  }
);

// 尝试连接数据库并验证是否成功
try {
  await sequelize.authenticate(); // 测试数据库连接
  console.log('Connection has been established successfully.'); // 成功日志
} catch (error) {
  console.error('Unable to connect to the database:', error); // 失败日志
}

// 导出 sequelize 实例，以便在其他文件中使用
export default sequelize;
```

### 5.3 日志-中

- 安装pino

```shell
npm i pino
```

可以进一步将控制台的日志美化，安装pino-pretty

- 安装pino-pretty

```shell
npm i pino-pretty
```

loggerHelper.js

```js
import pino from 'pino';

// 配置 Pino 日志的输出方式（transport 负责日志输出的目标）
const transport = pino.transport({
    targets: [
        {
            // 第一个目标：将 info 及以上级别的日志写入 app-logs.log 文件
            target: 'pino/file',         // 输出到文件
            level: 'info',               // 日志级别：info、warn、error、debug 等
            options: {
                destination: './src/logs/app-logs.log', // 日志文件路径
                mkdir: true              // 如果目录不存在，自动创建
            }
        },
        {
            // 第二个目标：将 error 级别的日志单独写入 error.log 文件
            target: 'pino/file',
            level: 'error',
            options: {
                destination: './src/logs/error.log',
                mkdir: true
            }
        },
        {
            // 第三个目标：在控制台美化日志输出（带颜色、结构化）
            target: 'pino-pretty',       // 美化输出插件
            level: 'info',               // info 级别及以上的日志都会显示在控制台
            options: {
                colorize: true           // 在终端输出带颜色，方便区分日志级别
            }
        }
    ]
})

// 创建 Pino 日志实例，加载上面定义的 transport
const logger = pino(transport)

export default logger; // 导出 logger，供其他模块使用
```

./src/controller/todoController.js

```js
// 导入服务层方法，用于操作数据库
import {
  getAllTodos,
  getTodoById as getTodoByIdApi,
  deleteTodoById as deleteTodoByIdApi,
  createTodo as createTodoApi,
  updateTodo as updateTodoApi,
  countTodo as countTodoApi,
} from '../services/todoService.js';

// 导入日志工具，用于记录操作日志
import logger from '../utils/loggerHelper.js';

/**
 * 获取所有 Todo 列表，支持分页和搜索
 */
export async function getTodos(req, res) {
  const page = req.query.page || 1;   // 当前页码，默认 1
  const limit = req.query.limit || 5; // 每页条数，默认 5
  const search = req.query.search || ''; // 搜索关键字，默认空字符串

  const offset = (page - 1) * limit; // 计算分页偏移量
  
  logger.info(`page ${page}, limit ${limit}, search ${search}`); // 打印请求信息

  const todos = await getAllTodos(offset, limit, search); // 调用服务层获取 Todo 数据

  logger.info(JSON.stringify(todos)); // 打印获取到的数据

  return res.status(200).json(todos); // 返回数据给客户端
}

/**
 * 根据 ID 获取单个 Todo
 */
export async function getTodoById(req, res) {
  if (!req.params.todoId) {
    return res.status(400).send('todoId is required'); // 参数校验
  }

  const todo = await getTodoByIdApi(req.params.todoId); // 调用服务层获取 Todo

  if (todo) {
    return res.status(200).json(todo); // 如果存在，返回数据
  }

  return res.status(404).send('404 Not Found'); // 不存在返回 404
}

/**
 * 根据 ID 删除 Todo
 */
export async function deleteTodoById(req, res) {
  const todoId = req.params.todoId;

  if (!todoId) {
    return res.status(400).send('todoId is required'); // 参数校验
  }

  await deleteTodoByIdApi(todoId); // 调用服务层删除 Todo

  return res.status(200).json({
    message: 'Todo deleted successfully', // 返回成功信息
  });
}

/**
 * 创建新的 Todo
 */
export async function createTodo(req, res) {
  const addTodo = req.body; // 从请求体获取新增 Todo 数据

  if (!addTodo) {
    return res.status(400).send('Bad request'); // 参数校验
  }

  const addedTodo = await createTodoApi(addTodo); // 调用服务层创建 Todo

  return res.status(200).json({
    message: 'Todo added successfully', // 返回成功信息
    data: addedTodo,                   // 返回创建后的数据
  });
}

/**
 * 更新 Todo 信息
 */
export async function updateTodo(req, res) {
  const updateTodo = req.body; // 从请求体获取更新数据

  const updatedTodo = await updateTodoApi(updateTodo); // 调用服务层更新 Todo

  return res.status(200).json({
    message: 'Todo updated successfully', // 返回成功信息
    data: updatedTodo,                    // 返回更新后的数据
  });
}

/**
 * 获取 Todo 总数，可根据搜索条件过滤
 */
export async function countTodo(req, res) {
  const search = req.query.search; // 搜索关键字

  const todoCount = await countTodoApi(search); // 调用服务层获取数量

  return res.status(200).json({
    count: todoCount, // 返回数量
  });
}
```

### 5.4 日志-下

pino-http 是 Pino 日志库的一个中间件，专门用来在 Node.js HTTP 服务（如 Express、Fastify、原生 HTTP）中自动记录 HTTP 请求和响应日志

使用pino-http可以自动记录请求信息，不用手动写函数了，更方便

- 安装pino-http

```shell
npm install pino-http
```

./src/app.js

```js
// 导入所需依赖
import express from 'express';          // Express 框架，用于创建 HTTP 服务
import cors from 'cors';                // CORS 中间件，解决跨域请求问题
import todoRouter from './routes/todoRoute.js'; // 导入 Todo 路由文件
import { rateLimit } from 'express-rate-limit'; // 限流中间件，用于防止接口被滥用
import { pinoHttpMiddleware } from './utils/loggerHelper.js'; // HTTP 请求日志中间件

// 配置限流中间件
const limiter = rateLimit({
  windowMs: 1000,             // 限流时间窗口：1 秒
  limit: 5,                   // 每个 IP 在 1 秒内最多允许 5 次请求
  standardHeaders: 'draft-8', // 在响应头返回限流信息，遵循最新的 draft-8 标准
  legacyHeaders: false,        // 禁用旧版 X-RateLimit-* 响应头
  ipv6Subnet: 56,              // 针对 IPv6 地址的子网掩码，减少每个唯一 IPv6 地址的存储量
  // store: ... ,               // 可选：可自定义存储，如使用 Redis 适合分布式部署
});

// 创建 Express 应用实例
const app = express();

// 允许跨域请求，解决前后端分离开发的跨域问题
app.use(cors());

// 解析请求体中的 JSON 数据，方便在路由中直接使用 req.body
app.use(express.json());

// 应用限流中间件，保护所有 API 接口，防止恶意高频访问
app.use(limiter);

// 应用 HTTP 请求日志中间件，记录每个请求的详细信息
app.use(pinoHttpMiddleware);

// 注册路由，将 /v1 开头的接口交给 todoRouter 处理
app.use('/v1', todoRouter);

// 导出 app 实例，供其他文件（如 server.js）使用
export default app;
```

./src/controller/todoController.js

```js
// 导入服务层方法，用于操作数据库
import {
  getAllTodos,
  getTodoById as getTodoByIdApi,
  deleteTodoById as deleteTodoByIdApi,
  createTodo as createTodoApi,
  updateTodo as updateTodoApi,
  countTodo as countTodoApi,
} from '../services/todoService.js';


/**
 * 获取所有 Todo 列表，支持分页和搜索
 */
export async function getTodos(req, res) {
  const page = req.query.page || 1;   // 当前页码，默认 1
  const limit = req.query.limit || 5; // 每页条数，默认 5
  const search = req.query.search || ''; // 搜索关键字，默认空字符串

  const offset = (page - 1) * limit; // 计算分页偏移量

  const todos = await getAllTodos(offset, limit, search); // 调用服务层获取 Todo 数据

  return res.status(200).json(todos); // 返回数据给客户端
}

/**
 * 根据 ID 获取单个 Todo
 */
export async function getTodoById(req, res) {
  if (!req.params.todoId) {
    return res.status(400).send('todoId is required'); // 参数校验
  }

  const todo = await getTodoByIdApi(req.params.todoId); // 调用服务层获取 Todo

  if (todo) {
    return res.status(200).json(todo); // 如果存在，返回数据
  }

  return res.status(404).send('404 Not Found'); // 不存在返回 404
}

/**
 * 根据 ID 删除 Todo
 */
export async function deleteTodoById(req, res) {
  const todoId = req.params.todoId;

  if (!todoId) {
    return res.status(400).send('todoId is required'); // 参数校验
  }

  await deleteTodoByIdApi(todoId); // 调用服务层删除 Todo

  return res.status(200).json({
    message: 'Todo deleted successfully', // 返回成功信息
  });
}

/**
 * 创建新的 Todo
 */
export async function createTodo(req, res) {
  const addTodo = req.body; // 从请求体获取新增 Todo 数据

  if (!addTodo) {
    return res.status(400).send('Bad request'); // 参数校验
  }

  const addedTodo = await createTodoApi(addTodo); // 调用服务层创建 Todo

  return res.status(200).json({
    message: 'Todo added successfully', // 返回成功信息
    data: addedTodo,                   // 返回创建后的数据
  });
}

/**
 * 更新 Todo 信息
 */
export async function updateTodo(req, res) {
  const updateTodo = req.body; // 从请求体获取更新数据

  const updatedTodo = await updateTodoApi(updateTodo); // 调用服务层更新 Todo

  return res.status(200).json({
    message: 'Todo updated successfully', // 返回成功信息
    data: updatedTodo,                    // 返回更新后的数据
  });
}

/**
 * 获取 Todo 总数，可根据搜索条件过滤
 */
export async function countTodo(req, res) {
  const search = req.query.search; // 搜索关键字

  const todoCount = await countTodoApi(search); // 调用服务层获取数量

  return res.status(200).json({
    count: todoCount, // 返回数量
  });
}
```

loggerHelper.js

```js
import pino from 'pino';
import pinoHttp from 'pino-http';

// 配置 Pino 日志输出目标（transport 定义日志去哪里、怎么输出）
const transport = pino.transport({
    targets: [
        {
            // 将 info 级别及以上的日志输出到 app-logs.log 文件
            target: 'pino/file', // 输出到文件
            level: 'info',       // 日志级别：info ≥ warn ≥ error
            options: {
                destination: './src/logs/app-logs.log', // 日志文件存储路径
                mkdir: true // 如果目录不存在则自动创建
            }
        },
        {
            // 将 error 级别的日志单独输出到 error.log 文件
            target: 'pino/file',
            level: 'error',
            options: {
                destination: './src/logs/error.log',
                mkdir: true
            }
        },
        {
            // 在控制台美化输出日志（仅开发环境推荐）
            target: 'pino-pretty', // 使用 pino-pretty 插件美化日志
            level: 'info',         // info 级别及以上的日志会显示
            options: {
                colorize: true // 控制台日志带颜色，便于阅读
            }
        }
    ]
})

// 创建 Pino 日志实例
export const logger = pino(transport)

// 创建 pino-http 中间件，用于自动记录 HTTP 请求/响应日志
// 在 Express 里通过 app.use(pinoHttpMiddleware) 使用
export const pinoHttpMiddleware = pinoHttp({
    logger: logger // 使用上面定义的 Pino 实例，保证日志输出到同样的地方
})
```

### 5.5 中间件

中间件就是一个函数，会在请求到达路由前或响应返回前执行

Express 中间件是严格按照顺序加载和执行的，有的中间件没有next，后续的中间件就无法加载

### 5.6 pino与中间件

中间件错误处理，敏感信息暴露，请不要把请求体和响应体的内容打印到日志中

./src/app.js

```js
// 导入必要的依赖
import express from 'express';          // Express 框架，用于搭建 HTTP 服务器
import cors from 'cors';                // CORS 中间件，解决跨域访问问题
import todoRouter from './routes/todoRoute.js'; // Todo 相关的路由
import { rateLimit } from 'express-rate-limit'; // 限流中间件，防止接口被滥用
import { pinoHttpMiddleware } from './utils/loggerHelper.js'; // 日志中间件，用于记录请求信息

// 配置限流中间件
const limiter = rateLimit({
  windowMs: 1000,             // 时间窗口：1 秒
  limit: 5,                   // 每个 IP 在 1 秒内最多可发 5 个请求
  standardHeaders: 'draft-8', // 在响应头中返回限流信息，使用 draft-8 标准
  legacyHeaders: false,        // 禁用旧版 X-RateLimit-* 响应头
  ipv6Subnet: 56,              // IPv6 子网掩码，用于减少唯一 IPv6 地址的存储量
  // store: ... ,               // 可选：自定义存储，如 Redis，适合分布式部署
});

const app = express();

// 启用跨域，解决前后端分离场景下的跨域问题
app.use(cors());

// 解析请求体中的 JSON 数据，方便在路由中通过 req.body 获取
app.use(express.json());

// 应用限流中间件，保护所有接口，防止被恶意高频访问
app.use(limiter);

// 自定义中间件：重写 res.json 方法，方便在日志中记录响应体
app.use((_req, res, next) => {
  // 保存原始的 res.json 方法
  const orginJson = res.json;

  // 重写 res.json 方法，增加记录响应体功能
  res.json = function (body) {
    res.body = body; // 将响应体存储到 res.body，供日志中间件访问

    // 调用原始的 res.json 方法返回数据
    orginJson.call(this, body);

    return this; // 返回当前响应对象，保证链式调用兼容
  };

  next(); // 继续执行下一个中间件
});

// 应用 Pino 日志中间件，记录每个请求的详细信息
app.use(pinoHttpMiddleware);

// 注册 Todo 路由，所有 /v1 开头的请求都会交给 todoRouter 处理
app.use('/v1', todoRouter);

// 导出 app 实例，供 server.js 或测试文件使用
export default app;
```

./src/utils/loggerHelper.js

```js
import pino from 'pino';
import pinoHttp from 'pino-http';

// 配置 Pino 日志输出目标
// transport 定义日志输出的方式、位置、格式等
const transport = pino.transport({
    targets: [
        {
            // 将 info 级别及以上的日志写入 app-logs.log 文件
            // info ≥ warn ≥ error，优先级从高到低
            target: 'pino/file', // 输出到文件
            level: 'info',       // 记录 info 及以上的日志
            options: {
                destination: './src/logs/app-logs.log', // 日志文件路径
                mkdir: true // 如果目录不存在，自动创建
            }
        },
        {
            // 将 error 级别日志单独写入 error.log 文件，方便快速查看错误
            target: 'pino/file',
            level: 'error', // 只记录 error 级别日志
            options: {
                destination: './src/logs/error.log', // 错误日志文件路径
                mkdir: true
            }
        },
        {
            // 在控制台输出美化后的日志，适合开发环境
            target: 'pino-pretty', // 使用 pino-pretty 插件美化控制台日志
            level: 'info',         // 输出 info 及以上的日志
            options: {
                colorize: true // 控制台日志带颜色，方便调试和阅读
            }
        }
    ]
})

// 创建 Pino 日志实例，供全局使用
export const logger = pino(transport)

// 创建 pino-http 中间件，用于在 Express 中自动记录 HTTP 请求和响应日志
// 通过 app.use(pinoHttpMiddleware) 使用
export const pinoHttpMiddleware = pinoHttp({
    logger: logger, // 使用上面创建的 Pino 实例，保证所有日志输出到同样的地方

    // serializers 用于自定义序列化 HTTP 请求/响应对象
    // 这里自定义响应对象，增加 body 数据，方便在日志中看到返回数据
    serializers: {
        res: (res) => {
            res.body = res.raw.body // 从原始响应对象中获取 body
            return res;             // 返回增强后的响应对象
        }
    },

    // customLogLevel 用于自定义日志级别
    // 根据响应状态码和错误类型，设置不同的日志等级
    customLogLevel: function (_req, res, err) {
        if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn'   // 4xx 客户端错误 → 警告
        } else if (res.statusCode >= 500 || err) {
            return 'error'  // 5xx 服务端错误或有异常 → 错误
        } else if (res.statusCode >= 300 && res.statusCode < 400) {
            return 'silent' // 3xx 重定向 → 不记录日志
        }
        return 'info'       // 其他情况记录为 info
    },
})
```

### 5.7 错误/异常处理

./src/app.js

```js
import express from 'express';
import cors from 'cors';
import todoRouter from './routes/todoRoute.js';
import { rateLimit } from 'express-rate-limit'
// import { pinoHttpMiddleware } from './utils/loggerHelper.js'; // 日志中间件，暂时注释掉

// 配置限流中间件，防止接口被恶意频繁请求
const limiter = rateLimit({
  windowMs: 1000,             // 时间窗口：1 秒
  limit: 5,                   // 每个 IP 在时间窗口内最多可发 5 个请求
  standardHeaders: 'draft-8', // 在响应头返回限流信息，遵循 draft-8 标准
  legacyHeaders: false,        // 禁用旧版 X-RateLimit-* 响应头
  ipv6Subnet: 56,              // 针对 IPv6 地址的子网掩码，减少每个唯一 IPv6 地址的存储量
  // store: ... ,               // 可选：自定义存储，比如用 Redis 代替内存存储，适合分布式部署
})

const app = express();

// 启用 CORS，允许前端跨域请求
app.use(cors());

// 解析请求体中的 JSON 数据
app.use(express.json());

// 应用限流中间件，保护所有接口
app.use(limiter);

// 自定义中间件（已注释）：重写 res.json 方法，记录响应数据，便于日志中间件使用
// app.use((_req, res, next) => {
//   const orginJson = res.json; // 保存原始的 res.json 方法

//   res.json = function (body) {
//     res.body = body;          // 将响应数据保存在 res.body，供日志记录
//     orginJson.call(this, body); // 调用原始 res.json 方法发送数据
//     return this;               // 保持返回 this，以支持链式调用
//   }

//   next(); // 继续执行下一个中间件
// })

// 应用 Pino 日志中间件（已注释），记录每个 HTTP 请求和响应日志
// app.use(pinoHttpMiddleware)

// 注册路由，所有 /v1 开头的接口交给 todoRouter 处理
app.use('/v1', todoRouter);

// 全局错误处理中间件
app.use((err, _req, res, _next) => {
  // 从错误对象中解构出 name、message、statusCode，提供默认值防止报错
  const { name = 'Unknown Error', message = 'Something broke!', statusCode = 500 } = err

  // 可以在调试时打印错误详细信息
  // console.log(name, message, statusCode);

  // 返回错误状态码和错误信息
  res.status(statusCode).send(message)
})

export default app;
```

./src/controllers/todoController.js
```js
import {
  getAllTodos,
  getTodoById as getTodoByIdApi,
  deleteTodoById as deleteTodoByIdApi,
  createTodo as createTodoApi,
  updateTodo as updateTodoApi,
  countTodo as countTodoApi,
} from '../services/todoService.js';
import AppError from '../utils/AppError.js';

/**
 * 获取所有 Todo，支持分页和搜索
 */
export async function getTodos(req, res) {
  const page = req.query.page || 1;      // 当前页码
  const limit = req.query.limit || 5;    // 每页数据条数
  const search = req.query.search || ''; // 搜索关键字

  const offset = (page - 1) * limit;     // 计算分页起始位置

  try {
    const todos = await getAllTodos(offset, limit, search); // 调用服务层获取数据
    return res.status(200).json(todos);                     // 返回数据
  } catch (err) {
    throw new AppError('Failed to fetch todos', 500, err.name); // 抛出错误，交给全局错误处理
  }
}

/**
 * 根据 ID 获取单个 Todo
 */
export async function getTodoById(req, res) {
  if (!req.params.todoId) {
    return res.status(400).send('todoId is required'); // 缺少 todoId 参数
  }

  try {
    const todo = await getTodoByIdApi(req.params.todoId); // 调用服务层获取单个 Todo
    if (todo) {
      return res.status(200).json(todo);                  // 找到则返回
    }
    return res.status(404).send('404 Not Found');         // 未找到返回 404
  } catch (err) {
    throw new AppError(`Failed to fetch todo with id ${req.params.todoId}`, 500, err.name);
  }
}

/**
 * 根据 ID 删除 Todo
 */
export async function deleteTodoById(req, res) {
  const todoId = req.params.todoId;

  if (!todoId) {
    return res.status(400).send('todoId is required'); // 缺少 todoId 参数
  }

  try {
    await deleteTodoByIdApi(todoId); // 调用服务层删除 Todo
    return res.status(200).json({
      message: 'Todo deleted successfully',
    });
  } catch (err) {
    throw new AppError(`Failed to delete todo with id ${todoId}`, 500, err.name);
  }
}

/**
 * 创建新的 Todo
 */
export async function createTodo(req, res) {
  const addTodo = req.body;

  if (!addTodo) {
    return res.status(400).send('Bad request'); // 缺少请求体
  }

  try {
    const addedTodo = await createTodoApi(addTodo); // 调用服务层创建 Todo
    return res.status(200).json({
      message: 'Todo added successfully',
      data: addedTodo,
    });
  } catch (err) {
    // 这里假设唯一约束导致创建失败，返回 400
    throw new AppError(`The id ${addTodo.id} already exists`, 400, err.name);
  }
}

/**
 * 更新 Todo
 */
export async function updateTodo(req, res) {
  const updateTodo = req.body; // 请求体中包含更新信息

  try {
    const updatedTodo = await updateTodoApi(updateTodo); // 调用服务层更新 Todo
    return res.status(200).json({
      message: 'Todo updated successfully',
      data: updatedTodo,
    });
  } catch (err) {
    throw new AppError(`Failed to update todo with id ${updateTodo.id}`, 500, err.name);
  }
}

/**
 * 统计 Todo 总数，可根据搜索条件过滤
 */
export async function countTodo(req, res) {
  const search = req.query.search; // 搜索关键字

  try {
    const todoCount = await countTodoApi(search); // 调用服务层统计 Todo 数量
    return res.status(200).json({
      count: todoCount,
    });
  } catch (err) {
    throw new AppError('Failed to count todos', 500, err.name);
  }
}
```

### 5.8 响应重构

- 安装madge

madge 是一个 JavaScript/TypeScript 的依赖关系可视化与分析工具，主要用来分析你的代码中各个模块之间的依赖关系

推荐全局安装

```shell
npm install -g madge
```

- 安装Graphviz 

madge使用Graphviz 来生成图片

[Download | Graphviz](https://graphviz.org/download/)

./src/app.js

```js
// 引入必要的模块
import express from 'express';          // Express 框架，用于创建服务器
import cors from 'cors';                // 处理跨域请求的中间件
import todoRouter from './routes/todoRoute.js';  // 处理 /v1 路径下的路由
import { pinoHttpMiddleware } from './utils/loggerHelper.js'; // HTTP 请求日志中间件
import rateLimit from './utils/rateLimiter.js';  // 限流中间件，防止接口被滥用
import globalErrorhandler from './utils/globalErrorhandler.js'; // 全局错误处理器

// 创建 Express 应用
const app = express();

// 允许跨域访问
app.use(cors());

// 解析 JSON 请求体，方便在 req.body 中访问数据
app.use(express.json());

// 启用限流中间件，限制请求频率
app.use(rateLimit);

// 启用日志中间件，记录请求信息（比如方法、路径、响应时间等）
app.use(pinoHttpMiddleware);

// 将 /v1 前缀的所有请求交给 todoRouter 处理
app.use('/v1', todoRouter);

// 全局错误处理器，捕获所有错误并返回统一格式的响应
app.use(globalErrorhandler);

// 导出 app 实例，供 server.js 或其他文件启动服务器
export default app;
```

./src/utils/rateLimiter.js

```js
import { rateLimit } from 'express-rate-limit'

// 配置限流中间件
export default rateLimit({
  windowMs: 1000,          // 时间窗口：1 秒
  limit: 5,              // 每个 IP 在时间窗口内最多可发 100 个请求
  standardHeaders: 'draft-8', // 在响应头返回限流信息，遵循 draft-8 标准
  legacyHeaders: false,    // 禁用旧版 X-RateLimit-* 头
  ipv6Subnet: 56,          // 针对 IPv6 地址的子网掩码，减少每个唯一 IPv6 地址的存储量
  // store: ... ,           // 可选：自定义存储，比如用 Redis 代替内存存储，适合分布式部署
})
```

./src/utils/globalErrorhandler.js

```js
// 引入一个工具函数，用于发送统一格式的 JSON 响应
import { sendJsonResponse } from "./responseHelper.js"

/**
 * 全局错误处理中间件
 * - 用于捕获在路由或中间件中发生的所有错误
 * - Express 会在发生错误时自动将错误对象传递给这个函数
 * 
 * @param {Object} err - 错误对象，可能包含 name、message、statusCode 等信息
 * @param {Object} _req - Express 请求对象 (这里用不到，所以命名为 _req)
 * @param {Object} res - Express 响应对象，用于返回错误信息
 * @param {Function} _next - Express 的 next 函数 (这里用不到，所以命名为 _next)
 */
export default function globalErrorhandler(err, _req, res, _next) {
    // 从错误对象中解构需要的信息，提供默认值避免 undefined
    const { 
        name = 'Unknown Error',        // 错误名称（如果没有，默认 "Unknown Error"）
        message = 'Something broke!',  // 错误消息（默认 "Something broke!"）
        statusCode = 500               // HTTP 状态码（默认 500，表示服务器内部错误）
    } = err

    // 调用统一响应函数，返回标准的 JSON 格式错误信息
    return sendJsonResponse(res, statusCode, message)
}
```

./src/utils/AppError.js

```js
/**
 * 自定义错误类 AppError
 * - 继承自 JavaScript 内置的 Error 类
 * - 方便我们在项目中创建带有状态码和名称的错误对象
 */
export default class AppError extends Error {
    /**
     * 构造函数
     * @param {string} message - 错误信息，描述错误原因
     * @param {number} statusCode - HTTP 状态码，例如 400, 404, 500
     * @param {string} name - 错误名称，方便区分不同类型的错误
     */
    constructor(message, statusCode, name) {
        super(message);        // 调用父类构造函数，设置错误信息
        this.statusCode = statusCode;  // 保存 HTTP 状态码
        this.name = name;               // 保存错误名称
    }
}
```

./src/utils/responseHelper.js

```js
/**
 * 发送统一格式的 JSON 响应
 * @param {Object} res - Express 的响应对象
 * @param {number} statusCode - HTTP 状态码，例如 200, 404, 500
 * @param {string} message - 响应的提示信息，默认 "Success"
 * @param {Object|null} data - 可选的数据对象，如果存在就会返回到前端
 */
export function sendJsonResponse(res, statusCode, message = 'Success', data = null) {
    return res.status(statusCode).json({
        message,              // 返回的提示信息
        ...(data && { data })  // 如果 data 存在，就返回 data 字段，否则不添加
    })
}

/**
 * 发送成功的 JSON 响应
 * - 状态码默认 200
 * @param {Object} res - Express 的响应对象
 * @param {Object} data - 成功时需要返回的数据
 * @param {string} message - 可选的提示信息
 */
export function sendSuccessResponse(res, data, message) {
    return sendJsonResponse(res, 200, message, data)
}

/**
 * 发送 404 Not Found 响应
 * - 当请求的资源不存在时调用
 * @param {Object} res - Express 的响应对象
 * @param {string} message - 可选的提示信息，默认 "Not Found"
 */
export function sendNotFoundResponse(res, message = 'Not Found') {
    return sendJsonResponse(res, 404, message)
}
```

./src/services/todoService.js

```js
import { Op } from 'sequelize';             // Sequelize 操作符，提供 like 等查询功能
import Todo from '../models/todoModel.js';  // 导入 Todo 模型
import sequelize from '../utils/dbHelper.js'; // 导入 Sequelize 实例，用于构建查询条件

/**
 * 获取所有 Todo
 * @param {number} offset - 数据偏移量（用于分页）
 * @param {number} limit - 每页数据量，默认 5
 * @param {string} search - 搜索关键词，可选
 * @returns {Promise<Array>} - 返回符合条件的 Todo 列表
 */
export async function getAllTodos(offset, limit = 5, search) {
  let titleFilter = {}; // 初始化过滤条件为空

  // 如果提供了搜索关键词，构建 WHERE 条件，忽略大小写
  if (search) {
    titleFilter = {
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('title')),  // 将 title 转为小写
        {
          [Op.like]: `%${search.toLowerCase()}%`,       // 模糊匹配搜索关键字
        }
      ),
    };
  }

  // 使用 Sequelize 查询数据，支持分页、模糊查询
  const todos = await Todo.findAll({
    offset,
    limit,
    ...titleFilter,
  });

  return todos;
}

/**
 * 根据 ID 获取单个 Todo
 * @param {number} todoId - Todo 的 ID
 * @returns {Promise<Object|null>} - 返回 Todo 对象或 null
 */
export async function getTodoById(todoId) {
  const todo = await Todo.findOne({ where: { id: todoId } });
  return todo;
}

/**
 * 根据 ID 删除 Todo
 * @param {number} todoId - Todo 的 ID
 * @returns {Promise<number>} - 返回删除的行数，0 表示未删除任何数据
 */
export async function deleteTodoById(todoId) {
  const deletedTodoNumber = await Todo.destroy({
    where: { id: todoId },
  });
  return deletedTodoNumber;
}

/**
 * 创建新的 Todo
 * @param {Object} addTodo - 新增的 Todo 数据
 * @returns {Promise<Object>} - 返回新增的 Todo 对象
 */
export async function createTodo(addTodo) {
  const addedTodo = await Todo.create(addTodo);
  return addedTodo;
}

/**
 * 更新 Todo
 * @param {Object} updateTodo - 包含 id 和要更新字段的对象
 * @returns {Promise<number>} - 返回受影响的行数，0 表示没有更新
 */
export async function updateTodo(updateTodo) {
  const updatedTodoEffect = await Todo.update(updateTodo, {
    where: { id: updateTodo.id },
  });
  return updatedTodoEffect[0]; // Sequelize 返回数组，第一项是受影响的行数
}

/**
 * 统计符合条件的 Todo 数量
 * @param {string} search - 搜索关键词，可选
 * @returns {Promise<number>} - 返回符合条件的 Todo 数量
 */
export async function countTodo(search) {
  let titleFilter = {};

  // 如果提供了搜索关键词，构建 WHERE 条件
  if (search) {
    titleFilter = {
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('title')),
        {
          [Op.like]: `%${search.toLowerCase()}%`,
        }
      ),
    };
  }

  // 返回符合条件的记录数量
  return await Todo.count(titleFilter);
}

```

./src/controllers/todoController.js

```js
import {
  getAllTodos,
  getTodoById as getTodoByIdApi,
  deleteTodoById as deleteTodoByIdApi,
  createTodo as createTodoApi,
  updateTodo as updateTodoApi,
  countTodo as countTodoApi,
} from '../services/todoService.js';
import AppError from '../utils/AppError.js';
import { sendSuccessResponse, sendNotFoundResponse } from '../utils/responseHelper.js';

/**
 * 获取所有 Todo 列表，支持分页和搜索
 * @route GET /v1/todos
 */
export async function getTodos(req, res) {
  // 从 query 参数获取分页和搜索条件
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const search = req.query.search || '';

  // 计算分页的 offset
  const offset = (page - 1) * limit;

  // 调用 service 层获取数据
  const todos = await getAllTodos(offset, limit, search);

  // 返回成功响应
  return sendSuccessResponse(res, todos);
}

/**
 * 根据 ID 获取单个 Todo
 * @route GET /v1/todos/:todoId
 */
export async function getTodoById(req, res) {
  // 调用 service 层通过 ID 查询 Todo
  const todo = await getTodoByIdApi(req.params.todoId);

  // 如果找到了，返回成功；否则返回 404
  if (todo) {
    return sendSuccessResponse(res, todo);
  }

  return sendNotFoundResponse(res);
}

/**
 * 根据 ID 删除 Todo
 * @route DELETE /v1/todos/:todoId
 */
export async function deleteTodoById(req, res) {
  const todoId = req.params.todoId;

  // 如果没有提供 ID，抛出 400 错误
  if (!todoId) {
    throw new AppError(`The id todoId is required`, 400, 'Bad Request');
  }

  // 调用 service 删除 Todo
  const deletedTodoNumber = await deleteTodoByIdApi(todoId);

  // 如果删除数量为 0，说明没有找到，返回 404
  if (!deletedTodoNumber) {
    return sendNotFoundResponse(res);
  }

  // 返回成功响应，包含删除数量
  return sendSuccessResponse(res, deletedTodoNumber);
}

/**
 * 创建新的 Todo
 * @route POST /v1/todos
 */
export async function createTodo(req, res) {
  const addTodo = req.body;

  // 如果没有传递 Todo 数据，返回 400 错误
  if (!addTodo) {
    throw new AppError(`The id todoId is required`, 400, 'Bad Request');
  }

  try {
    // 调用 service 层创建 Todo
    const addedTodo = await createTodoApi(addTodo);

    // 返回创建成功的数据
    return sendSuccessResponse(res, addedTodo);
  } catch (err) {
    // 如果创建失败，比如 ID 已存在，抛出 400 错误
    throw new AppError(`The id ${addTodo.id} already exists`, 400, err.name);
  }
}

/**
 * 更新 Todo
 * @route PUT /v1/todos
 */
export async function updateTodo(req, res) {
  const updateTodo = req.body;

  // 调用 service 层更新数据
  const updatedTodoNumber = await updateTodoApi(updateTodo);

  // 如果没有更新任何数据，返回 404
  if (!updatedTodoNumber) {
    return sendNotFoundResponse(res);
  }

  // 返回更新成功的结果
  return sendSuccessResponse(res, updatedTodoNumber);
}

/**
 * 统计符合条件的 Todo 数量
 * @route GET /v1/todos/count
 */
export async function countTodo(req, res) {
  const search = req.query.search;

  // 调用 service 层统计数据
  const todoCount = await countTodoApi(search);

  // 返回统计结果
  return sendSuccessResponse(res, todoCount);
}
```

在项目目录下使用madge生产依赖关系图

```shell
madge --image architecture.png ./src/server.js
```

### 5.9 JWT原理

JWT（JSON Web Token）是一种在客户端和服务器之间安全传递用户身份信息的小型令牌，带签名保证不被篡改。

特点：

1. 基于 JSON：数据使用 JSON 格式存储，结构简单明了。

2. 数字签名：通过密钥（HMAC）或公私钥对（RSA、ECDSA）进行签名，保证数据不可篡改。

3. 自包含（Self-contained）：JWT 自带了认证所需的信息，减少了服务器的存储负担。


### 5.10 密码安全

- bcrypt加密详解

使用hash方法加密

```js
bcrypt.hash(password, 10)
```

会得到加密后的哈希字符串

```
$2b$10$7QJ7L9tW.ZLx3Y3l6dZ7ReK5vL4HZ/Px9YQJ0e6Gmj9o8F2GmO6iK
```

- bcrypt解密详解

使用compare解密

```js
bcrypt.compare(password, hashed
```

bcrypt解密做了这几步：

1. 从 hashed 哈希值里 提取出盐值和轮数

2. 用同样的盐值和轮数对用户输入的明文密码重新哈希

3. 得到的新哈希值与原哈希值对比是否一致

> 重点：它 不是重新生成随机盐值，而是用原哈希里存的 原盐值 来哈希明文密码。
因此最终得到的哈希与存储的哈希一致

bcrypy工作流程图

```
注册时：
明文密码 → [生成随机盐] → bcrypt 多轮哈希 → 哈希值（存数据库，包含盐）

登录时：
输入密码 → 提取数据库哈希中的盐 → bcrypt 多轮哈希 → 新哈希
新哈希 === 数据库哈希 ? 密码正确 : 密码错误
```

./src/userModel.js

```js
import { DataTypes } from 'sequelize'; // 导入 Sequelize 中的数据类型
import sequelize from '../utils/dbHelper.js'; // 导入已经初始化好的 Sequelize 实例

// 定义 User 模型，对应数据库中的 tb_user 表
const User = sequelize.define(
  'User', // 模型名称
  {
    id: {
      type: DataTypes.BIGINT, // 数据类型为 BIGINT（大整数）
      primaryKey: true,       // 设置为主键
    },
    email: {
      type: DataTypes.TEXT,  // 数据类型为文本
      unique: true,	         // 唯一约束
      validate: {
        isEmail: true,       // 验证格式是否为合法邮箱
      },
    },
    password: {
      type: DataTypes.TEXT,  // 数据类型为文本
      validate: {
        len: [8, 100],       // 验证长度在 8~100 个字符之间
      },
    },
  },
  {
    tableName: 'tb_user', // 指定数据库表名为 tb_user
    createdAt: false,     // 不自动创建 createdAt 字段
    updatedAt: false,     // 不自动创建 updatedAt 字段
  }
);

export default User; // 导出 User 模型，供其他模块使用
```

./src/services/userService.js

```js
import User from '../models/userModel.js'; // 导入 User 模型
import bcrypt from 'bcrypt'; // 导入 bcrypt，用于密码加密和验证

// 创建新用户
export async function createUser(email, password) {
  // 使用 bcrypt 对密码进行加密，10 为加密强度（saltRounds）
  const encryptedPassword = await bcrypt.hash(password, 10);

  // 调用 Sequelize 的 create 方法向数据库插入新用户
  const createdUser = await User.create({
    id: Date.now(),        // 使用时间戳作为用户 id（简单示例，实际可用自增或 UUID）
    email,                 // 用户邮箱
    password: encryptedPassword, // 存储加密后的密码
  });

  return createdUser; // 返回创建的用户对象
}

// 验证用户登录
export async function verifyUser(email, password) {
  // 根据邮箱查找用户
  const user = await User.findOne({ where: { email } });

  if (!user) return false; // 如果用户不存在，返回 false

  // 使用 bcrypt 比较输入的明文密码与数据库加密密码是否匹配
  const result = await bcrypt.compare(password, user.password);

  return result; // 返回验证结果（true 或 false）
}
```

./src/controllers/userController.js

```js
import AppError from '../utils/AppError.js'; // 自定义错误类，用于抛出统一错误
import {
  createUser as createUserApi,
  verifyUser,
} from '../services/userService.js'; // 导入用户服务逻辑
import { sendSuccessResponse } from '../utils/responseHelper.js'; // 统一成功响应封装

// 创建新用户控制器
export async function createUser(req, res) {
  const { email, password } = req.body; // 从请求体获取邮箱和密码

  // 校验请求参数是否存在
  if (!email || !password) {
    // 如果缺少邮箱或密码，抛出 400 错误
    throw new AppError(`Email and password are required`, 400, 'Bad request');
  }

  // 调用服务层逻辑创建用户
  const createdUser = await createUserApi(email, password);

  // 返回统一格式的成功响应
  return sendSuccessResponse(res, createdUser);
}

// 用户登录控制器
export async function login(req, res) {
  const { email, password } = req.body; // 从请求体获取邮箱和密码

  // 校验请求参数是否存在
  if (!email || !password) {
    throw new AppError(`Email and password are required`, 400, 'Bad request');
  }

  console.log(email, password); // 输出登录信息（仅用于调试，生产环境建议删除）

  // 调用服务层逻辑验证用户密码
  const result = await verifyUser(email, password);

  // 如果验证失败，返回 401 未授权
  if (!result) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  // 验证成功，返回统一格式的成功响应
  return sendSuccessResponse(res, result);
}
```

./src/route/userRoute.js

```js
import express from 'express'; // 导入 Express 框架
import { createUser, login } from '../controllers/userController.js'; 
// 导入用户相关的控制器函数（注册和登录）

const router = express.Router(); // 创建一个路由实例

// 注册路由：POST /signup
// 当客户端访问 /signup 并发送 POST 请求时，会调用 createUser 控制器
router.route('/signup').post(createUser);

// 登录路由：POST /login
// 当客户端访问 /login 并发送 POST 请求时，会调用 login 控制器
router.route('/login').post(login);

// 导出路由，供 app.js 或主入口文件使用
export default router;
```

./src/app.js

```js
import express from 'express'; // 导入 Express 框架
import cors from 'cors'; // 导入 CORS 中间件，解决跨域问题
import todoRouter from './routes/todoRoute.js'; // 导入待办事项路由
import { pinoHttpMiddleware } from './utils/loggerHelper.js'; // 导入日志中间件
import rateLimit from './utils/rateLimiter.js'; // 导入限流中间件
import globalErrorhandler from './utils/globalErrorhandler.js'; // 导入全局错误处理器
import userRouter from './routes/userRoute.js'; // 导入用户相关路由（注册、登录）

const app = express(); // 创建 Express 应用实例

// 使用 CORS 中间件，允许跨域请求
app.use(cors());

// 解析请求体中的 JSON 数据
app.use(express.json());

// 使用限流中间件，防止短时间内过多请求
app.use(rateLimit);

// 使用日志中间件，记录每个请求的日志
app.use(pinoHttpMiddleware);

// 注册路由
app.use('/v1', todoRouter); // 待办事项路由，前缀 /v1
app.use('/v1', userRouter); // 用户路由（注册/登录），前缀 /v1

// 全局错误处理器，处理应用中未捕获的异常
app.use(globalErrorhandler);

// 导出 Express 应用实例，供 server.js 或其他入口文件使用
export default app;
```

./src/scripts/seed.js

```js
import { readFile } from 'node:fs/promises'; // 导入 Node.js 文件读取模块（Promise 版本）
import sequelize from '../utils/dbHelper.js'; // 导入 Sequelize 实例
import Todo from '../models/todoModel.js'; // 导入 Todo 模型
import User from '../models/userModel.js'; // 导入 User 模型

try {
  // 1. 读取初始化数据文件（JSON 格式）
  const initializeTodosString = await readFile(
    './src/scripts/data/initData.json', // 初始化数据文件路径
    'utf-8' // 读取为字符串
  );
  const initializeTodos = JSON.parse(initializeTodosString); // 解析 JSON 字符串为对象数组

  // 2. 数据库连接测试（已移到 dbHelper，可选）
  // await sequelize.authenticate();

  // 3. 同步数据库模型到数据库
  // force: true 会先删除表再重新创建（慎用，适合初始化）
  await Todo.sync({ force: true });
  await User.sync({ force: true });

  // 4. 批量插入初始化数据到 Todo 表
  const todos = await Todo.bulkCreate(initializeTodos);

  // 打印插入后的数据，格式化输出
  console.log(JSON.stringify(todos, null, 2));
} catch (error) {
  // 捕获并打印错误信息
  console.log(error.message);
} finally {
  // 关闭数据库连接
  sequelize.close();
}
```

### 5.11 JWT实战

jsonwebtoken 是 Node.js 里最常用的 JWT（JSON Web Token）生成和验证库

jsonwebtoken 库太老了，不推荐使用

- 安装jsonwebtoken

```shell
npm i jsonwebtoken
```

- 生成jwt密钥

```shell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

.env

将上一步生成的密钥存入环境变量文件

```
PORT=3000

# pg
DB_HOST=192.168.1.12
DB_PORT=5432
DB_USER=user_7yDNCw
DB_PASSWORD=password_yBFdTz
DB_NAME=postgres

JWT_SECRET=f5953192d8958622b33cee89b6a6810d9a4885e318217e035297e9a1dba0ae97
```

./src/utils/jwtHelpr.js

```js
import jwt from 'jsonwebtoken'; // 引入 jsonwebtoken 库，用于生成和验证 JWT
import AppError from './AppError.js'; // 引入自定义错误类，用于统一错误处理

// 从环境变量中读取 JWT 的密钥
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * 生成 JWT Token
 * @param {Object} data - 需要加密存放在 Token 中的数据（比如用户 ID、角色信息）
 * @returns {string} 生成的 Token 字符串
 */
export function generateToken(data) {
  // 使用 jwt.sign() 生成 Token
  // 第一个参数：payload（负载数据），这里是 { data }
  // 第二个参数：密钥，用于签名 Token
  // 设置过期时间为20秒
  const token = jwt.sign({ data }, JWT_SECRET, {expiresIn: '20s'});

  return token; // 返回生成的 Token
}

/**
 * 验证 JWT Token
 * @param {string} token - 前端传来的 Token 字符串
 * @throws {AppError} 如果 Token 无效或过期，抛出自定义错误
 */
export function verifyToken(token) {
  try {
    // 使用 jwt.verify() 验证 Token
    // 如果 Token 无效或过期，会抛出异常
    jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // 捕获错误并抛出自定义 AppError
    // 401 表示未授权（Unauthorized）
    throw new AppError(error.message || 'Invalid token', 401, error.name);
  }
}
```

./src/controllers/userController.js

```js
import AppError from '../utils/AppError.js'; // 自定义错误类，用于抛出统一格式的错误
import {
  createUser as createUserApi,
  verifyUser,
} from '../services/userService.js'; // 用户服务层，包含创建和验证用户的方法
import { sendSuccessResponse } from '../utils/responseHelper.js'; // 统一格式的成功响应工具函数
import { generateToken } from '../utils/jwtHelper.js'; // 生成 JWT Token 的工具函数

/**
 * 用户注册控制器
 * 处理 POST /signup 请求
 */
export async function createUser(req, res) {
  // 从请求体中解构出 email 和 password
  const { email, password } = req.body;

  // 参数校验：必须有 email 和 password
  if (!email || !password) {
    // 抛出 400 错误，提示必填字段缺失
    throw new AppError(`Email and password are required`, 400, 'Bad request');
  }

  // 调用服务层创建用户（会自动加密密码）
  const createdUser = await createUserApi(email, password);

  // 返回统一格式的成功响应
  return sendSuccessResponse(res, createdUser);
}

/**
 * 用户登录控制器
 * 处理 POST /login 请求
 */
export async function login(req, res) {
  // 从请求体中获取 email 和 password
  const { email, password } = req.body;

  // 参数校验：必须有 email 和 password
  if (!email || !password) {
    throw new AppError(`Email and password are required`, 400, 'Bad request');
  }

  // 调试用：打印输入的 email 和 password（生产环境建议删除）
  console.log(email, password);

  // 调用服务层验证用户的邮箱和密码是否正确
  const result = await verifyUser(email, password);

  // 如果验证失败，返回 401 未授权
  if (!result) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  // 如果验证成功，生成一个 JWT Token，载荷中存储用户邮箱
  const token = generateToken({ email });

  // 返回统一格式的成功响应，携带 Token
  return sendSuccessResponse(res, token);
}
```

./src/routes/userRoute.js

```js
import express from 'express'; // 引入 express 框架
import { createUser, login } from '../controllers/userController.js'; 
// 引入用户控制器里的注册和登录方法

// 创建一个路由实例
const router = express.Router();

/**
 * 用户注册接口
 * POST /signup
 * 当用户向 /signup 发起 POST 请求时，执行 createUser 控制器
 */
router.route('/signup').post(createUser);

/**
 * 用户登录接口
 * POST /login
 * 当用户向 /login 发起 POST 请求时，执行 login 控制器
 */
router.route('/login').post(login);

// 导出路由，供主应用加载
export default router;
```

./src/app.js

```js
import express from 'express';               // 引入 express 框架
import cors from 'cors';                     // 引入 cors 中间件，解决跨域问题
import todoRouter from './routes/todoRoute.js'; // 引入待办事项相关路由
import { pinoHttpMiddleware } from './utils/loggerHelper.js'; // 引入日志中间件，记录请求信息
import rateLimit from './utils/rateLimiter.js'; // 引入限流中间件，防止恶意请求
import globalErrorhandler from './utils/globalErrorhandler.js'; // 全局错误处理中间件
import userRouter from './routes/userRoute.js'; // 用户注册和登录路由
import { verifyToken } from './utils/jwtHelper.js'; // 引入 JWT Token 验证方法

// 创建 Express 应用实例
const app = express();

// 允许跨域请求
app.use(cors());

// 解析 JSON 格式的请求体
app.use(express.json());

// 应用限流中间件，防止请求过载
app.use(rateLimit);

// 应用日志中间件，记录所有 HTTP 请求
app.use(pinoHttpMiddleware);

// 用户相关路由（注册 & 登录），不需要登录验证
app.use('/v1', userRouter);

// 中间件：验证用户是否携带合法的 JWT Token
app.use((req, res, next) => {
  // 从请求头获取 Authorization 字段
  const authorization = req.headers.authorization;
  
  // 如果没有携带 Token，返回 401 未授权
  if (!authorization) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 从 Authorization 中提取 Token，格式一般是 "Bearer token字符串"
  const token = authorization.split(' ')[1];

  // 验证 Token 是否有效（无效会在 verifyToken 内抛出错误）
  verifyToken(token);

  // 如果 Token 验证通过，继续处理后续路由
  next();
});

// 受保护的待办事项路由，只有登录并携带 Token 才能访问
app.use('/v1', todoRouter);

// 全局错误处理中间件，捕获并统一处理所有错误
app.use(globalErrorhandler);

// 导出 Express 应用，供服务器入口文件使用
export default app;
```

### 5.12 JWT深入

jose 是一个现代化的 JavaScript 库，主要用于处理 JWT（JSON Web Token）、JWE（加密的 JWT）、JWS（签名的 JWT）和 JWK（JSON Web Key） 等与 JSON Web 安全相关的标准。

使用jose 代替jsonwebtoken 

- 安装jose

```shell
npm i jose
```

./src/utils/jwtHelper.js

```js
import AppError from './AppError.js'; // 引入自定义错误类，用于统一处理错误
import * as jose from 'jose';          // 引入 jose 库，提供 JWT 生成和验证功能

// 从环境变量中读取 JWT 密钥，并用 TextEncoder 转成 Uint8Array 格式，jose 需要这种格式
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * 生成 JWT Token
 * @param {Object} data - 要写入 JWT 负载的数据，比如用户 ID、邮箱等
 * @returns {Promise<string>} 返回生成的 JWT Token 字符串
 */
export async function generateToken(data) {
  // 使用 jose.SignJWT 生成一个 JWT
  // - payload：{ data }，要存入 Token 的数据
  // - setProtectedHeader：设置加密算法，这里是 HS256（HMAC-SHA256）
  // - setExpirationTime：设置 Token 的过期时间，这里设置为 20 秒
  // - sign：使用密钥对 Token 进行签名
  const token = await new jose.SignJWT({ data })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('20s')
    .sign(JWT_SECRET);

  return token; // 返回生成的 Token 字符串
}

/**
 * 验证 JWT Token
 * @param {string} token - 前端传来的 JWT Token
 * @throws {AppError} 如果 Token 无效或过期，抛出自定义错误
 */
export async function verifyToken(token) {
  try {
    // 使用 jose.jwtVerify 验证 Token 是否有效
    // 如果 Token 已过期或签名不匹配，会直接抛出错误
    await jose.jwtVerify(token, JWT_SECRET);

  } catch (error) {
    // 捕获 jose 抛出的错误，转成自定义错误类，统一返回 401 未授权
    throw new AppError(error.message || 'Invalid token', 401, error.name);
  }
}
```

./src/controllers/userController.js

```js
import AppError from '../utils/AppError.js'; // 引入自定义错误类，统一处理错误
import {
  createUser as createUserApi,
  verifyUser,
} from '../services/userService.js'; // 引入用户服务层方法，分别用于创建用户和验证用户
import { sendSuccessResponse } from '../utils/responseHelper.js'; // 引入统一格式的成功响应工具函数
import { generateToken } from '../utils/jwtHelper.js'; // 引入 JWT 生成工具函数

/**
 * 用户注册控制器
 * 处理 POST /signup 请求
 */
export async function createUser(req, res) {
  // 从请求体中解构出 email 和 password
  const { email, password } = req.body;

  // 如果缺少 email 或 password，抛出 400 错误
  if (!email || !password) {
    throw new AppError(`Email and password are required`, 400, 'Bad request');
  }

  // 调用服务层方法创建用户（包括密码加密）
  const createdUser = await createUserApi(email, password);

  // 返回统一的成功响应，包含新创建的用户信息
  return sendSuccessResponse(res, createdUser);
}

/**
 * 用户登录控制器
 * 处理 POST /login 请求
 */
export async function login(req, res) {
  // 从请求体中解构出 email 和 password
  const { email, password } = req.body;

  // 如果缺少 email 或 password，抛出 400 错误
  if (!email || !password) {
    throw new AppError(`Email and password are required`, 400, 'Bad request');
  }

  // 调试用：在控制台输出用户输入的账号密码（生产环境不建议保留）
  console.log(email, password);

  // 调用服务层方法验证用户邮箱和密码是否正确
  const result = await verifyUser(email, password);

  // 如果验证失败，返回 401 未授权
  if (!result) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  // 如果验证成功，生成一个 JWT Token，里面保存用户的 email
  const token = await generateToken({ email });

  // 返回统一的成功响应，携带生成的 Token
  return sendSuccessResponse(res, token);
}
```

./src/app.js

```js
import express from 'express'; // 引入 Express 框架
import cors from 'cors'; // 引入 CORS 中间件，解决跨域问题
import todoRouter from './routes/todoRoute.js'; // 导入待办事项相关路由
import { pinoHttpMiddleware } from './utils/loggerHelper.js'; // 导入日志中间件，用于记录请求信息
import rateLimit from './utils/rateLimiter.js'; // 导入限流中间件，防止请求过载
import globalErrorhandler from './utils/globalErrorhandler.js'; // 导入全局错误处理中间件
import userRouter from './routes/userRoute.js'; // 导入用户注册和登录路由
import { verifyToken } from './utils/jwtHelper.js'; // 导入 JWT 验证工具

// 创建 Express 应用实例
const app = express();

// 允许跨域请求
app.use(cors());

// 解析 JSON 请求体
app.use(express.json());

// 应用限流中间件，防止短时间内请求过多
app.use(rateLimit);

// 应用日志中间件，记录每次 HTTP 请求信息
app.use(pinoHttpMiddleware);

// 用户路由（注册和登录），不需要登录验证
app.use('/v1', userRouter);

// JWT 验证中间件
// 保护后续路由（如 /v1/todos）必须登录并携带合法 Token
app.use(async (req, res, next) => {
  // 从请求头中获取 Authorization 字段
  const authorization = req.headers.authorization;

  // 如果没有携带 Token，返回 401 未授权
  if (!authorization) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 提取 Token（格式一般为 "Bearer token字符串"）
  const token = authorization.split(' ')[1];

  // 异步验证 Token 是否有效，如果无效或过期，会在 verifyToken 内抛出错误
  await verifyToken(token);

  // Token 验证通过，继续处理后续路由
  next();
});

// 受保护的待办事项路由，必须通过 JWT 验证才能访问
app.use('/v1', todoRouter);

// 全局错误处理中间件，捕获并统一处理所有错误
app.use(globalErrorhandler);

// 导出 Express 应用实例，供服务器入口文件使用
export default app;
```

## 六、项目实战

### 6.1 Event Loop

Node.js 是单线程的，但它能同时处理大量异步任务，比如 I/O、定时器、网络请求。

事件循环（Event Loop）就是 调度中心，它决定：

1. 什么时候执行同步代码

2. 异步任务的回调什么时候被执行

3. 宏任务、微任务的执行顺序

代码执行顺序一般是：

```
            ┌──────────────┐
            │   JS 代码     │
            └──────┬───────┘
                   │
                   ▼
          ┌─────────────────┐
          │   Call Stack     │ ← 同步代码直接执行
          └──────┬──────────┘
                 │ 异步任务
                 ▼
          ┌─────────────────┐
          │   Event Loop     │ ← 调度员
          └──────┬──────────┘
      宏任务队列 │            │ 微任务队列
 (setTimeout等)  │            │ (Promise等)
          ┌──────▼──────────┐
          │   libuv         │ ← 处理I/O、线程池
          └─────────────────┘
```

简单示例：

```js
setTimeout(() => console.log("setTimeout"), 0);

Promise.resolve().then(() => console.log("promise"));

console.log("sync");
```

结果：

```
sync
promise
setTimeout
```

### 6.2 项目概览-短链接

短链接项目

### 6.3 模型与数据库-短链接1

- 安装模块

```shell
npm i @dotenvx/dotenvx express pg pg-hstore sequelize
```

package.json

```json
{
  "name": "starter",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev:database-connection": "dotenvx run -- nodemon ./src/utils/dbHelper.js",
    "seed": "dotenvx run -- node ./src/scripts/seed.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@dotenvx/dotenvx": "^1.51.0",
    "express": "^5.1.0",
    "pg": "^8.16.3",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.37.7"
  }
}
```

.env

```shell
# pg
DB_HOST=192.168.1.12
DB_PORT=5432
DB_USER=user_7yDNCw
DB_PASSWORD=password_yBFdTz
DB_NAME=postgres
```

./src/utils/dbHelper.js

```js
import { Sequelize } from 'sequelize';  // 从 sequelize 库中导入 Sequelize 构造函数

// 从环境变量中读取数据库配置信息
const databaseConfig = {
  database: process.env.DB_NAME,     // 数据库名称
  username: process.env.DB_USER,     // 数据库用户名
  password: process.env.DB_PASSWORD, // 数据库密码
  host: process.env.DB_HOST,         // 数据库主机地址
  port: Number(process.env.DB_PORT), // 数据库端口号（转换为数字）
};

// console.log(databaseConfig); // 可用于调试查看配置信息

// 创建 Sequelize 实例，用于连接 PostgreSQL 数据库
const sequelize = new Sequelize(
  databaseConfig.database,  // 数据库名称
  databaseConfig.username,  // 用户名
  databaseConfig.password,  // 密码
  {
    host: databaseConfig.host,   // 主机地址
    dialect: 'postgres',         // 数据库类型（这里是 PostgreSQL）
    port: databaseConfig.port,   // 端口号
  }
);

try {
  // 测试数据库连接
  await sequelize.authenticate();
  console.log('Connection has been established successfully.'); // 连接成功提示
} catch (error) {
  // 如果连接失败，记录错误日志并抛出错误
  // console.error('Unable to connect to the database:', error);
  logger.error(`Unable to connect to the database: ${error}`);
  throw error;  // 抛出错误，方便上层捕获
}

// 导出 sequelize 实例，供其他模块使用
export default sequelize;
```

./src/models/URLRecord.js

```js
import { DataTypes } from 'sequelize';       // 导入 Sequelize 提供的数据类型工具
import sequelize from '../utils/dbHelper.js'; // 导入之前配置好的 Sequelize 实例

// 定义一个 Sequelize 模型，对应数据库中的表 url_record
const URLRecord = sequelize.define(
  'URLRecord', // 模型名称，Sequelize 内部使用
  {
    // 主键 ID
    id: {
      type: DataTypes.BIGINT,    // 数据类型：大整数
      primaryKey: true,          // 设置为主键
    },
    // 原始长链接
    originURL: {
      type: DataTypes.STRING,    // 数据类型：字符串
      allowNull: false,          // 不允许为空
    },
    // 短链接
    shortURL: {
      type: DataTypes.STRING,    // 数据类型：字符串
      allowNull: false,          // 不允许为空
    },
    // 短链接的唯一代码
    urlCode: {
      type: DataTypes.DATE,      // ⚠ 这里定义为日期类型，可能需要改成 STRING 存储短码
      allowNull: false,          // 不允许为空
      unique: true,              // 唯一约束
    },
  },
  {
    tableName: 'url_record',     // 指定数据库中表名为 url_record
  },
);

export default URLRecord; // 导出模型，供其他模块使用
```

./src/scripts/seed.js

```js
import URLRecord from "../models/URLRecord.js"; // 导入定义好的 URLRecord 模型
import sequelize from "../utils/dbHelper.js";   // 导入 Sequelize 实例（连接数据库的对象）

// 同步模型到数据库
// { force: true } 表示：如果表已经存在，先删除再重新创建（⚠️会清空数据，慎用）
// 适合开发或测试阶段使用，生产环境一般不要加 force:true
await URLRecord.sync({ force: true });

// 关闭数据库连接，确保程序能正常退出
await sequelize.close();
```

### 6.4 生成短链接-短链接2

- 安装模块

```shell
npm i crypto-random-string validator cors
```

package.json

```json
{
  "name": "starter",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "dotenvx run -- nodemon ./src/server.js",
    "dev:database-connection": "dotenvx run -- nodemon ./src/utils/dbHelper.js",
    "seed": "dotenvx run -- node ./src/scripts/seed.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@dotenvx/dotenvx": "^1.51.0",
    "cors": "^2.8.5",
    "crypto-random-string": "^5.0.0",
    "express": "^5.1.0",
    "pg": "^8.16.3",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.37.7",
    "validator": "^13.15.15"
  }
}
```

.env

```shell
# pg
DB_HOST=192.168.1.12
DB_PORT=5432
DB_USER=user_7yDNCw
DB_PASSWORD=password_yBFdTz
DB_NAME=postgres

PEOJECT_URL=https://localhost:5432

SHORT_URL_LENGTH=6
```

./src/utils/dbHelper.js

```js
import { Sequelize } from 'sequelize'; // 引入 Sequelize ORM，用于连接和操作数据库

// 从环境变量中读取数据库配置，保证代码灵活、安全
const databaseConfig = {
  database: process.env.DB_NAME,       // 数据库名
  username: process.env.DB_USER,       // 数据库用户名
  password: process.env.DB_PASSWORD,   // 数据库密码
  host: process.env.DB_HOST,           // 数据库主机地址
  port: Number(process.env.DB_PORT),   // 数据库端口号，确保是数字类型
};

// 创建 Sequelize 实例，配置数据库连接信息
const sequelize = new Sequelize(
  databaseConfig.database,   // 数据库名
  databaseConfig.username,   // 用户名
  databaseConfig.password,   // 密码
  {
    host: databaseConfig.host,   // 主机地址
    dialect: 'postgres',         // 数据库类型，这里是 PostgreSQL
    port: databaseConfig.port,   // 端口号
    logging: false,              // 关闭 SQL 日志打印，避免控制台太乱
  }
);

try {
  // 尝试连接数据库，验证配置是否正确
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  // 连接失败时打印错误日志，并抛出错误
  logger.error(`Unable to connect to the database: ${error}`);
  throw error;
}

// 导出 sequelize 实例，供项目中其他地方使用
export default sequelize;
```

./src/models/urlRecordModel.js

```js
import { DataTypes } from 'sequelize';     // 引入 Sequelize 提供的数据类型
import sequelize from '../utils/dbHelper.js'; // 导入数据库连接实例

// 定义 URLRecord 模型，对应数据库中的 'url_record' 表
const URLRecord = sequelize.define(
  'URLRecord', // 模型名，在 Sequelize 内部使用
  {
    // 主键 ID，使用 BIGINT 类型，存储时间戳或大整数 ID
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,  // 设为主键
    },
    // 原始 URL，必填
    originURL: {
      type: DataTypes.STRING, // 字符串类型
      allowNull: false,       // 不允许为空
    },
    // 短链接的完整 URL，必填
    shortURL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 短链接代码（唯一标识短链接的随机字符串）
    urlCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,  // 设置唯一约束，避免重复短码
    },
  },
  {
    tableName: 'url_record', // 指定数据库中表的名称
    // 默认 Sequelize 会自动加 createdAt、updatedAt 两个时间戳列
    // 如果不想要时间戳，可以加上 timestamps: false
  },
);

export default URLRecord; // 导出模型，供控制器或服务层使用
```

./src/scripts/seed.js

```js
import URLRecord from "../models/urlRecordModel.js"; // 导入 URLRecord 模型
import sequelize from "../utils/dbHelper.js";        // 导入数据库连接实例

// 同步模型到数据库
// { force: true } 表示如果表已经存在，先删除再重新创建
// 这个操作会清空原有数据，所以只建议在开发或初始化时使用
await URLRecord.sync({ force: true })

// 关闭数据库连接，防止进程一直挂起
await sequelize.close();
```

./src/utils/urlHelper.js

```js
import cryptoRandomString from 'crypto-random-string'; // 用于生成随机字符串
import URLRecord from '../models/urlRecordModel.js';   // 导入 URLRecord 模型，用于查询数据库

// 从环境变量中读取项目基础 URL 和短码长度
const PROJECT_URL = process.env.PEOJECT_URL;             // 短链接的基础 URL，例如：https://myshort.com
const SHORT_URL_LENGTH = Number(process.env.SHORT_URL_LENGTH); // 短码的长度，需转换成数字

// 生成短链接的函数
// 如果用户传了自定义短码(customURLCode)，直接用自定义的
// 否则就生成一个随机短码，保证在数据库中唯一
export async function gengerateShortURL(customURLCode = '') {
    // 如果传了自定义短码，直接返回完整的短链接
    if (customURLCode) {
        return `${PROJECT_URL}/${customURLCode}`;
    }

    let urlCode; // 存放生成的短码

    // 循环直到生成一个数据库中不存在的短码为止
    while (true) {
        // 生成随机短码，长度由环境变量控制，字符集安全可用于 URL
        urlCode = cryptoRandomString({
            length: SHORT_URL_LENGTH,
            type: 'url-safe' // 不会包含特殊字符，适合 URL
        });

        // 在数据库中查询这个短码是否已经存在
        const urlRecord = await URLRecord.findOne({ where: { urlCode } });

        // 如果不存在，就跳出循环，表示生成的短码是唯一的
        if (!urlRecord) {
            break;
        }
    }

    // 返回完整的短链接，例如：https://myshort.com/abc123
    return `${PROJECT_URL}/${urlCode}`;
}
```

./src/controllers/urlRecordController.js

```js
import validator from 'validator';             // 引入 validator 库，用于验证 URL 格式
import URLRecord from '../models/urlRecordModel.js'; // 引入 Sequelize 模型，用于数据库操作
import { gengerateShortURL } from '../utils/urlHelper.js'; // 引入生成短链接工具函数

// 创建短链接的控制器方法
export async function createURLRecord(req, res) {
  // 从请求体中解构出原始 URL 和可选的自定义短码
  const { originURL, urlCode } = req.body;

  // 1. 检查是否提供了原始 URL
  if (!originURL) {
    return res.status(400).json({ message: 'Origin URL is required' });
  }

  // 2. 检查 URL 格式是否合法
  if (!validator.isURL(originURL)) {
    return res.status(400).json({ message: 'Invalid origin URL' });
  }

  // 3. 检查数据库中是否已经存在相同的原始 URL
  const urlRecord = await URLRecord.findOne({ where: { originURL } });
  if (urlRecord) {
    return res
      .status(200) // 200 表示请求成功，但数据已存在
      .json({ message: 'Origin URL already exists', data: urlRecord });
  }

  // 4. 如果用户提供了自定义短码
  if (urlCode) {
    // 检查这个短码是否已被占用
    const urlRecord = await URLRecord.findOne({ where: { urlCode } });

    if (urlRecord) {
      return res.status(400).json({ message: 'URL code already exists' });
    }

    // 短码可用，生成完整短链接
    const shortURL = await gengerateShortURL(urlCode);
    console.log(shortURL);

    // 在数据库中创建新记录
    const createdURLRecord = await URLRecord.create({
      id: Date.now(),   // 使用当前时间戳作为 ID
      originURL,        // 原始 URL
      shortURL,         // 完整短链接
      urlCode,          // 自定义短码
    });

    // 返回成功响应
    return res.status(201).json({
      message: 'URL record created successfully',
      data: createdURLRecord,
    });
  }

  // 5. 如果用户没有提供短码，自动生成短码
  const shortURL = await gengerateShortURL();
  const createdURLRecord = await URLRecord.create({
    id: Date.now(),
    originURL,
    shortURL,
    // 从完整 URL 中截取短码部分，例如 https://xxx/abc123 → abc123
    urlCode: shortURL.split('/').at(-1), 
  });

  // 返回成功响应
  return res.status(201).json({
    message: 'URL record created successfully',
    data: createdURLRecord,
  });
}
```

./src/routes/urlRecordRoute.js

```js
import express from 'express'; // 引入 express 框架
import { createURLRecord } from '../controllers/urlRecordController.js'; // 引入控制器方法，用于处理创建短链接的逻辑

// 创建一个路由实例
const urlRecordRouter = express.Router();

// 定义路由：
// 当客户端向 /urlRecord 发送 POST 请求时，
// 交由 createURLRecord 控制器函数处理
urlRecordRouter.route('/urlRecord').post(createURLRecord);

// 导出路由实例，供主应用程序挂载使用
export default urlRecordRouter;
```

./src/app.js

```js
import express from 'express';                // 引入 Express 框架
import urlRecordRouter from './routes/urlRecordRoute.js'; // 导入短链接相关的路由模块
import cors from 'cors';                      // 引入 CORS 中间件，解决跨域问题

// TODO:auth
// 这里可以在后续加入认证逻辑，例如 JWT 验证

const app = express(); // 创建 Express 应用实例

// 内置中间件，解析客户端发送的 JSON 数据
// 这样就能在控制器里用 req.body 访问到请求体
app.use(express.json());

// 启用 CORS 中间件，允许跨域请求
app.use(cors());

// 挂载路由模块，所有以 /v1 开头的接口都交给 urlRecordRouter 处理
app.use('/v1', urlRecordRouter);

// 导出 app 实例，供 server.js 或其他入口文件启动服务器时使用
export default app;
```

./src/server.js

```js
import app from './app.js';  // 导入在 app.js 中配置好的 Express 应用

const port = 3000;  // 定义服务器监听的端口号，客户端通过 http://localhost:3000 访问

// 启动服务器，监听指定端口
// 回调函数会在服务器成功启动后执行
app.listen(port, () => {
    console.log(`Server running on port ${port}`); // 在控制台输出启动成功信息
});
```

### 6.5 重定向-短链接3

./src/controllers/urlRedirectController.js

```js
import URLRecord from "../models/urlRecordModel.js"; // 导入 URLRecord 模型，用于数据库查询

// 根据短码获取原始 URL 的控制器函数
export async function getOriginURL(req, res) {
    // 从请求参数中获取短码 urlCode，例如 GET /:urlCode
    const { urlCode } = req.params;

    // 1. 如果没有提供短码，返回 400 错误
    if (!urlCode) {
        return res.status(400).json({ error: "Please provide a valid URL code." });
    }

    // 2. 在数据库中查找对应的短码记录
    const urlRecord = await URLRecord.findOne({ where: { urlCode } });

    // 3. 如果找不到记录，返回 404 错误
    if (!urlRecord) {
        return res.status(404).json({ error: "URL not found." });
    }

    // 4. 找到记录，返回原始 URL
    return res.status(200).json({ message: "Success", data: urlRecord.originURL });
}
```

./src/routes/urlRedirectRoute.js

```js
import Router from 'express'; // 引入 Express 框架的 Router，用于创建路由模块
import { getOriginURL } from '../controllers/urlRedirectController.js'; // 引入控制器函数，用于根据短码获取原始 URL

// 创建路由实例
const urlRedirectRouter = new Router();

// 定义路由：
// 当客户端访问 GET /:urlCode 时（例如 /abc123），
// 会调用 getOriginURL 控制器处理请求
urlRedirectRouter.route('/:urlCode').get(getOriginURL);

// 导出路由实例，供主应用挂载使用
export default urlRedirectRouter;
```

./src/app.js

```js
import express from 'express';                       // 引入 Express 框架
import urlRecordRouter from './routes/urlRecordRoute.js';   // 引入短链接创建相关的路由
import cors from 'cors';                             // 引入 CORS 中间件，解决跨域问题
import urlRedirectRouter from './routes/urlRedirectRoute.js'; // 引入短链接访问/跳转路由

// TODO:auth
// 这里可以后续加入认证逻辑，例如 JWT 验证

const app = express(); // 创建 Express 应用实例

// 内置中间件，用于解析请求体中的 JSON 数据
app.use(express.json());

// 启用 CORS 中间件，允许跨域请求
app.use(cors());

// 挂载路由模块
// 1. /v1/urlRecord 相关的接口交给 urlRecordRouter 处理
app.use('/v1', urlRecordRouter);

// 2. /v1/:urlCode 相关的短链接跳转接口交给 urlRedirectRouter 处理
app.use('/v1', urlRedirectRouter);

// 导出 app 实例，供 server.js 或其他入口文件启动服务器时使用
export default app;
```

### 6.5 API文档-短链接4

OpenAPI（以前叫 Swagger Specification）是一种 用于描述 RESTful API 的标准化规范，它让开发者、客户端和工具能够理解和交互 API，而无需查看源代码或额外文档。

swagger-ui-express 是一个 Express 中间件，可以将 OpenAPI（Swagger）规范文件 渲染成网页形式的 可交互 API 文档。

- 安装swagger-ui-express

```shell
npm i swagger-ui-express
```

使用 apifox 将接口导出为 OpenAPI 的 swagger.json文件，放在./src目录

./src/app.js

```js
import express from 'express';                       // 引入 Express 框架
import urlRecordRouter from './routes/urlRecordRoute.js';   // 导入短链接创建相关路由
import cors from 'cors';                             // 引入 CORS 中间件，解决跨域问题
import urlRedirectRouter from './routes/urlRedirectRoute.js'; // 导入短链接跳转路由
import swaggerUi from 'swagger-ui-express';          // 引入 swagger-ui-express，用于渲染 OpenAPI 文档
import swaggerDocument from './swagger.json' with  {type: 'json'}; // 导入 OpenAPI JSON 文件

// TODO:auth
// 后续可以加入认证逻辑，例如 JWT 验证

const app = express(); // 创建 Express 应用实例

// 内置中间件，解析请求体中的 JSON 数据
app.use(express.json());

// 启用 CORS 中间件，允许跨域请求
app.use(cors());

// 挂载短链接相关路由
// 所有以 /v1 开头的接口交给 urlRecordRouter 处理
app.use('/v1', urlRecordRouter);

// 挂载短链接访问跳转路由
// 所有以 /v1 开头的短链接跳转接口交给 urlRedirectRouter 处理
app.use('/v1', urlRedirectRouter);

// 挂载 Swagger UI
// 访问 /api-docs 就能看到可交互的 API 文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 导出 app 实例，供 server.js 或其他入口文件启动服务器时使用
export default app;
```

运行项目后，即可在web访问/api-docs的项目api文档

### 6.6 Logdy-短链接5

Logdy 是一个 现代化的日志可视化工具，可以帮助开发者 实时查看、分析和监控日志文件，尤其适合 Node.js、Go 等服务端项目。它支持 Web 界面展示日志，类似 Linux 上的 tail -f，但更直观、交互性更强。

### 6.7 部署-短链接6

前端部署在[netlify](https://www.netlify.com/)，后端部署在[render](https://render.com/)

### 6.8 cors和性能

cors限制只允许前端的端口访问后端

./src/app.js

```js
import rateLimiter from './utils/rateLimiter.js';    // 引入自定义的限流中间件，用于防止接口被频繁访问
import express from 'express';                        // 引入 Express 框架
import cors from 'cors';                               // 引入 CORS 中间件，用于处理跨域请求
import { pinoHttpMiddleware } from './utils/loggerHelper.js'; // 引入自定义的日志中间件，记录 HTTP 请求日志

import urlRedirectRouter from './routes/urlRedirectRoute.js'; // 引入处理短链接跳转的路由
import urlRecordRouter from './routes/urlRecordRoute.js';      // 引入处理短链接创建的路由

import swaggerUi from 'swagger-ui-express';                   // 引入 Swagger UI，用于自动生成接口文档
import swaggerDocument from './swagger.json' with {type: 'json'}; // 引入 Swagger 配置文件

const PROJECT_URL = process.env.PROJECT_URL; // 从环境变量中读取项目的域名，用于配置 CORS

const app = express(); // 创建一个 Express 应用实例

// TODO: 未来可以在这里添加认证中间件，比如 JWT 验证等

app.use(express.json()); // 解析请求体中的 JSON 数据

// 配置 CORS，仅允许指定的前端域名访问后端 API
app.use(cors({
  origin: PROJECT_URL
}));

// 配置 Swagger 接口文档访问路径 /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 应用限流中间件，限制单位时间内的请求次数，防止恶意攻击
app.use(rateLimiter);

// 应用 HTTP 请求日志中间件，记录每一次请求信息
app.use(pinoHttpMiddleware);

// 注册业务路由：
// 1. /v1/urlRecord 负责创建短链接
// 2. /v1/:urlCode 负责短链接跳转
app.use('/v1', urlRecordRouter);
app.use('/v1', urlRedirectRouter);

// TODO: 可以在这里添加全局错误处理器，统一捕获和处理服务器错误

export default app; // 导出 app 实例，供其他文件使用（例如 server.js 启动服务器）
```

- pm2项目管理

在 Node.js 中使用 PM2 主要是为了让你的应用在生产环境中更稳定、更高效地运行。

Node.js 本身是单线程的，无法利用多核 CPU。

PM2 提供 集群模式，可以一键开启多个进程，自动做负载均衡。

PM2 自动帮你记录标准输出（console.log）和错误日志，方便排查问题。

## 七、TS与Nodejs

### 7.1 TS基础语法

- 安装ts模块

@types/node: 提供 Node.js API 的类型声明

typescript: TypeScript 编译器和核心工具

```shell
npm i @types/node typescript
```

main.ts

```ts
// 定义一个名为 User 的类型（type），描述用户对象的结构
// 每个用户都有 name（字符串）和 age（数字）两个属性
type User = {
  name: string;  // 用户的名字，类型是字符串
  age: number;   // 用户的年龄，类型是数字
};

// 创建一个名为 justine 的用户对象，类型为 User
const justine: User = {
  name: 'Justine', // 名字是 Justine
  age: 23          // 年龄是 23
};

// 定义一个函数 isAdult，用来判断一个用户是否是成年人
// 参数：user，类型是 User
// 返回值类型：boolean（布尔值），即 true 或 false
function isAdult(user: User): boolean {
  // 如果用户年龄大于等于 18，就返回 true，否则返回 false
  return user.age >= 18;
}

// 调用 isAdult 函数，判断 justine 是否是成年人
const isJustineAnAdult = isAdult(justine);

// 输出判断结果到控制台，结果会是 true
console.log(isJustineAnAdult);
```

### 7.2  TS配置文件

生成tsconfig.json配置文件

```shell
tsc --init
```

使用模块来自动处理ts配置文件内容

- 安装

这是lts版本，详情查看： [https://github.com/tsconfig/bases/](https://github.com/tsconfig/bases/)

```shell
npm i @tsconfig/node-lts
```

tsconfig.json只需要一行配置即可

```json
{
  "extends": "@tsconfig/node-lts/tsconfig.json"
}
```

### 7.3 运行时

- 安装ts运行时（不推荐）

```shell
npm i ts-node
```

运行命令

```shell
ts-node main.ts
```

- 安装tsx（推荐）

```shell
npm install -D tsx
```

运行命令

```shell
npx tsx main.ts
```

### 7.4 express-ts

./src/server.ts

```ts
// 引入 express 框架，用于创建 Web 服务器
import express from 'express';
// 从 express 中导入类型：Express 表示整个应用实例的类型，Response 表示响应对象的类型
import type { Express, Response } from 'express';
// 引入 cors 中间件，解决跨域请求问题
import cors from 'cors';
// 导入我们自定义的 URLRequest 类型，继承了 Express.Request，定义了 body 的结构
import type URLRequest from './types/URLRequest.ts';

// 创建一个 Express 应用实例，并用类型标注为 Express
const app: Express = express();

// 定义服务器端口号，优先读取环境变量 PORT，默认为 3000
const port: number = Number(process.env.PORT) || 3000;

// 使用 cors 中间件，允许跨域请求
app.use(cors());

// 定义一个 POST 路由，路径为 '/'  
// req 的类型是我们自定义的 URLRequest，确保请求体 body 有类型提示
// res 的类型是 Express 提供的 Response 类型
app.post('/', (req: URLRequest, res: Response) => {
  // 读取请求体内容
  const body = req.body;

  // 在控制台打印请求体，方便调试
  console.log(body);

  // 给客户端返回 "Hello World!" 作为响应
  res.send('Hello World!');
});

// 启动服务器，监听指定端口
app.listen(port, () => {
  // 当服务器成功启动时，打印日志提示
  console.log(`Example app listening on port ${port}`);
});
```

./src/types/URLRequest.ts

```ts
// 从 express 库中导入 Request 类型
// Request 是 Express 提供的请求对象类型，包含了 HTTP 请求的所有信息
import type { Request } from 'express';

// 定义一个接口 URLRequest，继承自 Express 的 Request 类型
// 这样我们可以在保留原有 Request 属性的基础上，自定义请求体 (body) 的类型
export default interface URLRequest extends Request {
  // 定义请求体 (body) 的结构
  body: {
    id: number;          // id：数字类型，表示唯一标识
    originURL: string;   // originURL：字符串类型，表示原始 URL
    customCode?: string; // customCode：可选的字符串类型，表示自定义短码，? 表示可选
  };
}
```

package.json

注意安装express和cors的ts依赖

```json
{
  "name": "express-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "dotenvx run -- node ./src/server.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "packageManager": "pnpm@10.14.0",
  "dependencies": {
    "@dotenvx/dotenvx": "^1.49.0",
    "cors": "^2.8.5",
    "express": "^5.1.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.3"
  }
}
```

### 7.5 Drizzle快速上手

Drizzle 是一个 现代化的 TypeScript ORM（对象关系映射工具），主要用来在 Node.js 或 Bun 等环境里和数据库交互。

它的目标是让你在 类型安全、性能高 的前提下，写出更优雅的 SQL 代码。

用来代替Sequelize。

Drizzle项目官网：https://orm.drizzle.team/

### 7.6 短链接项目迁移实战
