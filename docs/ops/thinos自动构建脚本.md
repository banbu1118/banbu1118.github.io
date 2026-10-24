## thinos自动构建脚本

请在 Debian13 最小化安装的系统中构建，使用 ssh 登录。在 root 目录下执行即可。

### 一、创建构建脚本

```shell
nano build-thinos.sh
```

写入如下内容

```shell
#!/bin/bash
#
# 一键构建 thinos 瘦客户机镜像
#   Debian 13 (trixie) minbase + cage/wayvnc + thinos-client
#   产物：debian13.img（UEFI+BIOS 双引导）、installer/thinos.iso（克隆安装器）
#
# 用法：sudo bash /root/thinos-build/build-thinos.sh
# 要求：Debian 13 构建机、root、可写块设备（普通物理机/虚拟机，容器沙箱通常不行）、
#       磁盘剩余 >= 12G、可访问中科大源与 r2.opendesk.top
#
set -euo pipefail

########## CONFIG（改这里即可） ##########
BASE=/root/thinos-build            # 工作目录
MIRROR=http://mirrors.ustc.edu.cn/debian
SEC_MIRROR=http://mirrors.ustc.edu.cn/debian-security
SUITE=trixie                       # Debian 13
ARCH=amd64

IMG_SIZE=5188M                     # 磁盘镜像大小（教程值，勿随意改：分区位置写死）
ESP_MB=64                          # EFI 分区大小
HOSTNAME=thinos
TIMEZONE=Asia/Shanghai
ROOT_PASSWORD=root
USER_NAME=kk
USER_PASSWORD=kk
CLIENT_DEB_URL=https://r2.opendesk.top/thinos_client_amd64.deb
ENABLE_WAYVNC=0                    # 1=镜像默认开机启动 wayvnc；0=不启用（unit 保留，可在系统内启用）
KEEP_ROOTFS=1                      # 1=成功后保留 rootfs 目录与 tar 包（省时间）；0=删除（省约 4G）
MIN_FREE_GB=12
########## /CONFIG ##########

ROOTFS=$BASE/rootfs
MNT=$BASE/mnt
INST=$BASE/installer
IMG=$BASE/debian13.img
TARBALL=$BASE/debian13-rootfs.tar.gz
LOG=$BASE/build.log
STAGE="初始化"
KVER=""

export DEBIAN_FRONTEND=noninteractive

log()  { printf '\n=== [%s] %s\n' "$(date +%H:%M:%S)" "$*"; }
stage(){ STAGE="$1"; log "$1"; }
die()  { printf '\n!! %s\n' "$*"; exit 1; }

cleanup() {
	set +e
	for d in dev proc sys; do
		umount -R "$MNT/$d"              2>/dev/null
		umount -R "$ROOTFS/$d"           2>/dev/null
	done
	umount -R "$MNT/boot/efi"            2>/dev/null
	umount -R "$MNT"                     2>/dev/null
	if [ -f "$IMG" ]; then
		for d in $(losetup -j "$IMG" 2>/dev/null | cut -d: -f1); do
			losetup -d "$d" 2>/dev/null
		done
	fi
}
on_error() {
	local rc=$?
	set +e
	printf '\n!! 构建失败，阶段：%s（退出码 %s）\n' "$STAGE" "$rc"
	cleanup
	printf '!! 详细日志：%s\n' "$LOG"
	exit "$rc"
}
trap on_error ERR
trap cleanup EXIT

# 在指定 rootfs 目录里执行命令，环境干净（不继承宿主的 LANG/LD_* 等）
in_root() {
	local root=$1; shift
	chroot "$root" /usr/bin/env -i \
		PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
		HOME=/root TERM=dumb LANG=C.UTF-8 DEBIAN_FRONTEND=noninteractive \
		/bin/bash -c "$*"
}
bind_mounts() {
	local root=$1
	mount --bind /dev  "$root/dev"
	# /dev/pts 是独立挂载点，bind /dev 不会带进来；缺了它 apt 会刷
	# "Can not write log (Is /dev/pts mounted?)"
	mkdir -p "$root/dev/pts"
	mount -t devpts devpts "$root/dev/pts"
	mount --bind /proc "$root/proc"
	mount --bind /sys  "$root/sys"
}
unbind_mounts() {
	local root=$1
	umount -R "$root/dev"
	umount -R "$root/proc"
	umount -R "$root/sys"
}

########## 0. 前置检查 ##########
stage "0/9 前置检查"
[ "$(id -u)" -eq 0 ] || die "请用 root 执行"
. /etc/os-release
[ "${VERSION_CODENAME:-}" = "trixie" ] || die "构建机需为 Debian 13 (trixie)，当前：${PRETTY_NAME:-unknown}"
mkdir -p "$BASE" "$INST"
exec > >(tee -a "$LOG") 2>&1

FREE_GB=$(df -BG --output=avail "$BASE" | tail -1 | tr -dc '0-9')
[ "${FREE_GB:-0}" -ge "$MIN_FREE_GB" ] || die "$BASE 所在分区剩余 ${FREE_GB}G，至少需要 ${MIN_FREE_GB}G"
echo "工作目录 $BASE，剩余空间 ${FREE_GB}G"

########## 1. 构建工具 ##########
stage "1/9 安装构建工具"
apt-get update -qq
apt-get install -y --no-install-recommends \
	mmdebstrap debootstrap systemd-container busybox-static cpio gzip xz-utils \
	xorriso mtools grub-pc-bin grub-efi-amd64-bin qemu-utils kpartx parted \
	dosfstools e2fsprogs ovmf ca-certificates wget

########## 2. 生成 rootfs ##########
stage "2/9 生成 Debian rootfs（mmdebstrap $SUITE minbase）"
rm -rf "$ROOTFS"; mkdir -p "$ROOTFS"
mmdebstrap --variant=minbase "$SUITE" "$ROOTFS" "$MIRROR"

########## 3. 配置源 + 安装系统组件 ##########
stage "3/9 配置 apt 源并安装内核/系统组件"
cat > "$ROOTFS/etc/apt/sources.list" <<EOF
deb $MIRROR $SUITE main contrib non-free-firmware
deb $SEC_MIRROR $SUITE-security main contrib non-free-firmware
deb $MIRROR $SUITE-updates main contrib non-free-firmware
EOF
cp -L /etc/resolv.conf "$ROOTFS/etc/resolv.conf"
bind_mounts "$ROOTFS"

in_root "$ROOTFS" '
set -e
apt update
apt upgrade -y
apt install -y linux-image-amd64 systemd systemd-sysv
apt install -y network-manager firmware-realtek firmware-misc-nonfree
apt install -y openssh-server iputils-ping iproute2
apt install -y sudo vim nano curl wget ca-certificates
apt install -y qemu-guest-agent
'
unbind_mounts "$ROOTFS"

# 内核版本从 rootfs 自动探测，避免教程里写死 6.12.113+deb13-amd64 的问题
KVER=$(basename "$(ls -1 "$ROOTFS"/boot/vmlinuz-* | head -n1)" | sed 's/^vmlinuz-//')
[ -n "$KVER" ] || die "rootfs 里没找到内核（/boot/vmlinuz-*）"
echo "检测到内核版本：$KVER"

########## 4. Cage 桌面 + thinos-client ##########
stage "4/9 安装 cage 桌面环境与 thinos-client"
bind_mounts "$ROOTFS"
in_root "$ROOTFS" '
set -e
apt install -y seatd cage
apt install -y libqt6widgets6 libqt6gui6 libqt6core6
apt install -y pipewire pipewire-pulse wireplumber
apt install -y fonts-noto fonts-noto-cjk fonts-noto-color-emoji
apt install -y libcjson1 wayvnc
'

# thinos-client：本地优先，缺失则下载，仍失败即中止
CLIENT_DEB=$BASE/thinos_client_amd64.deb
if [ ! -f "$CLIENT_DEB" ]; then
	echo "本地无 $CLIENT_DEB，尝试下载 $CLIENT_DEB_URL"
	wget -O "$CLIENT_DEB" "$CLIENT_DEB_URL" || die "thinos-client 下载失败且本地无 deb，请手动放到 $CLIENT_DEB 后重跑"
fi
cp "$CLIENT_DEB" "$ROOTFS/tmp/thinos_client_amd64.deb"
in_root "$ROOTFS" 'set -e; apt install -y /tmp/thinos_client_amd64.deb; rm -f /tmp/thinos_client_amd64.deb'
unbind_mounts "$ROOTFS"

########## 5. 用户 / 自动登录 / 自启服务 / 系统设置 ##########
stage "5/9 配置用户、自动登录、cage+wayvnc 自启"
bind_mounts "$ROOTFS"
in_root "$ROOTFS" "
set -e
# 主机名 / 时区 / 语言
echo '$HOSTNAME' > /etc/hostname
grep -q '127.0.1.1' /etc/hosts || echo '127.0.1.1 $HOSTNAME' >> /etc/hosts
ln -sf /usr/share/zoneinfo/$TIMEZONE /etc/localtime
echo '$TIMEZONE' > /etc/timezone
echo 'LANG=C.UTF-8' > /etc/locale.conf

# 专用用户
id -u $USER_NAME >/dev/null 2>&1 || useradd -m -s /bin/bash $USER_NAME
echo '$USER_NAME:$USER_PASSWORD' | chpasswd
usermod -aG video,input,render,plugdev $USER_NAME || true

# seatd 开机自启（chroot 内没有 systemd，--now 不可用）
systemctl enable seatd

# tty1 自动登录
mkdir -p /etc/systemd/system/getty@tty1.service.d
printf '[Service]\nExecStart=\nExecStart=-/sbin/agetty --autologin $USER_NAME --noclear %%I \$TERM\n' \
	> /etc/systemd/system/getty@tty1.service.d/autologin.conf

# root 密码
echo 'root:$ROOT_PASSWORD' | chpasswd
"
unbind_mounts "$ROOTFS"

# 用户级服务：chroot 里没有 user manager，直接落文件 + default.target.wants 符号链接
UHOME=$ROOTFS/home/$USER_NAME
mkdir -p "$UHOME/.local/bin" "$UHOME/.config/systemd/user/default.target.wants"
cat > "$UHOME/.local/bin/start-vdi.sh" <<'EOF'
#!/bin/bash

unset WAYLAND_DISPLAY
unset DISPLAY

export QT_QPA_PLATFORM=wayland
export QT_WAYLAND_DISABLE_WINDOWDECORATION=1

exec cage -- /usr/bin/vdi-client
EOF
chmod +x "$UHOME/.local/bin/start-vdi.sh"

cat > "$UHOME/.config/systemd/user/vdi.service" <<'EOF'
[Unit]
Description=VDI Thin Client

After=graphical-session.target


[Service]

Environment=XDG_RUNTIME_DIR=/run/user/%U

ExecStart=%h/.local/bin/start-vdi.sh

Restart=always

RestartSec=3


[Install]

WantedBy=default.target
EOF

cat > "$UHOME/.config/systemd/user/wayvnc.service" <<'EOF'
[Unit]
Description=WayVNC Remote Desktop Server
After=vdi.service
Wants=vdi.service

[Service]
Type=simple
Environment=XDG_RUNTIME_DIR=/run/user/%U
Environment=WAYLAND_DISPLAY=wayland-0
ExecStart=/usr/bin/wayvnc 0.0.0.0 5900
Restart=always
RestartSec=3

[Install]
WantedBy=default.target
EOF

ln -sf ../vdi.service    "$UHOME/.config/systemd/user/default.target.wants/vdi.service"
if [ "$ENABLE_WAYVNC" = "1" ]; then
	ln -sf ../wayvnc.service "$UHOME/.config/systemd/user/default.target.wants/wayvnc.service"
	echo "wayvnc：已设为开机自启"
else
	# 只保留 unit 文件，不建 default.target.wants 链接；需要时可在系统内启用
	echo "wayvnc：unit 已安装但未启用（ENABLE_WAYVNC=0）"
fi
# 让 $USER_NAME 的用户服务在未登录时也由 systemd 拉起
mkdir -p "$ROOTFS/var/lib/systemd/linger"
touch "$ROOTFS/var/lib/systemd/linger/$USER_NAME"

UID_N=$(grep -m1 "^$USER_NAME:" "$ROOTFS/etc/passwd" | cut -d: -f3)
GID_N=$(grep -m1 "^$USER_NAME:" "$ROOTFS/etc/passwd" | cut -d: -f4)
chown -R "$UID_N:$GID_N" "$UHOME"

########## 6. 打包 rootfs ##########
stage "6/9 打包 rootfs"
# 不要把构建机的 DNS 带进镜像（开机由 NetworkManager 重写）
: > "$ROOTFS/etc/resolv.conf"
rm -f "$TARBALL"
tar czf "$TARBALL" -C "$BASE" rootfs
ls -lh "$TARBALL"

########## 7. 生成磁盘镜像 + 分区 ##########
stage "7/9 创建磁盘镜像并分区"
rm -f "$IMG"
qemu-img create -f raw "$IMG" "$IMG_SIZE"
parted -s "$IMG" mklabel gpt
parted -s "$IMG" mkpart primary fat32 1MiB $((1 + ESP_MB))MiB
parted -s "$IMG" set 1 esp on
parted -s "$IMG" mkpart primary ext4 $((1 + ESP_MB))MiB 5185MiB
parted -s "$IMG" mkpart bios_grub 5185MiB 5187MiB
parted -s "$IMG" set 3 bios_grub on
parted -s "$IMG" unit MiB print

########## 8. 写入系统 + 双引导 ##########
stage "8/9 格式化、写入 rootfs、安装 GRUB 双引导"
LOOP=$(losetup -Pf --show "$IMG")
echo "loop 设备：$LOOP"
udevadm settle 2>/dev/null || sleep 1
P1=${LOOP}p1
P2=${LOOP}p2
[ -b "$P1" ] && [ -b "$P2" ] || die "分区设备 $P1 / $P2 未生成，请检查 loop 驱动与 udev"

# 常见阻碍：容器/沙箱禁止写块设备分区，这里给出明确提示
mkfs.vfat "$P1" || die "无法格式化 $P1：当前环境禁止写块设备分区（容器/沙箱），请在普通 Debian 13 构建机执行"
mkfs.ext4 -F "$P2" || die "无法格式化 $P2：当前环境禁止写块设备分区（容器/沙箱），请在普通 Debian 13 构建机执行"

mkdir -p "$MNT"
mount "$P2" "$MNT"
mkdir -p "$MNT/boot/efi"
mount "$P1" "$MNT/boot/efi"
tar xzf "$TARBALL" -C "$MNT" --strip-components=1

bind_mounts "$MNT"
cp -L /etc/resolv.conf "$MNT/etc/resolv.conf"

in_root "$MNT" "
set -e
export LANG=C.UTF-8
echo 'LANG=C.UTF-8' > /etc/locale.conf

# UEFI 引导
apt install -y grub-efi-amd64 shim-signed
grub-install --target=x86_64-efi --efi-directory=/boot/efi --removable

# BIOS 引导（与 UEFI 组成双引导）
apt install -y grub-pc-bin
grub-install --target=i386-pc $LOOP
LANG=C update-grub

# fstab
U1=\$(blkid -s UUID -o value $P1)
U2=\$(blkid -s UUID -o value $P2)
{
	echo \"UUID=\$U2  /          ext4   defaults   0 1\"
	echo \"UUID=\$U1  /boot/efi  vfat   defaults   0 2\"
} > /etc/fstab
cat /etc/fstab

# 网络 / ssh / grub 等待时间
systemctl enable NetworkManager
sed -i 's/^#*PermitRootLogin .*/PermitRootLogin yes/' /etc/ssh/sshd_config
systemctl enable ssh
sed -i 's/^GRUB_TIMEOUT=.*/GRUB_TIMEOUT=0/' /etc/default/grub
LANG=C update-grub
"
unbind_mounts "$MNT"
# 同上：清掉构建机 DNS，避免固化进最终镜像
: > "$MNT/etc/resolv.conf"
umount "$MNT/boot/efi"
umount "$MNT"
losetup -d "$LOOP"
LOOP=""

########## 9. 安装器 ISO ##########
stage "9/9 制作安装器 ISO"
# 生成 installer/init（内核版本注入）
cat > "$INST/init" <<'INIT_EOF'
#!/bin/busybox sh
#
# Debian 13 disk-clone installer
# Runs as /init inside a custom busybox initramfs.
# Flow: load storage modules -> mount install ISO -> list target disks ->
#       confirm -> dd image -> verify -> reboot
#

export PATH=/bin:/sbin
KVER=__KVER__
MODDIR=/lib/modules/$KVER
IMG=/installer/debian13.img.gz
IMGSIZE=/installer/debian13.img.size
MOUNTED=/media

is_disk() {
	case "$1" in
		sd*|vd*|hd*|nvme*|mmcblk*|xvd*) return 0 ;;
		*) return 1 ;;
	esac
}

has_iso_sig() {
	dd if="$1" bs=1 skip=32769 count=5 2>/dev/null | grep -q CD001
}

fmt_size() {
	mb=$(( $1 / 1048576 ))
	gx=$(( mb * 10 / 1024 ))
	echo "$(( gx / 10 )).$(( gx % 10 )) GiB"
}

mount -t proc     proc     /proc 2>/dev/null
mount -t sysfs    sysfs    /sys  2>/dev/null
mount -t devtmpfs devtmpfs /dev  2>/dev/null
[ -c /dev/console ] || mknod /dev/console c 5 1 2>/dev/null
[ -c /dev/null ]    || mknod /dev/null    c 1 3 2>/dev/null

clear 2>/dev/null

echo "Loading storage drivers ..."
MODULES="usb-common usbcore xhci-hcd xhci-pci ehci-hcd ehci-pci ohci-hcd ohci-pci uhci-hcd
scsi_common scsi_mod cdrom sr_mod sd_mod
libata libahci ahci
ata_piix ata_generic pata_atiixp pata_amd pata_via pata_sis pata_jmicron pata_marvell
pata_sil680 pata_serverworks pata_oldpiix pata_efar pata_cmd64x pata_sch pata_rdc
sata_nv sata_sil sata_sil24 sata_via sata_sis sata_svw sata_promise sata_mv
nvme-core nvme
virtio_blk virtio_scsi vmw_pvscsi
mptbase mptscsih mptsas mptspi mpt3sas megaraid_sas aacraid hpsa smartpqi
usb-storage uas
mmc_core mmc_block
sdhci sdhci-pci sdhci-acpi
mmc_core sdhci sdhci-pci mmc_block
hid hid-generic usbhid
isofs"
pass=0
while [ $pass -lt 3 ]; do
	for m in $MODULES; do
		[ -f "$MODDIR/$m.ko" ] && insmod "$MODDIR/$m.ko" 2>/dev/null
	done
	pass=$(( pass + 1 ))
done
echo "done."
echo

# ---- locate the install medium (the ISO we booted from) ----
# USB and optical drives can take a couple of seconds to enumerate, so poll
# for the medium instead of assuming it is already there.
MEDIA=""
tries=0
printf "Looking for the install medium"
while [ -z "$MEDIA" ] && [ "$tries" -lt 30 ]; do
	for d in /sys/block/*; do
		name=${d##*/}
		case "$name" in
			loop*|ram*|zram*|dm-*|md*) continue ;;
		esac
		[ -b "/dev/$name" ] || continue
		if has_iso_sig "/dev/$name"; then
			MEDIA=$name
			break
		fi
	done
	[ -n "$MEDIA" ] && break
	tries=$(( tries + 1 ))
	printf "."
	sleep 1
done
printf "\n"

if [ -z "$MEDIA" ]; then
	echo "ERROR: install medium (ISO9660) not found on any disk."
	echo "Block devices seen: $(ls /sys/block 2>/dev/null | tr '\n' ' ')"
	echo "PCI devices seen (vendor:device class):"
	for p in /sys/bus/pci/devices/*; do
		[ -d "$p" ] || continue
		id=$(sed -n 's/^PCI_ID=//p' "$p/uevent" 2>/dev/null)
		[ -n "$id" ] && echo "  $id $(cat "$p/class" 2>/dev/null)"
	done
	echo "Dropping to a shell. Type 'reboot -f' to restart."
	exec sh
fi

mkdir -p $MOUNTED
if ! mount -t iso9660 -o ro "/dev/$MEDIA" $MOUNTED; then
	echo "ERROR: cannot mount /dev/$MEDIA as iso9660. Dropping to a shell."
	exec sh
fi
if [ ! -f "$MOUNTED$IMG" ] || [ ! -f "$MOUNTED$IMGSIZE" ]; then
	echo "ERROR: image $IMG not found on /dev/$MEDIA. Dropping to a shell."
	exec sh
fi
echo "Install medium: /dev/$MEDIA (mounted on $MOUNTED)"

IMG_BYTES=$(cat "$MOUNTED$IMGSIZE" 2>/dev/null)
case "$IMG_BYTES" in
	''|*[!0-9]*)
		echo "ERROR: cannot read image size. Dropping to a shell."
		exec sh
		;;
esac
IMG_MB=$(( (IMG_BYTES + 1048575) / 1048576 ))

# ---- collect candidate target disks ----
LIST=/tmp/targets
: > $LIST
for d in /sys/block/*; do
	name=${d##*/}
	is_disk "$name" || continue
	[ "$name" = "$MEDIA" ] && continue
	[ -b "/dev/$name" ] || continue
	secs=$(cat "$d/size" 2>/dev/null)
	[ -n "$secs" ] || continue
	bytes=$(( secs * 512 ))
	[ "$bytes" -lt "$IMG_BYTES" ] && continue
	model=$(cat "$d/device/model" 2>/dev/null | tr -s ' \n' ' ')
	if [ -z "$model" ]; then
		model=$(cat "$d/device/vendor" 2>/dev/null | tr -s ' \n' ' ')
	fi
	[ -n "$model" ] || model="unknown device"
	[ "$(cat "$d/removable" 2>/dev/null)" = "1" ] && model="$model [removable]"
	echo "$name|$(fmt_size $bytes)|$model" >> $LIST
done
COUNT=$(wc -l < $LIST)

if [ "$COUNT" -eq 0 ]; then
	echo "ERROR: no target disk large enough (>= ${IMG_MB} MiB)."
	echo "Dropping to a shell. Type 'reboot -f' to restart."
	exec sh
fi

# ---- menu, selection, confirmation ----
while :; do
	echo
	echo "=================================================="
	echo " Debian 13 installer    image size: ${IMG_MB} MiB"
	echo "=================================================="
	echo
	echo " Available target disks:"
	i=0
	while IFS='|' read -r name size model; do
		i=$(( i + 1 ))
		printf "  %2d)  /dev/%-9s %-9s %s\n" "$i" "$name" "$size" "$model"
	done < $LIST
	echo
	printf " Select target disk [1-%d] (s = shell, q = reboot): " "$COUNT"
	read -r ans

	case "$ans" in
		s|S) exec sh ;;
		q|Q) reboot -f ;;
	esac

	SEL=""
	case "$ans" in
		''|*[!0-9]*) ;;
		*)
			if [ "$ans" -ge 1 ] && [ "$ans" -le "$COUNT" ]; then
				SEL=$(sed -n "${ans}p" $LIST)
			fi
			;;
	esac
	if [ -z "$SEL" ]; then
		echo " Invalid selection."
		sleep 2
		continue
	fi

	TARGET_NAME=$(echo "$SEL" | cut -d'|' -f1)
	TARGET_SIZE=$(echo "$SEL" | cut -d'|' -f2)
	TARGET_MODEL=$(echo "$SEL" | cut -d'|' -f3)

	echo
	echo "  Target : /dev/$TARGET_NAME  ($TARGET_SIZE, $TARGET_MODEL)"
	echo "  WARNING: ALL DATA ON THIS DISK WILL BE ERASED."
	echo
	printf "  Press Enter to start, or type 'n' to go back: "
	read -r c
	[ -z "$c" ] && break
	echo "  Cancelled. Back to the disk list."
	sleep 1
done

# ---- write the image (decompress the gzip stream straight to the disk) ----
echo
echo " Writing image to /dev/$TARGET_NAME (decompressing) ..."
gunzip -c "$MOUNTED$IMG" | dd of="/dev/$TARGET_NAME" bs=4M iflag=fullblock 2>/dev/null &
PIPE_PID=$!
while kill -0 "$PIPE_PID" 2>/dev/null; do
	w=$(sed -n 's/^wchar:[ \t]*//p' /proc/$PIPE_PID/io 2>/dev/null)
	if [ -n "$w" ]; then
		printf "\r  %3d%%  (%d/%d MiB)" "$(( w * 100 / IMG_BYTES ))" "$(( w / 1048576 ))" "$IMG_MB"
	else
		printf "."
	fi
	sleep 1
done
wait "$PIPE_PID"
printf "\r   100%%  (%d/%d MiB)\n" "$IMG_MB" "$IMG_MB"
sync

if dd if="/dev/$TARGET_NAME" bs=512 count=1 2>/dev/null | grep -q GRUB; then
	echo " Verify: bootloader present in MBR - OK."
else
	echo " WARNING: no bootloader signature found in target MBR."
fi

umount $MOUNTED 2>/dev/null
echo
echo " Done. Remove the USB stick, then press Enter to reboot."
read -r _
reboot -f
INIT_EOF
sed -i "s/__KVER__/$KVER/" "$INST/init"
chmod 755 "$INST/init"
sh -n "$INST/init" || die "installer/init 语法校验失败"

# busybox initramfs
log "组装 initramfs"
BUSYBOX=$(command -v busybox)
rm -rf "$INST/initramfs"
mkdir -p "$INST/initramfs"/{bin,dev,proc,sys,tmp,media} "$INST/initramfs/lib/modules/$KVER"
cp "$INST/init" "$INST/initramfs/init"
chmod 755 "$INST/initramfs/init"
cp "$BUSYBOX" "$INST/initramfs/bin/busybox"
chmod 755 "$INST/initramfs/bin/busybox"
for a in $("$BUSYBOX" --list); do
	[ "$a" = "busybox" ] && continue
	ln -sf busybox "$INST/initramfs/bin/$a"
done

MODULES="usb-common usbcore xhci-hcd xhci-pci ehci-hcd ehci-pci ohci-hcd ohci-pci uhci-hcd
scsi_common scsi_mod cdrom sr_mod sd_mod
libata libahci ahci
ata_piix ata_generic pata_atiixp pata_amd pata_via pata_sis pata_jmicron pata_marvell
pata_sil680 pata_serverworks pata_oldpiix pata_efar pata_cmd64x pata_sch pata_rdc
sata_nv sata_sil sata_sil24 sata_via sata_sis sata_svw sata_promise sata_mv
nvme-core nvme
virtio_blk virtio_scsi vmw_pvscsi
mptbase mptscsih mptsas mptspi mpt3sas megaraid_sas aacraid hpsa smartpqi
usb-storage uas
mmc_core mmc_block
sdhci sdhci-pci sdhci-acpi
hid hid-generic usbhid
isofs"
MODSRC=$ROOTFS/lib/modules/$KVER/kernel
for m in $MODULES; do
	f=$(find "$MODSRC" -name "$m.ko.xz" | head -n1)
	if [ -n "$f" ]; then
		xz -dc "$f" > "$INST/initramfs/lib/modules/$KVER/$m.ko"
	else
		echo "WARN: 未找到模块 $m"
	fi
done

(cd "$INST/initramfs" && find . | "$BUSYBOX" cpio -o -H newc 2>/dev/null | gzip -9) > "$INST/initrd.img"
ls -lh "$INST/initrd.img"

# ISO 目录
rm -rf "$INST/iso-root"
mkdir -p "$INST/iso-root/boot/grub" "$INST/iso-root/installer"
cp "$ROOTFS/boot/vmlinuz-$KVER" "$INST/iso-root/boot/vmlinuz"
cp "$INST/initrd.img" "$INST/iso-root/boot/initrd.img"
log "压缩磁盘镜像（gzip -6，耗时较久）"
gzip -6 -c "$IMG" > "$INST/iso-root/installer/debian13.img.gz"
stat -c %s "$IMG" > "$INST/iso-root/installer/debian13.img.size"
cat > "$INST/iso-root/boot/grub/grub.cfg" <<'EOF'
set timeout=0
set default=0

menuentry "Install Debian 13 (clone image to disk)" {
	linux  /boot/vmlinuz quiet loglevel=4
	initrd /boot/initrd.img
}
EOF
grub-mkrescue -o "$INST/thinos.iso" -V "DEBIAN13-INSTALLER" "$INST/iso-root"
ls -lh "$INST/thinos.iso"

########## 校验与收尾 ##########
stage "校验产物"
[ -f "$IMG" ] || die "镜像不存在"
if dd if="$IMG" bs=512 count=1 2>/dev/null | grep -q GRUB; then
	echo "OK  MBR 含 GRUB 引导代码"
else
	echo "WARN MBR 未发现 GRUB 签名"
fi
for off in 1048576 $(( (1 + ESP_MB) * 1048576 )); do
	blkid -p -O "$off" "$IMG" || echo "WARN 偏移 $off 未识别文件系统"
done

if [ "$KEEP_ROOTFS" = "0" ]; then
	rm -rf "$ROOTFS" "$TARBALL"
	echo "已删除 rootfs 目录与 tar 包（KEEP_ROOTFS=0）"
fi

printf '\n========== 构建完成 ==========\n'
ls -lh "$IMG" "$INST/thinos.iso"
printf '内核版本 : %s\n' "$KVER"
printf 'wayvnc   : %s\n' "$([ "$ENABLE_WAYVNC" = "1" ] && echo '默认开机自启' || echo '默认未启用')"
printf '队列镜像 : %s\n' "$IMG"
printf '安装器   : %s\n' "$INST/thinos.iso"
printf '日志     : %s\n' "$LOG"
printf '刷写示例 : dd if=%s of=/dev/sdX bs=4M status=progress conv=fsync\n' "$INST/thinos.iso"
if [ "$ENABLE_WAYVNC" != "1" ]; then
	printf '\n以后要开启 wayvnc，在目标机上用 root 执行（二选一）：\n'
	printf "  machinectl shell %s@ /bin/bash -c 'systemctl --user enable --now wayvnc.service'\n" "$USER_NAME"
	printf "  su - %s -c 'XDG_RUNTIME_DIR=/run/user/\$(id -u) systemctl --user enable --now wayvnc.service'\n" "$USER_NAME"
	printf '关闭：把上面的 enable 换成 disable --now\n'
fi
```

### 二、构建 thinos 镜像

```shell
bash build-thinos.sh
```

构建成功示例

```shell
========== 构建完成 ==========
-rw-r--r-- 1 root root 5.1G Oct 24 12:28 /root/thinos-build/debian13.img
-rw-r--r-- 1 root root 1.3G Oct 24 12:30 /root/thinos-build/installer/thinos.iso
内核版本 : 6.12.113+deb13-amd64
wayvnc   : 默认未启用
队列镜像 : /root/thinos-build/debian13.img
安装器   : /root/thinos-build/installer/thinos.iso
日志     : /root/thinos-build/build.log
刷写示例 : dd if=/root/thinos-build/installer/thinos.iso of=/dev/sdX bs=4M status=progress conv=fsync

以后要开启 wayvnc，在目标机上用 root 执行（二选一）：
  machinectl shell kk@ /bin/bash -c 'systemctl --user enable --now wayvnc.service'
  su - kk -c 'XDG_RUNTIME_DIR=/run/user/$(id -u) systemctl --user enable --now wayvnc.service'
关闭：把上面的 enable 换成 disable --now
root@debian:~# cd thinos-build/
```

### 三、config调整

可以在脚本里配置 root 和 kk 用户密码， wayvnc 是否启用
