## guacamole-go-web网关-demo

需要搭配 guacamole 服务端使用

这个项目通过 guacamole-common-js 连接到 guacd 服务，guacd 连接到目标 RDP 服务器

### 一、项目结构

```cmd
C:\Users\kk\Desktop\guacamole-go-web>tree /F
文件夹 PATH 列表    
卷序列号为 AA59-C1A0
C:.
│  api_ws_guaca.go  
│  go.mod
│  go.sum
│  main.go
│
├─certs
│      cert.pem     
│      key.pem      
│
├─frontend
│  │  package-lock.json
│  │  package.json
│  │
│  ├─public
│  │      favicon.ico
│  │      index.html
│  │
│  └─src
│      │  App.vue
│      │  main.js
│      │
│      ├─components
│      │      GuacClient.vue
│      │
│      └─libs
│              GuacMouse.js
│
└─guac
        config.go
        counted_lock.go
        errors.go
        guac.go
        guac_instruction.go
        status.go
        stream_conn.go
        tunnel_pipe.go
```

### 二、项目文件

#### 前端

##### frontend\public\index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="/favicon.ico">
    <title>RDP Client</title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but this app doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
  </body>
</html>
```

##### frontend\package.json

```json
{
  "name": "rg-rdp",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build"
  },
  "dependencies": {
    "element-plus": "^2.9.0",
    "guacamole-common-js": "^1.5.0",
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.0",
    "@vue/cli-plugin-babel": "~5.0.8",
    "@vue/cli-service": "~5.0.8",
    "vue-template-compiler": "^2.7.16"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ]
}
```

##### frontend\src\main.js

```js
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
```

##### frontend\src\App.vue

```vue
<template>
  <div id="app">
    <guac-client></guac-client>
  </div>
</template>

<script>
import GuacClient from "@/components/GuacClient.vue";
export default {
  name: 'App',
  components: {
    GuacClient,
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
}
</style>
```

##### frontend\src\components\GuacClient.vue

```vue
<template>
  <div ref="viewport" class="viewport">
    <div ref="display" class="display" tabindex="0"/>
    <button class="fullscreen-btn"
            :style="{ left: btnPosition.x + 'px', top: btnPosition.y + 'px' }"
            @mousedown="startDrag"
            @click="handleBtnClick">
      <svg v-if="!isFullscreen" viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import Guacamole from 'guacamole-common-js'
import GuacMouse from '@/libs/GuacMouse.js'

Guacamole.Mouse = GuacMouse.mouse

const viewport = ref(null)
const display = ref(null)
const isFullscreen = ref(false)
const btnPosition = ref({ x: 12, y: 12 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

const query = ref({
  guacad_addr: '192.168.1.30:4822',
  asset_protocol: 'rdp',
  asset_host: '192.168.1.90',
  asset_port: '3389',
  asset_user: 'administrator',
  asset_password: '123456',
  screen_width: 1920,
  screen_height: 1080,
  screen_dpi: 96,
})

let client = null
let keyboard = null
let mouse = null
let displayElm = null
let resizeObserver = null
let audioContext = null
let audioEnabled = false

const wsUrl = computed(() => {
  // 只使用 wss:// 协议
  return `wss://${window.location.host}/ws`
})

function serialize(obj) {
  const str = []
  for (const p in obj) {
    if (obj[p]) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
    }
  }
  return str.join("&")
}

function handleMouseState(mouseState) {
  if (!client || !client.getDisplay()) return
  enableAudio()
  const scaledMouseState = {
    ...mouseState,
    x: mouseState.x / client.getDisplay().getScale(),
    y: mouseState.y / client.getDisplay().getScale(),
  }
  client.sendMouseState(scaledMouseState)
}

function setScreenSize() {
  const elm = viewport.value
  if (!elm) return
  const width = elm.clientWidth || window.innerWidth
  const height = elm.clientHeight || window.innerHeight
  const pixelDensity = window.devicePixelRatio || 1
  query.value.screen_width = width * pixelDensity
  query.value.screen_height = height * pixelDensity
}

function resize() {
  const elm = viewport.value
  if (!elm || !client || !client.getDisplay()) return

  const width = elm.clientWidth || window.innerWidth
  const height = elm.clientHeight || window.innerHeight
  const pixelDensity = window.devicePixelRatio || 1
  const pixelWidth = width * pixelDensity
  const pixelHeight = height * pixelDensity

  client.sendSize(pixelWidth, pixelHeight)

  const scale = Math.min(
    width / Math.max(client.getDisplay().getWidth(), 1),
    height / Math.max(client.getDisplay().getHeight(), 1)
  )
  client.getDisplay().scale(scale)
}

function toggleFullscreen() {
  const elm = viewport.value
  if (!elm) return

  if (!document.fullscreenElement) {
    elm.requestFullscreen().then(() => {
      isFullscreen.value = true
    }).catch(err => {
      console.error('全屏请求失败:', err)
    })
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false
    }).catch(err => {
      console.error('退出全屏失败:', err)
    })
  }
}

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

function startDrag(e) {
  isDragging.value = false
  dragStart.value = {
    x: e.clientX - btnPosition.value.x,
    y: e.clientY - btnPosition.value.y
  }

  const onMouseMove = (e) => {
    isDragging.value = true
    let newX = e.clientX - dragStart.value.x
    let newY = e.clientY - dragStart.value.y

    // 边界限制
    const btnSize = 36
    const maxX = window.innerWidth - btnSize
    const maxY = window.innerHeight - btnSize
    newX = Math.max(0, Math.min(newX, maxX))
    newY = Math.max(0, Math.min(newY, maxY))

    btnPosition.value = { x: newX, y: newY }
  }

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function handleBtnClick(e) {
  // 如果发生了拖拽，不触发点击
  if (isDragging.value) {
    return
  }
  toggleFullscreen()
}

function installKeyboard() {
  keyboard.onkeydown = (keysym) => {
    client.sendKeyEvent(1, keysym)
  }
  keyboard.onkeyup = (keysym) => {
    client.sendKeyEvent(0, keysym)
  }
}

function uninstallKeyboard() {
  if (keyboard) {
    keyboard.onkeydown = () => {}
    keyboard.onkeyup = () => {}
  }
}

function enableAudio() {
  if (audioEnabled) return

  // 创建或恢复 AudioContext
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    audioContext = new AudioContextClass()
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      audioEnabled = true
      console.log('Audio enabled')
    }).catch(err => {
      console.error('Failed to enable audio:', err)
    })
  } else {
    audioEnabled = true
  }
}

function startGuacamole() {
  // 确保viewport有尺寸
  setScreenSize()

  const tunnel = new Guacamole.WebSocketTunnel(wsUrl.value)

  if (client) {
    uninstallKeyboard()
    try {
      client.getDisplay().scale(0)
    } catch (e) {}
  }

  client = new Guacamole.Client(tunnel)

  tunnel.onerror = (status) => {
    console.error(`Tunnel failed ${JSON.stringify(status)}`)
  }

  tunnel.onstatechange = (state) => {
    if (state === Guacamole.Tunnel.State.CLOSED) {
      console.log('Connection closed')
    } else if (state === Guacamole.Tunnel.State.OPEN) {
      // 连接建立后立即resize
      nextTick(() => resize())
    }
  }

  client.onerror = (error) => {
    try {
      client.disconnect()
    } catch (e) {}
    console.error(`Client error ${JSON.stringify(error)}`)
  }

  client.onclipboard = (stream, mimetype) => {
    // Clipboard handling simplified
  }

  const disp = client.getDisplay()
  displayElm = display.value
  if (displayElm) {
    displayElm.appendChild(disp.getElement())

    displayElm.addEventListener('contextmenu', (e) => {
      e.stopPropagation()
      if (e.preventDefault) e.preventDefault()
      e.returnValue = false
    })

    displayElm.onclick = () => {
      displayElm.focus()
      enableAudio()
    }
    displayElm.onfocus = () => displayElm.className = 'focus'
    displayElm.onblur = () => displayElm.className = ''
  }

  const param = serialize(query.value)
  client.connect(param)
  window.onunload = () => {
    try {
      client.disconnect()
    } catch (e) {}
  }

  mouse = new Guacamole.Mouse(displayElm)
  mouse.onmouseout = () => {
    if (!client) return
    try {
      client.getDisplay().showCursor(false)
    } catch (e) {}
  }

  keyboard = new Guacamole.Keyboard(displayElm)
  installKeyboard()
  mouse.onmousedown = mouse.onmouseup = mouse.onmousemove = handleMouseState

  // 连接后多次快速调用resize确保显示，然后减慢频率
  let resizeCount = 0
  let resizeInterval = null

  const doResize = () => {
    if (!client) return
    resize()
    resizeCount++

    // 前10次快速调用（每50ms），之后减慢到每500ms
    if (resizeCount < 10) {
      // 保持当前interval
    } else if (resizeCount === 10) {
      clearInterval(resizeInterval)
      resizeInterval = setInterval(resize, 500)
    } else if (resizeCount >= 60) {
      // 60次后停止自动调用，由 ResizeObserver 处理
      clearInterval(resizeInterval)
    }
  }

  resizeInterval = setInterval(doResize, 50)
}

onMounted(() => {
  // 设置按钮初始位置为右上角
  const btnSize = 36
  btnPosition.value = {
    x: window.innerWidth - btnSize - 12,
    y: 12
  }

  // 等待DOM渲染后启动连接
  nextTick(() => {
    startGuacamole()
  })

  // 监听窗口大小变化
  window.addEventListener('resize', resize)

  // 监听全屏状态变化
  document.addEventListener('fullscreenchange', handleFullscreenChange)

  // 使用 ResizeObserver 监听容器大小变化
  if (viewport.value) {
    resizeObserver = new ResizeObserver(() => {
      resize()
    })
    resizeObserver.observe(viewport.value)
  }
})

onUnmounted(() => {
  // 组件卸载时清理
  if (client) {
    try {
      client.disconnect()
    } catch (e) {}
    client = null
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  window.removeEventListener('resize', resize)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#app {
  width: 100%;
  height: 100%;
}
.display {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.viewport {
  background-color: #000;
  position: relative;
  width: 100vw;
  height: 100vh;
}
.fullscreen-btn {
  position: absolute;
  width: 36px;
  height: 36px;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: #fff;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, border-color 0.2s;
  z-index: 1000;
  user-select: none;
}
.fullscreen-btn:active {
  cursor: grabbing;
  background-color: rgba(0, 0, 0, 0.8);
}
.fullscreen-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
  border-color: rgba(255, 255, 255, 0.5);
}
</style>
```

##### frontend\src\libs\GuacMouse.js

```js
import Guacamole from 'guacamole-common-js'

const mouse = function (element) {

    let guac_mouse = this;

    this.touchMouseThreshold = 3;
    this.scrollThreshold = 53;
    this.PIXELS_PER_LINE = 18;
    this.PIXELS_PER_PAGE = this.PIXELS_PER_LINE * 16;

    this.currentState = new Guacamole.Mouse.State(
        0, 0,
        false, false, false, false, false
    );

    this.onmousedown = null;
    this.onmouseup = null;
    this.onmousemove = null;
    this.onmouseout = null;

    var ignore_mouse = 0;
    var scroll_delta = 0;

    function cancelEvent(e) {
        e.stopPropagation();
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
    }

    element.addEventListener("contextmenu", function (e) {
        cancelEvent(e);
    }, false);

    element.addEventListener("mousemove", function (e) {
        if (ignore_mouse) {
            ignore_mouse--;
            return;
        }
        guac_mouse.currentState.fromClientPosition(element, e.clientX, e.clientY);
        if (guac_mouse.onmousemove)
            guac_mouse.onmousemove(guac_mouse.currentState);
    }, false);

    element.addEventListener("mousedown", function (e) {
        cancelEvent(e);
        if (ignore_mouse)
            return;
        switch (e.button) {
            case 0:
                guac_mouse.currentState.left = true;
                break;
            case 1:
                guac_mouse.currentState.middle = true;
                break;
            case 2:
                guac_mouse.currentState.right = true;
                break;
        }
        if (guac_mouse.onmousedown)
            guac_mouse.onmousedown(guac_mouse.currentState);
    }, false);

    element.addEventListener("mouseup", function (e) {
        cancelEvent(e);
        if (ignore_mouse)
            return;
        switch (e.button) {
            case 0:
                guac_mouse.currentState.left = false;
                break;
            case 1:
                guac_mouse.currentState.middle = false;
                break;
            case 2:
                guac_mouse.currentState.right = false;
                break;
        }
        if (guac_mouse.onmouseup)
            guac_mouse.onmouseup(guac_mouse.currentState);
    }, false);

    element.addEventListener("mouseout", function (e) {
        if (!e) e = window.event;
        var target = e.relatedTarget || e.toElement;
        while (target) {
            if (target === element)
                return;
            target = target.parentNode;
        }
        cancelEvent(e);
        if (guac_mouse.currentState.left
            || guac_mouse.currentState.middle
            || guac_mouse.currentState.right) {
            guac_mouse.currentState.left = false;
            guac_mouse.currentState.middle = false;
            guac_mouse.currentState.right = false;
            if (guac_mouse.onmouseup)
                guac_mouse.onmouseup(guac_mouse.currentState);
        }
        if (guac_mouse.onmouseout)
            guac_mouse.onmouseout();
    }, false);

    element.addEventListener("selectstart", function (e) {
        cancelEvent(e);
    }, false);

    function ignorePendingMouseEvents() {
        ignore_mouse = guac_mouse.touchMouseThreshold;
    }

    element.addEventListener("touchmove", ignorePendingMouseEvents, false);
    element.addEventListener("touchstart", ignorePendingMouseEvents, false);
    element.addEventListener("touchend", ignorePendingMouseEvents, false);

    function mousewheel_handler(e) {
        var delta = e.deltaY || -e.wheelDeltaY || -e.wheelDelta;
        if (delta) {
            if (e.deltaMode === 1)
                delta = e.deltaY * guac_mouse.PIXELS_PER_LINE;
            else if (e.deltaMode === 2)
                delta = e.deltaY * guac_mouse.PIXELS_PER_PAGE;
        } else
            delta = e.detail * guac_mouse.PIXELS_PER_LINE;

        scroll_delta += delta;

        if (scroll_delta <= -guac_mouse.scrollThreshold) {
            do {
                if (guac_mouse.onmousedown) {
                    guac_mouse.currentState.up = true;
                    guac_mouse.onmousedown(guac_mouse.currentState);
                }
                if (guac_mouse.onmouseup) {
                    guac_mouse.currentState.up = false;
                    guac_mouse.onmouseup(guac_mouse.currentState);
                }
                scroll_delta += guac_mouse.scrollThreshold;
            } while (scroll_delta <= -guac_mouse.scrollThreshold);
            scroll_delta = 0;
        }

        if (scroll_delta >= guac_mouse.scrollThreshold) {
            do {
                if (guac_mouse.onmousedown) {
                    guac_mouse.currentState.down = true;
                    guac_mouse.onmousedown(guac_mouse.currentState);
                }
                if (guac_mouse.onmouseup) {
                    guac_mouse.currentState.down = false;
                    guac_mouse.onmouseup(guac_mouse.currentState);
                }
                scroll_delta -= guac_mouse.scrollThreshold;
            } while (scroll_delta >= guac_mouse.scrollThreshold);
            scroll_delta = 0;
        }

        cancelEvent(e);
    }

    element.addEventListener('DOMMouseScroll', mousewheel_handler, false);
    element.addEventListener('mousewheel', mousewheel_handler, false);
    element.addEventListener('wheel', mousewheel_handler, false);

    this.setCursor = function (canvas, x, y) {
        if (CSS3_CURSOR_SUPPORTED) {
            var dataURL = canvas.toDataURL('image/png');
            element.style.cursor = "url(" + dataURL + ") " + x + " " + y + ", auto";
            return true;
        }
        return false;
    };

    var CSS3_CURSOR_SUPPORTED = (function () {
        var div = document.createElement("div");
        if (!("cursor" in div.style))
            return false;
        try {
            div.style.cursor = "url(data:image/png;base64,"
                + "iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB"
                + "AQMAAAAl21bKAAAAA1BMVEX///+nxBvI"
                + "AAAACklEQVQI12NgAAAAAgAB4iG8MwAA"
                + "AABJRU5ErkJggg==) 0 0, auto";
        } catch (e) {
            return false;
        }
        return /\burl\([^()]*\)\s+0\s+0\b/.test(div.style.cursor || "");
    })();
};

mouse.State = Guacamole.Mouse.State
mouse.Touchpad = Guacamole.Mouse.Touchpad
mouse.Touchscreen = Guacamole.Mouse.Touchscreen

export default {
    mouse
}
```

#### 后端

##### guac\config.go

```go
package guac

type Config struct {
	ConnectionID        string
	Protocol            string
	Parameters          map[string]string
	OptimalScreenWidth  int
	OptimalScreenHeight int
	OptimalResolution   int
	AudioMimetypes      []string
	VideoMimetypes      []string
	ImageMimetypes      []string
}

func NewGuacamoleConfiguration() *Config {
	return &Config{
		Parameters:          map[string]string{},
		OptimalScreenWidth:  1024,
		OptimalScreenHeight: 768,
		OptimalResolution:   96,
		AudioMimetypes:      make([]string, 0, 1),
		VideoMimetypes:      make([]string, 0, 1),
		ImageMimetypes:      make([]string, 0, 1),
	}
}
```

##### guac\counted_lock.go

```go
package guac

import (
	"sync"
	"sync/atomic"
)

type CountedLock struct {
	core     sync.Mutex
	numLocks int32
}

func (r *CountedLock) Lock() {
	atomic.AddInt32(&r.numLocks, 1)
	r.core.Lock()
}

func (r *CountedLock) Unlock() {
	atomic.AddInt32(&r.numLocks, -1)
	r.core.Unlock()
}

func (r *CountedLock) HasQueued() bool {
	return atomic.LoadInt32(&r.numLocks) > 1
}
```

##### guac\errors.go

```go
package guac

import (
	"fmt"
	"strings"
)

type ErrGuac struct {
	error
	Status Status
	Kind   ErrKind
}

type ErrKind int

const (
	ErrClientBadType ErrKind = iota
	ErrClient
	ErrClientOverrun
	ErrClientTimeout
	ErrClientTooMany
	ErrConnectionClosed
	ErrOther
	ErrResourceClosed
	ErrResourceConflict
	ErrResourceNotFound
	ErrSecurity
	ErrServerBusy
	ErrServer
	ErrSessionClosed
	ErrSessionConflict
	ErrSessionTimeout
	ErrUnauthorized
	ErrUnsupported
	ErrUpstream
	ErrUpstreamNotFound
	ErrUpstreamTimeout
	ErrUpstreamUnavailable
)

func (e ErrKind) Status() (state Status) {
	switch e {
	case ErrClientBadType:
		return ClientBadType
	case ErrClient:
		return ClientBadRequest
	case ErrClientOverrun:
		return ClientOverrun
	case ErrClientTimeout:
		return ClientTimeout
	case ErrClientTooMany:
		return ClientTooMany
	case ErrConnectionClosed:
		return ServerError
	case ErrOther:
		return ServerError
	case ErrResourceClosed:
		return ResourceClosed
	case ErrResourceConflict:
		return ResourceConflict
	case ErrResourceNotFound:
		return ResourceNotFound
	case ErrSecurity:
		return ClientForbidden
	case ErrServerBusy:
		return ServerBusy
	case ErrServer:
		return ServerError
	case ErrSessionClosed:
		return SessionClosed
	case ErrSessionConflict:
		return SessionConflict
	case ErrSessionTimeout:
		return SessionTimeout
	case ErrUnauthorized:
		return ClientUnauthorized
	case ErrUnsupported:
		return Unsupported
	case ErrUpstream:
		return UpstreamError
	case ErrUpstreamNotFound:
		return UpstreamNotFound
	case ErrUpstreamTimeout:
		return UpstreamTimeout
	case ErrUpstreamUnavailable:
		return UpstreamUnavailable
	}
	return
}

func (e ErrKind) NewError(args ...string) error {
	return &ErrGuac{
		error:  fmt.Errorf("%v", strings.Join(args, ", ")),
		Status: e.Status(),
		Kind:   e,
	}
}
```

##### guac\guac_instruction.go

```go
package guac

import (
	"fmt"
	"strconv"
)

type Instruction struct {
	Opcode string
	Args   []string
	cache  string
}

func NewInstruction(opcode string, args ...string) *Instruction {
	return &Instruction{
		Opcode: opcode,
		Args:   args,
	}
}

func (i *Instruction) String() string {
	if len(i.cache) > 0 {
		return i.cache
	}

	i.cache = fmt.Sprintf("%d.%s", len(i.Opcode), i.Opcode)
	for _, value := range i.Args {
		i.cache += fmt.Sprintf(",%d.%s", len(value), value)
	}
	i.cache += ";"

	return i.cache
}

func (i *Instruction) Byte() []byte {
	return []byte(i.String())
}

func Parse(data []byte) (*Instruction, error) {
	elementStart := 0

	elements := make([]string, 0, 1)
	for elementStart < len(data) {
		lengthEnd := -1
		for i := elementStart; i < len(data); i++ {
			if data[i] == '.' {
				lengthEnd = i
				break
			}
		}
		if lengthEnd == -1 {
			return nil, ErrServer.NewError("ReadSome returned incomplete instruction.")
		}

		length, e := strconv.Atoi(string(data[elementStart:lengthEnd]))
		if e != nil {
			return nil, ErrServer.NewError("ReadSome returned wrong pattern instruction.", e.Error())
		}

		elementStart = lengthEnd + 1
		element := string(data[elementStart : elementStart+length])

		elements = append(elements, element)

		elementStart += length
		terminator := data[elementStart]

		elementStart++

		if terminator == ';' {
			break
		}

	}

	return NewInstruction(elements[0], elements[1:]...), nil
}

func ReadOne(stream *Stream) (instruction *Instruction, err error) {
	var instructionBuffer []byte
	instructionBuffer, err = stream.ReadSome()
	if err != nil {
		return
	}

	return Parse(instructionBuffer)
}
```

##### guac\guac.go

```go
package guac

import (
	"net"

	"github.com/sirupsen/logrus"
)

// NewGuacamoleTunnel creates a tunnel to guacd for RDP connection
func NewGuacamoleTunnel(guacadAddr, protocol, host, port, user, password, uuid string, w, h, dpi int) (s *SimpleTunnel, err error) {
	config := NewGuacamoleConfiguration()
	config.ConnectionID = uuid
	config.Protocol = protocol
	config.OptimalScreenHeight = h
	config.OptimalScreenWidth = w
	config.OptimalResolution = dpi
	config.AudioMimetypes = []string{"audio/L16", "rate=44100", "channels=2"}
	config.Parameters = map[string]string{
		"scheme":           protocol,
		"hostname":         host,
		"port":             port,
		"ignore-cert":      "true",
		"security":         "any",
		"username":         user,
		"password":         password,
		"enable-wallpaper": "true",
		"resize-method":    "display-update",
		"disable-copy":     "false",
		"disable-paste":    "false",
		"enable-audio":     "true",
	}
	addr, err := net.ResolveTCPAddr("tcp", guacadAddr)
	if err != nil {
		logrus.Errorln("error while resolving guacd address", err)
		return nil, err
	}
	logrus.Infof("Connecting to guacd at %s", addr.String())
	conn, err := net.DialTCP("tcp", nil, addr)
	if err != nil {
		logrus.Errorln("error while connecting to guacd", err)
		return nil, err
	}
	logrus.Info("Connected to guacd, starting handshake")
	stream := NewStream(conn, SocketTimeout)
	err = stream.Handshake(config)
	if err != nil {
		logrus.Errorln("handshake failed", err)
		return nil, err
	}
	logrus.Info("Handshake completed successfully")
	tunnel := NewSimpleTunnel(stream)
	return tunnel, nil
}
```

##### guac\status.go

```go
package guac

type Status int

const (
	Undefined Status = -1

	Success Status = iota

	Unsupported

	ServerError

	ServerBusy

	UpstreamTimeout

	UpstreamError

	ResourceNotFound

	ResourceConflict

	ResourceClosed

	UpstreamNotFound

	UpstreamUnavailable

	SessionConflict

	SessionTimeout

	SessionClosed

	ClientBadRequest

	ClientUnauthorized

	ClientForbidden

	ClientTimeout

	ClientOverrun

	ClientBadType

	ClientTooMany
)

type statusData struct {
	name          string
	httpCode      int
	websocketCode int
	guacCode      int
}

func newStatusData(name string, httpCode, websocketCode, guacCode int) (ret statusData) {
	ret.name = name
	ret.httpCode = httpCode
	ret.websocketCode = websocketCode
	ret.guacCode = guacCode
	return
}

var guacamoleStatusMap = map[Status]statusData{
	Success:             newStatusData("Success", 200, 1000, 0x0000),
	Unsupported:         newStatusData("Unsupported", 501, 1011, 0x0100),
	ServerError:         newStatusData("SERVER_ERROR", 500, 1011, 0x0200),
	ServerBusy:          newStatusData("SERVER_BUSY", 503, 1008, 0x0201),
	UpstreamTimeout:     newStatusData("UPSTREAM_TIMEOUT", 504, 1011, 0x0202),
	UpstreamError:       newStatusData("UPSTREAM_ERROR", 502, 1011, 0x0203),
	ResourceNotFound:    newStatusData("RESOURCE_NOT_FOUND", 404, 1002, 0x0204),
	ResourceConflict:    newStatusData("RESOURCE_CONFLICT", 409, 1008, 0x0205),
	ResourceClosed:      newStatusData("RESOURCE_CLOSED", 404, 1002, 0x0206),
	UpstreamNotFound:    newStatusData("UPSTREAM_NOT_FOUND", 502, 1011, 0x0207),
	UpstreamUnavailable: newStatusData("UPSTREAM_UNAVAILABLE", 502, 1011, 0x0208),
	SessionConflict:     newStatusData("SESSION_CONFLICT", 409, 1008, 0x0209),
	SessionTimeout:      newStatusData("SESSION_TIMEOUT", 408, 1002, 0x020A),
	SessionClosed:       newStatusData("SESSION_CLOSED", 404, 1002, 0x020B),
	ClientBadRequest:    newStatusData("CLIENT_BAD_REQUEST", 400, 1002, 0x0300),
	ClientUnauthorized:  newStatusData("CLIENT_UNAUTHORIZED", 403, 1008, 0x0301),
	ClientForbidden:     newStatusData("CLIENT_FORBIDDEN", 403, 1008, 0x0303),
	ClientTimeout:       newStatusData("CLIENT_TIMEOUT", 408, 1002, 0x0308),
	ClientOverrun:       newStatusData("CLIENT_OVERRUN", 413, 1009, 0x030D),
	ClientBadType:       newStatusData("CLIENT_BAD_TYPE", 415, 1003, 0x030F),
	ClientTooMany:       newStatusData("CLIENT_TOO_MANY", 429, 1008, 0x031D),
}

func (s Status) String() string {
	if v, ok := guacamoleStatusMap[s]; ok {
		return v.name
	}
	return ""
}

func (s Status) GetHTTPStatusCode() int {
	if v, ok := guacamoleStatusMap[s]; ok {
		return v.httpCode
	}
	return -1
}

func (s Status) GetWebSocketCode() int {
	if v, ok := guacamoleStatusMap[s]; ok {
		return v.websocketCode
	}
	return -1
}

func (s Status) GetGuacamoleStatusCode() int {
	if v, ok := guacamoleStatusMap[s]; ok {
		return v.guacCode
	}
	return -1
}

func FromGuacamoleStatusCode(code int) (ret Status) {
	for k, v := range guacamoleStatusMap {
		if v.guacCode == code {
			ret = k
			return
		}
	}
	ret = Undefined
	return

}
```

##### guac\stream_conn.go

```go
package guac

import (
	"fmt"
	"net"
	"time"

	"github.com/sirupsen/logrus"
)

const (
	SocketTimeout  = 15 * time.Second
	MaxGuacMessage = 8192
)

type Stream struct {
	conn         net.Conn
	ConnectionID string
	parseStart   int
	buffer       []byte
	reset        []byte
	timeout      time.Duration
}

func NewStream(conn net.Conn, timeout time.Duration) *Stream {
	buffer := make([]byte, 0, MaxGuacMessage*3)
	return &Stream{
		conn:    conn,
		timeout: timeout,
		buffer:  buffer,
		reset:   buffer[:cap(buffer)],
	}
}

func (s *Stream) Write(data []byte) (n int, err error) {
	if err = s.conn.SetWriteDeadline(time.Now().Add(s.timeout)); err != nil {
		logrus.Error(err)
		return
	}
	return s.conn.Write(data)
}

func (s *Stream) Available() bool {
	return len(s.buffer) > 0
}

func (s *Stream) Flush() {
	copy(s.reset, s.buffer)
	s.buffer = s.reset[:len(s.buffer)]
}

func (s *Stream) ReadSome() (instruction []byte, err error) {
	if err = s.conn.SetReadDeadline(time.Now().Add(s.timeout)); err != nil {
		logrus.Error(err)
		return
	}

	var n int
	for {
		var elementLength int

		i := s.parseStart

	parseLoop:
		for i < len(s.buffer) {
			readChar := s.buffer[i]
			i++

			switch readChar {
			case '0', '1', '2', '3', '4', '5', '6', '7', '8', '9':
				elementLength = elementLength*10 + int(readChar-'0')

			case '.':
				if i+elementLength >= len(s.buffer) {
					break parseLoop
				}
				terminator := s.buffer[i+elementLength]
				i += elementLength + 1

				elementLength = 0

				s.parseStart = i

				switch terminator {
				case ';':
					instruction = s.buffer[0:i]
					s.parseStart = 0
					s.buffer = s.buffer[i:]
					return
				case ',':
				default:
					err = ErrServer.NewError("Element terminator of instruction was not ';' nor ','")
					return
				}
			default:
				err = ErrServer.NewError("Non-numeric character in element length:", string(readChar))
				return
			}
		}

		if cap(s.buffer) < MaxGuacMessage {
			s.Flush()
		}

		n, err = s.conn.Read(s.buffer[len(s.buffer):cap(s.buffer)])
		if err != nil && n == 0 {
			switch e := err.(type) {
			case net.Error:
				if e.Timeout() {
					err = ErrUpstreamTimeout.NewError("Connection to guacd timed out.", err.Error())
				} else {
					err = ErrConnectionClosed.NewError("Connection to guacd is closed.", err.Error())
				}
			default:
				err = ErrServer.NewError(err.Error())
			}
			return
		}
		s.buffer = s.buffer[:len(s.buffer)+n]
	}
}

func (s *Stream) Close() error {
	return s.conn.Close()
}

func (s *Stream) Handshake(config *Config) error {
	selectArg := config.ConnectionID
	if len(selectArg) == 0 {
		selectArg = config.Protocol
	}

	_, err := s.Write(NewInstruction("select", selectArg).Byte())
	if err != nil {
		return err
	}

	args, err := s.AssertOpcode("args")
	if err != nil {
		return err
	}

	argNameS := args.Args
	argValueS := make([]string, 0, len(argNameS))
	for _, argName := range argNameS {
		value := config.Parameters[argName]
		if len(value) == 0 {
			value = ""
		}
		argValueS = append(argValueS, value)
	}

	_, err = s.Write(NewInstruction("size",
		fmt.Sprintf("%v", config.OptimalScreenWidth),
		fmt.Sprintf("%v", config.OptimalScreenHeight),
		fmt.Sprintf("%v", config.OptimalResolution)).Byte(),
	)

	if err != nil {
		return err
	}

	_, err = s.Write(NewInstruction("audio", config.AudioMimetypes...).Byte())
	if err != nil {
		return err
	}

	_, err = s.Write(NewInstruction("video", config.VideoMimetypes...).Byte())
	if err != nil {
		return err
	}

	_, err = s.Write(NewInstruction("image", config.ImageMimetypes...).Byte())
	if err != nil {
		return err
	}

	_, err = s.Write(NewInstruction("connect", argValueS...).Byte())
	if err != nil {
		return err
	}

	ready, err := s.AssertOpcode("ready")
	if err != nil {
		return err
	}

	readyArgs := ready.Args
	if len(readyArgs) == 0 {
		err = ErrServer.NewError("No connection ID received")
		return err
	}

	s.Flush()
	s.ConnectionID = readyArgs[0]

	return nil
}

func (s *Stream) AssertOpcode(opcode string) (instruction *Instruction, err error) {
	instruction, err = ReadOne(s)
	if err != nil {
		return
	}

	if len(instruction.Opcode) == 0 {
		err = ErrServer.NewError("End of stream while waiting for \"" + opcode + "\".")
		return
	}

	if instruction.Opcode != opcode {
		err = ErrServer.NewError("Expected \"" + opcode + "\" instruction but instead received \"" + instruction.Opcode + "\".")
		return
	}
	return
}
```

##### guac\tunnel_pipe.go

```go
package guac

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"io"
	"log"
)

const InternalDataOpcode = ""

var InternalOpcodeIns = []byte(fmt.Sprint(len(InternalDataOpcode), ".", InternalDataOpcode))

type InstructionReader interface {
	ReadSome() ([]byte, error)
	Available() bool
	Flush()
}

type TunnelPipe interface {
	AcquireReader() InstructionReader
	ReleaseReader()
	HasQueuedReaderThreads() bool
	AcquireWriter() io.Writer
	ReleaseWriter()
	HasQueuedWriterThreads() bool
	GetUUID() string
	ConnectionID() string
	Close() error
}

type SimpleTunnel struct {
	stream     *Stream
	readerLock CountedLock
	writerLock CountedLock
}

func NewSimpleTunnel(stream *Stream) *SimpleTunnel {
	return &SimpleTunnel{
		stream: stream,
	}
}

func (t *SimpleTunnel) AcquireReader() InstructionReader {
	t.readerLock.Lock()
	return t.stream
}

func (t *SimpleTunnel) ReleaseReader() {
	t.readerLock.Unlock()
}

func (t *SimpleTunnel) HasQueuedReaderThreads() bool {
	return t.readerLock.HasQueued()
}

func (t *SimpleTunnel) AcquireWriter() io.Writer {
	t.writerLock.Lock()
	return t.stream
}

func (t *SimpleTunnel) ReleaseWriter() {
	t.writerLock.Unlock()
}

func (t *SimpleTunnel) ConnectionID() string {
	return t.stream.ConnectionID
}

func (t *SimpleTunnel) HasQueuedWriterThreads() bool {
	return t.writerLock.HasQueued()
}

func (t *SimpleTunnel) Close() (err error) {
	return t.stream.Close()
}

func (t *SimpleTunnel) GetUUID() string {
	data := make([]byte, 32)
	_, err := io.ReadFull(rand.Reader, data)
	if err != nil {
		log.Println(err)
		return ""
	}
	return base64.RawURLEncoding.EncodeToString(data)
}
```

##### api_ws_guaca.go

```go
package main

import (
	"bytes"
	"context"
	"fmt"
	"guacamole-go-web/guac"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
	"golang.org/x/sync/errgroup"
)

type ReqArg struct {
	GuacadAddr    string `form:"guacad_addr"`
	AssetProtocol string `form:"asset_protocol"`
	AssetHost     string `form:"asset_host"`
	AssetPort     string `form:"asset_port"`
	AssetUser     string `form:"asset_user"`
	AssetPassword string `form:"asset_password"`
	ScreenWidth   int    `form:"screen_width"`
	ScreenHeight  int    `form:"screen_height"`
	ScreenDpi     int    `form:"screen_dpi"`
}

func ApiWsGuacamole() gin.HandlerFunc {
	websocketReadBufferSize := guac.MaxGuacMessage
	websocketWriteBufferSize := guac.MaxGuacMessage * 2
	upgrade := websocket.Upgrader{
		ReadBufferSize:  websocketReadBufferSize,
		WriteBufferSize: websocketWriteBufferSize,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	return func(c *gin.Context) {
		arg := new(ReqArg)
		err := c.BindQuery(arg)
		if err != nil {
			c.JSON(202, err.Error())
			return
		}

		// 写死配置
		arg.GuacadAddr = "192.168.1.30:4822"
		arg.AssetProtocol = "rdp"
		arg.AssetHost = "192.168.1.90"
		arg.AssetPort = "3389"
		arg.AssetUser = "administrator"
		arg.AssetPassword = "123456"

		protocol := c.Request.Header.Get("Sec-Websocket-Protocol")
		ws, err := upgrade.Upgrade(c.Writer, c.Request, http.Header{
			"Sec-Websocket-Protocol": {protocol},
		})
		if err != nil {
			logrus.WithError(err).Error("升级ws失败")
			return
		}
		defer func() {
			if err = ws.Close(); err != nil {
				logrus.Traceln("Error closing websocket", err)
			}
		}()

		uid := ""

		pipeTunnel, err := guac.NewGuacamoleTunnel(arg.GuacadAddr, arg.AssetProtocol, arg.AssetHost, arg.AssetPort, arg.AssetUser, arg.AssetPassword, uid, arg.ScreenWidth, arg.ScreenHeight, arg.ScreenDpi)
		if err != nil {
			logrus.Error("Failed to upgrade websocket", err)
			return
		}
		defer func() {
			if err = pipeTunnel.Close(); err != nil {
				logrus.Traceln("Error closing pipeTunnel", err)
			}
		}()

		ioCopy(ws, pipeTunnel)
		logrus.Info("websocket session end")
	}
}

func ioCopy(ws *websocket.Conn, tunnl *guac.SimpleTunnel) {

	writer := tunnl.AcquireWriter()
	reader := tunnl.AcquireReader()
	defer tunnl.ReleaseWriter()
	defer tunnl.ReleaseReader()

	eg, _ := errgroup.WithContext(context.Background())

	eg.Go(func() error {
		buf := bytes.NewBuffer(make([]byte, 0, guac.MaxGuacMessage*2))

		for {
			ins, err := reader.ReadSome()
			if err != nil {
				return err
			}

			if bytes.HasPrefix(ins, guac.InternalOpcodeIns) {
				continue
			}

			if _, err = buf.Write(ins); err != nil {
				return err
			}

			if !reader.Available() || buf.Len() >= guac.MaxGuacMessage {
				if err = ws.WriteMessage(1, buf.Bytes()); err != nil {
					if err == websocket.ErrCloseSent {
						return fmt.Errorf("websocket:%v", err)
					}
					logrus.Traceln("Failed sending message to ws", err)
					return err
				}
				buf.Reset()
			}
		}

	})
	eg.Go(func() error {
		for {
			_, data, err := ws.ReadMessage()
			if err != nil {
				logrus.Traceln("Error reading message from ws", err)
				return err
			}
			if bytes.HasPrefix(data, guac.InternalOpcodeIns) {
				continue
			}
			if _, err = writer.Write(data); err != nil {
				logrus.Traceln("Failed writing to guacd", err)
				return err
			}
		}

	})
	if err := eg.Wait(); err != nil {
		logrus.WithError(err).Error("session-err")
	}

}
```

##### main.go

```go
package main

import (
	"embed"
	"path"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

var buildAt string
var gitHash string

func main() {
	logrus.SetReportCaller(true)
	r := gin.Default()
	r.GET("/version", func(c *gin.Context) { c.JSON(200, gin.H{gitHash: buildAt}) })
	r.Use(feMw("/"))
	r.GET("/ws", ApiWsGuacamole())
	// HTTPS
	logrus.Info("Starting HTTPS server on :9528")
	logrus.Fatal(r.RunTLS(":9528", "certs/cert.pem", "certs/key.pem"))
}

//go:embed frontend/dist/*
var fs embed.FS

const fsBase = "frontend/dist"

func feMw(urlPrefix string) gin.HandlerFunc {
	const indexHtml = "index.html"

	return func(c *gin.Context) {
		urlPath := strings.TrimSpace(c.Request.URL.Path)
		if urlPath == urlPrefix {
			urlPath = path.Join(urlPrefix, indexHtml)
		}
		urlPath = path.Join(fsBase, urlPath)

		f, err := fs.Open(urlPath)
		if err != nil {
			return
		}
		fi, err := f.Stat()
		if strings.HasSuffix(urlPath, ".html") {
			c.Header("Cache-Control", "no-cache")
			c.Header("Content-Type", "text/html; charset=utf-8")
		}

		if strings.HasSuffix(urlPath, ".js") {
			c.Header("Content-Type", "text/javascript; charset=utf-8")
		}
		if strings.HasSuffix(urlPath, ".css") {
			c.Header("Content-Type", "text/css; charset=utf-8")
		}

		if err != nil || !fi.IsDir() {
			bs, err := fs.ReadFile(urlPath)
			if err != nil {
				logrus.WithError(err).Error("embed fs")
				return
			}
			c.Status(200)
			c.Writer.Write(bs)
			c.Abort()
		}
	}
}
```

##### go.mod

```
module guacamole-go-web

go 1.16

require (
	github.com/gin-gonic/gin v1.6.3
	github.com/gorilla/websocket v1.4.2
	github.com/sirupsen/logrus v1.8.0
	golang.org/x/sync v0.0.0-20210220032951-036812b2e83c
)
```

### 三、构建前端

- 安装依赖

切换到 frontend 目录

```cmd
cd frontend

npm i
```

- 构建前期

```cmd
npm run build
```

### 四、运行 go 后端

- 运行

切换到根目录运行

```cmd
go run .
```

- 构建

```cmd
go build .
```

### 五、浏览器访问

https://127.0.0.1:9528

注意：当前demo仅实现声音功能，自动缩放和全屏按钮，其他的功能未实现

guacamole 配置信息在 api_ws_guaca.go 文件，按需修改
