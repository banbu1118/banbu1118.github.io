## OpenDesk自动部署脚本

借助R2对象存储，使用全球范围自动部署OpenDesk

### 自动部署脚本

install.py


```python
#!/usr/bin/env python3

import os
import subprocess
import hashlib
import json
import time
import sys

# ================== 配置区 ==================

# VM 镜像下载地址
DP_URL = "https://r2.opendesk.top/vzdump-qemu-106-2026_04_20-10_30_08.vma.zst"

# 本地存储路径
DP_FILE = "/var/lib/vz/dump/vzdump-qemu-106-2026_04_20-10_30_08.vma.zst"

# SHA256 校验值
EXPECTED_SHA256 = "e0f312989b3a029f5a19dc7779298b10a33caacfff3139ef3af7f26b89e312e0"


# ================== 执行系统命令 ==================
def run_cmd(cmd):
    """执行 shell 命令"""
    try:
        return subprocess.check_output(cmd).decode().strip()
    except subprocess.CalledProcessError as e:
        print("[ERROR] Command failed:", " ".join(cmd))
        print(e.output.decode() if e.output else "")
        sys.exit(1)


# ================== SHA256 校验 ==================
def check_sha256(file_path, expected):
    """计算文件 SHA256 并校验"""
    print(f"\n[*] Checking SHA256: {file_path}")

    sha256 = hashlib.sha256()

    with open(file_path, "rb") as f:
        while True:
            data = f.read(1024 * 1024)
            if not data:
                break
            sha256.update(data)

    calc = sha256.hexdigest()

    print("    Calculated:", calc)
    print("    Expected  :", expected)

    if calc == expected:
        print("    SHA256 OK ✅")
        return True
    else:
        print("    SHA256 FAIL ❌")
        return False


# ================== 下载镜像（带进度条） ==================
def download_image():
    """下载 VM 镜像（实时进度条）"""

    print("\n[*] Downloading VM image...")

    # wget 必须直接运行，不能 capture output，否则没有进度
    cmd = [
        "wget",
        DP_URL,
        "-O",
        DP_FILE,
        "--progress=bar:force:noscroll"
    ]

    # 实时输出 wget 进度
    process = subprocess.Popen(cmd)

    process.wait()

    if process.returncode != 0:
        print("[FATAL] Download failed")
        sys.exit(1)

    # 下载完成后校验
    if not check_sha256(DP_FILE, EXPECTED_SHA256):
        print("[!] Invalid file, re-downloading...")

        os.remove(DP_FILE)

        process = subprocess.Popen(cmd)
        process.wait()

        if process.returncode != 0:
            print("[FATAL] Download failed again")
            sys.exit(1)

        if not check_sha256(DP_FILE, EXPECTED_SHA256):
            print("[FATAL] SHA256 mismatch after retry")
            sys.exit(1)


# ================== 获取 VMID ==================
def get_vmid():
    vmid = int(run_cmd(["pvesh", "get", "/cluster/nextid"]))
    print(f"\n[*] VMID allocated: {vmid}")
    return vmid


# ================== 获取存储 ==================
def get_storage():
    data = json.loads(run_cmd(["pvesh", "get", "/storage/", "--output-format", "json"]))

    for item in data:
        if "images" in item.get("content", ""):
            print("[*] Storage:", item["storage"])
            return item["storage"]

    print("[FATAL] No image storage found")
    sys.exit(1)


# ================== restore VM ==================
def restore_vm(vmid, storage):
    print("\n[*] Restoring VM...")

    subprocess.run([
        "qmrestore",
        DP_FILE,
        str(vmid),
        "--storage",
        storage,
        "--unique"
    ], check=True)


# ================== 启动 VM ==================
def start_vm(vmid):
    print(f"\n[*] Starting VM {vmid}...")

    subprocess.run(["qm", "start", str(vmid)], check=True)


# ================== 获取 IP ==================
def get_ip(vmid):
    print("\n[*] Waiting for VM network...")

    for _ in range(30):
        try:
            output = run_cmd(["qm", "agent", str(vmid), "network-get-interfaces"])

            if "ip-addresses" in output:
                data = json.loads(output)

                for iface in data:
                    if iface.get("name") == "lo":
                        continue

                    for addr in iface.get("ip-addresses", []):
                        if addr.get("ip-address-type") == "ipv4":
                            return addr.get("ip-address")

        except:
            pass

        print("    waiting...")
        time.sleep(5)

    return None


# ================== 主流程 ==================
def main():

    # 1. 下载镜像
    download_image()

    # 2. 获取 VMID
    vmid = get_vmid()

    # 3. 获取存储
    storage = get_storage()

    # 4. 恢复 VM
    restore_vm(vmid, storage)

    # 5. 启动 VM
    start_vm(vmid)

    # 6. 获取 IP
    ip = get_ip(vmid)

    print("\n============================")
    print("Deployment finished")
    print("============================")

    if ip:
        print(f"Access URL: https://{ip}")
    else:
        print("VM started but IP not detected")


if __name__ == "__main__":
    main()
```

### 多线程下载

测试效果不好，会卡住230MB后无法下载，待定

```py
#!/usr/bin/env python3

import os
import sys
import time
import json
import math
import threading
import hashlib
import subprocess
import requests

# ================== 配置区 ==================

DP_URL = "https://r2.opendesk.top/vzdump-qemu-106-2026_04_20-10_30_08.vma.zst"
DP_FILE = "/var/lib/vz/dump/vzdump-qemu-106-2026_04_20-10_30_08.vma.zst"

EXPECTED_SHA256 = "e0f312989b3a029f5a19dc7779298b10a33caacfff3139ef3af7f26b89e312e0"

THREADS = 8  # 并发线程数

downloaded_bytes = 0
file_size_global = 0
lock = threading.Lock()


# ================== 系统命令执行 ==================

def run_cmd(cmd):
    """执行系统命令"""
    try:
        return subprocess.check_output(cmd).decode().strip()
    except subprocess.CalledProcessError as e:
        print("[ERROR] Command failed:", " ".join(cmd))
        print(e.output.decode() if e.output else "")
        sys.exit(1)


# ================== SHA256 校验 ==================

def check_sha256(file_path, expected):
    print(f"\n[*] Checking SHA256: {file_path}")

    sha256 = hashlib.sha256()

    with open(file_path, "rb") as f:
        while True:
            data = f.read(1024 * 1024)
            if not data:
                break
            sha256.update(data)

    calc = sha256.hexdigest()

    print("    Calculated:", calc)
    print("    Expected  :", expected)

    if calc == expected:
        print("    SHA256 OK ✅")
        return True
    else:
        print("    SHA256 FAIL ❌")
        return False


# ================== 获取文件大小 ==================

def get_file_size(url):
    r = requests.head(url)
    return int(r.headers.get("Content-Length"))


# ================== 下载进度 ==================

def progress_bar():
    global downloaded_bytes, file_size_global

    while downloaded_bytes < file_size_global:
        percent = downloaded_bytes / file_size_global * 100
        mb = downloaded_bytes / (1024 * 1024)
        total_mb = file_size_global / (1024 * 1024)

        print(f"\r[*] Downloading: {percent:.2f}% ({mb:.2f}/{total_mb:.2f} MB)", end="")
        time.sleep(0.5)


# ================== 分片下载 ==================

def download_part(url, start, end, idx):
    global downloaded_bytes

    headers = {
        "Range": f"bytes={start}-{end}"
    }

    r = requests.get(url, headers=headers, stream=True)

    part_file = f"{DP_FILE}.part{idx}"

    with open(part_file, "wb") as f:
        for chunk in r.iter_content(chunk_size=1024 * 1024):
            if chunk:
                f.write(chunk)
                with lock:
                    downloaded_bytes += len(chunk)


# ================== 主下载函数（分片并发） ==================

def download_image():
    global file_size_global

    print("\n[*] Starting multi-threaded download...")

    file_size_global = get_file_size(DP_URL)

    print(f"[*] File size: {file_size_global / (1024*1024):.2f} MB")

    part_size = math.ceil(file_size_global / THREADS)

    threads = []

    # 进度条线程
    t = threading.Thread(target=progress_bar)
    t.start()

    # 分片下载线程
    for i in range(THREADS):
        start = i * part_size
        end = min(start + part_size - 1, file_size_global - 1)

        th = threading.Thread(
            target=download_part,
            args=(DP_URL, start, end, i)
        )
        th.start()
        threads.append(th)

    for th in threads:
        th.join()

    print("\n[*] Merging parts...")

    with open(DP_FILE, "wb") as outfile:
        for i in range(THREADS):
            part_file = f"{DP_FILE}.part{i}"
            with open(part_file, "rb") as f:
                outfile.write(f.read())
            os.remove(part_file)

    print("[*] Download complete ✔")

    # 校验
    if not check_sha256(DP_FILE, EXPECTED_SHA256):
        print("[!] Invalid file, re-downloading...")
        os.remove(DP_FILE)
        sys.exit(1)


# ================== PVE相关 ==================

def get_vmid():
    vmid = int(run_cmd(["pvesh", "get", "/cluster/nextid"]))
    print(f"\n[*] VMID: {vmid}")
    return vmid


def get_storage():
    data = json.loads(run_cmd(["pvesh", "get", "/storage/", "--output-format", "json"]))

    for item in data:
        if "images" in item.get("content", ""):
            print("[*] Storage:", item["storage"])
            return item["storage"]

    print("[FATAL] No storage found")
    sys.exit(1)


def restore_vm(vmid, storage):
    print("\n[*] Restoring VM...")

    subprocess.run([
        "qmrestore",
        DP_FILE,
        str(vmid),
        "--storage",
        storage,
        "--unique"
    ], check=True)


def start_vm(vmid):
    print(f"\n[*] Starting VM {vmid}...")

    subprocess.run(["qm", "start", str(vmid)], check=True)


def get_ip(vmid):
    print("\n[*] Waiting VM network...")

    for _ in range(30):
        try:
            out = run_cmd(["qm", "agent", str(vmid), "network-get-interfaces"])

            if "ip-addresses" in out:
                data = json.loads(out)

                for iface in data:
                    if iface.get("name") == "lo":
                        continue

                    for addr in iface.get("ip-addresses", []):
                        if addr.get("ip-address-type") == "ipv4":
                            return addr.get("ip-address")

        except:
            pass

        print("    waiting...")
        time.sleep(5)

    return None


# ================== 主流程 ==================

def main():

    # 1. 下载镜像（分片并发）
    download_image()

    # 2. VMID
    vmid = get_vmid()

    # 3. 存储
    storage = get_storage()

    # 4. 恢复
    restore_vm(vmid, storage)

    # 5. 启动
    start_vm(vmid)

    # 6. 获取IP
    ip = get_ip(vmid)

    print("\n====================")
    print("Deployment finished")
    print("====================")

    if ip:
        print(f"Access: https://{ip}")
    else:
        print("VM started but IP not detected")


if __name__ == "__main__":
    main()
```



### 在线安装命令

```bash
cd /var/lib/vz/dump; wget -qO- https://r2.opendesk.top/install.py | python3
```
