## http服务器

### 简介

这是一个轻量级、类似 nginx 的 C++ 静态文件服务器（严格模式版本）的http程序，支持win7、win10、win11等windows环境，可定义端口，自动help

### 代码

server.cpp

```c++
#include <winsock2.h>
#include <ws2tcpip.h>
#include <windows.h>
#include <cstdio>
#include <cstring>
#include <cstdlib>

#pragma comment(lib, "Ws2_32.lib")

#define DEFAULT_PORT 8080

// ================= help =================
void printHelp() {
    printf("Mini Nginx C++ Server\n\n");
    printf("Usage:\n");
    printf("  server.exe [--port PORT]\n");
    printf("  server.exe --help\n\n");
    printf("Options:\n");
    printf("  --port <PORT>   Set server port (default 8080)\n");
}

// ================= LAN IP =================
void getLocalIP(char* out) {
    SOCKET sock = socket(AF_INET, SOCK_DGRAM, 0);
    if (sock == INVALID_SOCKET) {
        strcpy(out, "");
        return;
    }

    sockaddr_in remote{};
    remote.sin_family = AF_INET;
    remote.sin_port = htons(80);
    inet_pton(AF_INET, "8.8.8.8", &remote.sin_addr);

    connect(sock, (sockaddr*)&remote, sizeof(remote));

    sockaddr_in local{};
    int len = sizeof(local);
    getsockname(sock, (sockaddr*)&local, &len);

    inet_ntop(AF_INET, &local.sin_addr, out, INET_ADDRSTRLEN);

    closesocket(sock);
}

// ================= 严格参数解析 =================
int parseArgs(int argc, char* argv[]) {
    int port = DEFAULT_PORT;

    for (int i = 1; i < argc; i++) {

        // help
        if (strcmp(argv[i], "--help") == 0) {
            printHelp();
            exit(0);
        }

        // port
        if (strcmp(argv[i], "--port") == 0) {

            if (i + 1 >= argc) {
                printf("ERROR: missing value for --port\n\n");
                printHelp();
                exit(1);
            }

            port = atoi(argv[i + 1]);

            if (port <= 0 || port > 65535) {
                printf("ERROR: invalid port number\n\n");
                printHelp();
                exit(1);
            }

            i++; // skip value
            continue;
        }

        // ❌ strict rule: unknown argument = exit
        printf("ERROR: unknown argument: %s\n\n", argv[i]);
        printHelp();
        exit(1);
    }

    return port;
}

// ================= send =================
void sendAll(SOCKET c, const char* data) {
    send(c, data, (int)strlen(data), 0);
}

// ================= parse path =================
void parsePath(char* buf, char* path) {
    char* p = strstr(buf, "GET ");
    if (!p) {
        strcpy(path, "/");
        return;
    }

    p += 4;
    char* end = strstr(p, " HTTP/");
    if (!end) {
        strcpy(path, "/");
        return;
    }

    int len = (int)(end - p);
    if (len <= 0) {
        strcpy(path, "/");
        return;
    }

    strncpy(path, p, len);
    path[len] = '\0';
}

// ================= directory listing =================
void sendDir(SOCKET c, const char* basePath, const char* urlPath) {
    char html[8192];
    char searchPath[MAX_PATH];

    strcpy(html,
        "HTTP/1.1 200 OK\r\n"
        "Content-Type: text/html; charset=utf-8\r\n\r\n"
        "<html><body><h2>Index of ");

    strcat(html, urlPath);
    strcat(html, "</h2><hr>");

    strcpy(searchPath, basePath);
    strcat(searchPath, "\\*");

    WIN32_FIND_DATAA fd;
    HANDLE h = FindFirstFileA(searchPath, &fd);

    if (h != INVALID_HANDLE_VALUE) {
        do {
            if (strcmp(fd.cFileName, ".") == 0) continue;

            strcat(html, "<a href=\"");
            strcat(html, fd.cFileName);

            if (fd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)
                strcat(html, "/");

            strcat(html, "\">");
            strcat(html, fd.cFileName);

            if (fd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)
                strcat(html, "/");

            strcat(html, "</a><br>");

        } while (FindNextFileA(h, &fd));

        FindClose(h);
    }

    strcat(html, "<hr></body></html>");
    sendAll(c, html);
}

// ================= file =================
void sendFile(SOCKET c, const char* path) {
    HANDLE f = CreateFileA(
        path,
        GENERIC_READ,
        FILE_SHARE_READ,
        NULL,
        OPEN_EXISTING,
        FILE_ATTRIBUTE_NORMAL,
        NULL
    );

    if (f == INVALID_HANDLE_VALUE) {
        sendAll(c,
            "HTTP/1.1 404 Not Found\r\nContent-Length:0\r\n\r\n");
        return;
    }

    sendAll(c,
        "HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\n\r\n");

    char buf[4096];
    DWORD read;

    while (ReadFile(f, buf, sizeof(buf), &read, NULL) && read > 0) {
        send(c, buf, read, 0);
    }

    CloseHandle(f);
}

// ================= handle =================
void handle(SOCKET c, const char* baseDir) {
    char buf[4096] = {0};
    recv(c, buf, sizeof(buf), 0);

    char path[512];
    parsePath(buf, path);

    char full[MAX_PATH];
    strcpy(full, baseDir);

    if (strcmp(path, "/") == 0) {
        sendDir(c, baseDir, "/");
        closesocket(c);
        return;
    }

    strcat(full, path);

    DWORD attr = GetFileAttributesA(full);

    if (attr == INVALID_FILE_ATTRIBUTES) {
        sendAll(c,
            "HTTP/1.1 404 Not Found\r\nContent-Length:0\r\n\r\n");
        closesocket(c);
        return;
    }

    if (attr & FILE_ATTRIBUTE_DIRECTORY) {
        sendDir(c, full, path);
        closesocket(c);
        return;
    }

    sendFile(c, full);
    closesocket(c);
}

// ================= main =================
int main(int argc, char* argv[]) {

    int port = parseArgs(argc, argv);

    WSADATA wsa;
    if (WSAStartup(MAKEWORD(2,2), &wsa) != 0) {
        printf("WSAStartup failed\n");
        return 1;
    }

    SOCKET s = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (s == INVALID_SOCKET) {
        printf("socket failed\n");
        return 1;
    }

    int opt = 1;
    setsockopt(s, SOL_SOCKET, SO_REUSEADDR, (char*)&opt, sizeof(opt));

    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);
    addr.sin_addr.s_addr = INADDR_ANY;

    if (bind(s, (sockaddr*)&addr, sizeof(addr)) == SOCKET_ERROR) {
        printf("bind failed\n");
        return 1;
    }

    if (listen(s, 10) == SOCKET_ERROR) {
        printf("listen failed\n");
        return 1;
    }

    char baseDir[MAX_PATH];
    GetCurrentDirectoryA(MAX_PATH, baseDir);

    printf("=================================\n");
    printf("Mini Nginx C++ Server (Strict)\n");
    printf("Dir: %s\n", baseDir);
    printf("Port: %d\n", port);
    printf("http://127.0.0.1:%d\n", port);

    char ip[64];
    getLocalIP(ip);

    if (strlen(ip) > 0) {
        printf("http://%s:%d\n", ip, port);
    }

    printf("=================================\n");

    while (1) {
        SOCKET c = accept(s, NULL, NULL);
        if (c == INVALID_SOCKET) continue;
        handle(c, baseDir);
    }

    closesocket(s);
    WSACleanup();
    return 0;
}
```

### 打包命令

```cmd
g++ -std=c++20 -Os -s -flto -static-libgcc -ffunction-sections -fdata-sections -Wl,--gc-sections -Wl,-s server.cpp -lws2_32 -o server.exe
```

### 下载

GitHub仓库有编译好的版本，可直接下载

[https://banbu1118.github.io/server.exe](https://banbu1118.github.io/server.exe)

### 使用

- 双击执行

默认使用8080端口

- cmd命令运行

可定义http端口

```cmd
C:\Users\kk\Desktop\go-http-server>server.exe --port 7777
=================================
Mini Nginx C++ Server (Strict)
Dir: C:\Users\kk\Desktop\go-http-server
Port: 7777
http://127.0.0.1:7777
http://192.168.1.2:7777
=================================
```