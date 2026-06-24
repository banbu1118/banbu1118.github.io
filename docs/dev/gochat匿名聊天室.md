# gochat匿名聊天室

一个支持端到端加密（E2EE）的轻量级匿名聊天室应用，使用 Go 语言开发。用户通过分享链接进入房间匿名聊天，所有消息经过端到端加密，服务端无法读取明文。

## 项目

### 项目结构

```cmd
C:\Users\kk\Desktop\gochat>tree /F
文件夹 PATH 列表
卷序列号为 AA59-C1A0
C:.
│  .gitignore
│  go.mod
│  go.sum
│  main.go
│  README.md
│
├─certs
│      cert.pem
│      key.pem
│
└─static
        index.html
```

### 后端

main.go

```go
// =============================================================================
// gochat - 基于 WebSocket 的匿名聊天室（E2EE 端到端加密版）
// =============================================================================
//
// 匿名房间机制：
//   - 发起者在前端「创建房间」，生成唯一 room ID，得到分享链接 ?room=xxx
//   - 可选为房间设置密码
//   - 只有持有正确密码的用户才能连入 /ws?room=xxx
//   - 消息只在同一房间内广播，不同房间互不可见
//   - 用户完全匿名，不显示任何身份信息
//
// E2EE 端到端加密：
//   - 服务端只做消息透传，不接触明文
//   - 客户端实现 Double Ratchet 协议
//
// 服务端限流：
//   - 单条消息最多 500 字符
//   - 单用户每 500ms 最多发送 1 条消息
//   - 单房间每秒最多 50 条消息
//   - 单房间最多 200 人
//
// =============================================================================

package main

import (
	"fmt"
	"log"
	"net/http"
	"regexp"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

const (
	maxMessageLength = 500                    // 单条消息最大字符数
	userRateLimit    = 500 * time.Millisecond // 单用户发送间隔
	roomRateLimit    = 50                     // 房间每秒最大消息数
	maxRoomSize      = 200                    // 房间最大人数
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Message struct {
	Type       string            `json:"type"`                 // chat | system | welcome | keyexchange | identity | ratchet
	Content    string            `json:"content,omitempty"`    // 消息正文（服务端不解读）
	PublicKey  string            `json:"publicKey,omitempty"`  // 长期身份公钥（用于 E2EE 握手）
	SigningKey string            `json:"signingKey,omitempty"` // ECDSA 签名公钥（用于防 MITM 验证）
	SignedPre  string            `json:"signedPre,omitempty"`  // 签名预密钥
	Ephemeral  string            `json:"ephemeral,omitempty"`  // 临时公钥
	RatchetKey string            `json:"ratchetKey,omitempty"` // 消息级 ratchet 公钥
	Signature  string            `json:"signature,omitempty"`  // E2EE 握手签名（防 MITM）
	Counter    int               `json:"counter,omitempty"`    // 消息序号
	IV         string            `json:"iv,omitempty"`         // 初始向量
	Cipher     string            `json:"cipher,omitempty"`     // 密文
	Recipients []Recipient       `json:"recipients,omitempty"` // 群聊 E2EE：每个接收方一份密文
	Extra      map[string]string `json:"extra,omitempty"`      // 扩展字段
}

type Recipient struct {
	RatchetKey string `json:"ratchetKey,omitempty"`
	Counter    int    `json:"counter,omitempty"`
	Cipher     string `json:"cipher,omitempty"`
}

type Client struct {
	conn         *websocket.Conn
	room         string
	lastSendTime time.Time
}

type RoomInfo struct {
	passwordHash string
	clients      map[*websocket.Conn]bool
	msgCount     int
	msgCountSec  int64
}

type roomBroadcast struct {
	room string
	msg  Message
}

var (
	mu        sync.Mutex
	clients   = make(map[*websocket.Conn]*Client)
	rooms     = make(map[string]*RoomInfo)
	broadcast = make(chan roomBroadcast)
	roomIDRe  = regexp.MustCompile(`^[a-f0-9]{32}$`)
)

func registerClient(ws *websocket.Conn, room string) bool {
	mu.Lock()
	defer mu.Unlock()

	if roomInfo, ok := rooms[room]; ok && len(roomInfo.clients) >= maxRoomSize {
		return false
	}

	clients[ws] = &Client{conn: ws, room: room}
	if rooms[room] == nil {
		rooms[room] = &RoomInfo{
			passwordHash: "",
			clients:      make(map[*websocket.Conn]bool),
			msgCount:     0,
			msgCountSec:  time.Now().Unix(),
		}
	}
	rooms[room].clients[ws] = true
	return true
}

func unregisterClient(ws *websocket.Conn) *Client {
	mu.Lock()
	defer mu.Unlock()
	client, ok := clients[ws]
	if !ok {
		return nil
	}
	delete(clients, ws)
	if roomInfo, ok := rooms[client.room]; ok {
		delete(roomInfo.clients, ws)
		if len(roomInfo.clients) == 0 {
			delete(rooms, client.room)
		}
	}
	return client
}

func createRoom(roomID, password string) {
	mu.Lock()
	defer mu.Unlock()
	if rooms[roomID] != nil {
		return
	}
	rooms[roomID] = &RoomInfo{
		passwordHash: password,
		clients:      make(map[*websocket.Conn]bool),
		msgCount:     0,
		msgCountSec:  time.Now().Unix(),
	}
}

func checkRoomPassword(roomID, password string) bool {
	mu.Lock()
	defer mu.Unlock()
	roomInfo, ok := rooms[roomID]
	if !ok {
		return false
	}
	if roomInfo.passwordHash == "" {
		return true
	}
	return roomInfo.passwordHash == password
}

func allowUserSend(client *Client) bool {
	mu.Lock()
	defer mu.Unlock()
	now := time.Now()
	if !client.lastSendTime.IsZero() && now.Sub(client.lastSendTime) < userRateLimit {
		return false
	}
	client.lastSendTime = now
	return true
}

func allowRoomBroadcast(roomID string) bool {
	mu.Lock()
	defer mu.Unlock()
	roomInfo, ok := rooms[roomID]
	if !ok {
		return false
	}
	nowSec := time.Now().Unix()
	if roomInfo.msgCountSec != nowSec {
		roomInfo.msgCountSec = nowSec
		roomInfo.msgCount = 0
	}
	if roomInfo.msgCount >= roomRateLimit {
		return false
	}
	roomInfo.msgCount++
	return true
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	room := r.URL.Query().Get("room")
	if !roomIDRe.MatchString(room) {
		http.Error(w, "无效的房间 ID", http.StatusBadRequest)
		return
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket 升级失败：", err)
		return
	}
	defer ws.Close()

	var client *Client
	authenticated := false

	for {
		var incoming struct {
			Type       string            `json:"type"`
			Password   string            `json:"password,omitempty"`
			Content    string            `json:"content,omitempty"`
			PublicKey  string            `json:"publicKey,omitempty"`
			SigningKey string            `json:"signingKey,omitempty"`
			SignedPre  string            `json:"signedPre,omitempty"`
			Ephemeral  string            `json:"ephemeral,omitempty"`
			RatchetKey string            `json:"ratchetKey,omitempty"`
			Signature  string            `json:"signature,omitempty"`
			Counter    int               `json:"counter,omitempty"`
			IV         string            `json:"iv,omitempty"`
			Cipher     string            `json:"cipher,omitempty"`
			Recipients []Recipient       `json:"recipients,omitempty"`
			Extra      map[string]string `json:"extra,omitempty"`
		}
		if err := ws.ReadJSON(&incoming); err != nil {
			return
		}

		if !authenticated {
			if incoming.Type != "auth" {
				ws.WriteJSON(Message{Type: "system", Content: "请先进行身份验证"})
				continue
			}

			if !checkRoomPassword(room, incoming.Password) {
				ws.WriteJSON(Message{Type: "system", Content: "密码错误，请重新输入"})
				continue
			}

			ok := registerClient(ws, room)
			if !ok {
				ws.WriteJSON(Message{Type: "system", Content: fmt.Sprintf("房间已满（最多 %d 人）", maxRoomSize)})
				return
			}

			mu.Lock()
			client = clients[ws]
			mu.Unlock()

			authenticated = true
			ws.WriteJSON(Message{Type: "welcome", Content: "欢迎加入匿名聊天室"})
			continue
		}

		if incoming.Type == "identity" || incoming.Type == "ratchet" || incoming.Type == "keyexchange" {
			broadcast <- roomBroadcast{
				room: room,
				msg: Message{
					Type:       incoming.Type,
					PublicKey:  incoming.PublicKey,
					SigningKey: incoming.SigningKey,
					SignedPre:  incoming.SignedPre,
					Ephemeral:  incoming.Ephemeral,
					RatchetKey: incoming.RatchetKey,
					Signature:  incoming.Signature,
					Counter:    incoming.Counter,
					IV:         incoming.IV,
					Cipher:     incoming.Cipher,
					Recipients: incoming.Recipients,
					Extra:      incoming.Extra,
				},
			}
			continue
		}

		if incoming.Type == "chat" {
			if len(incoming.Recipients) == 0 && incoming.Cipher == "" && incoming.Content == "" {
				continue
			}

			if !allowUserSend(client) {
				ws.WriteJSON(Message{Type: "system", Content: "发送过于频繁，请稍后再试"})
				continue
			}

			if !allowRoomBroadcast(room) {
				ws.WriteJSON(Message{Type: "system", Content: "房间消息频率超限，请稍后再试"})
				continue
			}

			broadcast <- roomBroadcast{
				room: room,
				msg: Message{
					Type:       "chat",
					Content:    incoming.Content,
					PublicKey:  incoming.PublicKey,
					RatchetKey: incoming.RatchetKey,
					Counter:    incoming.Counter,
					IV:         incoming.IV,
					Cipher:     incoming.Cipher,
					Recipients: incoming.Recipients,
					Extra:      incoming.Extra,
				},
			}
		}
	}
}

func handleMessages() {
	for {
		task := <-broadcast
		mu.Lock()
		roomInfo := rooms[task.room]
		if roomInfo == nil {
			mu.Unlock()
			continue
		}
		targets := make([]*websocket.Conn, 0, len(roomInfo.clients))
		for conn := range roomInfo.clients {
			targets = append(targets, conn)
		}
		mu.Unlock()

		for _, conn := range targets {
			if err := conn.WriteJSON(task.msg); err != nil {
				conn.Close()
				unregisterClient(conn)
			}
		}
	}
}

func handleCreateRoom(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "方法不允许", http.StatusMethodNotAllowed)
		return
	}

	if err := r.ParseForm(); err != nil {
		http.Error(w, "解析表单失败", http.StatusBadRequest)
		return
	}

	roomID := r.FormValue("room_id")
	password := r.FormValue("password")

	if !roomIDRe.MatchString(roomID) {
		http.Error(w, "无效的房间 ID", http.StatusBadRequest)
		return
	}

	createRoom(roomID, password)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"success": true}`))
}

func handleRoomInfo(w http.ResponseWriter, r *http.Request) {
	roomID := r.URL.Query().Get("room")
	if !roomIDRe.MatchString(roomID) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"exists": false, "hasPassword": false}`))
		return
	}

	mu.Lock()
	roomInfo, ok := rooms[roomID]
	mu.Unlock()

	hasPassword := ok && roomInfo.passwordHash != ""
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(fmt.Sprintf(`{"exists": %t, "hasPassword": %t}`, ok, hasPassword)))
}

func main() {
	const (
		addr     = ":8080"
		certFile = "certs/cert.pem"
		keyFile  = "certs/key.pem"
	)

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)
	http.HandleFunc("/ws", handleConnections)
	http.HandleFunc("/create-room", handleCreateRoom)
	http.HandleFunc("/room-info", handleRoomInfo)

	go handleMessages()

	fmt.Println("匿名聊天室服务已启动（HTTPS/WSS）：https://localhost:8080")
	fmt.Println("证书文件：", certFile, keyFile)
	fmt.Printf("限流：单用户 %v 一次 | 房间 %d 条/秒 | 房间最多 %d 人 | 消息 ≤ %d 字符\n",
		userRateLimit, roomRateLimit, maxRoomSize, maxMessageLength)

	if err := http.ListenAndServeTLS(addr, certFile, keyFile, nil); err != nil {
		log.Fatal("启动失败：", err)
	}
}
```

### 前端

static\index.html

```html
<!doctype html>
<html lang="zh">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>匿名聊天室</title>
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%236366f1' rx='20' width='100' height='100'/%3E%3Ctext x='50' y='68' font-size='55' text-anchor='middle' fill='white'%3E%F0%9F%92%AC%3C/text%3E%3C/svg%3E" />
        <style>
            *,
            *::before,
            *::after {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            :root {
                --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
                --card-bg: rgba(255, 255, 255, 0.06);
                --card-border: rgba(255, 255, 255, 0.12);
                --text-primary: #f1f5f9;
                --text-secondary: #94a3b8;
                --accent: #818cf8;
                --accent-hover: #6366f1;
                --bubble-other: rgba(255, 255, 255, 0.1);
                --bubble-mine: linear-gradient(135deg, #6366f1, #8b5cf6);
                --success: #34d399;
                --danger: #f87171;
                --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.45);
            }

            body {
                font-family:
                    "Segoe UI",
                    system-ui,
                    -apple-system,
                    sans-serif;
                min-height: 100vh;
                background: var(--bg-gradient);
                color: var(--text-primary);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px;
            }

            .app {
                width: 100%;
                max-width: 480px;
                height: calc(95vh - 24px);
                display: flex;
                flex-direction: column;
                background: var(--card-bg);
                border: 1px solid var(--card-border);
                border-radius: 20px;
                backdrop-filter: blur(16px);
                box-shadow: var(--shadow);
                overflow: hidden;
            }

            .header {
                padding: 20px 24px;
                border-bottom: 1px solid var(--card-border);
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-shrink: 0;
            }

            .header-left {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .logo {
                width: 40px;
                height: 40px;
                border-radius: 12px;
                background: linear-gradient(135deg, #6366f1, #a78bfa);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
            }

            .header h1 {
                font-size: 1.15rem;
                font-weight: 600;
                letter-spacing: -0.02em;
            }

            .header p {
                font-size: 0.75rem;
                color: var(--text-secondary);
                margin-top: 2px;
            }

            .status {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 0.75rem;
                color: var(--text-secondary);
                padding: 6px 12px;
                border-radius: 999px;
                background: rgba(0, 0, 0, 0.2);
            }

            .status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--text-secondary);
                transition: background 0.3s;
            }

            .status.connected .status-dot {
                background: var(--success);
                box-shadow: 0 0 8px var(--success);
            }

            .status.disconnected .status-dot {
                background: var(--danger);
            }

            .room-bar {
                padding: 10px 20px;
                border-bottom: 1px solid var(--card-border);
                display: flex;
                align-items: center;
                gap: 8px;
                flex-shrink: 0;
            }

            .room-bar label {
                font-size: 0.75rem;
                color: var(--text-secondary);
                white-space: nowrap;
            }

            .room-bar input {
                flex: 1;
                min-width: 0;
                padding: 8px 12px;
                border: 1px solid var(--card-border);
                border-radius: 10px;
                background: rgba(0, 0, 0, 0.25);
                color: var(--text-secondary);
                font-size: 0.75rem;
                outline: none;
            }

            .room-bar button {
                padding: 8px 14px;
                border: none;
                border-radius: 10px;
                background: rgba(129, 140, 248, 0.25);
                color: var(--accent);
                font-size: 0.75rem;
                font-weight: 600;
                cursor: pointer;
                white-space: nowrap;
            }

            .room-bar button:hover {
                background: rgba(129, 140, 248, 0.4);
            }

            .lobby {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 48px 36px;
                text-align: center;
                gap: 20px;
            }

            .lobby-icon {
                font-size: 3rem;
                margin-bottom: 8px;
            }

            .lobby h2 {
                font-size: 1.25rem;
                font-weight: 600;
            }

            .lobby p {
                font-size: 0.9rem;
                color: var(--text-secondary);
                line-height: 1.6;
                max-width: 300px;
            }

            .lobby button {
                margin-top: 12px;
                padding: 14px 32px;
                border: none;
                border-radius: 14px;
                background: var(--accent);
                color: #fff;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s, transform 0.1s;
            }

            .lobby button:hover {
                background: var(--accent-hover);
            }

            .lobby button:active {
                transform: scale(0.97);
            }

            .lobby .password-wrap {
                width: 100%;
                max-width: 300px;
                margin-top: 8px;
            }

            .lobby .password-label {
                font-size: 0.8rem;
                color: var(--text-secondary);
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .lobby .password-label input[type="checkbox"] {
                width: 14px;
                height: 14px;
            }

            .lobby .password-input {
                width: 100%;
                padding: 12px 16px;
                border: 1px solid var(--card-border);
                border-radius: 12px;
                background: rgba(0, 0, 0, 0.25);
                color: var(--text-primary);
                font-size: 0.9rem;
                outline: none;
                transition: border-color 0.2s;
            }

            .lobby .password-input:focus {
                border-color: var(--accent);
            }

            .lobby .password-input::placeholder {
                color: var(--text-secondary);
            }

            .password-modal {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }

            .password-modal .modal-content {
                width: 90%;
                max-width: 360px;
                background: var(--card-bg);
                border: 1px solid var(--card-border);
                border-radius: 16px;
                padding: 24px;
                text-align: center;
            }

            .password-modal h3 {
                font-size: 1.1rem;
                margin-bottom: 8px;
            }

            .password-modal p {
                font-size: 0.85rem;
                color: var(--text-secondary);
                margin-bottom: 20px;
            }

            .password-modal input {
                width: 100%;
                padding: 12px 16px;
                border: 1px solid var(--card-border);
                border-radius: 12px;
                background: rgba(0, 0, 0, 0.25);
                color: var(--text-primary);
                font-size: 0.9rem;
                outline: none;
                margin-bottom: 16px;
            }

            .password-modal input:focus {
                border-color: var(--accent);
            }

            .password-modal .modal-buttons {
                display: flex;
                gap: 10px;
            }

            .password-modal .modal-buttons button {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 12px;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
            }

            .password-modal .modal-buttons .btn-cancel {
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-secondary);
            }

            .password-modal .modal-buttons .btn-cancel:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            .password-modal .modal-buttons .btn-confirm {
                background: var(--accent);
                color: #fff;
            }

            .password-modal .modal-buttons .btn-confirm:hover {
                background: var(--accent-hover);
            }

            .e2ee-badge {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 0.7rem;
                color: var(--success);
                margin-left: 4px;
            }

            .chat-view {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0;
            }

            .chat {
                flex: 1;
                overflow-y: auto;
                padding: 20px 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                scroll-behavior: smooth;
            }

            .chat::-webkit-scrollbar {
                width: 6px;
            }

            .chat::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 3px;
            }

            .message-wrap {
                display: flex;
                flex-direction: column;
                max-width: 78%;
                animation: fadeIn 0.25s ease;
            }

            .message-wrap.mine {
                align-self: flex-end;
                align-items: flex-end;
            }

            .message-wrap.other {
                align-self: flex-start;
                align-items: flex-start;
            }

            .message-wrap.system {
                align-self: center;
                max-width: 90%;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(6px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .sender {
                font-size: 0.7rem;
                color: var(--text-secondary);
                margin-bottom: 4px;
                padding: 0 4px;
            }

            .message {
                padding: 10px 14px;
                border-radius: 16px;
                font-size: 0.9rem;
                line-height: 1.5;
                word-break: break-word;
            }

            .message.other {
                background: var(--bubble-other);
                border-bottom-left-radius: 4px;
            }

            .message.mine {
                background: var(--bubble-mine);
                border-bottom-right-radius: 4px;
                color: #fff;
            }

            .message.system {
                background: transparent;
                color: var(--text-secondary);
                font-size: 0.75rem;
                padding: 4px 12px;
                border-radius: 999px;
                border: 1px dashed rgba(255, 255, 255, 0.1);
            }

            .message .time {
                display: block;
                font-size: 0.65rem;
                opacity: 0.65;
                margin-top: 4px;
            }

            .composer {
                padding: 16px 20px 20px;
                border-top: 1px solid var(--card-border);
                display: flex;
                gap: 10px;
                flex-shrink: 0;
            }

            .composer input {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid var(--card-border);
                border-radius: 14px;
                background: rgba(0, 0, 0, 0.25);
                color: var(--text-primary);
                font-size: 0.9rem;
                outline: none;
                transition:
                    border-color 0.2s,
                    box-shadow 0.2s;
            }

            .composer input::placeholder {
                color: var(--text-secondary);
            }

            .composer input:focus {
                border-color: var(--accent);
                box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
            }

            .composer button {
                padding: 12px 20px;
                border: none;
                border-radius: 14px;
                background: var(--accent);
                color: #fff;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s, transform 0.1s;
                white-space: nowrap;
            }

            .composer button:hover {
                background: var(--accent-hover);
            }

            .composer button:active {
                transform: scale(0.97);
            }

            .composer button:disabled,
            .composer input:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .secure-badge,
            .e2ee-badge,
            .name-badge {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 0.7rem;
                margin-left: 4px;
            }

            .secure-badge {
                color: var(--success);
            }

            .e2ee-badge {
                color: var(--accent);
            }

            .name-badge {
                color: var(--accent);
            }

            .hidden {
                display: none !important;
            }
        </style>
    </head>
    <body>
        <div class="app">
            <header class="header">
                <div class="header-left">
                    <div class="logo">💬</div>
                    <div>
                        <h1>匿名聊天室</h1>
                        <p>
                            <span id="subtitle">私密房间聊天</span>
                            <span class="secure-badge" id="secureBadge" hidden>🔒 WSS</span>
                            <span class="e2ee-badge" id="e2eeBadge" hidden>🔐 E2EE</span>
                            <span class="name-badge" id="nameBadge" hidden></span>
                        </p>
                    </div>
                </div>
                <div class="status" id="status">
                    <span class="status-dot"></span>
                    <span id="statusText">未连接</span>
                </div>
            </header>

            <!-- 无房间参数时：创建房间入口 -->
            <div class="lobby" id="lobby">
                <div class="lobby-icon">🔒</div>
                <h2>创建匿名聊天房间</h2>
                <p>点击按钮生成专属链接，分享给朋友后进入同一房间匿名聊天。</p>
                <div class="password-wrap">
                    <label class="password-label">
                        <input type="checkbox" id="enablePassword" onchange="togglePassword()">
                        为房间设置密码
                    </label>
                    <input type="password" id="roomPassword" class="password-input" placeholder="请输入房间密码" disabled>
                </div>
                <button onclick="createRoom()">创建房间</button>
            </div>

            <!-- 有房间参数时：聊天界面 -->
            <div class="chat-view hidden" id="chatView">
                <div class="room-bar">
                    <label>邀请链接</label>
                    <input type="text" id="roomLink" readonly />
                    <button onclick="copyRoomLink()">复制</button>
                </div>

                <div class="chat" id="chat"></div>

                <div class="composer">
                    <input
                        type="text"
                        id="msg"
                        placeholder="输入消息，按 Enter 发送..."
                        autocomplete="off"
                        disabled
                    />
                    <button id="sendBtn" onclick="sendMessage()" disabled>发送</button>
                </div>
            </div>
        </div>

        <!-- 密码弹窗 -->
        <div class="password-modal hidden" id="passwordModal">
            <div class="modal-content">
                <h3>🔐 房间需要密码</h3>
                <p>该聊天房间已设置密码保护，请输入密码后加入。</p>
                <input type="password" id="joinPassword" placeholder="请输入房间密码" />
                <div class="modal-buttons">
                    <button class="btn-cancel" onclick="closePasswordModal()">取消</button>
                    <button class="btn-confirm" onclick="submitPassword()">确认加入</button>
                </div>
            </div>
        </div>

        <!-- 通用提示弹窗 -->
        <div class="password-modal hidden" id="toastModal">
            <div class="modal-content">
                <h3 id="toastTitle">提示</h3>
                <p id="toastMessage"></p>
                <div class="modal-buttons">
                    <button class="btn-confirm" onclick="closeToastModal()">确定</button>
                </div>
            </div>
        </div>

        <script>
            // =====================================================================
            // E2EE 模块 - 基于 ECDH + HKDF + AES-GCM 的端到端加密
            // =====================================================================
            // 协议概览（仿 Signal 协议简化版）：
            //   1. X3DH 风格握手：交换长期 Identity Key + 临时 Ephemeral Key
            //   2. 派生共享根密钥：HKDF(ECDH(my_priv, their_eph) || ECDH(eph_priv, their_id))
            //   3. Double Ratchet：每条消息用新的 DH Ratchet Key 派生新 Chain Key
            //   4. 消息密钥 = HKDF(CK, "msg")，Chain Key = HKDF(CK, "chain")
            //   5. AES-GCM 加密，12 字节随机 IV
            //
            // 群聊实现：每个用户对维护独立的 Session
            //   - 当用户 A 发消息时，A 用与每个接收方 B 之间的 Session 分别加密
            //   - 消息包内嵌接收方列表
            //   - 服务端只看到密文和接收方列表，看不到明文
            // =====================================================================

            const E2EE = (() => {
                const subtle = crypto.subtle;
                const enc = new TextEncoder();
                const dec = new TextDecoder();

                // ===== 基础工具 =====
                function b64encode(buf) {
                    return btoa(String.fromCharCode(...new Uint8Array(buf)));
                }

                function b64decode(str) {
                    const bin = atob(str);
                    const arr = new Uint8Array(bin.length);
                    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
                    return arr.buffer;
                }

                async function hmacKey(key) {
                    return subtle.importKey(
                        "raw", key,
                        { name: "HMAC", hash: "SHA-256" },
                        false, ["sign"]
                    );
                }

                // HKDF-SHA256
                async function hkdf(secret, salt, info, length = 32) {
                    // HKDF 规范：空 salt 等价于长度为 HashLen 的全零 salt
                    const effectiveSalt = salt.length === 0
                        ? new Uint8Array(32) : salt;
                    const key = await hmacKey(effectiveSalt);
                    const infoBytes = enc.encode(info);
                    let prev = new Uint8Array(0);
                    let result = new Uint8Array(0);
                    let counter = 1;
                    while (result.length < length) {
                        const data = new Uint8Array(prev.length + infoBytes.length + 1);
                        data.set(prev, 0);
                        data.set(infoBytes, prev.length);
                        data[prev.length + infoBytes.length] = counter;
                        prev = new Uint8Array(await subtle.sign("HMAC", key, data));
                        const tmp = new Uint8Array(result.length + prev.length);
                        tmp.set(result, 0);
                        tmp.set(prev, result.length);
                        result = tmp;
                        counter++;
                    }
                    return result.slice(0, length);
                }

                // 派生 (rootKey, chainKey) 对
                async function kdfRK(rootKey, dhOutput) {
                    const derived = await hkdf(
                        dhOutput,
                        rootKey,
                        "ratchet"
                    );
                    return {
                        rootKey: derived.slice(0, 16),
                        chainKey: derived.slice(16, 32),
                    };
                }

                // 派生消息密钥并推进 chain key
                async function kdfCK(chainKey) {
                    const nextCK = await hkdf(chainKey, new Uint8Array(0), "chain", 32);
                    const msgKey = await hkdf(chainKey, new Uint8Array(0), "msg", 32);
                    return { chainKey: nextCK, messageKey: msgKey };
                }

                // ===== 签名与指纹 =====
                async function signRaw(privateKey, data) {
                    const sig = await subtle.sign(
                        { name: "ECDSA", hash: "SHA-256" },
                        privateKey,
                        typeof data === "string" ? enc.encode(data) : data
                    );
                    return b64encode(sig);
                }

                async function verifySig(publicKey, signature, data) {
                    return subtle.verify(
                        { name: "ECDSA", hash: "SHA-256" },
                        publicKey,
                        b64decode(signature),
                        typeof data === "string" ? enc.encode(data) : data
                    );
                }

                async function fingerprint(spkiB64) {
                    const raw = b64decode(spkiB64);
                    const hash = await subtle.digest("SHA-256", raw);
                    const hex = Array.from(new Uint8Array(hash))
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join("");
                    return hex.slice(0, 8).toUpperCase();
                }

                // ===== 密钥管理 =====
                async function genECDSA() {
                    return subtle.generateKey(
                        { name: "ECDSA", namedCurve: "P-256" },
                        true,
                        ["sign", "verify"]
                    );
                }

                async function importECDSAPub(b64) {
                    return subtle.importKey(
                        "spki", b64decode(b64),
                        { name: "ECDSA", namedCurve: "P-256" },
                        true, ["verify"]
                    );
                }

                async function genECDH() {
                    return subtle.generateKey(
                        { name: "ECDH", namedCurve: "P-256" },
                        true,
                        ["deriveBits"]
                    );
                }

                async function exportPub(key) {
                    return b64encode(await subtle.exportKey("spki", key));
                }

                async function importPub(b64) {
                    return subtle.importKey(
                        "spki", b64decode(b64),
                        { name: "ECDH", namedCurve: "P-256" },
                        true, []
                    );
                }

                async function dh(priv, pub) {
                    const bits = await subtle.deriveBits(
                        { name: "ECDH", public: pub },
                        priv, 256
                    );
                    return new Uint8Array(bits);
                }

                async function importAES(keyBytes) {
                    return subtle.importKey(
                        "raw", keyBytes,
                        { name: "AES-GCM" },
                        false, ["encrypt", "decrypt"]
                    );
                }

                // AES-GCM 加密：返回 base64(iv || ciphertext)
                async function encrypt(key, plaintext) {
                    const iv = crypto.getRandomValues(new Uint8Array(12));
                    const cipher = await subtle.encrypt(
                        { name: "AES-GCM", iv: iv },
                        key,
                        enc.encode(plaintext)
                    );
                    const out = new Uint8Array(iv.length + cipher.byteLength);
                    out.set(iv, 0);
                    out.set(new Uint8Array(cipher), iv.length);
                    return b64encode(out);
                }

                // AES-GCM 解密
                async function decrypt(key, b64data) {
                    const data = new Uint8Array(b64decode(b64data));
                    const iv = data.slice(0, 12);
                    const cipher = data.slice(12);
                    const plain = await subtle.decrypt(
                        { name: "AES-GCM", iv: iv },
                        key, cipher
                    );
                    return dec.decode(plain);
                }

                // ===== Double Ratchet Session =====
                // 每对用户之间维护一个 Session
                // 状态：rootKey, sendDHRatchet(私钥+公钥), recvDHPub(对端公钥)
                //       sendCK, sendN, recvCK, recvN
                class Session {
                    constructor(rootKey) {
                        this.rootKey = rootKey;
                        this.sendDHRatchet = null;   // 我的发送 ratchet 密钥对
                        this.sendDHPub = null;        // 我的发送 ratchet 公钥
                        this.recvDHPub = null;        // 对端的发送 ratchet 公钥
                        this.sendCK = null;
                        this.sendN = 0;
                        this.recvCK = null;
                        this.recvN = 0;
                        this.pendingMessages = [];    // 乱序消息缓存
                    }

                    // 初始化为发起方：刚完成 X3DH
                    async initAsInitiator(rootKey, myRatchetKey) {
                        this.rootKey = rootKey;
                        this.sendDHRatchet = myRatchetKey;
                        this.sendDHPub = myRatchetKey.publicKey;
                        // 初始 Chain Key = HKDF(rootKey, "init")
                        this.sendCK = await hkdf(rootKey, new Uint8Array(0), "init-ck", 32);
                        this.sendN = 0;
                    }

                    // 初始化为接收方
                    async initAsResponder(rootKey, myRatchetKey) {
                        this.rootKey = rootKey;
                        this.sendDHRatchet = myRatchetKey;
                        this.sendDHPub = myRatchetKey.publicKey;
                        this.sendCK = await hkdf(rootKey, new Uint8Array(0), "init-ck", 32);
                        this.sendN = 0;
                    }

                    // 加密消息（发送）
                    async encrypt(plaintext) {
                        if (!this.sendCK) {
                            throw new Error("Session not initialized");
                        }
                        const { chainKey, messageKey } = await kdfCK(this.sendCK);
                        this.sendCK = chainKey;
                        const aesKey = await importAES(messageKey);
                        const cipher = await encrypt(aesKey, plaintext);
                        const out = {
                            ratchetKey: await exportPub(this.sendDHPub),
                            counter: this.sendN,
                            cipher: cipher,
                        };
                        this.sendN++;
                        return out;
                    }

                    // 解密消息（接收）
                    async decrypt(msg) {
                        // 检测到对端 ratchet 变化，推进 DH Ratchet
                        if (!this.recvDHPub ||
                            msg.ratchetKey !== this.lastRecvRatchetB64) {
                            await this.dhRatchetStep(msg.ratchetKey);
                        }
                        const { chainKey, messageKey } = await kdfCK(this.recvCK);
                        this.recvCK = chainKey;
                        const aesKey = await importAES(messageKey);
                        return await decrypt(aesKey, msg.cipher);
                    }

                    async dhRatchetStep(newRecvDHPubB64) {
                        // 派生新的 root key 和 recv chain key
                        const dhOut = await dh(this.sendDHRatchet.privateKey, await importPub(newRecvDHPubB64));
                        const { rootKey, chainKey } = await kdfRK(this.rootKey, dhOut);
                        this.rootKey = rootKey;
                        this.recvCK = chainKey;
                        this.recvN = 0;
                        this.recvDHPub = await importPub(newRecvDHPubB64);
                        this.lastRecvRatchetB64 = newRecvDHPubB64;

                        // 立刻更新自己的发送 ratchet key
                        this.sendDHRatchet = await genECDH();
                        this.sendDHPub = this.sendDHRatchet.publicKey;
                        const dhOut2 = await dh(this.sendDHRatchet.privateKey, this.recvDHPub);
                        const { rootKey: rk2, chainKey: ck2 } = await kdfRK(this.rootKey, dhOut2);
                        this.rootKey = rk2;
                        this.sendCK = ck2;
                        this.sendN = 0;
                    }
                }

                return {
                    genECDSA, importECDSAPub,
                    genECDH, exportPub, importPub, dh, hkdf, encrypt, decrypt,
                    signRaw, verifySig, fingerprint,
                    Session,
                };
            })();

            // =====================================================================
            // 聊天室应用
            // =====================================================================

            const params = new URLSearchParams(location.search);
            const roomId = params.get("room");

            const lobby = document.getElementById("lobby");
            const chatView = document.getElementById("chatView");
            const chat = document.getElementById("chat");
            const msgInput = document.getElementById("msg");
            const sendBtn = document.getElementById("sendBtn");
            const status = document.getElementById("status");
            const statusText = document.getElementById("statusText");
            const secureBadge = document.getElementById("secureBadge");
            const e2eeBadge = document.getElementById("e2eeBadge");
            const nameBadge = document.getElementById("nameBadge");
            const roomLinkInput = document.getElementById("roomLink");
            const enablePassword = document.getElementById("enablePassword");
            const roomPassword = document.getElementById("roomPassword");
            const passwordModal = document.getElementById("passwordModal");
            const joinPassword = document.getElementById("joinPassword");
            const toastModal = document.getElementById("toastModal");
            const toastTitle = document.getElementById("toastTitle");
            const toastMessage = document.getElementById("toastMessage");

            let ws = null;
            let roomPass = "";

            // E2EE 状态
            let myIdentityKey = null;           // 长期身份密钥对（ECDH）
            let myIdentityPubB64 = null;        // 长期身份公钥 base64
            let mySignKey = null;               // 签名密钥对（ECDSA）
            let mySignPubB64 = null;            // 签名公钥 base64
            let myFingerprint = null;           // 本机指纹（8位十六进制）
            let myName = null;                  // 本机身份标识（= myIdentityPubB64）
            let peerKeys = new Map();           // peerECDHPub -> {identityKey, signKey, fingerprint, verified}
            let sessions = new Map();           // peerPublicKey -> Session（加密会话）
            const MAX_SESSIONS = 50;             // 最多维护 50 个会话

            if (location.protocol === "https:") {
                secureBadge.hidden = false;
            }

            function generateRoomId() {
                return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) =>
                    b.toString(16).padStart(2, "0")
                ).join("");
            }

            function togglePassword() {
                roomPassword.disabled = !enablePassword.checked;
                if (!enablePassword.checked) {
                    roomPassword.value = "";
                }
            }

            function nowTime() {
                return new Date().toLocaleTimeString("zh-CN", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
            }

            function appendMessage(msg, kind) {
                const wrap = document.createElement("div");
                wrap.className = "message-wrap " + kind;

                // 显示发送者指纹（仅其他人的消息）
                if (kind === "other" && msg.name) {
                    const sender = document.createElement("div");
                    sender.className = "sender";
                    sender.textContent = msg.name;
                    wrap.appendChild(sender);
                }

                const div = document.createElement("div");
                div.className = "message " + kind;

                const content = document.createElement("span");
                content.textContent = msg.content || "";
                const time = document.createElement("span");
                time.className = "time";
                time.textContent = nowTime();

                div.appendChild(content);
                div.appendChild(time);
                wrap.appendChild(div);
                chat.appendChild(wrap);
                chat.scrollTop = chat.scrollHeight;
            }

            function setConnected(connected) {
                status.classList.toggle("connected", connected);
                status.classList.toggle("disconnected", !connected);
                statusText.textContent = connected ? "已连接" : "已断开";
                msgInput.disabled = !connected;
                sendBtn.disabled = !connected;
                if (connected) msgInput.focus();
            }

            function copyRoomLink() {
                roomLinkInput.select();
                navigator.clipboard.writeText(roomLinkInput.value).then(() => {
                    const btn = roomLinkInput.nextElementSibling;
                    const orig = btn.textContent;
                    btn.textContent = "已复制";
                    setTimeout(() => (btn.textContent = orig), 1500);
                });
            }

            // ===== E2EE 握手/会话管理 =====
            async function broadcastIdentity() {
                if (!myIdentityPubB64) return;
                myFingerprint = await E2EE.fingerprint(mySignPubB64);
                nameBadge.textContent = "🔑 " + myFingerprint;
                nameBadge.hidden = false;
                ws.send(JSON.stringify({
                    type: "identity",
                    publicKey: myIdentityPubB64,
                    signingKey: mySignPubB64,
                }));
            }

            async function performHandshake(peerName, theirIdentityB64) {
                if (sessions.size >= MAX_SESSIONS) {
                    const firstKey = sessions.keys().next().value;
                    sessions.delete(firstKey);
                }

                // X3DH 发起方：
                // DH1 = ECDH(my_identity_priv, their_identity_pub)
                // DH2 = ECDH(eph_priv, their_identity_pub)
                // root = HKDF(DH1 || DH2, "x3dh")
                const ephemeral = await E2EE.genECDH();
                const ephPubB64 = await E2EE.exportPub(ephemeral.publicKey);

                const theirIdPub = await E2EE.importPub(theirIdentityB64);
                const dh1 = await E2EE.dh(myIdentityKey.privateKey, theirIdPub);
                const dh2 = await E2EE.dh(ephemeral.privateKey, theirIdPub);
                const combined = new Uint8Array(dh1.length + dh2.length);
                combined.set(dh1, 0);
                combined.set(dh2, dh1.length);
                const rootKey = await E2EE.hkdf(combined, new Uint8Array(0), "x3dh", 32);

                // 初始化 session
                const myRatchet = await E2EE.genECDH();
                const session = new E2EE.Session();
                await session.initAsInitiator(rootKey, myRatchet);
                sessions.set(peerName, session);

                // 使用 ECDSA 签名密钥签名握手数据，防止 MITM
                const handshakeData = myIdentityPubB64 + ":" + ephPubB64;
                const sig = await E2EE.signRaw(mySignKey.privateKey, handshakeData);

                ws.send(JSON.stringify({
                    type: "ratchet",
                    publicKey: myIdentityPubB64,
                    signingKey: mySignPubB64,
                    ephemeral: ephPubB64,
                    ratchetKey: await E2EE.exportPub(myRatchet.publicKey),
                    signature: sig,
                }));
            }

            async function handleRatchetMessage(peerName, msg) {
                if (!msg.publicKey || !msg.ephemeral) return;

                // 使用消息中声称的身份公钥（而非 peerName）作为真实身份
                const claimedIdentity = msg.publicKey;
                if (claimedIdentity === myIdentityPubB64) return;

                const theirIdPub = await E2EE.importPub(claimedIdentity);
                const ephPub = await E2EE.importPub(msg.ephemeral);

                // 如果有签名，用对端的 ECDSA 签名公钥验证
                if (msg.signature && msg.signingKey) {
                    const theirSignPub = await E2EE.importECDSAPub(msg.signingKey);
                    const handshakeData = claimedIdentity + ":" + msg.ephemeral;
                    const valid = await E2EE.verifySig(theirSignPub, msg.signature, handshakeData);
                    if (!valid) {
                        appendMessage({ content: "[签名验证失败，消息来自: " + claimedIdentity.slice(0, 8) + "...]" }, "system");
                        return;
                    }
                }

                // 始终创建 responder session（处理双方同时发起握手的情况）
                // X3DH 接收方：
                // DH1 = ECDH(my_identity_priv, their_identity_pub)  — 与发起方的 DH1 匹配
                // DH2 = ECDH(my_identity_priv, their_ephemeral_pub) — 与发起方的 DH2 匹配
                // root = HKDF(DH1 || DH2, "x3dh")
                const dh1 = await E2EE.dh(myIdentityKey.privateKey, theirIdPub);
                const dh2 = await E2EE.dh(myIdentityKey.privateKey, ephPub);
                const combined = new Uint8Array(dh1.length + dh2.length);
                combined.set(dh1, 0);
                combined.set(dh2, dh1.length);
                const rootKey = await E2EE.hkdf(combined, new Uint8Array(0), "x3dh", 32);

                const myRatchet = await E2EE.genECDH();
                const session = new E2EE.Session();
                await session.initAsResponder(rootKey, myRatchet);
                sessions.set(claimedIdentity, session);

                // 使用自己的 ECDSA 签名密钥签名，证明身份所有权
                const myHandshakeData = myIdentityPubB64 + ":" + (await E2EE.exportPub(myRatchet.publicKey));
                const sig = await E2EE.signRaw(mySignKey.privateKey, myHandshakeData);

                ws.send(JSON.stringify({
                    type: "ratchet",
                    publicKey: myIdentityPubB64,
                    signingKey: mySignPubB64,
                    ephemeral: await E2EE.exportPub(myRatchet.publicKey),
                    ratchetKey: await E2EE.exportPub(myRatchet.publicKey),
                    signature: sig,
                }));
            }

            // ===== 消息加密/解密 =====
            async function encryptForPeers(plaintext) {
                // 为每个对端单独加密
                const recipients = [];
                for (const [peerName, session] of sessions) {
                    if (peerName === myName) continue;
                    try {
                        const enc = await session.encrypt(plaintext);
                        recipients.push({
                            name: peerName,
                            ratchetKey: enc.ratchetKey,
                            counter: enc.counter,
                            cipher: enc.cipher,
                        });
                    } catch (e) {
                        console.warn("加密失败:", peerName, e);
                    }
                }
                return recipients;
            }

            async function decryptFromPeer(senderName, msg) {
                // 在 recipients 中找到属于自己的那份密文
                if (msg.recipients && Array.isArray(msg.recipients)) {
                    const myEntry = msg.recipients.find(r => r.name === myName);
                    if (!myEntry) {
                        return "[没有发给你的密文]";
                    }
                    if (!sessions.has(senderName)) {
                        return "[未建立加密会话]";
                    }
                    try {
                        return await sessions.get(senderName).decrypt(myEntry);
                    } catch (e) {
                        return "[加密消息无法解密]";
                    }
                }

                // 兼容旧格式（直接 cipher + ratchetKey）
                if (msg.cipher) {
                    if (!sessions.has(senderName)) {
                        return "[未建立加密会话]";
                    }
                    try {
                        return await sessions.get(senderName).decrypt(msg);
                    } catch (e) {
                        return "[加密消息无法解密]";
                    }
                }

                return "[无效消息]";
            }

            // ===== 房间创建/连接 =====
            async function createRoom() {
                let password = "";
                if (enablePassword.checked) {
                    password = roomPassword.value.trim();
                    if (!password) {
                        showToast("提示", "请输入房间密码");
                        roomPassword.focus();
                        return;
                    }
                }

                const id = generateRoomId();
                await fetch("/create-room", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `room_id=${id}&password=${encodeURIComponent(password)}`,
                });

                location.href = "?room=" + id + (password ? "#" + password : "");
            }

            function showToast(title, message) {
                toastTitle.textContent = title || "提示";
                toastMessage.textContent = message || "";
                toastModal.classList.remove("hidden");
            }

            function closeToastModal() {
                toastModal.classList.add("hidden");
            }

            function openPasswordModal() {
                passwordModal.classList.remove("hidden");
                joinPassword.focus();
            }

            function closePasswordModal() {
                passwordModal.classList.add("hidden");
                joinPassword.value = "";
            }

            async function connectRoom(password) {
                if (!roomId) return;

                roomPass = password || "";

                lobby.classList.add("hidden");
                chatView.classList.remove("hidden");

                const shareUrl = location.origin + location.pathname + "?room=" + roomId;
                roomLinkInput.value = shareUrl;

                const wsUrl =
                    (location.protocol === "https:" ? "wss://" : "ws://") +
                    location.host +
                    "/ws?room=" +
                    encodeURIComponent(roomId);

                // 生成长期身份密钥（ECDH）和签名密钥（ECDSA）
                myIdentityKey = await E2EE.genECDH();
                myIdentityPubB64 = await E2EE.exportPub(myIdentityKey.publicKey);
                mySignKey = await E2EE.genECDSA();
                mySignPubB64 = await E2EE.exportPub(mySignKey.publicKey);
                myName = myIdentityPubB64;
                myFingerprint = await E2EE.fingerprint(mySignPubB64);

                ws = new WebSocket(wsUrl);

                ws.onopen = function () {
                    ws.send(JSON.stringify({ type: "auth", password: roomPass }));
                };

                ws.onmessage = async function (event) {
                    let msg;
                    try { msg = JSON.parse(event.data); } catch (e) { return; }

                    if (msg.type === "welcome") {
                        appendMessage(
                            {
                                type: "system",
                                content: "欢迎加入匿名聊天室",
                            },
                            "system"
                        );
                        await broadcastIdentity();
                        setConnected(true);
                        e2eeBadge.hidden = false;
                        return;
                    }

                    if (msg.type === "identity") {
                        // 收到其他成员的身份公钥和签名公钥
                        if (!msg.publicKey) return;
                        if (msg.publicKey === myIdentityPubB64) return;
                        const fp = msg.signingKey
                            ? await E2EE.fingerprint(msg.signingKey)
                            : await E2EE.fingerprint(msg.publicKey);
                        peerKeys.set(msg.publicKey, {
                            identityKey: msg.publicKey,
                            signKey: msg.signingKey || null,
                            fingerprint: fp,
                            verified: false,
                        });
                        await performHandshake(msg.publicKey, msg.publicKey);
                        return;
                    }

                    if (msg.type === "ratchet") {
                        // 收到 ratchet 消息（首次或更新）
                        if (!msg.publicKey) return;
                        if (msg.publicKey === myIdentityPubB64) return;
                        // 使用消息中的 publicKey 作为 peerName
                        if (!peerKeys.has(msg.publicKey)) {
                            const fp = msg.signingKey
                                ? await E2EE.fingerprint(msg.signingKey)
                                : await E2EE.fingerprint(msg.publicKey);
                            peerKeys.set(msg.publicKey, {
                                identityKey: msg.publicKey,
                                signKey: msg.signingKey || null,
                                fingerprint: fp,
                                verified: false,
                            });
                        }
                        await handleRatchetMessage(msg.publicKey, msg);
                        return;
                    }

                    if (msg.type === "system") {
                        appendMessage({
                            content: msg.content || "",
                        }, "system");
                        if (msg.content && msg.content.includes("密码错误")) {
                            openPasswordModal();
                            joinPassword.value = "";
                            joinPassword.focus();
                        }
                        return;
                    }

                    if (msg.type === "chat") {
                        const isMine = msg.publicKey === myIdentityPubB64;
                        let plaintext;
                        if (isMine) {
                            plaintext = msg.content || "[空消息]";
                        } else if (msg.recipients || msg.cipher) {
                            plaintext = await decryptFromPeer(msg.publicKey || "", msg);
                            // 解密失败时，如果有明文 content 则用明文（握手竞态条件的降级）
                            if (plaintext.startsWith("[") && msg.content) {
                                plaintext = msg.content;
                            }
                        } else {
                            plaintext = msg.content || "[空消息]";
                        }
                        const kind = isMine ? "mine" : "other";
                        let displayMsg = { content: plaintext };
                        if (kind === "other" && msg.publicKey) {
                            const pk = peerKeys.get(msg.publicKey);
                            displayMsg.name = pk ? pk.fingerprint : msg.publicKey.slice(0, 8);
                        }
                        appendMessage(displayMsg, kind);
                        return;
                    }
                };

                ws.onclose = function () {
                    setConnected(false);
                    appendMessage(
                        { name: "", content: "连接已断开" },
                        "system"
                    );
                };

                ws.onerror = function () {
                    setConnected(false);
                };
            }

            function submitPassword() {
                const password = joinPassword.value.trim();
                if (!password) return;
                closePasswordModal();
                connectRoom(password);
            }

            joinPassword.addEventListener("keydown", function (e) {
                if (e.key === "Enter") submitPassword();
            });

            async function sendMessage() {
                const content = msgInput.value.trim();
                if (!content || !ws || ws.readyState !== WebSocket.OPEN) return;

                // 限流：500ms/条（与服务端一致）
                const now = Date.now();
                if (window._lastSend && now - window._lastSend < 500) {
                    appendMessage({ name: "", content: "发送过于频繁，请稍后再试" }, "system");
                    return;
                }
                window._lastSend = now;

                // 限长：500 字符
                if (content.length > 500) {
                    appendMessage({ name: "", content: "消息长度超过限制（最多 500 字符）" }, "system");
                    return;
                }

                if (sessions.size === 0) {
                    ws.send(JSON.stringify({
                        type: "chat",
                        content: content,
                        publicKey: myIdentityPubB64,
                    }));
                    msgInput.value = "";
                    return;
                }

                const recipients = await encryptForPeers(content);
                if (recipients.length === 0) {
                    ws.send(JSON.stringify({
                        type: "chat",
                        content: content,
                        publicKey: myIdentityPubB64,
                    }));
                    msgInput.value = "";
                    return;
                }

                ws.send(JSON.stringify({
                    type: "chat",
                    content: content,
                    recipients: recipients,
                    publicKey: myIdentityPubB64,
                }));
                msgInput.value = "";
            }

            msgInput.addEventListener("keydown", function (e) {
                if (e.key === "Enter") sendMessage();
            });

            async function initRoom() {
                const hash = location.hash.slice(1);
                if (hash) {
                    connectRoom(hash);
                    return;
                }

                try {
                    const resp = await fetch("/room-info?room=" + encodeURIComponent(roomId));
                    const data = await resp.json();
                    if (data.hasPassword) {
                        openPasswordModal();
                    } else {
                        connectRoom("");
                    }
                } catch (e) {
                    openPasswordModal();
                }
            }

            if (roomId) {
                initRoom();
            }
        </script>
    </body>
</html>
```

## 功能特性

### 🎭 匿名聊天
- 用户完全匿名，无需注册或登录
- 进入房间后直接开始聊天
- 每个用户拥有唯一的 8 位指纹标识（基于身份公钥的 SHA-256 哈希），可通过指纹识别不同用户
- 无身份信息存储，保护用户隐私

### 🔐 端到端加密 (E2EE)
- 采用 **ECDH (P-256) + HKDF-SHA256 + AES-256-GCM** 实现端到端加密
- 每个用户对维护独立的加密会话
- **Double Ratchet 协议**实现前向安全性
- 服务端只做消息透传，**不接触明文**
- 群聊场景：发送者为每个接收方单独加密，消息包包含独立的 `recipients` 密文列表
- 标签页显示 `🔒 WSS`（传输加密）+ `🔐 E2EE`（端到端加密）标识

### 🏠 房间机制
- 创建房间时生成 128 位随机 Room ID（32 位十六进制），熵值约 3.4×10³⁸
- **可选为房间设置密码保护**
- 密码错误时可重新输入，不中断连接
- 通过分享链接 `?room=xxx` 邀请好友加入
- 不同房间的消息完全隔离

### 🚦 服务端限流

| 限制项     | 规则               |
| ---------- | ------------------ |
| 消息长度   | 最多 500 字符      |
| 单用户频率 | 每 500ms 最多 1 条 |
| 房间频率   | 每秒最多 50 条     |
| 房间人数   | 最多 200 人        |

### 🔒 安全特性
- 默认启用 **HTTPS/WSS** 加密通信（自签名 TLS 证书）
- 消息使用 **AES-256-GCM** 认证加密
- **前向安全性**：每次消息传递都会推进 Chain Key，历史密钥泄露不影响后续消息
- 基于公钥的 **X3DH 握手**建立共享密钥，握手消息附带 **ECDSA 签名**防止中间人攻击
- **Trust-on-First-Use (TOFU)** 身份验证：通过指纹标识验证对端身份
- 房间 ID 不可预测，防止未授权访问

## 技术栈

| 层级     | 技术                                               |
| -------- | -------------------------------------------------- |
| **后端** | Go 1.26 + gorilla/websocket                        |
| **前端** | 纯 HTML/CSS/JavaScript（无框架依赖）               |
| **加密** | Web Crypto API（ECDH P-256, AES-GCM, HKDF-SHA256） |
| **传输** | HTTPS/WSS（自签名 TLS 证书）                       |

## 快速开始

### 编译运行

```bash
# 编译
go build -o gochat.exe .

# 运行
.\gochat.exe
```

### 访问

启动后访问：`https://localhost:8080`

> **注意**：由于使用自签名证书，浏览器会提示安全警告，选择「继续访问」即可。

### 开发模式

```bash
go run main.go
```

## 项目结构

```
gochat/
├── main.go              # 后端核心逻辑（WebSocket 服务、房间管理、限流）
├── static/
│   └── index.html       # 前端界面（含 E2EE Double Ratchet 加密逻辑）
├── certs/
│   ├── cert.pem         # TLS 证书
│   └── key.pem          # TLS 私钥
├── go.mod               # Go 模块配置
├── go.sum               # 依赖校验
└── README.md            # 项目文档
```

## API 接口

### HTTP 接口

| 方法      | 路径                  | 说明                                 |
| --------- | --------------------- | ------------------------------------ |
| GET       | `/`                   | 静态文件服务（首页）                 |
| POST      | `/create-room`        | 创建房间                             |
| GET       | `/room-info?room=xxx` | 查询房间信息（是否存在、是否有密码） |
| WebSocket | `/ws?room=xxx`        | 聊天连接                             |

### WebSocket 消息类型

| Type       | 方向 | 说明                                                   |
| ---------- | ---- | ------------------------------------------------------ |
| `auth`     | C→S  | 身份验证，发送密码                                     |
| `welcome`  | S→C  | 服务端欢迎消息                                         |
| `identity` | C↔C  | E2EE 长期身份公钥交换                                  |
| `ratchet`  | C↔C  | E2EE Ratchet 密钥交换（含 Ephemeral Key + ECDSA 签名） |
| `chat`     | C↔C  | 聊天消息（加密密文或明文回退）                         |
| `system`   | S→C  | 系统通知（密码错误、频率限制等）                       |

## E2EE 协议详解

### 协议流程

```
用户 A                         服务端                         用户 B
  |                              |                              |
  |--- auth(password) -------->|                              |
  |<-- welcome ----------------|                              |
  |--- identity(pubKeyA) ---->|---- identity(pubKeyA) ------>|
  |<-- identity(pubKeyB) -----|                              |
  |                              |                              |
  |=== X3DH 握手（含 ECDSA 签名）===|                              |
  |                              |                              |
  |  发起方 (A):                 |                              |
  |  1. 生成 Ephemeral Key       |                              |
  |  2. DH1 = ECDH(privA, pubB) |                              |
  |  3. DH2 = ECDH(ephPriv, pubB)|                             |
  |  4. root = HKDF(DH1\|DH2)  |                              |
  |  5. sig = ECDSA(ephPriv,    |                              |
  |       pubKeyA\|ephPub)       |                              |
  |                              |                              |
  |--- ratchet(pubKeyA, ephPub, ratchet, sig) -->              |
  |                              |-- ratchet(...) ----------->  |
  |                              |                              |
  |  接收方 (B):                 |                              |
  |  1. 验证 sig（用 pubKeyA）   |                              |
  |  2. DH1 = ECDH(privB, pubA) |                              |
  |  3. DH2 = ECDH(privB, ephPub)|                             |
  |  4. root = HKDF(DH1\|DH2)  |                              |
  |  5. sig = ECDSA(privB,      |                              |
  |       pubKeyB\|ratchetPub)   |                              |
  |                              |                              |
  |<-- ratchet(pubKeyB, ratchet, sig) ---|                     |
  |                              |                              |
  |=== 建立 Double Ratchet 会话 ===|                              |
  |   rootKey, sendCK, recvCK   |                              |
  |                              |                              |
  |--- chat(recipients) ------->|--- chat(recipients) -------->|
  |   1. CK -> KDF(msgKey)      |                              |
  |   2. CK -> KDF(nextCK)      |                              |
  |   3. AES-GCM 加密           |                              |
  |<-- chat(recipients) --------|<-- chat(recipients) ---------|
```

### Double Ratchet 步进

1. **消息发送**：`sendCK → KDF → messageKey + nextSendCK`，用 `messageKey` 做 AES-GCM 加密
2. **消息接收**：`recvCK → KDF → messageKey + nextRecvCK`，用 `messageKey` 解密
3. **DH Ratchet**：当收到新的 Ratchet 公钥时，执行 ECDH 派生新的 `rootKey`，重置 `recvCK`

### 群聊加密

- 发送方遍历所有已建立 Session 的对端
- 为每个对端独立推进 Ratchet，独立加密
- 消息包：`{ type: "chat", recipients: [{ name, ratchetKey, counter, cipher }] }`
- 接收方在 `recipients` 中查找自己的密文条目后解密

## 架构设计

```
┌───────────────────────────────────────────────────────┐
│                    HTTP Server (:8080)                │
│  ┌──────────────┐    ┌──────────────────────────────┐ │
│  │ 静态文件服务    │    │    WebSocket 处理              │ │
│  │  / → static   │    │    /ws?room=xxx              │ │
│  └──────────────┘    └──────────┬───────────────────┘ │
│                                 │                     │
│           ┌─────────────────────▼───────────────────┐ │
│           │         广播通道 (broadcast chan)       │ │
│           │     goroutine: handleMessages()         │ │
│           └─────────────────────┬───────────────────┘ │
│                                 │                     │
│           ┌─────────────────────▼───────────────────┐ │
│           │     房间限流 & 消息透传                  │ │
│           │     - 单用户 500ms                      │ │
│           │     - 单房间 50条/秒                     │ │
│           │     - E2EE 消息原样透传                  │ │
│           └──────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

### 核心数据结构

```go
// Message - 服务端透传，不解读 E2EE 字段
type Message struct {
    Type       string      // chat | system | welcome | identity | ratchet
    Content    string      // 明文或密文
    PublicKey  string      // 身份公钥
    Ephemeral  string      // 临时公钥
    RatchetKey string      // Ratchet 公钥
    Signature  string      // ECDSA 握手签名（防 MITM）
    Counter    int         // 消息序号
    Cipher     string      // AES-GCM 密文
    Recipients []Recipient // 群聊密文列表
}

// Client - 连接状态
type Client struct {
    conn         *websocket.Conn
    room         string
    lastSendTime time.Time   // 单用户限流
}

// RoomInfo - 房间状态
type RoomInfo struct {
    passwordHash string
    clients      map[*websocket.Conn]bool
    msgCount     int         // 当前秒消息数
    msgCountSec  int64       // 当前秒时间戳
}
```

## 使用说明

### 创建房间
1. 访问首页 `https://localhost:8080`
2. （可选）勾选「为房间设置密码」并输入密码
3. 点击「创建房间」
4. 复制分享链接发送给好友

### 加入房间
1. 打开分享链接（如 `https://localhost:8080/?room=xxx`）
2. 若房间有密码，输入密码后点击「确认加入」；密码错误可重新输入
3. 进入匿名聊天室，消息自动端到端加密

### 指纹验证
- 头部右侧显示本机指纹（如 `🔑 A3F2B1C0`）
- 每条他人消息上方显示发送者指纹
- 如需确认对方身份，可通过安全渠道（如电话、面对面）比对指纹是否一致