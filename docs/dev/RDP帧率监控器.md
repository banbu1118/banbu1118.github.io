# RDP帧率监控器

编写rdp监控程序，实时监控 \RemoteFX Graphics(*)\Input Frames/Second 服务器实际编码并发送到客户端的帧数和 \RemoteFX Graphics(*)\Output Frames/Second 客户端实际接收到并解码处理的帧数，并实时监控60秒内他们的平均值

## 原理

```shell
#获取rdp相关计数器
typeperf -q | findstr /i "RemoteFX"
```

## 安装 MinGW-w64依赖

```powershell
# 以管理员身份运行 PowerShell，然后安装 Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 安装 MinGW-w64
choco install mingw -y

#如果使用choco安装mingw失败，可以直接去mingw的GitHub官网下载文件，解压后添加bin目录为环境变量即可
#https://github.com/niXman/mingw-builds-binaries/releases
```

## 编写c++程序

### rdp_monitor.cpp

```C#
#include <windows.h>
#include <pdh.h>
#include <string>
#include <deque>

#pragma comment(lib, "pdh.lib")
#pragma comment(lib, "user32.lib")
#pragma comment(lib, "gdi32.lib")

// ================================
// ========== 性能监控类 ==========
// ================================
class FrameRateMonitor {
private:
    PDH_HQUERY query;
    PDH_HCOUNTER inputCounter;
    PDH_HCOUNTER outputCounter;
    std::deque<double> inputHistory;
    std::deque<double> outputHistory;
    const int historySize = 60;

    double currentInput;
    double currentOutput;
    double avgInput;
    double avgOutput;
    bool dataValid;

public:
    FrameRateMonitor() : query(NULL), inputCounter(NULL), outputCounter(NULL),
        currentInput(0), currentOutput(0), avgInput(0), avgOutput(0), dataValid(false) {}

    bool initialize() {
        if (PdhOpenQueryW(NULL, 0, &query) != ERROR_SUCCESS)
            return false;

        const wchar_t* inputPath = L"\\RemoteFX Graphics(*)\\Input Frames/Second";
        const wchar_t* outputPath = L"\\RemoteFX Graphics(*)\\Output Frames/Second";

        if (PdhAddCounterW(query, inputPath, 0, &inputCounter) != ERROR_SUCCESS) {
            PdhCloseQuery(query);
            return false;
        }

        if (PdhAddCounterW(query, outputPath, 0, &outputCounter) != ERROR_SUCCESS) {
            PdhRemoveCounter(inputCounter);
            PdhCloseQuery(query);
            return false;
        }

        inputHistory.resize(historySize, 0.0);
        outputHistory.resize(historySize, 0.0);
        return true;
    }

    bool update() {
        if (PdhCollectQueryData(query) == ERROR_SUCCESS) {
            PDH_FMT_COUNTERVALUE inputValue, outputValue;

            if (PdhGetFormattedCounterValue(inputCounter, PDH_FMT_DOUBLE, NULL, &inputValue) == ERROR_SUCCESS &&
                PdhGetFormattedCounterValue(outputCounter, PDH_FMT_DOUBLE, NULL, &outputValue) == ERROR_SUCCESS) {

                currentInput = inputValue.doubleValue;
                currentOutput = outputValue.doubleValue;

                inputHistory.pop_front();
                outputHistory.pop_front();
                inputHistory.push_back(currentInput);
                outputHistory.push_back(currentOutput);

                avgInput = calcAvg(inputHistory);
                avgOutput = calcAvg(outputHistory);

                dataValid = true;
                return true;
            }
        }
        dataValid = false;
        return false;
    }

    void getData(double& in, double& out, double& avgIn, double& avgOut) {
        in = currentInput;
        out = currentOutput;
        avgIn = avgInput;
        avgOut = avgOutput;
    }

    bool isValid() { return dataValid; }

    ~FrameRateMonitor() {
        if (inputCounter) PdhRemoveCounter(inputCounter);
        if (outputCounter) PdhRemoveCounter(outputCounter);
        if (query) PdhCloseQuery(query);
    }

private:
    double calcAvg(const std::deque<double>& v) {
        double sum = 0; int c = 0;
        for (auto& x : v) if (x > 0) sum += x, c++;
        return c ? (sum / c) : 0;
    }
};

// ================================
// ========== 全局变量 ==========
// ================================
FrameRateMonitor g_monitor;
HWND g_hWnd;
HFONT g_hFont;
bool g_monitoring = true;

// 顶置窗口按钮区域
RECT g_topRect = { 20, 0, 140, 0 }; // top/bottom 后面动态计算
bool g_hover = false;
bool g_press = false;
bool g_topMost = false;

// 窗口布局参数
const int marginTop = 20;
const int lineHeight = 32;
const int marginBetween = 10;
const int buttonHeight = 36;

// ================================
// ========== 工具函数 ==========
// ================================
bool InRect(RECT rc, int x, int y) {
    return x >= rc.left && x <= rc.right && y >= rc.top && y <= rc.bottom;
}

// ================================
// ========== 自绘按钮 ==========
// ================================
void DrawTopButton(HDC hdc, int clientWidth) {
    COLORREF normalColor = RGB(230, 230, 230);
    COLORREF hoverColor  = RGB(210, 210, 210);
    COLORREF pressColor  = RGB(190, 190, 190);

    HBRUSH brush = CreateSolidBrush(
        g_press ? pressColor : g_hover ? hoverColor : normalColor
    );
    FillRect(hdc, &g_topRect, brush);
    DeleteObject(brush);

    SetBkMode(hdc, TRANSPARENT);
    SetTextColor(hdc, RGB(50, 50, 50));

    wchar_t text[20];
    wcscpy_s(text, g_topMost ? L"取消置顶" : L"置顶窗口");

    RECT rect = g_topRect;
    rect.right = clientWidth - 20; // 按钮宽度自适应窗口宽度
    DrawTextW(hdc, text, -1, &rect, DT_CENTER | DT_VCENTER | DT_SINGLELINE);
}

// ================================
// ========== WindowProc ==========
// ================================
LRESULT CALLBACK WindowProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {

    case WM_CREATE:
        g_hFont = CreateFontW(
            22, 0, 0, 0, FW_SEMIBOLD, FALSE, FALSE, FALSE,
            DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS,
            DEFAULT_QUALITY, DEFAULT_PITCH, L"Microsoft YaHei UI"
        );
        SetTimer(hWnd, 1, 1000, NULL);
        g_monitor.initialize();
        return 0;

    case WM_TIMER:
        g_monitor.update();
        InvalidateRect(hWnd, NULL, TRUE);
        return 0;

    case WM_MOUSEMOVE: {
        int x = LOWORD(lParam), y = HIWORD(lParam);
        bool old = g_hover;
        g_hover = InRect(g_topRect, x, y);
        if (old != g_hover) InvalidateRect(hWnd, &g_topRect, TRUE);
        return 0;
    }

    case WM_LBUTTONDOWN: {
        int x = LOWORD(lParam), y = HIWORD(lParam);
        if (InRect(g_topRect, x, y)) {
            g_press = true;
            InvalidateRect(hWnd, &g_topRect, TRUE);
        }
        return 0;
    }

    case WM_LBUTTONUP: {
        bool wasPress = g_press;
        g_press = false;
        InvalidateRect(hWnd, &g_topRect, TRUE);

        int x = LOWORD(lParam), y = HIWORD(lParam);
        if (wasPress && InRect(g_topRect, x, y)) {
            g_topMost = !g_topMost;

            SetWindowPos(
                hWnd,
                g_topMost ? HWND_TOPMOST : HWND_NOTOPMOST,
                0, 0, 0, 0,
                SWP_NOMOVE | SWP_NOSIZE
            );

            InvalidateRect(hWnd, NULL, TRUE);
        }
        return 0;
    }

    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hWnd, &ps);
        SelectObject(hdc, g_hFont);

        // 背景浅灰
        HBRUSH bg = CreateSolidBrush(RGB(245, 245, 245));
        FillRect(hdc, &ps.rcPaint, bg);
        DeleteObject(bg);

        SetBkMode(hdc, TRANSPARENT);

        double inF, outF, avgIn, avgOut;
        g_monitor.getData(inF, outF, avgIn, avgOut);

        wchar_t buf[256];

        RECT rcClient;
        GetClientRect(hWnd, &rcClient);

        // 从顶部开始绘制数据行
        int top = marginTop;

        // 当前输入帧率
        RECT r2 = { 20, top, rcClient.right - 20, top + lineHeight };
        if (inF < 15) SetTextColor(hdc, RGB(220, 20, 60));
        else if (inF < 25) SetTextColor(hdc, RGB(255, 140, 0));
        else SetTextColor(hdc, RGB(0, 128, 0));
        swprintf(buf, L"当前输入帧率：%.1f", inF);
        DrawTextW(hdc, buf, -1, &r2, DT_LEFT);

        top += lineHeight + marginBetween;

        // 当前输出帧率
        RECT r3 = { 20, top, rcClient.right - 20, top + lineHeight };
        if (outF < 15) SetTextColor(hdc, RGB(220, 20, 60));
        else if (outF < 25) SetTextColor(hdc, RGB(255, 140, 0));
        else SetTextColor(hdc, RGB(30, 80, 180));
        swprintf(buf, L"当前输出帧率：%.1f", outF);
        DrawTextW(hdc, buf, -1, &r3, DT_LEFT);

        top += lineHeight + marginBetween;

        // 平均输入
        RECT r4 = { 20, top, rcClient.right - 20, top + lineHeight };
        SetTextColor(hdc, RGB(0, 100, 0));
        swprintf(buf, L"60s平均输入：%.1f", avgIn);
        DrawTextW(hdc, buf, -1, &r4, DT_LEFT);

        top += lineHeight + marginBetween;

        // 平均输出
        RECT r5 = { 20, top, rcClient.right - 20, top + lineHeight };
        SetTextColor(hdc, RGB(0, 0, 100));
        swprintf(buf, L"60s平均输出：%.1f", avgOut);
        DrawTextW(hdc, buf, -1, &r5, DT_LEFT);

        top += lineHeight + marginBetween;

        // 按钮
        g_topRect.left = 20;
        g_topRect.top = top;
        g_topRect.bottom = top + buttonHeight;
        g_topRect.right = rcClient.right - 20;
        DrawTopButton(hdc, rcClient.right);

        EndPaint(hWnd, &ps);
        return 0;
    }

    case WM_DESTROY:
        DeleteObject(g_hFont);
        KillTimer(hWnd, 1);
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(hWnd, msg, wParam, lParam);
}

// ================================
// ========== WinMain ==========
// ================================
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE, LPSTR, int nShowCmd) {
    WNDCLASSW wc = {};
    wc.hInstance = hInstance;
    wc.lpszClassName = L"RdpMonitorWnd";
    wc.lpfnWndProc = WindowProc;
    wc.hCursor = LoadCursor(NULL, IDC_ARROW);
    wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);

    RegisterClassW(&wc);

    // 初始窗口高度
    int totalLines = 4; // 数据行4行
    int windowHeight = marginTop
                       + totalLines * lineHeight
                       + marginBetween * totalLines
                       + buttonHeight
                       + marginTop+ 40;

    g_hWnd = CreateWindowW(
        wc.lpszClassName, L"RDP 帧率监控器",
        WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU | WS_THICKFRAME, // 关闭按钮可用，禁止最小化最大化，可调整大小
        CW_USEDEFAULT, CW_USEDEFAULT,
        220, windowHeight,
        NULL, NULL, hInstance, NULL
    );

    ShowWindow(g_hWnd, nShowCmd);
    UpdateWindow(g_hWnd);

    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }
    return 0;
}
```

### rdp_monitor_v2.cpp

```C#
#include <windows.h>
#include <pdh.h>
#include <string>
#include <deque>

#pragma comment(lib, "pdh.lib")
#pragma comment(lib, "user32.lib")
#pragma comment(lib, "gdi32.lib")

// ================================
// ========== 性能监控类 ==========
// ================================
class FrameRateMonitor {
private:
    PDH_HQUERY query;
    PDH_HCOUNTER inputCounter;
    PDH_HCOUNTER outputCounter;
    PDH_HCOUNTER bandwidthCounter;

    std::deque<double> inputHistory;
    std::deque<double> outputHistory;
    std::deque<double> bandwidthHistory;
    const int historySize = 60;

    double currentInput;
    double currentOutput;
    double avgInput;
    double avgOutput;

    double currentBandwidth;
    double avgBandwidth;

    bool dataValid;

public:
    FrameRateMonitor() : query(NULL), inputCounter(NULL), outputCounter(NULL), bandwidthCounter(NULL),
        currentInput(0), currentOutput(0), avgInput(0), avgOutput(0),
        currentBandwidth(0), avgBandwidth(0), dataValid(false) {}

    bool initialize() {
        if (PdhOpenQueryW(NULL, 0, &query) != ERROR_SUCCESS)
            return false;

        const wchar_t* inputPath = L"\\RemoteFX Graphics(*)\\Input Frames/Second";
        const wchar_t* outputPath = L"\\RemoteFX Graphics(*)\\Output Frames/Second";
        const wchar_t* bandwidthPath = L"\\Network Interface(*)\\Bytes Total/sec"; // 所有网卡总带宽

        if (PdhAddCounterW(query, inputPath, 0, &inputCounter) != ERROR_SUCCESS) {
            PdhCloseQuery(query);
            return false;
        }

        if (PdhAddCounterW(query, outputPath, 0, &outputCounter) != ERROR_SUCCESS) {
            PdhRemoveCounter(inputCounter);
            PdhCloseQuery(query);
            return false;
        }

        if (PdhAddCounterW(query, bandwidthPath, 0, &bandwidthCounter) != ERROR_SUCCESS) {
            bandwidthCounter = NULL; // 可以忽略带宽
        }

        inputHistory.resize(historySize, 0.0);
        outputHistory.resize(historySize, 0.0);
        bandwidthHistory.resize(historySize, 0.0);

        return true;
    }

    bool update() {
        if (PdhCollectQueryData(query) == ERROR_SUCCESS) {
            PDH_FMT_COUNTERVALUE inputValue, outputValue, bwValue;

            bool okInput = PdhGetFormattedCounterValue(inputCounter, PDH_FMT_DOUBLE, NULL, &inputValue) == ERROR_SUCCESS;
            bool okOutput = PdhGetFormattedCounterValue(outputCounter, PDH_FMT_DOUBLE, NULL, &outputValue) == ERROR_SUCCESS;
            bool okBandwidth = bandwidthCounter && PdhGetFormattedCounterValue(bandwidthCounter, PDH_FMT_DOUBLE, NULL, &bwValue) == ERROR_SUCCESS;

            if (okInput && okOutput) {
                currentInput = inputValue.doubleValue;
                currentOutput = outputValue.doubleValue;

                inputHistory.pop_front();
                inputHistory.push_back(currentInput);

                outputHistory.pop_front();
                outputHistory.push_back(currentOutput);

                avgInput = calcAvg(inputHistory);
                avgOutput = calcAvg(outputHistory);

                if (okBandwidth) {
                    currentBandwidth = bwValue.doubleValue;
                    bandwidthHistory.pop_front();
                    bandwidthHistory.push_back(currentBandwidth);
                    avgBandwidth = calcAvg(bandwidthHistory);
                }

                dataValid = true;
                return true;
            }
        }
        dataValid = false;
        return false;
    }

    void getData(double& in, double& out, double& avgIn, double& avgOut) {
        in = currentInput;
        out = currentOutput;
        avgIn = avgInput;
        avgOut = avgOutput;
    }

    void getBandwidth(double& curBw, double& avgBw) {
        curBw = currentBandwidth;
        avgBw = avgBandwidth;
    }

    bool isValid() { return dataValid; }

    ~FrameRateMonitor() {
        if (inputCounter) PdhRemoveCounter(inputCounter);
        if (outputCounter) PdhRemoveCounter(outputCounter);
        if (bandwidthCounter) PdhRemoveCounter(bandwidthCounter);
        if (query) PdhCloseQuery(query);
    }

private:
    double calcAvg(const std::deque<double>& v) {
        double sum = 0; int c = 0;
        for (auto& x : v) if (x > 0) sum += x, c++;
        return c ? (sum / c) : 0;
    }
};

// ================================
// ========== 全局变量 ==========
// ================================
FrameRateMonitor g_monitor;
HWND g_hWnd;
HFONT g_hFont;
bool g_monitoring = true;

RECT g_topRect = { 20, 0, 140, 0 };
bool g_hover = false;
bool g_press = false;
bool g_topMost = false;

const int marginTop = 20;
const int lineHeight = 32;
const int marginBetween = 10;
const int buttonHeight = 36;

// ================================
// ========== 工具函数 ==========
// ================================
bool InRect(RECT rc, int x, int y) {
    return x >= rc.left && x <= rc.right && y >= rc.top && y <= rc.bottom;
}

// 格式化带宽显示
std::wstring FormatBandwidth(double bytesPerSec) {
    double bitsPerSec = bytesPerSec * 8;
    wchar_t buf[64];

    if (bitsPerSec >= 1000 * 1000) {
        swprintf(buf, L"%.2f Mbps", bitsPerSec / 1000.0 / 1000.0);
    }
    else if (bitsPerSec >= 1000) {
        swprintf(buf, L"%.1f Kbps", bitsPerSec / 1000.0);
    }
    else {
        swprintf(buf, L"%.0f bps", bitsPerSec);
    }
    return buf;
}

// ================================
// ========== 自绘按钮 ==========
// ================================
void DrawTopButton(HDC hdc, int clientWidth) {
    COLORREF normalColor = RGB(230, 230, 230);
    COLORREF hoverColor  = RGB(210, 210, 210);
    COLORREF pressColor  = RGB(190, 190, 190);

    HBRUSH brush = CreateSolidBrush(
        g_press ? pressColor : g_hover ? hoverColor : normalColor
    );
    FillRect(hdc, &g_topRect, brush);
    DeleteObject(brush);

    SetBkMode(hdc, TRANSPARENT);
    SetTextColor(hdc, RGB(50, 50, 50));

    wchar_t text[20];
    wcscpy_s(text, g_topMost ? L"取消置顶" : L"置顶窗口");

    RECT rect = g_topRect;
    rect.right = clientWidth - 20;
    DrawTextW(hdc, text, -1, &rect, DT_CENTER | DT_VCENTER | DT_SINGLELINE);
}

// ================================
// ========== WindowProc ==========
// ================================
LRESULT CALLBACK WindowProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {

    case WM_CREATE:
        g_hFont = CreateFontW(
            22, 0, 0, 0, FW_SEMIBOLD, FALSE, FALSE, FALSE,
            DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS,
            DEFAULT_QUALITY, DEFAULT_PITCH, L"Microsoft YaHei UI"
        );
        SetTimer(hWnd, 1, 1000, NULL);
        g_monitor.initialize();
        return 0;

    case WM_TIMER:
        g_monitor.update();
        InvalidateRect(hWnd, NULL, TRUE);
        return 0;

    case WM_MOUSEMOVE: {
        int x = LOWORD(lParam), y = HIWORD(lParam);
        bool old = g_hover;
        g_hover = InRect(g_topRect, x, y);
        if (old != g_hover) InvalidateRect(hWnd, &g_topRect, TRUE);
        return 0;
    }

    case WM_LBUTTONDOWN: {
        int x = LOWORD(lParam), y = HIWORD(lParam);
        if (InRect(g_topRect, x, y)) {
            g_press = true;
            InvalidateRect(hWnd, &g_topRect, TRUE);
        }
        return 0;
    }

    case WM_LBUTTONUP: {
        bool wasPress = g_press;
        g_press = false;
        InvalidateRect(g_hWnd, &g_topRect, TRUE);

        int x = LOWORD(lParam), y = HIWORD(lParam);
        if (wasPress && InRect(g_topRect, x, y)) {
            g_topMost = !g_topMost;

            SetWindowPos(
                hWnd,
                g_topMost ? HWND_TOPMOST : HWND_NOTOPMOST,
                0, 0, 0, 0,
                SWP_NOMOVE | SWP_NOSIZE
            );

            InvalidateRect(hWnd, NULL, TRUE);
        }
        return 0;
    }

    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hWnd, &ps);
        SelectObject(hdc, g_hFont);

        HBRUSH bg = CreateSolidBrush(RGB(245, 245, 245));
        FillRect(hdc, &ps.rcPaint, bg);
        DeleteObject(bg);

        SetBkMode(hdc, TRANSPARENT);

        double inF, outF, avgIn, avgOut;
        g_monitor.getData(inF, outF, avgIn, avgOut);

        double curBw, avgBw;
        g_monitor.getBandwidth(curBw, avgBw);

        RECT rcClient;
        GetClientRect(hWnd, &rcClient);

        int top = marginTop;
        wchar_t buf[256];

        // 当前输入帧率
        RECT r2 = { 20, top, rcClient.right - 20, top + lineHeight };
        if (inF < 15) SetTextColor(hdc, RGB(220, 20, 60));
        else if (inF < 25) SetTextColor(hdc, RGB(255, 140, 0));
        else SetTextColor(hdc, RGB(0, 128, 0));
        swprintf(buf, L"当前输入帧率：%.1f", inF);
        DrawTextW(hdc, buf, -1, &r2, DT_LEFT);
        top += lineHeight + marginBetween;

        // 当前输出帧率
        RECT r3 = { 20, top, rcClient.right - 20, top + lineHeight };
        if (outF < 15) SetTextColor(hdc, RGB(220, 20, 60));
        else if (outF < 25) SetTextColor(hdc, RGB(255, 140, 0));
        else SetTextColor(hdc, RGB(30, 80, 180));
        swprintf(buf, L"当前输出帧率：%.1f", outF);
        DrawTextW(hdc, buf, -1, &r3, DT_LEFT);
        top += lineHeight + marginBetween;

        // 平均输入
        RECT r4 = { 20, top, rcClient.right - 20, top + lineHeight };
        SetTextColor(hdc, RGB(0, 100, 0));
        swprintf(buf, L"60s平均输入：%.1f", avgIn);
        DrawTextW(hdc, buf, -1, &r4, DT_LEFT);
        top += lineHeight + marginBetween;

        // 平均输出
        RECT r5 = { 20, top, rcClient.right - 20, top + lineHeight };
        SetTextColor(hdc, RGB(0, 0, 100));
        swprintf(buf, L"60s平均输出：%.1f", avgOut);
        DrawTextW(hdc, buf, -1, &r5, DT_LEFT);
        top += lineHeight + marginBetween;

        // 实时带宽
        RECT r6 = { 20, top, rcClient.right - 20, top + lineHeight };
        SetTextColor(hdc, RGB(0, 0, 150));
        std::wstring curStr = L"实时带宽：" + FormatBandwidth(curBw);
        DrawTextW(hdc, curStr.c_str(), -1, &r6, DT_LEFT);
        top += lineHeight + marginBetween;

        // 60s平均带宽
        RECT r7 = { 20, top, rcClient.right - 20, top + lineHeight };
        SetTextColor(hdc, RGB(0, 100, 150));
        std::wstring avgStr = L"60s平均带宽：" + FormatBandwidth(avgBw);
        DrawTextW(hdc, avgStr.c_str(), -1, &r7, DT_LEFT);
        top += lineHeight + marginBetween;

        // 按钮
        g_topRect.left = 20;
        g_topRect.top = top;
        g_topRect.bottom = top + buttonHeight;
        g_topRect.right = rcClient.right - 20;
        DrawTopButton(hdc, rcClient.right);

        EndPaint(hWnd, &ps);
        return 0;
    }

    case WM_DESTROY:
        DeleteObject(g_hFont);
        KillTimer(hWnd, 1);
        PostQuitMessage(0);
        return 0;
    }

    return DefWindowProcW(hWnd, msg, wParam, lParam);
}

// ================================
// ========== WinMain ==========
// ================================
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE, LPSTR, int nShowCmd) {
    WNDCLASSW wc = {};
    wc.hInstance = hInstance;
    wc.lpszClassName = L"RdpMonitorWnd";
    wc.lpfnWndProc = WindowProc;
    wc.hCursor = LoadCursor(NULL, IDC_ARROW);
    wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);

    RegisterClassW(&wc);

    int totalLines = 6; // 数据行4行 + 带宽2行
    int windowHeight = marginTop
                       + totalLines * lineHeight
                       + marginBetween * totalLines
                       + buttonHeight
                       + marginTop + 40;

    g_hWnd = CreateWindowW(
        wc.lpszClassName, L"RDP 帧率监控器",
        WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU | WS_THICKFRAME,
        CW_USEDEFAULT, CW_USEDEFAULT,
        320, windowHeight,
        NULL, NULL, hInstance, NULL
    );

    ShowWindow(g_hWnd, nShowCmd);
    UpdateWindow(g_hWnd);

    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }
    return 0;
}
```

## 打包

```shell
g++ -O2 -s -static rdp_monitor.cpp -lpdh -luser32 -lgdi32 -o rdp_monitor.exe -mwindows
```

## 下载

GitHub仓库有编译好的版本，可直接下载

rdp帧率监控

[https://banbu1118.github.io/rdp_monitor.exe](https://banbu1118.github.io/rdp_monitor.exe)

rdp帧率监控 + 带宽监控

[https://banbu1118.github.io/rdp_monitor_v2.exe](https://banbu1118.github.io/rdp_monitor_v2.exe)
